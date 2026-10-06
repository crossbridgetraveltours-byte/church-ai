import React, { useState } from 'react';
import { Info, BookOpen } from 'lucide-react';
import { SermonPoint } from '../data/bibleData';

export interface DetectedVerseItem {
  id: string;
  reference: string;
  translation: string;
  text: string;
  timestamp: string;
  confidence?: number;
}

interface DetectedVersesProps {
  detectedVerses: DetectedVerseItem[];
  sermonPoints: SermonPoint[];
  onSelectVerse: (verse: { reference: string; translation: string; text: string }) => void;
  onClearDetected?: () => void;
  activePreviewRef?: string;
}

export const DetectedVerses: React.FC<DetectedVersesProps> = React.memo(({
  detectedVerses,
  sermonPoints,
  onSelectVerse,
  onClearDetected,
  activePreviewRef,
}) => {
  const [activeTab, setActiveTab] = useState<'detected' | 'sermon'>('detected');

  return (
    <div className="h-full bg-[#0c0f17] border border-[#1b2230] rounded-xl flex flex-col p-4 overflow-hidden select-none">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-[#18202e] shrink-0">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('detected')}
            className={`px-3 py-1 rounded text-xs font-bold uppercase tracking-wider transition shadow-sm cursor-pointer ${
              activeTab === 'detected'
                ? 'bg-blue-600 text-white'
                : 'text-slate-500 hover:text-slate-400'
            }`}
          >
            DETECTED VERSES {detectedVerses.length > 0 ? `(${detectedVerses.length})` : ''}
          </button>
          <button
            onClick={() => setActiveTab('sermon')}
            className={`text-xs font-bold uppercase tracking-wider transition cursor-pointer px-2 py-1 rounded ${
              activeTab === 'sermon'
                ? 'bg-blue-600 text-white'
                : 'text-slate-500 hover:text-slate-400'
            }`}
          >
            SERMON POINTS {sermonPoints.length > 0 ? `(${sermonPoints.length})` : ''}
          </button>
        </div>

        {detectedVerses.length > 0 && activeTab === 'detected' && onClearDetected && (
          <button
            onClick={onClearDetected}
            className="text-xs font-semibold text-slate-500 hover:text-slate-300 uppercase tracking-wider transition cursor-pointer"
          >
            CLEAR
          </button>
        )}
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-y-auto mt-2 pr-1">
        {activeTab === 'detected' ? (
          detectedVerses.length === 0 ? (
            /* Reference Empty State */
            <div className="h-full flex flex-col items-center justify-center text-center p-6">
              <div className="w-10 h-10 rounded-full border border-slate-700 flex items-center justify-center text-slate-500 mb-3">
                <Info className="w-5 h-5 stroke-[1.75]" />
              </div>
              <p className="text-slate-300 font-medium text-sm">
                No verses detected yet
              </p>
              <p className="text-slate-500 text-xs mt-1">
                Verses will appear as they&apos;re mentioned
              </p>
            </div>
          ) : (
            /* Detected Verses List */
            <div className="space-y-2 pt-1">
              {detectedVerses.map((item) => {
                const isSelectedInPreview =
                  activePreviewRef?.toUpperCase() === item.reference.toUpperCase();

                return (
                  <div
                    key={item.id}
                    onClick={() =>
                      onSelectVerse({
                        reference: item.reference,
                        translation: item.translation,
                        text: item.text,
                      })
                    }
                    className={`p-2.5 rounded-lg border transition-all cursor-pointer select-none active:scale-[0.99] ${
                      isSelectedInPreview
                        ? 'bg-[#151c2d] border-blue-500/70 ring-1 ring-blue-500/40 shadow-sm'
                        : 'bg-[#111624] border-[#1e2638] hover:border-slate-500 hover:bg-[#141b2b]'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-bold text-[#f59e0b]">
                          {item.reference}
                        </span>
                        <span className="text-[10px] text-slate-400 uppercase font-semibold">
                          {item.translation}
                        </span>
                        <span className="text-[9px] font-mono text-blue-400 bg-blue-950/60 border border-blue-500/30 px-1 py-0.2 rounded">
                          AI DETECTED
                        </span>
                      </div>
                      <span className="text-[10px] font-mono text-slate-500">
                        {item.timestamp}
                      </span>
                    </div>
                    <p className="text-xs text-slate-300 mt-1 leading-relaxed line-clamp-2">
                      {item.text}
                    </p>
                  </div>
                );
              })}
            </div>
          )
        ) : (
          /* Sermon Points View */
          sermonPoints.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-6 text-slate-500 text-xs">
              <BookOpen className="w-8 h-8 text-slate-600 mb-2" />
              <span>No sermon outline points detected</span>
              <span className="text-slate-600 text-[11px] mt-1">
                Points identified during preach will stage here
              </span>
            </div>
          ) : (
            <div className="space-y-2 pt-1">
              {sermonPoints.map((point) => (
                <div
                  key={point.id}
                  onClick={() => {
                    if (point.scriptureRef) {
                      onSelectVerse({
                        reference: point.scriptureRef,
                        translation: 'KJV',
                        text: point.title,
                      });
                    }
                  }}
                  className="p-2.5 rounded-lg border bg-[#111624] border-[#1e2638] hover:border-slate-500 hover:bg-[#141b2b] transition cursor-pointer"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-blue-400">
                      POINT {point.pointNumber}: {point.title}
                    </span>
                    <span className="text-[10px] font-mono text-slate-500">
                      {point.timestamp}
                    </span>
                  </div>
                  {point.scriptureRef && (
                    <span className="text-[11px] text-[#f59e0b] font-medium block mt-1">
                      Anchor Scripture: {point.scriptureRef}
                    </span>
                  )}
                </div>
              ))}
            </div>
          )
        )}
      </div>
    </div>
  );
});

DetectedVerses.displayName = 'DetectedVerses';
