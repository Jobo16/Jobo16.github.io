---
title: "skills-kit"
description: "一个用于沉淀和分发 Codex skills 的仓库。"
date: 2026-04-17
tags:
  - project
  - skills
  - agent
aliases:
  - projects/skills-kit
draft: false
---

skills-kit 是一个面向 Codex skills 的仓库，用来沉淀可复用的工作流规则。

## 仓库

- GitHub：<https://github.com/Jobo16/skills-kit>

## 项目定位

skills-kit 是我的 Codex skills 仓库，用来把高频工作流沉淀成可安装、可复用、可迁移的项目规则。它不是普通提示词集合，而是把“什么时候触发、要检查什么、如何执行、如何验证”写成稳定的执行说明。

## 当前 skills

- `git-commit-doc`
- `goal-driven`
- `project-env-manager`

## 我为什么做它

AI Coding 的效果很依赖上下文和规则。把常用流程写成 skill，可以让 Agent 在不同项目中更稳定地执行提交说明、目标拆解、环境检查等任务。

## 已沉淀的方向

- `git-commit-doc`：检查变更、生成中文 Conventional Commit 提交说明，并按确认后的内容提交。
- `goal-driven`：把复杂目标拆成可验证的执行路径，并允许主 Agent 自主决定是否委派子 Agent。
- `project-env-manager`：维护项目级环境契约，检查本机依赖、运行时、工具和插件是否满足要求。

## 使用方式

通过支持 GitHub repo path 的 skills installer 安装，指向仓库和具体 skill 路径：

- Repo：`Jobo16/skills-kit`
- Path：`skills/git-commit-doc`
- Path：`skills/goal-driven`
- Path：`skills/project-env-manager`

安装后重启 Codex，让新 skills 进入可用列表。

## 项目价值

这个仓库把很多“每次都要重新解释”的操作变成项目级规则，尤其适合长期维护多个代码仓库、部署链路和内容项目。它也和这个博客项目里的 `.agents/skills/` 一脉相承：博客本身有本地内容规则，通用工作流则沉淀到 skills-kit。
