# 常见问题排查

## 1. 页面白屏

检查顺序：

1. 确认项目目录下存在入口 HTML。
2. 执行 `npm run manifest:validate`，查看是否有结构或路径错误。
3. 检查资源路径是否使用根绝对路径（如 `/assets/...`）。
4. 重新执行 `python scripts/generate_manifest.py`，确认已自动改写可修复路径。

## 2. 目录中看不到新项目

1. 确认目录层级满足 `成员名/项目名/*.html`。
2. 确认改动已 push 到 `main`。
3. 检查 `projects.manifest.json` 是否包含新路径。
4. 检查工作流 `Auto Generate Project Config` 是否执行成功。

## 3. iframe 无法加载

1. 检查页面是否设置了 `X-Frame-Options: DENY/SAMEORIGIN`（外部域资源常见）。
2. 检查页面是否依赖跨域受限资源。
3. 尝试点击“新窗口打开”确认页面本身可访问。

## 4. 资源 404

1. 打开浏览器网络面板，确认失败 URL。
2. 若 URL 以 `/` 开头，优先改为相对路径。
3. 确认目标资源文件真实存在于项目目录内。
4. 运行 `npm run manifest:validate` 检查是否有绝对路径告警/错误。

## 5. 路由分享后打不开

1. 确认分享链接为目录页 hash 链接（`#/...`）。
2. 刷新后若丢失页面，检查是否触发 hash 解析错误。
3. 运行测试：`npm run test`，关注 `routing` 相关测试结果。

## 6. CI 校验失败

1. 本地先执行：`npm run quality`。
2. 若提示 generated files out-of-date，执行：
   - `python scripts/generate_manifest.py`
   - 提交更新后的文件。
