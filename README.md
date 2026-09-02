# JOBO实验室

JOBO实验室的单页静态网站，使用 Vanilla Vite 构建。

`content/` 仅作为本地内容归档，不参与网站构建，也不会生成公开页面。

## 开发

```bash
npm install
npm run dev
```

本地地址：`http://localhost:8081/`

## 检查与构建

```bash
npm run check
```

生产文件输出到 `dist/`。Vite 会为 CSS、JavaScript、字体和二维码图片生成内容哈希文件名，浏览器不会在更新后继续复用旧资源。

## 缓存策略

- HTML：`Cache-Control: no-cache, max-age=0, must-revalidate`
- `assets/`：`Cache-Control: public, max-age=31536000, immutable`

推送到 `main` 后，GitHub Actions 自动部署到 GitHub Pages 和 jobo.asia 服务器。
