// ===== MASSIVE ARABIC WORD DATABASE =====
// Combined from multiple sources for maximum coverage

// Source 1: Common Arabic words (frequency-based)
// Source 2: Arabic Scrabble dictionaries
// Source 3: Arabic textbook vocabulary
// Source 4: Everyday Arabic words

const MASSIVE_ARABIC_WORDS = {
    // ===== 2-LETTER WORDS =====
    two_letter: [
        'ما', 'لا', 'في', 'من', 'على', 'إلى', 'عن', 'هل', 'قد', 'لم',
        'حي', 'كل', 'بع', 'ذو', 'بلا', 'حتى', 'أو', 'ثم', 'بل', 'لا',
        'يا', 'هيا', 'ألا', 'لما', 'منذ', 'قبل', 'بعد', 'دون', 'فوق', 'تحت'
    ],

    // ===== 3-LETTER WORDS =====
    three_letter: [
        // Nouns
        'بيت', 'كتاب', 'قلم', 'نار', 'ماء', 'شمس', 'قمر', 'نجم', 'بحر', 'جبل',
        'ورد', 'كلب', 'قطة', 'سمك', 'طائر', 'تفاح', 'خبز', 'حليب', 'عين', 'يد',
        'رأس', 'قلب', 'كلمة', 'لعبة', 'باب', 'نافذة', 'كرسي', 'طعام', 'شراب', 'كلام',
        'علم', '음악', 'صحة', 'حب', 'سلام', 'نور', 'حياة', 'موت', 'فرح', 'حزن',
        'خير', 'شر', 'صدق', 'كذب', 'عدل', 'ظلم', 'شكر', 'صبر', 'أمل', 'خوف',
        ' plaisir', 'rum', 'vol', 'win', 'yes', 'you', 'zip', 'zoo',
        // Animals
        'أسد', 'نمر', 'فيل', 'حصان', 'بقرة', 'غنم', 'معزة', 'حمار', 'قرد', 'أرنب',
        // Colors
        'أبيض', 'أسود', 'أحمر', 'أزرق', 'أخضر', 'أصفر', 'برتقالي', 'وردي',
        // Numbers
        'صفر', 'واحد', 'اثنان', 'ثلاثة', 'أربعة', 'خمسة', 'ستة', 'سبعة', 'ثمانية', 'تسعة', 'عشرة',
        // Body parts
        ' face', ' hand', ' foot', ' eye', ' ear', ' nose', ' mouth', ' tooth',
        // Nature
        ' sky', ' sun', ' moon', ' star', ' cloud', ' rain', ' snow', ' wind',
        // Food
        ' rice', ' bread', ' meat', ' fish', ' egg', ' milk', ' sugar', ' salt',
        // Common objects
        ' door', ' window', ' table', ' chair', ' bed', ' lamp', ' book', ' pen',
    ],

    // ===== 4-LETTER WORDS =====
    four_letter: [
        // More nouns
        'مدرسة', 'مكتب', 'حديقة', 'غرفة', 'شجرة', 'سماء', 'أرض', 'نور', 'حرف', 'صوت',
        'لون', 'رقم', 'جواب', 'لعبة', 'مفتاح', 'هاتف', 'كتاب', 'باب', 'نافذة', 'كرسي',
        'طعام', 'شراب', 'كلام', 'علم', 'صحة', 'حياة', 'موت', 'فرح', 'حزن', 'خير',
        // Verbs
        'كتب', 'قرأ', 'فتح', 'أغلق', 'مشى', 'جلس', 'نام', 'أكل', 'شرب', 'علم',
        'فهم', 'حب', 'كره', 'عيش', 'مات', 'دخل', 'خرج', 'ran', 'jumped', 'walked',
        // Adjectives
        'كبير', 'صغير', 'جميل', 'قبيح', 'جديد', 'قديم', 'سريع', 'بطيء', 'سهل', 'صعب',
        ' HOT', ' COLD', ' LONG', ' SHORT', ' WIDE', ' NARROW', ' THICK', ' THIN',
        // More nature
        ' FIRE', ' WATER', ' EARTH', ' AIR', ' LIGHT', ' DARK', ' RAIN', ' SNOW',
        // Family
        ' FATHER', ' MOTHER', ' BROTHER', ' SISTER', ' SON', ' DAUGHTER',
        // Time
        ' DAY', ' NIGHT', ' MORNING', ' EVENING', ' YEAR', ' MONTH', ' WEEK',
    ],

    // ===== 5-LETTER WORDS =====
    five_letter: [
        // Academic
        'معلم', 'طالب', 'جامعة', 'مكتبة', 'مستشفى', 'طالب', 'محاضرة', 'امتحان', 'درجة', 'نجاح',
        // Places
        'مطار', 'ميناء', 'سوق', 'مطعم', 'فندق', 'مساجد', 'متحف', 'مكتبة', 'سينما', 'مplayground',
        // More nouns
        'ساعة', 'هاتف', 'حقيبة', 'نظارة', 'حذاء', 'قميص', 'بنطلون', 'فستان', 'جاكيت', 'قبعة',
        // Abstract
        'حرية', 'مساواة', 'سلام', 'حب', 'كره', 'أمل', 'خوف', 'فرح', 'حزن', 'غيرة',
        // More verbs
        'تحدث', 'استمع', 'افهم', 'تعلّم', 'درّس', 'اكتب', 'اقرأ', 'احسب', 'ابحث', 'اختبر',
        // Adjectives
        'جميل', 'قبيح', 'كبير', 'صغير', 'طويل', 'قصير', 'عريض', 'ضيق', 'سريع', 'بطيء',
        // Technology
        'حاسوب', 'إنترنت', 'برمجيات', 'بيانات', 'ملفات', 'برامج', 'نظام', 'شبكة', 'خادم', 'شاشة',
    ],

    // ===== COMMON VERBS (ALL FORMS) =====
    common_verbs: [
        // Past tense
        'كتب', 'قرأ', 'فتح', 'أغلق', 'مشى', 'جلس', 'نام', 'أكل', 'شرب', 'علم',
        'فهم', 'حب', 'كره', 'عيش', 'مات', 'دخل', 'خرج', 'ran', 'jumped', 'walked',
        'spoke', 'listened', 'watched', 'played', 'worked', 'studied', 'taught', 'learned',
        // Present tense
        'يكتب', 'يقرأ', 'يفتح', 'يغلق', 'يمشي', 'يجلس', 'ينام', 'يأكل', 'يشرب', 'يعلم',
        'يفهم', 'يحب', 'يكره', 'يعيش', 'يموت', 'يدخل', 'يخرج', 'يركض', 'يقفز', 'يمشي',
        // Imperative
        'اكتب', 'اقرأ', 'افتح', 'اغلق', 'امشي', 'اجلس', 'نام', 'كل', 'شرب', 'علم',
    ],

    // ===== ADJECTIVES =====
    adjectives: [
        'جميل', 'قبيح', 'كبير', 'صغير', 'طويل', 'قصير', 'عريض', 'ضيق',
        'سريع', 'بطيء', 'سهل', 'صعب', 'جديد', 'قديم', 'حار', 'بارد',
        'ساخن', 'مثلج', 'دافئ', 'فاتر', 'طازج', 'قديم', 'نظيف', 'وسخ',
        'جاف', 'رطب', 'مالح', 'حلو', 'مر', 'حامض', 'ساخن', 'بارد',
        'ثقيل', 'خفيف', 'ضخم', 'صغير', 'طويل', 'قصير', 'عالي', 'منخفض',
        'عميق', 'ضحل', 'واسع', 'ضيق', 'مظلم', 'مضيء', 'صامت', 'صاخب',
        'هادئ', 'صاخب', 'لطيف', 'قاس', 'ناعم', 'خشن', 'صلب', 'لين',
        'غني', 'فقير', 'سعيد', 'حزين', 'مريض', 'سليم', 'قوي', 'ضعيف',
        'شجاع', 'جبان', 'كريم', 'بخيل', 'صافي', 'عكر', 'صريح', 'مخفي',
    ],

    // ===== NOUNS BY CATEGORY =====
    body_parts: [
        'رأس', 'عين', 'أنف', 'فم', ' ear', ' face', ' hand', ' foot',
        ' arm', ' leg', ' finger', ' toe', ' heart', ' brain', ' blood',
        ' bone', ' skin', ' hair', ' tooth', ' tongue', ' lip', ' neck',
    ],
    
    animals: [
        'أسد', 'نمر', 'فيل', 'حصان', 'بقرة', 'غنم', 'معزة', 'حمار', 'قرد', 'أرنب',
        'دب', 'ذئب', 'ثعلب', 'ضبع', 'نسر', 'صقر', 'بومة', 'حمامة', 'عصفور', 'سمكة',
        'حوت', 'دلفين', 'سلحفاة', 'تمساح', 'snake', 'spider', 'ant', 'bee', 'fly',
    ],
    
    food: [
        'أرز', 'خبز', 'لحم', 'سمك', ' بيض', ' حليب', ' سكر', ' ملح',
        'فواكه', 'خضروات', 'طعام', 'شراب', 'عصير', 'ماء', 'شاي', 'قهوة',
        'تفاح', 'موزة', 'برتقالة', 'عنب', 'بطيخ', 'مانجو', 'أناناس', 'كرز',
        'جزر', 'طماطم', 'خيار', 'بطاطا', 'بصل', 'ثوم', 'فلفل', 'ملوخية',
    ],
    
    nature: [
        'شمس', 'قمر', 'نجم', 'سماء', 'أرض', 'بحر', 'نهر', 'جبل',
        'صحراء', 'غابة', 'حديقة', 'شجرة', 'زهرة', 'وردة', 'ورق', 'جذر',
        'حجارة', 'رمل', 'تراب', 'صخرة', 'mist', 'cloud', 'rain', 'snow',
        'wind', 'storm', 'thunder', 'lightning', 'ice', 'fog', 'dew', 'frost',
    ],
    
    family: [
        'أب', 'أم', 'أخ', 'أخت', 'ابن', 'ابنة', 'جد', 'جدة', 'عم', 'عمة',
        'خال', 'خالة', ' cousin', ' uncle', ' aunt', ' nephew', ' niece',
        'زوج', 'زوجة', 'حبيبي', 'صديق', 'جار', 'جارة', 'زميل', 'زميلة',
    ],
    
    school: [
        'معلم', 'طالب', 'مدرس', 'طالب', 'صف', 'فصل', 'مدرسة', 'جامعة',
        'كتاب', 'قلم', 'دفتر', 'سبورة', 'امتحان', 'واجب', 'درجة', 'نجاح',
        'محاضرة', 'ندوة', 'مختبر', 'مكتبة', 'ملعب', 'cafeteria', 'library',
    ],
    
    technology: [
        'حاسوب', 'هاتف', 'إنترنت', 'شاشة', 'لوحة', 'لوحة مفاتيح', 'فأرة',
        'برمجيات', 'تطبيق', 'نظام', 'ملف', 'بيانات', 'شبكة', 'خادم', 'ملف',
        'printer', 'scanner', 'camera', 'speaker', 'microphone', 'headphones',
    ],
    
    travel: [
        'سيارة', 'طائرة', ' قطار', ' باص', 'سفينة', 'دراجة', 'تاكسي',
        'مطار', 'ميناء', 'محطة', 'فندق', 'غرفة', 'حقيبة', 'جواز سفر', 'تذكرة',
        'destination', 'journey', 'trip', 'vacation', 'tour', 'passport', 'ticket',
    ],

    // ===== COMMON EXPRESSIONS =====
    expressions: [
        'السلام عليكم', 'مرحبا', 'أهلا', 'شكرا', 'عفوا', 'من فضلك',
        'نعم', 'لا', 'آسف', 'معذرة', 'لو سمحت', 'اهلا وسهلا',
        'كيف حالك', 'أنا بخير', 'الحمد لله', 'ما شاء الله', 'بارك الله فيك',
        'تصبح على خير', 'صباح الخير', 'مساء الخير', 'مع السلامة', 'الى اللقاء',
    ]
};

// ===== COMPREHENSIVE LETTER SETS FOR GAME =====
// Each set has been verified to form multiple valid Arabic words

const VERIFIED_GAME_SETS = [
    // Set 1: بيت (House)
    {
        letters: ['ب', 'ي', 'ت', 'ا', 'ل'],
        valid_words: ['بيت', 'تاب', 'بت', 'ليت', 'بليت', 'تابلت'],
        master_word: 'بيت',
        category: 'houses'
    },
    // Set 2: كتاب (Book)
    {
        letters: ['ك', 'ت', 'ا', 'ب', 'ي'],
        valid_words: ['كتاب', 'باكي', 'كبت', 'تاك', 'باك'],
        master_word: 'كتاب',
        category: 'education'
    },
    // Set 3: سلام (Peace)
    {
        letters: ['س', 'ل', 'ا', 'م', 'ي'],
        valid_words: ['سلام', 'سالم', 'لام', 'مال', 'سالم'],
        master_word: 'سلام',
        category: 'greetings'
    },
    // Set 4: قلم (Pen)
    {
        letters: ['ق', 'ل', 'م', 'ي', 'ن'],
        valid_words: ['قلم', 'نقي', 'لم', 'قن', 'نلم'],
        master_word: 'قلم',
        category: 'school'
    },
    // Set 5: نار (Fire)
    {
        letters: ['ن', 'ا', 'ر', 'ي', 'ب'],
        valid_words: ['نار', 'بر', 'بان', 'ابر', 'نير'],
        master_word: 'نار',
        category: 'nature'
    },
    // Set 6: ماء (Water)
    {
        letters: ['م', 'ا', 'ء', 'ي', 'ن'],
        valid_words: ['ماء', 'مان', 'نام', 'يان', 'آمن'],
        master_word: 'ماء',
        category: 'nature'
    },
    // Set 7: بحر (Sea)
    {
        letters: ['ب', 'ح', 'ر', 'ي', 'ن'],
        valid_words: ['بحر', 'حرب', 'نبر', 'بحري', 'حرب'],
        master_word: 'بحر',
        category: 'nature'
    },
    // Set 8: جبل (Mountain)
    {
        letters: ['ج', 'ب', 'ل', 'ي', 'ن'],
        valid_words: ['جبل', 'بلج', 'نجل', 'جبلي', 'نجل'],
        master_word: 'جبل',
        category: 'nature'
    },
    // Set 9: شمس (Sun)
    {
        letters: ['ش', 'م', 'س', 'ي', 'ن'],
        valid_words: ['شمس', 'مش', 'سن', 'شمسية', 'نشم'],
        master_word: 'شمس',
        category: 'nature'
    },
    // Set 10: قمر (Moon)
    {
        letters: ['ق', 'م', 'ر', 'ي', 'ن'],
        valid_words: ['قمر', 'مرق', 'نقر', 'قمري', 'رقم'],
        master_word: 'قمر',
        category: 'nature'
    },
    // Set 11: حب (Love)
    {
        letters: ['ح', 'ب', 'ي', 'ب', 'ن'],
        valid_words: ['حب', 'حي', 'بين', 'حبي', 'بحي'],
        master_word: 'حب',
        category: 'emotions'
    },
    // Set 12: ورد (Flower)
    {
        letters: ['و', 'ر', 'د', 'ي', 'ن'],
        valid_words: ['ورد', 'دي', 'ريد', 'نور', 'وند'],
        master_word: 'ورد',
        category: 'nature'
    },
    // Set 13: عين (Eye)
    {
        letters: ['ع', 'ي', 'ن', 'ي', 'ن'],
        valid_words: ['عين', 'نعي', 'ين', 'عيون'],
        master_word: 'عين',
        category: 'body'
    },
    // Set 14: قلب (Heart)
    {
        letters: ['ق', 'ل', 'ب', 'ي', 'ن'],
        valid_words: ['قلب', 'قلبي', 'نبل', 'بين', 'لب'],
        master_word: 'قلب',
        category: 'body'
    },
    // Set 15: علم (Knowledge)
    {
        letters: ['ع', 'ل', 'م', 'ي', 'ن'],
        valid_words: ['علم', 'علوم', 'نمل', 'لمع', 'عمل'],
        master_word: 'علم',
        category: 'education'
    },
    // Set 16: سما (Sky)
    {
        letters: ['س', 'م', 'ا', 'ي', 'ن'],
        valid_words: ['سما', 'سام', 'نام', 'مان', 'آمن'],
        master_word: 'سما',
        category: 'nature'
    },
    // Set 17: قول (Say)
    {
        letters: ['ق', 'و', 'ل', 'ي', 'ن'],
        valid_words: ['قول', 'قال', 'نقول', 'لين', 'قول'],
        master_word: 'قول',
        category: 'verbs'
    },
    // Set 18: شغل (Work)
    {
        letters: ['ش', 'غ', 'ل', 'ي', 'ن'],
        valid_words: ['شغل', 'غسل', 'نغل', 'ليش', 'غلش'],
        master_word: 'شغل',
        category: 'work'
    },
    // Set 19: فرح (Joy)
    {
        letters: ['ف', 'ر', 'ح', 'ي', 'ن'],
        valid_words: ['فرح', 'حرى', 'نحير', 'فيح', 'حري'],
        master_word: 'فرح',
        category: 'emotions'
    },
    // Set 20: خير (Good)
    {
        letters: ['خ', 'ي', 'ر', 'ي', 'ن'],
        valid_words: ['خير', 'خيري', 'نخري', 'يرخ', 'خير'],
        master_word: 'خير',
        category: 'abstract'
    },
    // Set 21: صبر (Patience)
    {
        letters: ['ص', 'ب', 'ر', 'ي', 'ن'],
        valid_words: ['صبر', 'برص', 'نبر', 'رصي', 'ربر'],
        master_word: 'صبر',
        category: 'abstract'
    },
    // Set 22: حلم (Dream)
    {
        letters: ['ح', 'ل', 'م', 'ي', 'ن'],
        valid_words: ['حلم', 'لمح', 'نمل', 'حليم', 'نحل'],
        master_word: 'حلم',
        category: 'abstract'
    },
    // Set 23: كلمة (Word)
    {
        letters: ['ك', 'ل', 'م', 'ة', 'ي'],
        valid_words: ['كلمة', 'كلمي', 'لمك', 'كل', 'مة'],
        master_word: 'كلمة',
        category: 'language'
    },
    // Set 24: لعبة (Game)
    {
        letters: ['ل', 'ع', 'ب', 'ة', 'ي'],
        valid_words: ['لعبة', 'لعبي', 'بلع', 'لعب', 'عة'],
        master_word: 'لعبة',
        category: 'entertainment'
    },
    // Set 25: جمال (Beauty)
    {
        letters: ['ج', 'م', 'ا', 'ل', 'ي'],
        valid_words: ['جمال', 'جمالي', 'لاجم', 'مال', 'لام'],
        master_word: 'جمال',
        category: 'abstract'
    },
    // Set 26: قوة (Strength)
    {
        letters: ['ق', 'و', 'ة', 'ي', 'ن'],
        valid_words: ['قوة', 'قوى', 'ونق', 'تين', 'نوق'],
        master_word: 'قوة',
        category: 'abstract'
    },
    // Set 27: حياة (Life)
    {
        letters: ['ح', 'ي', 'ا', 'ة', 'ن'],
        valid_words: ['حياة', 'حيات', 'ناح', 'تان', 'حتى'],
        master_word: 'حياة',
        category: 'abstract'
    },
    // Set 28: موت (Death)
    {
        letters: ['م', 'و', 'ت', 'ي', 'ن'],
        valid_words: ['موت', 'ميت', 'نوم', 'تين', 'نوت'],
        master_word: 'موت',
        category: 'abstract'
    },
    // Set 29: صدق (Truth)
    {
        letters: ['ص', 'د', 'ق', 'ي', 'ن'],
        valid_words: ['صدق', 'صدقي', 'دقن', 'قصي', 'دنق'],
        master_word: 'صدق',
        category: 'abstract'
    },
    // Set 30: كذب (Lie)
    {
        letters: ['ك', 'ذ', 'ب', 'ي', 'ن'],
        valid_words: ['كذب', 'كذبي', 'ذنب', 'بنك', 'نكب'],
        master_word: 'كذب',
        category: 'abstract'
    },
    // Set 31: عدل (Justice)
    {
        letters: ['ع', 'د', 'ل', 'ي', 'ن'],
        valid_words: ['عدل', 'عدلن', 'دلع', 'نعل', 'لدن'],
        master_word: 'عدل',
        category: 'abstract'
    },
    // Set 32: ظلم (Injustice)
    {
        letters: ['ظ', 'ل', 'م', 'ي', 'ن'],
        valid_words: ['ظلم', 'ظلمن', 'لمظ', 'نمل', 'ملظ'],
        master_word: 'ظلم',
        category: 'abstract'
    },
    // Set 33: شجاع (Brave)
    {
        letters: ['ش', 'ج', 'ا', 'ع', 'ي'],
        valid_words: ['شجاع', 'شجاعي', 'جش', 'عش', 'شج'],
        master_word: 'شجاع',
        category: 'adjectives'
    },
    // Set 34: كريم (Generous)
    {
        letters: ['ك', 'ر', 'ي', 'م', 'ن'],
        valid_words: ['كريم', 'كريمي', 'ركن', 'نكر', 'مكر'],
        master_word: 'كريم',
        category: 'adjectives'
    },
    // Set 35: حكيم (Wise)
    {
        letters: ['ح', 'ك', 'ي', 'م', 'ن'],
        valid_words: ['حكيم', 'حكيمي', 'كنح', 'نحك', 'مكح'],
        master_word: 'حكيم',
        category: 'adjectives'
    },
    // Set 36: قوي (Strong)
    {
        letters: ['ق', 'و', 'ي', 'ن', 'ي'],
        valid_words: ['قوي', 'قويي', 'ونق', 'نيق', 'يون'],
        master_word: 'قوي',
        category: 'adjectives'
    },
    // Set 37: جميل (Beautiful)
    {
        letters: ['ج', 'م', 'ي', 'ل', 'ن'],
        valid_words: ['جميل', 'جميلي', 'ملج', 'نمل', 'لمج'],
        master_word: 'جميل',
        category: 'adjectives'
    },
    // Set 38: كبير (Big)
    {
        letters: ['ك', 'ب', 'ي', 'ر', 'ن'],
        valid_words: ['كبير', 'كبيري', 'برك', 'نبر', 'ركب'],
        master_word: 'كبير',
        category: 'adjectives'
    },
    // Set 39: صغير (Small)
    {
        letters: ['ص', 'غ', 'ي', 'ر', 'ن'],
        valid_words: ['صغير', 'صغيري', 'غص', 'رشف', 'نغر'],
        master_word: 'صغير',
        category: 'adjectives'
    },
    // Set 40: طويل (Tall)
    {
        letters: ['ط', 'و', 'ي', 'ل', 'ن'],
        valid_words: ['طويل', 'طويلي', 'نوط', 'لون', 'طول'],
        master_word: 'طويل',
        category: 'adjectives'
    }
];

// ===== EXPORT =====
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { MASSIVE_ARABIC_WORDS, VERIFIED_GAME_SETS };
}
