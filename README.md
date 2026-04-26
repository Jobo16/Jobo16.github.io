# Jobo16.github.io

这是 Jobo 的个人网站，基于 [Quartz](https://github.com/jackyzha0/quartz) 构建。

这个项目的内容维护方式是：本地用 Markdown / Obsidian 维护内容，Quartz 负责生成静态网站，GitHub Actions 负责自动构建并部署到 GitHub Pages 和 `jobo.asia`。

## 网站结构

- `content/index.md`：首页
- `content/about.md`：关于我，包含当前项目和联系方式入口
- `content/contact.md`：联系方式
- `content/notes/index.md`：笔记总览
- `content/notes/*.md`：公开笔记，一篇一页
- `content/projects/index.md`：项目总览
- `content/projects/ai-products/*.md`：AI 产品项目
- `content/projects/automation-data/*.md`：自动化与数据项目
- `content/projects/content-video/*.md`：内容与视频项目
- `content/projects/devtools-infra/*.md`：开发工具与基础设施项目
- `content/assets/`：推荐的图片和附件目录
- `.agents/skills/`：AI 维护内容时必须遵守的项目级规则

## 当前项目分类

项目页按类型放在 `content/projects/` 下：

- AI 产品：AI 会话、学习平台、用户资产、RAG、知识库、SaaS 工作台
- 自动化与数据：数据采集、浏览器自动化、飞书集成、OCR、结构化导出
- 内容与视频：Remotion、短视频生成、内容生产工具、批量渲染
- 开发工具与基础设施：部署工具、CLI、Agent 工作流、skills、工程效率工具

不要在 `projects/` 下随意新增类型文件夹。确实需要新增分类时，先调整项目规范和总览页。

## 内容规则

每个公开 Markdown 页面都需要 frontmatter：

```yaml
---
title: "标题"
description: "80 字以内的摘要"
date: YYYY-MM-DD
tags:
  - tag
draft: false
---
```

正文不要再写和 `title` 重复的 `# 一级标题`。Quartz 会自动渲染页面标题，正文应直接从介绍段落、图片、callout 或 `##` 小节开始。

项目页建议包含：

- 项目定位
- 仓库地址，只写公开或可访问的网址
- 主要能力
- 技术与部署
- 当前状态
- 项目价值或个人关注点

不要在公开内容里写本地路径、SSH remote、健康检查地址、内网端口、账号密钥、Cookie、token、客户信息或未确认的商业信息。

## 图片规则

Markdown 中控制显示宽度使用 Obsidian 图片语法：

```markdown
![[weixin.png|220]]
```

构建时会执行 `scripts/optimize-images.mjs`，对 `public/` 里的图片做压缩和尺寸优化。QR code、微信二维码、截图等图片会按规则压缩到更适合网页展示的大小。

常用建议：

- 二维码和联系图片：180-260px
- 普通插图：按页面需要设置显示宽度
- 大图和照片优先使用 WebP / JPEG
- 二维码、logo、UI 截图优先使用 PNG

## 本地开发

安装依赖：

```bash
npm install
```

本地预览：

```bash
npx quartz build --serve
```

默认访问：

```text
http://localhost:8080/
```

构建并优化图片：

```bash
npm run build:optimized
```

完整检查：

```bash
npm run check
```

## 从 Obsidian 同步内容

可以把 Obsidian 中的公开发布文件夹同步到 `content/`：

```bash
scripts/sync-obsidian.sh /path/to/obsidian/public-folder
```

也可以设置环境变量：

```bash
export OBSIDIAN_PUBLIC_DIR=/path/to/obsidian/public-folder
scripts/sync-obsidian.sh
```

同步脚本会排除 `.obsidian/`、`.trash/` 和 `.DS_Store`，并使用 `rsync --delete` 让目标目录与来源保持一致。执行前确认来源文件夹只包含可公开内容。

## AI 维护规则

项目级 skills 放在 `.agents/skills/`：

- `blog-content-writing`：公开内容写作和润色规则
- `blog-publish-maintenance`：发布前检查、目录结构和图片规则
- `blog-obsidian-sync`：Obsidian 同步规则
- `blog-privacy-review`：隐私和敏感信息检查
- `blog-about-update`：关于页维护规则

让 AI 修改内容时，应优先遵守这些项目级 skills。尤其是：

- 不发布私密内容
- 不写本地绝对路径
- 不写 SSH remote
- 不写健康检查、内网端口等运维入口
- 不重复正文 H1
- 项目页按既定分类放置

## 部署

推送到 `main` 后，GitHub Actions 会自动执行：

```bash
npm ci
npm run build:optimized
```

构建产物 `public/` 会发布到：

- GitHub Pages
- `jobo.asia` 服务器

服务器部署使用 `.github/workflows/deploy.yml` 中的 `deploy-server` job，通过 GitHub Secrets 中的 SSH 配置同步到服务器静态站点目录。

## 发布前检查

发布前建议至少运行：

```bash
npm run build:optimized
npm run check
```

并确认：

- 没有重复正文 H1
- 项目页没有本地路径和 SSH remote
- 图片已经设置合适显示宽度
- 新增内容没有隐私、账号、密钥、客户信息
- `draft: false` 的页面确实可以公开
