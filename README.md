# JOBO 个人主页

部署在 [jobo.ink](https://jobo.ink) 的单页个人网站。页面是一个 `index.html`，包含内联 CSS 和少量 JavaScript；无需安装依赖或运行构建工具。

页面样式基于 [GeraldYa/portfolio-template](https://github.com/GeraldYa/portfolio-template) 修改，原项目使用 MIT 许可证。原许可证见 [LICENSE](./LICENSE)。个人介绍、项目和联系方式沿用 JOBO 已公开的内容。

## 本地预览

直接打开 `index.html`，或在仓库目录运行：

```sh
python3 -m http.server 8000
```

然后访问 `http://localhost:8000/`。修改个人信息、产品或链接时直接编辑 `index.html`。

## 搜索收录

首页提供静态可读的项目介绍、标题和描述、规范网址、Open Graph 信息，以及与页面内容一致的 `WebSite`、`Person`、`ItemList` 结构化数据。`robots.txt` 指向只收录首页的 `sitemap.xml`。

更新项目名称或链接时，同步修改页面上的项目卡片和 `<head>` 中的 JSON-LD。站点地图地址是 `https://jobo.ink/sitemap.xml`。

## 发布

推送到 `main` 后，GitHub Actions 把静态文件同步到首尔服务器 `/srv/sites/jobo-ink`。Caddy 为 `jobo.ink` 和 `www.jobo.ink` 提供 HTTPS。工作流使用仓库密钥 `JOBO_INK_DEPLOY_KEY` 和专用的 `jobo-ink-deploy` SSH 用户。

工作流只上传网页文件，不把仓库文档或 CI 配置发布到站点目录。`workflow_dispatch` 可手动重发当前 `main`。
