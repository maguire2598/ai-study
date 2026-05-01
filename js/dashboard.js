const Dashboard = {
  render() {
    const planData = JSON.parse(localStorage.getItem('studyPlan') || 'null');
    const wrongBook = JSON.parse(localStorage.getItem('wrongBook') || '[]');
    const practiceCount = parseInt(localStorage.getItem('practiceCount') || '0');

    let countdownHTML = '';
    if (planData && planData.examDate) {
      const daysLeft = Math.max(0, Math.ceil((new Date(planData.examDate) - new Date()) / (1000 * 60 * 60 * 24)));
      const doneWeeks = planData.weeks ? planData.weeks.filter(w => w.status === 'done').length : 0;
      const totalWeeks = planData.weeks ? planData.weeks.length : 8;
      const progress = totalWeeks > 0 ? Math.round((doneWeeks / totalWeeks) * 100) : 0;

      countdownHTML = `
        <div class="card" style="text-align:center;">
          <div style="font-size:14px;color:var(--amber-600);margin-bottom:4px;">📅 距离高数期末考还有</div>
          <div style="font-size:42px;font-weight:700;color:var(--amber-500);">${daysLeft} <span style="font-size:16px;">天</span></div>
          <div style="margin-top:12px;">
            <div style="display:flex;justify-content:space-between;font-size:11px;color:var(--gray-600);margin-bottom:4px;">
              <span>复习进度</span><span>${progress}%</span>
            </div>
            <div class="progress-bar"><div class="progress-fill" style="width:${progress}%;"></div></div>
          </div>
          <div style="font-size:12px;color:var(--amber-700);margin-top:8px;">
            已完成 ${doneWeeks}/${totalWeeks} 周计划 · 已刷 ${practiceCount} 题
          </div>
        </div>`;
    } else {
      countdownHTML = `
        <div class="card" style="text-align:center;">
          <div style="font-size:42px;margin-bottom:8px;">📅</div>
          <div style="font-size:16px;font-weight:600;color:var(--amber-700);margin-bottom:8px;">还没有复习计划</div>
          <div style="font-size:13px;color:var(--gray-600);margin-bottom:12px;">让 AI 帮你制定专属高数复习计划</div>
          <a href="#plan" class="btn btn-primary" style="text-decoration:none;">开始制定 →</a>
        </div>`;
    }

    return `
      <div class="dashboard">
        ${countdownHTML}

        <div class="grid-4" style="margin-bottom:16px;">
          <a href="#graph" style="text-decoration:none;">
            <div class="card" style="text-align:center;cursor:pointer;">
              <div style="font-size:32px;">🗺️</div>
              <div style="font-size:13px;font-weight:600;color:var(--amber-700);">知识图谱</div>
              <div style="font-size:11px;color:var(--gray-600);">8 章节</div>
            </div>
          </a>
          <a href="#practice" style="text-decoration:none;">
            <div class="card" style="text-align:center;cursor:pointer;">
              <div style="font-size:32px;">✏️</div>
              <div style="font-size:13px;font-weight:600;color:var(--amber-700);">每日练习</div>
              <div style="font-size:11px;color:var(--gray-600);">已刷 ${practiceCount} 题</div>
            </div>
          </a>
          <a href="#learn" style="text-decoration:none;">
            <div class="card" style="text-align:center;cursor:pointer;">
              <div style="font-size:32px;">📖</div>
              <div style="font-size:13px;font-weight:600;color:var(--amber-700);">知识点</div>
              <div style="font-size:11px;color:var(--gray-600);">视频+例题</div>
            </div>
          </a>
          <a href="#exam" style="text-decoration:none;">
            <div class="card" style="text-align:center;cursor:pointer;">
              <div style="font-size:32px;">🎯</div>
              <div style="font-size:13px;font-weight:600;color:var(--amber-700);">模拟考试</div>
              <div style="font-size:11px;color:var(--gray-600);">计时组卷</div>
            </div>
          </a>
        </div>

        <div class="card">
          <div class="card-header">📒 错题本速览</div>
          ${wrongBook.length === 0
            ? '<div class="empty-state"><div class="icon">📭</div><p style="font-size:13px;color:var(--gray-600);">暂无错题，继续保持！</p></div>'
            : `
              <div style="font-size:13px;color:var(--amber-700);margin-bottom:8px;">共 <strong>${wrongBook.length}</strong> 道错题待复习</div>
              <a href="#notebook" class="btn btn-sm btn-secondary" style="text-decoration:none;">查看错题本 →</a>
            `}
        </div>
      </div>`;
  },

  init() {
    // 仪表盘无交互逻辑，仅展示
  }
};
