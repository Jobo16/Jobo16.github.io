# 团队项目接入指南

## 1. 目标

让成员在零配置情况下，把静态项目接入统一托管平台。

## 2. 最小接入步骤

1. 在仓库根目录创建成员文件夹：`成员名/`。
2. 在成员目录下创建项目文件夹：`成员名/项目名/`。
3. 将静态文件复制到项目目录（至少包含一个 `*.html`）。
4. 推送到 `main` 分支。

完成后，系统会自动：

1. 扫描 HTML 页面。
2. 更新 `projects.manifest.json`。
3. 校验 manifest 结构与语义。
4. 在目录页展示该项目并支持 iframe 预览。

## 3. 目录规范

```text
仓库根目录/
  成员A/
    项目1/
      index.html
      assets/
```

规则：

1. 目录深度至少为 `成员名/项目名/*.html`。
2. 项目内有 `index.html` 时优先作为入口。
3. 若无 `index.html`，系统自动按规则选入口文件。

## 4. 可选高级配置

默认不需要任何配置文件。  
如需高级行为，可在项目目录放置 `project.meta.json`（已启用）：

1. 自定义入口页。
2. 调整展示名称与排序。
3. 隐藏部分页面但保持可直达。
4. 指定项目子路由模式（`path` / `hash`）。

示例：

```json
{
  "entry": "index.html",
  "routeMode": "hash",
  "displayName": "后台系统",
  "order": 20,
  "hiddenPages": ["dev-only.html"],
  "tags": ["react", "admin"],
  "updatedAt": "2026-02-12T00:00:00Z"
}
```

注意：

1. `entry` 与 `hiddenPages` 必须指向当前项目目录内已存在的 HTML 文件。
2. 无效字段会被生成器忽略，并在 CI 日志输出 warning。

## 5. 本地检查命令

```bash
npm run manifest:generate
npm run manifest:validate
npm run quality
```

## 6. 通过标准

1. `npm run manifest:validate` 通过。
2. 新项目在目录树可见。
3. 点击后 iframe 可正常加载。
4. 页面分享链接刷新后可恢复。
