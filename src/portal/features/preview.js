// @ts-check

/** @typedef {import("../types.js").PortalState} PortalState */
/** @typedef {import("../types.js").RouteMode} RouteMode */

/**
 * @typedef {object} PreviewFeatureDeps
 * @property {PortalState} state
 * @property {HTMLIFrameElement} frameEl
 * @property {HTMLElement} emptyEl
 * @property {HTMLElement} viewerTitleEl
 * @property {HTMLElement} viewerStatusEl
 * @property {HTMLAnchorElement} viewerLinkEl
 * @property {(path: string, routeSuffix?: string) => void} updateViewerLink
 * @property {(value: string, rootPath: string, routeSuffix?: string, routeMode?: RouteMode) => string} buildFrameSource
 * @property {(value: string, rootPath: string) => string} buildPreviewUrl
 * @property {(value: string, routeSuffix?: string) => string} buildViewerHash
 * @property {(pathname: string, rootPath: string) => string} toRelativePathFromPathname
 * @property {(routeSuffix: unknown) => string} normalizeRouteSuffix
 * @property {(path: string) => string} fromSafePath
 */

/**
 * @typedef {object} RouteInfo
 * @property {string} suffix
 * @property {RouteMode} mode
 * @property {boolean} matched
 */

/**
 * @typedef {"info" | "warning" | "error"} StatusTone
 */

/**
 * @param {PreviewFeatureDeps} deps
 */
export function createPreviewFeature({
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
}) {
  /**
   * @param {string} text
   * @param {StatusTone} [tone]
   * @returns {void}
   */
  function setViewerStatus(text, tone = "info") {
    if (!text) {
      viewerStatusEl.hidden = true;
      viewerStatusEl.textContent = "";
      viewerStatusEl.dataset.status = "";
      return;
    }

    viewerStatusEl.hidden = false;
    viewerStatusEl.textContent = text;
    viewerStatusEl.dataset.status = tone;
  }

  /**
   * @param {string} path
   * @param {string} rootPath
   * @returns {RouteInfo}
   */
  function readRouteInfoFromFrame(path, rootPath) {
    /** @type {RouteMode} */
    const fallbackMode = state.routeModeByPath.get(path) || "path";
    if (!path || !frameEl.contentWindow) {
      return { suffix: "", mode: fallbackMode, matched: false };
    }

    let frameLocation;
    try {
      frameLocation = frameEl.contentWindow.location;
    } catch {
      return {
        suffix: state.activeRouteSuffix,
        mode: fallbackMode,
        matched: false,
      };
    }

    const expectedPathname = new URL(
      buildPreviewUrl(path, rootPath),
      window.location.origin,
    ).pathname;
    if (frameLocation.pathname === expectedPathname) {
      if (!frameLocation.hash.startsWith("#/")) {
        return { suffix: "", mode: fallbackMode, matched: true };
      }
      return {
        suffix: normalizeRouteSuffix(fromSafePath(frameLocation.hash.slice(2))),
        mode: "hash",
        matched: true,
      };
    }

    if (frameLocation.pathname.startsWith(`${expectedPathname}/`)) {
      const encodedSuffix = frameLocation.pathname.slice(
        expectedPathname.length + 1,
      );
      return {
        suffix: normalizeRouteSuffix(fromSafePath(encodedSuffix)),
        mode: "path",
        matched: true,
      };
    }

    return {
      suffix: state.activeRouteSuffix,
      mode: fallbackMode,
      matched: false,
    };
  }

  /**
   * @param {string} text
   * @returns {void}
   */
  function setEmptyMessage(text) {
    emptyEl.hidden = false;
    emptyEl.textContent = text;
    frameEl.removeAttribute("src");
    viewerTitleEl.textContent = "未选择项目";
    viewerLinkEl.hidden = true;
    setViewerStatus("");
  }

  /**
   * @param {string} path
   * @param {string} title
   * @param {string} rootPath
   * @param {string} [routeSuffix]
   * @param {RouteMode | ""} [routeModeOverride]
   * @returns {void}
   */
  function activatePath(
    path,
    title,
    rootPath,
    routeSuffix = "",
    routeModeOverride = "",
  ) {
    const item = state.itemsByPath.get(path);
    if (!item) return;

    if (state.activePath) {
      const previousItem = state.itemsByPath.get(state.activePath);
      if (previousItem) {
        previousItem.classList.remove("active");
      }
    }

    item.classList.add("active");
    state.activePath = path;
    state.activeTitle = title;
    state.activeRouteSuffix = normalizeRouteSuffix(routeSuffix);
    /** @type {RouteMode} */
    const routeMode =
      routeModeOverride || state.routeModeByPath.get(path) || "path";
    state.routeModeByPath.set(path, routeMode);

    const src = buildFrameSource(
      path,
      rootPath,
      state.activeRouteSuffix,
      routeMode,
    );
    const targetSrc = new URL(src, window.location.href).href;
    if (frameEl.src !== targetSrc) {
      state.pendingFramePath = path;
      state.pendingFrameSetAt = Date.now();
      frameEl.src = src;
      setViewerStatus("正在加载预览...", "info");
    }
    viewerTitleEl.textContent = title;
    updateViewerLink(path, state.activeRouteSuffix);
    viewerLinkEl.hidden = false;
    emptyEl.hidden = true;

    const targetHash = buildViewerHash(path, state.activeRouteSuffix);
    if (window.location.hash !== targetHash) {
      history.replaceState(null, "", targetHash);
    }
  }

  /**
   * @returns {void}
   */
  function syncHashFromFrameLocation() {
    if (!state.activePath) {
      setViewerStatus("");
      return;
    }

    if (
      state.pendingFramePath &&
      Date.now() - state.pendingFrameSetAt > 15000
    ) {
      state.pendingFramePath = "";
      state.pendingFrameSetAt = 0;
    }

    const hasPendingFrameNavigation =
      state.pendingFramePath && state.pendingFramePath === state.activePath;

    let frameLocation;
    if (frameEl.contentWindow) {
      try {
        frameLocation = frameEl.contentWindow.location;
      } catch {
        setViewerStatus(
          "该页面跳转到了跨域地址，目录页无法继续同步。请使用“新窗口打开”。",
          "warning",
        );
        frameLocation = null;
      }
    }

    if (frameLocation) {
      const frameRelativePath = toRelativePathFromPathname(
        frameLocation.pathname,
        state.rootPath,
      );
      if (
        frameRelativePath &&
        frameRelativePath !== state.activePath &&
        state.itemsByPath.has(frameRelativePath)
      ) {
        if (hasPendingFrameNavigation) {
          return;
        }
        const title = frameRelativePath.split("/").join(" / ");
        activatePath(frameRelativePath, title, state.rootPath);
        return;
      }
    }

    const routeInfo = readRouteInfoFromFrame(state.activePath, state.rootPath);
    if (!routeInfo.matched) {
      if (!hasPendingFrameNavigation) {
        setViewerStatus(
          "预览页路径与目录不一致，可能发生了重定向。建议使用“新窗口打开”排查。",
          "warning",
        );
      }
      return;
    }

    state.routeModeByPath.set(state.activePath, routeInfo.mode);
    state.activeRouteSuffix = routeInfo.suffix;
    if (state.pendingFramePath === state.activePath) {
      state.pendingFramePath = "";
      state.pendingFrameSetAt = 0;
    }
    updateViewerLink(state.activePath, state.activeRouteSuffix);
    const targetHash = buildViewerHash(state.activePath, routeInfo.suffix);
    if (window.location.hash !== targetHash) {
      history.replaceState(null, "", targetHash);
    }
    setViewerStatus("");
  }

  /**
   * @returns {void}
   */
  function reportFrameLoadError() {
    if (!state.activePath) {
      return;
    }

    if (state.pendingFramePath === state.activePath) {
      state.pendingFramePath = "";
      state.pendingFrameSetAt = 0;
    }

    setViewerStatus(
      "预览加载失败，可能是页面不存在或禁止 iframe 嵌入。请使用“新窗口打开”。",
      "error",
    );
  }

  return {
    activatePath,
    reportFrameLoadError,
    setEmptyMessage,
    syncHashFromFrameLocation,
  };
}
