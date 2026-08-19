// Arabic Word Database & Letter Values
// For TikTok Arabic Word Guessing Game

const ARABIC_LETTERS = {
  // Letter values (Scrabble-style)
  values: {
    'ا': 1,  // Alif
    'ل': 1,  // Lam
    'ن': 1,  // Nun
    'ي': 1,  // Ya
    'و': 1,  // Waw
    'ت': 1,  // Ta
    'ر': 1,  // Ra
    'ب': 2,  // Ba
    'ه': 2,  // Ha
    'م': 2,  // Mim
    'د': 2,  // Dal
    'ك': 3,  // Kaf
    'ع': 3,  // Ain
    'ح': 4,  // Ha
    'ف': 4,  // Fa
    'س': 4,  // Sin
    'ق': 5,  // Qaf
    'غ': 5,  // Ghain
    'ج': 5,  // Jim
    'خ': 5,  // Kha
    'ص': 6,  // Sad
    'ض': 6,  // Dad
    'ط': 7,  // Ta
    'ظ': 7,  // Dha
    'ث': 7,  // Tha
    'ء': 8,  // Hamza
    'ئ': 8,  // Hamza on Ya
    'ؤ': 8,  // Hamza on Waw
    'آ': 10, // Alef Madda
    'ة': 10  // Ta Marbuta
  },
  
  // Common Arabic letters (easier rounds)
  common: ['ا', 'ل', 'ن', 'ي', 'و', 'ت', 'ر', 'ب', 'ه', 'م', 'د'],
  
  // Medium difficulty letters
  medium: ['ك', 'ع', 'ح', 'ف', 'س', 'ق', 'غ', 'ج', 'خ'],
  
  // Hard letters (rare combinations)
  hard: ['ص', 'ض', 'ط', 'ظ', 'ث', 'ء', 'ئ', 'ؤ', 'آ', 'ة']
};

// Arabic word database organized by difficulty and letter count
const ARABIC_WORDS = {
  // 3-letter words
  three: [
    { word: 'بيت', meaning: 'house', letters: ['ب', 'ي', 'ت'] },
    { word: 'كت', meaning: 'box', letters: ['ك', 'ت'] },
    { word: 'باب', meaning: 'door', letters: ['ب', 'ا', 'ب'] },
    { word: 'نار', meaning: 'fire', letters: ['ن', 'ا', 'ر'] },
    { word: 'ماء', meaning: 'water', letters: ['م', 'ا', 'ء'] },
    { word: 'قلم', meaning: 'pen', letters: ['ق', 'ل', 'م'] },
    { word: 'شمس', meaning: 'sun', letters: ['ش', 'م', 'س'] },
    { word: 'قمر', meaning: 'moon', letters: ['ق', 'م', 'ر'] },
    { word: 'نجم', meaning: 'star', letters: ['ن', 'ج', 'م'] },
    { word: 'بحر', meaning: 'sea', letters: ['ب', 'ح', 'ر'] },
    { word: 'جبل', meaning: 'mountain', letters: ['ج', 'ب', 'ل'] },
    { word: 'ورد', meaning: 'flowers', letters: ['و', 'ر', 'د'] },
    { word: 'سلام', meaning: 'peace', letters: ['س', 'ل', 'ا', 'م'] },
    { word: 'كلب', meaning: 'dog', letters: ['ك', 'ل', 'ب'] },
    { word: 'قطة', meaning: 'cat', letters: ['ق', 'ط', 'ة'] },
    { word: 'سمك', meaning: 'fish', letters: ['س', 'م', 'ك'] },
    { word: 'طائر', meaning: 'bird', letters: ['ط', 'ا', 'ئ', 'ر'] },
    { word: 'تفاح', meaning: 'apple', letters: ['ت', 'ف', 'ا', 'ح'] },
    { word: 'خبز', meaning: 'bread', letters: ['خ', 'ب', 'ز'] },
    { word: 'حليب', meaning: 'milk', letters: ['ح', 'ل', 'ي', 'ب'] }
  ],
  
  // 4-letter words
  four: [
    { word: 'كتاب', meaning: 'book', letters: ['ك', 'ت', 'ا', 'ب'] },
    { word: 'مدرسة', meaning: 'school', letters: ['م', 'د', 'ر', 'س', 'ة'] },
    { word: 'مكتب', meaning: 'office', letters: ['م', 'ك', 'ت', 'ب'] },
    { word: 'حديقة', meaning: 'garden', letters: ['ح', 'د', 'ي', 'ق', 'ة'] },
    { word: 'غرفة', meaning: 'room', letters: ['غ', 'ر', 'ف', 'ة'] },
    { word: 'شجرة', meaning: 'tree', letters: ['ش', 'ج', 'ر', 'ة'] },
    { word: 'سماء', meaning: 'sky', letters: ['س', 'م', 'ا', 'ء'] },
    { word: 'أرض', meaning: 'earth', letters: ['ا', 'ر', 'ض'] },
    { word: 'نور', meaning: 'light', letters: ['ن', 'و', 'ر'] },
    { word: 'حرف', meaning: 'letter', letters: ['ح', 'ر', 'ف'] },
    { word: 'صوت', meaning: 'sound', letters: ['ص', 'و', 'ت'] },
    { word: 'لون', meaning: 'color', letters: ['ل', 'و', 'ن'] },
    { word: 'طعم', meaning: 'taste', letters: ['ط', 'ع', 'م'] },
    { word: 'رقم', meaning: 'number', letters: ['ر', 'ق', 'م'] },
    { word: 'سؤال', meaning: 'question', letters: ['س', 'ؤ', 'ا', 'ل'] },
    { word: 'جواب', meaning: 'answer', letters: ['ج', 'و', 'ا', 'ب'] },
    { word: 'لعبة', meaning: 'game', letters: ['ل', 'ع', 'ب', 'ة'] },
    { word: 'مفتاح', meaning: 'key', letters: ['م', 'ف', 'ت', 'ا', 'ح'] },
    { word: 'تلفاز', meaning: 'television', letters: ['ت', 'ل', 'ف', 'ا', 'ز'] },
    { word: 'هاتف', meaning: 'phone', letters: ['ه', 'ا', 'ت', 'ف'] }
  ],
  
  // 5-letter words (main game words)
  five: [
    { word: 'معلم', meaning: 'teacher', letters: ['م', 'ع', 'ل', 'م'] },
    { word: 'طالب', meaning: 'student', letters: ['ط', 'ا', 'ل', 'ب'] },
    { word: 'جامعة', meaning: 'university', letters: ['ج', 'ا', 'م', 'ع', 'ة'] },
    { word: 'مكتبة', meaning: 'library', letters: ['م', 'ك', 'ت', 'ب', 'ة'] },
    { word: 'مستشفى', meaning: 'hospital', letters: ['م', 'س', 'ت', 'ش', 'ف', 'ى'] },
    { word: 'طائرة', meaning: 'airplane', letters: ['ط', 'ا', 'ئ', 'ر', 'ة'] },
    { word: 'سيارة', meaning: 'car', letters: ['س', 'ي', 'ا', 'ر', 'ة'] },
    { word: 'شمسية', meaning: 'sunny', letters: ['ش', 'م', 'س', 'ي', 'ة'] },
    { word: 'قمرية', meaning: 'lunar', letters: ['ق', 'م', 'ر', 'ي', 'ة'] },
    { word: 'نجمية', meaning: 'stellar', letters: ['ن', 'ج', 'م', 'ي', 'ة'] },
    { word: 'بحري', meaning: 'marine', letters: ['ب', 'ح', 'ر', 'ي'] },
    { word: 'جبلي', meaning: 'mountainous', letters: ['ج', 'ب', 'ل', 'ي'] },
    { word: 'وردي', meaning: 'pink', letters: ['و', 'ر', 'د', 'ي'] },
    { word: 'سالم', meaning: 'safe', letters: ['س', 'ا', 'ل', 'م'] },
    { word: 'كريم', meaning: 'generous', letters: ['ك', 'ر', 'ي', 'م'] },
    { word: 'فاضل', meaning: 'virtuous', letters: ['ف', 'ا', 'ض', 'ل'] },
    { word: 'عاقل', meaning: 'wise', letters: ['ع', 'ا', 'ق', 'ل'] },
    { word: 'حكيم', meaning: 'wise', letters: ['ح', 'ك', 'ي', 'م'] },
    { word: 'شجاع', meaning: 'brave', letters: ['ش', 'ج', 'ا', 'ع'] },
    { word: 'قوي', meaning: 'strong', letters: ['ق', 'و', 'ي'] }
  ],
  
  // Letter sets that form multiple words (pre-validated)
  letterSets: [
    {
      letters: ['ب', 'ي', 'ت', 'ا', 'ل'],
      words: ['بيت', 'تاب', 'لت', 'بت', 'تاب'],
      masterWord: 'بيت'
    },
    {
      letters: ['ك', 'ت', 'ا', 'ب', 'ي'],
      words: ['كتاب', 'باكي', 'تاك', 'كبت'],
      masterWord: 'كتاب'
    },
    {
      letters: ['س', 'ل', 'ا', 'م', 'ي'],
      words: ['سلام', 'سالم', 'لام', 'مال'],
      masterWord: 'سالم'
    },
    {
      letters: ['ق', 'ل', 'م', 'ي', 'ن'],
      words: ['قلم', 'نقي', 'لم', 'قن'],
      masterWord: 'قلم'
    },
    {
      letters: ['ن', 'ا', 'ر', 'ي', 'ب'],
      words: ['نار', 'بر', 'ابر', 'بان'],
      masterWord: 'نار'
    },
    {
      letters: ['م', 'ا', 'ء', 'ي', 'ن'],
      words: ['ماء', 'مان', 'نام', 'يان'],
      masterWord: 'ماء'
    },
    {
      letters: ['ب', 'ح', 'ر', 'ي', 'ن'],
      words: ['بحر', 'بحري', 'حرب', 'نبر'],
      masterWord: 'بحري'
    },
    {
      letters: ['ج', 'ب', 'ل', 'ي', 'ن'],
      words: ['جبل', 'جبلي', 'بلج', 'نجل'],
      masterWord: 'جبلي'
    },
    {
      letters: ['ش', 'م', 'س', 'ي', 'ن'],
      words: ['شمس', 'شمسية', 'مش', 'سن'],
      masterWord: 'شمسية'
    },
    {
      letters: ['ق', 'م', 'ر', 'ي', 'ن'],
      words: ['قمر', 'قمري', 'مرق', 'نقر'],
      masterWord: 'قمري'
    }
  ]
};

// Helper functions for Arabic letter manipulation
const ArabicHelper = {
  // Get letter value
  getLetterValue(letter) {
    return ARABIC_LETTERS.values[letter] || 1;
  },
  
  // Calculate word score
  calculateWordScore(word) {
    let score = 0;
    for (let letter of word) {
      score += this.getLetterValue(letter);
    }
    return score;
  },
  
  // Check if word can be formed from available letters
  canFormWord(word, availableLetters) {
    const letterPool = [...availableLetters];
    for (let letter of word) {
      const index = letterPool.indexOf(letter);
      if (index === -1) return false;
      letterPool.splice(index, 1);
    }
    return true;
  },
  
  // Scramble letters
  scrambleLetters(letters) {
    const scrambled = [...letters];
    for (let i = scrambled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [scrambled[i], scrambled[j]] = [scrambled[j], scrambled[i]];
    }
    return scrambled;
  },
  
  // Get random letter set
  getRandomLetterSet(difficulty = 'medium') {
    let letterPool;
    switch(difficulty) {
      case 'easy':
        letterPool = ARABIC_LETTERS.common;
        break;
      case 'hard':
        letterPool = [...ARABIC_LETTERS.common, ...ARABIC_LETTERS.hard];
        break;
      default:
        letterPool = [...ARABIC_LETTERS.common, ...ARABIC_LETTERS.medium];
    }
    
    // Select 5 random letters
    const selected = [];
    const used = new Set();
    
    while (selected.length < 5) {
      const randomIndex = Math.floor(Math.random() * letterPool.length);
      const letter = letterPool[randomIndex];
      if (!used.has(letter)) {
        used.add(letter);
        selected.push(letter);
      }
    }
    
    return selected;
  },
  
  // Find valid words from letter set
  findValidWords(letters) {
    const validWords = [];
    const allWords = [...ARABIC_WORDS.three, ...ARABIC_WORDS.four, ...ARABIC_WORDS.five];
    
    for (let wordObj of allWords) {
      if (this.canFormWord(wordObj.word, letters)) {
        validWords.push(wordObj);
      }
    }
    
    return validWords;
  }
};

// Export for use in game
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { ARABIC_LETTERS, ARABIC_WORDS, ArabicHelper };
}
