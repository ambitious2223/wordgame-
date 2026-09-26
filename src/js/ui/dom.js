/**
 * DOM element registry and safe rendering helpers.
 */

/**
 * @param {string} id
 * @returns {HTMLElement}
 */
export function el(id) {
  const node = document.getElementById(id);
  if (!node) throw new Error(`Missing required element #${id}`);
  return node;
}

/**
 * @param {string} id
 * @returns {HTMLInputElement}
 */
export function inputEl(id) {
  const node = document.getElementById(id);
  if (!(node instanceof HTMLInputElement)) throw new Error(`Expected input #${id}`);
  return node;
}

/**
 * @param {string} id
 * @returns {HTMLElement | null}
 */
export function maybeEl(id) {
  return document.getElementById(id);
}

/**
 * @param {HTMLElement | null} node
 * @param {string | number} value
 */
export function setText(node, value) {
  if (node) node.textContent = String(value);
}

/**
 * Creates a span safely (no innerHTML with user data).
 * @param {string} tag
 * @param {string} className
 * @param {string} [text]
 * @returns {HTMLElement}
 */
export function create(tag, className, text) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text !== undefined) node.textContent = text;
  return node;
}