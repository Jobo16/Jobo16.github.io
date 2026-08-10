---
title: 美篇精选爬虫
description: 批量采集美篇精选文章、封面和互动指标，并生成 Excel 报表。
date: 2026-08-10
tags: [project, python, crawler, automation]
draft: false
---

美篇精选爬虫把内容调研拆成一条可重复执行的流水线：选择板块、收集文章链接、下载页面、提取文章与封面，最后生成包含图片的 Excel 报表。

## 我做了什么

- 提取标题、作者、阅读量、点赞数等文章字段。
- 下载封面图片并嵌入最终报表。
- 提供交互式板块选择、运行进度和分步执行方式。
- 在出错时停止后续步骤，并保留原始文件便于检查。

- [GitHub](https://github.com/Jobo16/meipian_hot_crawler)
