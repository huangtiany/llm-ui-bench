# 提示词：现代化 AI Agent 协同与工作流工作台 (AI Agent Workspace & Canvas)

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
     - 模拟展示工具调用（如 `execute_command("pytest")`、`fetch_schema("users")`）及终端输出结果
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
- **高品质视觉细节**：精细的暗色系灰阶渐变（Zinc/Slate palette）、状态彩色指示点（蓝/绿/紫/琥珀色）、代码等宽字体排版与优雅的滚动条定制。
