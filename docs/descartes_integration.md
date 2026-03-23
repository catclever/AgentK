# Agent K & Descartes: The Dual-Track Architecture

本文档记录了基于“内容优先 (Content-First)”以及“架构与业务代理分离”原则所确立的核心设计理念与演进路径。

## 一、宏观定调：意图与执行的彻底分离

我们摒弃了“让 AI 直接瞎写全量前后端代码”的传统粗放模式，转而建立了一套由 JSON Spec 驱动、多套智能（规则/AI）联合调度的 C/S (Client-Server) 系统。

在这套体系中：
*   **Frontend (Agent K Core)**：完全抛弃手写业务级 React 状态。UI 的唯一的真实来源是 `app_spec.json`。前端被降维成一台**极速的无脑渲染引擎**与**沙盒运行器**。
*   **Backend (Ruby Lab)**：承载所有的智能解析。无论是预设的确定性业务规则，还是非确定性的 AI 意图，均在纯正的后端运算环境中闭环，最后反哺前端的同步数据库 (RxDB/IndexedDB)。

---

## 二、后端的“三维解析器” (The 3 Resolvers)

面对来自前端 `agent_k` 的任何用户指令或触发器（Dispatch Event），后端的解析将进行分形：

### 1. The Nervous System - 确定性业务解析 (Amber Engine)
*   **职责**：处理已有系统的常规逻辑（如：“获取我的报表数据并合并用户权限”）。
*   **机制**：完全剥离大模型，通过 `Amber::Engine` 的 `Concurrent::Promise` 进行超高速的依赖并发推导。它是稳固的业务底盘。

### 2. The Meta-Programmer - 复杂后置业务处理 (Descartes - Data Instance)
*   **职责**：处理开放性的数据汇总与复杂的、尚未定义的业务编排。
*   **机制**：当 `Amber` 无法仅靠规则得出结论时，挂载了特殊 `Profile` 的 `Descartes` 实例启动。它利用调用后端数据的 Tool 进行分析，其**主要产出是 Amber 的 DSL 规则代码序列**。这使得该复杂业务在未来将降维为确定性的系统执行（第一维）。

### 3. The Front-end Architect - 纯 UI 的 Schema 生成器 (Descartes - UI Instance)
*   **职责**：处理视觉与交互组件（如：“主页帮我加个红色的退出登录按钮”）。
*   **机制**：此 `Descartes` 实例完全不触碰业务数据与 Amber。它唯一被训练的能力是：读取特定的 `app_spec.json`，根据 Agent K 组件规则库，精确地在抽象语法树 (AST) 的指定坐标插入 JSON 节点并返回。前端瞬间响应重绘。

---

## 三、开发演进的三条独立路线 (The Triple-Track)

整个系统的落地可以被拆解为三条互不干扰的演进主干（分别对应内核、触手与外壳）。这使得复杂的系统极其利于分别破局：

### Track 1: 从基础引擎起步 —— `core` (The Infrastructure Path)
这条路的目的是**证明“内容优先”且没有大模型也能跑通极速 UI 开发**。
1.  **完善 `Renderer.tsx` 与 Hooks**：实现基础的 `useQuery` / `useMutation` 封装。
2.  **构建 Dispatch 隧道原型**：验证 UI 触发事件 $\rightarrow$ 伪后端接收 $\rightarrow$ 同步改写 IndexedDB $\rightarrow$ 前端 HMR 秒刷的单向闭环。
3.  **支持动态注册表**：解决外部业务组件如何自动无缝挂载被 `Renderer` 解析的问题。

### Track 2: 从沙盒探针起步 —— 解绑的 `eye` (The Detached Agent Path)
> **核心认知突破**：`eye` (即文件读写监视器和 AI 交互口) 不应该死死绑定在 `shoggoth` (主 IDE 布局和画布) 身上。

*   **真正的 `eye` 定位**：它其实就是一个 **headless (无头) 的轻量级探针工具** (Agent Toolkit Runner)。
*   **开发路径**：
    1.  将 `libs/eyes` 里的纯 UI 面板与大模型 API 调用彻底铲除并剥离给后端。
    2.  将其重构为一个“文件与终端读写双向代理接头”，建立与后端 `Descartes` 实例的 WebSocket 通道。
    3.  实现：`eye` 发送当前错误 $\rightarrow$ 远端 `Descartes` 解析 $\rightarrow$ 远端发回修改指令 $\rightarrow$ 当地的 `eye` 默默修改文件。

### Track 3: 从可视化组装起步 —— 编辑器壳子 `shoggoth` (The Visual IDE Path)
如果你更倾向于所见即所得的交互体验，这里是纯前端的视觉试验场。
*   **真正的 `shoggoth` 定位**：它本身就是一个纯血的“低代码组装工作台” (The Hand & The Artboard)。
*   **开发路径**：
    1.  **脱离大模型**：哪怕拔掉网线、没有 AI，`shoggoth` 也必须能靠鼠标拖拽、右侧面板填参数，去完美修改底层 `WebContainer` 里的 `app_spec.json`。
    2.  **完善神之手 (`tentacles`)**：优化绝对坐标的换算、拖拽吸附、以及点击画布组件能精准反推到 AST 节点的映射关系。
    3.  **最终融合**：当 `shoggoth` 的可视化修改 和 `eye` (通过 Descartes 远端) 的代码集修改同时发生时，底层 `core` 的热更机制能完美消化这两者的冲突。

---

## 结论

经过解耦后：
- `shoggoth` = 可视化编辑器外壳 (UI Layout + Canvas)。
- `core` = 无情渲染与缓存映射器 (Zod + RxDB + React Render)。
- `eye` = 潜伏在任何沙盒环境中的执行探针 (SDK Worker)。
- `amber` & `descartes` (Backend) = 分工明确的超级大脑和业务心脏。
