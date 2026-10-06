import React, { useState } from 'react';

export interface FeedItem {
  id: string;
  reference: string;
  time: string;
  text: string;
  translation?: string;
}

interface ScriptureFeedProps {
  historyItems: FeedItem[];
  queueItems: FeedItem[];
  activePreviewRef?: string;
  onClearHistory: () => void;
  onClearQueue: () => void;
  onSelectVerse: (item: FeedItem) => void;
}

export const ScriptureFeed: React.FC<ScriptureFeedProps> = React.memo(({
  historyItems,
  queueItems,
  activePreviewRef,
  onClearHistory,
  onClearQueue,
  onSelectVerse,
}) => {
  const [activeTab, setActiveTab] = useState<'history' | 'queue'>('history');

  const currentList = activeTab === 'history' ? historyItems : queueItems;

  const handleClear = () => {
    if (activeTab === 'history') {
      onClearHistory();
    } else {
      onClearQueue();
    }
  };

  return (
    <div className="h-full bg-[#0c0f17] border border-[#1b2230] rounded-xl flex flex-col p-4 overflow-hidden select-none">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-[#18202e]">
        <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400">
          SCRIPTURE FEED
        </h2>
        <button
          onClick={handleClear}
          disabled={currentList.length === 0}
          className={`text-xs font-semibold uppercase tracking-wider transition cursor-pointer ${
            currentList.length > 0
              ? 'text-slate-400 hover:text-slate-200'
              : 'text-slate-700 cursor-not-allowed'
          }`}
        >
          CLEAR
        </button>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-6 border-b border-[#18202e] pt-2">
        <button
          onClick={() => setActiveTab('history')}
          className={`pb-2 text-xs font-bold tracking-wider uppercase transition-colors relative cursor-pointer ${
            activeTab === 'history'
              ? 'text-slate-200 border-b-2 border-blue-500'
              : 'text-slate-500 hover:text-slate-400'
          }`}
        >
          HISTORY ({historyItems.length})
        </button>
        <button
          onClick={() => setActiveTab('queue')}
          className={`pb-2 text-xs font-bold tracking-wider uppercase transition-colors relative cursor-pointer ${
            activeTab === 'queue'
              ? 'text-slate-200 border-b-2 border-blue-500'
              : 'text-slate-500 hover:text-slate-400'
          }`}
        >
          QUEUE ({queueItems.length})
        </button>
      </div>

      {/* Feed Content List */}
      <div className="flex-1 overflow-y-auto pt-3 space-y-2.5 pr-1">
        {currentList.length > 0 ? (
          currentList.map((item) => {
            const isSelectedInPreview =
              activePreviewRef?.toUpperCase() === item.reference?.toUpperCase();

            return (
              <div
                key={item.id}
                onClick={() => onSelectVerse(item)}
                className={`border rounded-lg p-3 transition-all cursor-pointer group select-none active:scale-[0.99] ${
                  isSelectedInPreview
                    ? 'bg-[#151c2d] border-blue-500/60 ring-1 ring-blue-500/30 shadow-md'
                    : 'bg-[#121622] border-[#1e2638] hover:border-slate-600 hover:bg-[#151b2a]'
                }`}
              >
                <div className="flex items-center justify-between gap-2">
                  <span
                    className={`font-bold text-xs sm:text-sm tracking-wide ${
                      isSelectedInPreview
                        ? 'text-blue-400 font-extrabold'
                        : 'text-slate-200 group-hover:text-blue-300'
                    }`}
                  >
                    {item.reference}
                  </span>
                  <span className="text-[11px] font-mono text-slate-500">
                    {item.time}
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-1 leading-relaxed line-clamp-3">
                  {item.text}
                </p>
              </div>
            );
          })
        ) : (
          <div className="h-full flex flex-col items-center justify-center text-center p-6 text-slate-600 text-xs">
            <span>
              {activeTab === 'history'
                ? 'No scripture history yet'
                : 'No scripture items queued'}
            </span>
            <span className="text-[11px] text-slate-700 mt-1">
              Select or search a verse to add
            </span>
          </div>
        )}
      </div>
    </div>
  );
});

ScriptureFeed.displayName = 'ScriptureFeed';
