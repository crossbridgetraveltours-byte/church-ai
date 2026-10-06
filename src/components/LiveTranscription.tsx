import React, { useEffect, useRef } from 'react';
import { Mic, Activity, AlertCircle, Volume2 } from 'lucide-react';

interface TranscriptEntry {
  id: string;
  time: string;
  text: string;
  isDetectedVerse?: boolean;
}

interface LiveTranscriptionProps {
  isLive: boolean;
  onToggleLive: () => void;
  transcripts: TranscriptEntry[];
  currentInterim?: string;
  isSpeaking?: boolean;
  audioLevel?: number;
  micStatus?: 'idle' | 'listening' | 'error' | 'unsupported';
  micError?: string | null;
}

export const LiveTranscription: React.FC<LiveTranscriptionProps> = React.memo(({
  isLive,
  onToggleLive,
  transcripts,
  currentInterim = '',
  isSpeaking = false,
  audioLevel = 0,
  micError,
}) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto scroll to bottom when new transcript lines arrive or interim updates
  useEffect(() => {
    if (scrollRef.current && isLive) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [transcripts, currentInterim, isLive]);

  return (
    <div className="h-full bg-[#0c0f17] border border-[#1b2230] rounded-xl flex flex-col p-4 overflow-hidden select-none">
      {/* Header */}
      <div className="flex items-center justify-between gap-2 pb-3 border-b border-[#18202e] shrink-0">
        <div className="flex items-center gap-2">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400">
            LIVE TRANSCRIPTION
          </h2>
          {isLive && (
            <span
              className={`flex items-center gap-1.5 text-[10px] font-mono font-bold px-2 py-0.5 rounded border transition-colors ${
                isSpeaking
                  ? 'text-emerald-400 bg-emerald-950/70 border-emerald-500/50 shadow-[0_0_8px_rgba(52,211,153,0.3)]'
                  : 'text-blue-400 bg-blue-950/60 border-blue-500/30'
              }`}
            >
              <span
                className={`w-1.5 h-1.5 rounded-full ${
                  isSpeaking
                    ? 'bg-emerald-400 animate-ping'
                    : 'bg-blue-400 animate-pulse'
                }`}
              />
              {isSpeaking ? 'SPEAKING' : 'LISTENING'}
            </span>
          )}
        </div>

        <button
          onClick={onToggleLive}
          className={`px-3 py-1 rounded-md text-xs font-bold tracking-wider transition-all duration-200 shadow-sm cursor-pointer active:scale-95 flex items-center gap-1.5 ${
            isLive
              ? 'bg-red-600 hover:bg-red-500 text-white shadow-red-600/30 ring-2 ring-red-500/50'
              : 'bg-blue-600 hover:bg-blue-500 text-white shadow-blue-600/30'
          }`}
        >
          {isLive ? (
            <>
              <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
              <span>END LIVE</span>
            </>
          ) : (
            <>
              <Mic className="w-3 h-3" />
              <span>GO LIVE</span>
            </>
          )}
        </button>
      </div>

      {/* Body Area */}
      {!isLive && transcripts.length === 0 ? (
        /* Initial Empty State (matches reference exactly) */
        <div className="flex-1 flex flex-col items-center justify-center text-center p-6">
          <p className="text-slate-400 font-medium text-base mb-1.5">
            Waiting for transcription...
          </p>
          <p className="text-slate-500 text-sm max-w-xs leading-relaxed">
            Start speaking to see live transcription
          </p>
        </div>
      ) : (
        /* Active Transcription Live Stream with Real Voice Detection */
        <div
          ref={scrollRef}
          className="flex-1 overflow-y-auto pt-3 space-y-3 pr-1 font-sans text-xs scroll-smooth"
        >
          {/* Live Mic Activity Bar */}
          <div className="p-2.5 rounded-lg bg-[#111624] border border-[#1e2638] flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 text-[11px] text-slate-300">
              {isSpeaking ? (
                <Volume2 className="w-3.5 h-3.5 text-emerald-400 animate-bounce" />
              ) : (
                <Activity className="w-3.5 h-3.5 text-blue-400" />
              )}
              <span className="truncate">
                {isSpeaking ? 'Live voice input detected' : 'Microphone active — speak scripture'}
              </span>
            </div>

            {/* Audio Level Graphic Meter */}
            <div className="flex items-center gap-0.5 h-3 shrink-0">
              {[15, 30, 50, 75, 90].map((threshold, i) => (
                <div
                  key={i}
                  className={`w-1 rounded-sm transition-all duration-75 ${
                    audioLevel >= threshold
                      ? audioLevel > 70
                        ? 'h-3 bg-red-400'
                        : audioLevel > 40
                        ? 'h-2.5 bg-amber-400'
                        : 'h-2 bg-emerald-400'
                      : 'h-1 bg-slate-800'
                  }`}
                />
              ))}
            </div>
          </div>

          {micError && (
            <div className="p-2.5 rounded-lg bg-amber-950/40 border border-amber-500/40 text-[11px] text-amber-300 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-amber-400 shrink-0" />
              <span>{micError}</span>
            </div>
          )}

          {/* Past Final Transcripts */}
          {transcripts.map((item) => (
            <div
              key={item.id}
              className={`p-2.5 rounded-lg border transition-all ${
                item.isDetectedVerse
                  ? 'bg-[#151c2e] border-blue-500/40 text-slate-100 shadow-sm'
                  : 'bg-[#0f131d] border-[#1a2130] text-slate-300'
              }`}
            >
              <div className="flex items-center justify-between text-[10px] text-slate-500 font-mono mb-1">
                <span>{item.time}</span>
                {item.isDetectedVerse && (
                  <span className="text-blue-400 font-bold uppercase tracking-wider text-[9px] bg-blue-900/30 px-1 rounded">
                    Scripture Mentioned
                  </span>
                )}
              </div>
              <p className="leading-relaxed">{item.text}</p>
            </div>
          ))}

          {/* Current Real-time Interim (In-Progress) Voice Speech */}
          {currentInterim && (
            <div className="p-2.5 rounded-lg border border-emerald-500/50 bg-[#0d1a16] text-emerald-200 shadow-[0_0_10px_rgba(16,185,129,0.15)] animate-pulse">
              <div className="flex items-center justify-between text-[10px] text-emerald-400 font-mono mb-1 font-bold">
                <span>Speaking now...</span>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
              </div>
              <p className="leading-relaxed italic">{currentInterim}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
});

LiveTranscription.displayName = 'LiveTranscription';
