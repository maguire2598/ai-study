// 主控制器
const App = {
  currentModule: null,

  init() {
    this.bindNavLinks();
    this.handleRoute();
    window.addEventListener('hashchange', () => this.handleRoute());
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

  renderDashboard(main) { main.innerHTML = Dashboard.render(); Dashboard.init(); },
  renderPlan(main) { main.innerHTML = Plan.render(); Plan.init(); },
  renderGraph(main) { main.innerHTML = KnowledgeGraph.render(); KnowledgeGraph.init(); },
  renderLearn(main) { main.innerHTML = Learn.render(); Learn.init(); },
  renderPractice(main) { main.innerHTML = Practice.render(); Practice.init(); },
  renderExam(main) { main.innerHTML = Exam.render(); Exam.init(); },
  renderNotebook(main) { main.innerHTML = Notebook.render(); Notebook.init(); },

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

  // 渲染 KaTeX
  renderMath(el) {
    if (typeof renderMathInElement === 'function') {
      renderMathInElement(el, {
        delimiters: [
          { left: '\\[', right: '\\]', display: true },
          { left: '\\(', right: '\\)', display: false },
          { left: '$$', right: '$$', display: false },
          { left: '\\\\', right: '\\\\', display: false }
        ],
        throwOnError: false
      });
    }
  }
};

// 启动
document.addEventListener('DOMContentLoaded', () => App.init());
