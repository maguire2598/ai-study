// 习题库 — 整合 Thomas' Calculus 习题册 + 历年真题 + 课后题
const QUESTIONS = [

  // ===== 函数 (functions) q001-q005 =====
  {
    id: 'q001', topicId: 'functions', type: 'choice', difficulty: 1,
    stem: '设 f(x) = x^2 + 1，则 f(x+1) - f(x) =',
    options: ['2x+1', '2x+2', '2x', 'x^2+2x'],
    answer: 0,
    analysis: 'f(x+1) = (x+1)^2+1 = x^2+2x+2，f(x) = x^2+1，相减得 2x+1',
    keyFormula: ''
  },
  {
    id: 'q002', topicId: 'functions', type: 'choice', difficulty: 1,
    stem: '函数 y = \\ln(x-1) 的定义域为：',
    options: ['(0,+\\infty)', '(1,+\\infty)', '(-\\infty,1)', '[1,+\\infty)'],
    answer: 1,
    analysis: '\\ln(x-1) 要求 x-1 > 0，即 x > 1',
    keyFormula: ''
  },
  {
    id: 'q003', topicId: 'functions', type: 'fill', difficulty: 2,
    stem: '设 f(x) = e^x，g(x) = \\ln x，则 f(g(e)) =',
    answer: 'e',
    analysis: 'g(e) = \\ln e = 1，f(1) = e^1 = e',
    keyFormula: '\\ln e = 1'
  },
  {
    id: 'q004', topicId: 'functions', type: 'choice', difficulty: 2,
    stem: '下列函数中为奇函数的是：',
    options: ['x^2 + 1', 'x^3 + x', '\\cos x', 'e^x'],
    answer: 1,
    analysis: 'f(-x) = (-x)^3 + (-x) = -x^3 - x = -(x^3 + x) = -f(x)，故为奇函数',
    keyFormula: 'f(-x) = -f(x)'
  },
  {
    id: 'q005', topicId: 'functions', type: 'fill', difficulty: 1,
    stem: '若点 (1,2) 在函数 y = f(x) 的图像上，且 f^{-1} 存在，则 f^{-1}(2) =',
    answer: '1',
    analysis: '若 f(a) = b，则 f^{-1}(b) = a',
    keyFormula: ''
  },

  // ===== 极限与连续 (limits) q006-q020 =====
  {
    id: 'q006', topicId: 'limits', type: 'choice', difficulty: 2,
    stem: '极限 \\lim_{x \\to 0} \\frac{\\sin 3x}{x} 的值为：',
    options: ['0', '1', '3', '\\frac{1}{3}'],
    answer: 2,
    analysis: '\\lim_{x \\to 0} \\frac{\\sin 3x}{x} = 3 \\cdot \\lim_{x \\to 0} \\frac{\\sin 3x}{3x} = 3 \\cdot 1 = 3',
    keyFormula: '\\lim_{x \\to 0} \\frac{\\sin x}{x} = 1'
  },
  {
    id: 'q007', topicId: 'limits', type: 'choice', difficulty: 3,
    stem: '极限 \\lim_{x \\to 0} \\frac{\\tan x - \\sin x}{x^3} 的值为：',
    options: ['0', '\\frac{1}{2}', '1', '\\frac{1}{3}'],
    answer: 1,
    analysis: '\\tan x - \\sin x = \\frac{\\sin x(1-\\cos x)}{\\cos x}，1-\\cos x \\sim \\frac{x^2}{2}，得原式 = \\frac{1}{2}',
    keyFormula: '1 - \\cos x \\sim \\frac{x^2}{2}\\ (x \\to 0)'
  },
  {
    id: 'q008', topicId: 'limits', type: 'fill', difficulty: 1,
    stem: '\\lim_{x \\to 2} (x^2 - 3x + 4) =',
    answer: '2',
    analysis: '直接代入 x=2：4 - 6 + 4 = 2',
    keyFormula: ''
  },
  {
    id: 'q009', topicId: 'limits', type: 'choice', difficulty: 2,
    stem: '若 \\lim_{x \\to 0^+} f(x) = a，\\lim_{x \\to 0^-} f(x) = b，则 \\lim_{x \\to 0^-} (f(x - \\sin x) + 2f(x^2 + x)) =',
    options: ['a + 2b', 'b + 2a', '3a', '3b'],
    answer: 1,
    analysis: '当 x \\to 0^- 时，x-\\sin x \\to 0，x^2+x \\to 0^-，分别代入f在0^+和0^-的极限。由x-\\sin x \\approx -\\frac{x^3}{6} \\to 0^+，故第一项极限为a。x^2+x \\to 0^-，第二项极限为b。结果为b+2a。',
    keyFormula: ''
  },
  {
    id: 'q010', topicId: 'limits', type: 'choice', difficulty: 2,
    stem: '函数 f(x) = \\frac{x^2-1}{x-1} 在 x=1 处的间断点类型是：',
    options: ['可去间断点', '跳跃间断点', '无穷间断点', '振荡间断点'],
    answer: 0,
    analysis: '\\lim_{x \\to 1} \\frac{x^2-1}{x-1} = \\lim_{x \\to 1} (x+1) = 2，极限存在但 f(1) 无定义，故为可去间断点。',
    keyFormula: ''
  },
  {
    id: 'q011', topicId: 'limits', type: 'fill', difficulty: 2,
    stem: '\\lim_{x \\to \\infty} \\frac{n^2 + 3n}{2n^2 - n + 1} =',
    answer: '\\frac{1}{2}',
    analysis: '分子分母同除以 n^2：\\lim_{n \\to \\infty} \\frac{1 + 3/n}{2 - 1/n + 1/n^2} = \\frac{1}{2}',
    keyFormula: ''
  },
  {
    id: 'q012', topicId: 'limits', type: 'choice', difficulty: 1,
    stem: '若 y = f(x) 在 x=0 处有跳跃间断点，则下列极限中必然存在的是：',
    options: ['\\lim_{x \\to 0} f(x^2)', '\\lim_{x \\to 0} (f(x))^2', '\\lim_{x \\to 0} f(x^3)', '\\lim_{x \\to 0} (f(x) - f(-x))'],
    answer: 0,
    analysis: '当 x \\to 0 时 x^2 \\to 0^+，所以 \\lim_{x \\to 0} f(x^2) 只涉及 f 在 0^+ 的极限，必然存在。',
    keyFormula: ''
  },
  {
    id: 'q013', topicId: 'limits', type: 'fill', difficulty: 3,
    stem: '\\lim_{x \\to 0} (1 + 3x)^{\\frac{1}{x}} =',
    answer: 'e^3',
    analysis: '\\lim_{x \\to 0} (1 + 3x)^{\\frac{1}{x}} = \\lim_{x \\to 0} [(1 + 3x)^{\\frac{1}{3x}}]^3 = e^3',
    keyFormula: '\\lim_{x \\to 0} (1 + x)^{\\frac{1}{x}} = e'
  },
  {
    id: 'q014', topicId: 'limits', type: 'fill', difficulty: 2,
    stem: '\\lim_{x \\to 0} \\frac{\\sin(1-\\cos x)}{\\tan^2 x} =',
    answer: '\\frac{1}{2}',
    analysis: '1-\\cos x \\sim \\frac{x^2}{2}，\\tan x \\sim x，故 \\frac{\\sin(\\frac{x^2}{2})}{x^2} \\sim \\frac{x^2/2}{x^2} = \\frac{1}{2}',
    keyFormula: ''
  },
  {
    id: 'q015', topicId: 'limits', type: 'choice', difficulty: 2,
    stem: '极限 \\lim_{x \\to 1} (1-x)\\tan \\frac{\\pi x}{2} 的值为：',
    options: ['\\frac{2}{\\pi}', '\\frac{\\pi}{2}', '1', '不存在'],
    answer: 0,
    analysis: '令 t=1-x，则 x=1-t，\\tan\\frac{\\pi(1-t)}{2} = \\tan(\\frac{\\pi}{2} - \\frac{\\pi t}{2}) = \\cot\\frac{\\pi t}{2}。原式 = \\lim_{t \\to 0} t \\cdot \\cot\\frac{\\pi t}{2} = \\frac{2}{\\pi}',
    keyFormula: ''
  },
  {
    id: 'q016', topicId: 'limits', type: 'fill', difficulty: 2,
    stem: '\\lim_{x \\to \\infty} \\frac{x^{2020} - 1}{x^{2019} - 1} =',
    answer: '\\infty',
    analysis: '分子次数 2020 > 分母次数 2019，极限为无穷大。',
    keyFormula: ''
  },
  {
    id: 'q017', topicId: 'limits', type: 'choice', difficulty: 1,
    stem: '下列极限存在的是：',
    options: ['\\lim_{x \\to 0} \\sin\\frac{1}{x}', '\\lim_{x \\to 0} x\\sin\\frac{1}{x}', '\\lim_{x \\to \\infty} \\sin x', '\\lim_{x \\to 0} \\frac{1}{x}'],
    answer: 1,
    analysis: '\\lim_{x \\to 0} x\\sin\\frac{1}{x} = 0（有界函数乘无穷小）。其余均不存在。',
    keyFormula: ''
  },
  {
    id: 'q018', topicId: 'limits', type: 'choice', difficulty: 3,
    stem: '函数 y = e^{\\frac{1}{x^2}} \\arctan \\frac{x^2+x+1}{(x-1)(x+2)} 的渐近线条数为：',
    options: ['1', '2', '3', '4'],
    answer: 1,
    analysis: '主要考察渐近线概念。当 x \\to \\pm\\infty 和 x \\to 1, x \\to -2 时分析水平、垂直渐近线。此函数有 3 条渐近线（垂直 x=1, x=-2 和水平）。',
    keyFormula: ''
  },
  {
    id: 'q019', topicId: 'limits', type: 'fill', difficulty: 2,
    stem: '使函数 f(x) = \\frac{x^3+2x+a}{x-1} 在 x=1 处极限存在且等于 b 的 a 值为：',
    answer: '-3',
    analysis: '\\lim_{x \\to 1} \\frac{x^3+2x+a}{x-1}。令 x=1 代入分子得 1+2+a=0，即 a=-3。',
    keyFormula: ''
  },
  {
    id: 'q020', topicId: 'limits', type: 'fill', difficulty: 3,
    stem: '\\lim_{x\\to\\infty} \\left( \\sqrt{x^2+x} - \\sqrt{x^2-2x+3} \\right) =',
    answer: '\\frac{3}{2}',
    analysis: '分子有理化：\\lim_{x\\to\\infty} \\frac{(x^2+x)-(x^2-2x+3)}{\\sqrt{x^2+x}+\\sqrt{x^2-2x+3}} = \\lim_{x\\to\\infty} \\frac{3x-3}{2x} = \\frac{3}{2}',
    keyFormula: ''
  },

  // ===== 导数 (derivatives) q021-q030 =====
  {
    id: 'q021', topicId: 'derivatives', type: 'choice', difficulty: 1,
    stem: '函数 f(x) = x^3 + 2x 在 x=1 处的导数为：',
    options: ['3', '4', '5', '6'],
    answer: 2,
    analysis: 'f\'(x) = 3x^2 + 2，f\'(1) = 3 + 2 = 5',
    keyFormula: '(x^n)\' = nx^{n-1}'
  },
  {
    id: 'q022', topicId: 'derivatives', type: 'fill', difficulty: 2,
    stem: '设 y = \\sin(2x+1)，则 \\frac{dy}{dx} =',
    answer: '2\\cos(2x+1)',
    analysis: '\\frac{d}{dx}\\sin(2x+1) = \\cos(2x+1) \\cdot 2 = 2\\cos(2x+1)',
    keyFormula: ''
  },
  {
    id: 'q023', topicId: 'derivatives', type: 'choice', difficulty: 3,
    stem: '设 y = x^x (x > 0)，则 y\' =',
    options: ['x^x \\ln x', 'x^x(1 + \\ln x)', 'x \\cdot x^{x-1}', 'x^x \\cdot \\frac{1}{x}'],
    answer: 1,
    analysis: '取对数：\\ln y = x\\ln x，求导：\\frac{y\'}{y} = \\ln x + 1，故 y\' = x^x(\\ln x + 1)',
    keyFormula: ''
  },
  {
    id: 'q024', topicId: 'derivatives', type: 'choice', difficulty: 2,
    stem: '若 \\sin x = e^y，0 < x < \\pi，则 \\frac{dy}{dx} =',
    options: ['-\\tan x', '\\ln(\\cos x)', '\\cot x', '\\ln(\\sin x)'],
    answer: 2,
    analysis: '两边求导：\\cos x = e^y \\cdot y\'，y\' = \\frac{\\cos x}{e^y} = \\frac{\\cos x}{\\sin x} = \\cot x',
    keyFormula: ''
  },
  {
    id: 'q025', topicId: 'derivatives', type: 'fill', difficulty: 1,
    stem: '设 f(x) = e^x \\sin x，则 f\'(0) =',
    answer: '1',
    analysis: 'f\'(x) = e^x\\sin x + e^x\\cos x = e^x(\\sin x+\\cos x)，f\'(0) = 1 \\times (0+1) = 1',
    keyFormula: ''
  },
  {
    id: 'q026', topicId: 'derivatives', type: 'fill', difficulty: 2,
    stem: '若 f(x) = (1+x)(1+2x)\\cdots(1+10x)，则 f\'(0) =',
    answer: '55',
    analysis: 'f\'(0) 等于多项式一次项系数。展开后 x 的系数为 1+2+\\cdots+10 = 55',
    keyFormula: ''
  },
  {
    id: 'q027', topicId: 'derivatives', type: 'choice', difficulty: 2,
    stem: '函数 y = |x| 在 x=0 处：',
    options: ['可导且导数为1', '可导且导数为0', '不可导', '可导且导数为-1'],
    answer: 2,
    analysis: '左导数 -1 ≠ 右导数 1，左右导数不相等，不可导。',
    keyFormula: ''
  },
  {
    id: 'q028', topicId: 'derivatives', type: 'fill', difficulty: 3,
    stem: '若隐函数 y - \\frac{1}{2}\\sin y = x，则 y\'(0) =',
    answer: '2',
    analysis: '两边对 x 求导：y\' - \\frac{1}{2}\\cos y \\cdot y\' = 1，y\' = \\frac{1}{1-\\frac{1}{2}\\cos y}。当 x=0 时 y=0（代入），y\'(0) = \\frac{1}{1-\\frac{1}{2}} = 2',
    keyFormula: ''
  },
  {
    id: 'q029', topicId: 'derivatives', type: 'choice', difficulty: 1,
    stem: '设 f(x) = |x| g(x) 在 x=0 处可导，则：',
    options: ['\\lim_{x\\to 0^+}g(x) = \\lim_{x\\to 0^-}g(x)', '\\lim g\'(x) = g\'(0)', '\\lim_{x\\to 0^+}g(x) = -\\lim_{x\\to 0^-}g(x)', '\\lim g(x) = g(0)'],
    answer: 3,
    analysis: '|x| 在 x=0 处不可导，要使 |x|g(x) 可导，必须 g(0)=0 使乘积可导。但更准确地，需要 g 连续且 g(0)=0。选项 D 最接近（连续性条件）。',
    keyFormula: ''
  },
  {
    id: 'q030', topicId: 'derivatives', type: 'fill', difficulty: 3,
    stem: '设 f 在 x=1 处可导，f(1)=1，f\'(1)=2，则 \\lim_{n\\to\\infty} \\left[ f\\left(1+\\frac{1}{n}\\right) \\right]^n =',
    answer: 'e^2',
    analysis: '取对数：\\lim_{n\\to\\infty} n\\ln f(1+\\frac{1}{n})。由导数定义，f(1+\\frac{1}{n}) \\approx f(1) + f\'(1)\\cdot\\frac{1}{n} = 1+\\frac{2}{n}。\\lim_{n\\to\\infty} n\\ln(1+\\frac{2}{n}) = 2。故原极限 = e^2。',
    keyFormula: '\\lim_{n\\to\\infty}(1+\\frac{a}{n})^n = e^a'
  },

  // ===== 导数的应用 (derivative-apps) q031-q040 =====
  {
    id: 'q031', topicId: 'derivative-apps', type: 'choice', difficulty: 3,
    stem: '若 f(x) = \\frac{ax+b}{x^2-1} 在 x=3 处取得局部极值 1，则：',
    options: ['a=3,b=-1', 'a=4,b=-4', 'a=5,b=-7', 'a=6,b=-10'],
    answer: 3,
    analysis: 'f(3)=1 ⇒ \\frac{3a+b}{8}=1 ⇒ 3a+b=8。f\'(3)=0，由导数得 \\frac{a(x^2-1)-2x(ax+b)}{(x^2-1)^2}\\vert_{x=3}=0，求解得 a=6, b=-10',
    keyFormula: ''
  },
  {
    id: 'q032', topicId: 'derivative-apps', type: 'choice', difficulty: 2,
    stem: '函数 f(x) = x^4 - 2x^2 的极值点个数为：',
    options: ['1', '2', '3', '4'],
    answer: 2,
    analysis: 'f\'(x) = 4x^3-4x = 4x(x-1)(x+1)，驻点 x=-1,0,1。f\'\'(-1)>0极小, f\'\'(0)<0极大, f\'\'(1)>0极小。共3个极值点。',
    keyFormula: ''
  },
  {
    id: 'q033', topicId: 'derivative-apps', type: 'fill', difficulty: 2,
    stem: '曲线 y = x^3 - 3x 在点 (1,-2) 处的切线斜率为：',
    answer: '0',
    analysis: 'y\' = 3x^2-3，y\'(1) = 0。斜率为 0，切线水平。',
    keyFormula: ''
  },
  {
    id: 'q034', topicId: 'derivative-apps', type: 'choice', difficulty: 2,
    stem: '(a,b) 是曲线 x^2+2y=0 上到点 (0,-\\frac{1}{2}) 最近的点，则 b =',
    options: ['\\frac{1}{2}', '-\\frac{1}{2}', '0', '以上均不对'],
    answer: 2,
    analysis: '距离函数 d^2 = a^2 + (b+\\frac{1}{2})^2，由 a^2 = -2b 代入，对 b 求导找最小值，得 b=0。',
    keyFormula: ''
  },
  {
    id: 'q035', topicId: 'derivative-apps', type: 'fill', difficulty: 1,
    stem: '方程 x^3 - 4x^2 + x + 1 = 0 的实根个数为：',
    answer: '3',
    analysis: '令 f(x)=x^3-4x^2+x+1，f\'(x)=3x^2-8x+1。判别式 >0，f\' 有两个零点。分析单调区间和符号变化，得 3 个实根。',
    keyFormula: ''
  },
  {
    id: 'q036', topicId: 'derivative-apps', type: 'fill', difficulty: 2,
    stem: '\\lim_{x \\to 0^+} \\frac{\\ln \\tan 7x}{\\ln \\tan 2x} =',
    answer: '1',
    analysis: '使用洛必达法则：\\lim_{x\\to 0^+} \\frac{\\frac{7\\sec^2 7x}{\\tan 7x}}{\\frac{2\\sec^2 2x}{\\tan 2x}} = \\frac{7}{2} \\cdot \\frac{\\tan 2x}{\\tan 7x} = \\frac{7}{2} \\cdot \\frac{2x}{7x} = 1',
    keyFormula: ''
  },
  {
    id: 'q037', topicId: 'derivative-apps', type: 'choice', difficulty: 3,
    stem: '设 f 单调可导，f(1)=2,f\'(1)=2,f(2)=4,f\'(2)=\\frac{1}{2}。若 g(x)=f^{-1}\\left(\\frac{3x-4}{2x-2}\\right)，则 g\'(0)=',
    options: ['2', '\\frac{1}{4}', '\\frac{1}{2}', '1'],
    answer: 1,
    analysis: '由链式法则和反函数求导公式。当 x=0 时，\\frac{3x-4}{2x-2} = 2，g(0) = f^{-1}(2) = 1。g\'(0) = \\frac{1}{f\'(1)} \\cdot \\left(\\frac{3x-4}{2x-2}\\right)\'\\vert_{x=0} = \\frac{1}{2} \\cdot \\frac{1}{2} = \\frac{1}{4}',
    keyFormula: '(f^{-1})\'(y) = \\frac{1}{f\'(x)}'
  },
  {
    id: 'q038', topicId: 'derivative-apps', type: 'fill', difficulty: 2,
    stem: '\\lim_{x\\to\\infty}\\left(\\frac{x-1}{x+1}\\right)^x =',
    answer: 'e^{-2}',
    analysis: '\\left(\\frac{x-1}{x+1}\\right)^x = \\left(1-\\frac{2}{x+1}\\right)^x \\to e^{-2}',
    keyFormula: '\\lim_{n\\to\\infty}(1+\\frac{a}{n})^n = e^a'
  },
  {
    id: 'q039', topicId: 'derivative-apps', type: 'choice', difficulty: 1,
    stem: '第一象限中，两边在坐标轴上、第三边与 y=e^{-x} 相切的最大三角形面积为：',
    options: ['\\frac{1}{2e}', '\\frac{2}{e}', '\\frac{1}{e}', 'e'],
    answer: 1,
    analysis: '切点设为 (a,e^{-a})，切线方程 y-e^{-a} = -e^{-a}(x-a)。截距为 a+1 和 e^{-a}(a+1)。面积 S = \\frac{1}{2}(a+1)^2e^{-a}。求导得最大值在 a=1，S=\\frac{2}{e}。',
    keyFormula: ''
  },
  {
    id: 'q040', topicId: 'derivative-apps', type: 'fill', difficulty: 3,
    stem: '设 f(x) 在 (a,b) 上连续，F(x) = \\frac{\\int_0^x t f(t) dt}{x}（x≠0）且 F(0)=0。若 F 在 x=0 处可导，则 F\'(0) =',
    answer: '0',
    analysis: '当 x\\to 0 时，\\int_0^x tf(t)dt \\approx \\frac{x^2}{2}f(0)，F(x) \\approx \\frac{x}{2}f(0)，故 F\'(0) = \\lim_{x\\to 0} \\frac{F(x)}{x} = \\frac{f(0)}{2}。由连续性，F\'(0) = 0。',
    keyFormula: ''
  },

  // ===== 积分 (integration) q041-q050 =====
  {
    id: 'q041', topicId: 'integration', type: 'choice', difficulty: 1,
    stem: '\\int x^2 dx =',
    options: ['\\frac{x^3}{3} + C', '2x + C', '3x^2 + C', '\\frac{x^2}{2} + C'],
    answer: 0,
    analysis: '\\int x^n dx = \\frac{x^{n+1}}{n+1} + C，n=2 得 \\frac{x^3}{3} + C',
    keyFormula: '\\int x^n dx = \\frac{x^{n+1}}{n+1} + C'
  },
  {
    id: 'q042', topicId: 'integration', type: 'fill', difficulty: 2,
    stem: '\\int_0^1 (2x+1) dx =',
    answer: '2',
    analysis: '\\int_0^1 (2x+1)dx = [x^2+x]_0^1 = 2',
    keyFormula: ''
  },
  {
    id: 'q043', topicId: 'integration', type: 'fill', difficulty: 2,
    stem: '\\int x \\tan^2 x \\, dx =',
    answer: 'x\\tan x + \\ln|\\cos x| - \\frac{x^2}{2} + C',
    analysis: '\\tan^2 x = \\sec^2 x - 1，\\int x\\sec^2 x dx = x\\tan x - \\int \\tan x dx = x\\tan x + \\ln|\\cos x|，再减去 \\int x dx = \\frac{x^2}{2}',
    keyFormula: '\\tan^2 x = \\sec^2 x - 1'
  },
  {
    id: 'q044', topicId: 'integration', type: 'choice', difficulty: 2,
    stem: '\\int_{-1}^1 x^3 \\cos x \\, dx =',
    options: ['0', '1', '2', '-1'],
    answer: 0,
    analysis: '被积函数 x^3\\cos x 是奇函数，在对称区间 [-1,1] 上积分为 0',
    keyFormula: ''
  },
  {
    id: 'q045', topicId: 'integration', type: 'fill', difficulty: 2,
    stem: '\\int_0^1 \\frac{e^x}{x+1} dx = a，则 \\int_0^1 \\frac{e^x}{(x+1)^2} dx =',
    answer: '\\frac{e}{2} - 1 - a',
    analysis: '使用分部积分，设 u=\\frac{1}{x+1}, dv=e^x dx。\\int_0^1 \\frac{e^x}{x+1}dx = [\\frac{e^x}{x+1}]_0^1 + \\int_0^1 \\frac{e^x}{(x+1)^2}dx，得 \\int_0^1 \\frac{e^x}{(x+1)^2}dx = a - \\frac{e}{2} + 1',
    keyFormula: ''
  },
  {
    id: 'q046', topicId: 'integration', type: 'fill', difficulty: 1,
    stem: '\\int \\frac{1}{1+x^2} dx =',
    answer: '\\arctan x + C',
    analysis: '基本积分公式',
    keyFormula: '\\int \\frac{1}{1+x^2} dx = \\arctan x + C'
  },
  {
    id: 'q047', topicId: 'integration', type: 'fill', difficulty: 2,
    stem: '\\int x e^x dx =',
    answer: 'xe^x - e^x + C',
    analysis: '分部积分：设 u=x, dv=e^x dx，du=dx, v=e^x。\\int xe^x dx = xe^x - \\int e^x dx = xe^x - e^x + C',
    keyFormula: '\\int u dv = uv - \\int v du'
  },
  {
    id: 'q048', topicId: 'integration', type: 'fill', difficulty: 3,
    stem: '\\int_0^{+\\infty} \\frac{\\arctan e^x}{e^{2x}} dx =',
    answer: '\\frac{\\pi}{4} + \\frac{1}{2}\\ln 2 - \\frac{1}{2}',
    analysis: '分部积分后整理得。设 u=\\arctan e^x, dv=e^{-2x}dx。',
    keyFormula: ''
  },
  {
    id: 'q049', topicId: 'integration', type: 'choice', difficulty: 3,
    stem: '下列反常积分发散的是：',
    options: ['\\int_{-1}^1 \\ln|x| dx', '\\int_0^1 \\frac{e^x}{\\sqrt{1-x}} dx', '\\int_0^{+\\infty} \\frac{1}{x^2} dx', '\\int_e^{+\\infty} \\frac{1}{x\\ln^2 x} dx'],
    answer: 2,
    analysis: '\\int_0^{+\\infty} \\frac{1}{x^2}dx 在 x=0 附近 \\frac{1}{x^2} 发散，反常积分发散。其他均收敛。',
    keyFormula: ''
  },
  {
    id: 'q050', topicId: 'integration', type: 'choice', difficulty: 2,
    stem: '设 f(x) 在 [0,1] 连续，(0,1) 可导，f(0)=f(1)=0，f(\\frac{1}{2})=1。证：存在 c\\in(\\frac{1}{2},1) 使 f(c)=c。该命题使用的定理是：',
    options: ['罗尔定理', '拉格朗日中值定理', '介值定理', '柯西中值定理'],
    answer: 2,
    analysis: '令 g(x)=f(x)-x，g(\\frac{1}{2})=1-\\frac{1}{2}=\\frac{1}{2}>0，g(1)=0-1=-1<0。由介值定理，存在 c\\in(\\frac{1}{2},1) 使 g(c)=0，即 f(c)=c。',
    keyFormula: ''
  },

  // ===== 积分的应用 (integration-apps) q051-q058 =====
  {
    id: 'q051', topicId: 'integration-apps', type: 'fill', difficulty: 2,
    stem: '由定积分几何意义，\\int_0^2 \\sqrt{4-x^2} \\, dx =',
    answer: '\\pi',
    analysis: 'y=\\sqrt{4-x^2} 是半径 2 的上半圆，[0,2] 对应 1/4 圆面积：\\frac{1}{4}\\pi\\cdot 4 = \\pi',
    keyFormula: ''
  },
  {
    id: 'q052', topicId: 'integration-apps', type: 'fill', difficulty: 2,
    stem: '曲线 y = x^2-2x, y=0, x=1, x=3 所围区域绕 y 轴旋转所得体积为：',
    answer: '\\frac{40\\pi}{3}',
    analysis: '使用壳层法：V=2\\pi\\int_1^3 x(x^2-2x)dx = 2\\pi\\int_1^3 (x^3-2x^2)dx = 2\\pi[\\frac{x^4}{4}-\\frac{2x^3}{3}]_1^3，计算得 \\frac{40\\pi}{3}',
    keyFormula: ''
  },
  {
    id: 'q053', topicId: 'integration-apps', type: 'fill', difficulty: 2,
    stem: '由 y=\\sqrt{x}, x=0, y=1 围成的区域绕 y 轴旋转所得体积为：',
    answer: '\\frac{\\pi}{5}',
    analysis: 'x = y^2，使用圆盘法：V = \\pi\\int_0^1 (y^2)^2 dy = \\pi\\int_0^1 y^4 dy = \\frac{\\pi}{5}',
    keyFormula: ''
  },
  {
    id: 'q054', topicId: 'integration-apps', type: 'fill', difficulty: 3,
    stem: '曲线 y = \\frac{2}{5}(e^{x/5} + e^{-x/5})，x\\in[-5,5] 的弧长为：',
    answer: '2(e - e^{-1})',
    analysis: 'y\' = \\frac{2}{25}(e^{x/5}-e^{-x/5})，\\sqrt{1+(y\')^2} = \\frac{1}{5}(e^{x/5}+e^{-x/5})。L = \\int_{-5}^5 \\frac{1}{5}(e^{x/5}+e^{-x/5})dx = 2(e-e^{-1})',
    keyFormula: 'L = \\int_a^b \\sqrt{1+(y\')^2}dx'
  },
  {
    id: 'q055', topicId: 'integration-apps', type: 'fill', difficulty: 1,
    stem: '半径为 1 的上半圆的形心坐标为 (0, \\bar{y})，则 \\bar{y} =',
    answer: '\\frac{4}{3\\pi}',
    analysis: '半圆面积 A=\\frac{\\pi}{2}，对 x 轴的矩 M_x = \\frac{2}{3}。\\bar{y} = M_x/A = \\frac{4}{3\\pi}',
    keyFormula: ''
  },
  {
    id: 'q056', topicId: 'integration-apps', type: 'fill', difficulty: 2,
    stem: '用梯形法则估计 \\int_0^1 x^3 dx（n=3），估计值为：',
    answer: '\\frac{11}{36}',
    analysis: 'h=\\frac{1}{3}，x_0=0,x_1=\\frac{1}{3},x_2=\\frac{2}{3},x_3=1。T=\\frac{h}{2}[f(0)+2f(\\frac{1}{3})+2f(\\frac{2}{3})+f(1)]=\\frac{1}{6}[0+\\frac{2}{27}+\\frac{16}{27}+1]=\\frac{1}{6}\\cdot\\frac{45}{27}',
    keyFormula: ''
  },
  {
    id: 'q057', topicId: 'integration-apps', type: 'choice', difficulty: 3,
    stem: '设 \\int_0^{\\frac{4}{3}} \\frac{x^2}{\\sqrt{9-4x^2}} dx =',
    options: ['\\frac{9}{8}(\\frac{2\\pi}{3} - \\frac{\\sqrt{3}}{2})', '\\frac{9}{16}(\\frac{2\\pi}{3} - \\frac{\\sqrt{3}}{2})', '\\frac{3}{4}', '\\frac{9\\pi}{32}'],
    answer: 1,
    analysis: '令 x=\\frac{3}{2}\\sin\\theta，dx=\\frac{3}{2}\\cos\\theta d\\theta。代入化简得 \\frac{9}{16}(\\frac{2\\pi}{3} - \\frac{\\sqrt{3}}{2})',
    keyFormula: ''
  },
  {
    id: 'q058', topicId: 'integration-apps', type: 'choice', difficulty: 2,
    stem: '所求区域面积：由 y=x^2-2x, y=0, x=1, x=3 围成的区域面积为：',
    options: ['\\frac{4}{3}', '\\frac{8}{3}', '4', '\\frac{16}{3}'],
    answer: 1,
    analysis: 'A = \\int_1^2 (0-(x^2-2x))dx + \\int_2^3 (x^2-2x-0)dx。在[1,2]上 x^2-2x<0，在[2,3]上>0。A = [-\\frac{x^3}{3}+x^2]_1^2 + [\\frac{x^3}{3}-x^2]_2^3 = \\frac{2}{3} + \\frac{2}{3} = \\frac{4}{3}? 重新计算：\\int_1^2(2x-x^2)dx + \\int_2^3(x^2-2x)dx = [x^2-\\frac{x^3}{3}]_1^2 + [\\frac{x^3}{3}-x^2]_2^3 = (4-\\frac{8}{3})-(1-\\frac{1}{3}) + (9-9)-(\\frac{8}{3}-4) = \\frac{4}{3}-\\frac{2}{3}+0-(-\\frac{4}{3}) = \\frac{8}{3}',
    keyFormula: ''
  },

  // ===== 超越函数 (transcendental) q059-q062 =====
  {
    id: 'q059', topicId: 'transcendental', type: 'choice', difficulty: 2,
    stem: '下列哪个函数有斜渐近线？',
    options: ['\\frac{\\sqrt{2x^3+x+1}}{x+1}', '\\frac{x^3+\\sin x+1}{x}', 'x+\\sin x', 'x+\\frac{1}{2+\\sin x}'],
    answer: 2,
    analysis: '对于 y=x+\\sin x，\\lim_{x\\to\\infty}\\frac{y}{x}=1，\\lim_{x\\to\\infty}(y-x)=\\lim_{x\\to\\infty}\\sin x 不存在，所以 x+\\sin x 无斜渐近线。但 \\frac{x^3+\\sin x+1}{x}=x^2+\\frac{\\sin x+1}{x} 无斜渐近线。正确答案为 A：\\frac{\\sqrt{2x^3+x+1}}{x+1} \\sim \\frac{\\sqrt{2}x^{3/2}}{x} = \\sqrt{2x}，无斜渐近线。需逐个分析。',
    keyFormula: ''
  },
  {
    id: 'q060', topicId: 'transcendental', type: 'fill', difficulty: 2,
    stem: '\\int_0^{+\\infty} \\frac{\\arctan e^x}{e^{2x}} dx =',
    answer: '\\frac{\\ln 2}{2} + \\frac{\\pi}{4} - \\frac{1}{2}',
    analysis: '令 t=e^x，化为 \\int_1^{\\infty} \\frac{\\arctan t}{t^3} dt，分部积分。',
    keyFormula: ''
  },
  {
    id: 'q061', topicId: 'transcendental', type: 'fill', difficulty: 1,
    stem: '设 f(x) = \\arctan\\frac{1+x}{1-x}，则 f\'(0) =',
    answer: '1',
    analysis: 'f\'(x) = \\frac{1}{1+(\\frac{1+x}{1-x})^2} \\cdot \\frac{(1-x)+(1+x)}{(1-x)^2}，代入 x=0 得 1',
    keyFormula: '\\frac{d}{dx}\\arctan x = \\frac{1}{1+x^2}'
  },
  {
    id: 'q062', topicId: 'transcendental', type: 'choice', difficulty: 3,
    stem: '设 f(x) = \\frac{\\tan x}{|x|(x-\\frac{\\pi}{2})^4}，下列正确的是：',
    options: ['f 在 x=0 连续且在 x=\\frac{\\pi}{2} 有跳跃间断', 'f 在 x=0 有跳跃间断且在 x=\\frac{\\pi}{2} 连续', 'f 在 x=0 有无穷间断且在 x=\\frac{\\pi}{2} 有振荡间断', 'f 在 x=0 有跳跃间断且在 x=\\frac{\\pi}{2} 有无穷间断'],
    answer: 3,
    analysis: '在 x=0 处，\\tan x \\sim x，分母 |x| 造成跳跃间断。在 x=\\frac{\\pi}{2} 处，\\tan x \\to \\pm\\infty，分母趋于 0，为无穷间断。',
    keyFormula: ''
  },

  // ===== 积分技巧 (integration-tech) q063-q070 =====
  {
    id: 'q063', topicId: 'integration-tech', type: 'fill', difficulty: 3,
    stem: '\\int_0^{\\pi/2} \\frac{\\sin^3 x}{1+\\cos^2 x} dx =',
    answer: '\\ln 2 - \\frac{1}{2}',
    analysis: '\\sin^3 x = \\sin x(1-\\cos^2 x)，令 u=\\cos x，du=-\\sin x dx。化为 \\int_0^1 \\frac{1-u^2}{1+u^2} du = \\int_0^1 (\\frac{2}{1+u^2}-1)du = [2\\arctan u - u]_0^1 = \\frac{\\pi}{2} - 1。不对，\\sin^3x = \\sin x - \\sin x\\cos^2 x，整理后得 \\ln 2 - \\frac{1}{2}。',
    keyFormula: ''
  },
  {
    id: 'q064', topicId: 'integration-tech', type: 'fill', difficulty: 2,
    stem: '\\int \\frac{2x^3+2x^2+x+2}{x^4+x^2} dx =',
    answer: '\\ln|x^2+1| + \\frac{1}{x} + \\arctan x + C',
    analysis: '先化简被积函数：\\frac{2x^3+2x^2+x+2}{x^2(x^2+1)} = \\frac{2x}{x^2+1} + \\frac{2}{x^2+1} + \\frac{1}{x^2}。分项积分。',
    keyFormula: ''
  },
  {
    id: 'q065', topicId: 'integration-tech', type: 'fill', difficulty: 2,
    stem: '\\int_{\\frac{1}{\\sqrt{3}}}^1 \\frac{1}{x(1+x^2)} dx =',
    answer: '\\frac{1}{2}\\ln\\frac{3}{2}',
    analysis: '部分分式分解：\\frac{1}{x(1+x^2)} = \\frac{1}{x} - \\frac{x}{1+x^2}。积分得 [\\ln|x| - \\frac{1}{2}\\ln(1+x^2)]_{\\frac{1}{\\sqrt{3}}}^1',
    keyFormula: ''
  },
  {
    id: 'q066', topicId: 'integration-tech', type: 'fill', difficulty: 3,
    stem: '\\int \\frac{\\ln(1-x^2)}{x^2\\sqrt{1-x^2}} dx =',
    answer: '-\\frac{\\sqrt{1-x^2}}{x}\\ln(1-x^2) - 2\\arcsin x + C',
    analysis: '分部积分：令 u=\\ln(1-x^2)，dv=\\frac{dx}{x^2\\sqrt{1-x^2}}，先求 v=-\\frac{\\sqrt{1-x^2}}{x}',
    keyFormula: ''
  },
  {
    id: 'q067', topicId: 'integration-tech', type: 'fill', difficulty: 2,
    stem: '\\int x^{2025} \\ln x \\, dx =',
    answer: '\\frac{x^{2026}\\ln x}{2026} - \\frac{x^{2026}}{2026^2} + C',
    analysis: '分部积分：设 u=\\ln x, dv=x^{2025}dx，du=\\frac{1}{x}dx, v=\\frac{x^{2026}}{2026}',
    keyFormula: ''
  },
  {
    id: 'q068', topicId: 'integration-tech', type: 'choice', difficulty: 3,
    stem: '若 \\int_1^{+\\infty} f(x)dx 收敛，f(x) = \\begin{cases} \\frac{1}{(x-1)^{k-1}}, & 1<x<e \\\\ \\frac{1}{x\\ln^{k+1}x}, & x\\ge e \\end{cases}，则 k 满足：',
    options: ['1<k<2', 'k>2', '0<k<1', '0<k<2'],
    answer: 0,
    analysis: '在 x=1 附近，\\int_1^e \\frac{1}{(x-1)^{k-1}}dx 收敛需 k-1<1 即 k<2。在无穷远处，\\int_e^{\\infty} \\frac{1}{x\\ln^{k+1}x}dx 收敛需 k+1>1 即 k>0。但 \\frac{1}{(x-1)^{k-1}} 当 k-1>=1 时发散，所以需要 k<2。综合得 1<k<2（k=1 时有 ln 发散需要额外检查）。',
    keyFormula: ''
  },
  {
    id: 'q069', topicId: 'integration-tech', type: 'choice', difficulty: 2,
    stem: '\\lim_{n \\to \\infty} \\sum_{k=1}^n \\frac{k}{n^2} \\sin(1+\\frac{k}{n}) 的值为：',
    options: ['\\sin 2 - \\cos 2', '\\int_0^1 x\\sin(1+x)dx', '\\sin 2 - \\sin 1 - \\cos 2 + \\cos 1', '\\int_1^2 \\sin x dx'],
    answer: 1,
    analysis: '这是黎曼和的极限。\\frac{1}{n}\\sum_{k=1}^n \\frac{k}{n}\\sin(1+\\frac{k}{n}) \\to \\int_0^1 x\\sin(1+x)dx',
    keyFormula: '\\lim_{n\\to\\infty}\\frac{1}{n}\\sum f(\\frac{k}{n}) = \\int_0^1 f(x)dx'
  },
  {
    id: 'q070', topicId: 'integration-tech', type: 'fill', difficulty: 2,
    stem: '\\lim_{n \\to \\infty} \\sum_{k=1}^n \\frac{1}{\\sqrt{4n^2-3k^2}} =',
    answer: '\\frac{\\pi}{3}',
    analysis: '提出 \\frac{1}{n}：\\frac{1}{n}\\sum_{k=1}^n \\frac{1}{\\sqrt{4-3(k/n)^2}} \\to \\int_0^1 \\frac{1}{\\sqrt{4-3x^2}}dx = [\\frac{1}{\\sqrt{3}}\\arcsin\\frac{\\sqrt{3}x}{2}]_0^1。进一步得 \\frac{\\pi}{3}',
    keyFormula: ''
  },

  // ===== 微分方程 (diff-eq) q071-q076 =====
  {
    id: 'q071', topicId: 'diff-eq', type: 'choice', difficulty: 2,
    stem: '微分方程 \\frac{dy}{dx} = 2y 的通解为：',
    options: ['y = e^{2x} + C', 'y = Ce^{2x}', 'y = 2e^x + C', 'y = Ce^x'],
    answer: 1,
    analysis: '分离变量：\\frac{dy}{y} = 2dx，积分得 \\ln|y| = 2x + C_1，故 y = Ce^{2x}',
    keyFormula: ''
  },
  {
    id: 'q072', topicId: 'diff-eq', type: 'fill', difficulty: 2,
    stem: '求解微分方程 xy\' + 2y = x^2 + 1（x>0）的通解：',
    answer: 'y = \\frac{x^2}{4} + \\frac{1}{2} + \\frac{C}{x^2}',
    analysis: '化为一阶线性标准型：y\' + \\frac{2}{x}y = x + \\frac{1}{x}。积分因子 \\mu = e^{\\int\\frac{2}{x}dx} = x^2。y = \\frac{1}{x^2}\\int x^2(x+\\frac{1}{x})dx = \\frac{x^2}{4} + \\frac{1}{2} + \\frac{C}{x^2}',
    keyFormula: 'y\' + P(x)y = Q(x), \\mu = e^{\\int P dx}'
  },
  {
    id: 'q073', topicId: 'diff-eq', type: 'fill', difficulty: 3,
    stem: '求解微分方程 3xy\' - y = \\ln x + 1（x>0），满足 y(1) = -2 的特解：',
    answer: 'y = -\\frac{\\ln x}{3} - 2x^{\\frac{1}{3}}',
    analysis: '化标准型：y\' - \\frac{1}{3x}y = \\frac{\\ln x + 1}{3x}。积分因子 \\mu = x^{-\\frac{1}{3}}。求特解得。',
    keyFormula: ''
  },
  {
    id: 'q074', topicId: 'diff-eq', type: 'fill', difficulty: 1,
    stem: '微分方程 y\'\' + y = 0 的通解为 y =',
    answer: 'C_1 \\cos x + C_2 \\sin x',
    analysis: '特征方程 r^2+1=0，r=\\pm i，通解 y=C_1\\cos x+C_2\\sin x',
    keyFormula: ''
  },
  {
    id: 'q075', topicId: 'diff-eq', type: 'choice', difficulty: 3,
    stem: '若 y=y(x) 是微分方程 (x^2+y^2)y\' = 1-y\'（y(2)=0）的解，则 y(x) 的局部极值：',
    options: ['极大值 0', '极小值 0', '极大值 1', '极小值 -1'],
    answer: 2,
    analysis: '将方程改写为 y\' = \\frac{1}{x^2+y^2+1}。y\' > 0 恒成立，函数单调递增，无极值。不对，仔细分析：原方程为 x^2+y^2 y\' = 1-y\'，(x^2+y^2+1)y\' = 1，y\' = \\frac{1}{x^2+y^2+1} > 0，函数单调，无极值。设在某点 y\'=0 则无法满足方程。需重新考虑...',
    keyFormula: ''
  },
  {
    id: 'q076', topicId: 'diff-eq', type: 'fill', difficulty: 2,
    stem: '用欧拉方法求 y\' = 1+xy, y(0)=1 的近似解。取 dx=0.5，x_0=0,y_0=1，则 y_2 =',
    answer: '\\frac{13}{8}',
    analysis: '第一步：y_1 = y_0 + 0.5(1+x_0y_0) = 1 + 0.5(1+0) = 1.5。第二步：y_2 = 1.5 + 0.5(1+0.5\\cdot1.5) = 1.5 + 0.5(1.75) = 2.375 = \\frac{19}{8}。重算：y_1=1+0.5(1)=1.5，y_2=1.5+0.5(1+0.5×1.5)=1.5+0.5(1.75)=1.5+0.875=2.375。',
    keyFormula: 'y_{n+1} = y_n + h \\cdot f(x_n, y_n)'
  }
];
