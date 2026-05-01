const Practice = {
  currentTopic: 'all',
  currentIndex: 0,
  currentDifficulty: 'all',
  filteredQuestions: [],

  _safeJSON(raw, fallback) {
    if (!raw) return fallback;
    try { return JSON.parse(raw); } catch (e) { return fallback; }
  },

  _getTopicId() {
    const hash = location.hash.slice(1);
    const idx = hash.indexOf('topic=');
    if (idx === -1) return 'all';
    const start = idx + 6;
    const end = hash.indexOf('&', start);
    return end === -1 ? hash.slice(start) : hash.slice(start, end);
  },

  _applyFilters() {
    const topicParam = this.currentTopic;
    let questions = topicParam === 'all'
      ? [...QUESTIONS]
      : QUESTIONS.filter(q => q.topicId === topicParam);
    if (this.currentDifficulty !== 'all') {
      questions = questions.filter(q => q.difficulty === parseInt(this.currentDifficulty));
    }
    this.filteredQuestions = questions;
    this.currentIndex = 0;
  },

  _refreshQuestion() {
    const area = document.getElementById('practice-question-area');
    if (area) area.innerHTML = this.renderQuestion();
    const fb = document.getElementById('practice-feedback');
    if (fb) fb.innerHTML = '';
    this._bindQuestion();
    const container = document.querySelector('.practice-page');
    if (container) App.renderMath(container);
  },

  render() {
    const topicParam = this._getTopicId();
    this.currentTopic = topicParam;
    this.currentDifficulty = 'all';
    this._applyFilters();

    const topic = TOPICS.find(t => t.id === topicParam);

    return `
      <div class="practice-page">
        <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:16px;flex-wrap:wrap;gap:12px;">
          <h2 style="font-size:20px;color:var(--amber-700);">✏️ 习题练习${topic ? ' · ' + topic.title : ''}</h2>
          <div style="display:flex;gap:8px;flex-wrap:wrap;">
            <select id="practice-topic-filter" class="input" style="width:auto;min-width:120px;">
              <option value="all">全部章节</option>
              ${TOPICS.map(t => `<option value="${t.id}" ${topicParam === t.id ? 'selected' : ''}>${t.title}</option>`).join('')}
            </select>
            <select id="practice-difficulty-filter" class="input" style="width:auto;min-width:100px;">
              <option value="all">全部难度</option>
              <option value="1">★ 简单</option>
              <option value="2">★★ 中等</option>
              <option value="3">★★★ 困难</option>
            </select>
          </div>
        </div>

        <div id="practice-question-area">
          ${this.renderQuestion()}
        </div>

        <div id="practice-feedback" style="margin-top:12px;"></div>
      </div>`;
  },

  renderQuestion() {
    if (this.filteredQuestions.length === 0) {
      return `<div class="empty-state"><div class="icon">📭</div><p>该筛选条件下暂无习题</p></div>`;
    }

    const q = this.filteredQuestions[this.currentIndex];
    if (!q) return '';

    const topic = TOPICS.find(t => t.id === q.topicId);
    const typeLabel = q.type === 'choice' ? '选择题' : '填空题';
    const stars = '★'.repeat(q.difficulty) + '☆'.repeat(5 - q.difficulty);

    let answerHTML = '';
    if (q.type === 'choice') {
      const labels = ['A', 'B', 'C', 'D'];
      answerHTML = q.options.map((opt, i) => `
        <div class="practice-option" data-index="${i}" style="padding:12px 16px;background:#fff;border:2px solid var(--amber-200);border-radius:10px;cursor:pointer;font-size:13px;color:var(--gray-800);transition:all 0.15s;margin-bottom:8px;">
          <span style="font-weight:600;color:var(--amber-500);margin-right:8px;">${labels[i]}</span>
          <span class="math-content">${opt}</span>
        </div>
      `).join('');
    } else {
      answerHTML = `
        <div style="display:flex;gap:8px;align-items:center;">
          <input type="text" id="fill-answer" class="input" placeholder="输入你的答案" style="flex:1;">
          <button id="btn-submit-fill" class="btn btn-primary">提交</button>
        </div>`;
    }

    return `
      <div class="card">
        <div style="display:flex;gap:8px;margin-bottom:10px;">
          <span class="tag tag-gray">${typeLabel}</span>
          <span class="tag tag-amber">${stars}</span>
          <span class="tag tag-gray">${topic ? topic.title : ''}</span>
        </div>
        <div style="font-size:14px;color:var(--gray-800);line-height:1.8;margin-bottom:16px;" class="math-content">${q.stem}</div>
        <div id="practice-options">${answerHTML}</div>
      </div>

      <div style="display:flex;justify-content:space-between;margin-top:12px;">
        <button id="btn-prev-question" class="btn btn-secondary" ${this.currentIndex === 0 ? 'disabled' : ''}>← 上一题</button>
        <span style="font-size:13px;color:var(--gray-600);line-height:2.2;">${this.currentIndex + 1} / ${this.filteredQuestions.length}</span>
        <button id="btn-next-question" class="btn btn-secondary" ${this.currentIndex >= this.filteredQuestions.length - 1 ? 'disabled' : ''}>下一题 →</button>
      </div>

      <div style="margin-top:12px;text-align:right;">
        <button id="btn-favorite-current" class="btn btn-sm btn-secondary">
          ${this.isFavorited(q.id) ? '⭐ 已收藏' : '☆ 收藏此题'}
        </button>
      </div>`;
  },

  isFavorited(qid) {
    const favs = this._safeJSON(localStorage.getItem('favorites'), []);
    return favs.includes(qid);
  },

  init() {
    // 筛选器 — 持久绑定，只绑一次
    const topicFilter = document.getElementById('practice-topic-filter');
    if (topicFilter) {
      topicFilter.onchange = (e) => {
        location.hash = e.target.value === 'all' ? '#practice' : `#practice&topic=${e.target.value}`;
      };
    }

    const diffFilter = document.getElementById('practice-difficulty-filter');
    if (diffFilter) {
      diffFilter.onchange = (e) => {
        this.currentDifficulty = e.target.value;
        this._applyFilters();
        this._refreshQuestion();
      };
    }

    // 题内交互 — 每次换题重新绑定
    this._bindQuestion();

    // LaTeX
    const container = document.querySelector('.practice-page');
    if (container) App.renderMath(container);
  },

  _bindQuestion() {
    // 选择题选项点击
    document.querySelectorAll('.practice-option').forEach(opt => {
      opt.addEventListener('click', async () => {
        const idx = parseInt(opt.dataset.index);
        const q = this.filteredQuestions[this.currentIndex];
        if (!q) return;

        document.querySelectorAll('.practice-option').forEach(o => {
          o.style.borderColor = 'var(--amber-200)';
          o.style.background = '#fff';
        });

        const correctOpt = document.querySelector(`.practice-option[data-index="${q.answer}"]`);
        if (idx === q.answer) {
          opt.style.borderColor = 'var(--green-500)';
          opt.style.background = 'var(--green-50)';
        } else {
          opt.style.borderColor = 'var(--red-500)';
          opt.style.background = '#fef2f2';
          if (correctOpt) {
            correctOpt.style.borderColor = 'var(--green-500)';
            correctOpt.style.background = 'var(--green-50)';
          }
          this._addToWrongBook(q);
        }

        document.querySelectorAll('.practice-option').forEach(o => o.style.pointerEvents = 'none');

        const fbEl = document.getElementById('practice-feedback');
        if (fbEl) {
          fbEl.innerHTML = `
            <div class="card" style="background:var(--amber-50);">
              <div style="font-size:13px;font-weight:600;color:var(--amber-700);margin-bottom:8px;">
                🤖 AI 解析 · ${idx === q.answer ? '✅ 回答正确！' : '❌ 回答错误'}
              </div>
              <div style="font-size:13px;color:var(--amber-700);line-height:1.8;" class="math-content">${q.analysis}</div>
              ${q.keyFormula ? `<div style="margin-top:8px;padding:8px 12px;background:var(--amber-100);border-radius:8px;font-size:12px;color:var(--amber-700);"><strong>关键公式：</strong><span class="math-content">${q.keyFormula}</span></div>` : ''}
            </div>`;
          App.renderMath(fbEl);
        }

        const count = parseInt(localStorage.getItem('practiceCount') || '0');
        localStorage.setItem('practiceCount', count + 1);
      });
    });

    // 填空题提交
    const submitFillBtn = document.getElementById('btn-submit-fill');
    if (submitFillBtn) {
      submitFillBtn.addEventListener('click', async () => {
        const input = document.getElementById('fill-answer');
        const q = this.filteredQuestions[this.currentIndex];
        if (!q) return;
        const userAnswer = input.value.trim();

        const isCorrect = userAnswer === q.answer
          || userAnswer.replace(/\s/g, '') === q.answer.replace(/\s/g, '')
          || Math.abs(parseFloat(userAnswer) - parseFloat(q.answer)) < 0.001;

        input.style.borderColor = isCorrect ? 'var(--green-500)' : 'var(--red-500)';
        input.style.background = isCorrect ? 'var(--green-50)' : '#fef2f2';

        if (!isCorrect) this._addToWrongBook(q);

        const fbEl = document.getElementById('practice-feedback');
        if (fbEl) {
          fbEl.innerHTML = `
            <div class="card" style="background:var(--amber-50);">
              <div style="font-size:13px;font-weight:600;color:var(--amber-700);margin-bottom:4px;">
                🤖 AI 批改 · ${isCorrect ? '✅ 回答正确！' : `❌ 正确答案：${q.answer}`}
              </div>
              <div style="font-size:13px;color:var(--amber-700);line-height:1.8;" class="math-content">${q.analysis}</div>
            </div>`;
          App.renderMath(fbEl);
        }

        const count = parseInt(localStorage.getItem('practiceCount') || '0');
        localStorage.setItem('practiceCount', count + 1);
        submitFillBtn.disabled = true;
        input.disabled = true;
      });
    }

    // 翻页
    const prevBtn = document.getElementById('btn-prev-question');
    if (prevBtn) {
      prevBtn.onclick = () => {
        if (this.currentIndex > 0) {
          this.currentIndex--;
          this._refreshQuestion();
        }
      };
    }

    const nextBtn = document.getElementById('btn-next-question');
    if (nextBtn) {
      nextBtn.onclick = () => {
        if (this.currentIndex < this.filteredQuestions.length - 1) {
          this.currentIndex++;
          this._refreshQuestion();
        }
      };
    }

    // 收藏
    const favBtn = document.getElementById('btn-favorite-current');
    if (favBtn) {
      favBtn.onclick = () => {
        const q = this.filteredQuestions[this.currentIndex];
        if (!q) return;
        let favs = this._safeJSON(localStorage.getItem('favorites'), []);
        if (favs.includes(q.id)) {
          favs = favs.filter(id => id !== q.id);
          App.showToast('已取消收藏');
        } else {
          favs.push(q.id);
          App.showToast('⭐ 已加入收藏');
        }
        localStorage.setItem('favorites', JSON.stringify(favs));
        favBtn.textContent = this.isFavorited(q.id) ? '⭐ 已收藏' : '☆ 收藏此题';
      };
    }
  },

  _addToWrongBook(q) {
    let wrongBook = this._safeJSON(localStorage.getItem('wrongBook'), []);
    const existing = wrongBook.find(w => w.questionId === q.id);
    if (existing) {
      existing.count += 1;
      existing.date = new Date().toISOString();
    } else {
      wrongBook.push({
        questionId: q.id,
        topicId: q.topicId,
        count: 1,
        date: new Date().toISOString()
      });
    }
    localStorage.setItem('wrongBook', JSON.stringify(wrongBook));
  }
};
