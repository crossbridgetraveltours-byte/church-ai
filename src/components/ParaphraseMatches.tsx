import React from 'react';
import { MessageSquare, Sparkles } from 'lucide-react';
import { ParaphraseItem } from '../data/bibleData';

interface ParaphraseMatchesProps {
  paraphrases: ParaphraseItem[];
  isAiActive: boolean;
  onClear: () => void;
  onSelectVerse: (verse: { reference: string; translation: string; text: string }) => void;
  activePreviewRef?: string;
}

export const ParaphraseMatches: React.FC<ParaphraseMatchesProps> = React.memo(({
  paraphrases,
  isAiActive,
  onClear,
  onSelectVerse,
  activePreviewRef,
}) => {
  return (
    <div className="h-full bg-[#0c0f17] border border-[#1b2230] rounded-xl flex flex-col p-4 overflow-hidden select-none">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-[#18202e] gap-2 shrink-0">
        <div className="flex items-center gap-2">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400">
            PARAPHRASE MATCHES (AI)
          </h2>
          <div
            className={`flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[11px] font-bold ${
              isAiActive
                ? 'bg-[#0d2218] border border-emerald-500/40 text-emerald-400'
                : 'bg-[#181e2b] border border-slate-700 text-slate-400'
            }`}
          >
            <span
              className={`w-1.5 h-1.5 rounded-full ${
                isAiActive
                  ? 'bg-emerald-400 shadow-[0_0_6px_#34d399] animate-pulse'
                  : 'bg-slate-500'
              }`}
            />
            <span>{isAiActive ? 'READY' : 'STANDBY'}</span>
          </div>
        </div>

        <button
          onClick={onClear}
          disabled={paraphrases.length === 0}
          className={`text-xs font-semibold uppercase tracking-wider transition cursor-pointer ${
            paraphrases.length > 0
              ? 'text-slate-400 hover:text-slate-200'
              : 'text-slate-700 cursor-not-allowed'
          }`}
        >
          CLEAR
        </button>
      </div>

      {/* Body Area */}
      <div className="flex-1 overflow-y-auto mt-2 pr-1">
        {paraphrases.length === 0 ? (
          /* Reference Empty State */
          <div className="h-full flex flex-col items-center justify-center text-center p-6">
            <div className="text-slate-600 mb-3">
              <MessageSquare className="w-9 h-9 stroke-[1.5]" />
            </div>
            <p className="text-slate-300 font-medium text-sm">
              No paraphrases detected
            </p>
            <p className="text-slate-500 text-xs mt-1">
              Speak a verse in your own words
            </p>
          </div>
        ) : (
          /* List of Paraphrase Matches */
          <div className="space-y-2 pt-1">
            {paraphrases.map((item) => {
              const isSelectedInPreview =
                activePreviewRef?.toUpperCase() === item.matchedReference.toUpperCase();

              return (
                <div
                  key={item.id}
                  onClick={() =>
                    onSelectVerse({
                      reference: item.matchedReference,
                      translation: 'KJV',
                      text: item.matchedText,
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
                        {item.matchedReference}
                      </span>
                      <span className="text-[10px] text-slate-400 uppercase font-semibold">
                        KJV
                      </span>
                      <span className="text-[9px] font-mono text-emerald-400 bg-emerald-950/60 border border-emerald-500/30 px-1 py-0.2 rounded flex items-center gap-1">
                        <Sparkles className="w-2.5 h-2.5" />
                        {item.confidence}% MATCH
                      </span>
                    </div>
                    <span className="text-[10px] font-mono text-slate-500">
                      {item.timestamp}
                    </span>
                  </div>

                  <p className="text-[11px] text-slate-400 italic mt-1">
                    &ldquo;{item.detectedPhrase}&rdquo;
                  </p>
                  <p className="text-xs text-slate-200 mt-1 leading-relaxed line-clamp-2">
                    {item.matchedText}
                  </p>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
});

ParaphraseMatches.displayName = 'ParaphraseMatches';
