export interface BibleVerse {
  reference: string;
  book: string;
  chapter: number;
  verse: number;
  text: string;
  translation: string;
  paraphraseKeywords?: string[];
}

export interface SermonPoint {
  id: string;
  pointNumber: number;
  title: string;
  timestamp: string;
  scriptureRef?: string;
}

export interface ParaphraseItem {
  id: string;
  detectedPhrase: string;
  matchedReference: string;
  matchedText: string;
  confidence: number;
  timestamp: string;
}

export const BIBLE_VERSES: BibleVerse[] = [
  // Genesis
  {
    reference: 'GENESIS 1:1',
    book: 'Genesis',
    chapter: 1,
    verse: 1,
    translation: 'KJV',
    text: 'In the beginning God created the heaven and the earth.',
    paraphraseKeywords: ['beginning', 'created heaven', 'start of everything', 'god made the world', 'creation'],
  },
  {
    reference: 'GENESIS 1:3',
    book: 'Genesis',
    chapter: 1,
    verse: 3,
    translation: 'KJV',
    text: 'And God said, Let there be light: and there was light.',
    paraphraseKeywords: ['let there be light', 'god spoke light', 'light be'],
  },
  {
    reference: 'GENESIS 1:26',
    book: 'Genesis',
    chapter: 1,
    verse: 26,
    translation: 'KJV',
    text: 'And God said, Let us make man in our image, after our likeness: and let them have dominion over the fish of the sea, and over the fowl of the air, and over the cattle, and over all the earth.',
    paraphraseKeywords: ['make man in our image', 'dominion over earth', 'our likeness'],
  },
  {
    reference: 'GENESIS 1:27',
    book: 'Genesis',
    chapter: 1,
    verse: 27,
    translation: 'KJV',
    text: 'So God created man in his own image, in the image of God created he him; male and female created he them.',
    paraphraseKeywords: ['in his own image', 'male and female created he them'],
  },
  {
    reference: 'GENESIS 12:1',
    book: 'Genesis',
    chapter: 12,
    verse: 1,
    translation: 'KJV',
    text: 'Now the LORD had said unto Abram, Get thee out of thy country, and from thy kindred, and from thy father\'s house, unto a land that I will shew thee:',
    paraphraseKeywords: ['call of abraham', 'get out of your country', 'father\'s house'],
  },
  {
    reference: 'GENESIS 12:2',
    book: 'Genesis',
    chapter: 12,
    verse: 2,
    translation: 'KJV',
    text: 'And I will make of thee a great nation, and I will bless thee, and make thy name great; and thou shalt be a blessing:',
    paraphraseKeywords: ['make you a great nation', 'i will bless you', 'you shall be a blessing'],
  },

  // Exodus
  {
    reference: 'EXODUS 3:14',
    book: 'Exodus',
    chapter: 3,
    verse: 14,
    translation: 'KJV',
    text: 'And God said unto Moses, I AM THAT I AM: and he said, Thus shalt thou say unto the children of Israel, I AM hath sent me unto you.',
    paraphraseKeywords: ['i am that i am', 'burning bush', 'god speaks to moses'],
  },
  {
    reference: 'EXODUS 14:14',
    book: 'Exodus',
    chapter: 14,
    verse: 14,
    translation: 'KJV',
    text: 'The LORD shall fight for you, and ye shall hold your peace.',
    paraphraseKeywords: ['lord shall fight for you', 'hold your peace', 'stand still'],
  },
  {
    reference: 'EXODUS 20:3',
    book: 'Exodus',
    chapter: 20,
    verse: 3,
    translation: 'KJV',
    text: 'Thou shalt have no other gods before me.',
    paraphraseKeywords: ['no other gods', 'ten commandments', 'first commandment'],
  },

  // Joshua
  {
    reference: 'JOSHUA 1:8',
    book: 'Joshua',
    chapter: 1,
    verse: 8,
    translation: 'KJV',
    text: 'This book of the law shall not depart out of thy mouth; but thou shalt meditate therein day and night, that thou mayest observe to do according to all that is written therein: for then thou shalt make thy way prosperous, and then thou shalt have good success.',
    paraphraseKeywords: ['book of the law', 'meditate day and night', 'good success', 'prosperous'],
  },
  {
    reference: 'JOSHUA 1:9',
    book: 'Joshua',
    chapter: 1,
    verse: 9,
    translation: 'KJV',
    text: 'Have not I commanded thee? Be strong and of a good courage; be not afraid, neither be thou dismayed: for the LORD thy God is with thee whithersoever thou goest.',
    paraphraseKeywords: ['be strong and courageous', 'do not be afraid', 'lord is with you'],
  },
  {
    reference: 'JOSHUA 24:15',
    book: 'Joshua',
    chapter: 24,
    verse: 15,
    translation: 'KJV',
    text: 'And if it seem evil unto you to serve the LORD, choose you this day whom ye will serve; but as for me and my house, we will serve the LORD.',
    paraphraseKeywords: ['as for me and my house', 'we will serve the lord', 'choose this day'],
  },

  // 2 Chronicles
  {
    reference: '2 CHRONICLES 7:14',
    book: '2 Chronicles',
    chapter: 7,
    verse: 14,
    translation: 'KJV',
    text: 'If my people, which are called by my name, shall humble themselves, and pray, and seek my face, and turn from their wicked ways; then will I hear from heaven, and will forgive their sin, and will heal their land.',
    paraphraseKeywords: ['if my people pray', 'humble themselves', 'heal their land', 'seek my face'],
  },

  // Psalms
  {
    reference: 'PSALMS 23:1',
    book: 'Psalms',
    chapter: 23,
    verse: 1,
    translation: 'KJV',
    text: 'The LORD is my shepherd; I shall not want.',
    paraphraseKeywords: ['lord is my shepherd', 'i shall not want', 'god guides me as a shepherd', 'lack nothing'],
  },
  {
    reference: 'PSALMS 23:2',
    book: 'Psalms',
    chapter: 23,
    verse: 2,
    translation: 'KJV',
    text: 'He maketh me to lie down in green pastures: he leadeth me beside the still waters.',
    paraphraseKeywords: ['green pastures', 'still waters', 'rest for my soul'],
  },
  {
    reference: 'PSALMS 23:4',
    book: 'Psalms',
    chapter: 23,
    verse: 4,
    translation: 'KJV',
    text: 'Yea, though I walk through the valley of the shadow of death, I will fear no evil: for thou art with me; thy rod and thy staff they comfort me.',
    paraphraseKeywords: ['valley of shadow of death', 'fear no evil', 'rod and staff', 'comfort me'],
  },
  {
    reference: 'PSALMS 23:6',
    book: 'Psalms',
    chapter: 23,
    verse: 6,
    translation: 'KJV',
    text: 'Surely goodness and mercy shall follow me all the days of my life: and I will dwell in the house of the LORD for ever.',
    paraphraseKeywords: ['goodness and mercy', 'dwell in house of the lord', 'forever'],
  },
  {
    reference: 'PSALMS 91:1',
    book: 'Psalms',
    chapter: 91,
    verse: 1,
    translation: 'KJV',
    text: 'He that dwelleth in the secret place of the most High shall abide under the shadow of the Almighty.',
    paraphraseKeywords: ['secret place of the most high', 'shadow of the almighty', 'dwelling place'],
  },
  {
    reference: 'PSALMS 91:2',
    book: 'Psalms',
    chapter: 91,
    verse: 2,
    translation: 'KJV',
    text: 'I will say of the LORD, He is my refuge and my fortress: my God; in him will I trust.',
    paraphraseKeywords: ['my refuge and fortress', 'in him will i trust'],
  },
  {
    reference: 'PSALMS 100:4',
    book: 'Psalms',
    chapter: 100,
    verse: 4,
    translation: 'KJV',
    text: 'Enter into his gates with thanksgiving, and into his courts with praise: be thankful unto him, and bless his name.',
    paraphraseKeywords: ['enter his gates with thanksgiving', 'courts with praise', 'bless his name'],
  },
  {
    reference: 'PSALMS 119:105',
    book: 'Psalms',
    chapter: 119,
    verse: 105,
    translation: 'KJV',
    text: 'Thy word is a lamp unto my feet, and a light unto my path.',
    paraphraseKeywords: ['lamp unto my feet', 'light unto my path', 'god\'s word guides'],
  },
  {
    reference: 'PSALMS 121:1',
    book: 'Psalms',
    chapter: 121,
    verse: 1,
    translation: 'KJV',
    text: 'I will lift up mine eyes unto the hills, from whence cometh my help.',
    paraphraseKeywords: ['lift up my eyes to the hills', 'where my help comes from'],
  },
  {
    reference: 'PSALMS 121:2',
    book: 'Psalms',
    chapter: 121,
    verse: 2,
    translation: 'KJV',
    text: 'My help cometh from the LORD, which made heaven and earth.',
    paraphraseKeywords: ['help comes from the lord', 'creator of heaven and earth'],
  },

  // Proverbs
  {
    reference: 'PROVERBS 3:5',
    book: 'Proverbs',
    chapter: 3,
    verse: 5,
    translation: 'KJV',
    text: 'Trust in the LORD with all thine heart; and lean not unto thine own understanding.',
    paraphraseKeywords: ['trust in the lord', 'whole heart', 'do not lean on your own understanding'],
  },
  {
    reference: 'PROVERBS 3:6',
    book: 'Proverbs',
    chapter: 3,
    verse: 6,
    translation: 'KJV',
    text: 'In all thy ways acknowledge him, and he shall direct thy paths.',
    paraphraseKeywords: ['acknowledge him', 'direct your paths', 'guide your footsteps'],
  },
  {
    reference: 'PROVERBS 4:23',
    book: 'Proverbs',
    chapter: 4,
    verse: 23,
    translation: 'KJV',
    text: 'Keep thy heart with all diligence; for out of it are the issues of life.',
    paraphraseKeywords: ['guard your heart', 'issues of life', 'keep thy heart with all diligence'],
  },
  {
    reference: 'PROVERBS 18:10',
    book: 'Proverbs',
    chapter: 18,
    verse: 10,
    translation: 'KJV',
    text: 'The name of the LORD is a strong tower: the righteous runneth into it, and is safe.',
    paraphraseKeywords: ['strong tower', 'righteous run into it and are safe', 'name of the lord'],
  },

  // Isaiah
  {
    reference: 'ISAIAH 40:29',
    book: 'Isaiah',
    chapter: 40,
    verse: 29,
    translation: 'KJV',
    text: 'He giveth power to the faint; and to them that have no might he increaseth strength.',
    paraphraseKeywords: ['power to the faint', 'gives strength to the weary'],
  },
  {
    reference: 'ISAIAH 40:31',
    book: 'Isaiah',
    chapter: 40,
    verse: 31,
    translation: 'KJV',
    text: 'But they that wait upon the LORD shall renew their strength; they shall mount up with wings as eagles; they shall run, and not be weary; and they shall walk, and not faint.',
    paraphraseKeywords: ['wait upon the lord', 'wings like eagles', 'run and not grow weary', 'renew strength'],
  },
  {
    reference: 'ISAIAH 53:5',
    book: 'Isaiah',
    chapter: 53,
    verse: 5,
    translation: 'KJV',
    text: 'But he was wounded for our transgressions, he was bruised for our iniquities: the chastisement of our peace was upon him; and with his stripes we are healed.',
    paraphraseKeywords: ['by his stripes we are healed', 'wounded for our transgressions', 'bruised for our iniquities'],
  },
  {
    reference: 'ISAIAH 54:17',
    book: 'Isaiah',
    chapter: 54,
    verse: 17,
    translation: 'KJV',
    text: 'No weapon that is formed against thee shall prosper; and every tongue that shall rise against thee in judgment thou shalt condemn. This is the heritage of the servants of the LORD, and their righteousness is of me, saith the LORD.',
    paraphraseKeywords: ['no weapon formed shall prosper', 'heritage of the lord', 'no weapon'],
  },

  // Jeremiah
  {
    reference: 'JEREMIAH 29:11',
    book: 'Jeremiah',
    chapter: 29,
    verse: 11,
    translation: 'KJV',
    text: 'For I know the thoughts that I think toward you, saith the LORD, thoughts of peace, and not of evil, to give you an expected end.',
    paraphraseKeywords: ['plans to prosper you', 'thoughts of peace', 'future and a hope', 'expected end'],
  },
  {
    reference: 'JEREMIAH 33:3',
    book: 'Jeremiah',
    chapter: 33,
    verse: 3,
    translation: 'KJV',
    text: 'Call unto me, and I will answer thee, and show thee great and mighty things, which thou knowest not.',
    paraphraseKeywords: ['call unto me', 'i will answer', 'great and mighty things'],
  },

  // Matthew
  {
    reference: 'MATTHEW 6:33',
    book: 'Matthew',
    chapter: 6,
    verse: 33,
    translation: 'KJV',
    text: 'But seek ye first the kingdom of God, and his righteousness; and all these things shall be added unto you.',
    paraphraseKeywords: ['seek first the kingdom of god', 'his righteousness', 'all things added'],
  },
  {
    reference: 'MATTHEW 11:28',
    book: 'Matthew',
    chapter: 11,
    verse: 28,
    translation: 'KJV',
    text: 'Come unto me, all ye that labour and are heavy laden, and I will give you rest.',
    paraphraseKeywords: ['come to me all who are weary', 'heavy laden', 'i will give you rest'],
  },
  {
    reference: 'MATTHEW 28:19',
    book: 'Matthew',
    chapter: 28,
    verse: 19,
    translation: 'KJV',
    text: 'Go ye therefore, and teach all nations, baptizing them in the name of the Father, and of the Son, and of the Holy Ghost:',
    paraphraseKeywords: ['great commission', 'go into all the world', 'baptizing them', 'teach all nations'],
  },
  {
    reference: 'MATTHEW 28:20',
    book: 'Matthew',
    chapter: 28,
    verse: 20,
    translation: 'KJV',
    text: 'Teaching them to observe all things whatsoever I have commanded you: and, lo, I am with you alway, even unto the end of the world. Amen.',
    paraphraseKeywords: ['i am with you always', 'unto the end of the world'],
  },

  // Mark
  {
    reference: 'MARK 11:24',
    book: 'Mark',
    chapter: 11,
    verse: 24,
    translation: 'KJV',
    text: 'Therefore I say unto you, What things soever ye desire, when ye pray, believe that ye receive them, and ye shall have them.',
    paraphraseKeywords: ['believe that you receive', 'when you pray', 'mountain be removed'],
  },

  // John
  {
    reference: 'JOHN 1:1',
    book: 'John',
    chapter: 1,
    verse: 1,
    translation: 'KJV',
    text: 'In the beginning was the Word, and the Word was with God, and the Word was God.',
    paraphraseKeywords: ['word was with god', 'the word became', 'in the beginning was the word'],
  },
  {
    reference: 'JOHN 1:2',
    book: 'John',
    chapter: 1,
    verse: 2,
    translation: 'KJV',
    text: 'The same was in the beginning with God.',
    paraphraseKeywords: ['beginning with god', 'jesus was there at the start', 'the same was in the beginning'],
  },
  {
    reference: 'JOHN 1:14',
    book: 'John',
    chapter: 1,
    verse: 14,
    translation: 'KJV',
    text: 'And the Word was made flesh, and dwelt among us, (and we beheld his glory, the glory as of the only begotten of the Father,) full of grace and truth.',
    paraphraseKeywords: ['word became flesh', 'dwelt among us', 'full of grace and truth'],
  },
  {
    reference: 'JOHN 3:16',
    book: 'John',
    chapter: 3,
    verse: 16,
    translation: 'KJV',
    text: 'For God so loved the world, that he gave his only begotten Son, that whosoever believeth in him should not perish, but have everlasting life.',
    paraphraseKeywords: ['god so loved the world', 'gave his only son', 'everlasting life', 'whoever believes in him'],
  },
  {
    reference: 'JOHN 10:10',
    book: 'John',
    chapter: 10,
    verse: 10,
    translation: 'KJV',
    text: 'The thief cometh not, but for to steal, and to kill, and to destroy: I am come that they might have life, and that they might have it more abundantly.',
    paraphraseKeywords: ['abundant life', 'thief comes to steal kill destroy', 'have life more abundantly'],
  },
  {
    reference: 'JOHN 14:6',
    book: 'John',
    chapter: 14,
    verse: 6,
    translation: 'KJV',
    text: 'Jesus saith unto him, I am the way, the truth, and the life: no man cometh unto the Father, but by me.',
    paraphraseKeywords: ['i am the way the truth and the life', 'no one comes to the father'],
  },

  // Acts
  {
    reference: 'ACTS 1:8',
    book: 'Acts',
    chapter: 1,
    verse: 8,
    translation: 'KJV',
    text: 'But ye shall receive power, after that the Holy Ghost is come upon you: and ye shall be witnesses unto me both in Jerusalem, and in all Judaea, and in Samaria, and unto the uttermost part of the earth.',
    paraphraseKeywords: ['receive power holy ghost', 'witnesses unto me', 'uttermost parts of earth'],
  },

  // Romans
  {
    reference: 'ROMANS 8:1',
    book: 'Romans',
    chapter: 8,
    verse: 1,
    translation: 'KJV',
    text: 'There is therefore now no condemnation to them which are in Christ Jesus, who walk not after the flesh, but after the Spirit.',
    paraphraseKeywords: ['no condemnation', 'in christ jesus', 'walk after the spirit'],
  },
  {
    reference: 'ROMANS 8:28',
    book: 'Romans',
    chapter: 8,
    verse: 28,
    translation: 'KJV',
    text: 'And we know that all things work together for good to them that love God, to them who are the called according to his purpose.',
    paraphraseKeywords: ['all things work together', 'for our good', 'called according to his purpose'],
  },
  {
    reference: 'ROMANS 8:31',
    book: 'Romans',
    chapter: 8,
    verse: 31,
    translation: 'KJV',
    text: 'What shall we then say to these things? If God be for us, who can be against us?',
    paraphraseKeywords: ['if god be for us', 'who can be against us'],
  },
  {
    reference: 'ROMANS 8:37',
    book: 'Romans',
    chapter: 8,
    verse: 37,
    translation: 'KJV',
    text: 'Nay, in all these things we are more than conquerors through him that loved us.',
    paraphraseKeywords: ['more than conquerors', 'through him that loved us'],
  },
  {
    reference: 'ROMANS 10:9',
    book: 'Romans',
    chapter: 10,
    verse: 9,
    translation: 'KJV',
    text: 'That if thou shalt confess with thy mouth the Lord Jesus, and shalt believe in thine heart that God hath raised him from the dead, thou shalt be saved.',
    paraphraseKeywords: ['confess with your mouth', 'believe in your heart', 'you shall be saved'],
  },
  {
    reference: 'ROMANS 12:2',
    book: 'Romans',
    chapter: 12,
    verse: 2,
    translation: 'KJV',
    text: 'And be not conformed to this world: but be ye transformed by the renewing of your mind, that ye may prove what is that good, and acceptable, and perfect, will of God.',
    paraphraseKeywords: ['renewing of your mind', 'do not conform to this world', 'perfect will of god'],
  },

  // 1 Corinthians
  {
    reference: '1 CORINTHIANS 13:4',
    book: '1 Corinthians',
    chapter: 13,
    verse: 4,
    translation: 'KJV',
    text: 'Charity suffereth long, and is kind; charity envieth not; charity vaunteth not itself, is not puffed up,',
    paraphraseKeywords: ['love is patient', 'love is kind', 'does not envy', 'does not boast', 'charity suffereth long'],
  },
  {
    reference: '1 CORINTHIANS 13:13',
    book: '1 Corinthians',
    chapter: 13,
    verse: 13,
    translation: 'KJV',
    text: 'And now abideth faith, hope, charity, these three; but the greatest of these is charity.',
    paraphraseKeywords: ['faith hope and love', 'greatest of these is charity'],
  },

  // 2 Corinthians
  {
    reference: '2 CORINTHIANS 5:17',
    book: '2 Corinthians',
    chapter: 5,
    verse: 17,
    translation: 'KJV',
    text: 'Therefore if any man be in Christ, he is a new creature: old things are passed away; behold, all things are become new.',
    paraphraseKeywords: ['new creature in christ', 'old things passed away', 'all things new'],
  },
  {
    reference: '2 CORINTHIANS 12:9',
    book: '2 Corinthians',
    chapter: 12,
    verse: 9,
    translation: 'KJV',
    text: 'And he said unto me, My grace is sufficient for thee: for my strength is made perfect in weakness. Most gladly therefore will I rather glory in my infirmities, that the power of Christ may rest upon me.',
    paraphraseKeywords: ['my grace is sufficient', 'strength made perfect in weakness'],
  },

  // Galatians
  {
    reference: 'GALATIANS 2:20',
    book: 'Galatians',
    chapter: 2,
    verse: 20,
    translation: 'KJV',
    text: 'I am crucified with Christ: nevertheless I live; yet not I, but Christ liveth in me: and the life which I now live in the flesh I live by the faith of the Son of God, who loved me, and gave himself for me.',
    paraphraseKeywords: ['crucified with christ', 'christ lives in me', 'faith of the son of god'],
  },
  {
    reference: 'GALATIANS 5:22',
    book: 'Galatians',
    chapter: 5,
    verse: 22,
    translation: 'KJV',
    text: 'But the fruit of the Spirit is love, joy, peace, longsuffering, gentleness, goodness, faith,',
    paraphraseKeywords: ['fruit of the spirit', 'love joy peace'],
  },

  // Ephesians
  {
    reference: 'EPHESIANS 2:8',
    book: 'Ephesians',
    chapter: 2,
    verse: 8,
    translation: 'KJV',
    text: 'For by grace are ye saved through faith; and that not of yourselves: it is the gift of God:',
    paraphraseKeywords: ['saved by grace through faith', 'gift of god', 'not of yourselves'],
  },
  {
    reference: 'EPHESIANS 6:10',
    book: 'Ephesians',
    chapter: 6,
    verse: 10,
    translation: 'KJV',
    text: 'Finally, my brethren, be strong in the Lord, and in the power of his might.',
    paraphraseKeywords: ['be strong in the lord', 'power of his might', 'armor of god'],
  },

  // Philippians
  {
    reference: 'PHILIPPIANS 4:6',
    book: 'Philippians',
    chapter: 4,
    verse: 6,
    translation: 'KJV',
    text: 'Be careful for nothing; but in every thing by prayer and supplication with thanksgiving let your requests be made known unto god.',
    paraphraseKeywords: ['do not be anxious', 'by prayer and petition', 'peace of god'],
  },
  {
    reference: 'PHILIPPIANS 4:13',
    book: 'Philippians',
    chapter: 4,
    verse: 13,
    translation: 'KJV',
    text: 'I can do all things through Christ which strengtheneth me.',
    paraphraseKeywords: ['i can do all things', 'christ strengthens me', 'strength through christ'],
  },
  {
    reference: 'PHILIPPIANS 4:19',
    book: 'Philippians',
    chapter: 4,
    verse: 19,
    translation: 'KJV',
    text: 'But my God shall supply all your need according to his riches in glory by Christ Jesus.',
    paraphraseKeywords: ['god shall supply all your need', 'riches in glory', 'supply my need'],
  },

  // 2 Timothy
  {
    reference: '2 TIMOTHY 1:7',
    book: '2 Timothy',
    chapter: 1,
    verse: 7,
    translation: 'KJV',
    text: 'For God hath not given us the spirit of fear; but of power, and of love, and of a sound mind.',
    paraphraseKeywords: ['spirit of fear', 'power love sound mind', 'not given a spirit of fear'],
  },

  // Hebrews
  {
    reference: 'HEBREWS 11:1',
    book: 'Hebrews',
    chapter: 11,
    verse: 1,
    translation: 'KJV',
    text: 'Now faith is the substance of things hoped for, the evidence of things not seen.',
    paraphraseKeywords: ['faith is the substance', 'things hoped for', 'evidence not seen'],
  },
  {
    reference: 'HEBREWS 11:6',
    book: 'Hebrews',
    chapter: 11,
    verse: 6,
    translation: 'KJV',
    text: 'But without faith it is impossible to please him: for he that cometh to God must believe that he is, and that he is a rewarder of them that diligently seek him.',
    paraphraseKeywords: ['without faith impossible to please god', 'rewarder of those who seek him'],
  },
  {
    reference: 'HEBREWS 12:2',
    book: 'Hebrews',
    chapter: 12,
    verse: 2,
    translation: 'KJV',
    text: 'Looking unto Jesus the author and finisher of our faith; who for the joy that was set before him endured the cross, despising the shame, and is set down at the right hand of the throne of God.',
    paraphraseKeywords: ['author and finisher of our faith', 'looking unto jesus', 'endured the cross'],
  },

  // James
  {
    reference: 'JAMES 1:5',
    book: 'James',
    chapter: 1,
    verse: 5,
    translation: 'KJV',
    text: 'If any of you lack wisdom, let him ask of God, that giveth to all men liberally, and upbraideth not; and it shall be given him.',
    paraphraseKeywords: ['ask for wisdom', 'lack wisdom', 'god gives liberally'],
  },

  // 1 Peter
  {
    reference: '1 PETER 5:7',
    book: '1 Peter',
    chapter: 5,
    verse: 7,
    translation: 'KJV',
    text: 'Casting all your care upon him; for he careth for you.',
    paraphraseKeywords: ['cast your care upon him', 'he cares for you', 'cast all your anxiety'],
  },

  // 1 John
  {
    reference: '1 JOHN 1:9',
    book: '1 John',
    chapter: 1,
    verse: 9,
    translation: 'KJV',
    text: 'If we confess our sins, he is faithful and just to forgive us our sins, and to cleanse us from all unrighteousness.',
    paraphraseKeywords: ['faithful and just to forgive', 'confess our sins', 'cleanse from all unrighteousness'],
  },
  {
    reference: '1 JOHN 4:4',
    book: '1 John',
    chapter: 4,
    verse: 4,
    translation: 'KJV',
    text: 'Ye are of God, little children, and have overcome them: because greater is he that is in you, than he that is in the world.',
    paraphraseKeywords: ['greater is he that is in you', 'than he that is in the world', 'overcomers'],
  },

  // Revelation
  {
    reference: 'REVELATION 21:4',
    book: 'Revelation',
    chapter: 21,
    verse: 4,
    translation: 'KJV',
    text: 'And God shall wipe away all tears from their eyes; and there shall be no more death, neither sorrow, nor crying, neither shall there be any more pain: for the former things are passed away.',
    paraphraseKeywords: ['wipe away every tear', 'no more death nor sorrow', 'no more pain'],
  },
  {
    reference: 'REVELATION 22:13',
    book: 'Revelation',
    chapter: 22,
    verse: 13,
    translation: 'KJV',
    text: 'I am Alpha and Omega, the beginning and the end, the first and the last.',
    paraphraseKeywords: ['alpha and omega', 'first and last', 'beginning and the end'],
  },
];

export const TRANSLATIONS = ['KJV', 'NIV', 'ESV', 'NLT', 'NKJV'];

export const AVAILABLE_MICROPHONES = [
  'Default - Microphone (Built-in Audio)',
  'Focusrite Scarlett 2i2 (USB Audio)',
  'Shure SM7B - Line In (Audio Interface)',
  'Elgato Wave:3 (USB Condenser)',
  'NDI Virtual Audio Input',
];

export const DEMO_SERMON_TRANSCRIPTS = [
  "Welcome church family. Today we are opening up the scriptures to understand God's divine order.",
  "Let's turn together to Genesis chapter 1 verse 1.",
  "Notice how it begins: 'In the beginning God created the heaven and the earth.'",
  "God did not consult anyone; He spoke creation into existence with power and precision.",
  "As we see in John chapter 1 verse 2, the same Word was in the beginning with God.",
  "When you feel overwhelmed, remember Romans 8:28: all things work together for good to them that love God.",
  "Even when walking through the darkest seasons, Psalm 23 reminds us that the Lord is our Shepherd.",
  "Philippians 4:13 assures us: I can do all things through Christ who gives me strength.",
  "Let our faith remain anchored in Hebrews 11:1, believing in the unseen promises of God.",
];
