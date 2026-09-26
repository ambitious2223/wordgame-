import { describe, it, expect } from "vitest";
import { normalizeArabic, isArabicLettersOnly } from "../src/js/core/normalize.js";

describe("normalizeArabic", () => {
  it("strips tashkeel", () => {
    expect(normalizeArabic("بَيْت")).toBe("بيت");
    expect(normalizeArabic("مَكْتَبَة")).toBe("مكتبه");
  });

  it("unifies alef forms, ta marbuta and alef maqsura", () => {
    expect(normalizeArabic("أحمد")).toBe("احمد");
    expect(normalizeArabic("إبراهيم")).toBe("ابراهيم");
    expect(normalizeArabic("آمن")).toBe("امن");
    expect(normalizeArabic("على")).toBe("علي");
    expect(normalizeArabic("حمزة")).toBe("حمزه");
  });

  it("handles empty and non-string input", () => {
    expect(normalizeArabic("")).toBe("");
    expect(normalizeArabic("   ")).toBe("");
    expect(normalizeArabic(null)).toBe("");
    expect(normalizeArabic(undefined)).toBe("");
  });
});

describe("isArabicLettersOnly", () => {
  it("accepts Arabic letters", () => {
    expect(isArabicLettersOnly("بيت")).toBe(true);
    expect(isArabicLettersOnly("ماء")).toBe(true);
  });

  it("rejects latin letters, digits and symbols", () => {
    expect(isArabicLettersOnly("hello")).toBe(false);
    expect(isArabicLettersOnly("بيت1")).toBe(false);
    expect(isArabicLettersOnly("بيت!")).toBe(false);
  });
});