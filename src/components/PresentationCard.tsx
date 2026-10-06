import React from 'react';

interface PresentationCardProps {
  reference?: string;
  translation?: string;
  text?: string;
  isLive?: boolean;
  scaleMultiplier?: number;
}

export const PresentationCard: React.FC<PresentationCardProps> = ({
  reference = '',
  translation = 'KJV',
  text = '',
  isLive = false,
  scaleMultiplier = 1.0,
}) => {
  const isEmpty = !text && !reference;

  return (
    <div
      className={`relative w-full aspect-[16/9] rounded-xl overflow-hidden flex flex-col items-center justify-center p-6 shadow-2xl transition-all duration-200 ${
        isLive
          ? isEmpty
            ? 'ring-1 ring-slate-800'
            : 'ring-1 ring-blue-500/40 shadow-[0_0_25px_rgba(59,130,246,0.18)]'
          : 'ring-1 ring-slate-800/80 hover:ring-slate-700'
      }`}
      style={{
        background: isEmpty
          ? '#05070a'
          : 'linear-gradient(145deg, #090314 0%, #150928 30%, #200d45 60%, #0d061f 100%)',
      }}
    >
      {!isEmpty && (
        <>
          {/* Abstract cosmic luminous gradient curve matching reference */}
          <div
            className="absolute inset-0 pointer-events-none opacity-80"
            style={{
              background:
                'radial-gradient(ellipse 80% 60% at 50% 115%, rgba(124, 58, 237, 0.45), rgba(37, 99, 235, 0.25) 45%, transparent 75%)',
            }}
          />
          <div
            className="absolute -top-12 -left-12 w-64 h-64 rounded-full pointer-events-none opacity-20 blur-3xl"
            style={{ background: '#6366f1' }}
          />
          <div
            className="absolute -bottom-10 -right-10 w-72 h-72 rounded-full pointer-events-none opacity-25 blur-3xl"
            style={{ background: '#9333ea' }}
          />

          {/* Subtle sweeping curve line like in screenshot */}
          <svg
            className="absolute inset-0 w-full h-full pointer-events-none opacity-20"
            preserveAspectRatio="none"
            viewBox="0 0 100 100"
          >
            <path
              d="M -20 120 Q 50 40 120 90"
              fill="none"
              stroke="url(#bluePurpleGrad)"
              strokeWidth="14"
            />
            <defs>
              <linearGradient id="bluePurpleGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#818cf8" />
                <stop offset="100%" stopColor="#c084fc" />
              </linearGradient>
            </defs>
          </svg>
        </>
      )}

      {isEmpty ? (
        <div className="flex flex-col items-center justify-center text-slate-700 select-none">
          <span className="text-xs font-mono tracking-widest uppercase">
            {isLive ? 'LIVE OUTPUT CLEARED (BLACKOUT)' : 'NO CONTENT IN PREVIEW'}
          </span>
        </div>
      ) : (
        <div className="relative z-10 flex flex-col items-center justify-center text-center max-w-lg px-3 transition-opacity duration-150">
          {/* Scripture Reference & Translation Tag */}
          <div className="mb-3 flex items-center gap-1.5">
            <span className="text-[#f59e0b] font-bold text-xs sm:text-sm tracking-wider uppercase drop-shadow">
              {reference}
            </span>
            <span className="text-slate-400 font-semibold text-[11px] sm:text-xs tracking-wider uppercase">
              {translation || 'KJV'}
            </span>
          </div>

          {/* Scripture Verse Text */}
          <h2
            className="text-white font-extrabold leading-tight tracking-tight drop-shadow-md transition-all duration-150"
            style={{
              fontSize: `${25 * scaleMultiplier}px`,
            }}
          >
            {text}
          </h2>
        </div>
      )}
    </div>
  );
};
