# 团队成员静态项目展示

这是一个可直接部署到 GitHub Pages 的静态索引页：

- 左侧自动展示 `成员 -> 项目` 结构
- 右侧 iframe 直接渲染被点击项目的 HTML 页面

## 目录约定

请按下面结构放置文件：

```text
仓库根目录/
  成员A/
    项目1/
      index.html
      style.css
      main.js
    项目2/
      demo.html
  成员B/
    项目X/
      index.html
```

规则：

- 至少两级目录：`成员名/项目名/*.html`
- 项目里有 `index.html` 时，会优先作为项目入口
- 没有 `index.html` 时，会自动选择该项目下第一个 html 文件
- 支持可选 `project.meta.json`（用于入口、路由模式、展示名、排序等高级配置）

可选高级配置示例（`成员名/项目名/project.meta.json`）：

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

## 使用方式

1. 在仓库根目录新增成员文件夹
2. 在成员文件夹中新增项目文件夹
3. 把静态文件拖入该项目文件夹（支持 html + css/js）
4. 直接推送到 `main` 分支（或合并到 `main`）
5. 打开 Pages 地址即可自动看到最新目录树

你不需要手动修改任何配置文件。仓库会自动生成并更新 `projects.manifest.json`。
门户壳层代码已拆分到 `src/portal/`（样式、配置、工具、主逻辑模块）。

## 本地开发（可选）

```bash
npm install
npm run dev
```

常用命令：

- `npm run lint`：代码规范检查
- `npm run test`：单元测试
- `npm run test:e2e`：端到端测试（Playwright）
- `npm run typecheck`：类型检查
- `npm run typecheck:portal`：对 `src/portal` 执行严格 `checkJs` 类型检查
- `npm run typecheck:services`：兼容别名（等同于 `typecheck:portal`）
- `npm run manifest:validate`：校验 `projects.manifest.json` 结构与语义一致性
- `npm run build`：构建门户壳层
- `npm run manifest:generate`：本地生成 manifest
- `npm run quality`：本地质量检查（不含 E2E）
- `npm run quality:ci`：CI 质量检查（含 E2E）

首次运行 E2E 前需要安装浏览器：

```bash
npx playwright install chromium
```

说明：`npm run quality:ci` 包含 `test:e2e`，因此执行前需要安装浏览器。

文档：

- `docs/baseline-checklist.md`：重构基线回归清单
- `docs/project-onboarding.md`：新成员项目接入流程
- `docs/rollback.md`：故障回滚预案
- `docs/troubleshooting.md`：常见问题排查

## Vue / Vite 项目注意事项

如果你上传的是 Vue 构建产物，请优先确保资源路径是相对路径，否则在 `成员名/项目名/` 子目录下会白屏。

- Vite 推荐配置：`base: "./"`
- Vue CLI 推荐配置：`publicPath: "./"`
- Vue Router 建议使用 `createWebHashHistory()`（纯静态托管更稳）

仓库的 `scripts/generate_manifest.py` 已包含兜底逻辑：

- 会自动扫描项目 HTML
- 会自动把多页面项目里的根绝对路径改成相对路径（仅在目标文件真实存在于当前项目目录时改写）：
  - HTML：`src`、`href`、`srcset`
  - CSS：`url(...)`、`@import`
  - 相对路径会按“当前文件所在目录”计算（适配多级页面目录）
- 若发现打包产物里 `history: xxx("/")` / `history: xxx()` / `history: xxx(import.meta.env.BASE_URL)` 且后续是 `routes:`（含压缩写法），会自动改为 `history: xxx(location.pathname)`，避免跳到站点根路径并确保项目级唯一路径

## 页面行为说明

- 左侧点击项目：打开项目入口页
- 左侧点击子文件：打开该具体 html 文件
- 右上角“新窗口打开”：独立标签页直达当前页面 URL（非目录首页）
- URL hash 会记录当前预览路径与子路由（例如 `#/成员/项目/index.html/categories`），刷新后可恢复

## 读取策略（已加兜底）

页面会按顺序读取：

1. `projects.manifest.json`（主数据源，支持高级元数据）
2. GitHub API 仓库文件树（当 manifest 不可用时兜底）

`projects.manifest.json` 由 GitHub Actions 自动维护：

- 触发条件：`main` 分支有新提交（新增成员目录或项目目录也包含在内）
- 自动动作：运行 `scripts/generate_manifest.py` 重新扫描目录并提交更新
- 生成器会自动跳过 `node_modules`、`dist`、`src`、`tests` 等工程目录，避免无关 HTML 被收录
- 结果：成员只需上传项目文件，不需要手动改任何清单或配置

如果你需要在本地临时预览清单，也可手动执行：

```powershell
python scripts/generate_manifest.py
```

## 自定义域名说明

默认会在 `*.github.io` 域名下自动推断仓库。

如果你使用了自定义域名，请编辑 `src/portal/config.js` 中的 `CONFIG`：

```js
const CONFIG = {
  owner: "Jobo16",
  repo: "Jobo16.github.io",
  branch: "main",
  rootPath: "/",
};
```
