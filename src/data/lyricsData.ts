export interface LyricSection {
  id: string;
  songTitle: string;
  author?: string;
  sectionTitle: string; // e.g., 'Verse 1', 'Chorus', 'Verse 2', 'Bridge'
  reference: string; // e.g. 'AMAZING GRACE (V1)'
  text: string;
}

export interface Song {
  id: string;
  title: string;
  author: string;
  sections: LyricSection[];
}

export const HYMNS_AND_SONGS: Song[] = [
  {
    id: 'amazing_grace',
    title: 'Amazing Grace',
    author: 'John Newton',
    sections: [
      {
        id: 'ag_1',
        songTitle: 'Amazing Grace',
        author: 'John Newton',
        sectionTitle: 'Verse 1',
        reference: 'AMAZING GRACE (V1)',
        text: 'Amazing grace! How sweet the sound, That saved a wretch like me! I once was lost, but now am found; Was blind, but now I see.',
      },
      {
        id: 'ag_2',
        songTitle: 'Amazing Grace',
        author: 'John Newton',
        sectionTitle: 'Verse 2',
        reference: 'AMAZING GRACE (V2)',
        text: '’Twas grace that taught my heart to fear, And grace my fears relieved; How precious did that grace appear The hour I first believed!',
      },
      {
        id: 'ag_3',
        songTitle: 'Amazing Grace',
        author: 'John Newton',
        sectionTitle: 'Verse 3',
        reference: 'AMAZING GRACE (V3)',
        text: 'Through many dangers, toils and snares, I have already come; ’Tis grace hath brought me safe thus far, And grace will lead me home.',
      },
      {
        id: 'ag_4',
        songTitle: 'Amazing Grace',
        author: 'John Newton',
        sectionTitle: 'Verse 4',
        reference: 'AMAZING GRACE (V4)',
        text: 'When we’ve been there ten thousand years, Bright shining as the sun, We’ve no less days to sing God’s praise Than when we’d first begun.',
      },
    ],
  },
  {
    id: 'how_great_thou_art',
    title: 'How Great Thou Art',
    author: 'Stuart K. Hine',
    sections: [
      {
        id: 'hg_1',
        songTitle: 'How Great Thou Art',
        author: 'Stuart K. Hine',
        sectionTitle: 'Verse 1',
        reference: 'HOW GREAT THOU ART (V1)',
        text: 'O Lord my God, when I in awesome wonder, Consider all the worlds Thy Hands have made; I see the stars, I hear the rolling thunder, Thy power throughout the universe displayed.',
      },
      {
        id: 'hg_c',
        songTitle: 'How Great Thou Art',
        author: 'Stuart K. Hine',
        sectionTitle: 'Chorus',
        reference: 'HOW GREAT THOU ART (CHORUS)',
        text: 'Then sings my soul, My Saviour God, to Thee, How great Thou art, How great Thou art! Then sings my soul, My Saviour God, to Thee, How great Thou art, How great Thou art!',
      },
      {
        id: 'hg_2',
        songTitle: 'How Great Thou Art',
        author: 'Stuart K. Hine',
        sectionTitle: 'Verse 2',
        reference: 'HOW GREAT THOU ART (V2)',
        text: 'When through the woods, and forest glades I wander, And hear the birds sing sweetly in the trees; When I look down, from lofty mountain grandeur, And see the brook, and feel the gentle breeze.',
      },
    ],
  },
  {
    id: 'great_is_thy_faithfulness',
    title: 'Great Is Thy Faithfulness',
    author: 'Thomas Chisholm',
    sections: [
      {
        id: 'gf_1',
        songTitle: 'Great Is Thy Faithfulness',
        author: 'Thomas Chisholm',
        sectionTitle: 'Verse 1',
        reference: 'GREAT IS THY FAITHFULNESS (V1)',
        text: 'Great is Thy faithfulness, O God my Father, There is no shadow of turning with Thee; Thou changest not, Thy compassions, they fail not; As Thou hast been Thou forever wilt be.',
      },
      {
        id: 'gf_c',
        songTitle: 'Great Is Thy Faithfulness',
        author: 'Thomas Chisholm',
        sectionTitle: 'Chorus',
        reference: 'GREAT IS THY FAITHFULNESS (CHORUS)',
        text: 'Great is Thy faithfulness! Great is Thy faithfulness! Morning by morning new mercies I see; All I have needed Thy hand hath provided— Great is Thy faithfulness, Lord, unto me!',
      },
      {
        id: 'gf_2',
        songTitle: 'Great Is Thy Faithfulness',
        author: 'Thomas Chisholm',
        sectionTitle: 'Verse 2',
        reference: 'GREAT IS THY FAITHFULNESS (V2)',
        text: 'Pardon for sin and a peace that endureth, Thine own dear presence to cheer and to guide; Strength for today and bright hope for tomorrow, Blessings all mine, with ten thousand beside!',
      },
    ],
  },
  {
    id: 'in_christ_alone',
    title: 'In Christ Alone',
    author: 'Keith Getty & Stuart Townend',
    sections: [
      {
        id: 'ica_1',
        songTitle: 'In Christ Alone',
        author: 'Keith Getty & Stuart Townend',
        sectionTitle: 'Verse 1',
        reference: 'IN CHRIST ALONE (V1)',
        text: 'In Christ alone my hope is found, He is my light, my strength, my song; This cornerstone, this solid ground, Firm through the fiercest drought and storm.',
      },
      {
        id: 'ica_2',
        songTitle: 'In Christ Alone',
        author: 'Keith Getty & Stuart Townend',
        sectionTitle: 'Verse 2',
        reference: 'IN CHRIST ALONE (V2)',
        text: 'In Christ alone! Who took on flesh, Fullness of God in helpless babe! This gift of love and righteousness, Scorned by the ones He came to save.',
      },
      {
        id: 'ica_3',
        songTitle: 'In Christ Alone',
        author: 'Keith Getty & Stuart Townend',
        sectionTitle: 'Verse 3',
        reference: 'IN CHRIST ALONE (V3)',
        text: 'No guilt in life, no fear in death, This is the power of Christ in me; From life’s first cry to final breath, Jesus commands my destiny.',
      },
    ],
  },
  {
    id: 'blessed_assurance',
    title: 'Blessed Assurance',
    author: 'Fanny Crosby',
    sections: [
      {
        id: 'ba_1',
        songTitle: 'Blessed Assurance',
        author: 'Fanny Crosby',
        sectionTitle: 'Verse 1',
        reference: 'BLESSED ASSURANCE (V1)',
        text: 'Blessed assurance, Jesus is mine! Oh, what a foretaste of glory divine! Heir of salvation, purchase of God, Born of His Spirit, washed in His blood.',
      },
      {
        id: 'ba_c',
        songTitle: 'Blessed Assurance',
        author: 'Fanny Crosby',
        sectionTitle: 'Chorus',
        reference: 'BLESSED ASSURANCE (CHORUS)',
        text: 'This is my story, this is my song, Praising my Savior all the day long; This is my story, this is my song, Praising my Savior all the day long.',
      },
    ],
  },
  {
    id: 'ten_thousand_reasons',
    title: '10,000 Reasons (Bless The Lord)',
    author: 'Matt Redman',
    sections: [
      {
        id: 'tr_c',
        songTitle: '10,000 Reasons',
        author: 'Matt Redman',
        sectionTitle: 'Chorus',
        reference: '10,000 REASONS (CHORUS)',
        text: 'Bless the Lord, O my soul, O my soul, Worship His holy name. Sing like never before, O my soul. I’ll worship Your holy name.',
      },
      {
        id: 'tr_1',
        songTitle: '10,000 Reasons',
        author: 'Matt Redman',
        sectionTitle: 'Verse 1',
        reference: '10,000 REASONS (V1)',
        text: 'The sun comes up, it’s a new day dawning; It’s time to sing Your song again. Whatever may pass, and whatever lies before me, Let me be singing when the evening comes.',
      },
    ],
  },
];

export function searchHymnLyrics(query: string): LyricSection[] {
  const q = query.trim().toLowerCase();
  if (!q) {
    return HYMNS_AND_SONGS[0].sections;
  }

  const results: LyricSection[] = [];

  for (const song of HYMNS_AND_SONGS) {
    const titleMatch = song.title.toLowerCase().includes(q);
    for (const sec of song.sections) {
      if (
        titleMatch ||
        sec.reference.toLowerCase().includes(q) ||
        sec.text.toLowerCase().includes(q)
      ) {
        results.push(sec);
      }
    }
  }

  return results.length > 0 ? results : HYMNS_AND_SONGS[0].sections;
}
