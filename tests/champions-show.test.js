// @vitest-environment jsdom
import { describe, it, expect, afterEach } from "vitest";
import { showChampionsOverlay } from "../src/js/ui/champions-show.js";

afterEach(() => {
  document.getElementById("championsOverlay")?.remove();
});

describe("champions overlay", () => {
  it("renders a podium for the top three and a list for the rest", () => {
    const champions = [
      { name: "sara", score: 100 },
      { name: "omar", score: 90 },
      { name: "khaled", score: 80 },
      { name: "fatima", score: 70 }
    ];
    const { element, close } = showChampionsOverlay(champions);

    expect(document.getElementById("championsOverlay")).toBe(element);
    expect(element.querySelectorAll(".podium__place").length).toBe(3);
    expect(element.querySelector(".podium__place--first .podium__name")?.textContent).toBe("sara");
    expect(element.querySelectorAll(".champ-row").length).toBe(1);

    close();
    expect(document.getElementById("championsOverlay")).toBeNull();
  });

  it("uses a custom hall title when provided", () => {
    const { element, close } = showChampionsOverlay([{ name: "sara", score: 10 }], { title: "Hall of Kings" });
    expect(element.querySelector(".champions-title")?.textContent).toContain("Hall of Kings");
    close();
  });

  it("shows an empty state and closes on Escape", () => {
    const { element } = showChampionsOverlay([]);
    expect(element.querySelector(".champions-empty")).toBeTruthy();
    document.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape" }));
    expect(document.getElementById("championsOverlay")).toBeNull();
  });
});
