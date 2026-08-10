---
title: CLI-Anything：让软件更适合 Agent 调用
description: 关于 Agent 友好 CLI、结构化输出和可验证工具接口的记录。
date: 2026-04-21
tags: [note, cli, agent]
aliases: [projects/devtools-infra/cli-anything]
draft: false
---

[CLI-Anything](https://github.com/HKUDS/CLI-Anything) 探索如何把软件能力包装成 Agent 可以稳定调用的命令行接口。

我关注的重点有三个：

- 用明确命令代替模糊的界面操作。
- 同时提供人类可读结果和结构化 JSON。
- 用测试约束状态变化，让 Agent 的操作可以验证。

这套思路可以用于部署工具、内容处理、浏览器任务和内部后台：先建立稳定接口，再让 Agent 进入真实工作流。
