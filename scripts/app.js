/**
 * llm-ui-bench 主控制脚本
 * 负责版本切换 (v2 开放自主设计 / v1 精细结构化规格)、模型与模板切换、
 * iframe 加载状态管理、视口模式切换、全屏弹窗与提示词弹窗管理
 */

// 1. 静态数据常量配置
const VERSIONS = [
  {
    id: "v2",
    name: "v2 (最新开放设计)",
    label: "v2 开放自主设计",
    badge: "推荐",
    description: "简短高质量提示词，不限制风格，充分释放模型的自主审美、空间编排与架构设计能力。"
  },
  {
    id: "v1",
    name: "v1 (早期精细规格)",
    label: "v1 早期精细规格",
    badge: "归档",
    description: "精细且详尽的结构化提示词约束，规定具体区块模块与功能点。"
  }
];

const MODELS = [
  { id: "gemini-3.8-flash", name: "gemini-3.8-flash", label: "Gemini 3.8 Flash" },
  { id: "gemini-3.1-pro", name: "gemini-3.1-pro", label: "Gemini 3.1 Pro" },
  { id: "glm-5.3-flash", name: "glm-5.3-flash", label: "GLM 5.3 Flash" },
  { id: "gpt-5.6-sol", name: "gpt-5.6-sol", label: "GPT 5.6 Sol" },
  { id: "grok-4.6", name: "grok-4.6", label: "Grok 4.6" },
  { id: "claude-sonnet-4.6", name: "claude-sonnet-4.6", label: "Claude Sonnet 4.6" }
];

const TEMPLATES_V2 = [
  { id: "landing-page", name: "landing-page", label: "官网落地页" },
  { id: "complex-dashboard", name: "complex-dashboard", label: "复杂后台" },
  { id: "general-agent", name: "general-agent", label: "通用 Agent" }
];

const TEMPLATES_V1 = [
  { id: "product-landing", name: "product-landing", label: "产品官网" },
  { id: "data-dashboard", name: "data-dashboard", label: "数据管理后台" },
  { id: "agent-interface", name: "agent-interface", label: "Agent 应用界面" }
];

// 内置预载提示词文本字典（按版本分组）
const PROMPTS_DATA = {
  v2: {
    "landing-page": {
      "id": "landing-page",
      "title": "官网落地页",
      "badge": "场景提示词 · v2 开放设计",
      "content": "设计并实现一个品牌官网落地页。自行定义一个可信、有具体文化语境的品牌、产品或机构，不要复用常见 AI 产品叙事。页面要有人文气息，采用大胆、有辨识度的排版；克制但反复地运用纹理、纸张感、颗粒、遮罩、混合模式或其他高级网页特性，让它们形成贯穿页面的视觉语言，而不是一次性装饰。避免模板化的 Hero + 卡片网格 + Logo 墙结构。内容、节奏、空间和精致动效应共同构成完整叙事。所有视觉资产内联生成，不引用外部图片、字体或 CDN。"
    },
    "complex-dashboard": {
      "id": "complex-dashboard",
      "title": "复杂后台",
      "badge": "场景提示词 · v2 开放设计",
      "content": "设计并实现一个复杂业务后台。自行选择一个确实需要高密度信息和多步骤判断的业务场景，建立清晰、可信的数据关系与任务流。页面必须自然包含可排序或筛选的数据表、可真实操作的表单、至少两种有意义的图表，以及状态、筛选或选中对象之间的联动；使用内置模拟数据完成有效交互。不要停留在通用侧栏、指标卡和占位图表组成的后台模板，应根据业务对象选择有设计感且高效的工作区结构。所有代码与视觉资产内联，不引用外部库、图片、字体或 CDN。"
    },
    "general-agent": {
      "id": "general-agent",
      "title": "通用 Agent",
      "badge": "场景提示词 · v2 开放设计",
      "content": "设计并实现一个通用智能体产品页面，包含话题或会话入口、主要对话区、输入与智能体状态。整体极简、克制、安静，但在排版、比例、留白、材质和微交互中藏有明确的设计判断。最重要的视觉记忆点是一个令人惊艳、具有生命感的拟人形象；它不必是真人，可以是智能体、动物、器物或抽象生命，并应通过内联 SVG、CSS、Canvas 或 WebGL 形成细腻的状态变化，而不是普通头像或发光圆球。避免常见三栏 AI 聊天模板和大面积渐变光晕。所有代码与视觉资产内联，不引用外部图片、字体或 CDN。"
    }
  },
  v1: {
    "product-landing": {
      "id": "product-landing",
      "title": "产品官网 (早期精细规格)",
      "badge": "详细规范 · v1 归档",
      "content": `# 提示词：现代化 SaaS 产品官网 (Product Landing Page)

请使用原生 HTML、CSS 和 JavaScript（单文件自包含）设计并实现一个现代化、高质感、极具视觉冲击力的 SaaS 产品官网页面。

## 业务场景与主题
- **产品定位**：新一代 AI 驱动的团队智能协同与自动化工作流平台（如 "FlowPulse AI" 或自定义品牌）。
- **设计风格**：现代暗色系（Dark Theme）或高级浅色系，搭配精细渐变、微妙的毛玻璃（Glassmorphism）、微光边框与精致阴影。
- **页面目标**：传达科技感、可靠性与前沿体验，驱动访客注册并试用产品。

## 页面结构与核心板块
1. **全局导航栏 (Navbar)**
   - 品牌 Logo 与产品名称
   - 导航链接（功能特性 Features、解决方案 Solutions、定价 Pricing、客户评价 Reviews、文档 Docs）
   - 右侧操作按钮（登录 Sign In、免费试用 Start Free Trial）
   - 滚动吸顶效果，带半透明磨砂背景
2. **Hero 视觉首屏 (Hero Section)**
   - 醒目的 Announcement Tag / Badge（例如："✨ FlowPulse 2.0 正式发布，体验下一代 AI 协作"）
   - 极具冲击力的大标题（Headline）与副标题（Sub-headline）
   - 双 CTA 按钮（"免费开始使用" 主按钮 + "观看 2 分钟演示" 次级/视频弹窗按钮）
   - 信任背书：客户评分（如 4.9/5 星好评）与知名企业客户 Logo 墙
   - 核心产品界面预览（精美的 Dashboard/工作流可视化 UI 模拟画报）
3. **核心功能亮点 (Feature Grid / Showcase)**
   - 模块化网格卡片（Bento Grid 风格推荐）
   - 交互式特性展示：智能自动化编排、多模型协同工作空间、毫秒级实时分析、企业级安全保障
   - 每个卡片包含精致图标、标签、动态交互或悬停卡片发光效果
4. **交互式工作流演示 (Interactive Workflow / Demo Section)**
   - 模拟工作流步骤切换（触发器 Trigger -> 智能处理 Processing -> 自动化执行 Action）
   - 支持点击 Tab 查看不同场景（开发提效、市场运营、客户支持）
5. **社交证明与客户评价 (Social Proof & Testimonials)**
   - 真实感的用户评价卡片（包含头像、姓名、职位、公司名、评分与真实引言）
   - 关键指标展示（如 "+300% 效率提升"、"10M+ 自动化任务执行"、"99.99% 可用性"）
6. **透明清晰的定价方案 (Pricing Plans)**
   - 月付 / 年付切换开关（带折扣提示，如 "年付立省 20%"）
   - 三阶梯定价卡片：Starter、Pro（带 Popular / 推荐高亮标记）、Enterprise
   - 清晰的功能清单对比勾选项与对应的行动按钮
7. **常见问题解答 (FAQ Accordion)**
   - 可折叠手风琴（Accordion），原生 JS 实现平滑展开/收起
8. **行动召唤与页脚 (Bottom CTA & Footer)**
   - 强烈的最终转化区块，激励用户立即开通
   - 多列页脚：产品链接、资源库、法律条款、社交媒体图标与版权信息

## 技术与交互要求
- **纯原生技术栈**：单 HTML 文件整合 CSS 和 JS，无需任何外部 npm 依赖或打包工具。
- **自适应响应式**：完美兼容桌面宽屏 (1440px+)、平板端 (768px - 1024px) 以及移动设备 (<768px)。
- **交互与动效**：
  - 导航栏平滑滚动锚点
  - 按钮悬停动画、卡片光影跟踪效果
  - FAQ 手风琴展开与收起
  - 月付/年付价格切换动效
- **字体与图标**：使用系统原生无衬线字体栈或内嵌高质量 SVG 图标，保持自包含与加载速度。`
    },
    "data-dashboard": {
      "id": "data-dashboard",
      "title": "数据管理后台 (早期精细规格)",
      "badge": "详细规范 · v1 归档",
      "content": `# 提示词：企业级数据可视化与分析管理后台 (Data & Analytics Dashboard)

请使用原生 HTML、CSS 和 JavaScript（单文件自包含）设计并实现一个专业、信息密度合理、交互流畅的企业级数据管理与分析控制台界面。

## 业务场景与主题
- **系统名称**：OmniPulse Analytics 企业级数据洞察与运营监控中心。
- **设计风格**：沉浸式专业后台界面，支持深色/浅色优雅搭配，强调信息层级、清晰的可视化图表、状态指示与数据对比。
- **页面目标**：提供业务核心指标监控、实时趋势图表、多维度数据表格过滤与详情交互。

## 界面结构与核心模块
1. **侧边导航栏 (Sidebar)**
   - 品牌 Logo 与企业工作空间切换器（如 "Acme Global ▾"）
   - 核心导航菜单（总览 Overview、分析 Analytics、交易订单 Orders、用户群体 Customers、系统日志 Logs、设置 Settings）
   - 激活项高亮样式与小红点/数字 Badge 提示
   - 底部用户头像、名称、角色以及折叠/展开侧栏按钮
2. **顶部状态与全局操作栏 (Top Header)**
   - 当前页面面包屑导航（Overview / Realtime Metrics）
   - 全局搜索输入框（带快捷键提示如 ⌘K / Ctrl+K）
   - 时间范围选择器（如：今天 Today、最近 7 天、最近 30 天、本季度）
   - 快捷动作（导出报表 Export、刷新数据 Refresh、通知中心 Notification、帮助文档）
3. **核心 KPI 指标卡片 (Summary Stat Cards)**
   - 4 个核心业务指标卡片（例如：总收入 Total Revenue、活跃用户 Active Users、转化率 Conversion Rate、平均客单价 AOV）
   - 每个卡片包含：当前数值、环比增长/下降幅度百分比（绿涨红跌标签）、精细微型走势图（Sparkline SVG）与提示 Tooltip
4. **复合图表展示区 (Charts & Visualizations)**
   - **主图表区**：销售额与流量趋势曲线/面积图（支持原生 SVG 绘制，包含悬停交叉瞄准线 Crosshair 与浮动数值展示）
   - **辅助图表区**：
     - 流量来源构成（环形图 / Donut Chart）
     - 区域或渠道转化对比（横向条形进度图）
   - 图表时间跨度切换（1D / 1W / 1M / 1Y）
5. **实时数据流水与明细表格 (Transactions Data Table)**
   - 表格功能栏：关键字过滤搜索、状态筛选下拉框（全部、已完成 Completed、处理中 Pending、异常 Failed）
   - 富表格列定义：交易 ID、客户名称与头像、交易时间、产品类别、金额、支付状态徽章、操作栏（查看详情 View、下载凭证）
   - 悬停行高亮、全选多选框、表头排序箭头
   - 分页栏（显示条目范围、上一页/下一页、页码跳转）
6. **侧拉抽屉/模态框交互 (Detail Drawer / Modal)**
   - 点击表格行任意项或操作按钮，平滑滑出右侧详情抽屉（Drawer），展示该订单的完整溯源时间轴、支付参数与顾客画像

## 技术与交互要求
- **纯原生自包含**：单 HTML 文件整合 CSS 和 JS，无需 Chart.js、ECharts 等第三方库（图表纯由轻量级原生 SVG / Canvas 或 HTML5 绘制）。
- **交互细节丰富**：
  - 侧边栏折叠/收起平滑过渡
  - 搜索框即时筛选表格内容
  - 状态筛选联动表格数据过滤
  - 时间范围切换触发图表与 KPI 数据动态重绘或动画过渡
  - 原生全屏/抽屉弹窗支持 ESC 键关闭与遮罩点击关闭
- **设计质感**：规范的色彩语义系统（Success、Warning、Danger、Primary）、严谨的文字排版网格与清晰的数据对比度。`
    },
    "agent-interface": {
      "id": "agent-interface",
      "title": "Agent 应用界面 (早期精细规格)",
      "badge": "详细规范 · v1 归档",
      "content": `# 提示词：现代化 AI Agent 协同与工作流工作台 (AI Agent Workspace & Canvas)

请使用原生 HTML、CSS 和 JavaScript（单文件自包含）设计并实现一个前沿、沉浸式、高交互度的 AI Agent 智能助手工作台界面。

## 业务场景与主题
- **产品定位**：NexusAgent - 面向软件研发与数据分析的自主式多 Agent 协同工作流系统。
- **设计风格**：前沿科技工作台风格（类似 Cursor、v0、ChatGPT Canvas、Claude Artifacts 结合的现代 IDE / Studio 质感）。
- **页面目标**：同时展示人机对话、多智能体协作思维链（Chain of Thought / Plan）、实时任务状态编排、代码与制品预览（Artifact Viewer）。

## 界面布局与核心板块（三栏式或两栏可伸缩设计）
1. **左侧智能体与会话管理器 (Agent & Session Hub)**
   - 顶部：新建会话按钮与快速模型切换器（如 "Auto-Router (GPT-5 / Claude 3.5 / Gemini Pro)"）
   - 正在活跃的 Agent 团队状态：
     - 架构师 Agent (Architect)
     - 代码生成 Agent (Coder)
     - 测试与安全审查 Agent (Reviewer)
   - 历史任务与会话列表（按时间分组，支持重命名/删除操作）
   - 底端环境资源与配额占用条（Tokens 用量、上下文窗口水位）
2. **中间主交互流：对话与思考链协同流 (Conversation & Thought Process Stream)**
   - 对话历史流：包含用户消息与 Agent 结构化回复
   - **Agent 思考链折叠卡片 (CoT / Reasoning Dropdown)**：
     - 展示思考步骤（如：1. 解析用户需求；2. 检索上下文代码；3. 生成重构补丁）
     - 带有动效微脉冲（Pulsing Status Dot）指示当前正在执行的步骤
   - **多 Agent 协作发言气泡**：支持不同 Agent 头像、角色 Tag（如 [Planner]、[Executor]）差异化区分
   - **工具调用与执行卡片 (Tool Calls)**：
     - 模拟展示工具调用（如 \`execute_command("pytest")\`、\`fetch_schema("users")\`）及终端输出结果
   - **底部富文本输入框 (Omni Input Bar)**：
     - 支持多行自动伸缩文本域
     - 上传附件/代码片段按钮、快捷提示词模板芯片（Chips，例如：@Codebase、/refactor、/review）
     - 发送与停止生成按钮切换状态
3. **右侧制品与代码多模态画布 (Artifacts & Canvas Viewer)**
   - 顶部选项卡：代码文件预览 (Code)、实时渲染预览 (Preview)、依赖拓扑图 (Graph)
   - **代码编辑器模拟区**：
     - 语法高亮样式的代码片段展示
     - 一键复制（Copy）、差异对比（Diff 模式开关）、应用更改（Apply Patch）按钮
   - **交互预览区**：
     - 实时渲染生成的 UI 组件或思维导图卡片
   - 面板支持最大化/全屏查看与关闭收起

## 技术与交互要求
- **纯原生自包含**：单 HTML 文件集成 CSS 和 JS，无需引入庞大第三方库。
- **仿真交互模拟**：
  - 点击预置快捷芯片或输入内容发送，触发仿真打字流式输出效果（Typewriter effect）
  - 能够展开/折叠 Agent 思考链（Thinking Process）
  - 右侧 Artifact 能够响应左侧消息中的“查看制品”动作并高亮对应文件
  - 工具调用面板具备可折叠的控制台输出（模拟终端黑色窗口）
- **高品质视觉细节**：精细的暗色系灰阶渐变（Zinc/Slate palette）、状态彩色指示点（蓝/绿/紫/琥珀色）、代码等宽字体排版与优雅的滚动条定制。`
    }
  }
};

// 2. 页面运行时状态
const state = {
  selectedVersion: "v2", // "v2" | "v1"
  selectedModel: "gemini-3.8-flash",
  selectedTemplate: "landing-page",
  viewport: "desktop", // "desktop" | "tablet" | "mobile"
  isFullscreen: false,
  savedScrollY: 0
};

// 辅助：获取当前版本对应的模板数组
function getCurrentTemplates() {
  return state.selectedVersion === "v2" ? TEMPLATES_V2 : TEMPLATES_V1;
}

// 3. DOM 元素缓存
let dom = {};

function initDom() {
  dom = {
    versionTabs: document.getElementById("versionTabs"),
    modelTabs: document.getElementById("modelTabs"),
    templateTabs: document.getElementById("templateTabs"),
    viewportBtns: document.querySelectorAll("[data-viewport]"),
    iframeWrapper: document.getElementById("iframeWrapper"),
    previewIframe: document.getElementById("previewIframe"),
    placeholder: document.getElementById("placeholder"),
    placeholderPath: document.getElementById("placeholderPath"),
    currentPathDisplay: document.getElementById("currentPathDisplay"),
    openDirectBtn: document.getElementById("openDirectBtn"),
    fullscreenBtn: document.getElementById("fullscreenBtn"),
    fullscreenOverlay: document.getElementById("fullscreenOverlay"),
    fullscreenCloseBtn: document.getElementById("fullscreenCloseBtn"),
    fullscreenIframe: document.getElementById("fullscreenIframe"),
    fullscreenPath: document.getElementById("fullscreenPath"),
    fullscreenBadge: document.getElementById("fullscreenBadge"),
    // 提示词弹窗 DOM
    viewPromptBtn: document.getElementById("viewPromptBtn"),
    promptModalBackdrop: document.getElementById("promptModalBackdrop"),
    promptModalTitle: document.getElementById("promptModalTitle"),
    promptModalBadge: document.getElementById("promptModalBadge"),
    promptModalContent: document.getElementById("promptModalContent"),
    promptModalCloseBtn: document.getElementById("promptModalCloseBtn"),
    promptModalCopyBtn: document.getElementById("promptModalCopyBtn")
  };
}

// 4. 路径计算辅助函数
function getResultPath(version, modelId, templateId) {
  return `results/${version}/${modelId}/${templateId}/index.html`;
}

// 5. 渲染版本、模型与模板 Tab
function renderTabs() {
  // 渲染版本选择器
  if (dom.versionTabs) {
    dom.versionTabs.innerHTML = VERSIONS.map(v => `
      <button type="button" class="version-btn ${v.id === state.selectedVersion ? "active" : ""}" data-version-id="${v.id}" title="${v.description}">
        <span>${v.label}</span>
        ${v.badge ? `<span class="badge-pill badge-${v.id}">${v.badge}</span>` : ""}
      </button>
    `).join("");

    dom.versionTabs.querySelectorAll("[data-version-id]").forEach(btn => {
      btn.addEventListener("click", () => {
        const vId = btn.getAttribute("data-version-id");
        if (vId && vId !== state.selectedVersion) {
          state.selectedVersion = vId;
          const currentTpls = getCurrentTemplates();
          // 切换版本时，默认选中该版本第一个模板
          state.selectedTemplate = currentTpls[0].id;
          renderTabs();
          loadCurrentPreview();
        }
      });
    });
  }

  // 渲染一级模型 Tab
  if (dom.modelTabs) {
    dom.modelTabs.innerHTML = MODELS.map(m => `
      <button type="button" class="model-tab-btn ${m.id === state.selectedModel ? "active" : ""}" data-model-id="${m.id}">
        <span class="model-dot"></span>
        <span>${m.label}</span>
      </button>
    `).join("");

    dom.modelTabs.querySelectorAll("[data-model-id]").forEach(btn => {
      btn.addEventListener("click", () => {
        const modelId = btn.getAttribute("data-model-id");
        if (modelId && modelId !== state.selectedModel) {
          state.selectedModel = modelId;
          updateActiveStates();
          loadCurrentPreview();
        }
      });
    });
  }

  // 渲染二级模板 Tab
  if (dom.templateTabs) {
    const templates = getCurrentTemplates();
    // 确保当前选中的 template 属于该版本
    if (!templates.find(t => t.id === state.selectedTemplate)) {
      state.selectedTemplate = templates[0].id;
    }

    dom.templateTabs.innerHTML = templates.map(t => `
      <button type="button" class="template-tab-btn ${t.id === state.selectedTemplate ? "active" : ""}" data-template-id="${t.id}">
        <span>${t.label}</span>
      </button>
    `).join("");

    dom.templateTabs.querySelectorAll("[data-template-id]").forEach(btn => {
      btn.addEventListener("click", () => {
        const templateId = btn.getAttribute("data-template-id");
        if (templateId && templateId !== state.selectedTemplate) {
          state.selectedTemplate = templateId;
          updateActiveStates();
          loadCurrentPreview();
        }
      });
    });
  }
}

// 更新 Tab 激活视觉
function updateActiveStates() {
  if (dom.versionTabs) {
    dom.versionTabs.querySelectorAll("[data-version-id]").forEach(btn => {
      btn.classList.toggle("active", btn.getAttribute("data-version-id") === state.selectedVersion);
    });
  }
  if (dom.modelTabs) {
    dom.modelTabs.querySelectorAll("[data-model-id]").forEach(btn => {
      btn.classList.toggle("active", btn.getAttribute("data-model-id") === state.selectedModel);
    });
  }
  if (dom.templateTabs) {
    dom.templateTabs.querySelectorAll("[data-template-id]").forEach(btn => {
      btn.classList.toggle("active", btn.getAttribute("data-template-id") === state.selectedTemplate);
    });
  }
}

// 6. iframe 加载与检测
async function checkFileExists(url) {
  try {
    const res = await fetch(url, { method: "HEAD" });
    return res.ok;
  } catch (e) {
    try {
      const res = await fetch(url);
      return res.ok;
    } catch (err) {
      return false;
    }
  }
}

async function loadCurrentPreview() {
  const targetPath = getResultPath(state.selectedVersion, state.selectedModel, state.selectedTemplate);
  
  if (dom.currentPathDisplay) {
    dom.currentPathDisplay.textContent = targetPath;
  }
  if (dom.placeholderPath) {
    dom.placeholderPath.textContent = targetPath;
  }
  if (dom.openDirectBtn) {
    dom.openDirectBtn.setAttribute("href", targetPath);
  }

  // 检测该目标 HTML 文件是否存在
  const exists = await checkFileExists(targetPath);

  if (exists) {
    if (dom.placeholder) dom.placeholder.classList.add("hidden");
    if (dom.previewIframe) {
      dom.previewIframe.style.display = "block";
      dom.previewIframe.src = targetPath;
    }
    if (state.isFullscreen && dom.fullscreenIframe) {
      dom.fullscreenIframe.src = targetPath;
    }
  } else {
    if (dom.previewIframe) {
      dom.previewIframe.style.display = "none";
      dom.previewIframe.src = "about:blank";
    }
    if (dom.placeholder) {
      dom.placeholder.classList.remove("hidden");
    }
    if (state.isFullscreen) {
      closeFullscreen();
    }
  }

  updateFullscreenMeta(targetPath);
}

function updateFullscreenMeta(targetPath) {
  if (!dom.fullscreenBadge) return;
  const currentModelObj = MODELS.find(m => m.id === state.selectedModel);
  const currentTemplateObj = getCurrentTemplates().find(t => t.id === state.selectedTemplate);
  const versionLabel = state.selectedVersion === "v2" ? "v2" : "v1";
  dom.fullscreenBadge.textContent = `[${versionLabel}] ${currentModelObj ? currentModelObj.label : state.selectedModel} · ${currentTemplateObj ? currentTemplateObj.label : state.selectedTemplate}`;
  if (dom.fullscreenPath) {
    dom.fullscreenPath.textContent = targetPath;
  }
}

// 7. 视口模式切换
function setViewport(mode) {
  state.viewport = mode;
  if (!dom.iframeWrapper) return;

  dom.iframeWrapper.classList.remove("viewport-desktop", "viewport-tablet", "viewport-mobile");
  dom.iframeWrapper.classList.add(`viewport-${mode}`);

  if (dom.viewportBtns) {
    dom.viewportBtns.forEach(btn => {
      btn.classList.toggle("active", btn.getAttribute("data-viewport") === mode);
    });
  }
}

// 8. 站内全屏查看逻辑
function openFullscreen() {
  state.savedScrollY = window.scrollY;
  state.isFullscreen = true;

  const targetPath = getResultPath(state.selectedVersion, state.selectedModel, state.selectedTemplate);
  updateFullscreenMeta(targetPath);

  if (dom.fullscreenIframe) {
    dom.fullscreenIframe.src = targetPath;
  }
  if (dom.fullscreenOverlay) {
    dom.fullscreenOverlay.classList.add("active");
  }
  document.body.style.overflow = "hidden";
}

function closeFullscreen() {
  state.isFullscreen = false;
  if (dom.fullscreenOverlay) {
    dom.fullscreenOverlay.classList.remove("active");
  }
  if (dom.fullscreenIframe) {
    dom.fullscreenIframe.src = "about:blank";
  }
  document.body.style.overflow = "";
  window.scrollTo(0, state.savedScrollY);
}

// 9. 提示词弹窗逻辑
function openPromptModal() {
  const versionData = PROMPTS_DATA[state.selectedVersion];
  if (!versionData) return;
  const promptItem = versionData[state.selectedTemplate];
  if (!promptItem) return;

  if (dom.promptModalTitle) dom.promptModalTitle.textContent = promptItem.title;
  if (dom.promptModalBadge) dom.promptModalBadge.textContent = promptItem.badge;
  if (dom.promptModalContent) dom.promptModalContent.textContent = promptItem.content;
  if (dom.promptModalBackdrop) dom.promptModalBackdrop.classList.add("active");
}

function closePromptModal() {
  if (dom.promptModalBackdrop) dom.promptModalBackdrop.classList.remove("active");
}

// 10. 简单 Markdown 渲染器
function parseMarkdown(md) {
  if (!md) return "";
  let html = md
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/^### (.*$)/gim, "<h3>$1</h3>")
    .replace(/^## (.*$)/gim, "<h2>$1</h2>")
    .replace(/^# (.*$)/gim, "<h1>$1</h1>")
    .replace(/\*\*(.*?)\*\*/gim, "<strong>$1</strong>")
    .replace(/`([^`]+)`/gim, "<code>$1</code>")
    .replace(/^\s*-\s+(.*$)/gim, "<li>$1</li>")
    .replace(/^\s*\d+\.\s+(.*$)/gim, "<li>$1</li>");

  html = html.replace(/(<li>.*<\/li>)/s, "<ul>$1</ul>");
  html = html.split("\n\n").map(para => {
    para = para.trim();
    if (!para) return "";
    if (para.startsWith("<h") || para.startsWith("<ul>") || para.startsWith("<li>")) {
      return para;
    }
    return `<p>${para.replace(/\n/g, "<br>")}</p>`;
  }).join("");

  return html;
}

// 11. 初始化主界面交互
function initMainPage() {
  initDom();
  renderTabs();

  // 视口按钮事件
  if (dom.viewportBtns) {
    dom.viewportBtns.forEach(btn => {
      btn.addEventListener("click", () => {
        const mode = btn.getAttribute("data-viewport");
        if (mode) setViewport(mode);
      });
    });
  }

  // 全屏按钮
  if (dom.fullscreenBtn) {
    dom.fullscreenBtn.addEventListener("click", openFullscreen);
  }

  // 关闭全屏
  if (dom.fullscreenCloseBtn) {
    dom.fullscreenCloseBtn.addEventListener("click", closeFullscreen);
  }

  // 查看提示词按钮
  if (dom.viewPromptBtn) {
    dom.viewPromptBtn.addEventListener("click", openPromptModal);
  }
  const placeholderViewPromptBtn = document.getElementById("placeholderViewPromptBtn");
  if (placeholderViewPromptBtn) {
    placeholderViewPromptBtn.addEventListener("click", openPromptModal);
  }

  // 弹窗关闭
  if (dom.promptModalCloseBtn) {
    dom.promptModalCloseBtn.addEventListener("click", closePromptModal);
  }
  if (dom.promptModalBackdrop) {
    dom.promptModalBackdrop.addEventListener("click", (e) => {
      if (e.target === dom.promptModalBackdrop) closePromptModal();
    });
  }

  // 弹窗复制按钮
  if (dom.promptModalCopyBtn) {
    dom.promptModalCopyBtn.addEventListener("click", async () => {
      const versionData = PROMPTS_DATA[state.selectedVersion];
      if (!versionData) return;
      const promptItem = versionData[state.selectedTemplate];
      if (!promptItem) return;

      try {
        await navigator.clipboard.writeText(promptItem.content);
        const copyTextSpan = dom.promptModalCopyBtn.querySelector(".copy-text") || dom.promptModalCopyBtn;
        const originalText = copyTextSpan.textContent;
        dom.promptModalCopyBtn.classList.add("copied");
        copyTextSpan.textContent = "已复制 ✓";
        setTimeout(() => {
          dom.promptModalCopyBtn.classList.remove("copied");
          copyTextSpan.textContent = originalText;
        }, 2000);
      } catch (err) {
        console.error("复制失败:", err);
      }
    });
  }

  // ESC 键退出全屏或弹窗
  window.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      if (dom.promptModalBackdrop && dom.promptModalBackdrop.classList.contains("active")) {
        closePromptModal();
      } else if (state.isFullscreen) {
        closeFullscreen();
      }
    }
  });

  // 默认加载初始视口与效果页面
  setViewport("desktop");
  loadCurrentPreview();
}

// 12. 初始化提示词页面 (prompts.html)
function initPromptsPage() {
  const container = document.getElementById("promptsList");
  if (!container) return;

  // 渲染两组提示词：v2 (最新) 与 v1 (归档)
  const v2Items = Object.values(PROMPTS_DATA.v2);
  const v1Items = Object.values(PROMPTS_DATA.v1);

  container.innerHTML = `
    <div style="margin-bottom: 2rem;">
      <div style="display: flex; align-items: baseline; gap: 0.75rem; margin-bottom: 0.75rem;">
        <h2 style="font-size: 1.25rem; font-weight: 700; color: #0f172a; margin: 0;">v2 场景提示词（当前基准 · 开放自主设计）</h2>
        <span style="font-size: 11px; padding: 2px 6px; border-radius: 4px; background: #dbeafe; color: #1d4ed8; font-weight: 600;">ACTIVE</span>
      </div>
      <p style="font-size: 13px; color: #64748b; margin-top: 0; margin-bottom: 1.25rem; line-height: 1.6;">
        精炼、不限制具体模板风格的场景提示词。注重设计语言、排版辨识度、人文语境与微交互动效，充分释放大模型的自主规划与审美能力。
      </p>
      ${v2Items.map(item => renderPromptCard(item, "v2")).join("")}
    </div>

    <div style="margin-top: 3.5rem; padding-top: 2rem; border-top: 1px dashed var(--color-border);">
      <div style="display: flex; align-items: baseline; gap: 0.75rem; margin-bottom: 0.75rem;">
        <h2 style="font-size: 1.15rem; font-weight: 700; color: #475569; margin: 0;">v1 早期提示词（历史归档 · 精细结构化规格）</h2>
        <span style="font-size: 11px; padding: 2px 6px; border-radius: 4px; background: #f1f5f9; color: #64748b; font-weight: 500;">ARCHIVED</span>
      </div>
      <p style="font-size: 13px; color: #64748b; margin-top: 0; margin-bottom: 1.25rem; line-height: 1.6;">
        早期采用的细致功能点约束提示词，详细指定了各区块模块与功能构成。
      </p>
      ${v1Items.map(item => renderPromptCard(item, "v1")).join("")}
    </div>
  `;

  // 绑定复制按钮事件
  container.querySelectorAll(".copy-btn").forEach(btn => {
    btn.addEventListener("click", async () => {
      const v = btn.getAttribute("data-version");
      const promptId = btn.getAttribute("data-prompt-id");
      const targetData = PROMPTS_DATA[v] && PROMPTS_DATA[v][promptId];
      if (!targetData) return;

      try {
        await navigator.clipboard.writeText(targetData.content);
        const copyTextSpan = btn.querySelector(".copy-text");
        btn.classList.add("copied");
        if (copyTextSpan) copyTextSpan.textContent = "复制成功 ✓";

        setTimeout(() => {
          btn.classList.remove("copied");
          if (copyTextSpan) copyTextSpan.textContent = "一键复制";
        }, 2000);
      } catch (err) {
        console.error("复制失败:", err);
      }
    });
  });
}

function renderPromptCard(item, version) {
  return `
    <article class="prompt-card" id="card-${version}-${item.id}">
      <header class="prompt-card-header">
        <div class="prompt-card-title-group">
          <h3 class="prompt-card-title">${item.title}</h3>
          <span class="prompt-type-pill">${item.badge}</span>
        </div>
        <button type="button" class="copy-btn" data-version="${version}" data-prompt-id="${item.id}">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
            <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
          </svg>
          <span class="copy-text">一键复制</span>
        </button>
      </header>
      <div class="prompt-card-content">
        ${parseMarkdown(item.content)}
      </div>
    </article>
  `;
}

// 挂载暴露到全局
window.LLMUIBench = {
  VERSIONS,
  MODELS,
  TEMPLATES_V2,
  TEMPLATES_V1,
  PROMPTS_DATA,
  state,
  initMainPage,
  initPromptsPage,
  parseMarkdown
};
