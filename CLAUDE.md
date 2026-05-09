# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 项目概述

为大学生服务的高等数学考试复习网站（纯前端原型）。通过 AI 交互帮助学生制定复习计划、学习知识点、刷题练习、模拟考试。基于 Thomas' Calculus 第13版教材体系。

## 技术方案

- 原生 HTML/CSS/JS，无框架，无构建工具，浏览器直接打开 `index.html`
- KaTeX 本地文件渲染 LaTeX 数学公式（`lib/katex/`，无需 CDN）
- 百度千帆大模型 API（Ernie-Speed-8K，OpenAI 兼容接口）
- 数据存储在 localStorage

## 文件结构

```
study-ai/
├── index.html              # 入口页面
├── css/
│   └── style.css           # 暖色调主题（琥珀/暖橘色系，圆角卡片）+ AI 样式
├── js/
│   ├── app.js              # 主控制器、hash 路由、事件总线、askAI()、KaTeX 渲染
│   ├── ai.js               # AI 服务层，封装千帆 API 调用
│   ├── settings.js         # 设置面板模块（API Key / 模型选择）
│   ├── chat.js             # 浮动气泡 + 全局 AI 聊天面板
│   ├── plan.js             # 复习计划模块
│   ├── knowledge.js        # 知识图谱模块（展示教材思维导图）
│   ├── learn.js            # 知识点教学模块
│   ├── practice.js         # 习题练习模块（含"问 AI"按钮）
│   ├── exam.js             # 考试模拟模块（开始确认页 + AI 薄弱分析）
│   └── notebook.js         # 错题本 & 收藏模块
├── data/
│   ├── plan-mock.js        # 复习计划生成（9 章结构）
│   ├── topics.js           # 高数知识点（9 章，匹配 Thomas' Calculus）
│   └── questions.js        # 习题库（76 题，真题+习题册）
├── assets/
│   ├── knowledge-graph.png        # 高数（上）思维导图
│   └── knowledge-graph-2.png      # 高数（下）思维导图
└── materials/              # 原始教材 PDF、习题册、真题试卷
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

**路由**：基于 hash 的单页路由，`app.js` 监听 `hashchange` 切换模块。路由参数（如 `#learn&topic=limits`）通过拆分 `&` 提取基础路由。

```
#dashboard   → 仪表盘主页
#plan        → 复习计划
#graph       → 知识图谱
#learn       → 知识点教学（支持 topic 参数）
#practice    → 习题练习（支持 topic 参数）
#exam        → 考试模拟（开始页 → 答题 → 结果）
#notebook    → 错题本 & 收藏
```

**模块间通信**：自定义事件（`CustomEvent`），通过 `app.js` 的事件总线转发。

**AI 调用链路**：
```
practice.js / exam.js / chat.js
  → App.askAI(systemPrompt, userMessage)
    → AIService.chat(messages)
      → fetch(qianfanEndpoint, { model, messages })
      → 返回 AI 回复文本
  → 渲染到 DOM + App.renderMath() 渲染 KaTeX
```

## 视觉风格

- 暖色活力风：琥珀/暖橘色调（`#d97706`、`#fef3c7`、`#fffbeb`），参考多邻国
- 圆角卡片、大留白、清晰层级
- KaTeX 渲染数学公式

## 知识点结构（9 章）

1. 函数 → 2. 极限与连续 → 3. 导数 → 4. 导数的应用 → 5. 积分 → 6. 积分的应用 → 7. 超越函数 → 8. 积分技巧 → 9. 微分方程

## AI 功能（百度千帆 API）

已对接百度千帆大模型，提供三种 AI 功能：

1. **刷题 AI 求助** — 每道题下方有"🤖 问 AI"按钮，内联展开对话框，发送题目给 AI 获取逐步解析
2. **模考薄弱分析** — 交卷后将错题发给 AI，返回薄弱章节分析和复习建议
3. **自由提问** — 右下角浮动气泡，全局高数问答，支持多轮对话

### 技术细节

- 千帆 OpenAI 兼容接口: `https://qianfan.baidubce.com/v2/chat/completions`
- 默认模型: `ernie-speed-8k`（免费）
- 非流式调用，fetch 请求，30 秒超时
- API Key 存 localStorage，设置面板可更换

### AI 服务层

`js/ai.js` — 封装所有千帆 API 调用，通过 `App.askAI()` 供各模块使用
`js/settings.js` — 设置面板（API Key / 模型选择）
`js/chat.js` — 浮动气泡 + 全局聊天面板
