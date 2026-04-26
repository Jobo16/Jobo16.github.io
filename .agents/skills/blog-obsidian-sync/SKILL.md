# Blog Obsidian Sync

Use this skill when syncing a local Obsidian public folder into this Quartz project.

## Goal

Copy the user's public Obsidian Markdown folder into `content/` so Quartz can build the website.

## Preferred Command

```bash
scripts/sync-obsidian.sh /path/to/obsidian/public-blog
```

Or:

```bash
export OBSIDIAN_PUBLIC_DIR=/path/to/obsidian/public-blog
scripts/sync-obsidian.sh
```

## Rules

- Sync only the explicitly public Obsidian folder.
- Never sync the whole vault unless the user explicitly confirms it is fully public.
- Exclude `.obsidian/`, `.trash/`, and `.DS_Store`.
- After syncing, run `npx quartz build`.
- Review changed files before committing.
- If syncing would delete many files from `content/`, stop and summarize the deletion list before proceeding unless the user already requested a destructive refresh.
