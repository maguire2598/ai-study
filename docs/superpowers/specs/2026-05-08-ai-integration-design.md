# AI 功能集成设计文档

## 概述

将现有 Mock AI 替换为百度千帆大模型 API，并为学生提供实时 AI 帮助功能。

## 技术方案

- **API**: 百度千帆 OpenAI 兼容接口
  - Base URL: `https://qianfan.baidubce.com/v2`
  - 认证: API Key 通过 `Authorization: Bearer <key>` Header 传入
  - 默认模型: `ernie-speed-8k`（免费，RPM=300, TPM=300K）
- **调用方式**: 纯前端 fetch，非流式
- **API Key 管理**: localStorage 存储，设置面板可更换

## 新增文件

| 文件 | 职责 |
|------|------|
| `js/ai.js` | AI 服务层，封装千帆 API 调用，提供统一接口 |
| `js/settings.js` | 设置面板模块，API Key / 模型管理 |
| `js/chat.js` | 浮动气泡 + 全局聊天面板 |

## 修改文件

| 文件 | 变更 |
|------|------|
| `index.html` | 引入新 JS 文件，导航栏加设置入口 |
| `css/style.css` | 新增 AI 对话框、浮动气泡、设置面板样式 |
| `js/app.js` | 新增 `askAI()` 方法、渲染 AI 回复中的 KaTeX |
| `js/practice.js` | 每道题下方新增"问 AI"按钮 + 内联对话面板 |
| `js/exam.js` | 交卷后调用 AI 薄弱分析替换当前简单统计 |

## 功能设计

### 功能 2: 刷题 AI 求助

- 每道题选项下方新增"🤖 问 AI"按钮
- 点击后内联展开对话框，发送题目全文 + 章节上下文
- AI 返回: 逐步解析、涉及知识点、类似思路提示
- 回复中的 LaTeX 公式通过 KaTeX 渲染

### 功能 3: 模考薄弱分析

- 交卷后收集错题列表（题干 + 正确答案 + 所属章节 + 用户答案）
- 发送给 AI，请求: 薄弱章节排名、具体改进建议、推荐复习顺序
- 替换现有的简单正确率统计

### 功能 4: 自由提问（浮动气泡）

- 全局右下角固定 💬 气泡按钮
- 点击弹出聊天面板（300x400px，可最小化）
- 支持多轮对话（当前会话内，存内存）
- 学生可自由输入高数相关问题

### 设置面板

- 导航栏右侧 ⚙️ 图标入口
- API Key 输入框（预填默认值）
- 模型下拉选择
- 数据存 localStorage

## 数据流

```
practice.js / exam.js / chat.js
  → App.askAI(systemPrompt, userMessage)
    → AIService.chat(messages)
      → fetch(qianfanEndpoint, { model, messages })
      → 显示加载状态
      → 返回 AI 回复文本
  → 渲染回复到 DOM
  → App.renderMath() 渲染其中 KaTeX
```

## AI Service 接口 (`js/ai.js`)

```js
const AIService = {
  // 发送聊天请求
  async chat(messages, options = {}): string

  // 获取 API 配置
  getConfig(): { apiKey, model, baseURL }

  // 更新 API 配置
  setConfig({ apiKey, model }): void
}
```

## 系统提示词设计

- 刷题求助: "你是一位高数辅导老师。学生正在做一道题，请帮他理解题目、给出逐步解题思路，但不要直接给答案。如果学生已经提交了答案，请分析他的答案是否正确、错在哪里。使用 LaTeX 格式输出数学公式。"
- 模考分析: "你是一位高数教学评估专家。根据学生的模考错题分布，分析薄弱章节，给出具体复习建议。"
- 自由提问: "你是一位高数辅导老师，帮学生解答高等数学相关问题。用清晰易懂的语言解释概念，使用 LaTeX 格式输出数学公式。"

## 错误处理

- API 调用失败：显示错误提示"AI 暂时不可用，请稍后重试"
- API Key 未配置：提示用户前往设置面板配置 Key
- 网络超时: 30 秒超时，显示超时提示
