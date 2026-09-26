/**
 * Non-blocking feedback: toasts, score popups, and the between-round results overlay.
 * Replaces the original alert()-based UX. No user data is injected via innerHTML.
 */
import { create } from "./dom.js";
import { t } from "../i18n/index.js";

/**
 * @param {string} message
 * @param {'info'|'success'|'error'|'warn'} [type]
 */
export function toast(message, type = "info") {
  const container = document.getElementById("toastContainer");
  if (!container) return;
  const node = create("div", `toast toast--${type}`, message);
  container.appendChild(node);
  setTimeout(() => node.classList.add("toast--hide"), 1800);
  setTimeout(() => node.remove(), 2400);
}

/**
 * @param {{base:number, multiplier:number}} result
 */
export function scorePopup(result) {
  const layer = document.getElementById("scorePopupLayer");
  if (!layer) return;
  const node = create("div", "score-popup");
  node.appendChild(create("span", "popup-score", `+${result.base}`));
  if (result.multiplier > 1) {
    node.appendChild(create("span", "popup-combo", `×${result.multiplier}`));
  }
  layer.appendChild(node);
  setTimeout(() => node.remove(), 1000);
}

/** @type {ReturnType<typeof setInterval> | null} */
let autoTimer = null;

/**
 * @param {{round:number, totalRounds:number, found:Array<{word:string}>, missed:string[], roundScore:number, isLast:boolean}} data
 * @param {() => void} onContinue
 */
export function showRoundResults(data, onContinue) {
  const modal = document.getElementById("resultsModal");
  const title = document.getElementById("resultsTitle");
  const summary = document.getElementById("resultsSummary");
  const list = document.getElementById("resultsWords");
  const continueBtn = document.getElementById("resultsContinue");
  const autoEl = document.getElementById("resultsAuto");
  if (!modal || !summary || !list || !continueBtn) return;

  if (title) title.textContent = t("results.title", { round: data.round });
  summary.textContent = t("results.summary", { found: data.found.length, score: data.roundScore });
  const MAX_MISSED = 24;
  list.replaceChildren();
  if (data.missed.length > 0) {
    for (const word of data.missed.slice(0, MAX_MISSED)) {
      list.appendChild(create("span", "missed-word", word));
    }
    if (data.missed.length > MAX_MISSED) {
      list.appendChild(
        create("span", "missed-word missed-word--all", `+${data.missed.length - MAX_MISSED}`)
      );
    }
  } else {
    list.appendChild(create("span", "missed-word missed-word--all", t("results.allWords")));
  }

  continueBtn.textContent = data.isLast ? t("showResults") : t("continue");
  modal.classList.add("show");

  let done = false;
  let seconds = 5;
  if (autoEl) autoEl.textContent = t("results.auto", { seconds });

  const finish = () => {
    if (done) return;
    done = true;
    if (autoTimer) clearInterval(autoTimer);
    autoTimer = null;
    hideRoundResults();
    onContinue();
  };

  if (autoTimer) clearInterval(autoTimer);
  autoTimer = setInterval(() => {
    seconds -= 1;
    if (autoEl) autoEl.textContent = t("results.auto", { seconds: Math.max(0, seconds) });
    if (seconds <= 0) finish();
  }, 1000);

  continueBtn.onclick = finish;
}

export function hideRoundResults() {
  document.getElementById("resultsModal")?.classList.remove("show");
  if (autoTimer) {
    clearInterval(autoTimer);
    autoTimer = null;
  }
}
