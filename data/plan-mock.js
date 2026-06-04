// Mock AI 复习计划生成
function mockGeneratePlan(examDate, level, hoursPerDay) {
  const startDate = new Date();
  startDate.setHours(0, 0, 0, 0);
  const endDate = new Date(examDate);
  endDate.setHours(23, 59, 59, 999);

  // 可用天数：从今天到考试前一天（考试当天留给总复习）
  const today = new Date(startDate);
  const examDay = new Date(endDate);
  const availableDays = Math.max(7, Math.ceil((examDay - today) / (1000 * 60 * 60 * 24)));

  // 各水平的章节权重（相对难度/耗时比例）
  const chapterWeights = {
    '优秀':       [2, 3, 3, 2, 4, 3, 3, 4, 3],   // 总和 27
    '中等':       [3, 4, 4, 3, 5, 4, 4, 5, 4],   // 总和 36
    '基础较薄弱': [4, 5, 5, 4, 6, 5, 5, 6, 4]    // 总和 44
  };

  const weights = chapterWeights[level] || chapterWeights['中等'];
  const totalWeight = weights.reduce((a, b) => a + b, 0);

  // 根据每日学习时长调整：每日投入越少，相同内容需要额外天数
  const hourMultiplier = Math.max(0.6, Math.min(2.5, 2.5 / hoursPerDay));

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

  // 留出最后 1~2 天做总复习冲刺
  const reserveDays = availableDays <= 10 ? 1 : 2;
  const planDays = availableDays - reserveDays;

  // 按权重比例分配天数，确保每章至少1天
  const rawDays = weights.map(w => Math.max(1, Math.round(w / totalWeight * planDays)));
  const rawTotal = rawDays.reduce((a, b) => a + b, 0);

  // 如果按比例分配后与 planDays 有偏差，从最长章节增减
  let diff = planDays - rawTotal;
  while (diff !== 0) {
    if (diff > 0) {
      const idx = rawDays.indexOf(Math.max(...rawDays));
      rawDays[idx]++;
      diff--;
    } else {
      const candidates = rawDays
        .map((d, i) => ({ d, i }))
        .filter(x => x.d > 1)
        .sort((a, b) => b.d - a.d);
      if (candidates.length > 0) {
        rawDays[candidates[0].i]--;
        diff++;
      } else {
        break;
      }
    }
  }

  // 应用时长乘数，至少保证每章 1 天
  const chapterDays = rawDays.map(d => Math.max(1, Math.round(d * hourMultiplier)));

  // 如果乘数导致总天数超标，按比例压缩回 planDays
  let scaledDays = chapterDays;
  const scaledTotal = scaledDays.reduce((a, b) => a + b, 0);
  if (scaledTotal > planDays) {
    const ratio = planDays / scaledTotal;
    scaledDays = chapterDays.map(d => Math.max(1, Math.floor(d * ratio)));
    let currentTotal = scaledDays.reduce((a, b) => a + b, 0);
    // 补回因 floor 损失的余数天
    while (currentTotal < planDays) {
      const idx = scaledDays.indexOf(Math.min(...scaledDays));
      scaledDays[idx]++;
      currentTotal++;
    }
  }

  const weeks = [];
  let currentDate = new Date(startDate);

  for (let i = 0; i < chapters.length; i++) {
    const weekStart = new Date(currentDate);
    const weekEnd = new Date(currentDate);
    weekEnd.setDate(weekEnd.getDate() + scaledDays[i] - 1);

    // 确保每章的结束日期不晚于考试日
    if (weekEnd > examDay) {
      weekEnd.setTime(examDay.getTime());
    }

    weeks.push({
      week: i + 1,
      chapterId: chapters[i].id,
      title: chapters[i].title,
      startDate: formatDate(weekStart),
      endDate: formatDate(weekEnd),
      tasks: [
        { type: 'learn', desc: `学习${chapters[i].title}核心概念`, hours: Math.round(hoursPerDay * scaledDays[i] * 0.4) || 1 },
        { type: 'practice', desc: `完成${chapters[i].title}课后习题`, hours: Math.round(hoursPerDay * scaledDays[i] * 0.4) || 1 },
        { type: 'review', desc: `复习${chapters[i].title}错题`, hours: Math.round(hoursPerDay * scaledDays[i] * 0.2) || 1 }
      ]
    });

    currentDate = new Date(weekEnd);
    currentDate.setDate(currentDate.getDate() + 1);

    // 如果下一章开始日期已超过考试日，不再添加后续章节
    if (currentDate >= examDay) break;
  }

  return { totalDays: availableDays, totalWeeks: weeks.length, weeks };
}

function formatDate(date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}
