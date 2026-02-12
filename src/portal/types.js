// @ts-check

export {};

/**
 * @typedef {"path" | "hash"} RouteMode
 */

/**
 * @typedef {{
 *   id?: string;
 *   member?: string;
 *   name: string;
 *   displayName?: string;
 *   entry: string;
 *   files: string[];
 *   hiddenFiles?: string[];
 *   routeMode?: RouteMode;
 *   order?: number;
 *   tags?: string[];
 *   updatedAt?: string;
 * }} ProjectNode
 */

/**
 * @typedef {{
 *   name: string;
 *   displayName?: string;
 *   projects: ProjectNode[];
 * }} MemberNode
 */

/**
 * @typedef {{ path: string; routeSuffix: string }} HashSelection
 */

/**
 * @typedef {object} PortalConfig
 * @property {string=} owner
 * @property {string=} repo
 * @property {string=} branch
 * @property {string=} rootPath
 */

/**
 * @typedef {object} PortalState
 * @property {Map<string, HTMLElement>} itemsByPath
 * @property {string} activePath
 * @property {string} activeTitle
 * @property {string} activeRouteSuffix
 * @property {Map<string, RouteMode>} routeModeByPath
 * @property {string} routeRetryKey
 * @property {string} pendingFramePath
 * @property {number} pendingFrameSetAt
 * @property {MemberNode[]} memberTreeRaw
 * @property {string} rootPath
 * @property {string} searchKeyword
 * @property {boolean} sidebarCollapsed
 */
