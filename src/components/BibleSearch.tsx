import React, { useState, useMemo, useRef, useEffect } from 'react';
import { Search, ChevronDown, Check, Music } from 'lucide-react';
import { TRANSLATIONS, BibleVerse } from '../data/bibleData';
import { resolveScriptureSearch } from '../utils/bibleResolver';
import { searchHymnLyrics, LyricSection } from '../data/lyricsData';

interface BibleSearchProps {
  onSelectVerse: (
    verse: { reference: string; translation: string; text: string },
    contextList?: BibleVerse[]
  ) => void;
  activePreviewRef?: string;
  appMode?: 'BIBLE' | 'LYRICS';
}

// Comparative modern English translation text for the COMPARE toggle feature
const COMPARATIVE_TEXTS: Record<string, string> = {
  'GENESIS 1:1': 'In the beginning God created the heavens and the earth.',
  'GENESIS 1:2': 'Now the earth was formless and empty, darkness was over the surface of the deep, and the Spirit of God was hovering over the waters.',
  'GENESIS 1:3': 'And God said, "Let there be light," and there was light.',
  'GENESIS 1:4': 'God saw that the light was good, and he separated the light from the darkness.',
  'GENESIS 1:5': 'God called the light "day," and the darkness he called "night." And there was evening, and there was morning—the first day.',
  'JOHN 1:1': 'In the beginning was the Word, and the Word was with God, and the Word was God.',
  'JOHN 1:2': 'He was with God in the beginning.',
  'JOHN 3:16': 'For God so loved the world that he gave his one and only Son, that whoever believes in him shall not perish but have eternal life.',
  'PSALMS 23:1': 'The LORD is my shepherd, I lack nothing.',
  'PSALMS 23:4': 'Even though I walk through the darkest valley, I will fear no evil, for you are with me; your rod and your staff, they comfort me.',
  'ROMANS 8:28': 'And we know that in all things God works for the good of those who love him, who have been called according to his purpose.',
  'PHILIPPIANS 4:13': 'I can do all this through him who gives me strength.',
  'PROVERBS 3:5': 'Trust in the LORD with all your heart and lean not on your own understanding;',
  'PROVERBS 3:6': 'in all your ways submit to him, and he will make your paths straight.',
  'JEREMIAH 29:11': '"For I know the plans I have for you," declares the LORD, "plans to prosper you and not to harm you, plans to give you hope and a future."',
  'ISAIAH 40:31': 'but those who hope in the LORD will renew their strength. They will soar on wings like eagles; they will run and not grow weary, they will walk and not be faint.',
  '1 CORINTHIANS 13:4': 'Love is patient, love is kind. It does not envy, it does not boast, it is not proud.',
  'HEBREWS 11:1': 'Now faith is confidence in what we hope for and assurance about what we do not see.',
  'MATTHEW 28:19': 'Therefore go and make disciples of all nations, baptizing them in the name of the Father and of the Son and of the Holy Spirit,',
  '2 TIMOTHY 1:7': 'For the Spirit God gave us does not make us timid, but gives us power, love and self-discipline.',
};

export const BibleSearch: React.FC<BibleSearchProps> = React.memo(({
  onSelectVerse,
  activePreviewRef,
  appMode = 'BIBLE',
}) => {
  const [mode, setMode] = useState<'reference' | 'paraphrase'>('paraphrase');
  const [translation, setTranslation] = useState<string>('KJV');
  const [showTransDropdown, setShowTransDropdown] = useState<boolean>(false);
  const [query, setQuery] = useState<string>('genesis 1');
  const [compare, setCompare] = useState<boolean>(false);

  const dropdownRef = useRef<HTMLDivElement>(null);

  // Sync default search query when switching mode
  useEffect(() => {
    if (appMode === 'LYRICS') {
      setQuery('Amazing Grace');
    } else {
      setQuery('genesis 1');
    }
  }, [appMode]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowTransDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Filter and search verses or lyrics instantly
  const searchResults = useMemo(() => {
    if (appMode === 'LYRICS') {
      const lyrics = searchHymnLyrics(query);
      return lyrics.map((l: LyricSection) => ({
        reference: l.reference,
        book: l.songTitle,
        chapter: 1,
        verse: 1,
        translation: 'HYMN',
        text: l.text,
      }));
    }
    return resolveScriptureSearch(query, mode);
  }, [query, mode, appMode]);

  const handleSelect = (verse: BibleVerse) => {
    onSelectVerse(
      {
        reference: verse.reference,
        translation: appMode === 'LYRICS' ? 'HYMN' : translation,
        text: verse.text,
      },
      searchResults
    );
  };

  return (
    <div className="h-full bg-[#0c0f17] border border-[#1b2230] rounded-xl flex flex-col p-4 overflow-hidden select-none">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-[#18202e] gap-2 shrink-0">
        <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400 truncate">
          {appMode === 'LYRICS' ? 'LYRICS SEARCH' : 'SEARCH'}: &quot;
          {query.trim().toUpperCase() || (appMode === 'LYRICS' ? 'AMAZING GRACE' : 'GENESIS 1')}&quot;
          {searchResults.length > 1 && (
            <span className="text-[10px] text-blue-400 font-normal ml-1.5 lowercase">
              ({searchResults.length} {appMode === 'LYRICS' ? 'sections' : 'verses'})
            </span>
          )}
        </h2>

        {/* Right Controls: REFERENCE, PARAPHRASE, Translation Dropdown */}
        <div className="flex items-center gap-1.5 shrink-0">
          {appMode === 'LYRICS' ? (
            <div className="flex items-center gap-1 px-2.5 py-1 rounded bg-[#121929] border border-blue-500/40 text-xs font-bold text-blue-400">
              <Music className="w-3.5 h-3.5" />
              <span>HYMNS</span>
            </div>
          ) : (
            <>
              <button
                onClick={() => setMode('reference')}
                className={`px-2.5 py-1 rounded text-xs font-bold uppercase tracking-wide transition-colors cursor-pointer ${
                  mode === 'reference'
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'bg-[#121622] text-slate-400 hover:text-slate-200'
                }`}
              >
                REFERENCE
              </button>
              <button
                onClick={() => setMode('paraphrase')}
                className={`px-2.5 py-1 rounded text-xs font-bold uppercase tracking-wide transition-colors cursor-pointer ${
                  mode === 'paraphrase'
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'bg-[#121622] text-slate-400 hover:text-slate-200'
                }`}
              >
                PARAPHRASE
              </button>

              {/* Translation Dropdown */}
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setShowTransDropdown(!showTransDropdown)}
                  className="flex items-center gap-1 px-2.5 py-1 rounded bg-[#121622] border border-[#20283a] text-xs font-bold text-slate-300 hover:border-slate-500 transition-colors cursor-pointer"
                >
                  <span>{translation}</span>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                </button>

                {showTransDropdown && (
                  <div className="absolute top-full mt-1.5 right-0 w-24 bg-[#0e121a] border border-[#222a3d] rounded-lg shadow-2xl py-1 z-50">
                    {TRANSLATIONS.map((t) => (
                      <button
                        key={t}
                        onClick={() => {
                          setTranslation(t);
                          setShowTransDropdown(false);
                        }}
                        className={`w-full px-2.5 py-1.5 text-left text-xs flex items-center justify-between hover:bg-[#161c2b] transition-colors ${
                          translation === t
                            ? 'text-blue-400 font-bold bg-[#121929]'
                            : 'text-slate-300'
                        }`}
                      >
                        <span>{t}</span>
                        {translation === t && <Check className="w-3 h-3" />}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Search Input Bar */}
      <div className="pt-3 shrink-0">
        <div className="flex items-center gap-3">
          <div className="relative flex-1 flex items-center border-2 border-blue-500/90 shadow-[0_0_12px_rgba(59,130,246,0.2)] bg-[#090d15] rounded-lg px-3 py-1.5 focus-within:ring-2 focus-within:ring-blue-400">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={
                appMode === 'LYRICS'
                  ? 'Search hymns e.g. Amazing Grace, How Great Thou Art, 10000 Reasons...'
                  : mode === 'reference'
                  ? 'Enter reference e.g. Genesis 1, Psalm 23, John 3:16...'
                  : 'Enter description e.g. God created the heavens, the word was...'
              }
              className="w-full bg-transparent text-sm text-slate-100 placeholder-slate-500 focus:outline-none font-medium"
            />
            <div className="text-slate-400 p-0.5">
              <Search className="w-4 h-4" />
            </div>
          </div>

          {/* Compare toggle */}
          {appMode !== 'LYRICS' && (
            <div className="flex items-center gap-2 shrink-0">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                COMPARE
              </span>
              <button
                type="button"
                onClick={() => setCompare(!compare)}
                title="Toggle Parallel Translation Comparison"
                className={`w-9 h-5 flex items-center rounded-full p-0.5 transition-colors duration-200 cursor-pointer ${
                  compare ? 'bg-blue-600 justify-end' : 'bg-slate-700 justify-start'
                }`}
              >
                <span className="bg-white w-4 h-4 rounded-full shadow-md transform transition-transform" />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Search Results Area */}
      <div className="flex-1 overflow-y-auto mt-3 space-y-2.5 pr-1">
        {searchResults.length > 0 ? (
          searchResults.map((verse) => {
            const isSelectedInPreview =
              activePreviewRef?.toUpperCase() === verse.reference.toUpperCase();

            const comparativeText = COMPARATIVE_TEXTS[verse.reference] || verse.text;

            return (
              <div
                key={verse.reference}
                onClick={() => handleSelect(verse)}
                className={`p-2.5 rounded-lg border transition-all cursor-pointer select-none active:scale-[0.99] ${
                  isSelectedInPreview
                    ? 'bg-[#151c2d] border-blue-500/70 ring-1 ring-blue-500/40 shadow-sm'
                    : 'bg-[#111624] border-[#1e2638] hover:border-slate-500 hover:bg-[#141b2b]'
                }`}
              >
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-xs font-bold tracking-wide ${
                        isSelectedInPreview ? 'text-blue-400 font-extrabold' : 'text-[#f59e0b]'
                      }`}
                    >
                      {verse.reference}
                    </span>
                    <span className="text-[10px] text-slate-400 uppercase font-semibold">
                      {appMode === 'LYRICS' ? 'HYMN' : translation}
                    </span>
                    {compare && appMode !== 'LYRICS' && (
                      <span className="text-[9px] font-mono text-emerald-400 bg-emerald-950/60 border border-emerald-500/30 px-1.5 py-0.2 rounded">
                        PARALLEL VIEW
                      </span>
                    )}
                  </div>
                  <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider group-hover:text-slate-300">
                    Stage to Preview ➔
                  </span>
                </div>

                {/* Standard View */}
                <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                  {verse.text}
                </p>

                {/* Compare View: Shows Parallel Translation inside the existing card */}
                {compare && appMode !== 'LYRICS' && (
                  <div className="mt-2 pt-2 border-t border-[#1e2638] text-[11px] text-slate-400 bg-[#0c0f17]/60 p-2 rounded">
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-0.5">
                      Modern Parallel:
                    </span>
                    <p className="italic text-slate-300">{comparativeText}</p>
                  </div>
                )}
              </div>
            );
          })
        ) : (
          <div className="h-full flex flex-col items-center justify-center text-center p-6 text-slate-500 text-xs">
            <span>No results found matching &quot;{query}&quot;</span>
            <span className="text-slate-600 text-[11px] mt-1">
              {appMode === 'LYRICS'
                ? 'Try searching "Amazing Grace", "How Great Thou Art", or "10000 Reasons"'
                : 'Try "Genesis 1", "Psalm 23", "John 1", or "Romans 8"'}
            </span>
          </div>
        )}
      </div>
    </div>
  );
});

BibleSearch.displayName = 'BibleSearch';
