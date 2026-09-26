import { create } from "./dom.js";
import { t } from "../i18n/index.js";

const MEDALS = ["🥇", "🥈", "🥉"];
const PLACES = ["first", "second", "third"];

/**
 * Full-page Hall-of-Fame celebration for the all-time winners.
 * Top three get a high-contrast animated podium.
 *
 * @param {Array<{name: string, score: number}>} champions
 * @param {{onClose?: () => void, title?: string}} [options]
 */
export function showChampionsOverlay(champions, options = {}) {
  document.getElementById("championsOverlay")?.remove();

  const overlay = create("div", "champions-overlay");
  overlay.id = "championsOverlay";
  overlay.setAttribute("role", "dialog");
  overlay.setAttribute("aria-modal", "true");
  overlay.setAttribute("aria-label", t("champions.title"));

  const page = create("div", "champions-page");
  const closeBtn = /** @type {HTMLButtonElement} */ (
    create("button", "champions-close", `✕ ${t("champions.close")}`)
  );
  closeBtn.type = "button";
  page.appendChild(closeBtn);

  page.appendChild(create("h2", "champions-title", `🏆 ${options.title || t("champions.title")}`));
  page.appendChild(create("p", "champions-subtitle", t("champions.subtitle")));

  if (champions.length === 0) {
    page.appendChild(create("p", "champions-empty", t("champions.empty")));
  } else {
    const podium = create("div", "podium");
    // Visually: 2nd (left), 1st (center, tallest), 3rd (right).
    for (const index of [1, 0, 2]) {
      const champion = champions[index];
      if (!champion) continue;
      const place = create("div", `podium__place podium__place--${PLACES[index]}`);
      if (index === 0) place.classList.add("podium__place--winner");
      place.appendChild(create("div", "podium__medal", MEDALS[index]));
      place.appendChild(create("div", "podium__name", `@${champion.name}`));
      place.appendChild(create("div", "podium__score", String(champion.score)));
      const bar = create("div", "podium__bar");
      bar.appendChild(create("span", "podium__rank", String(index + 1)));
      place.appendChild(bar);
      podium.appendChild(place);
    }
    page.appendChild(podium);

    const rest = champions.slice(3);
    if (rest.length > 0) {
      const list = create("div", "champ-list");
      rest.forEach((champion, i) => {
        const row = create("div", "champ-row");
        row.appendChild(create("span", "champ-rank", String(i + 4)));
        row.appendChild(create("span", "champ-name", `@${champion.name}`));
        row.appendChild(create("span", "champ-score", String(champion.score)));
        list.appendChild(row);
      });
      page.appendChild(list);
    }
  }

  const confetti = create("div", "confetti");
  confetti.setAttribute("aria-hidden", "true");
  for (let i = 0; i < 28; i += 1) {
    const bit = create("span", "confetti__bit");
    bit.style.left = `${(i * 3.7) % 100}%`;
    bit.style.animationDelay = `${(i % 9) * 0.22}s`;
    bit.style.setProperty("--hue", String((i * 41) % 360));
    confetti.appendChild(bit);
  }
  overlay.appendChild(confetti);
  overlay.appendChild(page);
  document.body.appendChild(overlay);

  function onKey(event) {
    if (event.key === "Escape") close();
  }
  function close() {
    document.removeEventListener("keydown", onKey);
    overlay.remove();
    if (options.onClose) options.onClose();
  }

  closeBtn.addEventListener("click", close);
  overlay.addEventListener("click", (event) => {
    if (event.target === overlay) close();
  });
  document.addEventListener("keydown", onKey);

  return { element: overlay, close };
}
