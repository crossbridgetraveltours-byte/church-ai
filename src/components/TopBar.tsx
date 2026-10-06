import React, { useState, useRef, useEffect } from 'react';
import {
  Mic,
  ChevronDown,
  Sparkles,
  Tv,
  Palette,
  Sun,
  Compass,
  Settings,
  Music2,
  BookOpen,
  Check,
  X,
  Zap,
} from 'lucide-react';
import { AVAILABLE_MICROPHONES } from '../data/bibleData';

interface TopBarProps {
  quotaSeconds: number;
  activeTranslation?: string;
  selectedMic: string;
  onSelectMic: (mic: string) => void;
  isAiActive: boolean;
  onToggleAi: () => void;
  onNavigateLyrics?: () => void;
  onStageTopicVerse?: (ref: string) => void;
}

export const TopBar: React.FC<TopBarProps> = React.memo(({
  quotaSeconds,
  activeTranslation = 'BIBLE',
  selectedMic,
  onSelectMic,
  isAiActive,
  onToggleAi,
  onNavigateLyrics,
  onStageTopicVerse,
}) => {
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [showMicDropdown, setShowMicDropdown] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [showThemeModal, setShowThemeModal] = useState(false);
  const [showProjectorModal, setShowProjectorModal] = useState(false);
  const [showDiscoverModal, setShowDiscoverModal] = useState(false);
  const [activeTheme, setActiveTheme] = useState<'purple' | 'blue' | 'gold' | 'dark'>('purple');
  const [showNotification, setShowNotification] = useState<string | null>(null);
  const [hardwareDevices, setHardwareDevices] = useState<string[]>(AVAILABLE_MICROPHONES);

  const micDropdownRef = useRef<HTMLDivElement>(null);

  // Format quota seconds into HH:MM:SS
  const formatTime = (totalSeconds: number) => {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    return `${hours.toString().padStart(1, '0')}:${minutes
      .toString()
      .padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  // Enumerate physical hardware audio devices
  useEffect(() => {
    async function loadAudioDevices() {
      try {
        if (navigator.mediaDevices && navigator.mediaDevices.enumerateDevices) {
          const devices = await navigator.mediaDevices.enumerateDevices();
          const audioInputs = devices
            .filter((d) => d.kind === 'audioinput')
            .map((d, idx) => d.label || `Audio Hardware Input ${idx + 1}`);

          if (audioInputs.length > 0) {
            const merged = Array.from(new Set([...audioInputs, ...AVAILABLE_MICROPHONES]));
            setHardwareDevices(merged);
          }
        }
      } catch (err) {
        console.warn('Enumerate devices notice:', err);
      }
    }

    loadAudioDevices();
  }, []);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        micDropdownRef.current &&
        !micDropdownRef.current.contains(event.target as Node)
      ) {
        setShowMicDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const triggerNotify = (msg: string) => {
    setShowNotification(msg);
    setTimeout(() => setShowNotification(null), 3000);
  };

  const handleOpenMicMenu = async () => {
    setShowMicDropdown(!showMicDropdown);
    try {
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        const devices = await navigator.mediaDevices.enumerateDevices();
        const audioInputs = devices
          .filter((d) => d.kind === 'audioinput')
          .map((d, idx) => d.label || `Audio Hardware Input ${idx + 1}`);

        if (audioInputs.length > 0) {
          setHardwareDevices(Array.from(new Set([...audioInputs, ...AVAILABLE_MICROPHONES])));
        }
        stream.getTracks().forEach((t) => t.stop());
      }
    } catch {
      // ignore
    }
  };

  return (
    <>
      <header className="w-full bg-[#0d1017] border-b border-[#1c2230] px-4 py-2 flex items-center justify-between gap-4 select-none shrink-0 h-14 relative z-30">
        {/* Left side: Brand, Free, Upgrade */}
        <div className="flex items-center gap-3 shrink-0">
          <div
            onClick={() => triggerNotify('CHURCH MEDIA AI Workspace v2.4 (Active)')}
            className="flex items-center gap-2.5 cursor-pointer group"
          >
            <div className="relative flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-br from-amber-500/20 via-purple-500/20 to-blue-500/20 border border-amber-500/40 shadow-inner group-hover:border-amber-400 transition-colors">
              <BookOpen className="w-4 h-4 text-amber-400" />
              <div className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 bg-amber-400 rounded-full animate-ping opacity-75" />
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-black tracking-wider text-white font-serif leading-none">
                CHURCH MEDIA <span className="text-amber-400">AI</span>
              </span>
              <span className="text-[9px] tracking-widest text-amber-500/80 font-bold uppercase mt-0.5">
                FROM TRINITY STUDIO
              </span>
            </div>
          </div>

          <span className="px-2 py-0.5 rounded border border-slate-700/80 bg-slate-900/80 text-[11px] font-bold text-slate-400 uppercase tracking-wide">
            FREE
          </span>

          <button
            onClick={() => setShowUpgradeModal(true)}
            className="px-2.5 py-1 rounded border border-blue-500/50 bg-[#121b2d] hover:bg-blue-900/40 text-blue-400 font-bold text-[11px] uppercase tracking-wider transition-colors cursor-pointer active:scale-95"
          >
            UPGRADE TO PREMIUM
          </button>
        </div>

        {/* Center Controls: Quota, Active Bible, Mic Selector */}
        <div className="flex items-center gap-2.5">
          <div
            title="Remaining AI transcription audio quota"
            className="flex items-center gap-2 px-3 py-1 rounded-full bg-[#10141f] border border-[#202738] text-xs font-semibold text-slate-400"
          >
            <span
              className={`w-2 h-2 rounded-full ${
                quotaSeconds > 0
                  ? 'bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.8)] animate-pulse'
                  : 'bg-slate-600'
              }`}
            />
            <span>QUOTA LEFT:</span>
            <span className="text-[#38bdf8] font-mono font-bold">
              {formatTime(quotaSeconds)}
            </span>
          </div>

          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#111f38] border border-blue-500/40 text-xs font-bold text-blue-400">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-400" />
            <span>ACTIVE: {activeTranslation}</span>
          </div>

          <div className="relative" ref={micDropdownRef}>
            <button
              onClick={handleOpenMicMenu}
              className="flex items-center gap-2 px-3 py-1 rounded-md bg-[#10141f] border border-[#202738] hover:border-slate-500 text-xs font-medium text-slate-300 transition-colors cursor-pointer"
            >
              <Mic
                className={`w-3.5 h-3.5 ${
                  selectedMic ? 'text-blue-400' : 'text-slate-400'
                }`}
              />
              <span className="max-w-[150px] truncate">{selectedMic}</span>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 ml-0.5" />
            </button>

            {showMicDropdown && (
              <div className="absolute top-full mt-1.5 left-0 w-80 bg-[#0e121a] border border-[#222a3d] rounded-lg shadow-2xl py-1.5 z-50 max-h-72 overflow-y-auto">
                <div className="px-3 py-1.5 border-b border-[#1b2230] text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center justify-between">
                  <span>Detected Hardware Inputs</span>
                  <span className="text-emerald-400 font-normal">Active</span>
                </div>
                {hardwareDevices.map((mic) => (
                  <button
                    key={mic}
                    onClick={() => {
                      onSelectMic(mic);
                      setShowMicDropdown(false);
                      triggerNotify(`Hardware Input Selected: ${mic}`);
                    }}
                    className={`w-full px-3 py-2 text-left text-xs flex items-center justify-between hover:bg-[#161c2b] transition-colors cursor-pointer ${
                      selectedMic === mic
                        ? 'text-blue-400 font-bold bg-[#121929]'
                        : 'text-slate-300'
                    }`}
                  >
                    <span className="truncate pr-2">{mic}</span>
                    {selectedMic === mic && <Check className="w-3.5 h-3.5 shrink-0" />}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right side: Tool Icons, Settings, Go To Lyrics */}
        <div className="flex items-center gap-2.5 shrink-0">
          <div className="relative">
            <span className="absolute -top-2 left-1/2 -translate-x-1/2 px-1 py-0.2 bg-blue-600 text-[8px] font-black text-white rounded tracking-tighter shadow-sm">
              NEW
            </span>
            <button
              onClick={() => {
                onToggleAi();
                triggerNotify(
                  isAiActive
                    ? 'AI Paraphrase & Verse Engine: Enhanced'
                    : 'AI Paraphrase & Verse Engine: Standby'
                );
              }}
              title="Toggle AI Intelligence Engine"
              className={`p-1.5 rounded-md transition-colors cursor-pointer ${
                isAiActive
                  ? 'bg-blue-600/30 text-blue-400 border border-blue-500/40 shadow-[0_0_10px_rgba(59,130,246,0.3)]'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
              }`}
            >
              <Sparkles className="w-4 h-4 text-blue-400" />
            </button>
          </div>

          {/* Projector / Stage Output Modal */}
          <button
            onClick={() => setShowProjectorModal(true)}
            title="External Display / Stage Projector Mode"
            className="p-1.5 rounded-md text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <Tv className="w-4 h-4" />
          </button>

          <div className="h-4 w-[1px] bg-slate-800 mx-0.5" />

          {/* Theme Switcher Modal */}
          <button
            onClick={() => setShowThemeModal(true)}
            title="Theme Selector"
            className="p-1.5 rounded-md text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <Palette className="w-4 h-4" />
          </button>

          {/* Brightness / Display */}
          <button
            onClick={() => triggerNotify('Display Brightness: 100% (Optimal)')}
            title="Brightness"
            className="p-1.5 rounded-md text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <Sun className="w-4 h-4" />
          </button>

          {/* Discover / Topic Browser */}
          <button
            onClick={() => setShowDiscoverModal(true)}
            title="Sermon Topic & Discovery Library"
            className="p-1.5 rounded-md text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <Compass className="w-4 h-4" />
          </button>

          {/* Settings */}
          <button
            onClick={() => setShowSettingsModal(true)}
            title="Settings"
            className="p-1.5 rounded-md text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <Settings className="w-4 h-4" />
          </button>

          {/* Go To Lyrics / Bible Button */}
          <button
            onClick={() => {
              if (onNavigateLyrics) onNavigateLyrics();
              triggerNotify(
                activeTranslation === 'LYRICS'
                  ? 'Switching back to Bible Scripture presentation...'
                  : 'Switching to Hymns & Song Lyrics presentation...'
              );
            }}
            className="flex items-center gap-1.5 px-3 py-1 rounded-md bg-[#10141f] border border-[#263045] hover:border-blue-500/50 hover:bg-[#151c2c] text-xs font-bold text-slate-200 uppercase tracking-wider transition-colors ml-1 cursor-pointer active:scale-95"
          >
            {activeTranslation === 'LYRICS' ? (
              <>
                <span>GO TO BIBLE</span>
                <BookOpen className="w-3.5 h-3.5 text-amber-400" />
              </>
            ) : (
              <>
                <span>GO TO LYRICS</span>
                <Music2 className="w-3.5 h-3.5 text-blue-400" />
              </>
            )}
          </button>
        </div>
      </header>

      {/* Floating Toast Notification */}
      {showNotification && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#121824] border border-blue-500/50 text-slate-200 text-xs px-4 py-2.5 rounded-lg shadow-2xl flex items-center gap-2 animate-bounce">
          <Zap className="w-4 h-4 text-blue-400 shrink-0" />
          <span>{showNotification}</span>
        </div>
      )}

      {/* Upgrade to Premium Modal */}
      {showUpgradeModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0e121a] border border-[#222a3d] rounded-2xl w-full max-w-lg p-6 shadow-2xl text-slate-200 relative">
            <button
              onClick={() => setShowUpgradeModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-md hover:bg-slate-800 transition"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500/20 to-blue-500/20 border border-amber-500/40 flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-amber-400" />
              </div>
              <div>
                <h3 className="text-lg font-black text-white">
                  CHURCH MEDIA <span className="text-amber-400">PREMIUM</span>
                </h3>
                <p className="text-xs text-slate-400">
                  Supercharge your live church production with unlimited AI.
                </p>
              </div>
            </div>

            <div className="space-y-3 my-6">
              {[
                'Unlimited Live AI Transcription & Verse Recognition',
                'Zero Quota Limits for Sunday & Midweek Services',
                'Dual Screen & 4K NDI Virtual Video Output',
                'Custom Backgrounds, Video Loops, and Themes',
                'Real-Time Scripture Paraphrase Matching (99.8% Accuracy)',
                'Priority Multilingual Bible Translations (25+ Languages)',
              ].map((feat, idx) => (
                <div key={idx} className="flex items-center gap-2.5 text-xs text-slate-300">
                  <div className="w-4 h-4 rounded-full bg-blue-600/20 text-blue-400 flex items-center justify-center shrink-0">
                    <Check className="w-3 h-3" />
                  </div>
                  <span>{feat}</span>
                </div>
              ))}
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-[#1e2638]">
              <div className="text-left">
                <span className="text-xs text-slate-500 block uppercase font-bold">Monthly Plan</span>
                <span className="text-2xl font-black text-white">$29<span className="text-xs font-normal text-slate-400">/mo</span></span>
              </div>
              <button
                onClick={() => {
                  setShowUpgradeModal(false);
                  triggerNotify('Upgrade request recorded. Premium access enabled!');
                }}
                className="px-6 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs uppercase tracking-wider transition shadow-lg shadow-blue-600/30"
              >
                Start 14-Day Free Trial
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Theme Switcher Modal */}
      {showThemeModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0e121a] border border-[#222a3d] rounded-2xl w-full max-w-md p-6 shadow-2xl text-slate-200 relative">
            <button
              onClick={() => setShowThemeModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-md hover:bg-slate-800 transition"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-base font-bold text-white mb-1 flex items-center gap-2">
              <Palette className="w-4 h-4 text-blue-400" />
              Console Theme Selector
            </h3>
            <p className="text-xs text-slate-400 mb-5">
              Select your worship operator console visual theme.
            </p>

            <div className="grid grid-cols-2 gap-3 mb-5">
              {[
                { id: 'purple', name: 'Trinity Cosmic Purple', bg: 'from-purple-950 via-slate-900 to-[#07090e]', border: 'border-purple-500/50' },
                { id: 'blue', name: 'Royal Sapphire Blue', bg: 'from-blue-950 via-slate-900 to-[#060a12]', border: 'border-blue-500/50' },
                { id: 'gold', name: 'Obsidian Gold', bg: 'from-amber-950 via-slate-900 to-[#080806]', border: 'border-amber-500/50' },
                { id: 'dark', name: 'Cathedral Dark', bg: 'from-slate-900 via-slate-950 to-[#0a0a0c]', border: 'border-slate-500/50' },
              ].map((theme) => (
                <button
                  key={theme.id}
                  onClick={() => {
                    setActiveTheme(theme.id as any);
                    triggerNotify(`Theme Applied: ${theme.name}`);
                    setShowThemeModal(false);
                  }}
                  className={`p-3 rounded-xl border bg-gradient-to-br ${theme.bg} ${
                    activeTheme === theme.id ? theme.border + ' ring-2 ring-blue-500' : 'border-[#1e2638]'
                  } text-left transition cursor-pointer flex flex-col justify-between h-20`}
                >
                  <span className="text-xs font-bold text-white">{theme.name}</span>
                  {activeTheme === theme.id && (
                    <span className="text-[10px] font-bold text-blue-400 uppercase">Active Theme</span>
                  )}
                </button>
              ))}
            </div>

            <div className="flex justify-end">
              <button
                onClick={() => setShowThemeModal(false)}
                className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs uppercase tracking-wider transition"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Stage Projector / External Display Mode Modal */}
      {showProjectorModal && (
        <div className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex flex-col items-center justify-center p-6">
          <div className="absolute top-6 right-6 flex items-center gap-3">
            <span className="px-3 py-1 bg-blue-600/30 border border-blue-500/40 text-blue-400 rounded-full text-xs font-bold uppercase tracking-wider animate-pulse">
              LIVE STAGE OUTPUT 4K NDI
            </span>
            <button
              onClick={() => setShowProjectorModal(false)}
              className="bg-slate-800 hover:bg-slate-700 text-white p-2 rounded-full transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="w-full max-w-4xl aspect-[16/9] rounded-2xl bg-gradient-to-br from-[#090314] via-[#150928] to-[#200d45] border-2 border-blue-500/50 shadow-[0_0_50px_rgba(59,130,246,0.3)] flex flex-col items-center justify-center p-8 text-center relative overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_115%,rgba(124,58,237,0.45),transparent_75%)] pointer-events-none" />
            <span className="text-amber-400 font-bold text-base tracking-widest uppercase mb-2">
              GENESIS 1:1 • KJV
            </span>
            <h1 className="text-white font-black text-3xl sm:text-4xl md:text-5xl leading-tight max-w-3xl drop-shadow-lg">
              &ldquo;In the beginning God created the heaven and the earth.&rdquo;
            </h1>
            <span className="absolute bottom-4 text-xs font-mono text-slate-400 tracking-widest uppercase">
              CHURCH MEDIA AI STAGE OUTPUT STREAM
            </span>
          </div>
        </div>
      )}

      {/* Sermon Topic & Discovery Library Modal */}
      {showDiscoverModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0e121a] border border-[#222a3d] rounded-2xl w-full max-w-lg p-6 shadow-2xl text-slate-200 relative">
            <button
              onClick={() => setShowDiscoverModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-md hover:bg-slate-800 transition"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-base font-bold text-white mb-1 flex items-center gap-2">
              <Compass className="w-4 h-4 text-blue-400" />
              Sermon Topic & Discovery Library
            </h3>
            <p className="text-xs text-slate-400 mb-5">
              Select a sermon theme to instantly stage anchor scriptures into Preview.
            </p>

            <div className="grid grid-cols-2 gap-2.5 mb-5 max-h-72 overflow-y-auto pr-1">
              {[
                { topic: 'Faith & Trust', ref: 'HEBREWS 11:1', text: 'Now faith is the substance of things hoped for, the evidence of things not seen.' },
                { topic: 'Strength & Comfort', ref: 'ISAIAH 40:31', text: 'But they that wait upon the LORD shall renew their strength; they shall mount up with wings as eagles.' },
                { topic: 'Divine Guidance', ref: 'PROVERBS 3:5', text: 'Trust in the LORD with all thine heart; and lean not unto thine own understanding.' },
                { topic: 'Peace & Protection', ref: 'PSALMS 23:1', text: 'The LORD is my shepherd; I shall not want.' },
                { topic: 'Hope & Future', ref: 'JEREMIAH 29:11', text: 'For I know the thoughts that I think toward you, saith the LORD, thoughts of peace, and not of evil.' },
                { topic: 'Victory & Grace', ref: 'ROMANS 8:31', text: 'What shall we then say to these things? If God be for us, who can be against us?' },
              ].map((item, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    if (onStageTopicVerse) onStageTopicVerse(item.ref);
                    setShowDiscoverModal(false);
                    triggerNotify(`Staged Anchor Scripture: ${item.ref}`);
                  }}
                  className="p-3 rounded-xl border bg-[#121724] border-[#1e2638] hover:border-blue-500/60 hover:bg-[#161d2e] text-left transition cursor-pointer flex flex-col justify-between"
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-bold text-blue-400">{item.topic}</span>
                    <span className="text-[10px] font-mono text-amber-400">{item.ref}</span>
                  </div>
                  <p className="text-[11px] text-slate-400 line-clamp-2">{item.text}</p>
                </button>
              ))}
            </div>

            <div className="flex justify-end">
              <button
                onClick={() => setShowDiscoverModal(false)}
                className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs uppercase tracking-wider transition"
              >
                Close Library
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Operator Settings Modal */}
      {showSettingsModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0e121a] border border-[#222a3d] rounded-2xl w-full max-w-md p-6 shadow-2xl text-slate-200 relative">
            <button
              onClick={() => setShowSettingsModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-md hover:bg-slate-800 transition"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-base font-bold text-white mb-1 flex items-center gap-2">
              <Settings className="w-4 h-4 text-blue-400" />
              Operator Workspace Settings
            </h3>
            <p className="text-xs text-slate-400 mb-5">
              Configure hardware output and detection sensitivity.
            </p>

            <div className="space-y-4 text-xs">
              <div>
                <label className="text-slate-400 font-bold uppercase tracking-wider block mb-1.5">
                  Output Aspect Ratio & Resolution
                </label>
                <select className="w-full bg-[#131722] border border-[#222a3d] text-slate-200 rounded-lg p-2 font-medium focus:outline-none focus:border-blue-500">
                  <option>16:9 Widescreen (1920 x 1080 Full HD)</option>
                  <option>16:9 Widescreen (3840 x 2160 4K UHD)</option>
                  <option>16:10 Presentation Display</option>
                  <option>Lower-Third Overlay Mode (NDI Alpha)</option>
                </select>
              </div>

              <div>
                <label className="text-slate-400 font-bold uppercase tracking-wider block mb-1.5">
                  AI Paraphrase Sensitivity
                </label>
                <div className="flex items-center gap-3">
                  <input
                    type="range"
                    min="50"
                    max="95"
                    defaultValue="80"
                    className="w-full accent-blue-500"
                  />
                  <span className="font-mono text-blue-400 font-bold">80%</span>
                </div>
              </div>

              <div className="pt-2 border-t border-[#1e2638] flex justify-end">
                <button
                  onClick={() => setShowSettingsModal(false)}
                  className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs uppercase tracking-wider transition"
                >
                  Save & Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
});

TopBar.displayName = 'TopBar';
