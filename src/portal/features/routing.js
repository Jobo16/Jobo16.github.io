// @ts-check

import {
  fromSafePath,
  normalizeRootPath,
  normalizeRouteSuffix,
  toSafePath,
} from "../utils.js";

/** @typedef {import("../types.js").HashSelection} HashSelection */
/** @typedef {import("../types.js").RouteMode} RouteMode */

/**
 * @param {string} value
 * @param {string} [routeSuffix]
 * @returns {string}
 */
export function buildViewerHash(value, routeSuffix = "") {
  const base = toSafePath(value);
  const suffix = normalizeRouteSuffix(routeSuffix);
  if (!suffix) {
    return `#/${base}`;
  }
  return `#/${base}/${toSafePath(suffix)}`;
}

/**
 * @param {string} value
 * @param {string} [routeSuffix]
 * @param {Location} [location]
 * @returns {string}
 */
export function buildViewerPageLink(
  value,
  routeSuffix = "",
  location = window.location,
) {
  return `${location.pathname}${location.search}${buildViewerHash(value, routeSuffix)}`;
}

/**
 * @param {string} value
 * @param {string} rootPath
 * @returns {string}
 */
export function buildPreviewUrl(value, rootPath) {
  const safePath = toSafePath(value);
  if (rootPath.endsWith("/")) {
    return `${rootPath}${safePath}`;
  }
  return `${rootPath}/${safePath}`;
}

/**
 * @param {string} value
 * @param {string} rootPath
 * @param {string} [routeSuffix]
 * @param {RouteMode} [routeMode]
 * @returns {string}
 */
export function buildFrameSource(
  value,
  rootPath,
  routeSuffix = "",
  routeMode = "path",
) {
  const previewUrl = buildPreviewUrl(value, rootPath);
  const suffix = normalizeRouteSuffix(routeSuffix);
  if (!suffix) {
    return previewUrl;
  }
  if (routeMode === "hash") {
    return `${previewUrl}#/${toSafePath(suffix)}`;
  }
  return `${previewUrl}/${toSafePath(suffix)}`;
}

/**
 * @param {string} hash
 * @param {Iterable<string>} candidatePaths
 * @returns {HashSelection | null}
 */
export function parseHashSelection(hash, candidatePaths) {
  if (!hash.startsWith("#/")) {
    return null;
  }

  const encoded = hash.slice(2);
  if (!encoded) {
    return null;
  }

  const decoded = fromSafePath(encoded);
  const candidates = [...candidatePaths].sort((a, b) => b.length - a.length);
  for (const path of candidates) {
    if (decoded === path) {
      return { path, routeSuffix: "" };
    }

    if (decoded.startsWith(`${path}/`)) {
      const suffix = decoded.slice(path.length + 1);
      return { path, routeSuffix: normalizeRouteSuffix(suffix) };
    }
  }

  return null;
}

/**
 * @param {string} pathname
 * @param {string} rootPath
 * @returns {string}
 */
export function toRelativePathFromPathname(pathname, rootPath) {
  const root = normalizeRootPath(rootPath);
  if (!pathname.startsWith(root)) {
    return "";
  }
  return fromSafePath(pathname.slice(root.length)).replace(/^\/+/, "");
}
