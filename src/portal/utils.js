// @ts-check

/** @typedef {import("./types.js").MemberNode} MemberNode */
/** @typedef {import("./types.js").ProjectNode} ProjectNode */

/**
 * @param {string} path
 * @returns {string}
 */
export function normalizeRootPath(path) {
  if (!path) return "";
  let value = path.trim();
  if (!value.startsWith("/")) value = `/${value}`;
  if (!value.endsWith("/")) value = `${value}/`;
  return value;
}

/**
 * @param {string} path
 * @returns {number}
 */
export function scoreFile(path) {
  const lower = path.toLowerCase();
  const parts = lower.split("/");
  const filename = parts[parts.length - 1];
  const depth = parts.length;

  if (filename === "index.html" && depth === 3) return 0;
  if (filename === "index.html") return 1 + depth;
  return 10 + depth;
}

/**
 * @param {string[]} files
 * @returns {string}
 */
export function chooseEntry(files) {
  const ranked = [...files].sort(
    (a, b) => scoreFile(a) - scoreFile(b) || a.localeCompare(b, "zh-CN"),
  );
  return ranked[0] || "";
}

/**
 * @param {string[]} htmlPaths
 * @returns {MemberNode[]}
 */
export function buildMemberProjectTree(htmlPaths) {
  /** @type {Map<string, Map<string, string[]>>} */
  const members = new Map();

  for (const fullPath of htmlPaths) {
    const parts = fullPath.split("/");
    if (parts.length < 3) continue;

    const member = parts[0];
    const project = parts[1];

    if (!members.has(member)) {
      members.set(member, new Map());
    }

    const projects = members.get(member);
    if (!projects) {
      continue;
    }

    if (!projects.has(project)) {
      projects.set(project, []);
    }

    const projectFiles = projects.get(project);
    if (!projectFiles) {
      continue;
    }
    projectFiles.push(fullPath);
  }

  /** @type {MemberNode[]} */
  const memberNodes = [];

  for (const [memberName, projects] of [...members.entries()].sort((a, b) =>
    a[0].localeCompare(b[0], "zh-CN"),
  )) {
    /** @type {ProjectNode[]} */
    const projectNodes = [];

    for (const [projectName, files] of [...projects.entries()].sort((a, b) =>
      a[0].localeCompare(b[0], "zh-CN"),
    )) {
      const sortedFiles = [...files].sort(
        (a, b) => scoreFile(a) - scoreFile(b) || a.localeCompare(b, "zh-CN"),
      );
      projectNodes.push({
        name: projectName,
        entry: chooseEntry(sortedFiles),
        files: sortedFiles,
      });
    }

    memberNodes.push({ name: memberName, projects: projectNodes });
  }

  return memberNodes;
}

/**
 * @param {string} path
 * @returns {string}
 */
export function toSafePath(path) {
  return path.split("/").map(encodeURIComponent).join("/");
}

/**
 * @param {string} path
 * @returns {string}
 */
export function fromSafePath(path) {
  return path
    .split("/")
    .map((part) => {
      try {
        return decodeURIComponent(part);
      } catch {
        return part;
      }
    })
    .join("/");
}

/**
 * @param {unknown} routeSuffix
 * @returns {string}
 */
export function normalizeRouteSuffix(routeSuffix) {
  return String(routeSuffix || "").replace(/^\/+|\/+$/g, "");
}
