# Jobo16.github.io

这是一个基于 [Quartz](https://github.com/jackyzha0/quartz) 的个人博客与知识主页。

## 内容结构

- `content/index.md`: 首页
- `content/projects/index.md`: 项目总览
- `content/projects/ai-products/*.md`: AI 产品项目
- `content/projects/automation-data/*.md`: 自动化与数据项目
- `content/projects/content-video/*.md`: 内容与视频项目
- `content/projects/devtools-infra/*.md`: 开发工具与基础设施项目
- `content/notes/index.md`: 笔记总览
- `content/notes/*.md`: 分享文档，一篇一页
- `content/about.md`: 关于
- `content/contact.md`: 联系方式
- `.agents/skills/`: AI 维护内容时需要遵守的项目级规则

## 本地预览

```bash
npm install
npx quartz build --serve
```

访问 `http://localhost:8080/`。

## 从 Obsidian 同步内容

```bash
scripts/sync-obsidian.sh /path/to/obsidian/public-blog
```

也可以设置环境变量：

```bash
export OBSIDIAN_PUBLIC_DIR=/path/to/obsidian/public-blog
scripts/sync-obsidian.sh
```

## 部署

推送到 `main` 后，GitHub Actions 会执行：

```bash
npm ci
npm run build:optimized
```

构建产物 `public/` 会发布到 GitHub Pages 和 `jobo.asia` 服务器。
