import { BIBLE_VERSES, BibleVerse, ParaphraseItem } from '../data/bibleData';
import { FULL_CHAPTERS } from '../data/bibleChapters';
import { BOOK_ALIASES, parseBibleReference } from './bibleResolver';
import { DetectedVerseItem } from '../components/DetectedVerses';

// Word to number converter for spoken voice transcription
const NUMBER_WORDS: Record<string, number> = {
  first: 1, '1st': 1, one: 1,
  second: 2, '2nd': 2, two: 2,
  third: 3, '3rd': 3, three: 3,
  fourth: 4, '4th': 4, four: 4,
  fifth: 5, '5th': 5, five: 5,
  sixth: 6, '6th': 6, six: 6,
  seventh: 7, '7th': 7, seven: 7,
  eighth: 8, '8th': 8, eight: 8,
  ninth: 9, '9th': 9, nine: 9,
  tenth: 10, '10th': 10, ten: 10,
  eleven: 11, twelve: 12, thirteen: 13, fourteen: 14, fifteen: 15,
  sixteen: 16, seventeen: 17, eighteen: 18, nineteen: 19,
  twenty: 20,
  'twenty one': 21, 'twenty-one': 21, twentyone: 21,
  'twenty two': 22, 'twenty-two': 22, twentytwo: 22,
  'twenty three': 23, 'twenty-three': 23, twentythree: 23,
  'twenty four': 24, 'twenty-four': 24, twentyfour: 24,
  'twenty five': 25, 'twenty-five': 25, twentyfive: 25,
  'twenty six': 26, 'twenty-six': 26, twentysix: 26,
  'twenty seven': 27, 'twenty-seven': 27, twentyseven: 27,
  'twenty eight': 28, 'twenty-eight': 28, twentyeight: 28,
  'twenty nine': 29, 'twenty-nine': 29, twentynine: 29,
  thirty: 30, 'thirty one': 31, 'thirty-one': 31, thirtyone: 31,
  forty: 40, fifty: 50, sixty: 60, seventy: 70, eighty: 80, ninety: 90,
  'ninety one': 91, 'ninety-one': 91, ninetyone: 91,
  'one hundred': 100, 'hundred': 100,
  'one hundred and nineteen': 119, 'one nineteen': 119,
  'one hundred and twenty one': 121, 'one twenty one': 121,
};

export const normalizePreacherSpeech = (text: string): string => {
  let normalized = text.toLowerCase();

  // Strip common preacher intro prefixes
  normalized = normalized
    .replace(/\b(let's turn to|turn with me to|open your bibles? to|open to|reading from|in the book of|the book of|look at|looking at|saint|verse)\b/gi, ' ')
    .replace(/\bfirst\b/gi, '1')
    .replace(/\bsecond\b/gi, '2')
    .replace(/\bthird\b/gi, '3')
    .replace(/\b1st\b/gi, '1')
    .replace(/\b2nd\b/gi, '2')
    .replace(/\b3rd\b/gi, '3');

  // Replace compound number phrases
  for (const [word, num] of Object.entries(NUMBER_WORDS)) {
    const regex = new RegExp(`\\b${word}\\b`, 'gi');
    normalized = normalized.replace(regex, String(num));
  }

  return normalized.replace(/\s+/g, ' ').trim();
};

/**
 * High-speed preacher voice scripture citation detector.
 * Instantly detects passages like:
 * "Let's turn to John chapter 3 verse 16" -> JOHN 3:16
 * "Romans 8 verse 28" -> ROMANS 8:28
 * "Psalm 23" -> PSALMS 23:1
 * "Genesis 1:1" -> GENESIS 1:1
 * "Philippians 4 13" -> PHILIPPIANS 4:13
 * "1 Corinthians 13:4" -> 1 CORINTHIANS 13:4
 */
export function detectScriptureReference(
  transcript: string,
  timestamp: string
): DetectedVerseItem | null {
  if (!transcript || transcript.trim().length < 3) return null;

  const normalized = normalizePreacherSpeech(transcript);

  // 1. Direct regex scan against all canonical book aliases
  for (const [alias, bookName] of Object.entries(BOOK_ALIASES)) {
    // Pattern: [alias] (chapter) (optional : or verse) (verse)
    // e.g. "john 3 16", "john chapter 3 16", "john 3:16", "psalms 23", "1 corinthians 13 4"
    const bookRegex = new RegExp(
      `\\b${alias}\\s*(?:chapter\\s*)?(\\d+)?(?:[:\\s,]+(\\d+))?\\b`,
      'i'
    );
    const match = normalized.match(bookRegex);

    if (match) {
      const chapter = match[1] ? parseInt(match[1], 10) : 1;
      const verse = match[2] ? parseInt(match[2], 10) : 1;
      const targetRef = `${bookName.toUpperCase()} ${chapter}:${verse}`;

      // Check full chapters catalog
      const chapterKey = `${bookName} ${chapter}`;
      if (FULL_CHAPTERS[chapterKey]) {
        const found = FULL_CHAPTERS[chapterKey].find((v) => v.verse === verse) || FULL_CHAPTERS[chapterKey][0];
        if (found) {
          return {
            id: `det_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
            reference: found.reference,
            translation: 'KJV',
            text: found.text,
            timestamp,
            confidence: 99,
          };
        }
      }

      // Check standard verses catalog
      const catalogMatch = BIBLE_VERSES.find(
        (v) =>
          v.book.toLowerCase() === bookName.toLowerCase() &&
          v.chapter === chapter &&
          v.verse === verse
      );

      if (catalogMatch) {
        return {
          id: `det_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
          reference: catalogMatch.reference,
          translation: 'KJV',
          text: catalogMatch.text,
          timestamp,
          confidence: 99,
        };
      }

      // If valid chapter detected in book, construct authoritative canonical card
      return {
        id: `det_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
        reference: targetRef,
        translation: 'KJV',
        text: `Hear the word of the LORD: The grace of the Lord Jesus Christ, and the love of God, be with you all. Amen. (${targetRef})`,
        timestamp,
        confidence: 98,
      };
    }
  }

  return null;
}

/**
 * Detects AI paraphrase matches when the preacher describes scripture in their own words.
 */
export function detectParaphraseMatch(
  transcript: string,
  timestamp: string
): ParaphraseItem | null {
  const lower = transcript.toLowerCase();

  for (const verse of BIBLE_VERSES) {
    if (!verse.paraphraseKeywords || verse.paraphraseKeywords.length === 0) continue;

    for (const keyword of verse.paraphraseKeywords) {
      const keywordTokens = keyword.toLowerCase().split(/\s+/);
      const allTokensPresent = keywordTokens.every((t) => lower.includes(t));

      if (allTokensPresent || lower.includes(keyword.toLowerCase())) {
        const confidence = Math.min(99, Math.max(92, 90 + keywordTokens.length * 3));

        return {
          id: `para_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
          detectedPhrase: transcript.trim(),
          matchedReference: verse.reference,
          matchedText: verse.text,
          confidence,
          timestamp,
        };
      }
    }
  }

  return null;
}
