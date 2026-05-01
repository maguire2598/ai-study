const Learn = {
  currentTopic: null,

  render() {
    const hash = location.hash.slice(1);
    const params = new URLSearchParams(hash.includes('&') ? hash.split('&').slice(1).join('&') : '');
    const topicId = params.get('topic') || 'limit';

    const topic = TOPICS.find(t => t.id === topicId);
    if (!topic) {
      return `<div class="empty-state"><div class="icon">🔍</div><p>知识点未找到</p></div>`;
    }

    this.currentTopic = topic;

    const questionCount = QUESTIONS.filter(q => q.topicId === topic.id).length;

    return `
      <div class="learn-page">
        <div style="display:flex;align-items:center;gap:12px;margin-bottom:16px;">
          <a href="#graph" style="text-decoration:none;color:var(--amber-500);font-size:20px;">←</a>
          <h2 style="font-size:20px;color:var(--amber-700);">📖 ${topic.title}</h2>
        </div>

        <!-- 视频区 -->
        <div class="card">
          <div class="card-header">🎬 视频讲解</div>
          <div style="background:var(--amber-100);border-radius:10px;padding:14px;display:flex;align-items:center;gap:12px;">
            <div style="width:52px;height:40px;background:var(--amber-500);border-radius:8px;display:flex;align-items:center;justify-content:center;color:#fff;font-size:20px;flex-shrink:0;">▶</div>
            <div style="flex:1;min-width:0;">
              <div style="font-size:13px;font-weight:600;color:var(--amber-700);">${topic.bilibili.teacher} · ${topic.bilibili.title}</div>
              <div style="font-size:11px;color:var(--gray-600);">${topic.bilibili.duration}</div>
            </div>
            <a href="${topic.bilibili.url}" target="_blank" rel="noopener" class="btn btn-sm btn-primary" style="text-decoration:none;flex-shrink:0;">去观看 →</a>
          </div>
        </div>

        <!-- 核心概念 -->
        <div class="card">
          <div class="card-header">📝 核心概念</div>
          <div style="display:flex;flex-wrap:wrap;gap:6px;">
            ${topic.concepts.map(c => `<span class="tag tag-amber">${c}</span>`).join('')}
          </div>
        </div>

        <!-- 典型例题 -->
        <div class="card">
          <div class="card-header">💡 典型例题</div>
          <div id="learn-examples">
            ${QUESTIONS.filter(q => q.topicId === topic.id && q.difficulty <= 2).slice(0, 3).map(q => `
              <div style="margin-bottom:14px;padding-bottom:14px;border-bottom:1px solid var(--amber-100);">
                <div style="display:flex;gap:8px;margin-bottom:6px;">
                  <span class="tag tag-gray">${q.type === 'choice' ? '选择题' : '填空题'}</span>
                  <span class="tag tag-amber">${'★'.repeat(q.difficulty)}${'☆'.repeat(5-q.difficulty)}</span>
                </div>
                <div style="font-size:13px;color:var(--gray-800);margin-bottom:8px;" class="math-content">${q.stem}</div>
                <details style="cursor:pointer;">
                  <summary style="font-size:12px;color:var(--amber-500);font-weight:600;">查看解析</summary>
                  <div style="margin-top:8px;padding:10px;background:var(--amber-50);border-radius:8px;font-size:12px;color:var(--amber-700);" class="math-content">${q.analysis}</div>
                </details>
              </div>
            `).join('')}
          </div>
        </div>

        <!-- 操作按钮 -->
        <div style="display:flex;gap:12px;">
          <a href="#practice&topic=${topic.id}" class="btn btn-primary" style="flex:1;text-decoration:none;text-align:center;">
            ✏️ 刷本章习题（${questionCount}题）
          </a>
          <button id="btn-next-topic" class="btn btn-secondary" style="flex:1;">
            下一章 →
          </button>
        </div>
      </div>`;
  },

  init() {
    if (this.currentTopic) {
      const container = document.querySelector('.learn-page');
      if (container) App.renderMath(container);
    }

    const nextBtn = document.getElementById('btn-next-topic');
    if (nextBtn && this.currentTopic) {
      const nextOrder = this.currentTopic.order + 1;
      const nextTopic = TOPICS.find(t => t.order === nextOrder);
      if (nextTopic) {
        nextBtn.textContent = `下一章：${nextTopic.title} →`;
        nextBtn.addEventListener('click', () => {
          location.hash = `#learn&topic=${nextTopic.id}`;
        });
      } else {
        nextBtn.textContent = '已是最后一章';
        nextBtn.disabled = true;
      }
    }
  }
};
