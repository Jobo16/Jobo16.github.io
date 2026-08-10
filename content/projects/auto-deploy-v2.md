---
title: auto-deploy-v2
description: 用一条命令创建、更新和删除静态网站。
date: 2026-04-23
tags: [project, deploy, cli]
aliases: [projects/devtools-infra/auto-deploy-v2]
draft: false
---

auto-deploy-v2 是一个面向临时页面、Demo 和 Vibe Coding 产物的静态网站发布工具。

## 我做了什么

- 实现项目创建、压缩包上传、安全解压、更新和删除。
- 提供 CLI 和 JSON 输出，方便人和 Agent 使用同一套接口。
- 使用 Docker 部署，并通过外层网关提供访问入口。

## 结果

团队可以把静态网站发布收敛为一条命令，不再为每个页面单独配置服务器目录和反向代理。
