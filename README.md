# 📐 高数AI复习助手

面向大学生的期末高数复习网站，纯前端实现，无需后端，浏览器打开即用。

## 功能

- **复习计划** — 设置考试日期、当前水平、每日时长，Mock AI 生成周计划
- **知识图谱** — 章节依赖关系图（函数极限 → 导数 → 积分 → 微分方程）
- **知识点教学** — 概念讲解 + B站视频链接 + 典型例题
- **习题练习** — 按章节/难度刷题，即时批改 + AI 解析
- **模拟考试** — 限时组卷、答题卡导航、交卷出分 + 薄弱分析
- **错题本** — 错题自动收录、收藏、重做

## 本地运行

```bash
# 直接双击打开（macOS）
open index.html

# 或启动本地服务器
python3 -m http.server 8080
# 浏览器访问 http://localhost:8080
```

无需安装任何依赖。

## 技术栈

- 原生 HTML/CSS/JS，无框架，无构建工具
- [KaTeX](https://katex.org) 渲染数学公式（已本地化，无需联网）
- localStorage 存储数据
- Mock AI 模拟交互（计划生成、批改、薄弱分析）

## 部署

项目已开启 GitHub Pages，公网地址：

👉 https://maguire2598.github.io/ai-study/

## 文件结构

```
├── index.html          # 入口
├── css/style.css       # 暖色调主题
├── js/
│   ├── app.js          # 主控制器、路由、KaTeX 渲染
│   ├── dashboard.js    # 仪表盘
│   ├── plan.js         # 复习计划
│   ├── knowledge.js    # 知识图谱
│   ├── learn.js        # 知识点教学
│   ├── practice.js     # 习题练习
│   ├── exam.js         # 模拟考试
│   └── notebook.js     # 错题本
├── data/
│   ├── topics.js       # 知识点数据
│   ├── questions.js    # 习题库
│   └── plan-mock.js    # Mock 计划数据
└── lib/katex/          # KaTeX 本地文件（含字体）
```

## 后续对接真实 AI

替换 `data/` 目录下的 mock 文件为真实 API 调用，例如使用 Claude API：

- 复习计划生成 → 传入考试日期、水平、时长，解析返回的 JSON
- 习题批改 → 传入题目和答案，返回正误判断和解析
- 薄弱分析 → 传入错题历史，返回薄弱章节

API Key 由用户在前端设置中自行填入，存储在 localStorage，不经过任何服务端。
