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
