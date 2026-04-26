---
title: "项目"
description: "我正在做或曾经做过的 AI、Web、自动化和内容工具项目。"
date: 2026-04-26
tags:
  - project
draft: false
---

# 项目

这里集中记录我正在做或曾经做过的项目。先用一个页面维护，避免项目页过早拆散；等某个项目需要长期写进展时，再单独拆成笔记。

## 当前重点

### Tangclaw v3

AI SaaS 工作台，围绕会话、学习资产、RAG、自动化任务、运行时配置和微信通道构建。

- 公开入口：<https://claw.jobo.asia>
- 技术关键词：Next.js、TypeScript、PostgreSQL、pgvector、Drizzle、对象存储、worker、微信 bridge。
- 我关注的问题：如何让文件、学习资料、用户档案和自动化产物真正进入 AI 可读的产品运行时。

### auto-deploy-v2

轻量静态网站部署服务，支持上传 zip、创建项目、更新版本、删除项目和生成访问地址。

- 健康检查：<http://deploy.sites.tzxys.cn/health>
- 解决的问题：把“每次手动配 Nginx 和目录”的静态页面部署流程，收敛成可复用服务和 CLI。

### 小红书评论校验同步 Bot

读取飞书多维表格中的链接，抓取小红书评论，判断是否命中指定关键词，并把结果写回飞书。

- 关键词：飞书多维表格、Cookie 管理、定时同步、失败重试、Docker 部署、状态持久化。
- 项目价值：把人工检查评论和复制结果的重复流程变成可追踪的自动化任务。

### Word Video

面向中文词汇学习短视频的 Remotion 项目。每条视频围绕一个词汇组织图片、英文问题、中文词、拼音、例句和多段音频。

- 关键词：Remotion、CSV 数据、素材匹配、批量渲染、语言学习短视频。

### Remotion Batch Video Platform

网页化视频模板平台，支持在浏览器里选择模板、上传素材、修改参数、预览单条视频并触发批量渲染。

- 当前模板：`phrase-focus`、`vocabulary-burst`
- 目标：把视频生成从“写代码渲染一条视频”推进到“模板化、参数化、批量化”。

## 业务系统与工具

### SCRM 与 AI 销售模块

参与企业微信 SCRM 相关开发，包括后台业务模块、数据同步清洗、标准 SOP、消息卡片、前后端联调和 AI 销售模块探索。

### English Practice Platform

基于 Next.js 的英语练习与题库管理平台，覆盖听力、阅读、口语、写作和管理后台。

### 考情采集与分析工具

面向小红书内容的考情信息采集、OCR 分析和 Excel 导出工具，用来把分散的平台内容整理成结构化材料。

## Agent 与开发工具

### skills-kit

可安装的 Codex skills 仓库，用来沉淀提交说明、目标拆解、环境检查等可复用工作流。

### OnlySpecs

用于管理规格文档和实现版本的 Electron 桌面工具，关注“想做什么”和“已经实现了什么”之间的关系。

### CLI-Anything 相关探索

围绕 Agent 友好 CLI、GUI 自动化和工具调用接口的探索：把更多软件和源码仓库变成 AI Agent 可以稳定调用的命令层。

## 早期作品

- AI Prompt Optimizer：提示词优化器 Web App。
- TEM-4 真题资源整合网站。
- 随机数字抽取工具。
- 红包感谢语生成器。
