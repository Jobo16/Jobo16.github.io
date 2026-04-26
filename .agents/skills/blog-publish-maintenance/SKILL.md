# Blog Publish Maintenance

Use this skill when organizing files, checking publish readiness, editing frontmatter, or preparing a deployment.

## Goal

Keep the Quartz content repository clean, buildable, and easy to maintain over time.

## File Rules

- New pages must live under the correct `content/` folder.
- Images and attachments should live under `content/assets/`.
- Do not scatter assets next to random articles unless there is already a clear local convention.
- Do not delete published pages unless the user explicitly requests deletion.
- Do not rename published files casually; file paths affect URLs.
- When changing a title, do not automatically change the file name.

## Frontmatter Rules

Required fields:

```yaml
title:
description:
date:
tags:
draft:
```

- `draft: true` means not ready for publication.
- `draft: false` means publishable.
- `description` should be concise and suitable for previews.
- Avoid duplicate or near-duplicate tags.

## Pre-Publish Checks

Before committing or deploying content changes:

1. Run `npx quartz build`.
2. Check for broken internal links in the build output.
3. Confirm `content/_ai-skills/` and `.agents/` are not rendered as public pages.
4. Run a privacy review for newly published pages.

## Large Reorganizations

Before moving or renaming many files, list the planned changes first and preserve existing URLs when practical.

