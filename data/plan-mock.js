// Mock AI 复习计划生成
function mockGeneratePlan(examDate, level, hoursPerDay) {
  const startDate = new Date();
  const endDate = new Date(examDate);
  const totalDays = Math.max(7, Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24)));

  // 根据水平和每日时长调整节奏
  const chapterDays = {
    '优秀': [3, 3, 2, 4, 4, 3, 3, 3],
    '中等': [4, 4, 3, 5, 5, 4, 4, 4],
    '基础较薄弱': [5, 5, 4, 6, 6, 4, 5, 5]
  };
  const hourMultiplier = Math.max(0.5, Math.min(2, 2 / hoursPerDay));

  const days = chapterDays[level] || chapterDays['中等'];
  const chapters = [
    { id: 'limit', title: '函数与极限' },
    { id: 'derivative', title: '导数与微分' },
    { id: 'mean-value', title: '微分中值定理' },
    { id: 'indefinite-integral', title: '不定积分' },
    { id: 'definite-integral', title: '定积分' },
    { id: 'diff-eq', title: '微分方程' },
    { id: 'multi-var', title: '多元函数微分学' },
    { id: 'multi-integral', title: '重积分' }
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
