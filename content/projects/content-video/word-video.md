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

## 仓库

- Codeup：<https://codeup.aliyun.com/696a12a07a1ed8d3da00f471/prod/remotion>

## 项目定位

这个项目的目标是把“词汇学习内容”变成可以批量生产的视频模板。内容不靠手工剪辑堆叠，而是通过 CSV 数据、图片、音频和 Remotion 组件组合生成。

## 内容结构

- 一张图片。
- 一个英文问题。
- 重复展示中文词和拼音。
- 一个中文例句。
- 三段音频素材。
- 一个可选结尾视频。
- 一组透明 PNG 进度动画帧。

## 工作流

通过 `data/lessons.csv` 管理课程数据，并用统一的 `lessonId` 匹配图片、问题音频、词汇音频、例句音频和结尾视频。

这个项目适合继续扩展成批量语言学习视频生成工具。

## 技术栈

- Remotion 4、React 19、TypeScript。
- `@remotion/cli` 和 `@remotion/media-utils` 负责预览、媒体处理和渲染。
- `scripts/render.mjs` 根据 `LESSON_ID` 渲染指定课程。
- 素材目录按图片、问题音频、词汇音频、例句音频、结尾视频和进度动画分层管理。

## 输入与输出

- 输入表：`data/lessons.csv`
- 必填字段：`lessonId`、`termZh`、`termPinyin`、`exampleZh`、`meaningEn`、`termEn`
- 预览命令：`npm run dev -- --port=3030`
- 渲染命令：`LESSON_ID=lesson-001 npm run render`
- 输出文件：`out/<lessonId>.mp4`

## 当前状态

项目已经形成一个最小可用的视频生成模板。后续可以继续扩展多模板、批量渲染队列、素材检查、自动字幕、封面生成和多平台导出尺寸。
