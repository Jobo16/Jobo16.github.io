// @ts-check

import { normalizeRootPath } from "../utils.js";

/** @typedef {import("../types.js").PortalConfig} PortalConfig */

/**
 * @typedef {{ owner: string; repo: string }} RepoInfo
 */

/**
 * @param {PortalConfig} config
 * @param {Location} [location]
 * @returns {RepoInfo | null}
 */
export function inferRepoFromLocation(config, location = window.location) {
  const host = location.hostname;
  const pathParts = location.pathname.split("/").filter(Boolean);

  if (config.owner && config.repo) {
    return { owner: config.owner, repo: config.repo };
  }

  if (!host.endsWith(".github.io")) {
    return null;
  }

  const owner = host.split(".")[0];
  const userSiteRepo = `${owner}.github.io`;
  const repo = pathParts.length === 0 ? userSiteRepo : pathParts[0];
  return { owner, repo };
}

/**
 * @param {PortalConfig} config
 * @param {string} owner
 * @param {string} repo
 * @param {Location} [location]
 * @returns {string}
 */
export function inferRootPath(config, owner, repo, location = window.location) {
  if (config.rootPath) {
    return normalizeRootPath(config.rootPath);
  }

  const host = location.hostname;
  if (!host.endsWith(".github.io")) {
    return "/";
  }

  const userSiteRepo = `${owner}.github.io`.toLowerCase();
  if (repo.toLowerCase() === userSiteRepo) {
    return "/";
  }

  return `/${repo}/`;
}

/**
 * @template T
 * @param {string} url
 * @returns {Promise<T>}
 */
export async function fetchJson(url) {
  const response = await fetch(url, {
    headers: { Accept: "application/vnd.github+json" },
  });
  if (!response.ok) {
    throw new Error(`HTTP ${response.status}: ${url}`);
  }
  return /** @type {Promise<T>} */ (response.json());
}

/**
 * @param {PortalConfig} config
 * @param {string} owner
 * @param {string} repo
 * @returns {Promise<string>}
 */
export async function getBranch(config, owner, repo) {
  if (config.branch) {
    return config.branch;
  }

  /** @type {{ default_branch?: string }} */
  const data = await fetchJson(`https://api.github.com/repos/${owner}/${repo}`);
  return data.default_branch || "main";
}

/**
 * @param {string} value
 * @returns {boolean}
 */
export function isHtmlFile(value) {
  return /\.html?$/i.test(value);
}

/**
 * @typedef {{ type?: string; path?: string }} GitTreeNode
 */

/**
 * @param {string} owner
 * @param {string} repo
 * @param {string} branch
 * @returns {Promise<string[]>}
 */
export async function getHtmlPathsFromGitHub(owner, repo, branch) {
  /** @type {{ tree?: GitTreeNode[] }} */
  const treeData = await fetchJson(
    `https://api.github.com/repos/${owner}/${repo}/git/trees/${encodeURIComponent(
      branch,
    )}?recursive=1`,
  );

  return (treeData.tree || [])
    .filter((node) => node.type === "blob")
    .map((node) => node.path || "")
    .filter(isHtmlFile)
    .filter((value) => value.split("/").length >= 3);
}
