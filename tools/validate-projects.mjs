import fs from "node:fs";
import path from "node:path";
import process from "node:process";
import { fileURLToPath } from "node:url";
import Ajv2020 from "ajv/dist/2020.js";
import addFormats from "ajv-formats";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.resolve(__dirname, "..");
const MANIFEST_PATH = path.join(ROOT, "projects.manifest.json");
const SCHEMA_PATH = path.join(ROOT, "projects.schema.json");
const HTML_ASSET_ATTR_RE =
  /\b(?:src|href)\s*=\s*(["'])(\/[^"']+)\1/gi;
const HTML_SRCSET_RE = /\bsrcset\s*=\s*(["'])([^"']+)\1/gi;
const CSS_URL_RE = /url\(\s*(["']?)(\/[^)"']+)\1\s*\)/gi;
const CSS_IMPORT_RE = /@import\s+(["'])(\/[^"']+)\1/gi;

function readJson(filePath) {
  const raw = fs.readFileSync(filePath, "utf8");
  return JSON.parse(raw);
}

function isHtmlPath(value) {
  return /\.html?$/i.test(value);
}

function projectLabel(memberName, projectName) {
  return `${memberName}/${projectName}`;
}

function addError(errors, message) {
  errors.push(message);
}

function addWarning(warnings, message) {
  warnings.push(message);
}

function splitPathAndSuffix(url) {
  const queryIdx = url.indexOf("?");
  const hashIdx = url.indexOf("#");
  const indices = [queryIdx, hashIdx].filter((value) => value >= 0);
  if (indices.length === 0) {
    return { pathPart: url, suffix: "" };
  }
  const cut = Math.min(...indices);
  return { pathPart: url.slice(0, cut), suffix: url.slice(cut) };
}

function validateManifestSchema(manifest, schema, errors) {
  const ajv = new Ajv2020({ allErrors: true, strict: false });
  addFormats(ajv);
  const validate = ajv.compile(schema);
  const valid = validate(manifest);
  if (valid) return;

  for (const issue of validate.errors ?? []) {
    const instancePath = issue.instancePath || "/";
    addError(errors, `[schema] ${instancePath} ${issue.message ?? "invalid"}`);
  }
}

function validateManifestSemantics(manifest, errors) {
  const stats = manifest && typeof manifest.stats === "object" ? manifest.stats : {};
  const htmlPathList = Array.isArray(manifest.htmlPaths) ? manifest.htmlPaths : [];
  const members = Array.isArray(manifest.members) ? manifest.members : [];
  const topLevelProjects = Array.isArray(manifest.projects) ? manifest.projects : [];
  const htmlPaths = new Set(htmlPathList);
  const pagePathsFromMembers = new Set();
  const projectIdsFromMembers = new Set();
  const projectsFromMembersById = new Map();
  let computedProjectCount = 0;

  for (const member of members) {
    if (member.projectCount !== member.projects.length) {
      addError(
        errors,
        `[semantic] member "${member.name}" projectCount=${member.projectCount} does not match projects.length=${member.projects.length}`
      );
    }

    for (const project of member.projects) {
      computedProjectCount += 1;
      const label = projectLabel(member.name, project.name);
      const projectId = project.id || label;
      projectIdsFromMembers.add(projectId);
      projectsFromMembersById.set(projectId, project);

      if (project.member !== member.name) {
        addError(
          errors,
          `[semantic] project "${label}" member="${project.member}" does not match parent member="${member.name}"`
        );
      }

      if (!project.pages.includes(project.entry)) {
        addError(errors, `[semantic] project "${label}" entry is not included in pages`);
      }

      if (project.pageCount !== project.pages.length) {
        addError(
          errors,
          `[semantic] project "${label}" pageCount=${project.pageCount} does not match pages.length=${project.pages.length}`
        );
      }

      for (const pagePath of project.pages) {
        pagePathsFromMembers.add(pagePath);
      }

      if (Array.isArray(project.hiddenPages)) {
        const hiddenSet = new Set(project.hiddenPages);
        if (hiddenSet.has(project.entry)) {
          addError(errors, `[semantic] project "${label}" hiddenPages must not include entry`);
        }
        for (const hiddenPath of hiddenSet) {
          if (!project.pages.includes(hiddenPath)) {
            addError(
              errors,
              `[semantic] project "${label}" hidden page not found in pages: ${hiddenPath}`
            );
          }
        }
      }
    }
  }

  if (stats.memberCount !== members.length) {
    addError(
      errors,
      `[semantic] stats.memberCount=${stats.memberCount} does not match members.length=${members.length}`
    );
  }

  if (stats.projectCount !== computedProjectCount) {
    addError(
      errors,
      `[semantic] stats.projectCount=${stats.projectCount} does not match computed=${computedProjectCount}`
    );
  }

  if (stats.pageCount !== htmlPathList.length) {
    addError(
      errors,
      `[semantic] stats.pageCount=${stats.pageCount} does not match htmlPaths.length=${htmlPathList.length}`
    );
  }

  if (topLevelProjects.length !== computedProjectCount) {
    addError(
      errors,
      `[semantic] projects.length=${topLevelProjects.length} does not match computed member projects=${computedProjectCount}`
    );
  }

  const seenTopLevelProjectIds = new Set();
  for (const topProject of topLevelProjects) {
    const topId = topProject.id || `${topProject.member}/${topProject.name}`;
    if (seenTopLevelProjectIds.has(topId)) {
      addError(errors, `[semantic] duplicate project id in projects: ${topId}`);
      continue;
    }
    seenTopLevelProjectIds.add(topId);

    if (!projectIdsFromMembers.has(topId)) {
      addError(
        errors,
        `[semantic] projects contains project not found in members/projects: ${topId}`
      );
      continue;
    }

    const fromMember = projectsFromMembersById.get(topId);
    if (!fromMember) {
      continue;
    }

    const topRaw = JSON.stringify(topProject);
    const memberRaw = JSON.stringify(fromMember);
    if (topRaw !== memberRaw) {
      addError(
        errors,
        `[semantic] projects entry differs from members/projects for id: ${topId}`
      );
    }
  }

  for (const memberProjectId of projectIdsFromMembers) {
    if (!seenTopLevelProjectIds.has(memberProjectId)) {
      addError(
        errors,
        `[semantic] members/projects contains project missing in projects: ${memberProjectId}`
      );
    }
  }

  for (const htmlPath of htmlPathList) {
    if (!isHtmlPath(htmlPath)) {
      addError(errors, `[semantic] htmlPaths contains non-html path: ${htmlPath}`);
      continue;
    }

    const depth = htmlPath.split("/").length;
    if (depth < 3) {
      addError(errors, `[semantic] html path depth < 3: ${htmlPath}`);
    }

    const fullPath = path.join(ROOT, ...htmlPath.split("/"));
    if (!fs.existsSync(fullPath)) {
      addError(errors, `[semantic] html path does not exist: ${htmlPath}`);
    }
  }

  for (const pagePath of pagePathsFromMembers) {
    if (!htmlPaths.has(pagePath)) {
      addError(
        errors,
        `[semantic] members/projects/pages contains path not present in htmlPaths: ${pagePath}`
      );
    }
  }

  for (const htmlPath of htmlPaths) {
    if (!pagePathsFromMembers.has(htmlPath)) {
      addError(
        errors,
        `[semantic] htmlPaths contains path not present in members/projects/pages: ${htmlPath}`
      );
    }
  }
}

function projectRootsFromHtmlPaths(manifest) {
  const roots = new Set();
  for (const htmlPath of manifest.htmlPaths) {
    const parts = htmlPath.split("/");
    if (parts.length < 3) {
      continue;
    }
    roots.add(path.join(ROOT, parts[0], parts[1]));
  }
  return [...roots];
}

function collectAbsoluteUrlsFromHtml(htmlContent) {
  const urls = [];

  for (const match of htmlContent.matchAll(HTML_ASSET_ATTR_RE)) {
    const url = match[2];
    if (url.startsWith("//")) {
      continue;
    }
    urls.push(url);
  }

  for (const match of htmlContent.matchAll(HTML_SRCSET_RE)) {
    const srcsetValue = match[2];
    const candidates = srcsetValue
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);
    for (const candidate of candidates) {
      const firstToken = candidate.split(/\s+/)[0];
      if (!firstToken.startsWith("/") || firstToken.startsWith("//")) {
        continue;
      }
      urls.push(firstToken);
    }
  }

  return urls;
}

function collectAbsoluteUrlsFromCss(cssContent) {
  const urls = [];

  for (const match of cssContent.matchAll(CSS_URL_RE)) {
    const url = match[2];
    if (url.startsWith("//")) {
      continue;
    }
    urls.push(url);
  }

  for (const match of cssContent.matchAll(CSS_IMPORT_RE)) {
    const url = match[2];
    if (url.startsWith("//")) {
      continue;
    }
    urls.push(url);
  }

  return urls;
}

function validateAbsoluteAssetPaths(manifest, errors, warnings) {
  const projectRoots = projectRootsFromHtmlPaths(manifest);

  for (const projectRoot of projectRoots) {
    if (!fs.existsSync(projectRoot)) {
      continue;
    }

    const stack = [projectRoot];
    while (stack.length > 0) {
      const current = stack.pop();
      const entries = fs.readdirSync(current, { withFileTypes: true });
      for (const entry of entries) {
        const fullPath = path.join(current, entry.name);
        if (entry.isDirectory()) {
          stack.push(fullPath);
          continue;
        }
        if (!entry.isFile()) {
          continue;
        }

        const ext = path.extname(entry.name).toLowerCase();
        if (ext !== ".html" && ext !== ".htm" && ext !== ".css") {
          continue;
        }

        const content = fs.readFileSync(fullPath, "utf8");
        const absoluteUrls =
          ext === ".css"
            ? collectAbsoluteUrlsFromCss(content)
            : collectAbsoluteUrlsFromHtml(content);

        for (const url of absoluteUrls) {
          const { pathPart } = splitPathAndSuffix(url);
          const relative = pathPart.replace(/^\/+/, "");
          if (!relative) {
            continue;
          }

          const localTarget = path.join(projectRoot, ...relative.split("/"));
          const relativeFile = path.relative(ROOT, fullPath).replaceAll("\\", "/");
          if (fs.existsSync(localTarget)) {
            addError(
              errors,
              `[asset] root-absolute local asset should be relative: ${relativeFile} -> ${url}`
            );
            continue;
          }

          addWarning(
            warnings,
            `[asset] unresolved root-absolute reference (verify if intentional): ${relativeFile} -> ${url}`
          );
        }
      }
    }
  }
}

function main() {
  if (!fs.existsSync(MANIFEST_PATH)) {
    console.error(`[validate-projects] Missing file: ${MANIFEST_PATH}`);
    process.exit(1);
  }

  if (!fs.existsSync(SCHEMA_PATH)) {
    console.error(`[validate-projects] Missing file: ${SCHEMA_PATH}`);
    process.exit(1);
  }

  let manifest;
  let schema;
  try {
    manifest = readJson(MANIFEST_PATH);
  } catch (error) {
    console.error(`[validate-projects] Failed to parse manifest JSON: ${error.message}`);
    process.exit(1);
  }

  try {
    schema = readJson(SCHEMA_PATH);
  } catch (error) {
    console.error(`[validate-projects] Failed to parse schema JSON: ${error.message}`);
    process.exit(1);
  }

  const errors = [];
  const warnings = [];
  validateManifestSchema(manifest, schema, errors);
  validateManifestSemantics(manifest, errors);
  validateAbsoluteAssetPaths(manifest, errors, warnings);

  if (warnings.length > 0) {
    console.warn("[validate-projects] Warnings:");
    for (const warning of warnings) {
      console.warn(`- ${warning}`);
    }
  }

  if (errors.length > 0) {
    console.error("[validate-projects] Validation failed:");
    for (const error of errors) {
      console.error(`- ${error}`);
    }
    process.exit(1);
  }

  console.log("[validate-projects] Validation passed.");
}

main();
