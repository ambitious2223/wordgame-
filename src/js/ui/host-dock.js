import { maybeEl } from "./dom.js";
import { loadDock, saveDock } from "../core/store.js";

/**
 * Floating, draggable, collapsible host controls. Low opacity until hovered.
 * Position + collapsed state persist via the store.
 *
 * @param {{storage?: Storage | null}} [options]
 */
export function initHostDock(options = {}) {
  const dock = maybeEl("hostDock");
  const toggle = maybeEl("hostToggle");
  const handle = maybeEl("hostHandle");
  const panel = maybeEl("hostPanel");
  if (!dock || !toggle || !panel) {
    return { setCollapsed() {}, isCollapsed: () => false };
  }

  const storage = options.storage ?? null;
  let collapsed = false;

  const persist = () => {
    const rect = dock.getBoundingClientRect();
    saveDock(storage, { x: rect.left, y: rect.top, collapsed });
  };

  /**
   * @param {boolean} value
   */
  function setCollapsed(value) {
    collapsed = Boolean(value);
    dock.classList.toggle("is-collapsed", collapsed);
    toggle.setAttribute("aria-expanded", String(!collapsed));
    persist();
  }

  /**
   * @param {number} x
   * @param {number} y
   */
  function applyPosition(x, y) {
    const rect = dock.getBoundingClientRect();
    const maxX = Math.max(4, window.innerWidth - rect.width - 4);
    const maxY = Math.max(4, window.innerHeight - rect.height - 4);
    dock.style.left = `${Math.min(Math.max(4, x), maxX)}px`;
    dock.style.top = `${Math.min(Math.max(4, y), maxY)}px`;
    dock.style.right = "auto";
    dock.style.bottom = "auto";
  }

  const saved = loadDock(storage);
  if (saved) {
    applyPosition(saved.x, saved.y);
    setCollapsed(saved.collapsed);
  }

  let dragging = false;
  let moved = false;
  let startX = 0;
  let startY = 0;
  let originX = 0;
  let originY = 0;
  let suppressClick = false;
  let downFromToggle = false;

  /**
   * @param {PointerEvent} event
   * @param {boolean} fromToggle
   */
  function onDown(event, fromToggle) {
    if (event.button !== 0) return;
    const rect = dock.getBoundingClientRect();
    dragging = true;
    moved = false;
    suppressClick = false; // clear any stale flag before this gesture
    downFromToggle = fromToggle;
    startX = event.clientX;
    startY = event.clientY;
    originX = rect.left;
    originY = rect.top;
    dock.classList.add("is-dragging");
    dock.setPointerCapture?.(event.pointerId);
    // NOTE: deliberately no preventDefault() — it suppresses the follow-up click
    // in real browsers, which was breaking the collapse toggle.
  }

  /** @param {PointerEvent} event */
  function onMove(event) {
    if (!dragging) return;
    const dx = event.clientX - startX;
    const dy = event.clientY - startY;
    if (Math.abs(dx) > 3 || Math.abs(dy) > 3) moved = true;
    applyPosition(originX + dx, originY + dy);
  }

  /** @param {PointerEvent} event */
  function onUp(event) {
    if (!dragging) return;
    dragging = false;
    dock.classList.remove("is-dragging");
    dock.releasePointerCapture?.(event.pointerId);
    if (moved) {
      suppressClick = true;
      persist();
      return;
    }
    // A clean tap on the toggle collapses/expands. Do it here so it works even
    // if the browser does not emit a click after pointer capture.
    if (downFromToggle) {
      setCollapsed(!collapsed);
      suppressClick = true;
    }
  }

  toggle.addEventListener("pointerdown", (event) => onDown(event, true));
  handle?.addEventListener("pointerdown", (event) => onDown(event, false));
  dock.addEventListener("pointermove", onMove);
  dock.addEventListener("pointerup", onUp);
  dock.addEventListener("pointercancel", onUp);

  // Keyboard activation (Enter/Space) still reaches the button as a click.
  toggle.addEventListener("click", (event) => {
    if (suppressClick) {
      suppressClick = false;
      event.preventDefault();
      return;
    }
    setCollapsed(!collapsed);
  });

  return { setCollapsed, isCollapsed: () => collapsed };
}
