#!/usr/bin/env python3
from __future__ import annotations

import json
from datetime import datetime, timezone
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
MANIFEST = ROOT / "projects.manifest.json"

HTML_EXTENSIONS = {".html", ".htm"}
MIN_DEPTH = 3


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
    write_manifest(collect_html_paths())


if __name__ == "__main__":
    main()
