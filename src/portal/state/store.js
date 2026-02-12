// @ts-check

/** @type {import("../types.js").PortalState} */
export const state = {
  itemsByPath: new Map(),
  activePath: "",
  activeTitle: "",
  activeRouteSuffix: "",
  routeModeByPath: new Map(),
  routeRetryKey: "",
  pendingFramePath: "",
  pendingFrameSetAt: 0,
  memberTreeRaw: [],
  rootPath: "/",
  searchKeyword: "",
  sidebarCollapsed: false,
};
