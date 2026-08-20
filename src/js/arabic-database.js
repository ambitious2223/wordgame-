// ===== Comprehensive Arabic Word Database =====
// With letter values and diacritics support

const ARABIC_LETTERS = {
    // 28 basic Arabic letters with their point values
    // Based on frequency and difficulty
    'ا': { value: 1, name: 'alif', vowel: true },
    'ب': { value: 2, name: 'ba', vowel: false },
    'ت': { value: 1, name: 'ta', vowel: false },
    'ث': { value: 7, name: 'tha', vowel: false },
    'ج': { value: 5, name: 'jim', vowel: false },
    'ح': { value: 4, name: 'ha', vowel: false },
    'خ': { value: 5, name: 'kha', vowel: false },
    'د': { value: 2, name: 'dal', vowel: false },
    'ذ': { value: 7, name: 'dhal', vowel: false },
    'ر': { value: 1, name: 'ra', vowel: false },
    'ز': { value: 6, name: 'zay', vowel: false },
    'س': { value: 4, name: 'sin', vowel: false },
    'ش': { value: 6, name: 'shin', vowel: false },
    'ص': { value: 6, name: 'sad', vowel: false },
    'ض': { value: 6, name: 'dad', vowel: false },
    'ط': { value: 7, name: 'ta', vowel: false },
    'ظ': { value: 7, name: 'dha', vowel: false },
    'ع': { value: 3, name: 'ayn', vowel: false },
    'غ': { value: 5, name: 'ghayn', vowel: false },
    'ف': { value: 4, name: 'fa', vowel: false },
    'ق': { value: 5, name: 'qaf', vowel: false },
    'ك': { value: 3, name: 'kaf', vowel: false },
    'ل': { value: 1, name: 'lam', vowel: false },
    'م': { value: 2, name: 'mim', vowel: false },
    'ن': { value: 1, name: 'nun', vowel: false },
    'ه': { value: 2, name: 'ha', vowel: false },
    'و': { value: 1, name: 'waw', vowel: true },
    'ي': { value: 1, name: 'ya', vowel: true },
    
    // Special characters
    'ة': { value: 10, name: 'ta marbuta', vowel: false },
    'ء': { value: 8, name: 'hamza', vowel: false },
    'آ': { value: 10, name: 'alif madda', vowel: true },
    'أ': { value: 1, name: 'alif hamza', vowel: true },
    'إ': { value: 1, name: 'alif hamza', vowel: true },
    'ؤ': { value: 8, name: 'waw hamza', vowel: false },
    'ئ': { value: 8, name: 'ya hamza', vowel: false }
};

// Diacritics (tashkeel) - can be stripped for matching
const DIACRITICS = /[\u0610-\u061A\u064B-\u065F\u0670]/g;

// Normalize Arabic text (remove diacritics, normalize alef forms)
function normalizeArabic(text) {
    return text
        .replace(DIACRITICS, '')  // Remove diacritics
        .replace(/[إأآا]/g, 'ا') // Normalize alef
        .replace(/ة/g, 'ه')      // Normalize ta marbuta
        .replace(/ى/g, 'ي')      // Normalize alef maqsura
        .trim();
}

// ===== Verified Arabic Word Database =====
// Each word has: word, meaning, letters, category, difficulty

const WORD_DATABASE = {
    // 3-letter words (Easy)
    three_letter: [
        { word: 'بَيْت', meaning: 'house', letters: ['ب', 'ي', 'ت'], category: 'noun', difficulty: 1 },
        { word: 'كِتَاب', meaning: 'book', letters: ['ك', 'ت', 'ا', 'ب'], category: 'noun', difficulty: 1 },
        { word: 'قَلَم', meaning: 'pen', letters: ['ق', 'ل', 'م'], category: 'noun', difficulty: 1 },
        { word: 'سَلَام', meaning: 'peace', letters: ['س', 'ل', 'ا', 'م'], category: 'noun', difficulty: 1 },
        { word: 'نَار', meaning: 'fire', letters: ['ن', 'ا', 'ر'], category: 'noun', difficulty: 1 },
        { word: 'مَاء', meaning: 'water', letters: ['م', 'ا', 'ء'], category: 'noun', difficulty: 1 },
        { word: 'شَمْس', meaning: 'sun', letters: ['ش', 'م', 'س'], category: 'noun', difficulty: 1 },
        { word: 'قَمَر', meaning: 'moon', letters: ['ق', 'م', 'ر'], category: 'noun', difficulty: 1 },
        { word: 'نَجْم', meaning: 'star', letters: ['ن', 'ج', 'م'], category: 'noun', difficulty: 1 },
        { word: 'بَحْر', meaning: 'sea', letters: ['ب', 'ح', 'ر'], category: 'noun', difficulty: 1 },
        { word: 'جَبَل', meaning: 'mountain', letters: ['ج', 'ب', 'ل'], category: 'noun', difficulty: 1 },
        { word: 'وَرْد', meaning: 'flower', letters: ['و', 'ر', 'د'], category: 'noun', difficulty: 1 },
        { word: 'كَلْب', meaning: 'dog', letters: ['ك', 'ل', 'ب'], category: 'noun', difficulty: 1 },
        { word: 'قِطَّة', meaning: 'cat', letters: ['ق', 'ط', 'ة'], category: 'noun', difficulty: 1 },
        { word: 'سَمَك', meaning: 'fish', letters: ['س', 'م', 'ك'], category: 'noun', difficulty: 1 },
        { word: 'طَيْر', meaning: 'bird', letters: ['ط', 'ي', 'ر'], category: 'noun', difficulty: 1 },
        { word: 'تُفَّاح', meaning: 'apple', letters: ['ت', 'ف', 'ا', 'ح'], category: 'noun', difficulty: 1 },
        { word: 'خُبْز', meaning: 'bread', letters: ['خ', 'ب', 'ز'], category: 'noun', difficulty: 1 },
        { word: 'حَلِيب', meaning: 'milk', letters: ['ح', 'ل', 'ي', 'ب'], category: 'noun', difficulty: 1 },
        { word: 'عَيْن', meaning: 'eye', letters: ['ع', 'ي', 'ن'], category: 'noun', difficulty: 1 },
        { word: 'يَد', meaning: 'hand', letters: ['ي', 'د'], category: 'noun', difficulty: 1 },
        { word: 'رَأْس', meaning: 'head', letters: ['ر', 'ا', 'ء', 'س'], category: 'noun', difficulty: 1 },
        { word: 'قَلْب', meaning: 'heart', letters: ['ق', 'ل', 'ب'], category: 'noun', difficulty: 1 },
        { word: 'كَلِمَة', meaning: 'word', letters: ['ك', 'ل', 'م', 'ة'], category: 'noun', difficulty: 1 },
        { word: 'لَعِب', meaning: 'toy', letters: ['ل', 'ع', 'ب'], category: 'noun', difficulty: 1 },
    ],

    // 4-letter words (Medium)
    four_letter: [
        { word: 'مَدْرَسَة', meaning: 'school', letters: ['م', 'د', 'ر', 'س', 'ة'], category: 'noun', difficulty: 2 },
        { word: 'مَكْتَب', meaning: 'office', letters: ['م', 'ك', 'ت', 'ب'], category: 'noun', difficulty: 2 },
        { word: 'حَدِيقَة', meaning: 'garden', letters: ['ح', 'د', 'ي', 'ق', 'ة'], category: 'noun', difficulty: 2 },
        { word: 'غُرْفَة', meaning: 'room', letters: ['غ', 'ر', 'ف', 'ة'], category: 'noun', difficulty: 2 },
        { word: 'شَجَرَة', meaning: 'tree', letters: ['ش', 'ج', 'ر', 'ة'], category: 'noun', difficulty: 2 },
        { word: 'سَمَاء', meaning: 'sky', letters: ['س', 'م', 'ا', 'ء'], category: 'noun', difficulty: 2 },
        { word: 'أَرْض', meaning: 'earth', letters: ['ا', 'ر', 'ض'], category: 'noun', difficulty: 2 },
        { word: 'نُور', meaning: 'light', letters: ['ن', 'و', 'ر'], category: 'noun', difficulty: 2 },
        { word: 'حَرْف', meaning: 'letter', letters: ['ح', 'ر', 'ف'], category: 'noun', difficulty: 2 },
        { word: 'صَوْت', meaning: 'sound', letters: ['ص', 'و', 'ت'], category: 'noun', difficulty: 2 },
        { word: 'لَوْن', meaning: 'color', letters: ['ل', 'و', 'ن'], category: 'noun', difficulty: 2 },
        { word: 'رَقَم', meaning: 'number', letters: ['ر', 'ق', 'م'], category: 'noun', difficulty: 2 },
        { word: 'جَوَاب', meaning: 'answer', letters: ['ج', 'و', 'ا', 'ب'], category: 'noun', difficulty: 2 },
        { word: 'لَعْبَة', meaning: 'game', letters: ['ل', 'ع', 'ب', 'ة'], category: 'noun', difficulty: 2 },
        { word: 'مِفْتَاح', meaning: 'key', letters: ['م', 'ف', 'ت', 'ا', 'ح'], category: 'noun', difficulty: 2 },
        { word: 'هَاتِف', meaning: 'phone', letters: ['ه', 'ا', 'ت', 'ف'], category: 'noun', difficulty: 2 },
        { word: 'بَاب', meaning: 'door', letters: ['ب', 'ا', 'ب'], category: 'noun', difficulty: 2 },
        { word: 'نَافِذَة', meaning: 'window', letters: ['ن', 'ا', 'ف', 'ذ', 'ة'], category: 'noun', difficulty: 2 },
        { word: 'كُرْسِي', meaning: 'chair', letters: ['ك', 'ر', 'س', 'ي'], category: 'noun', difficulty: 2 },
        { word: 'طَعَام', meaning: 'food', letters: ['ط', 'ع', 'ا', 'م'], category: 'noun', difficulty: 2 },
    ],

    // 5-letter words (Hard)
    five_letter: [
        { word: 'مُعَلِّم', meaning: 'teacher', letters: ['م', 'ع', 'ل', 'م'], category: 'noun', difficulty: 3 },
        { word: 'طَالِب', meaning: 'student', letters: ['ط', 'ا', 'ل', 'ب'], category: 'noun', difficulty: 3 },
        { word: 'جَامِعَة', meaning: 'university', letters: ['ج', 'ا', 'م', 'ع', 'ة'], category: 'noun', difficulty: 3 },
        { word: 'مَكْتَبَة', meaning: 'library', letters: ['م', 'ك', 'ت', 'ب', 'ة'], category: 'noun', difficulty: 3 },
        { word: 'مُسْتَشْفَى', meaning: 'hospital', letters: ['م', 'س', 'ت', 'ش', 'ف', 'ى'], category: 'noun', difficulty: 3 },
        { word: 'طَائِرَة', meaning: 'airplane', letters: ['ط', 'ا', 'ئ', 'ر', 'ة'], category: 'noun', difficulty: 3 },
        { word: 'سَيَّارَة', meaning: 'car', letters: ['س', 'ي', 'ا', 'ر', 'ة'], category: 'noun', difficulty: 3 },
        { word: 'بَحْرِي', meaning: 'marine', letters: ['ب', 'ح', 'ر', 'ي'], category: 'adjective', difficulty: 3 },
        { word: 'جَبَلِي', meaning: 'mountainous', letters: ['ج', 'ب', 'ل', 'ي'], category: 'adjective', difficulty: 3 },
        { word: 'وَرْدِي', meaning: 'pink', letters: ['و', 'ر', 'د', 'ي'], category: 'adjective', difficulty: 3 },
        { word: 'سَالِم', meaning: 'safe', letters: ['س', 'ا', 'ل', 'م'], category: 'adjective', difficulty: 3 },
        { word: 'كَرِيم', meaning: 'generous', letters: ['ك', 'ر', 'ي', 'م'], category: 'adjective', difficulty: 3 },
        { word: 'فَاضِل', meaning: 'virtuous', letters: ['ف', 'ا', 'ض', 'ل'], category: 'adjective', difficulty: 3 },
        { word: 'عَاقِل', meaning: 'wise', letters: ['ع', 'ا', 'ق', 'ل'], category: 'adjective', difficulty: 3 },
        { word: 'حَكِيم', meaning: 'wise', letters: ['ح', 'ك', 'ي', 'م'], category: 'adjective', difficulty: 3 },
        { word: 'شُجَاع', meaning: 'brave', letters: ['ش', 'ج', 'ا', 'ع'], category: 'adjective', difficulty: 3 },
        { word: 'قَوِي', meaning: 'strong', letters: ['ق', 'و', 'ي'], category: 'adjective', difficulty: 3 },
        { word: 'جَمِيل', meaning: 'beautiful', letters: ['ج', 'م', 'ي', 'ل'], category: 'adjective', difficulty: 3 },
        { word: 'كَبِير', meaning: 'big', letters: ['ك', 'ب', 'ي', 'ر'], category: 'adjective', difficulty: 3 },
        { word: 'صَغِير', meaning: 'small', letters: ['ص', 'غ', 'ي', 'ر'], category: 'adjective', difficulty: 3 },
    ],

    // Common verbs
    verbs: [
        { word: 'كَتَبَ', meaning: 'he wrote', letters: ['ك', 'ت', 'ب'], category: 'verb', difficulty: 1 },
        { word: 'قَرَأَ', meaning: 'he read', letters: ['ق', 'ر', 'ء'], category: 'verb', difficulty: 1 },
        { word: 'فَتَحَ', meaning: 'he opened', letters: ['ف', 'ت', 'ح'], category: 'verb', difficulty: 1 },
        { word: 'أَغْلَقَ', meaning: 'he closed', letters: ['ا', 'غ', 'ل', 'ق'], category: 'verb', difficulty: 2 },
        { word: 'مَشَى', meaning: 'he walked', letters: ['م', 'ش', 'ي'], category: 'verb', difficulty: 1 },
        { word: 'جَلَسَ', meaning: 'he sat', letters: ['ج', 'ل', 'س'], category: 'verb', difficulty: 1 },
        { word: 'نَامَ', meaning: 'he slept', letters: ['ن', 'ا', 'م'], category: 'verb', difficulty: 1 },
        { word: 'أَكَلَ', meaning: 'he ate', letters: ['ا', 'ك', 'ل'], category: 'verb', difficulty: 1 },
        { word: 'شَرِبَ', meaning: 'he drank', letters: ['ش', 'ر', 'ب'], category: 'verb', difficulty: 1 },
        { word: 'عَلِمَ', meaning: 'he knew', letters: ['ع', 'ل', 'م'], category: 'verb', difficulty: 1 },
        { word: 'فَهِمَ', meaning: 'he understood', letters: ['ف', 'ه', 'م'], category: 'verb', difficulty: 1 },
        { word: 'حَبَّ', meaning: 'he loved', letters: ['ح', 'ب'], category: 'verb', difficulty: 1 },
        { word: 'كَرِهَ', meaning: 'he hated', letters: ['ك', 'ر', 'ه'], category: 'verb', difficulty: 1 },
        { word: 'عَيَشَ', meaning: 'he lived', letters: ['ع', 'ي', 'ش'], category: 'verb', difficulty: 1 },
        { word: 'مَاتَ', meaning: 'he died', letters: ['م', 'ا', 'ت'], category: 'verb', difficulty: 1 },
    ],

    // Letter sets that form multiple words (pre-validated for game)
    game_sets: [
        {
            letters: ['ب', 'ي', 'ت', 'ا', 'ل'],
            valid_words: ['بيت', 'تاب', 'بت', 'ليت', 'بليت'],
            master_word: 'بيت'
        },
        {
            letters: ['ك', 'ت', 'ا', 'ب', 'ي'],
            valid_words: ['كتاب', 'باكي', 'كبت', 'تاك'],
            master_word: 'كتاب'
        },
        {
            letters: ['س', 'ل', 'ا', 'م', 'ي'],
            valid_words: ['سلام', 'سالم', 'لام', 'مال'],
            master_word: 'سالم'
        },
        {
            letters: ['ق', 'ل', 'م', 'ي', 'ن'],
            valid_words: ['قلم', 'نقي', 'لم', 'قن'],
            master_word: 'قلم'
        },
        {
            letters: ['ن', 'ا', 'ر', 'ي', 'ب'],
            valid_words: ['نار', 'بر', 'بان', 'ابر'],
            master_word: 'نار'
        },
        {
            letters: ['م', 'ا', 'ء', 'ي', 'ن'],
            valid_words: ['ماء', 'مان', 'نام', 'يان'],
            master_word: 'ماء'
        },
        {
            letters: ['ب', 'ح', 'ر', 'ي', 'ن'],
            valid_words: ['بحر', 'حرب', 'نبر', 'بحري'],
            master_word: 'بحري'
        },
        {
            letters: ['ج', 'ب', 'ل', 'ي', 'ن'],
            valid_words: ['جبل', 'بلج', 'نجل', 'جبلي'],
            master_word: 'جبل'
        },
        {
            letters: ['ش', 'م', 'س', 'ي', 'ن'],
            valid_words: ['شمس', 'مش', 'سن', 'شمسية'],
            master_word: 'شمس'
        },
        {
            letters: ['ق', 'م', 'ر', 'ي', 'ن'],
            valid_words: ['قمر', 'مرق', 'نقر', 'قمري'],
            master_word: 'قمر'
        },
        {
            letters: ['ح', 'ب', 'ي', 'ب', 'ن'],
            valid_words: ['حب', 'حي', 'بين', 'حبي'],
            master_word: 'حب'
        },
        {
            letters: ['و', 'ر', 'د', 'ي', 'ن'],
            valid_words: ['ورد', 'دي', 'ريد', 'نور'],
            master_word: 'ورد'
        },
        {
            letters: ['ع', 'ي', 'ن', 'ي', 'ن'],
            valid_words: ['عين', 'نعي', 'ين'],
            master_word: 'عين'
        },
        {
            letters: ['ف', 'ل', 'ي', 'ن', 'ي'],
            valid_words: ['فل', 'فين', 'نفل'],
            master_word: 'فل'
        },
        {
            letters: ['ك', 'ل', 'ي', 'ب', 'ن'],
            valid_words: ['كلب', 'كل', 'بنك', 'لي'],
            master_word: 'كلب'
        },
        {
            letters: ['ر', 'س', 'ا', 'ل', 'م'],
            valid_words: ['رسل', 'سلام', 'راس', 'لمس'],
            master_word: 'سلام'
        },
        {
            letters: ['ت', 'ل', 'ف', 'ا', 'ز'],
            valid_words: ['تلفاز', 'فاتل', 'زلف'],
            master_word: 'تلفاز'
        },
        {
            letters: ['ج', 'ا', 'م', 'ع', 'ة'],
            valid_words: ['جامعة', 'جمع', 'عام', 'عة'],
            master_word: 'جامعة'
        },
        {
            letters: ['م', 'ك', 'ت', 'ب', 'ة'],
            valid_words: ['مكتبة', 'كتب', 'مة'],
            master_word: 'مكتبة'
        },
        {
            letters: ['ح', 'د', 'ي', 'ق', 'ة'],
            valid_words: ['حديقة', 'حديد', 'قيد', ' diced'],
            master_word: 'حديقة'
        },
    ]
};

// Helper functions
const ArabicHelper = {
    // Get letter value
    getLetterValue(letter) {
        return ARABIC_LETTERS[letter]?.value || 1;
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
        const pool = [...availableLetters];
        for (let letter of word) {
            const idx = pool.indexOf(letter);
            if (idx === -1) return false;
            pool.splice(idx, 1);
        }
        return true;
    },

    // Scramble letters
    scrambleLetters(letters) {
        const arr = [...letters];
        for (let i = arr.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [arr[i], arr[j]] = [arr[j], arr[i]];
        }
        return arr;
    },

    // Get random game set
    getRandomGameSet() {
        return WORD_DATABASE.game_sets[
            Math.floor(Math.random() * WORD_DATABASE.game_sets.length)
        ];
    },

    // Find all valid words from letters
    findValidWords(letters) {
        const allWords = [
            ...WORD_DATABASE.three_letter,
            ...WORD_DATABASE.four_letter,
            ...WORD_DATABASE.five_letter,
            ...WORD_DATABASE.verbs
        ];

        return allWords.filter(word => {
            const normalizedWord = normalizeArabic(word.word);
            return this.canFormWord(normalizedWord, letters);
        });
    },

    // Strip diacritics from word
    stripDiacritics(word) {
        return normalizeArabic(word);
    }
};

// Export for use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { ARABIC_LETTERS, WORD_DATABASE, ArabicHelper, normalizeArabic };
}
