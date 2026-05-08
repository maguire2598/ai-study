# AI 功能集成实现计划

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 集成百度千帆 AI API，实现刷题求助、模考薄弱分析、浮动气泡自由提问三项 AI 功能

**Architecture:** 新增三个独立 JS 模块（ai.js 服务层、settings.js 设置面板、chat.js 浮动气泡），通过 App.askAI() 统一入口供 practice.js 和 exam.js 调用。千帆 API 兼容 OpenAI 格式，纯前端 fetch 调用，非流式。API Key 存 localStorage。

**Tech Stack:** 原生 JS，百度千帆大模型 API（ernie-speed-8k），KaTeX 公式渲染

---

### Task 1: 创建 AI 服务层 `js/ai.js`

**Files:**
- Create: `js/ai.js`

- [ ] **Step 1: 编写 AI 服务层完整代码**

```js
// AI 服务层 — 封装百度千帆 API 调用
const AIService = {
  _config: null,

  _loadConfig() {
    if (this._config) return this._config;
    const raw = localStorage.getItem('aiConfig');
    const defaults = {
      apiKey: 'bce-v3/ALTAK-whYKs6BmFUowQhIaH2Mv6/c11251e7f38193c1df52ef2d294ded4d72bf026e',
      model: 'ernie-speed-8k',
      baseURL: 'https://qianfan.baidubce.com/v2'
    };
    if (raw) {
      try { this._config = { ...defaults, ...JSON.parse(raw) }; } catch (e) { this._config = defaults; }
    } else {
      this._config = defaults;
    }
    return this._config;
  },

  getConfig() {
    return this._loadConfig();
  },

  setConfig(updates) {
    const config = this._loadConfig();
    Object.assign(config, updates);
    localStorage.setItem('aiConfig', JSON.stringify(config));
    this._config = config;
  },

  async chat(messages, options = {}) {
    const config = this._loadConfig();
    if (!config.apiKey) throw new Error('missing_key');

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), options.timeout || 30000);

    try {
      const res = await fetch(`${config.baseURL}/chat/completions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${config.apiKey}`
        },
        body: JSON.stringify({
          model: config.model,
          messages: messages,
          temperature: options.temperature || 0.7,
          max_tokens: options.maxTokens || 2048
        }),
        signal: controller.signal
      });

      clearTimeout(timeout);

      if (!res.ok) {
        const err = await res.text();
        throw new Error(`API error ${res.status}: ${err}`);
      }

      const data = await res.json();
      return data.choices[0].message.content;
    } catch (e) {
      clearTimeout(timeout);
      if (e.name === 'AbortError') throw new Error('timeout');
      throw e;
    }
  }
};
```

- [ ] **Step 2: 提交**

```bash
git add js/ai.js
git commit -m "feat: 添加 AI 服务层 (百度千帆 API)"
```

---

### Task 2: 创建设置面板 `js/settings.js`

**Files:**
- Create: `js/settings.js`

- [ ] **Step 1: 编写设置面板模块**

```js
// 设置面板模块
const Settings = {
  render() {
    const config = AIService.getConfig();
    return `
      <div class="settings-overlay" id="settings-overlay">
        <div class="settings-panel">
          <div class="settings-header">
            <h3>⚙️ 设置</h3>
            <button id="btn-settings-close" class="btn-icon">&times;</button>
          </div>
          <div class="settings-body">
            <label class="settings-label">🔑 API Key</label>
            <input type="password" id="settings-apikey" class="input" value="${this._escapeAttr(config.apiKey || '')}" placeholder="输入千帆 API Key">
            <label class="settings-label" style="margin-top:12px;">🧠 模型</label>
            <select id="settings-model" class="input">
              <option value="ernie-speed-8k" ${config.model === 'ernie-speed-8k' ? 'selected' : ''}>ERNIE-Speed-8K（免费）</option>
              <option value="ernie-speed-128k" ${config.model === 'ernie-speed-128k' ? 'selected' : ''}>ERNIE-Speed-128K</option>
              <option value="ernie-lite-8k" ${config.model === 'ernie-lite-8k' ? 'selected' : ''}>ERNIE-Lite-8K</option>
              <option value="ernie-4.0-turbo-128k" ${config.model === 'ernie-4.0-turbo-128k' ? 'selected' : ''}>ERNIE-4.0-Turbo-128K</option>
            </select>
            <button id="btn-settings-save" class="btn btn-primary" style="width:100%;margin-top:16px;">💾 保存设置</button>
            <p style="font-size:11px;color:var(--gray-400);margin-top:8px;text-align:center;">API Key 仅存储在浏览器本地，不会上传到任何服务端</p>
          </div>
        </div>
      </div>`;
  },

  _escapeAttr(str) {
    return str.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  },

  open() {
    const existing = document.getElementById('settings-overlay');
    if (existing) existing.remove();
    const div = document.createElement('div');
    div.innerHTML = this.render();
    document.body.appendChild(div.firstElementChild);
    this.init();
  },

  init() {
    document.getElementById('btn-settings-close')?.addEventListener('click', () => {
      document.getElementById('settings-overlay')?.remove();
    });

    document.getElementById('settings-overlay')?.addEventListener('click', (e) => {
      if (e.target.id === 'settings-overlay') {
        document.getElementById('settings-overlay')?.remove();
      }
    });

    document.getElementById('btn-settings-save')?.addEventListener('click', () => {
      const apiKey = document.getElementById('settings-apikey').value.trim();
      const model = document.getElementById('settings-model').value;
      AIService.setConfig({ apiKey, model });
      App.showToast('✅ 设置已保存');
      document.getElementById('settings-overlay')?.remove();
    });
  }
};
```

- [ ] **Step 2: 提交**

```bash
git add js/settings.js
git commit -m "feat: 添加设置面板模块"
```

---

### Task 3: 创建浮动气泡聊天 `js/chat.js`

**Files:**
- Create: `js/chat.js`

- [ ] **Step 1: 编写浮动气泡聊天模块**

```js
// 浮动气泡 + 全局 AI 聊天
const ChatBubble = {
  _messages: [],
  _visible: false,

  _getSystemPrompt() {
    return '你是一位高数辅导老师，帮学生解答高等数学相关问题。用清晰易懂的语言解释概念，使用 LaTeX 格式输出数学公式。';
  },

  render() {
    const visible = this._visible ? 'chat-panel--open' : '';
    const msgsHTML = this._messages.map(m => `
      <div class="chat-msg chat-msg--${m.role}">
        <div class="chat-msg-content">${m.role === 'assistant' ? this._formatContent(m.content) : this._escapeHtml(m.content)}</div>
      </div>
    `).join('');

    return `
      <div class="chat-bubble-container">
        ${this._visible ? `
        <div class="chat-panel ${visible}" id="chat-panel">
          <div class="chat-panel-header">
            <span>💬 AI 高数助手</span>
            <div>
              <button id="btn-chat-clear" class="btn-icon" title="清空对话">🗑️</button>
              <button id="btn-chat-minimize" class="btn-icon" title="最小化">−</button>
            </div>
          </div>
          <div class="chat-panel-body" id="chat-panel-body">
            ${this._messages.length === 0 ? '<div class="chat-empty">👋 有不懂的高数问题随时问我！</div>' : msgsHTML}
            <div id="chat-loading" class="chat-loading" style="display:none;">
              <span class="spinner" style="width:16px;height:16px;"></span> AI 思考中...
            </div>
          </div>
          <div class="chat-panel-footer">
            <input type="text" id="chat-input" class="chat-input" placeholder="输入你的高数问题..." autocomplete="off">
            <button id="btn-chat-send" class="btn btn-primary btn-sm">发送</button>
          </div>
        </div>
        ` : ''}
        <button id="btn-chat-toggle" class="chat-fab">💬</button>
      </div>`;
  },

  _escapeHtml(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  },

  _formatContent(text) {
    return text.replace(/\n/g, '<br>');
  },

  _scrollBottom() {
    const body = document.getElementById('chat-panel-body');
    if (body) body.scrollTop = body.scrollHeight;
  },

  _renderMessages() {
    const body = document.getElementById('chat-panel-body');
    if (!body) return;
    const loading = document.getElementById('chat-loading');
    body.innerHTML = this._messages.length === 0
      ? '<div class="chat-empty">👋 有不懂的高数问题随时问我！</div>'
      : this._messages.map(m => `
          <div class="chat-msg chat-msg--${m.role}">
            <div class="chat-msg-content">${m.role === 'assistant' ? this._formatContent(m.content) : this._escapeHtml(m.content)}</div>
          </div>
        `).join('');
    if (loading) body.appendChild(loading);
    this._scrollBottom();
    // 渲染新增的 KaTeX 公式
    body.querySelectorAll('.chat-msg--assistant .chat-msg-content').forEach(el => {
      // 在文本中查找 $...$ 包裹的公式并渲染
      const text = el.textContent;
      // 简单的 LaTeX 渲染处理：使用 KaTeX 重新渲染
    });
    if (typeof App !== 'undefined') App.renderMath(body);
  },

  init() {
    // 初始化时挂载到 body
    const existing = document.querySelector('.chat-bubble-container');
    if (existing) existing.remove();

    const div = document.createElement('div');
    div.innerHTML = this.render();
    document.body.appendChild(div.firstElementChild);
    this._bindEvents();
  },

  _bindEvents() {
    // 切换面板
    document.getElementById('btn-chat-toggle')?.addEventListener('click', () => {
      this._visible = !this._visible;
      this.init();
    });

    // 最小化
    document.getElementById('btn-chat-minimize')?.addEventListener('click', () => {
      this._visible = false;
      this.init();
    });

    // 清空对话
    document.getElementById('btn-chat-clear')?.addEventListener('click', () => {
      this._messages = [];
      this._renderMessages();
      App.showToast('🔄 对话已清空');
    });

    // 发送消息
    const sendMsg = async () => {
      const input = document.getElementById('chat-input');
      if (!input) return;
      const text = input.value.trim();
      if (!text) return;

      input.value = '';
      this._messages.push({ role: 'user', content: text });
      this._renderMessages();

      const loading = document.getElementById('chat-loading');
      if (loading) loading.style.display = 'block';
      const sendBtn = document.getElementById('btn-chat-send');
      if (sendBtn) sendBtn.disabled = true;

      try {
        const msgs = [
          { role: 'system', content: this._getSystemPrompt() },
          ...this._messages
        ];
        const reply = await AIService.chat(msgs);
        this._messages.push({ role: 'assistant', content: reply });
      } catch (e) {
        this._messages.push({ role: 'assistant', content: '❌ AI 暂时不可用，请稍后重试' });
      } finally {
        if (loading) loading.style.display = 'none';
        if (sendBtn) sendBtn.disabled = false;
        this._renderMessages();
      }
    };

    document.getElementById('btn-chat-send')?.addEventListener('click', sendMsg);
    document.getElementById('chat-input')?.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') sendMsg();
    });
  }
};
```

- [ ] **Step 2: 提交**

```bash
git add js/chat.js
git commit -m "feat: 添加浮动气泡 AI 聊天模块"
```

---

### Task 4: 更新 CSS 样式

**Files:**
- Modify: `css/style.css` (追加新样式)

- [ ] **Step 1: 在 style.css 末尾追加 AI 相关样式**

在 `css/style.css` 末尾追加以下内容:

```css
/* ===== AI 对话框样式 ===== */

/* 浮动气泡 */
.chat-fab {
  position: fixed;
  bottom: 24px;
  right: 24px;
  width: 56px;
  height: 56px;
  border-radius: 50%;
  background: var(--amber-500);
  color: #fff;
  border: none;
  font-size: 24px;
  cursor: pointer;
  box-shadow: 0 4px 16px rgba(217, 119, 6, 0.3);
  z-index: 999;
  transition: transform 0.2s, box-shadow 0.2s;
}
.chat-fab:hover { transform: scale(1.1); box-shadow: 0 6px 20px rgba(217, 119, 6, 0.4); }

/* 聊天面板 */
.chat-panel {
  position: fixed;
  bottom: 96px;
  right: 24px;
  width: 360px;
  height: 480px;
  background: #fff;
  border-radius: 16px;
  box-shadow: 0 8px 32px rgba(0,0,0,0.15);
  display: flex;
  flex-direction: column;
  z-index: 998;
  overflow: hidden;
}
.chat-panel--open { display: flex; }

.chat-panel-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;
  background: var(--amber-500);
  color: #fff;
  font-weight: 600;
  font-size: 14px;
}

.chat-panel-body {
  flex: 1;
  overflow-y: auto;
  padding: 12px;
  background: var(--amber-50);
}

.chat-panel-footer {
  display: flex;
  gap: 8px;
  padding: 10px 12px;
  border-top: 1px solid var(--amber-200);
  background: #fff;
}

.chat-input {
  flex: 1;
  border: 1px solid var(--amber-200);
  border-radius: 20px;
  padding: 8px 14px;
  font-size: 13px;
  outline: none;
}
.chat-input:focus { border-color: var(--amber-500); }

.chat-empty {
  text-align: center;
  color: var(--gray-400);
  padding: 40px 20px;
  font-size: 14px;
}

/* 聊天消息 */
.chat-msg {
  margin-bottom: 10px;
  display: flex;
}
.chat-msg--user { justify-content: flex-end; }
.chat-msg--assistant { justify-content: flex-start; }

.chat-msg-content {
  max-width: 85%;
  padding: 10px 14px;
  border-radius: 16px;
  font-size: 13px;
  line-height: 1.7;
  word-break: break-word;
}
.chat-msg--user .chat-msg-content {
  background: var(--amber-500);
  color: #fff;
  border-bottom-right-radius: 4px;
}
.chat-msg--assistant .chat-msg-content {
  background: #fff;
  color: var(--gray-800);
  border: 1px solid var(--amber-200);
  border-bottom-left-radius: 4px;
}

.chat-loading {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 12px;
  color: var(--gray-400);
  padding: 4px 0;
}

.btn-icon {
  background: none;
  border: none;
  color: inherit;
  font-size: 18px;
  cursor: pointer;
  padding: 2px 6px;
  border-radius: 4px;
}
.btn-icon:hover { background: rgba(255,255,255,0.2); }

/* 内联 AI 面板 */
.ai-help-panel {
  margin-top: 12px;
  border: 1px solid var(--amber-200);
  border-radius: 12px;
  overflow: hidden;
  background: var(--amber-50);
}
.ai-help-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 14px;
  background: var(--amber-100);
  font-size: 13px;
  font-weight: 600;
  color: var(--amber-700);
}
.ai-help-body {
  padding: 12px 14px;
  font-size: 13px;
  color: var(--gray-800);
  line-height: 1.8;
  max-height: 300px;
  overflow-y: auto;
}

/* 设置面板 */
.settings-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1001;
}
.settings-panel {
  background: #fff;
  border-radius: 16px;
  width: 400px;
  max-width: 90vw;
  max-height: 80vh;
  overflow-y: auto;
  box-shadow: 0 8px 32px rgba(0,0,0,0.2);
}
.settings-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 20px;
  border-bottom: 1px solid var(--amber-200);
}
.settings-header h3 { color: var(--amber-700); font-size: 16px; margin: 0; }
.settings-body { padding: 20px; }
.settings-label {
  display: block;
  font-size: 12px;
  font-weight: 600;
  color: var(--gray-600);
  margin-bottom: 4px;
}
```

- [ ] **Step 2: 提交**

```bash
git add css/style.css
git commit -m "style: 添加 AI 对话框、浮动气泡、设置面板样式"
```

---

### Task 5: 更新 `index.html` 引入新模块

**Files:**
- Modify: `index.html`

- [ ] **Step 1: 在导航栏和脚本区添加新内容**

在导航栏 `<div class="nav-links">` 最后（第 21 行 `</div>` 之前）追加设置按钮:

```
<a href="#" id="nav-settings" style="font-size:18px;padding:6px 10px;" title="设置">⚙️</a>
```

在 `</nav>` 之后、`<main>` 之前插入聊天气泡容器:

```
<div id="chat-bubble-root"></div>
```

在 `</body>` 之前（`<script src="js/app.js"></script>` 之前）插入新脚本引用:

```
<script src="js/ai.js"></script>
<script src="js/settings.js"></script>
<script src="js/chat.js"></script>
```

完整修改后的 `index.html`:

```html
<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>高数AI复习助手</title>
  <link rel="stylesheet" href="lib/katex/katex.min.css">
  <link rel="stylesheet" href="css/style.css">
</head>
<body>
  <div id="app">
    <nav id="navbar">
      <div class="nav-brand">📐 高数AI复习助手</div>
      <div class="nav-links">
        <a href="#dashboard">🏠 首页</a>
        <a href="#plan">📅 复习计划</a>
        <a href="#graph">🗺️ 知识图谱</a>
        <a href="#practice">✏️ 刷题</a>
        <a href="#exam">🎯 模考</a>
        <a href="#notebook">📒 错题本</a>
        <a href="#" id="nav-settings" style="font-size:18px;padding:6px 10px;" title="设置">⚙️</a>
      </div>
    </nav>
    <div id="chat-bubble-root"></div>
    <main id="main-content"></main>
  </div>

  <script src="lib/katex/katex.min.js"></script>
  <script src="lib/katex/auto-render.min.js"></script>
  <script src="data/topics.js"></script>
  <script src="data/questions.js"></script>
  <script src="data/plan-mock.js"></script>
  <script src="js/ai.js"></script>
  <script src="js/settings.js"></script>
  <script src="js/chat.js"></script>
  <script src="js/dashboard.js"></script>
  <script src="js/plan.js"></script>
  <script src="js/knowledge.js"></script>
  <script src="js/learn.js"></script>
  <script src="js/practice.js"></script>
  <script src="js/exam.js"></script>
  <script src="js/notebook.js"></script>
  <script src="js/app.js"></script>
</body>
</html>
```

- [ ] **Step 2: 提交**

```bash
git add index.html
git commit -m "feat: 引入 AI 模块、设置按钮、聊天气泡容器"
```

---

### Task 6: 更新 `js/app.js` — 新增 askAI 方法 + 初始化设置/聊天

**Files:**
- Modify: `js/app.js`

- [ ] **Step 1: 在 App 对象中新增 askAI 方法，更新 init 初始化新模块**

在 `renderMath` 方法之后、`};` 之前（第 96 行前）插入:

```js
  // 统一 AI 调用入口
  async askAI(systemPrompt, userMessage, options = {}) {
    const config = AIService.getConfig();
    if (!config.apiKey) {
      App.showToast('⚠️ 请先在设置中配置 API Key');
      throw new Error('missing_key');
    }
    const messages = [
      { role: 'system', content: systemPrompt },
      ...(options.history || []),
      { role: 'user', content: userMessage }
    ];
    return await AIService.chat(messages, options);
  },
```

在 `init()` 方法末尾（第 8 行 `window.addEventListener...` 之前）追加:

```js
    // 初始化浮动聊天气泡
    if (typeof ChatBubble !== 'undefined') ChatBubble.init();

    // 绑定设置按钮
    const settingsBtn = document.getElementById('nav-settings');
    if (settingsBtn && typeof Settings !== 'undefined') {
      settingsBtn.addEventListener('click', (e) => {
        e.preventDefault();
        Settings.open();
      });
    }
```

完整修改后的 `init()`:

```js
  init() {
    this.bindNavLinks();
    this.handleRoute();
    window.addEventListener('hashchange', () => this.handleRoute());

    // 初始化浮动聊天气泡
    if (typeof ChatBubble !== 'undefined') ChatBubble.init();

    // 绑定设置按钮
    const settingsBtn = document.getElementById('nav-settings');
    if (settingsBtn && typeof Settings !== 'undefined') {
      settingsBtn.addEventListener('click', (e) => {
        e.preventDefault();
        Settings.open();
      });
    }
  },
```

- [ ] **Step 2: 提交**

```bash
git add js/app.js
git commit -m "feat: app.js 新增 askAI 方法，初始化设置和聊天模块"
```

---

### Task 7: 更新 `js/practice.js` — 新增"问 AI"按钮

**Files:**
- Modify: `js/practice.js`

- [ ] **Step 1: 在 renderQuestion 中添加"问 AI"按钮，并在 _bindQuestion 中绑定事件**

在 `renderQuestion()` 的返回值中，收藏按钮之后（第 127 行 `</div>` 前）追加"问 AI"按钮和面板容器（放在 `</div>` 之前的那一行）:

在第 127 行 `</div>;` 之前插入:

```html
      <div style="margin-top:12px;text-align:right;">
        <button id="btn-ai-help" class="btn btn-sm btn-secondary" style="background:var(--amber-100);color:var(--amber-700);">
          🤖 问 AI
        </button>
      </div>
      <div id="ai-help-panel" style="display:none;"></div>
```

在 `_bindQuestion()` 方法末尾（第 283 行 `},` 之前，即收藏按钮绑定之后）追加 AI 帮助按钮的事件绑定:

```js
    // AI 求助按钮
    const aiHelpBtn = document.getElementById('btn-ai-help');
    if (aiHelpBtn) {
      aiHelpBtn.addEventListener('click', async () => {
        const q = this.filteredQuestions[this.currentIndex];
        if (!q) return;

        const panel = document.getElementById('ai-help-panel');
        if (!panel) return;

        panel.style.display = 'block';
        panel.innerHTML = `
          <div class="ai-help-panel">
            <div class="ai-help-header">
              <span>🤖 AI 解题助手</span>
              <button id="btn-ai-help-close" class="btn-icon" style="color:var(--amber-700);">✕</button>
            </div>
            <div class="ai-help-body">
              <div style="display:flex;align-items:center;gap:8px;color:var(--gray-400);">
                <span class="spinner" style="width:14px;height:14px;"></span> AI 思考中...
              </div>
            </div>
          </div>`;

        // 关闭按钮
        document.getElementById('btn-ai-help-close').addEventListener('click', () => {
          panel.style.display = 'none';
        });

        // 构造 prompt
        const topicTitle = TOPICS.find(t => t.id === q.topicId)?.title || '未知章节';
        const typeLabel = q.type === 'choice' ? '选择题' : '填空题';
        const optionsText = q.type === 'choice'
          ? q.options.map((o, i) => `${['A','B','C','D'][i]}. ${o}`).join('\n')
          : '';

        const systemPrompt = '你是一位高数辅导老师。学生正在做一道题，请帮他理解题目、给出逐步解题思路。使用 LaTeX 格式（用 $$ 包裹）输出数学公式。请不要直接给出最终答案，而是引导他思考。';
        const userMessage = `我在做一道${typeLabel}，来自章节"${topicTitle}"，题目如下：\n\n${q.stem}${optionsText ? '\n\n选项：\n' + optionsText : ''}\n\n请帮我分析这道题，告诉我应该怎么思考。`;

        try {
          const reply = await App.askAI(systemPrompt, userMessage);
          const body = document.querySelector('.ai-help-body');
          if (body) {
            body.innerHTML = reply.replace(/\n/g, '<br>');
            App.renderMath(body);
          }
        } catch (e) {
          const body = document.querySelector('.ai-help-body');
          if (body) body.innerHTML = `<span style="color:var(--red-500);">❌ AI 暂时不可用，请稍后重试</span>`;
        }
      });
    }
```

- [ ] **Step 2: 提交**

```bash
git add js/practice.js
git commit -m "feat: 刷题页新增 AI 求助按钮"
```

---

### Task 8: 更新 `js/exam.js` — AI 薄弱分析替换简单统计

**Files:**
- Modify: `js/exam.js`

- [ ] **Step 1: 修改 _renderResult 中的薄弱分析部分**

将 `_renderResult()` 中第 132-141 行的薄弱分析卡片替换为 AI 驱动的版本。找到以下代码:

```js
        <div class="card">
          <div class="card-header">🤖 AI 薄弱分析</div>
          ${weakestTopics.length > 0 ? `
            <div style="font-size:13px;color:var(--amber-700);margin-bottom:8px;">以下章节正确率低于 50%，建议重点复习：</div>
            ${weakestTopics.map(t => `<span class="tag tag-red" style="margin:4px;">⚠️ ${t}</span>`).join(' ')}
            <div style="margin-top:12px;">
              <a href="#practice" class="btn btn-primary" style="text-decoration:none;">✏️ 针对性刷题</a>
            </div>
          ` : '<div style="font-size:13px;color:var(--green-600);">✅ 各章节表现均衡，继续保持！</div>'}
        </div>
```

替换为:

```js
        <div class="card">
          <div class="card-header">🤖 AI 薄弱分析</div>
          <div id="exam-ai-analysis">
            <div style="display:flex;align-items:center;gap:8px;color:var(--gray-400);">
              <span class="spinner" style="width:14px;height:14px;"></span> AI 正在分析你的错题...
            </div>
          </div>
        </div>
```

然后在 `init()` 方法中，在结果页渲染逻辑里追加 AI 分析调用。找到第 254-256 行:

```js
      const resultEl = document.querySelector('.exam-result');
      if (resultEl) App.renderMath(resultEl);
      return;
```

在这三行之前插入:

```js
      // 触发 AI 薄弱分析
      this._requestAIAnalysis(details);
```

在 `Exam` 对象中添加 `_requestAIAnalysis` 方法（在 `_rerender` 方法之前，约第 337 行）:

```js
  async _requestAIAnalysis(details) {
    const wrongList = details.filter(d => !d.isCorrect);
    if (wrongList.length === 0) {
      const el = document.getElementById('exam-ai-analysis');
      if (el) el.innerHTML = '<div style="font-size:13px;color:var(--green-600);">✅ 全部正确，无需分析！继续保持！</div>';
      return;
    }

    const wrongText = wrongList.map((d, i) => {
      const topic = TOPICS.find(t => t.id === d.topicId);
      const answerLabel = d.type === 'choice' ? ['A','B','C','D'][d.answer] : d.answer;
      return `${i + 1}. [${topic ? topic.title : '未知'}] ${d.stem}\n   正确答案: ${answerLabel}`;
    }).join('\n\n');

    const systemPrompt = '你是一位高数教学评估专家。根据学生的模考错题，分析薄弱章节，给出具体复习建议。使用 LaTeX 格式（用 $$ 包裹）输出数学公式。回复简洁，分点列出：1) 薄弱章节 2) 每章改进建议 3) 推荐复习顺序。';
    const score = Math.round((details.filter(d => d.isCorrect).length / details.length) * 100);
    const userMessage = `学生完成了一次高数模考，得分 ${score} 分，共 ${details.length} 题，错 ${wrongList.length} 题。以下是错题详情：\n\n${wrongText}\n\n请分析学生的薄弱点并给出复习建议。`;

    try {
      const reply = await App.askAI(systemPrompt, userMessage);
      const el = document.getElementById('exam-ai-analysis');
      if (el) {
        el.innerHTML = reply.replace(/\n/g, '<br>');
        App.renderMath(el);
      }
    } catch (e) {
      const el = document.getElementById('exam-ai-analysis');
      if (el) el.innerHTML = '<div style="font-size:13px;color:var(--red-500);">❌ AI 分析暂时不可用<br><br>以下章节正确率低于 50%，建议重点复习：<br>' + weakestTopics.map(t => '⚠️ ' + t).join('<br>') + '</div>';
    }
  },
```

但是 `_requestAIAnalysis` 需要在 `details` 和 `weakestTopics` 已经计算完毕之后调用。需要调整 `_renderResult` 的逻辑。修改 `_renderResult` 开头，将 `details` 和 `weakestTopics` 的计算结果保存到实例变量，以便 `_requestAIAnalysis` 使用:

在 `_renderResult` 中，第 90-113 行保持不变，但在第 115-120 行之后追加:

```js
    // 保存供 AI 分析使用
    this._examDetails = details;
    this._weakestTopics = weakestTopics;
```

然后 `_requestAIAnalysis` 方法改为:

```js
  async _requestAIAnalysis() {
    const details = this._examDetails || [];
    const weakestTopics = this._weakestTopics || [];
    const wrongList = details.filter(d => !d.isCorrect);

    const el = document.getElementById('exam-ai-analysis');
    if (!el) return;

    if (wrongList.length === 0) {
      el.innerHTML = '<div style="font-size:13px;color:var(--green-600);">✅ 全部正确，无需分析！继续保持！</div>';
      return;
    }

    const wrongText = wrongList.map((d, i) => {
      const topic = TOPICS.find(t => t.id === d.topicId);
      const answerLabel = d.type === 'choice' ? ['A','B','C','D'][d.answer] : d.answer;
      return `${i + 1}. [${topic ? topic.title : '未知'}] ${d.stem}\n   正确答案: ${answerLabel}`;
    }).join('\n\n');

    const systemPrompt = '你是一位高数教学评估专家。根据学生的模考错题，分析薄弱章节，给出具体复习建议。使用 LaTeX 格式（用 $$ 包裹）输出数学公式。回复简洁，分点列出。';
    const score = Math.round((details.filter(d => d.isCorrect).length / details.length) * 100);
    const userMessage = `学生完成了一次高数模考，得分 ${score} 分，共 ${details.length} 题，错 ${wrongList.length} 题。以下是错题详情：\n\n${wrongText}\n\n请分析学生的薄弱点并给出复习建议。`;

    try {
      const reply = await App.askAI(systemPrompt, userMessage);
      el.innerHTML = reply.replace(/\n/g, '<br>');
      App.renderMath(el);
    } catch (e) {
      el.innerHTML = '<div style="font-size:13px;color:var(--red-500);">❌ AI 分析暂时不可用</div>';
      if (weakestTopics.length > 0) {
        el.innerHTML += '<div style="font-size:13px;color:var(--amber-700);margin-top:8px;">以下章节正确率低于 50%，建议重点复习：<br>' + weakestTopics.map(t => '⚠️ ' + t).join('<br>') + '</div>';
      }
    }
  },
```

在 init 中的调用改为:

```js
      // 触发 AI 薄弱分析
      this._requestAIAnalysis();
```

- [ ] **Step 2: 提交**

```bash
git add js/exam.js
git commit -m "feat: 模考交卷后 AI 薄弱分析"
```

---

### Task 9: 最终验证和提交

**Files:** 无

- [ ] **Step 1: 验证所有文件存在**

```bash
ls -la js/ai.js js/settings.js js/chat.js
```

- [ ] **Step 2: 打开页面手动测试**

```bash
open index.html
```

手动测试:
1. 点击 ⚙️ 设置按钮 → 确认 API Key 预填、模型可切换
2. 进入刷题页 → 点击"🤖 问 AI" → 确认展开面板、显示加载、获得回复
3. 进入模考 → 交卷 → 确认 AI 分析替换了原来的简单统计
4. 点击右下角 💬 气泡 → 输入问题 → 确认多轮对话正常

- [ ] **Step 3: 最终推送**

```bash
git add -A
git commit -m "feat: 完成百度千帆 AI 功能集成"
git push
```
