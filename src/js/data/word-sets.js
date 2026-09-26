/**
 * Curated, verified Arabic letter sets.
 *
 * Invariants (enforced by tests/dictionary.test.js):
 * - Every set has exactly 5 letters.
 * - Every word is 3-5 letters, uses only letters from the set (multiset), once per letter.
 * - Every word is unique within its set.
 * - Every set has at least 3 words.
 *
 * @typedef {Object} WordSet
 * @property {string} id
 * @property {string[]} letters
 * @property {string[]} words
 */

/** @type {readonly WordSet[]} */
export const WORD_SETS = Object.freeze([
  { id: "beit", letters: ["ب", "ي", "ت", "ا", "ل"], words: ["بيت", "تاب", "ليت"] },
  { id: "kitab", letters: ["ك", "ت", "ا", "ب", "ي"], words: ["كتاب", "كاتب", "كبت"] },
  { id: "salam", letters: ["س", "ل", "ا", "م", "ي"], words: ["سلام", "سالم", "لام", "مال"] },
  { id: "qalam", letters: ["ق", "ل", "م", "ي", "ن"], words: ["قلم", "نمل", "نقي"] },
  { id: "nar", letters: ["ن", "ا", "ر", "ي", "ب"], words: ["نار", "بان", "بني"] },
  { id: "maa", letters: ["م", "ا", "ء", "ي", "ن"], words: ["ماء", "نام", "مان"] },
  { id: "bahr", letters: ["ب", "ح", "ر", "ي", "ن"], words: ["بحر", "حرب", "نحر", "بحري"] },
  { id: "jabal", letters: ["ج", "ب", "ل", "ي", "ن"], words: ["جبل", "جبلي", "نجل"] },
  { id: "shams", letters: ["ش", "م", "س", "ي", "ن"], words: ["شمس", "نسم", "سمن"] },
  { id: "qamar", letters: ["ق", "م", "ر", "ي", "ن"], words: ["قمر", "قمري", "رقم", "نقر", "مرق"] },
  { id: "hob", letters: ["ح", "ب", "ي", "ب", "ن"], words: ["بين", "بني", "حبي"] },
  { id: "ward", letters: ["و", "ر", "د", "ي", "ن"], words: ["ورد", "نور", "دين", "وردي"] },
  { id: "ain", letters: ["ع", "ي", "ن", "ي", "ن"], words: ["عين", "نعي", "عني"] },
  { id: "fil", letters: ["ف", "ل", "ي", "ن", "ي"], words: ["يلي", "نفل", "فني"] },
  { id: "kalb", letters: ["ك", "ل", "ي", "ب", "ن"], words: ["كلب", "لبن", "نبل", "بنك"] },
  { id: "rsalm", letters: ["ر", "س", "ا", "ل", "م"], words: ["سلام", "لمس", "سمر"] },
  { id: "tlfaz", letters: ["ت", "ل", "ف", "ا", "ز"], words: ["تلفاز", "فتل", "زفت"] },
  { id: "jamia", letters: ["ج", "ا", "م", "ع", "ة"], words: ["جامعة", "جمع", "عام"] },
  { id: "maktaba", letters: ["م", "ك", "ت", "ب", "ة"], words: ["مكتبة", "كتب", "مكة"] },
  { id: "hadiqa", letters: ["ح", "د", "ي", "ق", "ة"], words: ["حديقة", "قيد", "دية"] }
]);
