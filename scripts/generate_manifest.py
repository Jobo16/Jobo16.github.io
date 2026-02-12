#!/usr/bin/env python3
from __future__ import annotations

import json
import re
from datetime import datetime, timezone
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
MANIFEST = ROOT / "projects.manifest.json"

HTML_EXTENSIONS = {".html", ".htm"}
MIN_DEPTH = 3
ASSET_ATTR_RE = re.compile(
    r'(?P<prefix>\b(?:src|href)\s*=\s*)(?P<quote>["\'])(?P<url>/[^"\']+)(?P=quote)',
    re.IGNORECASE,
)


def collect_html_paths() -> list[str]:
    paths: list[str] = []
    for file_path in ROOT.rglob("*"):
        if not file_path.is_file():
            continue
        if file_path.suffix.lower() not in HTML_EXTENSIONS:
            continue

        relative = file_path.relative_to(ROOT).as_posix()
        if len(relative.split("/")) < MIN_DEPTH:
            continue

        paths.append(relative)

    return sorted(set(paths))


def split_path_and_suffix(url: str) -> tuple[str, str]:
    query_idx = url.find("?")
    hash_idx = url.find("#")
    indices = [i for i in (query_idx, hash_idx) if i != -1]
    if not indices:
        return url, ""

    cut = min(indices)
    return url[:cut], url[cut:]


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

        if url.startswith("//"):
            return match.group(0)

        path_part, suffix = split_path_and_suffix(url)
        relative_candidate = path_part.lstrip("/")
        if not relative_candidate:
            return match.group(0)

        target = project_root / relative_candidate
        if not target.exists():
            return match.group(0)

        changed = True
        return f'{prefix}{quote}./{relative_candidate}{suffix}{quote}'

    updated = ASSET_ATTR_RE.sub(replacer, content)
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


def write_manifest(html_paths: list[str]) -> None:
    payload = {
        "generatedAt": datetime.now(timezone.utc).isoformat(),
        "htmlPaths": html_paths,
    }
    MANIFEST.write_text(
        json.dumps(payload, ensure_ascii=False, indent=2) + "\n",
        encoding="utf-8",
    )


def main() -> None:
    html_paths = collect_html_paths()
    normalized = normalize_html_assets(html_paths)
    if normalized:
        print(f"Normalized root-absolute asset links in {normalized} HTML files.")
    write_manifest(html_paths)


if __name__ == "__main__":
    main()
