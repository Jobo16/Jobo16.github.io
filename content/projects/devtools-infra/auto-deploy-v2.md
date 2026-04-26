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

健康检查：<http://deploy.sites.tzxys.cn/health>

## 解决的问题

团队或个人经常会有很多临时静态页面、demo、活动页和构建产物。如果每次都手动配 Nginx、目录和域名，成本很高。这个项目把流程收敛成“上传压缩包 -> 获得访问地址 -> 后续可更新”。

## 主要能力

- 创建静态站点项目。
- 上传 zip 并检查 `index.html`。
- 更新已有项目版本。
- 删除项目和本地文件。
- 支持子域名模式和路径模式。
- 提供 CLI，用于从本地目录快速打包和发布。
