---
title: "考情采集与分析工具"
description: "面向小红书内容的考情信息采集、OCR 分析和 Excel 导出工具。"
date: 2026-04-21
tags:
  - project
  - automation
  - data
aliases:
  - projects/kaoqing
draft: false
---

这个项目基于小红书内容采集能力，扩展出面向考情信息整理的批处理流程。它把分散在平台内容里的考试经验、题型反馈、评论线索和图片信息整理成可以检索、分析和导出的结构化材料。

## 仓库

- Codeup：<https://codeup.aliyun.com/696a12a07a1ed8d3da00f471/prod/xhs-exam-collector>

## 项目定位

这个项目更像一个“考情采集工作台”：输入是一批小红书帖子链接，输出是带有标题、正文、评论、图片 OCR 和模型分析结果的 Excel。它适合处理重复、分散、人工整理成本高的信息搜集任务。

## 主要能力

- 批量读取 URL 列表。
- 抓取帖子标题、正文、评论和图片。
- 调用 SiliconFlow OCR 与分析模型处理图片和文本。
- 帖子级并发、OCR 并发和模型请求重试。
- 导出结构化 Excel，并保留中间 JSON 与下载图片。
- 提供 Web 页面，支持手动粘贴 URL、执行任务并下载结果。
- 提供管理员配置页，维护 `SILICONFLOW_API_KEY` 和小红书 Cookie。
- 支持 Docker / ECS 单机部署，运行时数据持久化到宿主机目录。

## 技术与部署

- Python 爬取与批处理脚本。
- Node.js 依赖用于小红书接口签名和页面能力。
- Flask / Waitress 提供轻量 Web 页面。
- SiliconFlow OCR 与分析模型用于图片和文本理解。
- 生产部署推荐单机 Docker Compose，并由外层网关反代。
- 运行时目录约定为 `/opt/kaoqing/runtime/`，保存 `.env`、Cookie、导出 Excel、JSON 和图片。

## 适用场景

- 考试经验帖、题型反馈、评论区线索的批量整理。
- 把人工浏览、截图、复制、汇总的流程变成可重复执行的任务。
- 给后续的数据分析、内容整理或业务判断提供结构化输入。

## 当前状态

项目已经具备批处理脚本、Web 页面、管理员配置页和 Docker 部署方案。后续更适合继续补的是任务队列、处理进度展示、失败任务重跑和导出字段模板化。
