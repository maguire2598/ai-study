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
