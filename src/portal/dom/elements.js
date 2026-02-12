// @ts-check

/**
 * @param {string} id
 * @returns {HTMLElement}
 */
function requireElementById(id) {
  const element = document.getElementById(id);
  if (!element) {
    throw new Error(`Missing required element: #${id}`);
  }
  return element;
}

/**
 * @param {string} selector
 * @returns {HTMLElement}
 */
function requireElementBySelector(selector) {
  const element = document.querySelector(selector);
  if (!(element instanceof HTMLElement)) {
    throw new Error(`Missing required element: ${selector}`);
  }
  return element;
}

export const layoutEl = requireElementBySelector(".layout");
export const treeEl = requireElementById("tree");
export const frameEl = /** @type {HTMLIFrameElement} */ (
  requireElementById("viewerFrame")
);
export const emptyEl = requireElementById("empty");
export const viewerTitleEl = requireElementById("viewerTitle");
export const viewerStatusEl = requireElementById("viewerStatus");
export const viewerLinkEl = /** @type {HTMLAnchorElement} */ (
  requireElementById("viewerLink")
);
export const memberSearchEl = /** @type {HTMLInputElement} */ (
  requireElementById("memberSearch")
);
export const expandAllBtn = /** @type {HTMLButtonElement} */ (
  requireElementById("expandAllBtn")
);
export const collapseAllBtn = /** @type {HTMLButtonElement} */ (
  requireElementById("collapseAllBtn")
);
export const toggleSidebarBtn = /** @type {HTMLButtonElement} */ (
  requireElementById("toggleSidebarBtn")
);
