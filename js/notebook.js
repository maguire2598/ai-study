const Notebook = {
  filter: 'all',

  _safeJSON(raw, fallback) {
    try { return JSON.parse(raw); } catch (e) { return fallback; }
  },

  _getFilter() {
    const hash = location.hash.slice(1);
    const idx = hash.indexOf('filter=');
    if (idx === -1) return 'all';
    const start = idx + 7;
    const end = hash.indexOf('&', start);
    return end === -1 ? hash.slice(start) : hash.slice(start, end);
  },

  render() {
    const filterParam = this._getFilter();
    this.filter = filterParam;

    const wrongBook = this._safeJSON(localStorage.getItem('wrongBook'), []);
    const favorites = this._safeJSON(localStorage.getItem('favorites'), []);

    let items = [];
    if (filterParam === 'fav') {
      items = favorites.map(fid => {
        const q = QUESTIONS.find(qq => qq.id === fid);
        const wb = wrongBook.find(w => w.questionId === fid);
        return { question: q, wrongCount: wb ? wb.count : 0, date: wb ? wb.date : null, isFav: true };
      }).filter(item => item.question);
    } else {
      items = wrongBook.map(w => ({
        question: QUESTIONS.find(q => q.id === w.questionId),
        wrongCount: w.count,
        date: w.date,
        isFav: favorites.includes(w.questionId)
      })).filter(item => item.question);

      if (filterParam !== 'all') {
        items = items.filter(item => item.question.topicId === filterParam);
      }
    }

    items.sort((a, b) => new Date(b.date || 0) - new Date(a.date || 0));

    return `
      <div class="notebook-page">
        <h2 style="font-size:20px;color:var(--amber-700);margin-bottom:16px;">📒 错题本 & ⭐ 收藏</h2>

        <div style="display:flex;gap:6px;flex-wrap:wrap;margin-bottom:16px;">
          <a href="#notebook" class="tag ${filterParam === 'all' ? 'tag-amber' : 'tag-gray'}" style="text-decoration:none;cursor:pointer;">全部错题</a>
          ${TOPICS.map(t => `
            <a href="#notebook&filter=${t.id}" class="tag ${filterParam === t.id ? 'tag-amber' : 'tag-gray'}" style="text-decoration:none;cursor:pointer;">${t.title}</a>
          `).join('')}
          <a href="#notebook&filter=fav" class="tag ${filterParam === 'fav' ? 'tag-amber' : 'tag-gray'}" style="text-decoration:none;cursor:pointer;">⭐ 收藏</a>
        </div>

        ${items.length === 0 ? `
          <div class="empty-state">
            <div class="icon">${filterParam === 'fav' ? '⭐' : '📭'}</div>
            <p style="font-size:13px;color:var(--gray-600);">${filterParam === 'fav' ? '暂无收藏题目' : '暂无错题，继续保持！'}</p>
          </div>`
        : `
          <div style="display:flex;flex-direction:column;gap:8px;">
            ${items.map(item => {
              const q = item.question;
              const topic = TOPICS.find(t => t.id === q.topicId);
              const typeLabel = q.type === 'choice' ? '选择题' : '填空题';
              return `
                <div class="card" style="padding:14px;">
                  <div style="display:flex;align-items:flex-start;gap:10px;">
                    <button class="btn-fav-toggle" data-qid="${q.id}" style="background:none;border:none;font-size:18px;cursor:pointer;flex-shrink:0;">${item.isFav ? '⭐' : '☆'}</button>
                    <div style="flex:1;min-width:0;">
                      <div style="display:flex;gap:6px;margin-bottom:6px;">
                        <span class="tag tag-gray">${typeLabel}</span>
                        <span class="tag tag-amber">${topic ? topic.title : ''}</span>
                        ${item.wrongCount > 0 ? `<span class="tag tag-red">做错 ${item.wrongCount} 次</span>` : ''}
                      </div>
                      <div style="font-size:13px;color:var(--gray-800);margin-bottom:4px;" class="math-content">${q.stem}</div>
                      <div style="font-size:10px;color:var(--gray-400);">${item.date ? new Date(item.date).toLocaleDateString('zh-CN') : ''}</div>
                    </div>
                    <a href="#practice&topic=${q.topicId}" class="btn btn-sm btn-primary" style="text-decoration:none;flex-shrink:0;">重做</a>
                  </div>
                </div>`;
            }).join('')}
          </div>`}

        <div style="margin-top:16px;text-align:center;font-size:11px;color:var(--gray-600);">
          💡 做错的题目自动收录 · 点击 ☆ 收藏重点题
        </div>
      </div>`;
  },

  init() {
    const container = document.querySelector('.notebook-page');
    if (container) App.renderMath(container);

    document.querySelectorAll('.btn-fav-toggle').forEach(btn => {
      btn.onclick = () => {
        const qid = btn.dataset.qid;
        let favs = this._safeJSON(localStorage.getItem('favorites'), []);
        if (favs.includes(qid)) {
          favs = favs.filter(id => id !== qid);
          btn.textContent = '☆';
          App.showToast('已取消收藏');
        } else {
          favs.push(qid);
          btn.textContent = '⭐';
          App.showToast('⭐ 已加入收藏');
        }
        localStorage.setItem('favorites', JSON.stringify(favs));
      };
    });
  }
};
