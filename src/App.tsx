/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import { TopBar } from './components/TopBar';
import { LiveTranscription } from './components/LiveTranscription';
import { PresentationPreview } from './components/PresentationPreview';
import { ScriptureFeed, FeedItem } from './components/ScriptureFeed';
import { BibleSearch } from './components/BibleSearch';
import { DetectedVerses, DetectedVerseItem } from './components/DetectedVerses';
import { ParaphraseMatches } from './components/ParaphraseMatches';
import {
  BIBLE_VERSES,
  AVAILABLE_MICROPHONES,
  SermonPoint,
  ParaphraseItem,
  BibleVerse,
} from './data/bibleData';
import { FULL_CHAPTERS } from './data/bibleChapters';
import {
  detectScriptureReference,
  detectParaphraseMatch,
} from './utils/scriptureMatcher';
import { resolveScriptureSearch } from './utils/bibleResolver';
import { useLiveMicTranscription } from './hooks/useLiveMicTranscription';
import { HYMNS_AND_SONGS, LyricSection } from './data/lyricsData';

export default function App() {
  // App Mode: 'BIBLE' or 'LYRICS'
  const [appMode, setAppMode] = useState<'BIBLE' | 'LYRICS'>('BIBLE');

  // TopBar State
  const [quotaSeconds, setQuotaSeconds] = useState<number>(3600); // 1:00:00
  const [selectedMic, setSelectedMic] = useState<string>(AVAILABLE_MICROPHONES[0]);
  const [isAiActive, setIsAiActive] = useState<boolean>(true);

  // Live Transcription & Speech Recognition State
  const [isLiveActive, setIsLiveActive] = useState<boolean>(false);
  const [transcripts, setTranscripts] = useState<
    Array<{ id: string; time: string; text: string; isDetectedVerse?: boolean }>
  >([]);
  const [currentInterim, setCurrentInterim] = useState<string>('');

  // Auto Toggle
  const [autoDisplay, setAutoDisplay] = useState<boolean>(false);

  // Strict Independent Preview & Live Presentation States
  const [previewScripture, setPreviewScripture] = useState<{
    reference: string;
    translation: string;
    text: string;
  }>({
    reference: 'GENESIS 1:1',
    translation: 'KJV',
    text: 'In the beginning God created the heaven and the earth.',
  });

  const [liveScripture, setLiveScripture] = useState<{
    reference: string;
    translation: string;
    text: string;
  }>({
    reference: 'GENESIS 1:1',
    translation: 'KJV',
    text: 'In the beginning God created the heaven and the earth.',
  });

  // Scripture Feed: History & Queue
  const [historyItems, setHistoryItems] = useState<FeedItem[]>([
    {
      id: 'h1',
      reference: 'GENESIS 1:1',
      time: '17:00',
      text: 'In the beginning God created the heaven and the earth.',
      translation: 'KJV',
    },
    {
      id: 'h2',
      reference: 'JOHN 1:2',
      time: '16:59',
      text: 'The same was in the beginning with God.',
      translation: 'KJV',
    },
  ]);

  const [queueItems, setQueueItems] = useState<FeedItem[]>([
    {
      id: 'q1',
      reference: 'GENESIS 1:3',
      time: '17:05',
      text: 'And God said, Let there be light: and there was light.',
      translation: 'KJV',
    },
    {
      id: 'q2',
      reference: 'JOHN 1:1',
      time: '17:10',
      text: 'In the beginning was the Word, and the Word was with God, and the Word was God.',
      translation: 'KJV',
    },
  ]);

  // Detected Verses & Sermon Points State
  const [detectedVerses, setDetectedVerses] = useState<DetectedVerseItem[]>([]);
  const [sermonPoints, setSermonPoints] = useState<SermonPoint[]>([
    {
      id: 'sp1',
      pointNumber: 1,
      title: 'God speaks order into void and darkness',
      timestamp: '17:01',
      scriptureRef: 'GENESIS 1:1',
    },
    {
      id: 'sp2',
      pointNumber: 2,
      title: 'The Word was in the beginning with God',
      timestamp: '17:04',
      scriptureRef: 'JOHN 1:2',
    },
  ]);

  // Paraphrase Matches AI State
  const [paraphrases, setParaphrases] = useState<ParaphraseItem[]>([]);

  // Master sequence initialized with the full 31 verses of Genesis 1 for instant NEXT/PREV stepping
  const masterSequence = useRef<BibleVerse[]>(FULL_CHAPTERS['Genesis 1'] || BIBLE_VERSES);
  const [sequenceIndex, setSequenceIndex] = useState<number>(0);
  const lastAutoStagedRef = useRef<string>('');

  // Helper for HH:MM timestamp
  const getTimestamp = () => {
    const now = new Date();
    return `${now.getHours().toString().padStart(2, '0')}:${now
      .getMinutes()
      .toString()
      .padStart(2, '0')}`;
  };

  // =========================================================================
  // PRESENTATION PIPELINE:
  // TRANSCRIPTION / SEARCH / FEED -> SELECTION -> PREVIEW -> DISPLAY -> LIVE
  // =========================================================================

  const handleStageToPreview = useCallback(
    (
      verse: { reference: string; translation?: string; text: string },
      contextList?: BibleVerse[]
    ) => {
      if (contextList && contextList.length > 0) {
        masterSequence.current = contextList;
        const targetIdx = contextList.findIndex(
          (v) => v.reference.toUpperCase() === verse.reference.toUpperCase()
        );
        setSequenceIndex(targetIdx !== -1 ? targetIdx : 0);
      } else {
        // Find matching chapter in full chapters dataset to enable sequential stepping
        const chapterMatches = resolveScriptureSearch(verse.reference, 'reference');
        if (chapterMatches && chapterMatches.length > 0) {
          masterSequence.current = chapterMatches;
          const targetIdx = chapterMatches.findIndex(
            (v) => v.reference.toUpperCase() === verse.reference.toUpperCase()
          );
          setSequenceIndex(targetIdx !== -1 ? targetIdx : 0);
        }
      }

      setPreviewScripture({
        reference: verse.reference,
        translation: verse.translation || (appMode === 'LYRICS' ? 'HYMN' : 'KJV'),
        text: verse.text,
      });

      if (autoDisplay) {
        setLiveScripture({
          reference: verse.reference,
          translation: verse.translation || (appMode === 'LYRICS' ? 'HYMN' : 'KJV'),
          text: verse.text,
        });
      }
    },
    [autoDisplay, appMode]
  );

  // Switch between BIBLE and LYRICS modes with authoritative state initialization
  const handleToggleMode = useCallback(() => {
    setAppMode((prev) => {
      const nextMode = prev === 'BIBLE' ? 'LYRICS' : 'BIBLE';

      if (nextMode === 'LYRICS') {
        const firstSong = HYMNS_AND_SONGS[0];
        const firstSection = firstSong.sections[0];
        const hymnSequence: BibleVerse[] = firstSong.sections.map((sec: LyricSection) => ({
          reference: sec.reference,
          book: sec.songTitle,
          chapter: 1,
          verse: 1,
          translation: 'HYMN',
          text: sec.text,
        }));

        masterSequence.current = hymnSequence;
        setSequenceIndex(0);

        const newPreview = {
          reference: firstSection.reference,
          translation: 'HYMN',
          text: firstSection.text,
        };

        setPreviewScripture(newPreview);

        if (autoDisplay) {
          setLiveScripture(newPreview);
        }
      } else {
        const genesisChapter = FULL_CHAPTERS['Genesis 1'] || BIBLE_VERSES;
        masterSequence.current = genesisChapter;
        setSequenceIndex(0);

        const newPreview = {
          reference: 'GENESIS 1:1',
          translation: 'KJV',
          text: 'In the beginning God created the heaven and the earth.',
        };

        setPreviewScripture(newPreview);

        if (autoDisplay) {
          setLiveScripture(newPreview);
        }
      }

      return nextMode;
    });
  }, [autoDisplay]);

  // DISPLAY: Bridges PREVIEW -> LIVE
  const handleDisplay = useCallback(() => {
    if (!previewScripture.text && !previewScripture.reference) return;

    setLiveScripture({
      reference: previewScripture.reference,
      translation: previewScripture.translation || (appMode === 'LYRICS' ? 'HYMN' : 'KJV'),
      text: previewScripture.text,
    });

    setHistoryItems((prev) => {
      const isTopDuplicate =
        prev.length > 0 &&
        prev[0].reference.toUpperCase() === previewScripture.reference.toUpperCase();
      if (isTopDuplicate) return prev;

      return [
        {
          id: String(Date.now()),
          reference: previewScripture.reference,
          time: getTimestamp(),
          text: previewScripture.text,
          translation: previewScripture.translation || (appMode === 'LYRICS' ? 'HYMN' : 'KJV'),
        },
        ...prev,
      ];
    });
  }, [previewScripture, appMode]);

  // CLEAR: Clears Live presentation (blackout / standby)
  const handleClearLive = useCallback(() => {
    setLiveScripture({
      reference: '',
      translation: '',
      text: '',
    });
  }, []);

  // PREV: Instantly steps to previous verse in chapter/sequence
  const handlePrev = useCallback(() => {
    const list = masterSequence.current;
    if (!list || list.length === 0) return;
    const newIdx = (sequenceIndex - 1 + list.length) % list.length;
    setSequenceIndex(newIdx);
    const prevItem = list[newIdx];
    setPreviewScripture({
      reference: prevItem.reference,
      translation: prevItem.translation || (appMode === 'LYRICS' ? 'HYMN' : 'KJV'),
      text: prevItem.text,
    });
  }, [sequenceIndex, appMode]);

  // NEXT: Instantly steps to next verse in chapter/sequence
  const handleNext = useCallback(() => {
    const list = masterSequence.current;
    if (!list || list.length === 0) return;
    const newIdx = (sequenceIndex + 1) % list.length;
    setSequenceIndex(newIdx);
    const nextItem = list[newIdx];
    setPreviewScripture({
      reference: nextItem.reference,
      translation: nextItem.translation || (appMode === 'LYRICS' ? 'HYMN' : 'KJV'),
      text: nextItem.text,
    });
  }, [sequenceIndex, appMode]);

  // Process speech text: detects scriptures, lyrics, and dictation instantly
  const processSpeechText = useCallback(
    (textChunk: string) => {
      const time = getTimestamp();

      // 1. High-speed Scripture citation detection
      const detectedRef = detectScriptureReference(textChunk, time);

      // 2. Semantic paraphrase match
      const paraphraseMatch = isAiActive ? detectParaphraseMatch(textChunk, time) : null;

      // 3. Hymn / Lyrics match
      let lyricsMatch: BibleVerse | null = null;
      for (const song of HYMNS_AND_SONGS) {
        if (textChunk.toLowerCase().includes(song.title.toLowerCase())) {
          const sec = song.sections[0];
          lyricsMatch = {
            reference: sec.reference,
            book: sec.songTitle,
            chapter: 1,
            verse: 1,
            translation: 'HYMN',
            text: sec.text,
          };
          break;
        }
      }

      // Add to transcript stream
      setTranscripts((prev) => [
        ...prev,
        {
          id: String(Date.now()),
          time,
          text: textChunk,
          isDetectedVerse: !!detectedRef || !!paraphraseMatch || !!lyricsMatch,
        },
      ]);

      // When preacher calls for a Bible passage, immediately stage and open it!
      if (detectedRef) {
        setDetectedVerses((prev) => {
          const exists = prev.some((d) => d.reference === detectedRef.reference);
          return exists ? prev : [detectedRef, ...prev];
        });

        // Stage immediately to Preview if newly dictated
        if (lastAutoStagedRef.current !== detectedRef.reference) {
          lastAutoStagedRef.current = detectedRef.reference;
          handleStageToPreview({
            reference: detectedRef.reference,
            translation: 'KJV',
            text: detectedRef.text,
          });
        }
      } else if (lyricsMatch) {
        if (lastAutoStagedRef.current !== lyricsMatch.reference) {
          lastAutoStagedRef.current = lyricsMatch.reference;
          handleStageToPreview({
            reference: lyricsMatch.reference,
            translation: 'HYMN',
            text: lyricsMatch.text,
          });
        }
      }

      if (paraphraseMatch) {
        setParaphrases((prev) => {
          const exists = prev.some(
            (p) => p.matchedReference === paraphraseMatch.matchedReference
          );
          return exists ? prev : [paraphraseMatch, ...prev];
        });
      }

      if (
        textChunk.toLowerCase().includes('point') ||
        textChunk.toLowerCase().includes('divine order') ||
        textChunk.toLowerCase().includes('order')
      ) {
        const newPoint: SermonPoint = {
          id: `sp_${Date.now()}`,
          pointNumber: sermonPoints.length + 1,
          title: textChunk.slice(0, 60),
          timestamp: time,
          scriptureRef: detectedRef ? detectedRef.reference : undefined,
        };
        setSermonPoints((prev) => [newPoint, ...prev]);
      }
    },
    [isAiActive, sermonPoints.length, handleStageToPreview]
  );

  // Real-time microphone handler for spoken voice
  const handleMicTranscriptChunk = useCallback(
    (text: string, isFinal: boolean) => {
      if (isFinal) {
        setCurrentInterim('');
        processSpeechText(text);
      } else {
        setCurrentInterim(text);
        // Instant interim detection: open the verse as soon as the preacher mentions it!
        const interimDetection = detectScriptureReference(text, getTimestamp());
        if (interimDetection && lastAutoStagedRef.current !== interimDetection.reference) {
          lastAutoStagedRef.current = interimDetection.reference;
          setDetectedVerses((prev) => {
            const exists = prev.some((d) => d.reference === interimDetection.reference);
            return exists ? prev : [interimDetection, ...prev];
          });
          handleStageToPreview({
            reference: interimDetection.reference,
            translation: 'KJV',
            text: interimDetection.text,
          });
        }
      }
    },
    [processSpeechText, handleStageToPreview]
  );

  // Connect real microphone detection hook
  const { isSpeaking, audioLevel, micStatus, errorMessage: micError } =
    useLiveMicTranscription({
      isLive: isLiveActive,
      onTranscriptChunk: handleMicTranscriptChunk,
      selectedMic,
    });

  // Handle topic discovery staging
  const handleStageTopicVerse = useCallback((ref: string) => {
    const resolved = resolveScriptureSearch(ref, 'reference');
    if (resolved && resolved.length > 0) {
      handleStageToPreview(
        {
          reference: resolved[0].reference,
          translation: 'KJV',
          text: resolved[0].text,
        },
        resolved
      );
    }
  }, [handleStageToPreview]);

  // Quota countdown timer
  useEffect(() => {
    if (!isLiveActive) return;
    const interval = setInterval(() => {
      setQuotaSeconds((sec) => (sec > 0 ? sec - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, [isLiveActive]);

  return (
    <div className="h-screen w-screen bg-[#07090e] text-slate-100 flex flex-col overflow-hidden select-none font-sans">
      {/* Top Application Bar */}
      <TopBar
        quotaSeconds={quotaSeconds}
        activeTranslation={appMode}
        selectedMic={selectedMic}
        onSelectMic={setSelectedMic}
        isAiActive={isAiActive}
        onToggleAi={() => setIsAiActive(!isAiActive)}
        onNavigateLyrics={handleToggleMode}
        onStageTopicVerse={handleStageTopicVerse}
      />

      {/* Main Workspace Layout */}
      <main className="flex-1 flex flex-col p-3 gap-3 min-h-0 overflow-hidden">
        {/* Top Primary Section: 3 Columns (Left Transcription, Center Presentation, Right Feed) */}
        <div className="flex-[1.4] flex gap-3 min-h-0">
          {/* Left: Live Transcription */}
          <div className="w-[20%] min-w-[220px] max-w-[300px] h-full">
            <LiveTranscription
              isLive={isLiveActive}
              onToggleLive={() => setIsLiveActive(!isLiveActive)}
              transcripts={transcripts}
              currentInterim={currentInterim}
              isSpeaking={isSpeaking}
              audioLevel={audioLevel}
              micStatus={micStatus}
              micError={micError}
            />
          </div>

          {/* Center: Presentation Workspace (Preview & Live) */}
          <div className="flex-1 h-full min-w-0">
            <PresentationPreview
              previewScripture={previewScripture}
              liveScripture={liveScripture}
              onDisplay={handleDisplay}
              onClear={handleClearLive}
              onPrev={handlePrev}
              onNext={handleNext}
              canPrev={true}
              canNext={true}
              autoDisplay={autoDisplay}
              onToggleAuto={() => setAutoDisplay(!autoDisplay)}
            />
          </div>

          {/* Right: Scripture Feed */}
          <div className="w-[20%] min-w-[220px] max-w-[300px] h-full">
            <ScriptureFeed
              historyItems={historyItems}
              queueItems={queueItems}
              activePreviewRef={previewScripture.reference}
              onClearHistory={() => setHistoryItems([])}
              onClearQueue={() => setQueueItems([])}
              onSelectVerse={handleStageToPreview}
            />
          </div>
        </div>

        {/* Bottom Working Section: 3 Equal Columns (Search, Detected Verses, Paraphrase Matches) */}
        <div className="flex-1 grid grid-cols-3 gap-3 min-h-0">
          {/* Lower Left: Bible & Lyrics Search */}
          <div className="h-full min-h-0">
            <BibleSearch
              onSelectVerse={handleStageToPreview}
              activePreviewRef={previewScripture.reference}
              appMode={appMode}
            />
          </div>

          {/* Lower Center: Detected Verses */}
          <div className="h-full min-h-0">
            <DetectedVerses
              detectedVerses={detectedVerses}
              sermonPoints={sermonPoints}
              onSelectVerse={handleStageToPreview}
              onClearDetected={() => setDetectedVerses([])}
              activePreviewRef={previewScripture.reference}
            />
          </div>

          {/* Lower Right: Paraphrase Matches AI */}
          <div className="h-full min-h-0">
            <ParaphraseMatches
              paraphrases={paraphrases}
              isAiActive={isAiActive}
              onClear={() => setParaphrases([])}
              onSelectVerse={handleStageToPreview}
              activePreviewRef={previewScripture.reference}
            />
          </div>
        </div>
      </main>
    </div>
  );
}
