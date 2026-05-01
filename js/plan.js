const Plan = {
  _safeJSON(raw, fallback) {
    try { return JSON.parse(raw); } catch (e) { return fallback; }
  },

  _buildPlanCard(planData) {
    const done = planData.weeks.filter(w => w.status === 'done').length;
    const total = planData.weeks.length;
    const progress = total > 0 ? Math.round(done / total * 100) : 0;

    return `
      <div class="card">
        <div class="card-header">📋 我的复习计划</div>
        <div style="display:flex;justify-content:space-between;font-size:12px;color:var(--gray-600);margin-bottom:8px;">
          <span>完成进度</span><span>${done}/${total} 周</span>
        </div>
        <div class="progress-bar" style="margin-bottom:16px;">
          <div class="progress-fill" style="width:${progress}%;"></div>
        </div>
        <div id="plan-weeks">
          ${planData.weeks.map((w, i) => {
            const statusIcon = w.status === 'done' ? '✓' : w.status === 'active' ? '⏳' : '○';
            const statusClass = w.status === 'done' ? 'tag-green' : w.status === 'active' ? 'tag-amber' : 'tag-gray';
            const statusText = w.status === 'done' ? '已完成' : w.status === 'active' ? '进行中' : '待开始';
            const opacity = w.status === 'done' ? '' : w.status === 'active' ? '' : 'opacity:0.65;';
            return `
              <div style="display:flex;align-items:center;gap:10px;padding:12px;background:#fff;border-radius:10px;margin-bottom:8px;box-shadow:0 1px 4px rgba(0,0,0,0.04);${opacity}">
                <div style="width:30px;height:30px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-weight:700;font-size:13px;flex-shrink:0;background:${w.status === 'active' ? 'var(--amber-500)' : 'var(--amber-100)'};color:${w.status === 'active' ? '#fff' : 'var(--amber-700)'};">${i+1}</div>
                <div style="flex:1;min-width:0;">
                  <div style="font-size:13px;font-weight:600;color:var(--gray-800);">${w.title}</div>
                  <div style="font-size:11px;color:var(--gray-600);">${w.startDate} ~ ${w.endDate}</div>
                </div>
                <span class="tag ${statusClass}">${statusIcon} ${statusText}</span>
                ${w.status !== 'done' ? `<button class="btn btn-sm btn-primary mark-done-btn" data-week="${i}">标记完成</button>` : ''}
              </div>`;
          }).join('')}
        </div>
        <button id="btn-reset-plan" class="btn btn-sm btn-secondary" style="margin-top:12px;">🔄 重新制定</button>
      </div>`;
  },

  render() {
    const saved = this._safeJSON(localStorage.getItem('studyPlan'), null);
    const hasPlan = saved && saved.weeks;

    const isDefault2h = !saved || saved.hoursPerDay == null || saved.hoursPerDay == 2;

    const setupHTML = `
      <div class="card">
        <div class="card-header">⚙️ 设置复习目标</div>
        <div style="display:flex;gap:12px;flex-wrap:wrap;margin-bottom:12px;">
          <div style="flex:1;min-width:140px;">
            <label style="font-size:12px;color:var(--gray-600);display:block;margin-bottom:4px;">📅 考试日期</label>
            <input type="date" id="plan-exam-date" class="input" value="${saved ? saved.examDate : ''}">
          </div>
          <div style="flex:1;min-width:140px;">
            <label style="font-size:12px;color:var(--gray-600);display:block;margin-bottom:4px;">📊 当前水平</label>
            <select id="plan-level" class="input">
              <option value="基础较薄弱" ${saved && saved.level === '基础较薄弱' ? 'selected' : ''}>基础较薄弱</option>
              <option value="中等" ${saved && saved.level === '中等' ? 'selected' : ''}>中等</option>
              <option value="优秀" ${saved && saved.level === '优秀' ? 'selected' : ''}>优秀</option>
            </select>
          </div>
          <div style="flex:1;min-width:140px;">
            <label style="font-size:12px;color:var(--gray-600);display:block;margin-bottom:4px;">⏰ 每天可投入</label>
            <select id="plan-hours" class="input">
              <option value="1" ${saved && saved.hoursPerDay == 1 ? 'selected' : ''}>1 小时</option>
              <option value="2" ${isDefault2h ? 'selected' : ''}>2 小时</option>
              <option value="3" ${saved && saved.hoursPerDay == 3 ? 'selected' : ''}>3 小时</option>
              <option value="4" ${saved && saved.hoursPerDay == 4 ? 'selected' : ''}>4 小时</option>
            </select>
          </div>
        </div>
        <button id="btn-generate-plan" class="btn btn-primary" style="width:100%;">
          🤖 AI 生成复习计划
        </button>
      </div>`;

    return `
      <div class="plan-page">
        <h2 style="font-size:20px;color:var(--amber-700);margin-bottom:16px;">📅 复习计划</h2>
        ${setupHTML}
        <div id="plan-result">${hasPlan ? this._buildPlanCard(saved) : ''}</div>
      </div>`;
  },

  init() {
    const generateBtn = document.getElementById('btn-generate-plan');
    if (generateBtn) {
      generateBtn.addEventListener('click', async () => {
        const examDate = document.getElementById('plan-exam-date').value;
        const level = document.getElementById('plan-level').value;
        const hours = parseInt(document.getElementById('plan-hours').value);

        if (!examDate) { App.showToast('请先选择考试日期'); return; }

        generateBtn.disabled = true;
        generateBtn.innerHTML = '<span class="spinner"></span> AI 正在生成计划...';

        try {
          const result = await App.mockAI(() => mockGeneratePlan(examDate, level, hours));

          const planData = {
            examDate,
            level,
            hoursPerDay: hours,
            weeks: result.weeks.map((w, i) => ({
              ...w,
              status: i === 0 ? 'active' : 'pending'
            })),
            createdAt: new Date().toISOString()
          };

          localStorage.setItem('studyPlan', JSON.stringify(planData));

          const planResult = document.getElementById('plan-result');
          if (planResult) {
            planResult.innerHTML = this._buildPlanCard(planData);
            this.bindWeekButtons();
            this.bindResetBtn();
          }

          App.showToast('✅ 复习计划已生成！');
        } catch (e) {
          App.showToast('❌ 生成计划失败，请重试');
        } finally {
          generateBtn.disabled = false;
          generateBtn.textContent = '🤖 AI 生成复习计划';
        }
      });
    }

    const saved = this._safeJSON(localStorage.getItem('studyPlan'), null);
    if (saved && saved.weeks) {
      this.bindWeekButtons();
      this.bindResetBtn();
    }
  },

  bindWeekButtons() {
    document.querySelectorAll('.mark-done-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const weekIdx = parseInt(btn.dataset.week);
        const planData = this._safeJSON(localStorage.getItem('studyPlan'), null);
        if (!planData) return;

        planData.weeks[weekIdx].status = 'done';
        if (weekIdx + 1 < planData.weeks.length) {
          planData.weeks[weekIdx + 1].status = 'active';
        }
        localStorage.setItem('studyPlan', JSON.stringify(planData));

        App.handleRoute();
        App.showToast(`✅ 第 ${weekIdx + 1} 周已标记完成！`);
      });
    });
  },

  bindResetBtn() {
    const resetBtn = document.getElementById('btn-reset-plan');
    if (resetBtn) {
      resetBtn.addEventListener('click', () => {
        localStorage.removeItem('studyPlan');
        App.handleRoute();
        App.showToast('🔄 已清除计划，请重新制定');
      });
    }
  }
};
