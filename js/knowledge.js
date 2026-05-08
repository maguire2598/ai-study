const KnowledgeGraph = {
  _safeJSON(raw, fallback) {
    if (!raw) return fallback;
    try { return JSON.parse(raw); } catch (e) { return fallback; }
  },

  render() {
    const planData = this._safeJSON(localStorage.getItem('studyPlan'), null);
    const doneChapters = new Set();
    if (planData && planData.weeks) {
      planData.weeks.filter(w => w.status === 'done').forEach(w => doneChapters.add(w.chapterId));
    }

    if (!Array.isArray(TOPICS)) return '<div class="empty-state"><div class="icon">🔍</div><p>知识数据加载失败</p></div>';

    const ordered = [...TOPICS].sort((a, b) => a.order - b.order);

    return `
      <div class="knowledge-page">
        <h2 style="font-size:20px;color:var(--amber-700);margin-bottom:16px;">🗺️ 高数知识图谱</h2>
        <p style="font-size:13px;color:var(--gray-600);margin-bottom:16px;">基于 Thomas' Calculus 教材体系。点击章节进入知识点学习。</p>

        <!-- 知识图谱大图 — 上册 -->
        <div class="card" style="padding:12px;overflow-x:auto;">
          <img src="assets/knowledge-graph.png" alt="高等数学知识图谱（上）"
               style="width:100%;max-width:100%;min-width:600px;display:block;cursor:zoom-in;"
               id="kg-main-img"
               title="点击放大">
          <div style="text-align:center;font-size:10px;color:var(--gray-400);margin-top:4px;">▲ 高等数学（上）知识体系 — 基于 Thomas' Calculus · 点击图片放大</div>
        </div>

        <!-- 知识图谱大图 — 下册（预览） -->
        <div class="card" style="padding:12px;overflow-x:auto;margin-top:12px;">
          <img src="assets/knowledge-graph-2.png" alt="高等数学知识图谱（下）"
               style="width:100%;max-width:100%;min-width:600px;display:block;cursor:zoom-in;"
               id="kg-main-img2"
               title="点击放大">
          <div style="text-align:center;font-size:10px;color:var(--gray-400);margin-top:4px;">▲ 高等数学（下）知识体系 · 点击图片放大</div>
        </div>

        <!-- 章节列表 -->
        <div style="margin-top:16px;">
          <h3 style="font-size:16px;color:var(--amber-700);margin-bottom:12px;">📋 章节导航</h3>
          ${ordered.map(topic => {
            const isDone = doneChapters.has(topic.id);
            const deps = (topic.dependsOn || []).map(depId => {
              const dep = TOPICS.find(t => t.id === depId);
              return dep ? dep.title : depId;
            });

            return `
              <a href="#learn&topic=${topic.id}" style="text-decoration:none;">
                <div class="card" style="display:flex;align-items:center;gap:12px;padding:14px 18px;cursor:pointer;transition:transform 0.15s;margin-bottom:8px;">
                  <span style="font-size:24px;">${topic.icon}</span>
                  <div style="flex:1;min-width:0;">
                    <div style="font-size:14px;font-weight:600;color:var(--gray-800);">${topic.title}</div>
                    <div style="font-size:11px;color:var(--gray-600);">${topic.concepts.length} 个核心概念${deps.length > 0 ? ' · 前置: ' + deps.join('、') : ''}</div>
                  </div>
                  ${isDone ? '<span class="tag tag-green">✓ 已掌握</span>' : '<span style="color:var(--amber-500);font-size:18px;">→</span>'}
                </div>
              </a>`;
          }).join('')}
        </div>
      </div>`;
  },

  init() {
    // 知识图谱图片点击放大
    ['kg-main-img', 'kg-main-img2'].forEach(id => {
      const img = document.getElementById(id);
      if (img) {
        img.addEventListener('click', () => {
          if (img.style.maxWidth === 'none') {
            img.style.maxWidth = '100%';
            img.style.cursor = 'zoom-in';
          } else {
            img.style.maxWidth = 'none';
            img.style.cursor = 'zoom-out';
          }
        });
      }
    });
  }
};
