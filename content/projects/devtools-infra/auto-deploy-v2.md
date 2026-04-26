---
title: "auto-deploy-v2"
description: "一个轻量的静态网站上传、更新、删除和访问服务。"
date: 2026-04-23
tags:
  - project
  - deploy
  - tool
aliases:
  - projects/auto-deploy-v2
draft: false
---

auto-deploy-v2 是一个用于统一管理静态网站部署的小工具。它接收 `dist.zip`，安全解压后生成项目访问地址，并支持后续更新和删除。

## 仓库

- Codeup：<https://codeup.aliyun.com/696a12a07a1ed8d3da00f471/prod/auto-deploy-v2>

## 解决的问题

团队或个人经常会有很多临时静态页面、demo、活动页和构建产物。如果每次都手动配 Nginx、目录和域名，成本很高。这个项目把流程收敛成“上传压缩包 -> 获得访问地址 -> 后续可更新”。

## 主要能力

- 创建静态站点项目。
- 上传 zip 并检查 `index.html`。
- 更新已有项目版本。
- 删除项目和本地文件。
- 支持子域名模式和路径模式。
- 提供 CLI，用于从本地目录快速打包和发布。
- 通过 Node gateway 直接托管静态项目，外层 Nginx / OpenResty 只需要反代。
- 发布目录采用 releases/current 结构，方便替换当前版本。
- 支持 `--json` 输出，方便 Agent 或脚本读取部署结果。

## URL 模式

- 子域名模式：`http://demo-a1b2c3.sites.jobo.asia`
- 路径模式：`http://prod.tzxys.cn/demo`

子域名模式更适合任意前端构建产物，因为 `/assets/app.js` 这样的绝对资源路径仍然会留在项目自己的域名下。路径模式要求前端项目构建时正确配置 base path 或使用相对资源路径。

## 技术与部署

- Node.js 18+、Express、Multer、Unzipper、fs-extra。
- 服务运行在容器内部，由宿主机端口和外层网关转发。
- 如果 `8310` 被占用，部署脚本会自动尝试 `8311`、`8312` 等端口，并写回 `.env`。
- 数据挂载到 `./data`，容器内路径为 `/data`。
- 外层网关只需要把 `deploy.sites.jobo.asia` 或业务域名反代到本机端口。

## CLI 工作流

- `list`：列出已有静态项目。
- `publish <project-name> <zip-path>`：创建并发布新项目。
- `deploy <project-id|slug|name> <zip-path>`：更新已有项目。
- `delete <project-id|slug|name>`：删除项目和本地文件。

这个项目也沉淀成了可复用的部署 skill，用于让 Agent 从本地目录打包、上传、验证静态站点。

## 当前状态

项目已经具备服务端上传发布、静态托管、CLI 和 Docker 部署。后续可以继续补权限控制、发布历史页面、回滚、HTTPS 域名自动配置和更细的操作审计。
