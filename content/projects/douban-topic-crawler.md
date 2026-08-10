---
title: 豆瓣小组帖子提取工具
description: 从保存的豆瓣小组页面提取帖子字段，并导出为可分析的 CSV。
date: 2026-08-10
tags: [project, python, crawler, data]
draft: false
---

这是一个小型 Python 数据整理工具：读取浏览器保存的豆瓣小组 HTML，提取作者、发布时间、回应数、点赞数、链接和正文，再输出为 CSV。

我把网络访问和页面解析分开：先由用户在浏览器保存页面，再离线解析。对于一次性研究任务，这种方式比维护登录态和复杂抓取链路更简单，也更容易复核原始输入。

- [GitHub](https://github.com/Jobo16/douban-topic-acritcle-crawler)
