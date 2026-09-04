# 提示词：企业级数据可视化与分析管理后台 (Data & Analytics Dashboard)

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
- **纯原生自包含**：单 HTML 文件整合 CSS 和 JS，无需 Chart.js、ECharts 等第三方库（图表纯纯由轻量级原生 SVG / Canvas 或 HTML5 绘制）。
- **交互细节丰富**：
  - 侧边栏折叠/收起平滑过渡
  - 搜索框即时筛选表格内容
  - 状态筛选联动表格数据过滤
  - 时间范围切换触发图表与 KPI 数据动态重绘或动画过渡
  - 原生全屏/抽屉弹窗支持 ESC 键关闭与遮罩点击关闭
- **设计质感**：规范的色彩语义系统（Success、Warning、Danger、Primary）、严谨的文字排版网格与清晰的数据对比度。
