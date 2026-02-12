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

## 页面行为说明

- 左侧点击项目：打开项目入口页
- 左侧点击子文件：打开该具体 html 文件
- 右上角“新窗口打开”：独立标签页打开当前预览
- URL hash 会记录当前预览路径，刷新后可恢复

## 自定义域名说明

默认会在 `*.github.io` 域名下自动推断仓库。

如果你使用了自定义域名，请编辑 `index.html` 中脚本顶部的 `CONFIG`：

```js
const CONFIG = {
  owner: "你的 GitHub 用户名",
  repo: "你的仓库名",
  branch: "",    // 可留空，自动读取默认分支
  rootPath: ""   // 可留空；如需手动指定可填 "/" 或 "/repo-name/"
};
```
