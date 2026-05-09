# 📐 高数AI复习助手

面向大学生的期末高数复习网站，纯前端实现，无需后端，浏览器打开即用。基于 Thomas' Calculus 第13版教材体系。

## 功能

- **复习计划** — 设置考试日期、当前水平、每日时长，AI 生成周计划时间线
- **知识图谱** — 两张教材思维导图 + 9 个章节导航（函数 → 极限 → 导数 → 积分 → 微分方程）
- **知识点教学** — 概念讲解 + B站视频链接 + 典型例题
- **习题练习** — 按章节/难度筛选，76 道真题 + 习题册题目，即时批改 + AI 解析
- **模拟考试** — 开始确认页 → 限时组卷（20题/90分钟）→ 答题卡导航 → 交卷出分 + AI 薄弱分析
- **错题本** — 错题自动收录、收藏、按章节筛选、重做
- **🤖 AI 求助** — 刷题时每题可点击"问 AI"，获取逐步解题思路
- **💬 AI 聊天** — 右下角浮动气泡，自由提问高数问题，支持多轮对话
- **⚙️ 设置面板** — 可更换 API Key / 模型，数据仅存本地

## AI 功能

项目已对接**百度千帆大模型 API**（OpenAI 兼容接口），提供三种 AI 交互：

| 功能 | 入口 | 说明 |
|------|------|------|
| 刷题 AI 求助 | 习题练习页"🤖 问 AI"按钮 | AI 收到题目全文 + 章节上下文，返回逐步解析思路 |
| 模考薄弱分析 | 交卷后自动触发 | AI 分析错题分布，输出薄弱章节排名 + 复习建议 |
| 自由提问 | 右下角 💬 浮动气泡 | 多轮对话，解答任何高数问题 |

### 技术细节

- API 地址：`https://qianfan.baidubce.com/v2/chat/completions`
- 默认模型：`ernie-speed-8k`（免费，RPM=300，TPM=300K）
- 非流式调用，fetch 请求，30 秒超时
- API Key 预填默认值，可在设置面板更换
- 数据仅存储在浏览器 localStorage，不上传任何服务端

## 本地运行

无需安装任何依赖。

### macOS

```bash
# 直接双击打开
open index.html

# 或启动本地服务器（支持局域网其他设备访问）
python3 -m http.server 8080
# 浏览器访问 http://localhost:8080
```

### Windows

```bash
# 直接双击 index.html 即可在默认浏览器打开

# 或启动本地服务器
python -m http.server 8080
# 浏览器访问 http://localhost:8080
```

### Android

推荐使用 HTTP 服务器 App，例如：

1. 安装 [HTTP Server](https://play.google.com/store/apps/details?id=com.icecoldapps.httpserver) 或 [Simple HTTP Server](https://play.google.com/store/apps/details?id=com.phlox.simpleserver)
2. 下载项目 ZIP 解压到手机存储
3. 在 App 中设置根目录指向解压后的文件夹，启动服务器
4. 浏览器访问 `http://localhost:8080`（或 App 显示的地址）

## 技术栈

- 原生 HTML/CSS/JS，无框架，无构建工具
- [KaTeX](https://katex.org) 渲染数学公式（已本地化，无需联网）
- 百度千帆大模型 API（ernie-speed-8k）
- localStorage 存储数据
- 基于 hash 的单页路由

## 部署

项目已开启 GitHub Pages，公网地址：

👉 https://maguire2598.github.io/ai-study/

## 数据来源

- 教材：Thomas' Calculus 13th Edition + GPA3.94高等数学笔记
- 习题：Thomas' Calculus Workbook + 2022/2024 期末真题
- 知识图谱：教材思维导图提取

## 文件结构

```
├── index.html              # 入口
├── css/style.css           # 暖色调主题 + AI 相关样式
├── js/
│   ├── app.js              # 主控制器、路由、KaTeX 渲染、askAI()
│   ├── ai.js               # AI 服务层（百度千帆 API 封装）
│   ├── settings.js         # 设置面板（API Key / 模型管理）
│   ├── chat.js             # 浮动气泡 + 全局 AI 聊天
│   ├── dashboard.js        # 仪表盘
│   ├── plan.js             # 复习计划
│   ├── knowledge.js        # 知识图谱
│   ├── learn.js            # 知识点教学
│   ├── practice.js         # 习题练习
│   ├── exam.js             # 模拟考试
│   └── notebook.js         # 错题本 & 收藏
├── data/
│   ├── topics.js           # 9 章知识点数据
│   ├── questions.js        # 76 道习题库
│   └── plan-mock.js        # 复习计划生成
├── assets/
│   ├── knowledge-graph.png          # 高数（上）思维导图
│   └── knowledge-graph-2.png        # 高数（下）思维导图
└── lib/katex/              # KaTeX 本地文件（含字体）
```
