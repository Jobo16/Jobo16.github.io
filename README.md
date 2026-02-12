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

## 使用方式

1. 在仓库根目录新增成员文件夹
2. 在成员文件夹中新增项目文件夹
3. 把静态文件拖入该项目文件夹（支持 html + css/js）
4. 推送到 GitHub 并启用 GitHub Pages
5. 打开 Pages 地址即可自动看到最新目录树

## Vue / Vite 项目注意事项

如果你上传的是 Vue 构建产物，请优先确保资源路径是相对路径，否则在 `成员名/项目名/` 子目录下会白屏。

- Vite 推荐配置：`base: "./"`
- Vue CLI 推荐配置：`publicPath: "./"`
- Vue Router 建议使用 `createWebHashHistory()`（纯静态托管更稳）

仓库的 `scripts/generate_manifest.py` 已包含兜底逻辑：
- 会自动扫描项目 HTML
- 若发现 `src="/assets/..."`、`href="/static/..."` 这类根路径且文件实际在当前项目目录下，会自动改为 `./assets/...`、`./static/...`

## 页面行为说明

- 左侧点击项目：打开项目入口页
- 左侧点击子文件：打开该具体 html 文件
- 右上角“新窗口打开”：独立标签页打开当前预览
- URL hash 会记录当前预览路径，刷新后可恢复

## 读取策略（已加兜底）

页面会按顺序读取：
1. GitHub API 仓库文件树
2. `projects.manifest.json`（当 API 失败时兜底）

如果你新增了很多项目，且遇到 API 受限，可在仓库根目录执行下面命令更新清单后再推送：

```powershell
$root = (Get-Location).Path
$htmlPaths = Get-ChildItem -Recurse -File |
  Where-Object { $_.Extension -match '^\.html?$' } |
  ForEach-Object { $_.FullName.Substring($root.Length + 1) -replace '\\','/' } |
  Where-Object { ($_ -split '/').Length -ge 3 } |
  Sort-Object -Unique

$manifest = [ordered]@{
  generatedAt = (Get-Date).ToString('yyyy-MM-ddTHH:mm:ssK')
  htmlPaths = @($htmlPaths)
}

$manifest | ConvertTo-Json -Depth 4 | Set-Content -Path projects.manifest.json -Encoding UTF8
```

## 自定义域名说明

默认会在 `*.github.io` 域名下自动推断仓库。

如果你使用了自定义域名，请编辑 `index.html` 中脚本顶部的 `CONFIG`：

```js
const CONFIG = {
  owner: "Jobo16",
  repo: "Jobo16.github.io",
  branch: "main",
  rootPath: "/"
};
```
