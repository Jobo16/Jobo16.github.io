---
title: IELTS Agent Skills
description: 可独立安装的雅思学习 Agent 工作流，覆盖计划、练习和全科复盘。
date: 2026-08-10
tags: [project, agent, skill, education]
draft: false
---

IELTS Agent Skills 把长期雅思教研和学员服务经验整理为可安装的本地 Agent 工作流，支持 Codex、Claude Code、Cursor 和 WorkBuddy。

## 设计重点

- 每个 Skill 独立安装，由 Agent 根据学习任务选择。
- 覆盖学习计划、做题、写作、口语、阅读、听力、词汇和模考复盘。
- 没有 IELTS Buddy 服务时，也能基于用户主动提供的材料完成本地工作流。
- MCP 只负责传递题库、课程、进度和学习记录；教学判断保留在本地 Agent。
- 使用统一版本清单、自动校验和测试约束发布内容。

```bash
npx skills@latest add Jobo16/ielts-all-in-one-skills --skill '*' --global --yes
```

- [GitHub](https://github.com/Jobo16/ielts-all-in-one-skills)
- [[ielts-buddy|IELTS Buddy]]
