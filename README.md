# 团队成员静态项目展示

这是一个可直接部署到 GitHub Pages 的静态门户：

- 左侧自动展示 `成员 -> 项目 -> 页面` 目录
- 右侧 `iframe` 预览被点击的 HTML
- 支持深链接 hash 恢复（`#/成员/项目/页面.html/子路由`）
- 支持 `projects.manifest.json` + GitHub API 双数据源

## 目录约定

请按下面结构放置文件：

```text
仓库根目录/
  成员A/
    项目1/
      index.html
      style.css
      main.js
      data/
        list.json
    项目2/
      demo.html
  成员B/
    项目X/
      index.html
```

基本规则：

- 至少两级目录：`成员名/项目名/*.html`
- `index.html` 优先作为项目入口
- 没有 `index.html` 时自动选择排序后的首个 html
- 可选 `project.meta.json` 定义入口、路由模式、显示名等

`project.meta.json` 示例（`成员名/项目名/project.meta.json`）：

```json
{
  "entry": "index.html",
  "routeMode": "hash",
  "displayName": "项目展示名",
  "order": 10,
  "hiddenPages": ["draft.html"],
  "tags": ["vue", "internal"],
  "updatedAt": "2026-02-12T00:00:00Z"
}
```

字段说明：

- `entry`: 入口文件（项目内相对路径，必须存在于 `pages`）
- `routeMode`: `path` 或 `hash`（控制子路由如何拼接到 iframe URL）
- `displayName`: 门户展示名
- `order`: 同成员下项目排序（数值越小越靠前）
- `hiddenPages`: 在项目页列表隐藏，但仍可通过深链接访问
- `tags`: 项目标签
- `updatedAt`: ISO 日期时间字符串

## 快速使用

1. 在仓库根目录新增成员文件夹
2. 在成员文件夹中新增项目文件夹
3. 把静态文件放入该项目目录
4. 推送到 `main`
5. 打开 Pages 地址查看目录树与预览

正常情况下无需手动维护清单文件，`projects.manifest.json` 会由脚本/工作流自动更新。

## 本地开发

```bash
npm install
npm run dev
```

常用命令：

- `npm run lint`: ESLint
- `npm run test`: Vitest 单测
- `npm run test:e2e`: Playwright E2E
- `npm run typecheck`: TypeScript 检查
- `npm run typecheck:portal`: `src/portal` 严格 `checkJs`
- `npm run typecheck:services`: `typecheck:portal` 别名
- `npm run manifest:generate`: 运行 `python scripts/generate_manifest.py`
- `npm run manifest:validate`: 校验 `projects.manifest.json`（schema + 语义 + 资源路径）
- `npm run quality`: 本地质量链路（不含 E2E）
- `npm run quality:ci`: CI 质量链路（含 E2E + build）

首次执行 E2E 需要安装浏览器：

```bash
npx playwright install chromium
```

## Manifest 生成与自动修复

`scripts/generate_manifest.py` 不只生成清单，还会在扫描时做静态站点兼容修复：

- 扫描所有 `成员/项目/*.html`，生成 `projects.manifest.json`（`version: 3`）
- 跳过工程目录：`.git`、`.github`、`src`、`scripts`、`tests`、`dist`、`node_modules` 等
- 修复项目内根绝对路径资源（仅当目标文件在当前项目目录真实存在时）：
  - HTML: `src`、`href`、`srcset`
  - CSS: `url(...)`、`@import`
  - JS: 常见 `/assets`、`/images`、`/static`、`/media`、`/fonts` 字符串路径
- 修复常见数据和占位图写法：
  - `.../data` 基路径改写为基于 `import.meta.url` 的相对定位
  - 占位图 `images/placeholder.svg` 改写为 `new URL(..., import.meta.url).href`
- 修复 SPA 路由基址：
  - Vue Router 常见 `history: xxx(...)` 改为 `history: xxx(location.pathname)`
  - React `BrowserRouter` 压缩产物注入 `basename: window.location.pathname`

注意：该脚本可能改写项目源码文件（HTML/CSS/JS）并更新清单，不只是写 manifest。

## 门户行为说明

- 左侧点击项目：打开项目入口页
- 左侧点击子页面：打开该具体 html
- 右上角“新窗口打开”：打开当前预览实际 URL（含子路由）
- 页面 URL 的 hash 记录当前预览状态，刷新后可恢复
- iframe 加载超时或 error 时会显示“预览加载失败”提示

数据加载顺序：

1. 先读 `projects.manifest.json`（主数据源，含 `routeMode`/`hiddenPages`/`displayName`）
2. manifest 不可用时回退到 GitHub API 文件树

## GitHub Actions

- `Quality Checks`（`.github/workflows/quality.yml`）
  - 安装 Node/Python/Playwright
  - 执行 `npm run quality:ci`
  - 再执行 `python scripts/generate_manifest.py` 并检查工作区是否有差异（防止漏提交生成结果）
- `Auto Generate Project Config`（`.github/workflows/update-manifest.yml`）
  - `main` 分支变更后自动生成 manifest
  - 有变化则由 `github-actions[bot]` 自动提交

## 常见问题


### 1) `Unexpected token '<', "<!doctype "... is not valid JSON`

这表示请求到的不是 JSON，而是 HTML（通常是 404 回退页或入口页）。请检查：

- 请求 URL 是否指向真实 JSON 文件
- 是否使用了站点根绝对路径（`/data/...`）导致跑到仓库根目录
- 运行 `python scripts/generate_manifest.py` 后是否有改写结果未提交

## 自定义域名

默认在 `*.github.io` 下自动推断 `owner/repo`。

如果使用自定义域名，请在 `src/portal/config.js` 显式配置：

```js
export const CONFIG = {
  owner: "Jobo16",
  repo: "Jobo16.github.io",
  branch: "main",
  rootPath: "/",
};
```

## 相关文档

- `docs/baseline-checklist.md`: 重构基线回归清单
- `docs/project-onboarding.md`: 新成员项目接入流程
- `docs/rollback.md`: 故障回滚预案
- `docs/troubleshooting.md`: 常见排查
