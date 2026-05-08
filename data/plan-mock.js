// Mock AI 复习计划生成
function mockGeneratePlan(examDate, level, hoursPerDay) {
  const startDate = new Date();
  const endDate = new Date(examDate);
  const totalDays = Math.max(7, Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24)));

  // 根据水平和每日时长调整节奏
  const chapterDays = {
    '优秀': [2, 3, 3, 2, 4, 3, 3, 4, 3],
    '中等': [3, 4, 4, 3, 5, 4, 4, 5, 4],
    '基础较薄弱': [4, 5, 5, 4, 6, 5, 5, 6, 4]
  };
  const hourMultiplier = Math.max(0.5, Math.min(2, 2 / hoursPerDay));

  const days = chapterDays[level] || chapterDays['中等'];
  const chapters = [
    { id: 'functions', title: '函数' },
    { id: 'limits', title: '极限与连续' },
    { id: 'derivatives', title: '导数' },
    { id: 'derivative-apps', title: '导数的应用' },
    { id: 'integration', title: '积分' },
    { id: 'integration-apps', title: '积分的应用' },
    { id: 'transcendental', title: '超越函数' },
    { id: 'integration-tech', title: '积分技巧' },
    { id: 'diff-eq', title: '微分方程' }
  ];

  const weeks = [];
  let currentDate = new Date(startDate);
  let weekNum = 1;

  for (let i = 0; i < chapters.length; i++) {
    const actualDays = Math.max(2, Math.round(days[i] * hourMultiplier));
    const weekStart = new Date(currentDate);
    const weekEnd = new Date(currentDate);
    weekEnd.setDate(weekEnd.getDate() + actualDays - 1);

    weeks.push({
      week: weekNum,
      chapterId: chapters[i].id,
      title: chapters[i].title,
      startDate: formatDate(weekStart),
      endDate: formatDate(weekEnd),
      tasks: [
        { type: 'learn', desc: `学习${chapters[i].title}核心概念`, hours: Math.round(hoursPerDay * actualDays * 0.4) },
        { type: 'practice', desc: `完成${chapters[i].title}课后习题`, hours: Math.round(hoursPerDay * actualDays * 0.4) },
        { type: 'review', desc: `复习${chapters[i].title}错题`, hours: Math.round(hoursPerDay * actualDays * 0.2) }
      ]
    });

    currentDate = new Date(weekEnd);
    currentDate.setDate(currentDate.getDate() + 1);
    weekNum++;
  }

  return { totalDays, totalWeeks: weeks.length, weeks };
}

function formatDate(date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}
