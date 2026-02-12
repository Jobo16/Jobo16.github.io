# 重构记录

## 2026-02-12

### 阶段

1. 阶段 1（工程骨架与模块拆分）推进中。

### 本次完成

1. 门户入口从单文件内联结构拆分为模块：
   - `index.html` 改为引用 `src/portal/styles.css` 与 `src/portal/app.js`。
2. 新增模块化目录（首批）：
   - `src/portal/config.js`
   - `src/portal/utils.js`
   - `src/portal/state/store.js`
   - `src/portal/dom/elements.js`
   - `src/portal/services/data-service.js`
   - `src/portal/features/routing.js`
   - `src/portal/features/catalog.js`
3. `src/portal/app.js` 已改为编排层，移除重复的数据访问与路由工具实现，改为依赖服务模块。
4. Manifest 兼容逻辑保持：
   - 支持 `htmlPaths`
   - 支持从 `members/projects/pages` 回退提取页面路径
5. 继续拆分预览能力模块：
   - 新增 `src/portal/features/preview.js`（`activatePath`、`setEmptyMessage`、`syncHashFromFrameLocation`）
   - `app.js` 移除对应实现，改为模块调用
6. 初始化工程化骨架：
   - 新增 `package.json`、`tsconfig.json`、`vite.config.js`
   - 产出可执行开发命令：`dev/build/preview/typecheck`
7. 继续拆分编排层：
   - 新增 `src/portal/features/bootstrap.js`（`initializePortal`、`bindPortalEvents`）
   - `app.js` 只保留模块装配与依赖注入
8. 增加工程目录忽略规则：
   - 新增 `.gitignore`（`node_modules/`、`dist/` 等）
   - 清理本地构建目录，避免提交污染
9. 服务层按职责继续拆分：
   - `data-service` 拆分为 `repo-service` 与 `manifest-service`
   - `app.js` 已切换到新服务模块
10. 增加第一批单元测试：

- `src/portal/features/routing.test.js`
- `src/portal/services/manifest-service.test.js`

11. 质量流水线升级：

- `package.json` 新增 `lint/test/quality` 脚本
- 新增 `eslint.config.js` 与 `.prettierignore`
- `quality.yml` 增加 `npm run test`

12. 阶段 2 关键缺口补齐：

- 新增 `projects.schema.json`
- 新增 `tools/validate-projects.mjs`
- 新增 `manifest:validate` 脚本并接入 `quality.yml`

13. 阶段 6 文档推进：

- 新增 `docs/project-onboarding.md`
- 新增 `docs/troubleshooting.md`

14. 阶段 0 补齐：

- 新增 `docs/baseline-checklist.md`
- 新增 `docs/rollback.md`

15. 单元测试补充：

- 新增 `src/portal/utils.test.js`（入口选择与树结构）

16. TypeScript 渐进迁移（首批）：

- `services` 与 `routing/utils` 增加 `@ts-check + JSDoc` 类型
- 新增 `tsconfig.services.json` 与 `typecheck:services`
- 质量流水线接入 `typecheck:services`

17. TypeScript 渐进迁移（第二批）：

- 新增统一类型定义：`src/portal/types.js`
- `catalog/preview/bootstrap/app/state/dom/config` 补齐 `@ts-check + JSDoc`
- DOM 引用改为启动期强校验，避免空节点隐患

18. 严格类型检查范围扩大：

- `tsconfig.services.json` 扩展为覆盖 `src/portal/**/*.js`
- 新增 `typecheck:portal`，保留 `typecheck:services` 兼容别名
- `quality.yml` 切换为 `typecheck:portal`

19. 样式架构分层落地：

- `src/portal/styles.css` 改为聚合入口
- 新增 `src/portal/styles/tokens.css`
- 新增 `src/portal/styles/base.css`
- 新增 `src/portal/styles/layout.css`
- 新增 `src/portal/styles/components.css`

20. 阶段 3 异常兜底首批落地：

- 预览区新增 `viewerStatus` 状态提示位（`index.html` + 样式）
- `preview` 模块新增状态管理与异常提示（加载中、跨域不可同步、路径不匹配、加载失败）
- `bootstrap` 监听 iframe `error` 事件并输出可操作提示（建议新窗口打开）

21. 阶段 5 E2E 基线落地：

- 新增 `playwright.config.js`
- 新增 `tests/e2e/portal.spec.js`（目录渲染、搜索过滤、深链恢复、iframe 失败提示）
- `package.json` 新增 `test:e2e` 并纳入 `quality` 流程
- `quality.yml` 新增 Playwright Chromium 安装与 E2E 步骤
- `.gitignore` 新增 `playwright-report/` 与 `test-results/`

22. 测试体系冲突修复：

- `vitest` 原本会误扫描 `tests/e2e/portal.spec.js`
- `package.json` 中 `test` 调整为 `vitest run src/portal`，与 Playwright 用例隔离

23. Manifest 协议增强（阶段 2 深化）：

- `scripts/generate_manifest.py` 支持读取 `project.meta.json`
- 生成 `version: 3` 清单，项目新增 `id/member/routeMode/...` 元字段
- 新增顶层 `projects` 平铺结构，保持与 `members[*].projects` 一致
- 生成器增加工程目录排除规则，避免误扫描 `node_modules` 等目录

24. 校验器与 schema 同步升级：

- `projects.schema.json` 新增项目元字段与顶层 `projects` 定义
- `tools/validate-projects.mjs` 新增 `projects` 与 `members[*].projects` 一致性校验
- 增加 `hiddenPages` 语义校验（必须属于 pages，且不能包含 entry）

25. 门户读取策略与目录行为增强：

- `initializePortal` 调整为 manifest 优先、GitHub API 兜底
- `manifest-service` 新增 manifest -> 目录树转换，支持 `displayName/routeMode/hiddenPages/order`
- 目录渲染支持项目展示名、路由模式透传、隐藏页面可深链直达
- hash 恢复与回放标题改为按目录树解析，避免仅按路径字符串展示

26. 质量脚本分层优化：

- `quality` 调整为本地可稳定执行（不依赖 Playwright 浏览器下载）
- 新增 `quality:ci`，由 CI 执行完整门禁（含 E2E）
- `quality.yml` 切换为调用 `quality:ci`

### 自动化与零配置能力（已保留）

1. `scripts/generate_manifest.py` 自动生成 `projects.manifest.json`。
2. 自动修正可验证的静态资源绝对路径（HTML/CSS）。
3. GitHub Actions 自动更新 manifest。

### 已执行验证

1. `node --check src/portal/app.js`
2. `node --check src/portal/utils.js`
3. `python scripts/generate_manifest.py`
4. `python -m py_compile scripts/generate_manifest.py`
5. `npm install`
6. `npm run typecheck`
7. `npm run build`
8. `node --check src/portal/features/bootstrap.js`
9. `npm run lint`
10. `npm run test`
11. `npm run manifest:validate`
12. `npm run quality`
13. `npm run typecheck:services`
14. `npm run typecheck:portal`
15. `npm run format:check`
16. `npx playwright test --list`
17. `npx playwright install chromium`（当前环境网络 `ECONNRESET`，下载失败）
18. `npm run test:e2e`（因浏览器未安装失败，非用例逻辑失败）
19. `python -m py_compile scripts/generate_manifest.py`

### 下一步

1. 继续推进阶段 3：补齐 iframe 异常场景回归用例（404/拒绝嵌入/重定向）。
2. 在可联网环境执行 `npx playwright install chromium` 后跑通 E2E 实测。
3. 评估从 `checkJs` 向 `.ts` 文件迁移路径与批次。
