// @ts-check

/** @typedef {import("../types.js").PortalConfig} PortalConfig */
/** @typedef {import("../types.js").PortalState} PortalState */
/** @typedef {import("../types.js").MemberNode} MemberNode */
/** @typedef {import("../types.js").ProjectNode} ProjectNode */
/** @typedef {import("../types.js").RouteMode} RouteMode */
/** @typedef {{ owner: string; repo: string }} RepoInfo */

/**
 * @typedef {object} InitializePortalDeps
 * @property {PortalConfig} config
 * @property {PortalState} state
 * @property {(text: string) => void} setEmptyMessage
 * @property {() => void} renderByCurrentState
 * @property {(memberTree: MemberNode[]) => MemberNode[]} filterMemberTree
 * @property {(rootPath: string) => boolean} tryOpenFromHash
 * @property {(path: string, title: string, rootPath: string, routeSuffix?: string, routeModeOverride?: RouteMode) => void} activatePath
 * @property {(htmlPaths: string[]) => MemberNode[]} buildMemberProjectTree
 * @property {(config: PortalConfig) => RepoInfo | null} inferRepoFromLocation
 * @property {(config: PortalConfig, owner: string, repo: string) => string} inferRootPath
 * @property {(config: PortalConfig, owner: string, repo: string) => Promise<string>} getBranch
 * @property {(owner: string, repo: string, branch: string) => Promise<string[]>} getHtmlPathsFromGitHub
 * @property {() => Promise<{ htmlPaths: string[]; memberTree: MemberNode[] }>} getManifestPortalData
 */

/**
 * @param {InitializePortalDeps} deps
 * @returns {Promise<void>}
 */
export async function initializePortal({
  config,
  state,
  setEmptyMessage,
  renderByCurrentState,
  filterMemberTree,
  tryOpenFromHash,
  activatePath,
  buildMemberProjectTree,
  inferRepoFromLocation,
  inferRootPath,
  getBranch,
  getHtmlPathsFromGitHub,
  getManifestPortalData,
}) {
  const repoInfo = inferRepoFromLocation(config);
  if (!repoInfo) {
    setEmptyMessage(
      "当前域名无法自动识别 GitHub 仓库。\n\n可选做法：\n1. 在脚本 CONFIG 中填写 owner/repo。\n2. 或者用 github.io 域名访问此页面。",
    );
    return;
  }

  const { owner, repo } = repoInfo;
  const rootPath = inferRootPath(config, owner, repo);
  /** @type {string[]} */
  let htmlPaths = [];
  /** @type {MemberNode[]} */
  let memberTree = [];
  /** @type {Error | null} */
  let loadError = null;

  try {
    const manifestData = await getManifestPortalData();
    htmlPaths = manifestData.htmlPaths;
    memberTree = manifestData.memberTree;
  } catch (error) {
    console.error(error);
    loadError = error instanceof Error ? error : new Error(String(error));
  }

  if (htmlPaths.length === 0) {
    try {
      const branch = await getBranch(config, owner, repo);
      htmlPaths = await getHtmlPathsFromGitHub(owner, repo, branch);
    } catch (apiError) {
      console.error(apiError);
      if (!loadError) {
        loadError =
          apiError instanceof Error ? apiError : new Error(String(apiError));
      }
    }
  }

  if (htmlPaths.length === 0) {
    const details = loadError ? `\n\n错误详情：${loadError.message}` : "";
    setEmptyMessage(
      "未发现可预览项目，或读取目录失败。\n\n请确认：\n1. 仓库里已有 成员名/项目名/*.html\n2. projects.manifest.json 已存在且格式正确\n3. 仓库为公开仓库或 API 可访问" +
        details,
    );
    return;
  }

  if (memberTree.length === 0) {
    memberTree = buildMemberProjectTree(htmlPaths);
  }

  if (memberTree.length === 0) {
    setEmptyMessage(
      "已发现 HTML 文件，但未匹配到成员/项目层级。\n\n请至少使用两级目录：成员名/项目名/*.html",
    );
    return;
  }

  state.memberTreeRaw = memberTree;
  state.rootPath = rootPath;
  renderByCurrentState();

  if (!tryOpenFromHash(rootPath)) {
    const visibleTree = filterMemberTree(memberTree);
    const firstMember = visibleTree[0];
    const firstProject = firstMember && firstMember.projects[0];
    if (firstMember && firstProject) {
      activatePath(
        firstProject.entry,
        `${firstMember.displayName || firstMember.name} / ${firstProject.displayName || firstProject.name}`,
        rootPath,
        "",
        firstProject.routeMode || "path",
      );
    }
  }
}

/**
 * @typedef {object} BindPortalEventsDeps
 * @property {PortalState} state
 * @property {HTMLInputElement} memberSearchEl
 * @property {() => void} renderByCurrentState
 * @property {(open: boolean) => void} setAllTreeNodes
 * @property {HTMLIFrameElement} frameEl
 * @property {() => ({ path: string; routeSuffix: string } | null)} getCurrentHashSelection
 * @property {(path: string) => string} buildTitleFromPath
 * @property {() => void} reportFrameLoadError
 * @property {() => void} syncHashFromFrameLocation
 * @property {(path: string, title: string, rootPath: string, routeSuffix?: string, routeModeOverride?: RouteMode) => void} activatePath
 * @property {(routeSuffix: unknown) => string} normalizeRouteSuffix
 * @property {Window} [windowObj]
 * @property {HTMLButtonElement} expandAllBtn
 * @property {HTMLButtonElement} collapseAllBtn
 * @property {HTMLButtonElement} toggleSidebarBtn
 * @property {(collapsed: boolean) => void} setSidebarCollapsed
 * @property {number} [intervalMs]
 */

/**
 * @param {BindPortalEventsDeps} deps
 * @returns {() => void}
 */
export function bindPortalEvents({
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
  windowObj = window,
  expandAllBtn,
  collapseAllBtn,
  toggleSidebarBtn,
  setSidebarCollapsed,
  intervalMs = 350,
}) {
  const onSearchInput = () => {
    state.searchKeyword = memberSearchEl.value || "";
    renderByCurrentState();
    if (state.searchKeyword.trim()) {
      setAllTreeNodes(true);
    }
  };

  const onFrameLoad = () => {
    const selection = getCurrentHashSelection();
    syncHashFromFrameLocation();

    if (!selection || selection.path !== state.activePath) {
      state.routeRetryKey = "";
      return;
    }

    const requestedSuffix = normalizeRouteSuffix(selection.routeSuffix);
    if (!requestedSuffix || requestedSuffix === state.activeRouteSuffix) {
      state.routeRetryKey = "";
      return;
    }

    const retryKey = `${selection.path}|${requestedSuffix}`;
    if (state.routeRetryKey === retryKey) {
      return;
    }

    state.routeRetryKey = retryKey;
    const title = buildTitleFromPath(selection.path);
    activatePath(
      selection.path,
      title,
      state.rootPath,
      requestedSuffix,
      "hash",
    );
  };

  const onHashChange = () => {
    const selection = getCurrentHashSelection();
    if (!selection || !state.itemsByPath.has(selection.path)) {
      return;
    }

    const routeSuffix = normalizeRouteSuffix(selection.routeSuffix);
    if (
      selection.path === state.activePath &&
      routeSuffix === state.activeRouteSuffix
    ) {
      return;
    }

    const title = buildTitleFromPath(selection.path);
    activatePath(selection.path, title, state.rootPath, routeSuffix);
  };

  const onFrameError = () => {
    reportFrameLoadError();
  };

  const onExpandAll = () => setAllTreeNodes(true);
  const onCollapseAll = () => setAllTreeNodes(false);
  const onToggleSidebar = () => setSidebarCollapsed(!state.sidebarCollapsed);

  memberSearchEl.addEventListener("input", onSearchInput);
  frameEl.addEventListener("load", onFrameLoad);
  frameEl.addEventListener("error", onFrameError);
  windowObj.addEventListener("hashchange", onHashChange);
  expandAllBtn.addEventListener("click", onExpandAll);
  collapseAllBtn.addEventListener("click", onCollapseAll);
  toggleSidebarBtn.addEventListener("click", onToggleSidebar);

  const timerId = setInterval(() => {
    syncHashFromFrameLocation();
  }, intervalMs);

  return () => {
    memberSearchEl.removeEventListener("input", onSearchInput);
    frameEl.removeEventListener("load", onFrameLoad);
    frameEl.removeEventListener("error", onFrameError);
    windowObj.removeEventListener("hashchange", onHashChange);
    expandAllBtn.removeEventListener("click", onExpandAll);
    collapseAllBtn.removeEventListener("click", onCollapseAll);
    toggleSidebarBtn.removeEventListener("click", onToggleSidebar);
    clearInterval(timerId);
  };
}
