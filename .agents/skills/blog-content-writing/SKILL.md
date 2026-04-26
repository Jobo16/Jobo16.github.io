# Blog Content Writing

Use this skill when creating, rewriting, expanding, or polishing public Markdown content for this Quartz blog.

## Goal

Turn ideas, rough notes, voice transcripts, drafts, and fragmented notes into publishable Markdown for the public blog.

## Content Boundary

- Public content lives in `content/`.
- Do not read from or copy content out of private vault folders unless the user explicitly provides that content in the task.
- Do not publish private journal entries, customer information, account credentials, internal plans, or unconfirmed commercial information.
- If the source is ambiguous, keep the new page as `draft: true`.

## Required Frontmatter

Every public Markdown page must include:

```yaml
---
title: "Title"
description: "Short summary within 80 Chinese characters."
date: YYYY-MM-DD
tags:
  - tag
draft: false
---
```

## Writing Rules

- Write primarily in Chinese unless the user requests another language.
- Keep titles clear and direct; avoid exaggerated marketing headlines.
- Start the body with one H1 matching the page title, unless the local page already uses another established style.
- Use H2 and H3 for structure; avoid deeper nesting unless necessary.
- Prefer concrete examples and concise sections over generic commentary.
- Do not invent personal details, project claims, dates, metrics, or relationships.

## Placement

- Site-level pages remain at `content/index.md`, `content/now.md`, `content/about.md`, `content/contact.md`, `content/projects.md`, and `content/notes.md`.
- Keep project summaries in `content/projects.md` by default.
- Keep articles, shares, links, reading notes, and lightweight thoughts in `content/notes.md` by default.
- Only create a subpage when a topic has enough long-lived content to justify its own page.
- Images and attachments should live under `content/assets/`.
