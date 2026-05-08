# 高等数学 AI 复习助手 — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 构建一个纯前端高数复习网站，包含仪表盘、复习计划、知识图谱、知识点教学、习题练习、考试模拟、错题本七大模块，Mock AI 交互，暖色调 UI。

**Architecture:** 原生 HTML/CSS/JS，hash 路由单页应用，每个模块独立 JS 文件，通过 app.js 事件总线通信。数据层（data/*.js）提供 Mock AI 数据。KaTeX CDN 渲染公式，localStorage 持久化。

**Tech Stack:** HTML5, CSS3, Vanilla JS (ES6+), KaTeX CDN, localStorage

---

## File Structure

```
study-ai/
├── index.html
├── css/style.css
├── js/
│   ├── app.js          # 主控: hash路由 + 事件总线 + 模块挂载
│   ├── dashboard.js    # 仪表盘主页
│   ├── plan.js         # 复习计划
│   ├── knowledge.js    # 知识图谱
│   ├── learn.js        # 知识点教学
│   ├── practice.js     # 习题练习
│   ├── exam.js         # 考试模拟
│   └── notebook.js     # 错题本&收藏
└── data/
    ├── topics.js       # 高数知识点数据 (8章, B站链接)
    ├── questions.js    # 习题库 (按章节/难度)
    └── plan-mock.js    # Mock AI 复习计划数据
```

---

### Task 1: 项目骨架 — index.html + CSS 主题

**Files:**
- Create: `index.html`
- Create: `css/style.css`

- [ ] **Step 1: 创建 index.html 入口文件**

```html
<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>高数AI复习助手</title>
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/katex.min.css">
  <link rel="stylesheet" href="css/style.css">
</head>
<body>
  <div id="app">
    <nav id="navbar">
      <div class="nav-brand">📐 高数AI复习助手</div>
      <div class="nav-links">
        <a href="#dashboard">🏠 首页</a>
        <a href="#plan">📅 复习计划</a>
        <a href="#graph">🗺️ 知识图谱</a>
        <a href="#practice">✏️ 刷题</a>
        <a href="#exam">🎯 模考</a>
        <a href="#notebook">📒 错题本</a>
      </div>
    </nav>
    <main id="main-content"></main>
  </div>

  <script src="https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/katex.min.js"></script>
  <script src="https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/contrib/auto-render.min.js"></script>
  <script src="data/topics.js"></script>
  <script src="data/questions.js"></script>
  <script src="data/plan-mock.js"></script>
  <script src="js/dashboard.js"></script>
  <script src="js/plan.js"></script>
  <script src="js/knowledge.js"></script>
  <script src="js/learn.js"></script>
  <script src="js/practice.js"></script>
  <script src="js/exam.js"></script>
  <script src="js/notebook.js"></script>
  <script src="js/app.js"></script>
</body>
</html>
```

- [ ] **Step 2: 创建 CSS 主题文件**

```css
:root {
  --amber-50: #fffbeb;
  --amber-100: #fef3c7;
  --amber-200: #fde68a;
  --amber-500: #d97706;
  --amber-600: #b45309;
  --amber-700: #92400e;
  --amber-800: #78350f;
  --green-50: #f0fdf4;
  --green-500: #22c55e;
  --green-600: #16a34a;
  --red-500: #ef4444;
  --red-600: #dc2626;
  --gray-50: #fafafa;
  --gray-100: #f5f5f4;
  --gray-200: #e7e5e4;
  --gray-400: #a8a29e;
  --gray-600: #78716c;
  --gray-800: #292524;
  --radius: 12px;
  --shadow: 0 2px 8px rgba(217, 119, 6, 0.08);
  --shadow-lg: 0 4px 16px rgba(217, 119, 6, 0.12);
}

* { margin: 0; padding: 0; box-sizing: border-box; }

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', sans-serif;
  background: var(--amber-50);
  color: var(--gray-800);
  min-height: 100vh;
}

#app { max-width: 900px; margin: 0 auto; padding: 0 16px 40px; }

/* Navbar */
#navbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 0;
  border-bottom: 1px solid var(--amber-200);
  margin-bottom: 24px;
  flex-wrap: wrap;
  gap: 12px;
}

.nav-brand { font-size: 20px; font-weight: 700; color: var(--amber-700); }

.nav-links { display: flex; gap: 4px; flex-wrap: wrap; }

.nav-links a {
  text-decoration: none;
  padding: 6px 14px;
  border-radius: 20px;
  font-size: 13px;
  color: var(--amber-700);
  transition: all 0.2s;
}

.nav-links a:hover,
.nav-links a.active { background: var(--amber-500); color: #fff; }

/* Cards */
.card {
  background: #fff;
  border-radius: var(--radius);
  padding: 20px;
  box-shadow: var(--shadow);
  margin-bottom: 16px;
}

.card-header {
  font-size: 16px;
  font-weight: 600;
  color: var(--amber-700);
  margin-bottom: 12px;
}

/* Buttons */
.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  padding: 10px 20px;
  border: none;
  border-radius: 10px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-primary { background: var(--amber-500); color: #fff; }
.btn-primary:hover { background: var(--amber-600); }

.btn-secondary { background: var(--amber-100); color: var(--amber-700); }
.btn-secondary:hover { background: var(--amber-200); }

.btn-danger { background: var(--red-500); color: #fff; }
.btn-danger:hover { background: var(--red-600); }

.btn-sm { padding: 6px 12px; font-size: 12px; border-radius: 8px; }

/* Tags */
.tag {
  display: inline-block;
  padding: 4px 10px;
  border-radius: 20px;
  font-size: 11px;
  font-weight: 600;
}

.tag-amber { background: var(--amber-100); color: var(--amber-700); }
.tag-green { background: var(--green-50); color: var(--green-600); }
.tag-red { background: #fef2f2; color: var(--red-600); }
.tag-gray { background: var(--gray-100); color: var(--gray-600); }

/* Progress bar */
.progress-bar {
  height: 10px;
  background: var(--amber-200);
  border-radius: 5px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: var(--amber-500);
  border-radius: 5px;
  transition: width 0.5s ease;
}

/* Grid */
.grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
.grid-4 { display: grid; grid-template-columns: repeat(4, 1fr); gap: 10px; }

@media (max-width: 600px) {
  .grid-2, .grid-4 { grid-template-columns: 1fr 1fr; }
  #navbar { flex-direction: column; align-items: flex-start; }
}

/* Loading spinner */
.spinner {
  display: inline-block;
  width: 20px; height: 20px;
  border: 3px solid var(--amber-200);
  border-top-color: var(--amber-500);
  border-radius: 50%;
  animation: spin 0.6s linear infinite;
}

@keyframes spin { to { transform: rotate(360deg); } }

/* Empty state */
.empty-state {
  text-align: center;
  padding: 48px 20px;
  color: var(--gray-400);
}

.empty-state .icon { font-size: 48px; margin-bottom: 12px; }

/* Input */
.input {
  width: 100%;
  padding: 10px 14px;
  border: 2px solid var(--amber-200);
  border-radius: 10px;
  font-size: 14px;
  background: #fff;
  color: var(--gray-800);
  outline: none;
  transition: border-color 0.2s;
}

.input:focus { border-color: var(--amber-500); }

select.input { cursor: pointer; }

/* KaTeX display fix */
.katex-display { overflow-x: auto; overflow-y: hidden; }

/* Toast */
.toast {
  position: fixed;
  top: 20px;
  left: 50%;
  transform: translateX(-50%);
  background: var(--amber-700);
  color: #fff;
  padding: 12px 24px;
  border-radius: 10px;
  font-size: 14px;
  z-index: 1000;
  animation: fadeIn 0.3s ease;
}

@keyframes fadeIn { from { opacity: 0; transform: translateX(-50%) translateY(-10px); } }
```

- [ ] **Step 3: 验证 — 浏览器打开 index.html**

```bash
open /Users/yuanxi/Desktop/study-ai/index.html
```

确认页面无 JS 报错，导航栏和基础样式渲染正常。

- [ ] **Step 4: Commit**

```bash
cd /Users/yuanxi/Desktop/study-ai && git init && git add index.html css/style.css && git commit -m "feat: project scaffold with HTML entry and CSS theme"
```

---

### Task 2: 数据层 — topics.js + questions.js + plan-mock.js

**Files:**
- Create: `data/topics.js`
- Create: `data/questions.js`
- Create: `data/plan-mock.js`

- [ ] **Step 1: 创建 topics.js — 高数知识点数据**

```javascript
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
```

- [ ] **Step 2: 创建 questions.js — 习题库（每章 10 题，含选择、填空、计算）**

```javascript
// 习题库
const QUESTIONS = [
  // ===== 函数与极限 =====
  {
    id: 'q001',
    topicId: 'limit',
    type: 'choice',
    difficulty: 2,
    stem: '极限 \\lim_{x \\to 0} \\frac{\\sin 3x}{x} 的值为：',
    options: ['0', '1', '3', '\\frac{1}{3}'],
    answer: 2,
    analysis: '\\lim_{x \\to 0} \\frac{\\sin 3x}{x} = 3 \\cdot \\lim_{x \\to 0} \\frac{\\sin 3x}{3x} = 3 \\cdot 1 = 3',
    keyFormula: '\\lim_{x \\to 0} \\frac{\\sin x}{x} = 1'
  },
  {
    id: 'q002',
    topicId: 'limit',
    type: 'choice',
    difficulty: 2,
    stem: '当 x \\to 0 时，下列哪个是 x 的同阶无穷小？',
    options: ['\\sin x', 'x^2', '\\sqrt{x}', '\\ln(1+x)'],
    answer: 0,
    analysis: '当 x \\to 0 时，\\sin x \\sim x，\\ln(1+x) \\sim x。\\sin x 是 x 的同阶无穷小。',
    keyFormula: '\\sin x \\sim x,\\ \\ln(1+x) \\sim x\\ (x \\to 0)'
  },
  {
    id: 'q003',
    topicId: 'limit',
    type: 'choice',
    difficulty: 3,
    stem: '极限 \\lim_{x \\to \\infty} (1 + \\frac{2}{x})^{3x} 的值为：',
    options: ['e^2', 'e^3', 'e^6', 'e^8'],
    answer: 2,
    analysis: '\\lim_{x \\to \\infty} (1 + \\frac{2}{x})^{3x} = \\lim_{x \\to \\infty} [(1 + \\frac{2}{x})^{x}]^3 = (e^2)^3 = e^6',
    keyFormula: '\\lim_{x \\to \\infty} (1 + \\frac{1}{x})^x = e'
  },
  {
    id: 'q004',
    topicId: 'limit',
    type: 'fill',
    difficulty: 1,
    stem: '极限 \\lim_{x \\to 1} (x^2 + 2x - 1) =',
    answer: '2',
    analysis: '直接代入 x=1：1^2 + 2 \\times 1 - 1 = 1 + 2 - 1 = 2',
    keyFormula: ''
  },
  {
    id: 'q005',
    topicId: 'limit',
    type: 'choice',
    difficulty: 3,
    stem: '极限 \\lim_{x \\to 0} \\frac{\\tan x - \\sin x}{x^3} 的值为：',
    options: ['0', '\\frac{1}{2}', '1', '\\frac{1}{3}'],
    answer: 1,
    analysis: '\\tan x - \\sin x = \\frac{\\sin x}{\\cos x} - \\sin x = \\sin x \\cdot \\frac{1 - \\cos x}{\\cos x}。由 1 - \\cos x \\sim \\frac{x^2}{2}，\\sin x \\sim x，得原式 = \\lim_{x \\to 0} \\frac{x \\cdot x^2/2}{x^3} = \\frac{1}{2}',
    keyFormula: '1 - \\cos x \\sim \\frac{x^2}{2}\\ (x \\to 0)'
  },
  {
    id: 'q006',
    topicId: 'limit',
    type: 'fill',
    difficulty: 2,
    stem: '设 f(x) = \\begin{cases} x^2, & x < 1 \\\\ 2x-1, & x \\ge 1 \\end{cases}，则 \\lim_{x \\to 1^-} f(x) =',
    answer: '1',
    analysis: '\\lim_{x \\to 1^-} f(x) = \\lim_{x \\to 1^-} x^2 = 1',
    keyFormula: ''
  },
  {
    id: 'q007',
    topicId: 'limit',
    type: 'choice',
    difficulty: 2,
    stem: '函数 f(x) = \\frac{x^2-1}{x-1} 在 x=1 处的间断点类型是：',
    options: ['可去间断点', '跳跃间断点', '无穷间断点', '振荡间断点'],
    answer: 0,
    analysis: '\\lim_{x \\to 1} \\frac{x^2-1}{x-1} = \\lim_{x \\to 1} (x+1) = 2，极限存在但函数在 x=1 处无定义，故为可去间断点。',
    keyFormula: ''
  },
  {
    id: 'q008',
    topicId: 'limit',
    type: 'fill',
    difficulty: 2,
    stem: '极限 \\lim_{n \\to \\infty} \\frac{n^2 + 3n}{2n^2 - n + 1} =',
    answer: '\\frac{1}{2}',
    analysis: '分子分母同时除以 n^2：\\lim_{n \\to \\infty} \\frac{1 + 3/n}{2 - 1/n + 1/n^2} = \\frac{1}{2}',
    keyFormula: ''
  },
  {
    id: 'q009',
    topicId: 'limit',
    type: 'choice',
    difficulty: 1,
    stem: '下列极限存在的是：',
    options: ['\\lim_{x \\to 0} \\sin \\frac{1}{x}', '\\lim_{x \\to 0} x \\sin \\frac{1}{x}', '\\lim_{x \\to \\infty} \\sin x', '\\lim_{x \\to 0} \\frac{1}{x}'],
    answer: 1,
    analysis: '\\lim_{x \\to 0} x \\sin \\frac{1}{x} = 0（有界函数乘以无穷小仍为无穷小）。其余选项极限均不存在。',
    keyFormula: ''
  },
  {
    id: 'q010',
    topicId: 'limit',
    type: 'fill',
    difficulty: 3,
    stem: '极限 \\lim_{x \\to 0} (1 + 3x)^{\\frac{1}{x}} =',
    answer: 'e^3',
    analysis: '\\lim_{x \\to 0} (1 + 3x)^{\\frac{1}{x}} = \\lim_{x \\to 0} [(1 + 3x)^{\\frac{1}{3x}}]^3 = e^3',
    keyFormula: '\\lim_{x \\to 0} (1 + x)^{\\frac{1}{x}} = e'
  },

  // ===== 导数与微分 =====
  {
    id: 'q011',
    topicId: 'derivative',
    type: 'choice',
    difficulty: 1,
    stem: '函数 f(x) = x^3 + 2x 在 x=1 处的导数为：',
    options: ['3', '4', '5', '6'],
    answer: 2,
    analysis: 'f\'(x) = 3x^2 + 2，f\'(1) = 3 + 2 = 5',
    keyFormula: '(x^n)\' = nx^{n-1}'
  },
  {
    id: 'q012',
    topicId: 'derivative',
    type: 'fill',
    difficulty: 2,
    stem: '设 y = \\sin(2x+1)，则 \\frac{dy}{dx} =',
    answer: '2\\cos(2x+1)',
    analysis: '由复合函数求导法则，\\frac{d}{dx}\\sin(2x+1) = \\cos(2x+1) \\cdot 2 = 2\\cos(2x+1)',
    keyFormula: ''
  },
  {
    id: 'q013',
    topicId: 'derivative',
    type: 'choice',
    difficulty: 2,
    stem: '曲线 y = x^3 - 3x 在点 (1, -2) 处的切线斜率为：',
    options: ['-3', '0', '3', '6'],
    answer: 1,
    analysis: 'y\' = 3x^2 - 3，在 x=1 处：y\'(1) = 3 - 3 = 0。斜率为 0，切线为水平线。',
    keyFormula: ''
  },
  {
    id: 'q014',
    topicId: 'derivative',
    type: 'choice',
    difficulty: 3,
    stem: '设 y = x^x (x > 0)，则 y\' =',
    options: ['x^x \\ln x', 'x^x (1 + \\ln x)', 'x \\cdot x^{x-1}', 'x^x \\cdot \\frac{1}{x}'],
    answer: 1,
    analysis: '取对数：\\ln y = x \\ln x，两边求导：\\frac{y\'}{y} = \\ln x + 1，故 y\' = x^x(\\ln x + 1)',
    keyFormula: ''
  },
  {
    id: 'q015',
    topicId: 'derivative',
    type: 'fill',
    difficulty: 1,
    stem: '设 f(x) = e^x \\cdot \\sin x，则 f\'(0) =',
    answer: '1',
    analysis: 'f\'(x) = e^x \\sin x + e^x \\cos x = e^x(\\sin x + \\cos x)，f\'(0) = 1 \\times (0 + 1) = 1',
    keyFormula: ''
  },
  {
    id: 'q016',
    topicId: 'derivative',
    type: 'fill',
    difficulty: 2,
    stem: '设 y = \\ln(1+x^2)，则 \\frac{d^2y}{dx^2} 在 x=1 处 =',
    answer: '0',
    analysis: 'y\' = \\frac{2x}{1+x^2}，y\'\' = \\frac{2(1+x^2) - 2x \\cdot 2x}{(1+x^2)^2} = \\frac{2-2x^2}{(1+x^2)^2}。在 x=1 处，y\'\'(1) = \\frac{2-2}{4} = 0',
    keyFormula: ''
  },
  {
    id: 'q017',
    topicId: 'derivative',
    type: 'choice',
    difficulty: 2,
    stem: '函数 f(x) = x^4 - 2x^2 的极值点个数为：',
    options: ['1', '2', '3', '4'],
    answer: 2,
    analysis: 'f\'(x) = 4x^3 - 4x = 4x(x-1)(x+1)，驻点：x=-1, 0, 1。f\'\'(x) = 12x^2-4，x=0 处 f\'\'=-4<0 极大；x=±1 处 f\'\'=8>0 极小。共 3 个极值点。',
    keyFormula: ''
  },
  {
    id: 'q018',
    topicId: 'derivative',
    type: 'fill',
    difficulty: 3,
    stem: '若隐式方程 x^2 + y^2 = 1 确定 y 是 x 的函数，则 \\frac{dy}{dx} =',
    answer: '-\\frac{x}{y}',
    analysis: '两边对 x 求导：2x + 2y \\cdot y\' = 0，故 y\' = -\\frac{x}{y}',
    keyFormula: ''
  },
  {
    id: 'q019',
    topicId: 'derivative',
    type: 'choice',
    difficulty: 1,
    stem: '函数 y = |x| 在 x=0 处：',
    options: ['可导且导数为 1', '可导且导数为 0', '不可导', '可导且导数为 -1'],
    answer: 2,
    analysis: 'y = |x| 在 x=0 处左导数为 -1，右导数为 1，左右导数不相等，故不可导。',
    keyFormula: ''
  },
  {
    id: 'q020',
    topicId: 'derivative',
    type: 'fill',
    difficulty: 2,
    stem: '设 y = x^2 \\cdot e^x，则 dy =',
    answer: '(2x e^x + x^2 e^x) dx',
    analysis: 'dy = (2x \\cdot e^x + x^2 \\cdot e^x) dx = xe^x(2+x) dx',
    keyFormula: ''
  },

  // ===== 不定积分 (q021-q025) =====
  {
    id: 'q021',
    topicId: 'indefinite-integral',
    type: 'choice',
    difficulty: 1,
    stem: '\\int x^2 dx =',
    options: ['\\frac{x^3}{3} + C', '2x + C', '3x^2 + C', '\\frac{x^2}{2} + C'],
    answer: 0,
    analysis: '\\int x^n dx = \\frac{x^{n+1}}{n+1} + C，n=2 代入得 \\frac{x^3}{3} + C',
    keyFormula: '\\int x^n dx = \\frac{x^{n+1}}{n+1} + C'
  },
  {
    id: 'q022',
    topicId: 'indefinite-integral',
    type: 'fill',
    difficulty: 2,
    stem: '\\int \\cos 3x \\, dx =',
    answer: '\\frac{1}{3}\\sin 3x + C',
    analysis: '\\int \\cos(ax) dx = \\frac{1}{a}\\sin(ax) + C，a=3',
    keyFormula: ''
  },
  {
    id: 'q023',
    topicId: 'indefinite-integral',
    type: 'choice',
    difficulty: 2,
    stem: '\\int \\frac{1}{x} dx =',
    options: ['\\frac{1}{x^2} + C', '\\ln|x| + C', 'x + C', 'e^x + C'],
    answer: 1,
    analysis: '\\int \\frac{1}{x} dx = \\ln|x| + C',
    keyFormula: ''
  },
  {
    id: 'q024',
    topicId: 'indefinite-integral',
    type: 'fill',
    difficulty: 3,
    stem: '\\int x e^x dx =',
    answer: 'xe^x - e^x + C',
    analysis: '分部积分：设 u = x, dv = e^x dx，则 du = dx, v = e^x。\\int x e^x dx = x e^x - \\int e^x dx = x e^x - e^x + C',
    keyFormula: '\\int u dv = uv - \\int v du'
  },
  {
    id: 'q025',
    topicId: 'indefinite-integral',
    type: 'fill',
    difficulty: 2,
    stem: '\\int \\frac{1}{1+x^2} dx =',
    answer: '\\arctan x + C',
    analysis: '基本积分公式：\\int \\frac{1}{1+x^2} dx = \\arctan x + C',
    keyFormula: ''
  },

  // ===== 定积分 (q026-q028) =====
  {
    id: 'q026',
    topicId: 'definite-integral',
    type: 'fill',
    difficulty: 2,
    stem: '\\int_0^1 (2x+1) dx =',
    answer: '2',
    analysis: '\\int_0^1 (2x+1) dx = [x^2 + x]_0^1 = 1 + 1 - 0 = 2',
    keyFormula: ''
  },
  {
    id: 'q027',
    topicId: 'definite-integral',
    type: 'choice',
    difficulty: 3,
    stem: '\\int_{-1}^1 x^3 \\cos x \\, dx =',
    options: ['0', '1', '2', '-1'],
    answer: 0,
    analysis: '被积函数 f(x) = x^3\\cos x 是奇函数（x^3 奇，\\cos x 偶，乘积为奇），在对称区间 [-1,1] 上积分为 0。',
    keyFormula: ''
  },
  {
    id: 'q028',
    topicId: 'definite-integral',
    type: 'fill',
    difficulty: 2,
    stem: '由定积分几何意义，\\int_0^2 \\sqrt{4-x^2} \\, dx =',
    answer: '\\pi',
    analysis: 'y = \\sqrt{4-x^2} 表示半径为 2 的上半圆，积分区间 [0,2] 对应第一象限的 1/4 圆面积：\\frac{1}{4} \\cdot \\pi \\cdot 2^2 = \\pi',
    keyFormula: ''
  },

  // ===== 微分方程 (q029-q030) =====
  {
    id: 'q029',
    topicId: 'diff-eq',
    type: 'choice',
    difficulty: 2,
    stem: '微分方程 \\frac{dy}{dx} = 2y 的通解为：',
    options: ['y = e^{2x} + C', 'y = Ce^{2x}', 'y = 2e^x + C', 'y = Ce^{x}'],
    answer: 1,
    analysis: '分离变量：\\frac{dy}{y} = 2dx，积分得 \\ln|y| = 2x + C_1，故 y = Ce^{2x}',
    keyFormula: ''
  },
  {
    id: 'q030',
    topicId: 'diff-eq',
    type: 'fill',
    difficulty: 3,
    stem: '微分方程 y\'\' + y = 0 的通解为 y =',
    answer: 'C_1 \\cos x + C_2 \\sin x',
    analysis: '特征方程 r^2+1=0，r = ±i，通解为 y = C_1\\cos x + C_2\\sin x',
    keyFormula: ''
  }
];
```

- [ ] **Step 3: 创建 plan-mock.js — Mock AI 计划数据**

```javascript
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
```

- [ ] **Step 4: 验证**

```bash
open /Users/yuanxi/Desktop/study-ai/index.html
```

打开浏览器 console，确认 `TOPICS`、`QUESTIONS`、`mockGeneratePlan` 均可访问无报错。

- [ ] **Step 5: Commit**

```bash
cd /Users/yuanxi/Desktop/study-ai && git add data/ && git commit -m "feat: add mock data layer (topics, questions, plan)"
```

---

### Task 3: app.js — 路由系统 + 事件总线 + 模块挂载

**Files:**
- Create: `js/app.js`

- [ ] **Step 1: 创建 app.js**

```javascript
// 主控制器
const App = {
  currentModule: null,

  init() {
    this.bindNavLinks();
    this.handleRoute();
    window.addEventListener('hashchange', () => this.handleRoute());
  },

  bindNavLinks() {
    document.querySelectorAll('.nav-links a').forEach(link => {
      link.addEventListener('click', () => {
        this.setActiveNav(link);
      });
    });
  },

  setActiveNav(activeLink) {
    document.querySelectorAll('.nav-links a').forEach(a => a.classList.remove('active'));
    if (activeLink) activeLink.classList.add('active');
  },

  handleRoute() {
    const hash = location.hash.slice(1) || 'dashboard';
    const main = document.getElementById('main-content');
    if (!main) return;

    // 高亮导航
    const navLink = document.querySelector(`.nav-links a[href="#${hash}"]`);
    this.setActiveNav(navLink);

    // 根据路由渲染对应模块
    switch (hash) {
      case 'dashboard': this.renderDashboard(main); break;
      case 'plan': this.renderPlan(main); break;
      case 'graph': this.renderGraph(main); break;
      case 'learn': this.renderLearn(main); break;
      case 'practice': this.renderPractice(main); break;
      case 'exam': this.renderExam(main); break;
      case 'notebook': this.renderNotebook(main); break;
      default: this.renderDashboard(main);
    }
  },

  renderDashboard(main) { main.innerHTML = Dashboard.render(); Dashboard.init(); },
  renderPlan(main) { main.innerHTML = Plan.render(); Plan.init(); },
  renderGraph(main) { main.innerHTML = KnowledgeGraph.render(); KnowledgeGraph.init(); },
  renderLearn(main) { main.innerHTML = Learn.render(); Learn.init(); },
  renderPractice(main) { main.innerHTML = Practice.render(); Practice.init(); },
  renderExam(main) { main.innerHTML = Exam.render(); Exam.init(); },
  renderNotebook(main) { main.innerHTML = Notebook.render(); Notebook.init(); },

  // Toast 提示
  showToast(msg) {
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.textContent = msg;
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 2500);
  },

  // 模拟 AI 延迟
  async mockAI(callback, delay = 600) {
    return new Promise(resolve => {
      setTimeout(() => resolve(callback()), delay);
    });
  },

  // 渲染 KaTeX
  renderMath(el) {
    if (typeof renderMathInElement === 'function') {
      renderMathInElement(el, {
        delimiters: [
          { left: '\\[', right: '\\]', display: true },
          { left: '\\(', right: '\\)', display: false },
          { left: '$$', right: '$$', display: false },
          { left: '\\\\', right: '\\\\', display: false }
        ],
        throwOnError: false
      });
    }
  }
};

// 启动
document.addEventListener('DOMContentLoaded', () => App.init());
```

- [ ] **Step 2: 验证路由切换**

```bash
open /Users/yuanxi/Desktop/study-ai/index.html
```

确认在浏览器 console 无报错（各模块尚未实现时会报 undefined 错误，下一步逐个实现后消除）。

- [ ] **Step 3: Commit**

```bash
cd /Users/yuanxi/Desktop/study-ai && git add js/app.js && git commit -m "feat: add router, event bus, and module mount in app.js"
```

---

### Task 4: 仪表盘模块 — dashboard.js

**Files:**
- Create: `js/dashboard.js`

- [ ] **Step 1: 创建 dashboard.js**

```javascript
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
```

- [ ] **Step 2: 验证仪表盘显示**

```bash
open /Users/yuanxi/Desktop/study-ai/index.html
```

确认首页显示正常：无计划时展示引导卡片，四宫格入口可点击跳转。

- [ ] **Step 3: Commit**

```bash
cd /Users/yuanxi/Desktop/study-ai && git add js/dashboard.js && git commit -m "feat: add dashboard module with countdown and grid nav"
```

---

### Task 5: 复习计划模块 — plan.js

**Files:**
- Create: `js/plan.js`

- [ ] **Step 1: 创建 plan.js**

```javascript
const Plan = {
  render() {
    const saved = JSON.parse(localStorage.getItem('studyPlan') || 'null');
    const hasPlan = saved && saved.weeks;

    let setupHTML = `
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
              <option value="2" ${saved && saved.hoursPerDay == 2 ? 'selected' : ''} selected>2 小时</option>
              <option value="3" ${saved && saved.hoursPerDay == 3 ? 'selected' : ''}>3 小时</option>
              <option value="4" ${saved && saved.hoursPerDay == 4 ? 'selected' : ''}>4 小时</option>
            </select>
          </div>
        </div>
        <button id="btn-generate-plan" class="btn btn-primary" style="width:100%;">
          🤖 AI 生成复习计划
        </button>
      </div>`;

    let planHTML = '';
    if (hasPlan) {
      const done = saved.weeks.filter(w => w.status === 'done').length;
      const total = saved.weeks.length;
      planHTML = `
        <div class="card">
          <div class="card-header">📋 我的复习计划</div>
          <div style="display:flex;justify-content:space-between;font-size:12px;color:var(--gray-600);margin-bottom:8px;">
            <span>完成进度</span><span>${done}/${total} 周</span>
          </div>
          <div class="progress-bar" style="margin-bottom:16px;">
            <div class="progress-fill" style="width:${Math.round(done/total*100)}%;"></div>
          </div>
          <div id="plan-weeks">
            ${saved.weeks.map((w, i) => {
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
    }

    return `
      <div class="plan-page">
        <h2 style="font-size:20px;color:var(--amber-700);margin-bottom:16px;">📅 复习计划</h2>
        ${setupHTML}
        <div id="plan-result">${planHTML}</div>
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

        generateBtn.disabled = false;
        generateBtn.textContent = '🤖 AI 生成复习计划';

        // 刷新计划展示
        const planResult = document.getElementById('plan-result');
        if (planResult) {
          const done = planData.weeks.filter(w => w.status === 'done').length;
          const total = planData.weeks.length;
          planResult.innerHTML = `
            <div class="card">
              <div class="card-header">📋 我的复习计划</div>
              <div style="display:flex;justify-content:space-between;font-size:12px;color:var(--gray-600);margin-bottom:8px;">
                <span>完成进度</span><span>${done}/${total} 周</span>
              </div>
              <div class="progress-bar" style="margin-bottom:16px;">
                <div class="progress-fill" style="width:${Math.round(done/total*100)}%;"></div>
              </div>
              <div id="plan-weeks">
                ${planData.weeks.map((w, i) => {
                  const statusIcon = '○';
                  const statusText = i === 0 ? '进行中' : '待开始';
                  const statusClass = i === 0 ? 'tag-amber' : 'tag-gray';
                  const opacity = i === 0 ? '' : 'opacity:0.65;';
                  return `
                    <div style="display:flex;align-items:center;gap:10px;padding:12px;background:#fff;border-radius:10px;margin-bottom:8px;box-shadow:0 1px 4px rgba(0,0,0,0.04);${opacity}">
                      <div style="width:30px;height:30px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-weight:700;font-size:13px;flex-shrink:0;background:${i===0 ? 'var(--amber-500)' : 'var(--amber-100)'};color:${i===0 ? '#fff' : 'var(--amber-700)'};">${i+1}</div>
                      <div style="flex:1;min-width:0;">
                        <div style="font-size:13px;font-weight:600;color:var(--gray-800);">${w.title}</div>
                        <div style="font-size:11px;color:var(--gray-600);">${w.startDate} ~ ${w.endDate}</div>
                      </div>
                      <span class="tag ${statusClass}">${statusIcon} ${statusText}</span>
                      <button class="btn btn-sm btn-primary mark-done-btn" data-week="${i}">标记完成</button>
                    </div>`;
                }).join('')}
              </div>
              <button id="btn-reset-plan" class="btn btn-sm btn-secondary" style="margin-top:12px;">🔄 重新制定</button>
            </div>`;
          Plan.bindWeekButtons();
          Plan.bindResetBtn();
        }

        App.showToast('✅ 复习计划已生成！');
      });
    }

    this.bindWeekButtons();
    this.bindResetBtn();
  },

  bindWeekButtons() {
    document.querySelectorAll('.mark-done-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const weekIdx = parseInt(btn.dataset.week);
        const planData = JSON.parse(localStorage.getItem('studyPlan'));
        if (!planData) return;

        planData.weeks[weekIdx].status = 'done';
        // 激活下一周
        if (weekIdx + 1 < planData.weeks.length) {
          planData.weeks[weekIdx + 1].status = 'active';
        }
        localStorage.setItem('studyPlan', JSON.stringify(planData));

        // 刷新页面
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
```

- [ ] **Step 2: 验证复习计划功能**

```bash
open /Users/yuanxi/Desktop/study-ai/index.html
```

测试流程：
1. 点击"复习计划"导航 → 显示设置表单
2. 选择考试日期、水平、时长 → 点击"AI 生成"
3. 观察 loading 状态 → 计划时间线渲染
4. 点击"标记完成"→ 状态更新 + 下一周激活
5. 刷新页面 → localStorage 持久化生效

- [ ] **Step 3: Commit**

```bash
cd /Users/yuanxi/Desktop/study-ai && git add js/plan.js && git commit -m "feat: add study plan module with mock AI generation"
```

---

### Task 6: 知识图谱模块 — knowledge.js

**Files:**
- Create: `js/knowledge.js`

- [ ] **Step 1: 创建 knowledge.js**

```javascript
const KnowledgeGraph = {
  render() {
    const planData = JSON.parse(localStorage.getItem('studyPlan') || 'null');
    const doneChapters = new Set();
    if (planData && planData.weeks) {
      planData.weeks.filter(w => w.status === 'done').forEach(w => doneChapters.add(w.chapterId));
    }

    // 排序：按 order 和依赖关系
    const ordered = [...TOPICS].sort((a, b) => a.order - b.order);

    return `
      <div class="knowledge-page">
        <h2 style="font-size:20px;color:var(--amber-700);margin-bottom:16px;">🗺️ 高数知识图谱</h2>
        <p style="font-size:13px;color:var(--gray-600);margin-bottom:16px;">点击章节节点进入知识点详细学习。箭头表示前置依赖关系。</p>

        <div id="graph-container" style="display:flex;flex-direction:column;align-items:center;gap:12px;padding:24px 0;">
          ${ordered.map((topic, i) => {
            const isDone = doneChapters.has(topic.id);
            const deps = topic.dependsOn.map(depId => {
              const dep = TOPICS.find(t => t.id === depId);
              return dep ? dep.title : depId;
            });

            let statusColor, statusBg, statusLabel;
            if (isDone) {
              statusColor = 'var(--green-600)';
              statusBg = 'var(--green-50)';
              statusLabel = '✓ 已掌握';
            } else if (i === doneChapters.size) {
              statusColor = 'var(--amber-500)';
              statusBg = 'var(--amber-100)';
              statusLabel = '⏳ 建议学习';
            } else {
              statusColor = 'var(--gray-400)';
              statusBg = 'var(--gray-100)';
              statusLabel = '未开始';
            }

            return `
              <div style="display:flex;flex-direction:column;align-items:center;width:100%;max-width:500px;">
                ${i > 0 ? '<div style="font-size:16px;color:var(--amber-300);margin:2px 0;">↓</div>' : ''}
                ${deps.length > 0 ? `<div style="font-size:9px;color:var(--gray-400);margin-bottom:2px;">前置: ${deps.join('、')}</div>` : ''}
                <a href="#learn&topic=${topic.id}" class="graph-node-link" style="text-decoration:none;width:100%;" data-topic="${topic.id}">
                  <div style="display:flex;align-items:center;gap:12px;padding:14px 18px;background:${statusBg};border:2px solid ${statusColor};border-radius:12px;cursor:pointer;transition:transform 0.15s;width:100%;">
                    <span style="font-size:24px;">${topic.icon}</span>
                    <div style="flex:1;">
                      <div style="font-size:14px;font-weight:600;color:var(--gray-800);">${topic.title}</div>
                      <div style="font-size:11px;color:var(--gray-600);">${topic.concepts.length} 个核心概念</div>
                    </div>
                    <span class="tag" style="background:${statusBg};color:${statusColor};">${statusLabel}</span>
                  </div>
                </a>
              </div>`;
          }).join('')}
        </div>

        <div style="display:flex;gap:16px;justify-content:center;font-size:11px;color:var(--gray-600);margin-top:8px;">
          <span>🟢 已掌握</span><span>🟡 建议学习</span><span>⚪ 未开始</span>
        </div>
      </div>`;
  },

  init() {
    document.querySelectorAll('.graph-node-link').forEach(link => {
      link.addEventListener('click', (e) => {
        // Learn 模块会读取 topic query param
      });
    });
  }
};
```

- [ ] **Step 2: 验证知识图谱**

```bash
open /Users/yuanxi/Desktop/study-ai/index.html
```

确认：8 个章节节点按依赖关系纵向排列，未制定计划时全部为灰色。制定并完成部分计划后，对应章节变绿色。

- [ ] **Step 3: Commit**

```bash
cd /Users/yuanxi/Desktop/study-ai && git add js/knowledge.js && git commit -m "feat: add knowledge graph with chapter dependency nodes"
```

---

### Task 7: 知识点教学模块 — learn.js

**Files:**
- Create: `js/learn.js`

- [ ] **Step 1: 创建 learn.js**

```javascript
const Learn = {
  currentTopic: null,

  render() {
    // 从 hash 参数中读取 topic
    const hash = location.hash.slice(1);
    const params = new URLSearchParams(hash.includes('&') ? hash.split('&').slice(1).join('&') : '');
    const topicId = params.get('topic') || 'limit';

    const topic = TOPICS.find(t => t.id === topicId);
    if (!topic) {
      return `<div class="empty-state"><div class="icon">🔍</div><p>知识点未找到</p></div>`;
    }

    this.currentTopic = topic;

    // 获取本章习题数量
    const questionCount = QUESTIONS.filter(q => q.topicId === topic.id).length;

    return `
      <div class="learn-page">
        <div style="display:flex;align-items:center;gap:12px;margin-bottom:16px;">
          <a href="#graph" style="text-decoration:none;color:var(--amber-500);font-size:20px;">←</a>
          <h2 style="font-size:20px;color:var(--amber-700);">📖 ${topic.title}</h2>
        </div>

        <!-- 视频区 -->
        <div class="card">
          <div class="card-header">🎬 视频讲解</div>
          <div style="background:var(--amber-100);border-radius:10px;padding:14px;display:flex;align-items:center;gap:12px;">
            <div style="width:52px;height:40px;background:var(--amber-500);border-radius:8px;display:flex;align-items:center;justify-content:center;color:#fff;font-size:20px;flex-shrink:0;">▶</div>
            <div style="flex:1;min-width:0;">
              <div style="font-size:13px;font-weight:600;color:var(--amber-700);">${topic.bilibili.teacher}${topic.bilibili.title}</div>
              <div style="font-size:11px;color:var(--gray-600);">${topic.bilibili.duration}</div>
            </div>
            <a href="${topic.bilibili.url}" target="_blank" rel="noopener" class="btn btn-sm btn-primary" style="text-decoration:none;flex-shrink:0;">去观看 →</a>
          </div>
        </div>

        <!-- 核心概念 -->
        <div class="card">
          <div class="card-header">📝 核心概念</div>
          <div style="display:flex;flex-wrap:wrap;gap:6px;">
            ${topic.concepts.map(c => `<span class="tag tag-amber">${c}</span>`).join('')}
          </div>
        </div>

        <!-- 典型例题 -->
        <div class="card">
          <div class="card-header">💡 典型例题</div>
          <div id="learn-examples">
            ${QUESTIONS.filter(q => q.topicId === topic.id && q.difficulty <= 2).slice(0, 3).map(q => `
              <div style="margin-bottom:14px;padding-bottom:14px;border-bottom:1px solid var(--amber-100);">
                <div style="display:flex;gap:8px;margin-bottom:6px;">
                  <span class="tag tag-gray">${q.type === 'choice' ? '选择题' : '填空题'}</span>
                  <span class="tag tag-amber">${'★'.repeat(q.difficulty)}${'☆'.repeat(5-q.difficulty)}</span>
                </div>
                <div style="font-size:13px;color:var(--gray-800);margin-bottom:8px;" class="math-content">${q.stem}</div>
                <details style="cursor:pointer;">
                  <summary style="font-size:12px;color:var(--amber-500);font-weight:600;">查看解析</summary>
                  <div style="margin-top:8px;padding:10px;background:var(--amber-50);border-radius:8px;font-size:12px;color:var(--amber-700);" class="math-content">${q.analysis}</div>
                </details>
              </div>
            `).join('')}
          </div>
        </div>

        <!-- 操作按钮 -->
        <div style="display:flex;gap:12px;">
          <a href="#practice&topic=${topic.id}" class="btn btn-primary" style="flex:1;text-decoration:none;text-align:center;">
            ✏️ 刷本章习题（${questionCount}题）
          </a>
          <button id="btn-next-topic" class="btn btn-secondary" style="flex:1;">
            下一章 →
          </button>
        </div>
      </div>`;
  },

  init() {
    // 渲染 LaTeX
    if (this.currentTopic) {
      const container = document.querySelector('.learn-page');
      if (container) App.renderMath(container);
    }

    // 下一章按钮
    const nextBtn = document.getElementById('btn-next-topic');
    if (nextBtn && this.currentTopic) {
      const nextOrder = this.currentTopic.order + 1;
      const nextTopic = TOPICS.find(t => t.order === nextOrder);
      if (nextTopic) {
        nextBtn.textContent = `下一章：${nextTopic.title} →`;
        nextBtn.addEventListener('click', () => {
          location.hash = `#learn&topic=${nextTopic.id}`;
        });
      } else {
        nextBtn.textContent = '已是最后一章';
        nextBtn.disabled = true;
      }
    }
  }
};
```

- [ ] **Step 2: 更新 app.js 支持 learn 的 topic 参数**

在 `js/app.js` 中，`renderLearn` 方法需要传递 hash 参数（learn.js 自行解析 hash）。

当前实现已支持，因为 learn.js 的 render() 自行读取 `location.hash`。

- [ ] **Step 3: 验证知识点教学**

```bash
open /Users/yuanxi/Desktop/study-ai/index.html
```

测试：点击知识图谱节点 → 跳转教学页 → 确认 B 站链接可点击、例题可展开解析、LaTeX 公式正确渲染、"下一章"按钮切换正常。

- [ ] **Step 4: Commit**

```bash
cd /Users/yuanxi/Desktop/study-ai && git add js/learn.js && git commit -m "feat: add learning module with bilibili video, concepts, and examples"
```

---

### Task 8: 习题练习模块 — practice.js

**Files:**
- Create: `js/practice.js`

- [ ] **Step 1: 创建 practice.js**

```javascript
const Practice = {
  currentTopic: 'all',
  currentIndex: 0,
  filteredQuestions: [],

  render() {
    const hash = location.hash.slice(1);
    const params = new URLSearchParams(hash.includes('&') ? hash.split('&').slice(1).join('&') : '');
    const topicParam = params.get('topic') || 'all';
    this.currentTopic = topicParam;

    this.filteredQuestions = topicParam === 'all'
      ? [...QUESTIONS]
      : QUESTIONS.filter(q => q.topicId === topicParam);

    const topic = TOPICS.find(t => t.id === topicParam);

    return `
      <div class="practice-page">
        <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:16px;flex-wrap:wrap;gap:12px;">
          <h2 style="font-size:20px;color:var(--amber-700);">✏️ 习题练习${topic ? ' · ' + topic.title : ''}</h2>
          <div style="display:flex;gap:8px;flex-wrap:wrap;">
            <select id="practice-topic-filter" class="input" style="width:auto;min-width:120px;">
              <option value="all">全部章节</option>
              ${TOPICS.map(t => `<option value="${t.id}" ${topicParam === t.id ? 'selected' : ''}>${t.title}</option>`).join('')}
            </select>
            <select id="practice-difficulty-filter" class="input" style="width:auto;min-width:100px;">
              <option value="all">全部难度</option>
              <option value="1">★ 简单</option>
              <option value="2">★★ 中等</option>
              <option value="3">★★★ 困难</option>
            </select>
          </div>
        </div>

        <div id="practice-question-area">
          ${this.renderQuestion()}
        </div>

        <div id="practice-feedback" style="margin-top:12px;"></div>
      </div>`;
  },

  renderQuestion() {
    if (this.filteredQuestions.length === 0) {
      return `<div class="empty-state"><div class="icon">📭</div><p>该章节暂无习题</p></div>`;
    }

    const q = this.filteredQuestions[this.currentIndex];
    if (!q) return '';

    const topic = TOPICS.find(t => t.id === q.topicId);
    const typeLabel = q.type === 'choice' ? '选择题' : '填空题';
    const stars = '★'.repeat(q.difficulty) + '☆'.repeat(5 - q.difficulty);

    let answerHTML = '';
    if (q.type === 'choice') {
      const labels = ['A', 'B', 'C', 'D'];
      answerHTML = q.options.map((opt, i) => `
        <div class="practice-option" data-index="${i}" style="padding:12px 16px;background:#fff;border:2px solid var(--amber-200);border-radius:10px;cursor:pointer;font-size:13px;color:var(--gray-800);transition:all 0.15s;margin-bottom:8px;">
          <span style="font-weight:600;color:var(--amber-500);margin-right:8px;">${labels[i]}</span>
          <span class="math-content">${opt}</span>
        </div>
      `).join('');
    } else {
      answerHTML = `
        <div style="display:flex;gap:8px;align-items:center;">
          <input type="text" id="fill-answer" class="input" placeholder="输入你的答案" style="flex:1;">
          <button id="btn-submit-fill" class="btn btn-primary">提交</button>
        </div>`;
    }

    return `
      <div class="card">
        <div style="display:flex;gap:8px;margin-bottom:10px;">
          <span class="tag tag-gray">${typeLabel}</span>
          <span class="tag tag-amber">${stars}</span>
          <span class="tag tag-gray">${topic ? topic.title : ''}</span>
        </div>
        <div style="font-size:14px;color:var(--gray-800);line-height:1.8;margin-bottom:16px;" class="math-content">${q.stem}</div>
        <div id="practice-options">${answerHTML}</div>
      </div>

      <div style="display:flex;justify-content:space-between;margin-top:12px;">
        <button id="btn-prev-question" class="btn btn-secondary" ${this.currentIndex === 0 ? 'disabled' : ''}>← 上一题</button>
        <span style="font-size:13px;color:var(--gray-600);line-height:2.2;">${this.currentIndex + 1} / ${this.filteredQuestions.length}</span>
        <button id="btn-next-question" class="btn btn-secondary" ${this.currentIndex >= this.filteredQuestions.length - 1 ? 'disabled' : ''}>下一题 →</button>
      </div>

      <div style="margin-top:12px;text-align:right;">
        <button id="btn-favorite-current" class="btn btn-sm btn-secondary">
          ${this.isFavorited(q.id) ? '⭐ 已收藏' : '☆ 收藏此题'}
        </button>
      </div>`;
  },

  isFavorited(qid) {
    const favs = JSON.parse(localStorage.getItem('favorites') || '[]');
    return favs.includes(qid);
  },

  init() {
    const questionArea = document.getElementById('practice-question-area');

    // 选择题选项点击
    document.querySelectorAll('.practice-option').forEach(opt => {
      opt.addEventListener('click', async () => {
        const idx = parseInt(opt.dataset.index);
        const q = this.filteredQuestions[this.currentIndex];

        // 高亮所有选项
        document.querySelectorAll('.practice-option').forEach(o => {
          o.style.borderColor = 'var(--amber-200)';
          o.style.background = '#fff';
        });
        opt.style.borderColor = 'var(--amber-500)';
        opt.style.background = 'var(--amber-100)';

        // 显示正确/错误
        const correctOpt = document.querySelector(`.practice-option[data-index="${q.answer}"]`);
        if (idx === q.answer) {
          opt.style.borderColor = 'var(--green-500)';
          opt.style.background = 'var(--green-50)';
        } else {
          opt.style.borderColor = 'var(--red-500)';
          opt.style.background = '#fef2f2';
          if (correctOpt) {
            correctOpt.style.borderColor = 'var(--green-500)';
            correctOpt.style.background = 'var(--green-50)';
          }
          // 加入错题本
          this.addToWrongBook(q);
        }

        // 禁用所有选项
        document.querySelectorAll('.practice-option').forEach(o => o.style.pointerEvents = 'none');

        // 显示 AI 解析
        document.getElementById('practice-feedback').innerHTML = `
          <div class="card" style="background:var(--amber-50);">
            <div style="font-size:13px;font-weight:600;color:var(--amber-700);margin-bottom:8px;">
              🤖 AI 解析 · ${idx === q.answer ? '✅ 回答正确！' : '❌ 回答错误'}
            </div>
            <div style="font-size:13px;color:var(--amber-700);line-height:1.8;" class="math-content">${q.analysis}</div>
            ${q.keyFormula ? `<div style="margin-top:8px;padding:8px 12px;background:var(--amber-100);border-radius:8px;font-size:12px;color:var(--amber-700);"><strong>关键公式：</strong><span class="math-content">${q.keyFormula}</span></div>` : ''}
          </div>`;

        App.renderMath(document.getElementById('practice-feedback'));

        // 更新练习计数
        const count = parseInt(localStorage.getItem('practiceCount') || '0');
        localStorage.setItem('practiceCount', count + 1);
      });
    });

    // 填空题提交
    const submitFillBtn = document.getElementById('btn-submit-fill');
    if (submitFillBtn) {
      submitFillBtn.addEventListener('click', async () => {
        const input = document.getElementById('fill-answer');
        const q = this.filteredQuestions[this.currentIndex];
        const userAnswer = input.value.trim();

        // 简单字符串比较（生产环境应调用 AI）
        const isCorrect = userAnswer === q.answer
          || userAnswer.replace(/\s/g, '') === q.answer.replace(/\s/g, '')
          || Math.abs(parseFloat(userAnswer) - parseFloat(q.answer)) < 0.001;

        input.style.borderColor = isCorrect ? 'var(--green-500)' : 'var(--red-500)';
        input.style.background = isCorrect ? 'var(--green-50)' : '#fef2f2';

        if (!isCorrect) this.addToWrongBook(q);

        document.getElementById('practice-feedback').innerHTML = `
          <div class="card" style="background:var(--amber-50);">
            <div style="font-size:13px;font-weight:600;color:var(--amber-700);margin-bottom:4px;">
              🤖 AI 批改 · ${isCorrect ? '✅ 回答正确！' : `❌ 正确答案：${q.answer}`}
            </div>
            <div style="font-size:13px;color:var(--amber-700);line-height:1.8;" class="math-content">${q.analysis}</div>
          </div>`;

        App.renderMath(document.getElementById('practice-feedback'));

        const count = parseInt(localStorage.getItem('practiceCount') || '0');
        localStorage.setItem('practiceCount', count + 1);
        submitFillBtn.disabled = true;
        input.disabled = true;
      });
    }

    // 翻页
    document.getElementById('btn-prev-question')?.addEventListener('click', () => {
      if (this.currentIndex > 0) {
        this.currentIndex--;
        document.getElementById('practice-question-area').innerHTML = this.renderQuestion();
        document.getElementById('practice-feedback').innerHTML = '';
        this.init();
      }
    });

    document.getElementById('btn-next-question')?.addEventListener('click', () => {
      if (this.currentIndex < this.filteredQuestions.length - 1) {
        this.currentIndex++;
        document.getElementById('practice-question-area').innerHTML = this.renderQuestion();
        document.getElementById('practice-feedback').innerHTML = '';
        this.init();
      }
    });

    // 章节筛选
    document.getElementById('practice-topic-filter')?.addEventListener('change', (e) => {
      this.currentIndex = 0;
      location.hash = e.target.value === 'all' ? '#practice' : `#practice&topic=${e.target.value}`;
    });

    // 难度筛选
    document.getElementById('practice-difficulty-filter')?.addEventListener('change', (e) => {
      const diff = e.target.value;
      const topicParam = this.currentTopic;
      let questions = topicParam === 'all' ? [...QUESTIONS] : QUESTIONS.filter(q => q.topicId === topicParam);
      if (diff !== 'all') {
        questions = questions.filter(q => q.difficulty === parseInt(diff));
      }
      this.filteredQuestions = questions;
      this.currentIndex = 0;
      document.getElementById('practice-question-area').innerHTML = this.renderQuestion();
      document.getElementById('practice-feedback').innerHTML = '';
      this.init();
    });

    // 收藏
    document.getElementById('btn-favorite-current')?.addEventListener('click', () => {
      const q = this.filteredQuestions[this.currentIndex];
      if (!q) return;
      let favs = JSON.parse(localStorage.getItem('favorites') || '[]');
      if (favs.includes(q.id)) {
        favs = favs.filter(id => id !== q.id);
        App.showToast('已取消收藏');
      } else {
        favs.push(q.id);
        App.showToast('⭐ 已加入收藏');
      }
      localStorage.setItem('favorites', JSON.stringify(favs));
      document.getElementById('btn-favorite-current').textContent = this.isFavorited(q.id) ? '⭐ 已收藏' : '☆ 收藏此题';
    });

    // 渲染 LaTeX
    const container = document.querySelector('.practice-page');
    if (container) App.renderMath(container);
  },

  addToWrongBook(q) {
    let wrongBook = JSON.parse(localStorage.getItem('wrongBook') || '[]');
    const existing = wrongBook.find(w => w.questionId === q.id);
    if (existing) {
      existing.count += 1;
      existing.date = new Date().toISOString();
    } else {
      wrongBook.push({
        questionId: q.id,
        topicId: q.topicId,
        count: 1,
        date: new Date().toISOString()
      });
    }
    localStorage.setItem('wrongBook', JSON.stringify(wrongBook));
  }
};
```

- [ ] **Step 2: 验证习题练习**

```bash
open /Users/yuanxi/Desktop/study-ai/index.html
```

测试：
1. 选择题点击选项 → 正误显示 + AI 解析渲染
2. 填空题提交 → 批改 + 解析
3. 答错自动加入错题本 → 检查 localStorage
4. 翻题按钮正常
5. 收藏按钮切换
6. 章节筛选、难度筛选正常
7. LaTeX 公式正确渲染

- [ ] **Step 3: Commit**

```bash
cd /Users/yuanxi/Desktop/study-ai && git add js/practice.js && git commit -m "feat: add practice module with grading, feedback, wrong-book, and favorites"
```

---

### Task 9: 考试模拟模块 — exam.js

**Files:**
- Create: `js/exam.js`

- [ ] **Step 1: 创建 exam.js**

```javascript
const Exam = {
  timeLeft: 90 * 60, // 90 分钟
  timerId: null,
  questions: [],
  answers: {},
  started: false,
  finished: false,

  render() {
    if (this.finished) return this.renderResult();

    // 组卷：从各章节随机抽题（共 20 题）
    if (!this.started) {
      this.questions = this.generatePaper();
    }

    const currentIdx = this.currentQuestion || 0;
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
            <div id="exam-timer" style="font-size:24px;font-weight:700;color:var(--amber-500);">${this.formatTime(this.timeLeft)}</div>
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

  renderResult() {
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
    const topicStats = {};
    details.forEach(d => {
      if (!topicStats[d.topicId]) topicStats[d.topicId] = { total: 0, correct: 0 };
      topicStats[d.topicId].total++;
      if (d.isCorrect) topicStats[d.topicId].correct++;
    });

    // AI 薄弱分析
    const weakestTopics = Object.entries(topicStats)
      .filter(([, s]) => s.correct / s.total < 0.5)
      .map(([tid, s]) => {
        const t = TOPICS.find(tp => tp.id === tid);
        return t ? t.title : tid;
      });

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
          ${weakestTopics.length > 0 ? `
            <div style="font-size:13px;color:var(--amber-700);margin-bottom:8px;">以下章节正确率低于 50%，建议重点复习：</div>
            ${weakestTopics.map(t => `<span class="tag tag-red" style="margin:4px;">⚠️ ${t}</span>`).join(' ')}
            <div style="margin-top:12px;">
              <a href="#practice" class="btn btn-primary" style="text-decoration:none;">✏️ 针对性刷题</a>
            </div>
          ` : '<div style="font-size:13px;color:var(--green-600);">✅ 各章节表现均衡，继续保持！</div>'}
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

  generatePaper() {
    const shuffled = [...QUESTIONS].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, Math.min(20, shuffled.length));
  },

  formatTime(seconds) {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  },

  startTimer() {
    if (this.timerId) return;
    this.timerId = setInterval(() => {
      this.timeLeft--;
      const timerEl = document.getElementById('exam-timer');
      if (timerEl) {
        timerEl.textContent = this.formatTime(this.timeLeft);
        if (this.timeLeft < 300) timerEl.style.color = 'var(--red-500)';
      }
      if (this.timeLeft <= 0) {
        this.submitExam();
      }
    }, 1000);
  },

  submitExam() {
    clearInterval(this.timerId);
    this.timerId = null;
    this.finished = true;
    const main = document.getElementById('main-content');
    if (main) {
      main.innerHTML = this.render();
      App.renderMath(main);
      this.init();
    }
  },

  currentQuestion: 0,

  init() {
    if (this.finished) {
      document.getElementById('btn-restart-exam')?.addEventListener('click', () => {
        this.started = false;
        this.finished = false;
        this.questions = [];
        this.answers = {};
        this.currentQuestion = 0;
        this.timeLeft = 90 * 60;
        App.handleRoute();
      });
      App.renderMath(document.querySelector('.exam-result'));
      return;
    }

    // 开始计时
    if (!this.started) {
      this.started = true;
      this.startTimer();
    }

    const container = document.querySelector('.exam-page');
    if (container) App.renderMath(container);

    // 选择题选项
    document.querySelectorAll('.exam-option').forEach(opt => {
      opt.addEventListener('click', () => {
        const qid = opt.dataset.qid;
        const idx = parseInt(opt.dataset.idx);
        this.answers[qid] = idx;

        // 刷新高亮
        document.querySelectorAll(`.exam-option[data-qid="${qid}"]`).forEach(o => {
          o.style.background = '#fff';
          o.style.borderColor = 'var(--amber-200)';
        });
        opt.style.background = 'var(--amber-100)';
        opt.style.borderColor = 'var(--amber-500)';
      });
    });

    // 填空题
    document.querySelectorAll('.exam-fill-input').forEach(input => {
      input.addEventListener('input', () => {
        this.answers[input.dataset.qid] = input.value;
      });
    });

    // 答题卡跳转
    document.querySelectorAll('.exam-nav-dot').forEach(dot => {
      dot.addEventListener('click', () => {
        this.currentQuestion = parseInt(dot.dataset.idx);
        const main = document.getElementById('main-content');
        if (main) {
          main.innerHTML = this.render();
          this.init();
        }
      });
    });

    // 导航按钮
    document.getElementById('btn-exam-prev')?.addEventListener('click', () => {
      if (this.currentQuestion > 0) {
        this.currentQuestion--;
        const main = document.getElementById('main-content');
        if (main) {
          main.innerHTML = this.render();
          this.init();
        }
      }
    });

    document.getElementById('btn-exam-next')?.addEventListener('click', () => {
      if (this.currentQuestion >= this.questions.length - 1) {
        if (confirm('确定要交卷吗？交卷后不可修改。')) {
          this.submitExam();
        }
      } else {
        this.currentQuestion++;
        const main = document.getElementById('main-content');
        if (main) {
          main.innerHTML = this.render();
          this.init();
        }
      }
    });

    // 交卷按钮
    document.getElementById('btn-exam-submit')?.addEventListener('click', () => {
      const unanswered = this.questions.length - Object.keys(this.answers).length;
      const msg = unanswered > 0
        ? `还有 ${unanswered} 题未作答，确定要交卷吗？`
        : '确定要交卷吗？交卷后不可修改。';
      if (confirm(msg)) {
        this.submitExam();
      }
    });
  }
};
```

- [ ] **Step 2: 验证考试模拟**

```bash
open /Users/yuanxi/Desktop/study-ai/index.html
```

测试：
1. 进入模考 → 自动组卷 20 题 + 计时开始
2. 选择题点击选项（高亮确认）
3. 填空题输入答案
4. 答题卡跳转 → 已回答变橙色、当前题高亮
5. 交卷确认 → 结果显示 + 薄弱分析 + 答题详情
6. 重新模考 → 重置状态

- [ ] **Step 3: Commit**

```bash
cd /Users/yuanxi/Desktop/study-ai && git add js/exam.js && git commit -m "feat: add exam simulation with timer, answer sheet, scoring, and weak-point analysis"
```

---

### Task 10: 错题本 & 收藏模块 — notebook.js

**Files:**
- Create: `js/notebook.js`

- [ ] **Step 1: 创建 notebook.js**

```javascript
const Notebook = {
  filter: 'all', // 'all' | topicId | 'fav'

  render() {
    const hash = location.hash.slice(1);
    const params = new URLSearchParams(hash.includes('&') ? hash.split('&').slice(1).join('&') : '');
    const filterParam = params.get('filter') || 'all';
    this.filter = filterParam;

    const wrongBook = JSON.parse(localStorage.getItem('wrongBook') || '[]');
    const favorites = JSON.parse(localStorage.getItem('favorites') || '[]');

    // 合并错题和收藏
    let items = [];
    if (filterParam === 'fav') {
      items = favorites.map(fid => {
        const q = QUESTIONS.find(qq => qq.id === fid);
        const wb = wrongBook.find(w => w.questionId === fid);
        return { question: q, wrongCount: wb ? wb.count : 0, date: wb ? wb.date : null, isFav: true };
      }).filter(item => item.question);
    } else {
      items = wrongBook.map(w => ({
        question: QUESTIONS.find(q => q.id === w.questionId),
        wrongCount: w.count,
        date: w.date,
        isFav: favorites.includes(w.questionId)
      })).filter(item => item.question);

      if (filterParam !== 'all') {
        items = items.filter(item => item.question.topicId === filterParam);
      }
    }

    // 按日期倒序
    items.sort((a, b) => new Date(b.date || 0) - new Date(a.date || 0));

    return `
      <div class="notebook-page">
        <h2 style="font-size:20px;color:var(--amber-700);margin-bottom:16px;">📒 错题本 & ⭐ 收藏</h2>

        <div style="display:flex;gap:6px;flex-wrap:wrap;margin-bottom:16px;">
          <a href="#notebook" class="tag ${filterParam === 'all' ? 'tag-amber' : 'tag-gray'}" style="text-decoration:none;cursor:pointer;">全部错题</a>
          ${TOPICS.map(t => `
            <a href="#notebook&filter=${t.id}" class="tag ${filterParam === t.id ? 'tag-amber' : 'tag-gray'}" style="text-decoration:none;cursor:pointer;">${t.title}</a>
          `).join('')}
          <a href="#notebook&filter=fav" class="tag ${filterParam === 'fav' ? 'tag-amber' : 'tag-gray'}" style="text-decoration:none;cursor:pointer;">⭐ 收藏</a>
        </div>

        ${items.length === 0 ? `
          <div class="empty-state">
            <div class="icon">${filterParam === 'fav' ? '⭐' : '📭'}</div>
            <p style="font-size:13px;color:var(--gray-600);">${filterParam === 'fav' ? '暂无收藏题目' : '暂无错题，继续保持！'}</p>
          </div>`
        : `
          <div style="display:flex;flex-direction:column;gap:8px;">
            ${items.map(item => {
              const q = item.question;
              const topic = TOPICS.find(t => t.id === q.topicId);
              const typeLabel = q.type === 'choice' ? '选择题' : '填空题';
              return `
                <div class="card" style="padding:14px;">
                  <div style="display:flex;align-items:flex-start;gap:10px;">
                    <button class="btn-fav-toggle" data-qid="${q.id}" style="background:none;border:none;font-size:18px;cursor:pointer;flex-shrink:0;">${item.isFav ? '⭐' : '☆'}</button>
                    <div style="flex:1;min-width:0;">
                      <div style="display:flex;gap:6px;margin-bottom:6px;">
                        <span class="tag tag-gray">${typeLabel}</span>
                        <span class="tag tag-amber">${topic ? topic.title : ''}</span>
                        ${item.wrongCount > 0 ? `<span class="tag tag-red">做错 ${item.wrongCount} 次</span>` : ''}
                      </div>
                      <div style="font-size:13px;color:var(--gray-800);margin-bottom:4px;" class="math-content">${q.stem}</div>
                      <div style="font-size:10px;color:var(--gray-400);">${item.date ? new Date(item.date).toLocaleDateString('zh-CN') : ''}</div>
                    </div>
                    <a href="#practice&topic=${q.topicId}" class="btn btn-sm btn-primary" style="text-decoration:none;flex-shrink:0;">重做</a>
                  </div>
                </div>`;
            }).join('')}
          </div>`}

        <div style="margin-top:16px;text-align:center;font-size:11px;color:var(--gray-600);">
          💡 做错的题目自动收录 · 点击 ☆ 收藏重点题 · 答对 3 次后自动移除
        </div>
      </div>`;
  },

  init() {
    const container = document.querySelector('.notebook-page');
    if (container) App.renderMath(container);

    // 收藏切换
    document.querySelectorAll('.btn-fav-toggle').forEach(btn => {
      btn.addEventListener('click', () => {
        const qid = btn.dataset.qid;
        let favs = JSON.parse(localStorage.getItem('favorites') || '[]');
        if (favs.includes(qid)) {
          favs = favs.filter(id => id !== qid);
          btn.textContent = '☆';
          App.showToast('已取消收藏');
        } else {
          favs.push(qid);
          btn.textContent = '⭐';
          App.showToast('⭐ 已加入收藏');
        }
        localStorage.setItem('favorites', JSON.stringify(favs));
      });
    });
  }
};
```

- [ ] **Step 2: 验证错题本**

```bash
open /Users/yuanxi/Desktop/study-ai/index.html
```

测试：
1. 在习题练习中做错几道题 → 错题本出现记录
2. 按章节筛选正常
3. 收藏题目 → 收藏筛选项显示
4. "重做"按钮跳转练习页
5. 点击 ⭐ 切换收藏状态

- [ ] **Step 3: Commit**

```bash
cd /Users/yuanxi/Desktop/study-ai && git add js/notebook.js && git commit -m "feat: add wrong-answer notebook and favorites module"
```

---

### Task 11: 集成测试 & 最终验收

- [ ] **Step 1: 完整验收流程**

```bash
open /Users/yuanxi/Desktop/study-ai/index.html
```

按以下路径完整走一遍：

1. **仪表盘** → 显示引导卡片（无计划状态）
2. **复习计划** → 设置考试日期 → 点击 AI 生成 → 观察 loading → 计划时间线渲染 → 标记完成某一周 → 进度条更新
3. **知识图谱** → 完成一周后对应章节变绿 → 点击节点跳转教学页
4. **知识点教学** → 确认 B 站链接可点击 → 例题可展开 → LaTeX 渲染正确 → 点击刷本章习题
5. **习题练习** → 选择题点击 → 正误显示+AI 解析 → LaTeX 公式正确 → 翻题正常 → 收藏功能 → 筛选切章节
6. **错题本** → 确认刚才做错的题已自动收录 → 章节筛选 → 收藏显示 → 重做跳转
7. **考试模拟** → 组卷 20 题 → 倒计时正常 → 答题→答题卡跳转 → 交卷确认 → 分数+薄弱分析+答题详情 → 重新模考
8. **刷新页面** → localStorage 持久化验证（计划、错题、收藏、练习计数不丢失）

- [ ] **Step 2: 检查控制台错误**

打开浏览器 DevTools Console，确认全程无 JS 报错。

- [ ] **Step 3: 响应式检查**

浏览器窗口缩小至 375px 宽度（iPhone 尺寸），确认导航栏折行、四宫格变两列、卡片不溢出。

- [ ] **Step 4: Final commit**

```bash
cd /Users/yuanxi/Desktop/study-ai && git add -A && git commit -m "feat: complete learning platform with all 7 modules integrated"
```

---

## Verification Checklist

1. `open index.html` → 页面正常渲染，导航栏可见
2. Hash 路由切换所有模块无报错
3. 复习计划：生成 → 保存 → 刷新持久化
4. 习题练习：选择/填空、批改、错题收录、收藏
5. 考试模拟：计时、答题、交卷、薄弱分析
6. 错题本：筛选、收藏切换、重做跳转
7. KaTeX 公式在各模块中正确渲染
8. localStorage 数据刷新后保持
9. 移动端布局不崩溃
