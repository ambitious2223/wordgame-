import { describe, it, expect } from "vitest";
import { LOCALES, t, setLocale, getLocale, DEFAULT_LOCALE } from "../src/js/i18n/index.js";

describe("i18n", () => {
  it("keeps en and ar locale maps in parity", () => {
    const enKeys = Object.keys(LOCALES.en).sort();
    const arKeys = Object.keys(LOCALES.ar).sort();
    expect(arKeys).toEqual(enKeys);
  });

  it("never leaves an empty translation", () => {
    for (const [locale, map] of Object.entries(LOCALES)) {
      for (const [key, value] of Object.entries(map)) {
        expect(value, `${locale}.${key}`).toBeTruthy();
      }
    }
  });

  it("interpolates parameters", () => {
    expect(t("results.title", { round: 3 }, "ar")).toBe("انتهت الجولة 3");
    expect(t("results.title", { round: 3 }, "en")).toBe("Round 3 ended");
  });

  it("falls back to the key and to the default locale", () => {
    expect(t("does.not.exist", {}, "ar")).toBe("does.not.exist");
    setLocale("nope");
    expect(getLocale()).toBe(DEFAULT_LOCALE);
  });
});