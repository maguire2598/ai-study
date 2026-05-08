// 高数知识点数据 — 基于 Thomas' Calculus 第13版 + GPA3.94高等数学笔记
const TOPICS = [
  {
    id: 'functions',
    title: '函数',
    order: 1,
    dependsOn: [],
    concepts: [
      '函数及其图像',
      '函数的复合与变换',
      '三角函数',
      '指数函数',
      '反函数与对数',
      '函数的变化率'
    ],
    bilibili: {
      url: 'https://www.bilibili.com/video/BV1CAxaeHEeH/',
      teacher: '宋浩老师',
      title: '《高等数学》函数基础',
      duration: '约 90 分钟'
    },
    icon: '📈'
  },
  {
    id: 'limits',
    title: '极限与连续',
    order: 2,
    dependsOn: ['functions'],
    concepts: [
      '变化率与切线',
      '函数的极限及其运算法则',
      '极限的精确性定义',
      '单侧极限',
      '连续性',
      '涉及无穷的极限与渐近线'
    ],
    bilibili: {
      url: 'https://www.bilibili.com/video/BV1CAxaeHEeH/',
      teacher: '宋浩老师',
      title: '《高等数学》极限与连续',
      duration: '约 120 分钟'
    },
    icon: '🔢'
  },
  {
    id: 'derivatives',
    title: '导数',
    order: 3,
    dependsOn: ['limits'],
    concepts: [
      '切线与导数',
      '导函数',
      '求导法则',
      '三角函数导数',
      '链式法则',
      '隐函数求导',
      '反函数与对数求导',
      '反三角函数求导',
      '相关变化率',
      '线性化与微分'
    ],
    bilibili: {
      url: 'https://www.bilibili.com/video/BV1CAxaeHEeH/',
      teacher: '宋浩老师',
      title: '《高等数学》导数与微分',
      duration: '约 150 分钟'
    },
    icon: '📐'
  },
  {
    id: 'derivative-apps',
    title: '导数的应用',
    order: 4,
    dependsOn: ['derivatives'],
    concepts: [
      '函数的极值与最值',
      '四大中值定理',
      '单调性与一阶导数判别法',
      '凹凸性与二阶导数判别法',
      '拐点与函数作图',
      '洛必达法则',
      '牛顿切线法',
      '经济应用（边际分析）'
    ],
    bilibili: {
      url: 'https://www.bilibili.com/video/BV1CAxaeHEeH/',
      teacher: '宋浩老师',
      title: '《高等数学》导数的应用',
      duration: '约 120 分钟'
    },
    icon: '📊'
  },
  {
    id: 'integration',
    title: '积分',
    order: 5,
    dependsOn: ['derivatives'],
    concepts: [
      '面积与定积分',
      '微积分基本定理',
      '不定积分与换元法',
      '定积分的换元法',
      '分部积分法',
      '反常积分'
    ],
    bilibili: {
      url: 'https://www.bilibili.com/video/BV1CAxaeHEeH/',
      teacher: '宋浩老师',
      title: '《高等数学》积分',
      duration: '约 130 分钟'
    },
    icon: '∫'
  },
  {
    id: 'integration-apps',
    title: '积分的应用',
    order: 6,
    dependsOn: ['integration'],
    concepts: [
      '旋转体体积',
      '弧长计算',
      '旋转曲面面积',
      '质心与形心',
      '物理与工程应用'
    ],
    bilibili: {
      url: 'https://www.bilibili.com/video/BV1CAxaeHEeH/',
      teacher: '宋浩老师',
      title: '《高等数学》积分的应用',
      duration: '约 100 分钟'
    },
    icon: '∬'
  },
  {
    id: 'transcendental',
    title: '超越函数',
    order: 7,
    dependsOn: ['integration'],
    concepts: [
      '自然对数与指数函数',
      '指数增长与衰减',
      '反三角函数',
      '双曲函数',
      '相对变化率'
    ],
    bilibili: {
      url: 'https://www.bilibili.com/video/BV1CAxaeHEeH/',
      teacher: '宋浩老师',
      title: '《高等数学》超越函数',
      duration: '约 100 分钟'
    },
    icon: '📉'
  },
  {
    id: 'integration-tech',
    title: '积分技巧',
    order: 8,
    dependsOn: ['integration', 'transcendental'],
    concepts: [
      '三角积分',
      '三角换元',
      '部分分式积分',
      '积分表的使用',
      '数值积分（梯形法则、Euler法）',
      '广义积分'
    ],
    bilibili: {
      url: 'https://www.bilibili.com/video/BV1CAxaeHEeH/',
      teacher: '宋浩老师',
      title: '《高等数学》积分技巧',
      duration: '约 110 分钟'
    },
    icon: '🔣'
  },
  {
    id: 'diff-eq',
    title: '微分方程',
    order: 9,
    dependsOn: ['integration', 'integration-tech'],
    concepts: [
      '微分方程基本概念',
      '一阶线性微分方程',
      '可分离变量方程',
      '欧拉方法',
      '二阶常系数线性方程'
    ],
    bilibili: {
      url: 'https://www.bilibili.com/video/BV1CAxaeHEeH/',
      teacher: '宋浩老师',
      title: '《高等数学》微分方程',
      duration: '约 100 分钟'
    },
    icon: '🔢'
  }
];
