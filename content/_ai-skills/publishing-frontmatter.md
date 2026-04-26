---
title: "发布 Frontmatter 规则"
draft: true
---

# 发布 Frontmatter 规则

公开 Markdown 文件使用以下字段：

```yaml
---
title: "标题"
description: "80 字以内摘要"
date: 2026-04-26
tags:
  - tag
draft: false
---
```

## 规则

1. `draft: true` 表示不发布。
2. `draft: false` 表示可以发布。
3. `date` 是首次发布时间。
4. `description` 用于搜索、列表和分享预览。
5. 文件名和路径一旦发布不要随意修改。
6. 标签使用小写英文或清晰中文，不制造重复标签。
