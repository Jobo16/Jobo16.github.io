---
title: "CLI-Anything 相关探索"
description: "围绕 Agent 友好 CLI、GUI 自动化和工具调用接口的探索。"
date: 2026-04-21
tags:
  - project
  - cli
  - agent
aliases:
  - projects/cli-anything
draft: false
---

CLI-Anything 的核心想法是：把更多软件和源码仓库变成 AI Agent 可以稳定调用的 CLI。

## 仓库

- GitHub：<https://github.com/HKUDS/CLI-Anything>

## 项目定位

CLI-Anything 是一个把软件能力包装成 Agent-native CLI 的开源项目。它关注的不是单个工具，而是一套方法：分析软件或代码仓库，设计命令组和状态模型，实现结构化 CLI，再用测试和文档把能力稳定下来。

## 我关注的方向

- CLI 作为人和 Agent 都能理解的接口。
- 用结构化命令和 JSON 输出降低 Agent 操作软件的不确定性。
- 为 GUI 软件、内部工具和代码仓库构建可测试的命令层。
- 把工具能力接入 Codex、Claude Code、OpenCode 等 Agent 工作流。

这个方向和我正在整理的项目级 skills、Obsidian 内容维护规则、静态部署工具属于同一类问题：让 AI 不只是“聊天”，而是能进入明确的工作流。

## 核心流程

- Analyze：扫描源码或软件能力，识别可命令化的操作面。
- Design：设计 command groups、状态模型、输出格式和边界。
- Implement：用 Python Click 等工具实现 CLI、REPL、JSON 输出。
- Plan Tests：规划单元测试和端到端测试。
- Write Tests：补充自动化测试，验证 CLI 行为。
- Document：生成 README、TEST.md 和使用说明。
- Publish：打包安装，让 CLI 进入系统 PATH 或 Agent 可调用环境。

## 相关能力

- CLI-Hub：集中浏览、安装、更新和卸载社区 CLI。
- `skills/`：每个 CLI harness 可沉淀成可安装的 Agent skill。
- 支持围绕 GIMP、Blender、Obsidian、Kdenlive、Godot、n8n、Safari、QGIS 等软件生成或维护 CLI harness。
- 文档强调 JSON 输出、人类可读输出、测试覆盖和可复现安装。

## 我用它解决的问题

我主要把它当作“软件 Agent 化”的方法论参考：当一个系统只有 GUI、内部脚本或分散 API 时，先给它补出稳定 CLI，再让 Agent 基于 CLI 做真实操作。这个思路可以迁移到本地 Obsidian 内容维护、项目部署、浏览器任务、内容工具和内部后台。

## 当前状态

这是外部开源项目，我本地主要用于学习、验证和定制 CLI harness 思路。后续如果有合适的软件或内部工具，可以按它的方法生成自己的 Agent 友好 CLI。
