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
    if (typeof App !== 'undefined') App.renderMath(body);
  },

  init() {
    const existing = document.querySelector('.chat-bubble-container');
    if (existing) existing.remove();

    const div = document.createElement('div');
    div.innerHTML = this.render();
    document.body.appendChild(div.firstElementChild);
    this._bindEvents();
  },

  _bindEvents() {
    document.getElementById('btn-chat-toggle')?.addEventListener('click', () => {
      this._visible = !this._visible;
      this.init();
    });

    document.getElementById('btn-chat-minimize')?.addEventListener('click', () => {
      this._visible = false;
      this.init();
    });

    document.getElementById('btn-chat-clear')?.addEventListener('click', () => {
      this._messages = [];
      this._renderMessages();
      App.showToast('🔄 对话已清空');
    });

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
