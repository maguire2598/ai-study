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
    const firstUndoneIdx = ordered.findIndex(t => !doneChapters.has(t.id));

    return `
      <div class="knowledge-page">
        <h2 style="font-size:20px;color:var(--amber-700);margin-bottom:16px;">🗺️ 高数知识图谱</h2>
        <p style="font-size:13px;color:var(--gray-600);margin-bottom:16px;">点击章节节点进入知识点详细学习。箭头表示前置依赖关系。</p>

        <div id="graph-container" style="display:flex;flex-direction:column;align-items:center;gap:12px;padding:24px 0;">
          ${ordered.map((topic, i) => {
            const isDone = doneChapters.has(topic.id);
            const deps = (topic.dependsOn || []).map(depId => {
              const dep = TOPICS.find(t => t.id === depId);
              return dep ? dep.title : depId;
            });

            let statusColor, statusBg, statusLabel;
            if (isDone) {
              statusColor = 'var(--green-600)';
              statusBg = 'var(--green-50)';
              statusLabel = '✓ 已掌握';
            } else if (i === firstUndoneIdx) {
              statusColor = 'var(--amber-500)';
              statusBg = 'var(--amber-100)';
              statusLabel = '⏳ 建议学习';
            } else {
              statusColor = 'var(--gray-400)';
              statusBg = 'var(--gray-100)';
              statusLabel = '未开始';
            }

            return `
              <div style="display:flex;flex-direction:column;align-items:center;width:100%;max-width:500px;">
                ${i > 0 ? '<div style="font-size:16px;color:var(--amber-300);margin:2px 0;">↓</div>' : ''}
                ${deps.length > 0 ? `<div style="font-size:9px;color:var(--gray-400);margin-bottom:2px;">前置: ${deps.join('、')}</div>` : ''}
                <a href="#learn&topic=${topic.id}" class="graph-node-link" style="text-decoration:none;width:100%;" data-topic="${topic.id}">
                  <div style="display:flex;align-items:center;gap:12px;padding:14px 18px;background:${statusBg};border:2px solid ${statusColor};border-radius:12px;cursor:pointer;transition:transform 0.15s;width:100%;">
                    <span style="font-size:24px;">${topic.icon}</span>
                    <div style="flex:1;">
                      <div style="font-size:14px;font-weight:600;color:var(--gray-800);">${topic.title}</div>
                      <div style="font-size:11px;color:var(--gray-600);">${topic.concepts.length} 个核心概念</div>
                    </div>
                    <span class="tag" style="background:${statusBg};color:${statusColor};">${statusLabel}</span>
                  </div>
                </a>
              </div>`;
          }).join('')}
        </div>

        <div style="display:flex;gap:16px;justify-content:center;font-size:11px;color:var(--gray-600);margin-top:8px;">
          <span>🟢 已掌握</span><span>🟡 建议学习</span><span>⚪ 未开始</span>
        </div>
      </div>`;
  },

  init() {
    // 知识图谱为静态展示，无需额外初始化
  }
};
