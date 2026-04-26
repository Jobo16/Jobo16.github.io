---
title: "Word Video"
description: "用于生成中文词汇学习短视频的 Remotion 项目。"
date: 2026-04-24
tags:
  - project
  - remotion
  - video
aliases:
  - projects/word-video
draft: false
---

Word Video 是一个面向中文词汇学习短视频的 Remotion 项目。每条视频围绕一个词汇组织素材，包括图片、英文问题、中文词、拼音、例句和多段音频。

## 内容结构

- 一张图片。
- 一个英文问题。
- 重复展示中文词和拼音。
- 一个中文例句。
- 三段音频素材。

## 工作流

通过 `data/lessons.csv` 管理课程数据，并用统一的 `lessonId` 匹配图片、问题音频、词汇音频、例句音频和结尾视频。

这个项目适合继续扩展成批量语言学习视频生成工具。
