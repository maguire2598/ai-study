// 高数知识点数据
const TOPICS = [
  {
    id: 'limit',
    title: '函数与极限',
    order: 1,
    dependsOn: [],
    concepts: [
      '函数的概念与性质',
      '数列的极限',
      '函数的极限',
      '无穷小与无穷大',
      '极限运算法则',
      '极限存在准则与两个重要极限',
      '无穷小的比较',
      '函数的连续性'
    ],
    bilibili: {
      url: 'https://www.bilibili.com/video/BV1CAxaeHEeH/',
      teacher: '宋浩老师',
      title: '《高等数学》函数与极限',
      duration: '约 120 分钟'
    },
    icon: '📈'
  },
  {
    id: 'derivative',
    title: '导数与微分',
    order: 2,
    dependsOn: ['limit'],
    concepts: [
      '导数的概念',
      '求导法则',
      '高阶导数',
      '隐函数及参数方程求导',
      '函数的微分'
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
    id: 'mean-value',
    title: '微分中值定理',
    order: 3,
    dependsOn: ['derivative'],
    concepts: [
      '罗尔定理',
      '拉格朗日中值定理',
      '柯西中值定理',
      '洛必达法则',
      '泰勒公式'
    ],
    bilibili: {
      url: 'https://www.bilibili.com/video/BV1CAxaeHEeH/',
      teacher: '宋浩老师',
      title: '《高等数学》微分中值定理',
      duration: '约 100 分钟'
    },
    icon: '📊'
  },
  {
    id: 'indefinite-integral',
    title: '不定积分',
    order: 4,
    dependsOn: ['derivative'],
    concepts: [
      '不定积分的概念与性质',
      '换元积分法',
      '分部积分法',
      '有理函数的积分'
    ],
    bilibili: {
      url: 'https://www.bilibili.com/video/BV1CAxaeHEeH/',
      teacher: '宋浩老师',
      title: '《高等数学》不定积分',
      duration: '约 130 分钟'
    },
    icon: '∫'
  },
  {
    id: 'definite-integral',
    title: '定积分',
    order: 5,
    dependsOn: ['indefinite-integral'],
    concepts: [
      '定积分的概念与性质',
      '微积分基本公式',
      '定积分的换元法和分部积分法',
      '反常积分'
    ],
    bilibili: {
      url: 'https://www.bilibili.com/video/BV1CAxaeHEeH/',
      teacher: '宋浩老师',
      title: '《高等数学》定积分',
      duration: '约 120 分钟'
    },
    icon: '∬'
  },
  {
    id: 'diff-eq',
    title: '微分方程',
    order: 6,
    dependsOn: ['indefinite-integral'],
    concepts: [
      '微分方程的基本概念',
      '可分离变量的微分方程',
      '一阶线性微分方程',
      '二阶常系数线性微分方程'
    ],
    bilibili: {
      url: 'https://www.bilibili.com/video/BV1CAxaeHEeH/',
      teacher: '宋浩老师',
      title: '《高等数学》微分方程',
      duration: '约 100 分钟'
    },
    icon: '🔢'
  },
  {
    id: 'multi-var',
    title: '多元函数微分学',
    order: 7,
    dependsOn: ['derivative'],
    concepts: [
      '多元函数的基本概念',
      '偏导数',
      '全微分',
      '多元复合函数求导',
      '隐函数求导'
    ],
    bilibili: {
      url: 'https://www.bilibili.com/video/BV1CAxaeHEeH/',
      teacher: '宋浩老师',
      title: '《高等数学》多元函数微分学',
      duration: '约 140 分钟'
    },
    icon: '🌐'
  },
  {
    id: 'multi-integral',
    title: '重积分',
    order: 8,
    dependsOn: ['definite-integral', 'multi-var'],
    concepts: [
      '二重积分的概念与性质',
      '二重积分的计算',
      '三重积分',
      '重积分的应用'
    ],
    bilibili: {
      url: 'https://www.bilibili.com/video/BV1CAxaeHEeH/',
      teacher: '宋浩老师',
      title: '《高等数学》重积分',
      duration: '约 120 分钟'
    },
    icon: '📊'
  }
];
