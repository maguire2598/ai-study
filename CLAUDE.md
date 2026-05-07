# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 项目概述

为大学生服务的高等数学考试复习网站（纯前端原型）。通过 Mock AI 交互帮助学生制定复习计划、学习知识点、刷题练习、模拟考试。

## 技术方案

- 原生 HTML/CSS/JS，无框架，无构建工具，浏览器直接打开 `index.html`
- KaTeX CDN 渲染 LaTeX 数学公式
- 所有 AI 交互（计划生成、批改解析、薄弱分析）使用 mock 数据，暂不调用真实 API
- 数据存储在 localStorage

## 文件结构

```
study-ai/
├── index.html              # 入口页面
├── css/
│   └── style.css           # 暖色调主题（琥珀/暖橘色系，圆角卡片）
├── js/
│   ├── app.js              # 主控制器、路由、模块间通信
│   ├── plan.js             # 复习计划模块
│   ├── knowledge.js        # 知识图谱模块
│   ├── learn.js            # 知识点教学模块
│   ├── practice.js         # 习题练习模块
│   ├── exam.js             # 考试模拟模块
│   └── notebook.js         # 错题本 & 收藏模块
└── data/
    ├── plan-mock.js        # Mock AI 复习计划数据
    ├── topics.js           # 高数知识点数据（章节、概念、B站链接）
    └── questions.js        # 习题库（按章节/难度组织）
```

## 运行方式

```bash
# 开发：直接用浏览器打开 index.html
open index.html

# 或用简单 HTTP 服务器（避免跨域问题，可选）
python3 -m http.server 8080
```

无需安装依赖，无需构建步骤。

## 核心架构

**路由**：基于 hash 的单页路由，`app.js` 监听 `hashchange` 切换模块。

```
#dashboard   → 仪表盘主页
#plan        → 复习计划
#graph       → 知识图谱
#learn       → 知识点教学
#practice    → 习题练习
#exam        → 考试模拟
#notebook    → 错题本 & 收藏
```

**模块间通信**：自定义事件（`CustomEvent`），通过 `app.js` 的事件总线转发。

**Mock AI 行为**：`data/` 下的文件提供预置数据，各模块用 `setTimeout` 模拟 AI 响应延迟（300-800ms），展示"AI 正在生成..."的加载状态后返回结果。

## 视觉风格

- 暖色活力风：琥珀/暖橘色调（`#d97706`、`#fef3c7`、`#fffbeb`），参考多邻国
- 圆角卡片、大留白、清晰层级
- KaTeX 渲染数学公式

## 七大功能模块

1. **仪表盘** — 考试倒计时 + 复习进度条 + 四宫格导航入口
2. **复习计划** — 设置考试日期/当前水平/每日时长 → Mock AI 生成周计划时间线
3. **知识图谱** — 高数章节依赖图（函数极限→导数→积分→微分方程）
4. **知识点教学** — 概念讲解 + B站视频嵌入 + 典型例题 + 跳转刷题
5. **习题练习** — 按章节/难度筛选、选项点击、Mock AI 批改解析 + 公式展示
6. **考试模拟** — 限时倒计时、答题卡导航、交卷出分 + Mock AI 薄弱分析
7. **错题本 & 收藏** — 错题自动收录、手动收藏、按章节筛选、重做功能

## 后续对接真实 API

替换 `data/` 下的 mock 文件为真实 API 调用：
- 复习计划生成 → Claude API（prompt 传入考试日期、水平、时长，解析返回的 JSON 计划）
- 习题批改 → Claude API（传入题目和用户答案，返回正误判断和解析）
- 薄弱分析 → Claude API（传入错题历史，返回薄弱章节和建议）

API Key 在页面设置中由用户自行填入，存储在 localStorage，不经过任何服务端。
