// @ts-check

import { CONFIG } from "./config.js";
import {
  buildMemberProjectTree,
  fromSafePath,
  normalizeRouteSuffix,
} from "./utils.js";
import { state } from "./state/store.js";
import {
  collapseAllBtn,
  emptyEl,
  expandAllBtn,
  frameEl,
  layoutEl,
  memberSearchEl,
  toggleSidebarBtn,
  treeEl,
  viewerLinkEl,
  viewerStatusEl,
  viewerTitleEl,
} from "./dom/elements.js";
import {
  getBranch,
  getHtmlPathsFromGitHub,
  inferRepoFromLocation,
  inferRootPath,
} from "./services/repo-service.js";
import { getManifestPortalData } from "./services/manifest-service.js";
import {
  buildFrameSource,
  buildPreviewUrl,
  buildViewerHash,
  parseHashSelection,
  toRelativePathFromPathname,
} from "./features/routing.js";
import { createCatalogFeature } from "./features/catalog.js";
import { createPreviewFeature } from "./features/preview.js";
import { bindPortalEvents, initializePortal } from "./features/bootstrap.js";

/**
 * @param {string} path
 * @param {string} [routeSuffix]
 * @returns {void}
 */
function updateViewerLink(path, routeSuffix = "") {
  const routeMode = state.routeModeByPath.get(path) || "path";
  viewerLinkEl.href = buildFrameSource(
    path,
    state.rootPath,
    routeSuffix,
    routeMode,
  );
}

/**
 * @returns {import("./types.js").HashSelection | null}
 */
function getCurrentHashSelection() {
  return parseHashSelection(window.location.hash, state.itemsByPath.keys());
}

/**
 * @param {string} path
 * @returns {string}
 */
function buildTitleFromPath(path) {
  for (const member of state.memberTreeRaw) {
    const memberLabel = member.displayName || member.name;
    for (const project of member.projects) {
      const projectLabel = project.displayName || project.name;
      if (project.entry === path) {
        return `${memberLabel} / ${projectLabel}`;
      }
      if (project.files.includes(path)) {
        const fileLabel = path.split("/").slice(2).join("/");
        return `${memberLabel} / ${projectLabel} / ${fileLabel}`;
      }
    }
  }

  return path.split("/").join(" / ");
}

const previewFeature = createPreviewFeature({
  state,
  frameEl,
  emptyEl,
  viewerTitleEl,
  viewerStatusEl,
  viewerLinkEl,
  updateViewerLink,
  buildFrameSource,
  buildPreviewUrl,
  buildViewerHash,
  toRelativePathFromPathname,
  normalizeRouteSuffix,
  fromSafePath,
});

const {
  activatePath,
  reportFrameLoadError,
  setEmptyMessage,
  syncHashFromFrameLocation,
} = previewFeature;

const catalogFeature = createCatalogFeature({
  state,
  treeEl,
  layoutEl,
  toggleSidebarBtn,
  activatePath,
});

const { renderByCurrentState, setAllTreeNodes, setSidebarCollapsed } =
  catalogFeature;

/**
 * @param {string} rootPath
 * @returns {boolean}
 */
function tryOpenFromHash(rootPath) {
  const selection = getCurrentHashSelection();
  if (!selection || !state.itemsByPath.has(selection.path)) {
    return false;
  }

  const title = buildTitleFromPath(selection.path);
  activatePath(selection.path, title, rootPath, selection.routeSuffix);
  return true;
}

bindPortalEvents({
  state,
  memberSearchEl,
  renderByCurrentState,
  setAllTreeNodes,
  frameEl,
  getCurrentHashSelection,
  buildTitleFromPath,
  reportFrameLoadError,
  syncHashFromFrameLocation,
  activatePath,
  normalizeRouteSuffix,
  expandAllBtn,
  collapseAllBtn,
  toggleSidebarBtn,
  setSidebarCollapsed,
});

initializePortal({
  config: CONFIG,
  state,
  setEmptyMessage,
  renderByCurrentState,
  tryOpenFromHash,
  buildMemberProjectTree,
  inferRepoFromLocation,
  inferRootPath,
  getBranch,
  getHtmlPathsFromGitHub,
  getManifestPortalData,
});
