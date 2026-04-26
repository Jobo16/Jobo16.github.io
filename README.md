# Jobo16.github.io

这是一个基于 [Quartz](https://github.com/jackyzha0/quartz) 的个人博客与知识主页。

## 内容结构

- `content/index.md`: 首页
- `content/now.md`: 正在做什么
- `content/projects.md`: 项目入口
- `content/notes.md`: 笔记、文章、分享、链接统一入口
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
npx quartz build
```

构建产物 `public/` 会发布到 GitHub Pages。
