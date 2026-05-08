const Exam = {
  timeLeft: 90 * 60,
  timerId: null,
  questions: [],
  answers: {},
  started: false,
  finished: false,
  currentQuestion: 0,

  _safeJSON(raw, fallback) {
    if (!raw) return fallback;
    try { return JSON.parse(raw); } catch (e) { return fallback; }
  },

  _cleanup() {
    if (this.timerId) {
      clearInterval(this.timerId);
      this.timerId = null;
    }
  },

  _generatePaper() {
    const byTopic = {};
    QUESTIONS.forEach(q => {
      if (!byTopic[q.topicId]) byTopic[q.topicId] = [];
      byTopic[q.topicId].push(q);
    });

    // 每个章节至少抽 1 题，剩余随机
    const topics = Object.keys(byTopic);
    const paper = [];
    topics.forEach(tid => {
      const pool = byTopic[tid];
      paper.push(pool[Math.floor(Math.random() * pool.length)]);
    });

    const remaining = [...QUESTIONS].filter(q => !paper.find(p => p.id === q.id));
    for (let i = remaining.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [remaining[i], remaining[j]] = [remaining[j], remaining[i]];
    }

    const target = Math.min(20, QUESTIONS.length);
    while (paper.length < target && remaining.length > 0) {
      paper.push(remaining.pop());
    }

    // 随机打乱题目顺序
    for (let i = paper.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [paper[i], paper[j]] = [paper[j], paper[i]];
    }

    return paper;
  },

  _formatTime(seconds) {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  },

  _startTimer() {
    if (this.timerId) return;
    this.timerId = setInterval(() => {
      this.timeLeft--;
      const timerEl = document.getElementById('exam-timer');
      if (timerEl) {
        timerEl.textContent = this._formatTime(this.timeLeft);
        if (this.timeLeft < 300) timerEl.style.color = 'var(--red-500)';
      }
      if (this.timeLeft <= 0) {
        this._submitExam();
      }
    }, 1000);
  },

  _submitExam() {
    this._cleanup();
    this.finished = true;
    const main = document.getElementById('main-content');
    if (main) {
      main.innerHTML = this.render();
      App.renderMath(main);
      this.init();
    }
  },

  _renderResult() {
    let correctCount = 0;
    const details = this.questions.map(q => {
      const userAnswer = this.answers[q.id];
      let isCorrect = false;
      if (q.type === 'choice') {
        isCorrect = userAnswer === q.answer;
      } else {
        isCorrect = userAnswer !== undefined
          && (String(userAnswer).trim() === String(q.answer).trim()
              || Math.abs(parseFloat(userAnswer) - parseFloat(q.answer)) < 0.001);
      }
      if (isCorrect) correctCount++;
      return { ...q, userAnswer, isCorrect };
    });

    const score = Math.round((correctCount / this.questions.length) * 100);

    // 章节分析
    const topicStats = {};
    details.forEach(d => {
      if (!topicStats[d.topicId]) topicStats[d.topicId] = { total: 0, correct: 0 };
      topicStats[d.topicId].total++;
      if (d.isCorrect) topicStats[d.topicId].correct++;
    });

    const weakestTopics = Object.entries(topicStats)
      .filter(([, s]) => s.correct / s.total < 0.5)
      .map(([tid, s]) => {
        const t = TOPICS.find(tp => tp.id === tid);
        return t ? t.title : tid;
      });

    // 保存供 AI 分析使用
    this._examDetails = details;
    this._weakestTopics = weakestTopics;

    return `
      <div class="exam-result">
        <h2 style="font-size:20px;color:var(--amber-700);margin-bottom:16px;">📊 考试结果</h2>

        <div class="card" style="text-align:center;">
          <div style="font-size:48px;font-weight:700;color:${score >= 60 ? 'var(--green-500)' : 'var(--red-500)'};">${score}</div>
          <div style="font-size:14px;color:var(--gray-600);">分 · ${correctCount}/${this.questions.length} 题正确</div>
          <div style="margin-top:8px;">${score >= 90 ? '🎉' : score >= 60 ? '👍' : '💪'} ${score >= 90 ? '非常优秀！' : score >= 60 ? '已达标，继续加油！' : '还需努力，看看薄弱分析吧'}</div>
        </div>

        <div class="card">
          <div class="card-header">🤖 AI 薄弱分析</div>
          <div id="exam-ai-analysis">
            <div style="display:flex;align-items:center;gap:8px;color:var(--gray-400);">
              <span class="spinner" style="width:14px;height:14px;"></span> AI 正在分析你的错题...
            </div>
          </div>
        </div>

        <div class="card">
          <div class="card-header">📋 答题详情</div>
          ${details.map((d, i) => {
            const topic = TOPICS.find(t => t.id === d.topicId);
            return `
              <div style="padding:10px 0;border-bottom:1px solid var(--amber-100);display:flex;align-items:center;gap:10px;">
                <span style="font-size:18px;">${d.isCorrect ? '✅' : '❌'}</span>
                <div style="flex:1;min-width:0;">
                  <div style="font-size:12px;color:var(--gray-800);" class="math-content">${d.stem}</div>
                  <div style="font-size:10px;color:var(--gray-600);">${topic ? topic.title : ''} · 正确答案：${d.type === 'choice' ? ['A','B','C','D'][d.answer] : d.answer}</div>
                </div>
              </div>`;
          }).join('')}
        </div>

        <button id="btn-restart-exam" class="btn btn-secondary" style="width:100%;margin-top:8px;">🔄 重新模考</button>
      </div>`;
  },

  _renderExam() {
    const currentIdx = this.currentQuestion;
    const q = this.questions[currentIdx];
    if (!q) return `<div class="empty-state"><div class="icon">⚠️</div><p>题库不足，无法组卷</p></div>`;

    const topic = TOPICS.find(t => t.id === q.topicId);
    const typeLabel = q.type === 'choice' ? '选择题' : '填空题';
    const answered = Object.keys(this.answers).length;

    return `
      <div class="exam-page">
        <h2 style="font-size:20px;color:var(--amber-700);margin-bottom:16px;">🎯 模拟考试 · 高数期末</h2>

        <div class="card" style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:12px;">
          <div>
            <div style="font-size:11px;color:var(--gray-600);">⏱ 剩余时间</div>
            <div id="exam-timer" style="font-size:24px;font-weight:700;color:${this.timeLeft < 300 ? 'var(--red-500)' : 'var(--amber-500)'};">${this._formatTime(this.timeLeft)}</div>
          </div>
          <div style="text-align:center;">
            <div style="font-size:11px;color:var(--gray-600);">📝 答题进度</div>
            <div style="font-size:16px;font-weight:600;color:var(--amber-700);">${answered} / ${this.questions.length}</div>
          </div>
        </div>

        <div class="card" style="margin-top:12px;">
          <div style="display:flex;gap:8px;margin-bottom:10px;">
            <span class="tag tag-gray">第 ${currentIdx + 1} 题</span>
            <span class="tag tag-gray">${typeLabel}</span>
            <span class="tag tag-gray">5 分</span>
            <span class="tag tag-amber">${topic ? topic.title : ''}</span>
          </div>
          <div style="font-size:14px;color:var(--gray-800);line-height:1.8;margin-bottom:16px;" class="math-content">${q.stem}</div>

          <div id="exam-answer-area">
            ${q.type === 'choice' ? q.options.map((opt, i) => {
              const labels = ['A', 'B', 'C', 'D'];
              const selected = this.answers[q.id] === i;
              return `
                <div class="exam-option" data-qid="${q.id}" data-idx="${i}" style="padding:12px 16px;background:${selected ? 'var(--amber-100)' : '#fff'};border:2px solid ${selected ? 'var(--amber-500)' : 'var(--amber-200)'};border-radius:10px;cursor:pointer;font-size:13px;margin-bottom:8px;transition:all 0.15s;">
                  <span style="font-weight:600;color:var(--amber-500);margin-right:8px;">${labels[i]}</span>
                  <span class="math-content">${opt}</span>
                </div>`;
            }).join('') : `
              <input type="text" class="input exam-fill-input" data-qid="${q.id}" placeholder="输入答案" value="${this.answers[q.id] || ''}">
            `}
          </div>
        </div>

        <!-- 答题卡 -->
        <div style="display:flex;gap:6px;flex-wrap:wrap;margin-top:12px;">
          ${this.questions.map((eq, i) => {
            const isAnswered = this.answers[eq.id] !== undefined;
            const isCurrent = i === currentIdx;
            return `
              <button class="exam-nav-dot" data-idx="${i}" style="width:30px;height:30px;border-radius:50%;border:${isCurrent ? '3px solid var(--amber-500)' : '1px solid var(--amber-200)'};background:${isAnswered ? 'var(--amber-500)' : '#fff'};color:${isAnswered ? '#fff' : 'var(--gray-600)'};font-size:11px;cursor:pointer;">${i+1}</button>`;
          }).join('')}
        </div>

        <div style="display:flex;gap:12px;margin-top:16px;">
          <button id="btn-exam-prev" class="btn btn-secondary" style="flex:1;" ${currentIdx === 0 ? 'disabled' : ''}>← 上一题</button>
          <button id="btn-exam-next" class="btn btn-primary" style="flex:1;">${currentIdx >= this.questions.length - 1 ? '交卷' : '下一题 →'}</button>
        </div>

        <button id="btn-exam-submit" class="btn btn-danger" style="width:100%;margin-top:8px;">📝 交卷</button>
      </div>`;
  },

  render() {
    if (this.finished) return this._renderResult();

    if (!this.started) {
      this.questions = this._generatePaper();
    }

    return this._renderExam();
  },

  init() {
    if (this.finished) {
      const restartBtn = document.getElementById('btn-restart-exam');
      if (restartBtn) {
        restartBtn.onclick = () => {
          this._cleanup();
          this.started = false;
          this.finished = false;
          this.questions = [];
          this.answers = {};
          this.currentQuestion = 0;
          this.timeLeft = 90 * 60;
          App.handleRoute();
        };
      }
      const resultEl = document.querySelector('.exam-result');
      if (resultEl) App.renderMath(resultEl);
      // 触发 AI 薄弱分析
      this._requestAIAnalysis();
      return;
    }

    if (!this.started) {
      this.started = true;
      this._startTimer();
    }

    const container = document.querySelector('.exam-page');
    if (container) App.renderMath(container);

    // 选择题选项
    document.querySelectorAll('.exam-option').forEach(opt => {
      opt.addEventListener('click', () => {
        const qid = opt.dataset.qid;
        const idx = parseInt(opt.dataset.idx);
        this.answers[qid] = idx;

        document.querySelectorAll(`.exam-option[data-qid="${qid}"]`).forEach(o => {
          o.style.background = '#fff';
          o.style.borderColor = 'var(--amber-200)';
        });
        opt.style.background = 'var(--amber-100)';
        opt.style.borderColor = 'var(--amber-500)';
      });
    });

    // 填空题 — 实时保存答案
    document.querySelectorAll('.exam-fill-input').forEach(input => {
      input.addEventListener('input', () => {
        this.answers[input.dataset.qid] = input.value;
      });
    });

    // 答题卡跳转
    document.querySelectorAll('.exam-nav-dot').forEach(dot => {
      dot.onclick = () => {
        this.currentQuestion = parseInt(dot.dataset.idx);
        this._rerender();
      };
    });

    // 导航按钮
    const prevBtn = document.getElementById('btn-exam-prev');
    if (prevBtn) {
      prevBtn.onclick = () => {
        if (this.currentQuestion > 0) {
          this.currentQuestion--;
          this._rerender();
        }
      };
    }

    const nextBtn = document.getElementById('btn-exam-next');
    if (nextBtn) {
      nextBtn.onclick = () => {
        if (this.currentQuestion >= this.questions.length - 1) {
          if (confirm('确定要交卷吗？交卷后不可修改。')) {
            this._submitExam();
          }
        } else {
          this.currentQuestion++;
          this._rerender();
        }
      };
    }

    const submitBtn = document.getElementById('btn-exam-submit');
    if (submitBtn) {
      submitBtn.onclick = () => {
        const unanswered = this.questions.length - Object.keys(this.answers).length;
        const msg = unanswered > 0
          ? `还有 ${unanswered} 题未作答，确定要交卷吗？`
          : '确定要交卷吗？交卷后不可修改。';
        if (confirm(msg)) {
          this._submitExam();
        }
      };
    }
  },

  async _requestAIAnalysis() {
    const details = this._examDetails || [];
    const weakestTopics = this._weakestTopics || [];
    const wrongList = details.filter(d => !d.isCorrect);

    const el = document.getElementById('exam-ai-analysis');
    if (!el) return;

    if (wrongList.length === 0) {
      el.innerHTML = '<div style="font-size:13px;color:var(--green-600);">✅ 全部正确，无需分析！继续保持！</div>';
      return;
    }

    const wrongText = wrongList.map((d, i) => {
      const topic = TOPICS.find(t => t.id === d.topicId);
      const answerLabel = d.type === 'choice' ? ['A','B','C','D'][d.answer] : d.answer;
      return `${i + 1}. [${topic ? topic.title : '未知'}] ${d.stem}\n   正确答案: ${answerLabel}`;
    }).join('\n\n');

    const systemPrompt = '你是一位高数教学评估专家。根据学生的模考错题，分析薄弱章节，给出具体复习建议。使用 LaTeX 格式（用 $$ 包裹）输出数学公式。回复简洁，分点列出。';
    const score = Math.round((details.filter(d => d.isCorrect).length / details.length) * 100);
    const userMessage = `学生完成了一次高数模考，得分 ${score} 分，共 ${details.length} 题，错 ${wrongList.length} 题。以下是错题详情：\n\n${wrongText}\n\n请分析学生的薄弱点并给出复习建议。`;

    try {
      const reply = await App.askAI(systemPrompt, userMessage);
      el.innerHTML = reply.replace(/\n/g, '<br>');
      App.renderMath(el);
    } catch (e) {
      el.innerHTML = '<div style="font-size:13px;color:var(--red-500);">❌ AI 分析暂时不可用</div>';
      if (weakestTopics.length > 0) {
        el.innerHTML += '<div style="font-size:13px;color:var(--amber-700);margin-top:8px;">以下章节正确率低于 50%，建议重点复习：<br>' + weakestTopics.map(t => '⚠️ ' + t).join('<br>') + '</div>';
      }
    }
  },

  _rerender() {
    const main = document.getElementById('main-content');
    if (main) {
      main.innerHTML = this.render();
      this.init();
    }
  }
};
