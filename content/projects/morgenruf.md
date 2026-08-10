---
title: 晨序
description: 基于 Morgenruf 改造的飞书团队进度收集、确认、看板与发布系统。
date: 2026-08-10
tags: [project, ai, automation, feishu]
draft: false
---

晨序早期基于 MIT License 的 Morgenruf 改造，之后收敛为面向飞书的自托管团队进度工作流。

系统通过机器人私聊成员收集进度，由 AI 整理为结构化内容；成员确认后才写入数据库。Dashboard 用于查看、修正和追溯记录，定时任务再把指定范围的进度快照发布到群聊或 Webhook。

## 我做了什么

- 接入飞书长连接，让本地部署不依赖公网事件回调。
- 用 React 重构 Dashboard，聚焦看板、收集和定时发布三条链路。
- 重构项目、成员、岗位、进度内容和日期的数据模型。
- 限制 AI 只生成摘要，明细始终来自已确认的数据库记录。

这次改造的重点不是增加一个“AI 总结”按钮，而是让收集、确认、存储和发布各自有清晰的责任边界。

- [独立项目仓库](https://github.com/Jobo16/chenxu)
- [Morgenruf 改造过程](https://github.com/Jobo16/morgenruf)
- [上游项目](https://github.com/morgenruf/morgenruf)
