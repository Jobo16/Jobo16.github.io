// @ts-check

import { chooseEntry, scoreFile } from "../utils.js";
import { fetchJson, isHtmlFile } from "./repo-service.js";

/** @typedef {import("../types.js").MemberNode} MemberNode */
/** @typedef {import("../types.js").ProjectNode} ProjectNode */
/** @typedef {import("../types.js").RouteMode} RouteMode */

/**
 * @typedef {object} ManifestProject
 * @property {string=} id
 * @property {string=} member
 * @property {string=} name
 * @property {string=} displayName
 * @property {string=} entry
 * @property {unknown[]=} pages
 * @property {unknown[]=} hiddenPages
 * @property {string=} routeMode
 * @property {number=} order
 * @property {unknown[]=} tags
 * @property {string=} updatedAt
 */

/**
 * @typedef {object} ManifestMember
 * @property {string=} name
 * @property {string=} displayName
 * @property {ManifestProject[]=} projects
 */

/**
 * @typedef {object} ManifestData
 * @property {unknown[]=} htmlPaths
 * @property {unknown=} members
 */

/**
 * @typedef {{ htmlPaths: string[]; memberTree: MemberNode[] }} ManifestPortalData
 */

/**
 * @param {unknown} value
 * @returns {RouteMode}
 */
function toRouteMode(value) {
  return value === "hash" ? "hash" : "path";
}

/**
 * @param {unknown[]} values
 * @returns {string[]}
 */
function toHtmlPathList(values) {
  return values
    .filter((path) => typeof path === "string")
    .filter(isHtmlFile)
    .filter((path) => path.split("/").length >= 3);
}

/**
 * @param {unknown} members
 * @returns {string[]}
 */
export function collectHtmlPathsFromMembers(members) {
  if (!Array.isArray(members)) {
    return [];
  }

  /** @type {string[]} */
  const paths = [];
  for (const member of /** @type {ManifestMember[]} */ (members)) {
    if (!member || !Array.isArray(member.projects)) {
      continue;
    }

    for (const project of member.projects) {
      if (!project) {
        continue;
      }

      if (typeof project.entry === "string") {
        paths.push(project.entry);
      }

      if (Array.isArray(project.pages)) {
        for (const page of project.pages) {
          if (typeof page === "string") {
            paths.push(page);
          }
        }
      }
    }
  }

  return paths;
}

/**
 * @param {unknown} members
 * @returns {MemberNode[]}
 */
export function buildMemberTreeFromManifestMembers(members) {
  if (!Array.isArray(members)) {
    return [];
  }

  /** @type {MemberNode[]} */
  const memberNodes = [];

  for (const member of /** @type {ManifestMember[]} */ (members)) {
    if (
      !member ||
      typeof member.name !== "string" ||
      !Array.isArray(member.projects)
    ) {
      continue;
    }

    /** @type {ProjectNode[]} */
    const projects = [];
    for (const project of member.projects) {
      if (!project || typeof project.name !== "string") {
        continue;
      }

      const files = Array.isArray(project.pages)
        ? toHtmlPathList(project.pages)
        : [];
      const sortedFiles = [...new Set(files)].sort(
        (a, b) => scoreFile(a) - scoreFile(b) || a.localeCompare(b, "zh-CN"),
      );
      if (sortedFiles.length === 0) {
        continue;
      }

      const entry =
        typeof project.entry === "string" && sortedFiles.includes(project.entry)
          ? project.entry
          : chooseEntry(sortedFiles);

      if (!entry) {
        continue;
      }

      const hiddenFiles = Array.isArray(project.hiddenPages)
        ? project.hiddenPages
            .filter((path) => typeof path === "string")
            .filter((path) => sortedFiles.includes(path))
            .filter((path) => path !== entry)
        : [];

      /** @type {string[]} */
      const tags = [];
      if (Array.isArray(project.tags)) {
        for (const tag of project.tags) {
          if (typeof tag === "string" && tag.trim()) {
            tags.push(tag);
          }
        }
      }

      projects.push({
        id: typeof project.id === "string" ? project.id : undefined,
        member:
          typeof project.member === "string" ? project.member : member.name,
        name: project.name,
        displayName:
          typeof project.displayName === "string"
            ? project.displayName
            : undefined,
        entry,
        files: sortedFiles,
        hiddenFiles: [...new Set(hiddenFiles)],
        routeMode: toRouteMode(project.routeMode),
        order: Number.isInteger(project.order) ? project.order : undefined,
        tags: [...new Set(tags)],
        updatedAt:
          typeof project.updatedAt === "string" ? project.updatedAt : undefined,
      });
    }

    projects.sort((a, b) => {
      const hasOrderA = Number.isInteger(a.order);
      const hasOrderB = Number.isInteger(b.order);
      if (hasOrderA && hasOrderB) {
        return (
          /** @type {number} */ (a.order) - /** @type {number} */ (b.order)
        );
      }
      if (hasOrderA) {
        return -1;
      }
      if (hasOrderB) {
        return 1;
      }
      return a.name.localeCompare(b.name, "zh-CN");
    });

    memberNodes.push({
      name: member.name,
      displayName:
        typeof member.displayName === "string" ? member.displayName : undefined,
      projects,
    });
  }

  return memberNodes;
}

/**
 * @returns {Promise<ManifestPortalData>}
 */
export async function getManifestPortalData() {
  /** @type {ManifestData} */
  const data = await fetchJson("projects.manifest.json");

  const htmlPathsRaw = Array.isArray(data.htmlPaths)
    ? data.htmlPaths
    : collectHtmlPathsFromMembers(data.members);
  const htmlPaths = [...new Set(toHtmlPathList(htmlPathsRaw))];
  const memberTree = buildMemberTreeFromManifestMembers(data.members);
  return { htmlPaths, memberTree };
}

/**
 * @returns {Promise<string[]>}
 */
export async function getHtmlPathsFromManifest() {
  const data = await getManifestPortalData();
  return data.htmlPaths;
}
