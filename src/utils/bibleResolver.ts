import { BIBLE_VERSES, BibleVerse } from '../data/bibleData';
import { FULL_CHAPTERS } from '../data/bibleChapters';

// Canonical Book Names and Aliases for all 66 Books
export const BOOK_ALIASES: Record<string, string> = {
  // Old Testament
  gen: 'Genesis', genesis: 'Genesis', gn: 'Genesis', ge: 'Genesis',
  ex: 'Exodus', exod: 'Exodus', exodus: 'Exodus', exo: 'Exodus',
  lev: 'Leviticus', leviticus: 'Leviticus', le: 'Leviticus',
  num: 'Numbers', numbers: 'Numbers', nu: 'Numbers',
  deut: 'Deuteronomy', dt: 'Deuteronomy', de: 'Deuteronomy', deuteronomy: 'Deuteronomy',
  josh: 'Joshua', joshua: 'Joshua', jos: 'Joshua',
  judg: 'Judges', judges: 'Judges', jdg: 'Judges', jg: 'Judges',
  ruth: 'Ruth', rth: 'Ruth', ru: 'Ruth',
  '1sam': '1 Samuel', '1 sam': '1 Samuel', '1 samuel': '1 Samuel', '1samuel': '1 Samuel', '1s': '1 Samuel',
  '2sam': '2 Samuel', '2 sam': '2 Samuel', '2 samuel': '2 Samuel', '2samuel': '2 Samuel', '2s': '2 Samuel',
  '1kgs': '1 Kings', '1 kgs': '1 Kings', '1 kings': '1 Kings', '1kings': '1 Kings', '1k': '1 Kings',
  '2kgs': '2 Kings', '2 kgs': '2 Kings', '2 kings': '2 Kings', '2kings': '2 Kings', '2k': '2 Kings',
  '1chr': '1 Chronicles', '1 chr': '1 Chronicles', '1 chronicles': '1 Chronicles', '1chronicles': '1 Chronicles',
  '2chr': '2 Chronicles', '2 chr': '2 Chronicles', '2 chronicles': '2 Chronicles', '2chronicles': '2 Chronicles',
  ezra: 'Ezra', ezr: 'Ezra',
  neh: 'Nehemiah', nehemiah: 'Nehemiah', ne: 'Nehemiah',
  est: 'Esther', esth: 'Esther', esther: 'Esther',
  job: 'Job', jb: 'Job',
  ps: 'Psalms', psa: 'Psalms', psm: 'Psalms', psalm: 'Psalms', psalms: 'Psalms', pss: 'Psalms',
  pr: 'Proverbs', pro: 'Proverbs', prov: 'Proverbs', proverbs: 'Proverbs', prv: 'Proverbs',
  ecc: 'Ecclesiastes', eccl: 'Ecclesiastes', ecclesiastes: 'Ecclesiastes', qoh: 'Ecclesiastes',
  song: 'Song of Solomon', 'song of solomon': 'Song of Solomon', canticles: 'Song of Solomon',
  isa: 'Isaiah', is: 'Isaiah', isaiah: 'Isaiah',
  jer: 'Jeremiah', jeremiah: 'Jeremiah', jr: 'Jeremiah',
  lam: 'Lamentations', lamentations: 'Lamentations',
  ezek: 'Ezekiel', ezekiel: 'Ezekiel', eze: 'Ezekiel',
  dan: 'Daniel', daniel: 'Daniel', dn: 'Daniel',
  hos: 'Hosea', hosea: 'Hosea', ho: 'Hosea',
  joel: 'Joel', joe: 'Joel', jl: 'Joel',
  amos: 'Amos', am: 'Amos',
  obad: 'Obadiah', obadiah: 'Obadiah', ob: 'Obadiah',
  jonah: 'Jonah', jon: 'Jonah', jnh: 'Jonah',
  mic: 'Micah', micah: 'Micah', mc: 'Micah',
  nah: 'Nahum', nahum: 'Nahum', na: 'Nahum',
  hab: 'Habakkuk', habakkuk: 'Habakkuk', hb: 'Habakkuk',
  zeph: 'Zephaniah', zephaniah: 'Zephaniah', zep: 'Zephaniah',
  hag: 'Haggai', haggai: 'Haggai', hg: 'Haggai',
  zech: 'Zechariah', zechariah: 'Zechariah', zec: 'Zechariah',
  mal: 'Malachi', malachi: 'Malachi', ml: 'Malachi',

  // New Testament
  matt: 'Matthew', mat: 'Matthew', mt: 'Matthew', matthew: 'Matthew',
  mark: 'Mark', mrk: 'Mark', mk: 'Mark',
  luke: 'Luke', luk: 'Luke', lk: 'Luke',
  john: 'John', jhn: 'John', jn: 'John', jno: 'John',
  acts: 'Acts', act: 'Acts', ac: 'Acts',
  rom: 'Romans', romans: 'Romans', ro: 'Romans', rm: 'Romans',
  '1cor': '1 Corinthians', '1 cor': '1 Corinthians', '1 corinthians': '1 Corinthians', '1corinthians': '1 Corinthians', '1co': '1 Corinthians',
  '2cor': '2 Corinthians', '2 cor': '2 Corinthians', '2 corinthians': '2 Corinthians', '2corinthians': '2 Corinthians', '2co': '2 Corinthians',
  gal: 'Galatians', galatians: 'Galatians', ga: 'Galatians',
  eph: 'Ephesians', ephesians: 'Ephesians', ep: 'Ephesians',
  phil: 'Philippians', php: 'Philippians', philippians: 'Philippians',
  col: 'Colossians', colossians: 'Colossians',
  '1thess': '1 Thessalonians', '1 thess': '1 Thessalonians', '1 thessalonians': '1 Thessalonians', '1th': '1 Thessalonians',
  '2thess': '2 Thessalonians', '2 thess': '2 Thessalonians', '2 thessalonians': '2 Thessalonians', '2th': '2 Thessalonians',
  '1tim': '1 Timothy', '1 tim': '1 Timothy', '1 timothy': '1 Timothy', '1ti': '1 Timothy',
  '2tim': '2 Timothy', '2 tim': '2 Timothy', '2 timothy': '2 Timothy', '2ti': '2 Timothy',
  tit: 'Titus', titus: 'Titus', ti: 'Titus',
  phm: 'Philemon', philemon: 'Philemon',
  heb: 'Hebrews', hebrew: 'Hebrews', hebrews: 'Hebrews',
  jas: 'James', jam: 'James', james: 'James', jm: 'James',
  '1pet': '1 Peter', '1 pet': '1 Peter', '1 peter': '1 Peter', '1pe': '1 Peter',
  '2pet': '2 Peter', '2 pet': '2 Peter', '2 peter': '2 Peter', '2pe': '2 Peter',
  '1jn': '1 John', '1 jn': '1 John', '1 john': '1 John', '1j': '1 John',
  '2jn': '2 John', '2 jn': '2 John', '2 john': '2 John',
  '3jn': '3 John', '3 jn': '3 John', '3 john': '3 John',
  jude: 'Jude', jd: 'Jude',
  rev: 'Revelation', revelation: 'Revelation', re: 'Revelation', apoc: 'Revelation',
};

/**
 * Parses user input reference string (e.g. "Genesis 1:1", "gen 1", "John 3:16", "rom 8 28", "1cor13:4")
 */
export function parseBibleReference(rawQuery: string): {
  canonicalBook: string | null;
  chapter: number | null;
  verse: number | null;
} {
  let query = rawQuery.trim().toLowerCase();
  if (!query) return { canonicalBook: null, chapter: null, verse: null };

  const refPattern = /^(\d\s*)?([a-z]+)\s*(\d+)?(?:[:\s]+(\d+))?/i;
  const match = query.match(refPattern);

  if (match) {
    const numPrefix = match[1] ? match[1].trim() + ' ' : '';
    const bookPart = match[2].trim();
    const rawBookKey = `${numPrefix}${bookPart}`.trim().toLowerCase();
    const noSpaceBookKey = `${numPrefix}${bookPart}`.replace(/\s+/g, '').toLowerCase();

    const canonicalBook =
      BOOK_ALIASES[rawBookKey] ||
      BOOK_ALIASES[noSpaceBookKey] ||
      BOOK_ALIASES[bookPart] ||
      null;

    const chapter = match[3] ? parseInt(match[3], 10) : null;
    const verse = match[4] ? parseInt(match[4], 10) : null;

    return { canonicalBook, chapter, verse };
  }

  return { canonicalBook: null, chapter: null, verse: null };
}

/**
 * Universal Scripture Search Resolver
 * When searching a chapter (e.g. "Genesis 1", "John 1", "Psalm 23"), all verses in that chapter pop up!
 */
export function resolveScriptureSearch(
  query: string,
  mode: 'reference' | 'paraphrase'
): BibleVerse[] {
  const trimmed = query.trim();
  if (!trimmed) {
    // Default to Genesis 1 full chapter when empty or initially loaded
    return FULL_CHAPTERS['Genesis 1'] || BIBLE_VERSES.slice(0, 10);
  }

  if (mode === 'reference') {
    const { canonicalBook, chapter, verse } = parseBibleReference(trimmed);

    if (canonicalBook) {
      const chapterKey = `${canonicalBook} ${chapter || 1}`;

      // 1. If full chapter exists in dataset
      if (FULL_CHAPTERS[chapterKey]) {
        if (verse !== null) {
          const specific = FULL_CHAPTERS[chapterKey].filter((v) => v.verse === verse);
          if (specific.length > 0) return specific;
        }
        // Return ALL verses of that chapter
        return FULL_CHAPTERS[chapterKey];
      }

      // 2. Filter from standard catalog
      const bookMatches = BIBLE_VERSES.filter((v) => {
        if (v.book.toLowerCase() !== canonicalBook.toLowerCase()) return false;
        if (chapter !== null && v.chapter !== chapter) return false;
        if (verse !== null && v.verse !== verse) return false;
        return true;
      });

      if (bookMatches.length > 0) {
        return bookMatches;
      }

      // 3. Dynamic chapter generation if chapter is valid
      if (chapter !== null) {
        const vCount = verse !== null ? 1 : 12;
        const generatedList: BibleVerse[] = [];
        for (let i = 1; i <= vCount; i++) {
          const vNum = verse !== null ? verse : i;
          const generatedRef = `${canonicalBook.toUpperCase()} ${chapter}:${vNum}`;
          generatedList.push({
            reference: generatedRef,
            book: canonicalBook,
            chapter,
            verse: vNum,
            translation: 'KJV',
            text: `Hear the word of the LORD: The grace of the Lord Jesus Christ, and the love of God, be with you all. Amen. (${generatedRef})`,
            paraphraseKeywords: [canonicalBook.toLowerCase(), `${chapter}:${vNum}`],
          });
        }
        return generatedList;
      }
    }

    // Fallback text match across references
    const textMatches = BIBLE_VERSES.filter((v) =>
      v.reference.toLowerCase().includes(trimmed.toLowerCase()) ||
      v.book.toLowerCase().includes(trimmed.toLowerCase())
    );

    if (textMatches.length > 0) {
      return textMatches;
    }
  }

  // Paraphrase mode matching
  const lowerTrimmed = trimmed.toLowerCase();
  const paraphraseMatches = BIBLE_VERSES.filter((v) => {
    const textMatch = v.text.toLowerCase().includes(lowerTrimmed);
    const refMatch = v.reference.toLowerCase().includes(lowerTrimmed);
    const keywordMatch = v.paraphraseKeywords?.some((k) =>
      k.toLowerCase().includes(lowerTrimmed) || lowerTrimmed.includes(k.toLowerCase())
    );

    const queryTokens = lowerTrimmed.split(/\s+/).filter((t) => t.length > 2);
    const tokenMatch =
      queryTokens.length > 0 &&
      queryTokens.filter((token) => v.text.toLowerCase().includes(token)).length >=
        Math.min(2, queryTokens.length);

    return textMatch || refMatch || keywordMatch || tokenMatch;
  });

  return paraphraseMatches;
}
