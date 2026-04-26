---
title: "Tangclaw v3"
description: "一个以 AI 会话、学习资产、自动化任务和通道交付为核心的 TypeScript 全栈工作台。"
date: 2026-04-25
tags:
  - project
  - ai
  - nextjs
aliases:
  - projects/tangclaw-v3
draft: false
---

Tangclaw v3 是我近期投入最多的项目之一。它不是普通聊天壳，而是围绕用户会话、学习资源、资产处理、自动化任务、运行时配置和外部通道交付构建的 AI SaaS 工作台。

公开入口：<https://claw.jobo.asia>

## 仓库

- Gitee：<https://gitee.com/Jobot/web-claw-v3>

## 项目定位

这个项目的目标是把 AI 会话、用户资料、文件资产、长期任务和外部通道统一到一个产品工作台里。它关注的不是“把模型接进页面”，而是把 AI 真正放进可持续运行的业务流程：

- 用户可以围绕一个会话持续工作，而不是每次从空白聊天开始。
- 文件、资料、学习记录和用户档案可以进入 AI 可读上下文。
- 长任务可以交给 worker 执行，并生成可追踪的 Markdown/PDF 产物。
- 管理员可以维护专家、技能、系统提示词、工具策略和运行时配置。
- Web 会话、后台自动化和微信通道共用同一套资产与运行时模型。

## 技术栈

- Next.js App Router、React、TypeScript、Tailwind CSS、shadcn/ui。
- PostgreSQL、pgvector、Drizzle ORM、S3 兼容对象存储。
- SiliconFlow OpenAI-compatible chat 与 embeddings。
- 文件上传、内容抽取、分块、向量化、RAG 检索。
- 本地 Node.js worker、自动化任务、运行产物持久化。
- WeChat / iLink channel bridge，用于微信通道绑定、消息归一化和回传。
- Monorepo 结构：`apps/web`、`apps/worker`、`apps/bridge-wechat`、`packages/ai`、`packages/db`、`packages/shared`。

## 主要能力

- 真实登录、会话列表和会话详情。
- 非流式持久化 AI 会话运行时。
- 文件上传、资产引用、资产抽取、chunking 和向量化。
- 会话级资产检索，让 AI 能读取用户上传或沉淀的资料。
- 自动化任务调度和 worker 后台执行。
- 自动化生成的 Markdown / PDF 作为普通资产保存。
- 专家、技能、系统提示词和工具策略的后台配置。
- xintong 主站账号绑定与只读学习档案快照同步。
- 微信通道绑定、入站消息归一化和出站回复代码路径。

## 我在这个项目里关注的事

- 如何把 AI 会话从一次性聊天变成可持久化、可追踪、可配置的运行时。
- 如何让文件、学习资料和用户档案真正进入 AI 可读上下文。
- 如何把后台任务、自动化产物和外部通道纳入同一套产品模型。
- 如何用 AI Coding 快速推进真实业务系统，同时保留工程边界和可验证性。
- 如何使用 claw 技术连通微信，让用户可以直接在微信上聊天。

## 当前状态

项目已经越过第一版可执行切片，进入稳定化阶段。当前主要工作是验证核心链路：会话运行、资产处理、自动化任务、生成产物、微信入站/出站，以及生产环境配置。

还需要继续打磨的部分包括流式聊天、生产部署文档、v2 到 v3 的数据迁移，以及微信通道的完整 live 验证。
