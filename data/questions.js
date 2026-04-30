const QUESTIONS = [
  // ===== 函数与极限 (q001-q010) =====
  {
    id: 'q001', topicId: 'limit', type: 'choice', difficulty: 2,
    stem: '极限 \\lim_{x \\to 0} \\frac{\\sin 3x}{x} 的值为：',
    options: ['0', '1', '3', '\\frac{1}{3}'],
    answer: 2,
    analysis: '\\lim_{x \\to 0} \\frac{\\sin 3x}{x} = 3 \\cdot \\lim_{x \\to 0} \\frac{\\sin 3x}{3x} = 3 \\cdot 1 = 3',
    keyFormula: '\\lim_{x \\to 0} \\frac{\\sin x}{x} = 1'
  },
  {
    id: 'q002', topicId: 'limit', type: 'choice', difficulty: 2,
    stem: '当 x \\to 0 时，下列哪个是 x 的同阶无穷小？',
    options: ['\\sin x', 'x^2', '\\sqrt{x}', '\\ln(1+x)'],
    answer: 0,
    analysis: '当 x \\to 0 时，\\sin x \\sim x，\\ln(1+x) \\sim x。\\sin x 是 x 的同阶无穷小。',
    keyFormula: '\\sin x \\sim x,\\ \\ln(1+x) \\sim x\\ (x \\to 0)'
  },
  {
    id: 'q003', topicId: 'limit', type: 'choice', difficulty: 3,
    stem: '极限 \\lim_{x \\to \\infty} (1 + \\frac{2}{x})^{3x} 的值为：',
    options: ['e^2', 'e^3', 'e^6', 'e^8'],
    answer: 2,
    analysis: '\\lim_{x \\to \\infty} (1 + \\frac{2}{x})^{3x} = \\lim_{x \\to \\infty} [(1 + \\frac{2}{x})^{x}]^3 = (e^2)^3 = e^6',
    keyFormula: '\\lim_{x \\to \\infty} (1 + \\frac{1}{x})^x = e'
  },
  {
    id: 'q004', topicId: 'limit', type: 'fill', difficulty: 1,
    stem: '极限 \\lim_{x \\to 1} (x^2 + 2x - 1) =',
    answer: '2',
    analysis: '直接代入 x=1：1^2 + 2 \\times 1 - 1 = 1 + 2 - 1 = 2',
    keyFormula: ''
  },
  {
    id: 'q005', topicId: 'limit', type: 'choice', difficulty: 3,
    stem: '极限 \\lim_{x \\to 0} \\frac{\\tan x - \\sin x}{x^3} 的值为：',
    options: ['0', '\\frac{1}{2}', '1', '\\frac{1}{3}'],
    answer: 1,
    analysis: '\\tan x - \\sin x = \\frac{\\sin x}{\\cos x} - \\sin x = \\sin x \\cdot \\frac{1 - \\cos x}{\\cos x}。由 1 - \\cos x \\sim \\frac{x^2}{2}，\\sin x \\sim x，得原式 = \\lim_{x \\to 0} \\frac{x \\cdot x^2/2}{x^3} = \\frac{1}{2}',
    keyFormula: '1 - \\cos x \\sim \\frac{x^2}{2}\\ (x \\to 0)'
  },
  {
    id: 'q006', topicId: 'limit', type: 'fill', difficulty: 2,
    stem: '设 f(x) = \\begin{cases} x^2, & x < 1 \\\\ 2x-1, & x \\ge 1 \\end{cases}，则 \\lim_{x \\to 1^-} f(x) =',
    answer: '1',
    analysis: '\\lim_{x \\to 1^-} f(x) = \\lim_{x \\to 1^-} x^2 = 1',
    keyFormula: ''
  },
  {
    id: 'q007', topicId: 'limit', type: 'choice', difficulty: 2,
    stem: '函数 f(x) = \\frac{x^2-1}{x-1} 在 x=1 处的间断点类型是：',
    options: ['可去间断点', '跳跃间断点', '无穷间断点', '振荡间断点'],
    answer: 0,
    analysis: '\\lim_{x \\to 1} \\frac{x^2-1}{x-1} = \\lim_{x \\to 1} (x+1) = 2，极限存在但函数在 x=1 处无定义，故为可去间断点。',
    keyFormula: ''
  },
  {
    id: 'q008', topicId: 'limit', type: 'fill', difficulty: 2,
    stem: '极限 \\lim_{n \\to \\infty} \\frac{n^2 + 3n}{2n^2 - n + 1} =',
    answer: '\\frac{1}{2}',
    analysis: '分子分母同时除以 n^2：\\lim_{n \\to \\infty} \\frac{1 + 3/n}{2 - 1/n + 1/n^2} = \\frac{1}{2}',
    keyFormula: ''
  },
  {
    id: 'q009', topicId: 'limit', type: 'choice', difficulty: 1,
    stem: '下列极限存在的是：',
    options: ['\\lim_{x \\to 0} \\sin \\frac{1}{x}', '\\lim_{x \\to 0} x \\sin \\frac{1}{x}', '\\lim_{x \\to \\infty} \\sin x', '\\lim_{x \\to 0} \\frac{1}{x}'],
    answer: 1,
    analysis: '\\lim_{x \\to 0} x \\sin \\frac{1}{x} = 0（有界函数乘以无穷小仍为无穷小）。其余选项极限均不存在。',
    keyFormula: ''
  },
  {
    id: 'q010', topicId: 'limit', type: 'fill', difficulty: 3,
    stem: '极限 \\lim_{x \\to 0} (1 + 3x)^{\\frac{1}{x}} =',
    answer: 'e^3',
    analysis: '\\lim_{x \\to 0} (1 + 3x)^{\\frac{1}{x}} = \\lim_{x \\to 0} [(1 + 3x)^{\\frac{1}{3x}}]^3 = e^3',
    keyFormula: '\\lim_{x \\to 0} (1 + x)^{\\frac{1}{x}} = e'
  },

  // ===== 导数与微分 (q011-q020) =====
  {
    id: 'q011', topicId: 'derivative', type: 'choice', difficulty: 1,
    stem: '函数 f(x) = x^3 + 2x 在 x=1 处的导数为：',
    options: ['3', '4', '5', '6'],
    answer: 2,
    analysis: 'f\'(x) = 3x^2 + 2，f\'(1) = 3 + 2 = 5',
    keyFormula: '(x^n)\' = nx^{n-1}'
  },
  {
    id: 'q012', topicId: 'derivative', type: 'fill', difficulty: 2,
    stem: '设 y = \\sin(2x+1)，则 \\frac{dy}{dx} =',
    answer: '2\\cos(2x+1)',
    analysis: '由复合函数求导法则，\\frac{d}{dx}\\sin(2x+1) = \\cos(2x+1) \\cdot 2 = 2\\cos(2x+1)',
    keyFormula: ''
  },
  {
    id: 'q013', topicId: 'derivative', type: 'choice', difficulty: 2,
    stem: '曲线 y = x^3 - 3x 在点 (1, -2) 处的切线斜率为：',
    options: ['-3', '0', '3', '6'],
    answer: 1,
    analysis: 'y\' = 3x^2 - 3，在 x=1 处：y\'(1) = 3 - 3 = 0。斜率为 0，切线为水平线。',
    keyFormula: ''
  },
  {
    id: 'q014', topicId: 'derivative', type: 'choice', difficulty: 3,
    stem: '设 y = x^x (x > 0)，则 y\' =',
    options: ['x^x \\ln x', 'x^x (1 + \\ln x)', 'x \\cdot x^{x-1}', 'x^x \\cdot \\frac{1}{x}'],
    answer: 1,
    analysis: '取对数：\\ln y = x \\ln x，两边求导：\\frac{y\'}{y} = \\ln x + 1，故 y\' = x^x(\\ln x + 1)',
    keyFormula: ''
  },
  {
    id: 'q015', topicId: 'derivative', type: 'fill', difficulty: 1,
    stem: '设 f(x) = e^x \\cdot \\sin x，则 f\'(0) =',
    answer: '1',
    analysis: 'f\'(x) = e^x \\sin x + e^x \\cos x = e^x(\\sin x + \\cos x)，f\'(0) = 1 \\times (0 + 1) = 1',
    keyFormula: ''
  },
  {
    id: 'q016', topicId: 'derivative', type: 'fill', difficulty: 2,
    stem: '设 y = \\ln(1+x^2)，则 \\frac{d^2y}{dx^2} 在 x=1 处 =',
    answer: '0',
    analysis: 'y\' = \\frac{2x}{1+x^2}，y\'\' = \\frac{2(1+x^2) - 2x \\cdot 2x}{(1+x^2)^2} = \\frac{2-2x^2}{(1+x^2)^2}。在 x=1 处，y\'\'(1) = \\frac{2-2}{4} = 0',
    keyFormula: ''
  },
  {
    id: 'q017', topicId: 'derivative', type: 'choice', difficulty: 2,
    stem: '函数 f(x) = x^4 - 2x^2 的极值点个数为：',
    options: ['1', '2', '3', '4'],
    answer: 2,
    analysis: 'f\'(x) = 4x^3 - 4x = 4x(x-1)(x+1)，驻点：x=-1, 0, 1。f\'\'(x) = 12x^2-4，x=0 处 f\'\'=-4<0 极大；x=±1 处 f\'\'=8>0 极小。共 3 个极值点。',
    keyFormula: ''
  },
  {
    id: 'q018', topicId: 'derivative', type: 'fill', difficulty: 3,
    stem: '若隐式方程 x^2 + y^2 = 1 确定 y 是 x 的函数，则 \\frac{dy}{dx} =',
    answer: '-\\frac{x}{y}',
    analysis: '两边对 x 求导：2x + 2y \\cdot y\' = 0，故 y\' = -\\frac{x}{y}',
    keyFormula: ''
  },
  {
    id: 'q019', topicId: 'derivative', type: 'choice', difficulty: 1,
    stem: '函数 y = |x| 在 x=0 处：',
    options: ['可导且导数为 1', '可导且导数为 0', '不可导', '可导且导数为 -1'],
    answer: 2,
    analysis: 'y = |x| 在 x=0 处左导数为 -1，右导数为 1，左右导数不相等，故不可导。',
    keyFormula: ''
  },
  {
    id: 'q020', topicId: 'derivative', type: 'fill', difficulty: 2,
    stem: '设 y = x^2 \\cdot e^x，则 dy =',
    answer: '(2x e^x + x^2 e^x) dx',
    analysis: 'dy = (2x \\cdot e^x + x^2 \\cdot e^x) dx = xe^x(2+x) dx',
    keyFormula: ''
  },

  // ===== 不定积分 (q021-q025) =====
  {
    id: 'q021', topicId: 'indefinite-integral', type: 'choice', difficulty: 1,
    stem: '\\int x^2 dx =',
    options: ['\\frac{x^3}{3} + C', '2x + C', '3x^2 + C', '\\frac{x^2}{2} + C'],
    answer: 0,
    analysis: '\\int x^n dx = \\frac{x^{n+1}}{n+1} + C，n=2 代入得 \\frac{x^3}{3} + C',
    keyFormula: '\\int x^n dx = \\frac{x^{n+1}}{n+1} + C'
  },
  {
    id: 'q022', topicId: 'indefinite-integral', type: 'fill', difficulty: 2,
    stem: '\\int \\cos 3x \\, dx =',
    answer: '\\frac{1}{3}\\sin 3x + C',
    analysis: '\\int \\cos(ax) dx = \\frac{1}{a}\\sin(ax) + C，a=3',
    keyFormula: ''
  },
  {
    id: 'q023', topicId: 'indefinite-integral', type: 'choice', difficulty: 2,
    stem: '\\int \\frac{1}{x} dx =',
    options: ['\\frac{1}{x^2} + C', '\\ln|x| + C', 'x + C', 'e^x + C'],
    answer: 1,
    analysis: '\\int \\frac{1}{x} dx = \\ln|x| + C',
    keyFormula: ''
  },
  {
    id: 'q024', topicId: 'indefinite-integral', type: 'fill', difficulty: 3,
    stem: '\\int x e^x dx =',
    answer: 'xe^x - e^x + C',
    analysis: '分部积分：设 u = x, dv = e^x dx，则 du = dx, v = e^x。\\int x e^x dx = x e^x - \\int e^x dx = x e^x - e^x + C',
    keyFormula: '\\int u dv = uv - \\int v du'
  },
  {
    id: 'q025', topicId: 'indefinite-integral', type: 'fill', difficulty: 2,
    stem: '\\int \\frac{1}{1+x^2} dx =',
    answer: '\\arctan x + C',
    analysis: '基本积分公式：\\int \\frac{1}{1+x^2} dx = \\arctan x + C',
    keyFormula: ''
  },

  // ===== 定积分 (q026-q028) =====
  {
    id: 'q026', topicId: 'definite-integral', type: 'fill', difficulty: 2,
    stem: '\\int_0^1 (2x+1) dx =',
    answer: '2',
    analysis: '\\int_0^1 (2x+1) dx = [x^2 + x]_0^1 = 1 + 1 - 0 = 2',
    keyFormula: ''
  },
  {
    id: 'q027', topicId: 'definite-integral', type: 'choice', difficulty: 3,
    stem: '\\int_{-1}^1 x^3 \\cos x \\, dx =',
    options: ['0', '1', '2', '-1'],
    answer: 0,
    analysis: '被积函数 f(x) = x^3\\cos x 是奇函数（x^3 奇，\\cos x 偶，乘积为奇），在对称区间 [-1,1] 上积分为 0。',
    keyFormula: ''
  },
  {
    id: 'q028', topicId: 'definite-integral', type: 'fill', difficulty: 2,
    stem: '由定积分几何意义，\\int_0^2 \\sqrt{4-x^2} \\, dx =',
    answer: '\\pi',
    analysis: 'y = \\sqrt{4-x^2} 表示半径为 2 的上半圆，积分区间 [0,2] 对应第一象限的 1/4 圆面积：\\frac{1}{4} \\cdot \\pi \\cdot 2^2 = \\pi',
    keyFormula: ''
  },

  // ===== 微分方程 (q029-q030) =====
  {
    id: 'q029', topicId: 'diff-eq', type: 'choice', difficulty: 2,
    stem: '微分方程 \\frac{dy}{dx} = 2y 的通解为：',
    options: ['y = e^{2x} + C', 'y = Ce^{2x}', 'y = 2e^x + C', 'y = Ce^{x}'],
    answer: 1,
    analysis: '分离变量：\\frac{dy}{y} = 2dx，积分得 \\ln|y| = 2x + C_1，故 y = Ce^{2x}',
    keyFormula: ''
  },
  {
    id: 'q030', topicId: 'diff-eq', type: 'fill', difficulty: 3,
    stem: '微分方程 y\'\' + y = 0 的通解为 y =',
    answer: 'C_1 \\cos x + C_2 \\sin x',
    analysis: '特征方程 r^2+1=0，r = ±i，通解为 y = C_1\\cos x + C_2\\sin x',
    keyFormula: ''
  }
];
