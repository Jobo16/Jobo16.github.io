---
title: 小红书评论校验同步 Bot
description: 读取飞书链接、检查评论并自动写回结果的服务。
date: 2026-04-23
tags: [project, automation, data]
aliases: [projects/automation-data/xhs-comment-audit-bot]
draft: false
---

这个项目把“打开链接、检查评论、判断关键词、复制结果”的人工流程变成自动化任务。

## 我做了什么

- 使用 Python 和 FastAPI 构建后台服务与控制面板。
- 接入飞书多维表格读写和内容采集能力。
- 实现 Cookie 管理、定时同步、失败重试、结果去重和消息提醒。
- 使用 Docker 部署并持久化运行状态。

## 结果

运营人员只需要维护表格中的链接，系统会自动处理并回写结果，整个过程可追踪、可重试。

- [代码仓库](https://gitee.com/Jobot/xhs-comment-audit-bot)
