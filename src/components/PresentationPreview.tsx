import React, { useState } from 'react';
import { Play, ChevronLeft, ChevronRight, X } from 'lucide-react';
import { PresentationCard } from './PresentationCard';

interface ScriptureData {
  reference: string;
  translation: string;
  text: string;
}

interface PresentationPreviewProps {
  previewScripture: ScriptureData;
  liveScripture: ScriptureData;
  onDisplay: () => void;
  onClear: () => void;
  onPrev: () => void;
  onNext: () => void;
  canPrev?: boolean;
  canNext?: boolean;
  autoDisplay: boolean;
  onToggleAuto: () => void;
}

export const PresentationPreview: React.FC<PresentationPreviewProps> = React.memo(({
  previewScripture,
  liveScripture,
  onDisplay,
  onClear,
  onPrev,
  onNext,
  canPrev = true,
  canNext = true,
  autoDisplay,
  onToggleAuto,
}) => {
  const [scale, setScale] = useState<number>(1.0);

  const isLiveEmpty = !liveScripture.text && !liveScripture.reference;
  const isPreviewEmpty = !previewScripture.text && !previewScripture.reference;

  return (
    <div className="h-full bg-[#0c0f17] border border-[#1b2230] rounded-xl flex flex-col p-4 overflow-hidden select-none">
      {/* Top Header Controls */}
      <div className="flex items-center justify-between gap-4 pb-3 border-b border-[#18202e] shrink-0">
        <div className="flex items-center gap-3">
          <h2 className="text-sm font-bold text-slate-200 tracking-wide">
            Preview
          </h2>
        </div>

        {/* Right side controls of Preview Header */}
        <div className="flex items-center gap-3">
          {/* Live Indicator Badge */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-300">Live</span>
            <span
              className={`flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-extrabold tracking-wider transition-colors ${
                !isLiveEmpty
                  ? 'bg-[#112038] border border-blue-500/40 text-blue-400'
                  : 'bg-[#141822] border border-slate-700 text-slate-500'
              }`}
            >
              <span
                className={`w-1.5 h-1.5 rounded-full ${
                  !isLiveEmpty
                    ? 'bg-blue-400 shadow-[0_0_6px_#60a5fa] animate-pulse'
                    : 'bg-slate-600'
                }`}
              />
              LIVE
            </span>
          </div>

          {/* Size slider */}
          <div className="flex items-center gap-2 ml-1">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              SIZE
            </span>
            <input
              type="range"
              min="0.8"
              max="1.4"
              step="0.05"
              value={scale}
              onChange={(e) => setScale(parseFloat(e.target.value))}
              className="w-20 h-1.5 bg-[#1a2333] rounded-lg appearance-none cursor-pointer accent-blue-500"
            />
            <span className="text-xs font-mono font-medium text-slate-400 w-8">
              {scale.toFixed(1)}x
            </span>
          </div>

          <div className="h-4 w-[1px] bg-slate-800" />

          {/* Auto Toggle */}
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              AUTO
            </span>
            <button
              onClick={onToggleAuto}
              title="Automatically push detected verses to Live output"
              className={`w-9 h-5 flex items-center rounded-full p-0.5 transition-colors duration-200 cursor-pointer ${
                autoDisplay ? 'bg-blue-600 justify-end' : 'bg-slate-700 justify-start'
              }`}
            >
              <span className="bg-white w-4 h-4 rounded-full shadow-md transform transition-transform" />
            </button>
          </div>
        </div>
      </div>

      {/* Presentation Surfaces Container */}
      <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4 items-center justify-center p-2 min-h-0">
        {/* Left: Preview Surface */}
        <div className="flex flex-col items-center justify-between gap-3 h-full">
          <div className="w-full flex-1 flex items-center justify-center min-h-0">
            <PresentationCard
              reference={previewScripture.reference}
              translation={previewScripture.translation}
              text={previewScripture.text}
              isLive={false}
              scaleMultiplier={scale}
            />
          </div>
          <button
            onClick={onDisplay}
            disabled={isPreviewEmpty}
            className={`w-44 py-2 px-4 rounded-md text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition shadow-sm active:scale-95 ${
              !isPreviewEmpty
                ? 'bg-[#132238] border border-blue-500/60 hover:bg-blue-600/30 text-blue-400 cursor-pointer shadow-blue-500/10'
                : 'bg-[#10141f] border border-slate-800 text-slate-600 cursor-not-allowed'
            }`}
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            <span>DISPLAY</span>
          </button>
        </div>

        {/* Right: Live Surface */}
        <div className="flex flex-col items-center justify-between gap-3 h-full">
          <div className="w-full flex-1 flex items-center justify-center min-h-0">
            <PresentationCard
              reference={liveScripture.reference}
              translation={liveScripture.translation}
              text={liveScripture.text}
              isLive={true}
              scaleMultiplier={scale}
            />
          </div>
          <div className="flex items-center gap-2 w-full justify-center">
            <button
              onClick={onPrev}
              disabled={!canPrev}
              className={`py-2 px-4 rounded-md border text-xs font-bold uppercase tracking-wider flex items-center gap-1 transition active:scale-95 ${
                canPrev
                  ? 'bg-[#10141f] border-[#222a3d] hover:border-slate-500 text-slate-300 cursor-pointer'
                  : 'bg-[#0d1017] border-slate-800 text-slate-600 cursor-not-allowed'
              }`}
            >
              <ChevronLeft className="w-3.5 h-3.5" />
              <span>PREV</span>
            </button>
            <button
              onClick={onClear}
              disabled={isLiveEmpty}
              className={`py-2 px-5 rounded-md border text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 transition active:scale-95 ${
                !isLiveEmpty
                  ? 'bg-[#132238] border-blue-500/50 hover:bg-blue-600/30 text-blue-400 cursor-pointer'
                  : 'bg-[#0d1017] border-slate-800 text-slate-600 cursor-not-allowed'
              }`}
            >
              <X className="w-3.5 h-3.5" />
              <span>CLEAR</span>
            </button>
            <button
              onClick={onNext}
              disabled={!canNext}
              className={`py-2 px-4 rounded-md border text-xs font-bold uppercase tracking-wider flex items-center gap-1 transition active:scale-95 ${
                canNext
                  ? 'bg-[#10141f] border-[#222a3d] hover:border-slate-500 text-slate-300 cursor-pointer'
                  : 'bg-[#0d1017] border-slate-800 text-slate-600 cursor-not-allowed'
              }`}
            >
              <span>NEXT</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
});

PresentationPreview.displayName = 'PresentationPreview';
