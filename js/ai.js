// AI 服务层 — 封装 DeepSeek API 调用（OpenAI 兼容接口）
const AIService = {
  _config: null,

  _loadConfig() {
    if (this._config) return this._config;
    const raw = localStorage.getItem('aiConfig');
    const defaults = {
      apiKey: 'sk-bbbee91c19474924875e6ec41b461eb4',
      model: 'deepseek-chat',
      baseURL: 'https://api.deepseek.com/v1'
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
