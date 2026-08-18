# JOBO实验室

基于 Quartz 的轻量静态网站，公开展示 JOBO 实验室的研究方向、代表作品和少量长期笔记。

个人经历和项目事实统一维护在私人知识库；这个仓库只保存经过筛选和隐私检查的公开表达。

## 内容

```text
content/
├── index.md
├── about.md
├── projects/
│   ├── index.md
│   └── <project>.md
├── notes/
│   ├── index.md
│   └── <note>.md
└── assets/
```

- 项目保持扁平，不按技术类型建立子目录；分类使用 tags。
- 联系方式合并在 `about.md`。
- 每篇项目页只写项目定位、个人贡献、结果和公开链接。
- 外部项目研究和方法论放在 `notes/`，不作为个人项目展示。

## 内容规则

所有公开页面必须包含：

```yaml
---
title: 标题
description: 80 字以内的摘要
date: YYYY-MM-DD
tags: [tag]
draft: false
---
```

- 正文不重复 frontmatter 标题。
- 不发布私有仓库、内部域名、服务端口、本地路径、账号、密钥、客户或同事信息。
- 项目事实有变化时，先更新私人知识库，再调整这里的公开表达。
- 内容追求短、具体、可验证，不堆砌技术名词和功能列表。

## 开发

```bash
npm install
npx quartz build --serve
```

检查与构建：

```bash
npm run check
npm run build:optimized
```

推送到 `main` 后，GitHub Actions 自动构建并部署。
