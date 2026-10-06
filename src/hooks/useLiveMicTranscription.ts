import { useState, useEffect, useRef, useCallback } from 'react';

interface UseLiveMicTranscriptionProps {
  isLive: boolean;
  onTranscriptChunk: (text: string, isFinal: boolean) => void;
  selectedMic?: string;
}

type RecognitionState = 'IDLE' | 'STARTING' | 'LISTENING' | 'RESTARTING' | 'ERROR';

export function useLiveMicTranscription({
  isLive,
  onTranscriptChunk,
  selectedMic,
}: UseLiveMicTranscriptionProps) {
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);
  const [audioLevel, setAudioLevel] = useState<number>(0);
  const [micStatus, setMicStatus] = useState<'idle' | 'listening' | 'error' | 'unsupported'>('idle');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const onTranscriptChunkRef = useRef(onTranscriptChunk);
  onTranscriptChunkRef.current = onTranscriptChunk;

  // Recognition state machine refs
  const stateRef = useRef<RecognitionState>('IDLE');
  const recognitionRef = useRef<any>(null);
  const restartTimerRef = useRef<number | null>(null);
  const silenceWatchdogRef = useRef<number | null>(null);
  const lastActiveTimestampRef = useRef<number>(Date.now());

  // Web Audio persistent stream refs
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const animFrameRef = useRef<number | null>(null);
  const isLiveRef = useRef<boolean>(isLive);

  isLiveRef.current = isLive;

  // Clean shutdown of all recognition and audio resources
  const stopListening = useCallback(() => {
    stateRef.current = 'IDLE';

    if (restartTimerRef.current) {
      window.clearTimeout(restartTimerRef.current);
      restartTimerRef.current = null;
    }

    if (silenceWatchdogRef.current) {
      window.clearInterval(silenceWatchdogRef.current);
      silenceWatchdogRef.current = null;
    }

    if (recognitionRef.current) {
      try {
        recognitionRef.current.onstart = null;
        recognitionRef.current.onend = null;
        recognitionRef.current.onerror = null;
        recognitionRef.current.onresult = null;
        recognitionRef.current.onspeechstart = null;
        recognitionRef.current.onspeechend = null;
        recognitionRef.current.stop();
      } catch {
        // ignore already stopped exceptions
      }
      recognitionRef.current = null;
    }

    if (animFrameRef.current) {
      cancelAnimationFrame(animFrameRef.current);
      animFrameRef.current = null;
    }

    if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
      try {
        audioContextRef.current.close();
      } catch {
        // ignore
      }
      audioContextRef.current = null;
    }

    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach((track) => track.stop());
      mediaStreamRef.current = null;
    }

    setIsSpeaking(false);
    setAudioLevel(0);
    setMicStatus('idle');
  }, []);

  useEffect(() => {
    if (!isLive) {
      stopListening();
      return;
    }

    let isMounted = true;

    async function startPipeline() {
      setErrorMessage(null);
      setMicStatus('listening');
      lastActiveTimestampRef.current = Date.now();

      // 1. Explicit Microphone Permission & Stream Verification
      try {
        // Query permissions API if supported
        if (navigator.permissions && navigator.permissions.query) {
          try {
            const permissionStatus = await navigator.permissions.query({
              name: 'microphone' as PermissionName,
            });

            if (permissionStatus.state === 'denied') {
              if (isMounted) {
                setErrorMessage(
                  'Microphone permission is blocked. Please allow microphone access in your browser settings.'
                );
                setMicStatus('error');
              }
              return;
            }
          } catch {
            // permissions.query for microphone is optional/not universally supported
          }
        }

        if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
          let audioConstraints: MediaTrackConstraints = {
            echoCancellation: true,
            noiseSuppression: true,
            autoGainControl: true,
          };

          // Resolve hardware deviceId if selected
          if (selectedMic && navigator.mediaDevices.enumerateDevices) {
            try {
              const devices = await navigator.mediaDevices.enumerateDevices();
              const matched = devices.find(
                (d) =>
                  d.kind === 'audioinput' &&
                  d.label &&
                  d.label.toLowerCase() === selectedMic.toLowerCase()
              );
              if (matched && matched.deviceId) {
                audioConstraints.deviceId = { exact: matched.deviceId };
              }
            } catch {
              // ignore device enumeration errors
            }
          }

          const stream = await navigator.mediaDevices.getUserMedia({
            audio: audioConstraints,
          });

          if (!isMounted || !isLiveRef.current) {
            stream.getTracks().forEach((track) => track.stop());
            return;
          }

          mediaStreamRef.current = stream;

          // Initialize Web Audio Analyser (Remains active throughout all pauses)
          const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
          if (AudioCtx) {
            const ctx = new AudioCtx();
            audioContextRef.current = ctx;
            const source = ctx.createMediaStreamSource(stream);
            const analyser = ctx.createAnalyser();
            analyser.fftSize = 256;
            analyser.smoothingTimeConstant = 0.4;
            source.connect(analyser);
            analyserRef.current = analyser;

            const dataArray = new Uint8Array(analyser.frequencyBinCount);

            const sampleAudioLevel = () => {
              if (!analyserRef.current || !isLiveRef.current) return;
              analyserRef.current.getByteFrequencyData(dataArray);

              let sum = 0;
              for (let i = 0; i < dataArray.length; i++) {
                sum += dataArray[i];
              }
              const avg = sum / dataArray.length;
              const normalized = Math.min(100, Math.round((avg / 128) * 100));

              setAudioLevel(normalized);
              const currentlySpeaking = normalized > 14;
              setIsSpeaking(currentlySpeaking);

              if (currentlySpeaking) {
                lastActiveTimestampRef.current = Date.now();
              }

              animFrameRef.current = requestAnimationFrame(sampleAudioLevel);
            };

            sampleAudioLevel();
          }
        }
      } catch (err: any) {
        console.warn('Microphone hardware acquisition error:', err);
        if (
          err.name === 'NotAllowedError' ||
          err.name === 'PermissionDeniedError' ||
          err.name === 'SecurityError'
        ) {
          if (isMounted) {
            setErrorMessage(
              'Microphone access denied. Please allow microphone permissions in the browser address bar.'
            );
            setMicStatus('error');
          }
          return;
        }
      }

      // 2. Robust SpeechRecognition State Machine
      const SpeechRecognition =
        (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

      if (!SpeechRecognition) {
        if (isMounted) setMicStatus('unsupported');
        return;
      }

      const launchRecognition = () => {
        if (!isMounted || !isLiveRef.current) return;
        // Avoid race conditions: only start if IDLE, RESTARTING, or recovering
        if (stateRef.current === 'LISTENING' || stateRef.current === 'STARTING') return;

        stateRef.current = 'STARTING';

        try {
          if (recognitionRef.current) {
            try {
              recognitionRef.current.onstart = null;
              recognitionRef.current.onend = null;
              recognitionRef.current.onerror = null;
              recognitionRef.current.onresult = null;
              recognitionRef.current.stop();
            } catch {
              // ignore
            }
            recognitionRef.current = null;
          }

          const recognition = new SpeechRecognition();
          recognition.continuous = true;
          recognition.interimResults = true;
          recognition.lang = 'en-US';
          recognition.maxAlternatives = 1;

          // Handler: ONSTART -> Transition to LISTENING
          recognition.onstart = () => {
            stateRef.current = 'LISTENING';
            lastActiveTimestampRef.current = Date.now();
            if (isMounted) {
              setMicStatus('listening');
              setErrorMessage(null);
            }
          };

          // Handler: ONRESULT -> Process transcript chunks and reset silence timestamp
          recognition.onresult = (event: any) => {
            lastActiveTimestampRef.current = Date.now();
            let interimTranscript = '';
            let finalTranscript = '';

            for (let i = event.resultIndex; i < event.results.length; ++i) {
              const transcript = event.results[i][0].transcript;
              if (event.results[i].isFinal) {
                finalTranscript += transcript;
              } else {
                interimTranscript += transcript;
              }
            }

            if (finalTranscript.trim()) {
              onTranscriptChunkRef.current(finalTranscript.trim(), true);
            } else if (interimTranscript.trim()) {
              onTranscriptChunkRef.current(interimTranscript.trim(), false);
            }
          };

          // Handler: ONERROR -> Differentiate between normal pause events and terminal errors
          recognition.onerror = (event: any) => {
            // "no-speech" and "aborted" are normal pause conditions during silence — ignore gracefully
            if (event.error === 'no-speech' || event.error === 'aborted') {
              return;
            }

            if (event.error === 'not-allowed' || event.error === 'service-not-allowed') {
              stateRef.current = 'ERROR';
              if (isMounted) {
                setErrorMessage('Microphone access blocked. Please enable microphone permissions in browser.');
                setMicStatus('error');
              }
            } else if (event.error === 'audio-capture') {
              stateRef.current = 'ERROR';
              if (isMounted) {
                setErrorMessage('Microphone capture error. Please check your audio input device.');
                setMicStatus('error');
              }
            } else {
              console.warn('SpeechRecognition non-fatal notice:', event.error);
            }
          };

          // Handler: ONEND -> Controlled debounced restart to avoid race conditions
          recognition.onend = () => {
            const prevState = stateRef.current;
            stateRef.current = 'IDLE';

            // If session is still Live and not in terminal ERROR state, re-arm seamlessly
            if (isLiveRef.current && isMounted && prevState !== 'ERROR') {
              stateRef.current = 'RESTARTING';
              if (restartTimerRef.current) window.clearTimeout(restartTimerRef.current);
              restartTimerRef.current = window.setTimeout(() => {
                if (isLiveRef.current && isMounted && stateRef.current !== 'LISTENING') {
                  launchRecognition();
                }
              }, 180);
            }
          };

          recognition.start();
          recognitionRef.current = recognition;
        } catch (err) {
          console.warn('SpeechRecognition launch exception:', err);
          stateRef.current = 'IDLE';
          if (isLiveRef.current && isMounted) {
            if (restartTimerRef.current) window.clearTimeout(restartTimerRef.current);
            restartTimerRef.current = window.setTimeout(() => {
              if (isLiveRef.current && isMounted) {
                launchRecognition();
              }
            }, 300);
          }
        }
      };

      launchRecognition();

      // 3. Extended Silence Watchdog: Ensures the recognition service never stalls during long pauses
      if (silenceWatchdogRef.current) window.clearInterval(silenceWatchdogRef.current);
      silenceWatchdogRef.current = window.setInterval(() => {
        if (!isMounted || !isLiveRef.current) return;

        // If the recognition engine dropped out or stalled during a long pause, re-arm
        if (stateRef.current === 'IDLE' || stateRef.current === 'RESTARTING') {
          launchRecognition();
        }
      }, 3000);
    }

    startPipeline();

    return () => {
      isMounted = false;
      stopListening();
    };
  }, [isLive, selectedMic, stopListening]);

  return {
    isSpeaking,
    audioLevel,
    micStatus,
    errorMessage,
  };
}
