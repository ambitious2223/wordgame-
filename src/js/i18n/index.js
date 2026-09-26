/**
 * Minimal i18n. Locale maps must stay in parity (enforced by tests/i18n.test.js).
 */

export const LOCALES = {
  en: {
    "app.title": "Word Challenge",
    "badge.round": "Round",
    "letters.available": "Available letters",
    "score.total": "Score",
    "score.multiplier": "Multiplier",
    "score.round": "This round",
    "word.placeholder": "Type a word or tap the letters",
    "guess.placeholder": "Type the word here...",
    "guess.aria": "Type your guess",
    "submit": "Submit",
    "found.title": "Words found this round",
    "leaderboard.title": "Leaderboard",
    "leaderboard.live": "Live leaderboard",
    "leaderboard.allTime": "All-time winners",
    "leaderboard.match": "Match standings",
    "leaderboard.words": "Words guessed correctly",
    "round.possible": "Possible words: {count}",
    "results.missed": "Words you missed",
    "empty.none": "No results yet",
    "controls.title": "Controls",
    "controls.toggle": "Host controls",
    "controls.start": "Start game",
    "controls.next": "Next round",
    "controls.end": "End",
    "controls.music": "Music",
    "controls.volume": "Volume",
    "controls.sfx": "Sound effects",
    "controls.sfxVolume": "Effects volume",
    "controls.prevTrack": "Previous track",
    "controls.nextTrack": "Next track",
    "controls.playMusic": "Play music",
    "controls.pauseMusic": "Pause music",
    "controls.pause": "Pause",
    "controls.resume": "Resume",
    "controls.champions": "Show champions",
    "hub.title": "Tikora hub",
    "hub.online": "Hub connected",
    "hub.offline": "Hub offline (demo mode)",
    "hub.slug": "Game slug",
    "hub.key": "Hub API key",
    "hub.bridge": "Bridge",
    "hub.bridgeUrl": "Bridge URL",
    "tabs.game": "Game",
    "tabs.sound": "Sound",
    "tabs.connection": "Connection",
    "tabs.display": "Display",
    "display.matchWinners": "Match standings",
    "display.allTime": "All-time winners",
    "display.reset": "Reset match scores",
    "display.clear": "Remove all players",
    "display.noPlayers": "No players yet.",
    "hall.clearAll": "Clear the list",
    "hall.increase": "+ Score",
    "hall.decrease": "- Score",
    "hall.delete": "Delete",
    "hall.empty": "The hall is empty.",
    "conn.title": "Connection",
    "conn.mode": "Event source",
    "conn.mode.hub": "Tikora hub",
    "conn.mode.bridge": "TikFinity (bridge)",
    "conn.mode.both": "Both (hub + bridge)",
    "conn.mode.mock": "Offline (demo)",
    "conn.modeHint": "Choose where viewer chat and gifts come from.",
    "conn.hubUrl": "Hub URL",
    "conn.bridgeUrl": "Bridge URL",
    "conn.slug": "Game slug",
    "conn.key": "Hub API key",
    "conn.apply": "Connect",
    "conn.test": "Test connection",
    "conn.status": "Status",
    "conn.hubLabel": "Hub",
    "conn.bridgeLabel": "Bridge",
    "conn.connected": "connected",
    "conn.offline": "offline",
    "conn.disabled": "disabled",
    "conn.gameLost": "Connect the game first",
    "lang.aria": "Switch language",
    "host.handle": "Controls",
    "word.clearTitle": "Click to clear",
    "champions.title": "Hall of Kings",
    "champions.subtitle": "Hall of Fame",
    "champions.customTitle": "Hall title",
    "champions.empty": "No champions yet — finish a full game!",
    "champions.close": "Close",
    "settings.gameName": "Game name",
    "settings.rounds": "Rounds:",
    "settings.duration": "Seconds per round:",
    "gameOver.title": "Game over!",
    "playAgain": "Play again",
    "continue": "Next round",
    "showResults": "Show result",
    "toast.startFirst": "Start the game first",
    "toast.length": "Word must be 3-5 letters",
    "toast.charset": "Use Arabic letters only",
    "toast.duplicate": "This word was already found",
    "toast.unformable": "This word cannot be formed from the letters",
    "toast.invalid": "Not a valid word this round",
    "toast.allFound": "Great! You found every word",
    "results.title": "Round {round} ended",
    "results.summary": "Found {found} words · Round score: {score}",
    "results.allWords": "Great! You found every word",
    "results.auto": "Next round starts in {seconds}s",
    "winner.label": "Winner",
    "points": "points"
  },
  ar: {
    "app.title": "تحدي الكلمات",
    "badge.round": "الجولة",
    "letters.available": "الحروف المتاحة",
    "score.total": "النقاط",
    "score.multiplier": "المضاعف",
    "score.round": "هذه الجولة",
    "word.placeholder": "اكتب كلمة أو انقر على الحروف",
    "guess.placeholder": "اكتب الكلمة هنا...",
    "guess.aria": "اكتب تخمينك",
    "submit": "تأكيد ✓",
    "found.title": "الكلمات المكتشفة في هذه الجولة",
    "leaderboard.title": "🏆 الصدارة",
    "leaderboard.live": "المتصدرون مباشرة",
    "leaderboard.allTime": "🏆 أبطال كل الأوقات",
    "leaderboard.match": "نتائج المباراة",
    "leaderboard.words": "كلمات صحيحة",
    "round.possible": "كلمات ممكنة: {count}",
    "results.missed": "كلمات فاتتك",
    "empty.none": "لا توجد نتائج بعد",
    "controls.title": "🎮 التحكم",
    "controls.toggle": "لوحة التحكم",
    "controls.start": "▶️ بدء اللعبة",
    "controls.next": "⏭️ الجولة التالية",
    "controls.end": "⏹️ إنهاء",
    "controls.music": "الموسيقى",
    "controls.volume": "مستوى الصوت",
    "controls.sfx": "المؤثرات الصوتية",
    "controls.sfxVolume": "صوت المؤثرات",
    "controls.prevTrack": "المقطع السابق",
    "controls.nextTrack": "المقطع التالي",
    "controls.playMusic": "تشغيل الموسيقى",
    "controls.pauseMusic": "إيقاف الموسيقى",
    "controls.pause": "إيقاف مؤقت",
    "controls.resume": "استئناف",
    "controls.champions": "عرض الأبطال",
    "hub.title": "مركز تكورا",
    "hub.online": "متصل بالمركز",
    "hub.offline": "غير متصل (وضع تجريبي)",
    "hub.slug": "معرّف اللعبة",
    "hub.key": "مفتاح المركز",
    "hub.bridge": "الجسر",
    "hub.bridgeUrl": "رابط الجسر",
    "tabs.game": "اللعبة",
    "tabs.sound": "الصوت",
    "tabs.connection": "الاتصال",
    "tabs.display": "العرض",
    "display.matchWinners": "نتائج المباراة",
    "display.allTime": "أبطال كل الأوقات",
    "display.reset": "تصفير نقاط المباراة",
    "display.clear": "إزالة كل اللاعبين",
    "display.noPlayers": "لا يوجد لاعبون بعد.",
    "hall.clearAll": "مسح القائمة",
    "hall.increase": "+ نقاط",
    "hall.decrease": "- نقاط",
    "hall.delete": "حذف",
    "hall.empty": "القاعة فارغة.",
    "conn.title": "الاتصال",
    "conn.mode": "مصدر الأحداث",
    "conn.mode.hub": "مركز تكورا",
    "conn.mode.bridge": "تيك فينتي (جسر)",
    "conn.mode.both": "كلاهما (المركز + الجسر)",
    "conn.mode.mock": "غير متصل (تجريبي)",
    "conn.modeHint": "اختر من أين تأتي تعليقات وهدايا المشاهدين.",
    "conn.hubUrl": "رابط المركز",
    "conn.bridgeUrl": "رابط الجسر",
    "conn.slug": "معرّف اللعبة",
    "conn.key": "مفتاح المركز",
    "conn.apply": "اتصال",
    "conn.test": "اختبار الاتصال",
    "conn.status": "الحالة",
    "conn.hubLabel": "المركز",
    "conn.bridgeLabel": "الجسر",
    "conn.connected": "متصل",
    "conn.offline": "غير متصل",
    "conn.disabled": "معطّل",
    "conn.gameLost": "اربط اللعبة أولاً",
    "lang.aria": "تغيير اللغة",
    "host.handle": "تحكم",
    "word.clearTitle": "انقر لمسح الكلمة",
    "champions.title": "قاعة الملوك",
    "champions.subtitle": "قاعة المشاهير",
    "champions.customTitle": "عنوان القاعة",
    "champions.empty": "لا يوجد أبطال بعد — أكمل مباراة كاملة!",
    "champions.close": "إغلاق",
    "settings.gameName": "اسم اللعبة",
    "settings.rounds": "عدد الجولات:",
    "settings.duration": "ثانية لكل جولة:",
    "gameOver.title": "انتهت اللعبة!",
    "playAgain": "العب مرة أخرى",
    "continue": "الجولة التالية",
    "showResults": "عرض النتيجة",
    "toast.startFirst": "ابدأ اللعبة أولاً",
    "toast.length": "الكلمة يجب أن تكون بين 3 و 5 حروف",
    "toast.charset": "استخدم الحروف العربية فقط",
    "toast.duplicate": "تم اكتشاف هذه الكلمة بالفعل",
    "toast.unformable": "لا يمكن تشكيل هذه الكلمة من الحروف المتاحة",
    "toast.invalid": "هذه ليست كلمة صحيحة في هذه الجولة",
    "toast.allFound": "أحسنت! اكتشفت كل الكلمات",
    "results.title": "انتهت الجولة {round}",
    "results.summary": "اكتشفت {found} كلمة · نقاط الجولة: {score}",
    "results.allWords": "أحسنت! اكتشفت كل الكلمات",
    "results.auto": "الجولة التالية تلقائياً خلال {seconds} ثوانٍ",
    "winner.label": "الفائز",
    "points": "نقطة"
  }
};

export const DEFAULT_LOCALE = "ar";

/** @type {string} */
let currentLocale = DEFAULT_LOCALE;

/**
 * @param {string} locale
 */
export function setLocale(locale) {
  currentLocale = locale in LOCALES ? locale : DEFAULT_LOCALE;
  return currentLocale;
}

/** @returns {string} */
export function getLocale() {
  return currentLocale;
}

/**
 * @param {string} key
 * @param {Record<string, string|number>} [params]
 * @param {string} [locale]
 * @returns {string}
 */
export function t(key, params = {}, locale = currentLocale) {
  const map = LOCALES[/** @type {keyof typeof LOCALES} */ (locale)] ?? LOCALES[DEFAULT_LOCALE];
  const template = map[/** @type {keyof typeof LOCALES.en} */ (key)] ?? key;
  return template.replace(/\{(\w+)\}/g, (_, name) => String(params[name] ?? `{${name}}`));
}

/**
 * Applies translations to elements carrying data-i18n attributes.
 * @param {ParentNode} root
 * @param {string} [locale]
 */
export function applyTranslations(root, locale = currentLocale) {
  root.querySelectorAll("[data-i18n]").forEach((node) => {
    const key = node.getAttribute("data-i18n");
    if (key) node.textContent = t(key, {}, locale);
  });
  root.querySelectorAll("[data-i18n-placeholder]").forEach((node) => {
    const key = node.getAttribute("data-i18n-placeholder");
    if (key && "placeholder" in node) /** @type {HTMLInputElement} */ (node).placeholder = t(key, {}, locale);
  });
  root.querySelectorAll("[data-i18n-aria]").forEach((node) => {
    const key = node.getAttribute("data-i18n-aria");
    if (key) node.setAttribute("aria-label", t(key, {}, locale));
  });
  root.querySelectorAll("[data-i18n-title]").forEach((node) => {
    const key = node.getAttribute("data-i18n-title");
    if (key) node.setAttribute("title", t(key, {}, locale));
  });
}
