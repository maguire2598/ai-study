// 主控制器
const App = {
  _bus: null,

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

  bindNavLinks() {
    document.querySelectorAll('.nav-links a').forEach(link => {
      link.addEventListener('click', () => {
        this.setActiveNav(link);
      });
    });
  },

  setActiveNav(activeLink) {
    document.querySelectorAll('.nav-links a').forEach(a => a.classList.remove('active'));
    if (activeLink) activeLink.classList.add('active');
  },

  // 事件总线
  emit(eventName, detail) {
    if (!this._bus) this._bus = document.createElement('div');
    this._bus.dispatchEvent(new CustomEvent(eventName, { detail }));
  },

  on(eventName, handler) {
    if (!this._bus) this._bus = document.createElement('div');
    this._bus.addEventListener(eventName, handler);
  },

  handleRoute() {
    const hash = location.hash.slice(1) || 'dashboard';
    const main = document.getElementById('main-content');
    if (!main) return;

    // 高亮导航
    const navLink = document.querySelector(`.nav-links a[href="#${hash}"]`);
    this.setActiveNav(navLink);

    // 根据路由渲染对应模块
    switch (hash) {
      case 'dashboard': this.renderDashboard(main); break;
      case 'plan': this.renderPlan(main); break;
      case 'graph': this.renderGraph(main); break;
      case 'learn': this.renderLearn(main); break;
      case 'practice': this.renderPractice(main); break;
      case 'exam': this.renderExam(main); break;
      case 'notebook': this.renderNotebook(main); break;
      default: this.renderDashboard(main);
    }
  },

  renderDashboard(main) { if (typeof Dashboard !== 'undefined') { main.innerHTML = Dashboard.render(); Dashboard.init(); } },
  renderPlan(main) { if (typeof Plan !== 'undefined') { main.innerHTML = Plan.render(); Plan.init(); } },
  renderGraph(main) { if (typeof KnowledgeGraph !== 'undefined') { main.innerHTML = KnowledgeGraph.render(); KnowledgeGraph.init(); } },
  renderLearn(main) { if (typeof Learn !== 'undefined') { main.innerHTML = Learn.render(); Learn.init(); } },
  renderPractice(main) { if (typeof Practice !== 'undefined') { main.innerHTML = Practice.render(); Practice.init(); } },
  renderExam(main) { if (typeof Exam !== 'undefined') { main.innerHTML = Exam.render(); Exam.init(); } },
  renderNotebook(main) { if (typeof Notebook !== 'undefined') { main.innerHTML = Notebook.render(); Notebook.init(); } },

  // Toast 提示
  showToast(msg) {
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.textContent = msg;
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 2500);
  },

  // 模拟 AI 延迟
  async mockAI(callback, delay = 600) {
    return new Promise(resolve => {
      setTimeout(() => resolve(callback()), delay);
    });
  },

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

  // 渲染 KaTeX 数学公式（直接渲染 .math-content 内的 LaTeX 代码）
  renderMath(el) {
    if (typeof katex === 'undefined') return;
    el.querySelectorAll('.math-content').forEach(span => {
      const latex = span.textContent.trim();
      if (!latex) return;
      try {
        katex.render(latex, span, {
          throwOnError: false,
          displayMode: span.classList.contains('math-block')
        });
      } catch (e) {
        // 渲染失败时保留原文
      }
    });
  }
};

// 启动
document.addEventListener('DOMContentLoaded', () => App.init());
