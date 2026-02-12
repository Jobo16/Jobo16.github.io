#!/usr/bin/env python3
from __future__ import annotations

import json
import posixpath
import re
from datetime import datetime, timezone
from pathlib import Path
from typing import Any

ROOT = Path(__file__).resolve().parents[1]
MANIFEST = ROOT / "projects.manifest.json"

HTML_EXTENSIONS = {".html", ".htm"}
CSS_EXTENSIONS = {".css"}
JS_EXTENSIONS = {".js", ".mjs", ".cjs"}
ROUTE_MODES = {"path", "hash"}
MIN_DEPTH = 3
PROJECT_META_FILENAME = "project.meta.json"
EXCLUDED_TOP_LEVEL_DIRS = {
    ".git",
    ".github",
    ".vite",
    "dist",
    "docs",
    "node_modules",
    "playwright-report",
    "scripts",
    "src",
    "test-results",
    "tests",
    "tools",
}
ASSET_ATTR_RE = re.compile(
    r'(?P<prefix>\b(?:src|href)\s*=\s*)(?P<quote>["\'])(?P<url>/[^"\']+)(?P=quote)',
    re.IGNORECASE,
)
SRCSET_ATTR_RE = re.compile(
    r'(?P<prefix>\bsrcset\s*=\s*)(?P<quote>["\'])(?P<value>[^"\']+)(?P=quote)',
    re.IGNORECASE,
)
CSS_URL_RE = re.compile(
    r"url\(\s*(?P<quote>[\"']?)(?P<url>/[^)\"']+)(?P=quote)\s*\)",
    re.IGNORECASE,
)
CSS_IMPORT_RE = re.compile(
    r'(?P<prefix>@import\s+)(?P<quote>["\'])(?P<url>/[^"\']+)(?P=quote)',
    re.IGNORECASE,
)
ROUTER_HISTORY_CONFIG_RE = re.compile(
    r"history\s*:\s*(?P<fn>[A-Za-z_$][\w$]*)\(\s*(?:(?P<quote>['\"])\/(?P=quote)|import\.meta\.env\.BASE_URL)?\s*\)\s*,\s*routes\s*:",
)


def collect_html_paths() -> list[str]:
    paths: list[str] = []
    for file_path in ROOT.rglob("*"):
        if not file_path.is_file():
            continue
        if file_path.suffix.lower() not in HTML_EXTENSIONS:
            continue

        relative = file_path.relative_to(ROOT).as_posix()
        parts = relative.split("/")
        if parts[0] in EXCLUDED_TOP_LEVEL_DIRS:
            continue
        if len(parts) < MIN_DEPTH:
            continue

        paths.append(relative)

    return sorted(set(paths))


def score_file(path: str) -> tuple[int, str]:
    parts = path.split("/")
    filename = parts[-1].lower()
    depth = len(parts)

    if filename == "index.html" and depth == MIN_DEPTH:
        return (0, path)
    if filename == "index.html":
        return (1 + depth, path)
    return (10 + depth, path)


def choose_entry(paths: list[str]) -> str:
    ranked = sorted(paths, key=score_file)
    return ranked[0] if ranked else ""


def normalize_project_relative_path(value: str) -> str | None:
    normalized = value.replace("\\", "/").strip()
    if not normalized:
        return None
    if normalized.startswith("/") or normalized.startswith("//"):
        return None

    parts = [part for part in normalized.split("/") if part not in ("", ".")]
    if not parts:
        return None
    if any(part == ".." for part in parts):
        return None

    return "/".join(parts)


def to_project_full_path(member_name: str, project_name: str, value: str) -> str | None:
    normalized = normalize_project_relative_path(value)
    if not normalized:
        return None

    project_prefix = f"{member_name}/{project_name}/"
    if normalized.startswith(project_prefix):
        return normalized

    if normalized.count("/") >= 2:
        return None

    return f"{project_prefix}{normalized}"


def parse_meta_string_list(raw: Any) -> list[str]:
    if not isinstance(raw, list):
        return []

    values: list[str] = []
    for item in raw:
        if isinstance(item, str) and item.strip():
            values.append(item.strip())
    return values


def read_project_meta(project_root: Path) -> dict[str, Any]:
    meta_path = project_root / PROJECT_META_FILENAME
    if not meta_path.exists():
        return {}

    try:
        raw = json.loads(meta_path.read_text(encoding="utf-8"))
    except (json.JSONDecodeError, UnicodeDecodeError) as error:
        print(f"[warn] Ignored invalid {meta_path.relative_to(ROOT)}: {error}")
        return {}

    if not isinstance(raw, dict):
        print(f"[warn] Ignored invalid {meta_path.relative_to(ROOT)}: must be object")
        return {}

    return raw


def parse_project_meta(
    member_name: str,
    project_name: str,
    pages: list[str],
    meta: dict[str, Any],
) -> dict[str, Any]:
    parsed: dict[str, Any] = {}
    page_set = set(pages)
    project_label = f"{member_name}/{project_name}"

    display_name = meta.get("displayName")
    if isinstance(display_name, str) and display_name.strip():
        parsed["displayName"] = display_name.strip()

    route_mode = meta.get("routeMode")
    if isinstance(route_mode, str) and route_mode in ROUTE_MODES:
        parsed["routeMode"] = route_mode
    elif route_mode is not None:
        print(
            f"[warn] Ignored {project_label} routeMode={route_mode!r}: "
            "must be 'path' or 'hash'"
        )

    order = meta.get("order")
    if isinstance(order, int):
        parsed["order"] = order
    elif order is not None:
        print(f"[warn] Ignored {project_label} order={order!r}: must be integer")

    tags = parse_meta_string_list(meta.get("tags"))
    if tags:
        parsed["tags"] = sorted(set(tags))

    updated_at = meta.get("updatedAt")
    if isinstance(updated_at, str) and updated_at.strip():
        normalized_updated_at = updated_at.strip()
        try:
            datetime.fromisoformat(normalized_updated_at.replace("Z", "+00:00"))
            parsed["updatedAt"] = normalized_updated_at
        except ValueError:
            print(
                f"[warn] Ignored {project_label} updatedAt={updated_at!r}: "
                "must be ISO date-time"
            )

    hidden_pages_meta = parse_meta_string_list(meta.get("hiddenPages"))
    hidden_pages: list[str] = []
    for hidden_value in hidden_pages_meta:
        full_path = to_project_full_path(member_name, project_name, hidden_value)
        if not full_path:
            print(
                f"[warn] Ignored {project_label} hiddenPages item {hidden_value!r}: "
                "must be a project-relative html path"
            )
            continue
        if full_path not in page_set:
            print(
                f"[warn] Ignored {project_label} hidden page not found: {hidden_value!r}"
            )
            continue
        hidden_pages.append(full_path)
    hidden_pages = sorted(set(hidden_pages), key=score_file)
    if hidden_pages:
        parsed["hiddenPages"] = hidden_pages

    entry_meta = meta.get("entry")
    if isinstance(entry_meta, str):
        full_path = to_project_full_path(member_name, project_name, entry_meta)
        if full_path and full_path in page_set:
            parsed["entry"] = full_path
        else:
            print(
                f"[warn] Ignored {project_label} entry={entry_meta!r}: "
                "file not found in pages"
            )

    return parsed


def project_sort_key(project: dict[str, Any]) -> tuple[int, int, str]:
    order = project.get("order")
    if isinstance(order, int):
        return (0, order, str(project.get("name", "")))
    return (1, 0, str(project.get("name", "")))


def build_members_catalog(html_paths: list[str]) -> list[dict[str, object]]:
    members: dict[str, dict[str, list[str]]] = {}

    for full_path in html_paths:
        parts = full_path.split("/")
        if len(parts) < MIN_DEPTH:
            continue

        member_name = parts[0]
        project_name = parts[1]
        member_projects = members.setdefault(member_name, {})
        project_pages = member_projects.setdefault(project_name, [])
        project_pages.append(full_path)

    catalog: list[dict[str, object]] = []
    for member_name in sorted(members):
        projects: list[dict[str, object]] = []
        for project_name in sorted(members[member_name]):
            pages = sorted(members[member_name][project_name], key=score_file)
            project_root = ROOT / member_name / project_name
            parsed_meta = parse_project_meta(
                member_name=member_name,
                project_name=project_name,
                pages=pages,
                meta=read_project_meta(project_root),
            )
            entry = parsed_meta.get("entry")
            if not isinstance(entry, str) or entry not in pages:
                entry = choose_entry(pages)

            project: dict[str, object] = {
                "id": f"{member_name}/{project_name}",
                "member": member_name,
                "name": project_name,
                "entry": entry,
                "pages": pages,
                "pageCount": len(pages),
                "routeMode": parsed_meta.get("routeMode", "path"),
            }
            for optional_key in (
                "displayName",
                "order",
                "hiddenPages",
                "tags",
                "updatedAt",
            ):
                if optional_key in parsed_meta:
                    project[optional_key] = parsed_meta[optional_key]

            projects.append(
                project
            )

        projects.sort(key=project_sort_key)
        catalog.append(
            {
                "name": member_name,
                "projectCount": len(projects),
                "projects": projects,
            }
        )

    return catalog


def build_stats(catalog: list[dict[str, object]], html_paths: list[str]) -> dict[str, int]:
    project_count = sum(
        len(member.get("projects", []))
        for member in catalog
        if isinstance(member.get("projects"), list)
    )
    return {
        "memberCount": len(catalog),
        "projectCount": project_count,
        "pageCount": len(html_paths),
    }


def flatten_projects(catalog: list[dict[str, object]]) -> list[dict[str, object]]:
    projects: list[dict[str, object]] = []
    for member in catalog:
        member_projects = member.get("projects")
        if not isinstance(member_projects, list):
            continue
        for project in member_projects:
            if isinstance(project, dict):
                projects.append(project)
    return projects


def split_path_and_suffix(url: str) -> tuple[str, str]:
    query_idx = url.find("?")
    hash_idx = url.find("#")
    indices = [i for i in (query_idx, hash_idx) if i != -1]
    if not indices:
        return url, ""

    cut = min(indices)
    return url[:cut], url[cut:]


def as_posix_relative(from_dir: Path, target: Path) -> str:
    relative = posixpath.relpath(target.as_posix(), start=from_dir.as_posix())
    if relative.startswith("."):
        return relative
    return f"./{relative}"


def resolve_project_asset_url(
    file_path: Path,
    project_root: Path,
    url: str,
) -> str | None:
    if not url.startswith("/") or url.startswith("//"):
        return None

    path_part, suffix = split_path_and_suffix(url)
    relative_candidate = path_part.lstrip("/")
    if not relative_candidate:
        return None

    project_root_resolved = project_root.resolve()
    target = (project_root / relative_candidate).resolve()
    if not target.exists():
        return None

    if not target.is_relative_to(project_root_resolved):
        return None

    return f"{as_posix_relative(file_path.parent, target)}{suffix}"


def project_root_for_html(html_relative_path: str) -> Path | None:
    parts = html_relative_path.split("/")
    if len(parts) < MIN_DEPTH:
        return None
    return ROOT / parts[0] / parts[1]


def rewrite_asset_links(html_relative_path: str) -> bool:
    html_path = ROOT / html_relative_path
    project_root = project_root_for_html(html_relative_path)
    if project_root is None:
        return False

    try:
        content = html_path.read_text(encoding="utf-8")
    except UnicodeDecodeError:
        return False

    changed = False

    def replacer(match: re.Match[str]) -> str:
        nonlocal changed
        prefix = match.group("prefix")
        quote = match.group("quote")
        url = match.group("url")
        rewritten = resolve_project_asset_url(
            file_path=html_path,
            project_root=project_root,
            url=url,
        )
        if not rewritten:
            return match.group(0)

        changed = True
        return f"{prefix}{quote}{rewritten}{quote}"

    def srcset_replacer(match: re.Match[str]) -> str:
        nonlocal changed
        prefix = match.group("prefix")
        quote = match.group("quote")
        value = match.group("value")

        candidates = [entry.strip() for entry in value.split(",") if entry.strip()]
        if not candidates:
            return match.group(0)

        rewritten_candidates: list[str] = []
        local_changed = False
        for candidate in candidates:
            parts = candidate.split()
            if not parts:
                rewritten_candidates.append(candidate)
                continue

            rewritten_url = resolve_project_asset_url(
                file_path=html_path,
                project_root=project_root,
                url=parts[0],
            )
            if rewritten_url:
                local_changed = True
                rewritten_candidates.append(
                    " ".join([rewritten_url, *parts[1:]]).strip()
                )
            else:
                rewritten_candidates.append(candidate)

        if not local_changed:
            return match.group(0)

        changed = True
        return f"{prefix}{quote}{', '.join(rewritten_candidates)}{quote}"

    updated = ASSET_ATTR_RE.sub(replacer, content)
    updated = SRCSET_ATTR_RE.sub(srcset_replacer, updated)
    if not changed:
        return False

    html_path.write_text(updated, encoding="utf-8", newline="\n")
    return True


def normalize_html_assets(html_paths: list[str]) -> int:
    updated_count = 0
    for relative_path in html_paths:
        if rewrite_asset_links(relative_path):
            updated_count += 1
    return updated_count


def project_roots_from_html_paths(html_paths: list[str]) -> list[Path]:
    roots: set[Path] = set()
    for relative_path in html_paths:
        parts = relative_path.split("/")
        if len(parts) < MIN_DEPTH:
            continue
        roots.add(ROOT / parts[0] / parts[1])
    return sorted(roots)


def rewrite_css_asset_links(file_path: Path, project_root: Path) -> bool:
    try:
        content = file_path.read_text(encoding="utf-8")
    except UnicodeDecodeError:
        return False

    changed = False

    def css_url_replacer(match: re.Match[str]) -> str:
        nonlocal changed
        quote = match.group("quote")
        url = match.group("url")

        rewritten = resolve_project_asset_url(
            file_path=file_path,
            project_root=project_root,
            url=url,
        )
        if not rewritten:
            return match.group(0)

        changed = True
        if quote:
            return f"url({quote}{rewritten}{quote})"
        return f"url({rewritten})"

    def css_import_replacer(match: re.Match[str]) -> str:
        nonlocal changed
        prefix = match.group("prefix")
        quote = match.group("quote")
        url = match.group("url")

        rewritten = resolve_project_asset_url(
            file_path=file_path,
            project_root=project_root,
            url=url,
        )
        if not rewritten:
            return match.group(0)

        changed = True
        return f"{prefix}{quote}{rewritten}{quote}"

    updated = CSS_URL_RE.sub(css_url_replacer, content)
    updated = CSS_IMPORT_RE.sub(css_import_replacer, updated)
    if not changed:
        return False

    file_path.write_text(updated, encoding="utf-8", newline="\n")
    return True


def normalize_css_assets(html_paths: list[str]) -> int:
    updated_count = 0
    for project_root in project_roots_from_html_paths(html_paths):
        for file_path in project_root.rglob("*"):
            if not file_path.is_file():
                continue
            if file_path.suffix.lower() not in CSS_EXTENSIONS:
                continue
            if rewrite_css_asset_links(file_path, project_root):
                updated_count += 1
    return updated_count


def rewrite_router_history_base(file_path: Path) -> bool:
    try:
        content = file_path.read_text(encoding="utf-8")
    except UnicodeDecodeError:
        return False

    if "history" not in content:
        return False

    updated = ROUTER_HISTORY_CONFIG_RE.sub(
        lambda m: f'history:{m.group("fn")}(location.pathname),routes:',
        content,
    )
    if updated == content:
        return False

    file_path.write_text(updated, encoding="utf-8", newline="\n")
    return True


def normalize_router_bases(html_paths: list[str]) -> int:
    updated_count = 0
    for project_root in project_roots_from_html_paths(html_paths):
        for file_path in project_root.rglob("*"):
            if not file_path.is_file():
                continue
            if file_path.suffix.lower() not in JS_EXTENSIONS:
                continue
            if rewrite_router_history_base(file_path):
                updated_count += 1
    return updated_count


def write_manifest(html_paths: list[str]) -> bool:
    catalog = build_members_catalog(html_paths)
    projects = flatten_projects(catalog)
    payload_without_timestamp = {
        "version": 3,
        "htmlPaths": html_paths,
        "members": catalog,
        "projects": projects,
        "stats": build_stats(catalog, html_paths),
    }

    if MANIFEST.exists():
        try:
            existing = json.loads(MANIFEST.read_text(encoding="utf-8"))
            existing_without_timestamp = {
                "version": existing.get("version"),
                "htmlPaths": existing.get("htmlPaths"),
                "members": existing.get("members"),
                "projects": existing.get("projects"),
                "stats": existing.get("stats"),
            }
            if existing_without_timestamp == payload_without_timestamp:
                return False
        except json.JSONDecodeError:
            pass

    payload = {
        "generatedAt": datetime.now(timezone.utc).isoformat(),
        **payload_without_timestamp,
    }
    MANIFEST.write_text(
        json.dumps(payload, ensure_ascii=False, indent=2) + "\n",
        encoding="utf-8",
    )
    return True


def main() -> None:
    html_paths = collect_html_paths()
    normalized_html_assets = normalize_html_assets(html_paths)
    normalized_css_assets = normalize_css_assets(html_paths)
    normalized_router_bases = normalize_router_bases(html_paths)
    if normalized_html_assets:
        print(
            f"Normalized root-absolute asset links in {normalized_html_assets} HTML files."
        )
    if normalized_css_assets:
        print(
            f"Normalized root-absolute asset links in {normalized_css_assets} CSS files."
        )
    if normalized_router_bases:
        print(
            "Normalized router history config in "
            f"{normalized_router_bases} JavaScript files."
        )
    manifest_updated = write_manifest(html_paths)
    if manifest_updated:
        print("Updated projects.manifest.json.")


if __name__ == "__main__":
    main()
