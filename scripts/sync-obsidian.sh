#!/usr/bin/env bash
set -euo pipefail

SOURCE_DIR="${1:-${OBSIDIAN_PUBLIC_DIR:-}}"
TARGET_DIR="${2:-content}"

if [[ -z "$SOURCE_DIR" ]]; then
  echo "Usage: scripts/sync-obsidian.sh /path/to/obsidian/public-folder [target-dir]"
  echo "Or set OBSIDIAN_PUBLIC_DIR=/path/to/obsidian/public-folder"
  exit 1
fi

if [[ ! -d "$SOURCE_DIR" ]]; then
  echo "Source directory does not exist: $SOURCE_DIR"
  exit 1
fi

mkdir -p "$TARGET_DIR"

rsync -av --delete \
  --exclude ".obsidian/" \
  --exclude ".trash/" \
  --exclude ".DS_Store" \
  "$SOURCE_DIR"/ "$TARGET_DIR"/
