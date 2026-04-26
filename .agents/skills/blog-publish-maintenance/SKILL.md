# Blog Publish Maintenance

Use this skill when organizing files, checking publish readiness, editing frontmatter, or preparing a deployment.

## Goal

Keep the Quartz content repository clean, buildable, and easy to maintain over time.

## File Rules

- Main public pages are `content/index.md`, `content/about.md`, and `content/contact.md`.
- Project pages live under one of the project type folders:
  - `content/projects/ai-products/`
  - `content/projects/automation-data/`
  - `content/projects/content-video/`
  - `content/projects/devtools-infra/`
- `content/projects/index.md` is the project overview page.
- Note/share pages live under `content/notes/`; `content/notes/index.md` is the notes overview page.
- Do not create extra nested folders under `notes/`.
- Do not create new project type folders unless the user explicitly asks.
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
- `date` is the creation date used for descending lists.
- `description` should be concise and suitable for previews.
- Avoid duplicate or near-duplicate tags.

## Pre-Publish Checks

Before committing or deploying content changes:

1. Run `npm run build:optimized`.
2. Check for broken internal links in the build output.
3. Confirm `.agents/` is not rendered as public pages.
4. Confirm large images in `public/` were resized or compressed by `scripts/optimize-images.mjs`.
5. Run a privacy review for newly published pages.

## Image Rules

- Page-level sizing should be controlled in Markdown with Obsidian image width syntax, for example `![[weixin.png|220]]`.
- Deployment output is optimized by `scripts/optimize-images.mjs` after Quartz builds `public/`.
- QR-like images are capped smaller than normal images by filename patterns such as `weixin`, `wechat`, `qr`, or `qrcode`.
- Do not publish multi-megabyte source images without either resizing the display width or confirming the build output has been optimized.

## Large Reorganizations

Before moving or renaming many files, list the planned changes first and preserve existing URLs when practical.

## Project Category Rules

- Use `ai-products` for AI product work, learning platforms, user-facing AI workflows, RAG, chat, knowledge bases, and SaaS-style product systems.
- Use `automation-data` for data collection, browser automation, Feishu/Base integrations, SCRM/backend workflows, OCR, scraping, and structured exports.
- Use `content-video` for Remotion, short video generation, content production, media templates, and batch rendering workflows.
- Use `devtools-infra` for deployment tools, CLI tools, project skills, Agent tooling, infrastructure helpers, and engineering workflow utilities.
- When moving an already published project, add an `aliases` entry for the previous path to preserve old URLs.
