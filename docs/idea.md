这是一个经过我们深度探讨后定型的、具备生产级可行性的完整架构方案。

我们将这个系统命名为 **"Agent K" (The Frontend Architect)**。

---

# 方案名称：Agent K —— 基于浏览器运行时的 AI 前端开发集成环境

## 1. 核心定义 (Core Concept)

**Agent K 不是一个低代码生成的“网页生成器”，而是一个运行在浏览器里的“AI 资深工程师” IDE。**

- **输出物：** 标准的、可维护的源代码（React + TS + CSS）。
- **运行环境：** 利用 **WebContainers** 在浏览器端提供完整的 Node.js 运行时，实现“边写、边跑、边修”。
- **核心逻辑：** 通过一套**“强约束的中间层框架”**，强制 AI 遵守最佳实践（Local-First, Optimistic UI），从而保证 AI 生成代码的高质量和健壮性。

---

## 2. 系统分层与核心工作 (System Layers & Core Work)

为了实现这一愿景，我们需要在四个层面同时推进工作：

### Layer 1. AI 规范与协议 (The AI Protocol)

**目标：** 定义 AI 的“行为准则”，使其成为可控的工程师，而非发散的创作者。

- **Schema-First:** 强制 AI 先定义数据结构（Zod），再写 UI。
- **Strict Mode:** 限制 AI 只能使用特定的 Hooks 和组件，禁止随意引入外部不可控依赖。
- **Error Recovery:** 定义 AI 如何解读错误日志并自我修正的标准化流程。

### Layer 2. 运行时与验证设施 (Runtime & Verification Infrastructure)

**目标：** 提供一个不仅能“跑”，还能“懂”代码的智能环境。

- **WebContainer Core:** 浏览器内的 Node.js 运行时，支持 `npm install` 和 `vite dev`。
- **Auto-Debugger:** 深度集成 console/network 钩子，自动捕获运行时错误，并将其翻译为 AI 能理解的结构化诊断报告。
- **Test Runner:** 自动化验证机制，确保 AI 生成的代码逻辑符合预期（不仅仅是无报错）。

### Layer 3. 人机协作界面 (Visual Collaboration & Presentation)

**目标：** 让用户在“表现层”工作，AI 在“代码层”工作，两者无缝衔接。

- **Visual Mapper:** 点击界面元素 -> 自动定位源码位置。
- **Direct Manipulation:** 允许用户像在 Figma 里一样直接调整样式（颜色、间距），系统自动反写回 CSS/Tailwind 代码。
- **Intent UI:** 用户通过自然语言或简单的拖拽表达意图，AI 负责复杂的实现细节。

### Layer 4. 智能中间层框架 (The Decoupled Framework)

**目标：** 构建一套“脱离后端逻辑”的前端积木，实现 Local-First 的开发体验。

- **Concept:** **Backend-as-a-Service (BaaS) for Frontend.**
- **Core:** **RxDB (Local Database)** + **Sync Engine**。
- **Value:** 前端组件不再依赖具体的 API 接口定义，而是依赖本地的数据模型。这使得组件可以像“积木”一样独立开发、测试和复用，完全解耦了后端进度。

---

## 3. 中间层协议与工作流 (The Protocol)

这是 AI 写代码必须遵守的“交通规则”。

### A. 数据定义 (Schema Definition)

AI 首先定义数据结构（Schema），而非直接写 UI。

- **动作：** AI 创建 `/src/schemas/User.ts`。
- **内容：** 定义 `User` 实体的全量字段、以及列表展示所需的 `UserSnippet`（摘要）字段。

### B. 读取策略 (Read Strategy)

**规则：** 列表用“摘要”，详情强制“全量”。

**1. 列表场景 (The List View):**

- **AI 代码:** `const { data } = useList('User', { filter: { role: 'admin' } })`
- **中间层行为:**
  - 检查本地是否有该 Query Key 的缓存。
  - 如无，请求后端 **Index API**。
  - **后端返回:** `{ meta: {...}, items: [{ id: '1', name: 'Jack', avatar: '...' }] }` (仅包含摘要字段)。
  - **存储:** 保存 ID 顺序；将摘要数据存入 User 表，标记 `_isFull: false`。

**2. 实体场景 (The Entity View):**

- **AI 代码:** `const { user } = useEntity('User', 'u_01')`
- **中间层行为:**
  - 检查本地 `u_01`。
  - **关键判断:**
    - 如果不存在 -> **Fetch**。
    - 如果存在但 `_isFull: false` (只有刚才列表带来的摘要) -> **Fetch (强制补全)**。
    - 如果存在且 `_isFull: true` -> **Return (直接返回)**。
  - **Fetch 动作:** 请求后端 **Entity API** (`GET /users?ids=u_01`)，后端**必须返回全量数据**。
  - **存储:** 更新 User 表，标记 `_isFull: true`。

### C. 写入策略 (Write Strategy)

**规则：** 前端优先（乐观更新），CQRS（命令查询分离），统一隧道。

- **AI 代码:** 不允许写 fetch/axios。
  - AI 只能写：`dispatch('update', 'User', 'u_01', { name: 'New Name' })`
  - 或：`dispatch('link', 'Album', 'a_01', { items: ['p_01'] })` (关系操作)
- **中间层行为:**
  1.  **Optimistic UI:** 立即修改 RxDB，界面 0 延迟刷新。
  2.  **Make Command:** 生成消息 `{ action: 'update', target: 'u_01', payload: ... }`。
  3.  **Transport:** 通过 **Dispatch API** (`POST /api/dispatch`) 发送给后端。
  4.  **Reconcile:** 如果后端报错，回滚 RxDB 并通知用户。

### 4. Transparent Data Layer

### 1. Infrastructure (The "Shell")

- **Current Implementation**: **WebContainer** (Browser-based Node.js).
- **Reasoning**: Chosen for Phase 1/2 for **zero-setup** and **controlled environment**, making it easier to debug the Core logic.
- **Alternative**: CLI / Local Node.js (Future Phase). The architecture allows swapping this shell because the intelligence lives in Layer 2.

### 2. Intelligent Intermediate Layer (The "Core") - **THE KERNEL**

- **@agent-k/core**: This is the heart of the system.

* **Philosophy**: The Frontend (and the AI building it) should be **agnostic** to data mechanics.
* **Abstraction**: The `@agent-k/core` library provides a simple `useQuery` / `useMutation` API.
  - **AI's View**: "I need to query 'todos'." (AI doesn't care about Sync, LRU, or IndexedDB).
  - **System's Job**: The Infrastructure layer handles Sync, Partial Replication, and Eviction transparently.
* **Benefit**: AI generates standard React code. It doesn't need to learn complex database management protocols.

---

### 5. Agent K Component Framework (The "Physics")

This is the constrained environment where AI builds applications.

1.  **Data-Driven Components (Schema-First)**

    - **Structure**: Component = Style + Data.
    - **Data Logic**: Strictly limited to standard Mutations (Create/Update/Delete) on the bound entities. No complex business logic inside components.

2.  **Routing Strategy (Centralized Definition, Distributed Trigger)**

    - **Definition**: Routes are defined centrally in `AppSpec` (e.g., `pages: [{ route: '/user/:id' }]`). This is the "Map".
    - **Trigger**: Components use `actions.navigate('/user/1')` to move. This is the "Car".
    - **Consistency**: Since AI controls both the Map (Spec) and the Car (Component), it ensures links are always valid.

3.  **Canvas-based Positioning (Visual System)**

    - **Local Coordinates**: Inside a component, everything is relative to `(0,0)`.
    - **Global Layout**: Components are placed on a "Canvas" by aligning their origin to a global `(x,y)`.
    - **Transform**: Supports Scaling (with min/max limits) and Rotation.

4.  **Usage-Time Styling (Contextual Props)**

    - **Principle**: Intrinsic properties (color, shape) are inside the component. Extrinsic properties (Opacity, Z-Index, Position) are declared at **usage time**.
    - **Benefit**: Components remain pure and reusable; context determines their presentation.

5.  **Restricted Logic (Data-Driven Actions)**
    - **Principle**: The frontend _only_ mutates local data. It never calls backend APIs directly.
    - **Implementation**: Components receive `actions` (`add`, `update`, `remove`, `refresh`).
    - **Local Refresh**: `actions.refresh()` triggers a re-fetch of the bound data from the backend, updating the local DB and automatically re-rendering the component. This supports granular, component-level updates.
    - **Workflow**: To trigger a backend process (e.g., "Send Email"), the frontend inserts a document into a `jobs` collection. The backend watches this collection and reacts.
    - **Benefit**: Decouples UI from Logic. The UI works offline. The backend can change implementation without breaking the UI.

---

## 6. Backend Contract (Minimalist)

为了配合上述框架，后端只需实现 3 类接口：

| 接口类型         | URL 示例             | 职责                          | 返回数据要求                       |
| :--------------- | :------------------- | :---------------------------- | :--------------------------------- |
| **Index API**    | `GET /api/:resource` | 搜索、筛选、分页              | **ID + 摘要数据 (Snippet)** + Meta |
| **Entity API**   | `GET /api/:resource` | 数据搬运 (支持 Batch `?ids=`) | **全量数据 (Full Data)**           |
| **Dispatch API** | `POST /api/dispatch` | 统一接收所有写操作            | 操作回执 (Ack)                     |

---

## 5. 用户与 AI 的交互流程 (User Experience)

### 场景：开发一个“任务管理看板”

**Step 1: 初始化与建模**

- **用户:** “我要做一个任务看板，有标题、描述、截止时间、状态。”
- **Agent K:**
  - 在文件系统创建 `Task.schema.ts`。
  - 定义 Zod Schema，并自动推导出 TypeScript 类型。

**Step 2: 界面开发 (AI Coding)**

- **用户:** “创建一个任务列表页。”
- **Agent K:**
  - 创建 `TaskList.tsx`。
  - 写入代码：调用 `useList('Task')`。
  - **保存文件 -> WebContainer 编译 -> 右侧预览出现界面。**

**Step 3: 视觉微调 (Figma-like Interaction)**

- **用户:** (点击预览界面里的任务卡片) “这个标题字体太小了，改成粗体。”
- **系统:**
  - 获取点击 DOM 的 `data-source` 属性。
  - 自动打开 `TaskList.tsx` 并高亮对应行。
- **Agent K:**
  - 读取该文件源码。
  - 修改 className 或 CSS。
  - 保存 -> **HMR 热更新** -> 界面瞬间变粗体。

**Step 4: 逻辑注入与调试 (Runtime Debugging)**

- **用户:** “点击完成按钮，把任务变灰。”
- **Agent K:**
  - 修改代码，绑定 `onClick` 事件。
  - 调用 `dispatch('update', 'Task', id, { status: 'done' })`。
- **模拟报错:** 假设 AI 写错了状态枚举值 `status: 'finished'` (正确是 `done`)。
- **运行时反馈:**
  - WebContainer 抛出 Zod 校验错误：`Invalid enum value`。
  - **Agent K:** 捕获错误日志 -> 读取 Schema 定义 -> **自动修正**代码为 `done` -> 保存修复。

---

## 6. 总结：为什么这个方案可行？

1.  **解决了“AI 写代码乱”的问题：**
    通过**中间层框架**，限制了 AI 的自由度。AI 只需要做“完形填空”（填组件、调 Hooks、发 Dispatch），而不需要去处理最复杂的网络竞态、缓存一致性问题。
2.  **解决了“调试难”的问题：**
    通过 **WebContainer**，实现了真实的浏览器运行时。AI 写的不是“死文本”，而是“活程序”。
3.  **解决了“前后端对接难”的问题：**
    通过 **Snippet/Full 策略** 和 **Dispatch 隧道**，后端接口标准化，前端数据逻辑自洽。

这是一个真正面向未来的、**AI Native** 的前端开发工作流。

## UI Architecture: The "JSON Spec" Philosophy

### Why JSON?

We chose a JSON-based Page Specification over raw JSX for three reasons:

1.  **AI-Friendly**: JSON is structured and deterministic. It prevents AI from generating invalid React syntax or hallucinating non-existent props.
2.  **Tooling-Friendly**: A JSON tree is the native data structure for a No-Code/Low-Code editor. It allows for easy implementation of "Drag & Drop", "Undo/Redo", and "Property Panels".
3.  **Safety**: By separating "Page Structure" (JSON) from "Component Logic" (Code), we ensure that AI-generated layout changes cannot break the application's core logic.

### Layout Strategy: The "Artboard" Model (Updated)

Based on user feedback, we are adopting a **"Base Resolution + Scaling"** approach, similar to game UI or design tools.

1.  **Base Resolution (The Artboard)**:

    - Each page defines a `designWidth` (e.g., 1440px).
    - The JSON spec coordinates are all relative to this base resolution.
    - **Alignment**: Content is typically center-aligned if the viewport is wider than the design.

2.  **Global Scaling**:

    - The Renderer calculates a `scale` factor: `currentViewportWidth / designWidth`.
    - The entire page content is scaled up or down to fit the screen (or fit width).
    - This ensures the design looks "proportionally correct" on all screens without complex media queries.

3.  **Component Responsiveness & The "Freedom" Problem**:

        - **User Insight**: Rigid containers (Stacks) kill creativity. We want free positioning.
        - **Solution: Adaptive Canvases (Multiple Artboards)**.
          - Instead of one fluid layout, we define **Multiple Fixed Layouts** (e.g., `home.desktop.json`, `home.mobile.json`).
          - **Page Spec Definition**:
            `typescript

    interface PageSpec {
    standardWidth: number; // e.g., 1440 (Ideal Design Width)
    minWidth: number; // e.g., 1024 (Scroll Threshold)
    components: ComponentInstance[];
    }
    ` - **Runtime Behavior**:

### Layout Strategy: The "Center-Anchor" Physics Model (Final)

Based on user feedback, we are adopting a simplified, game-like physics model for layout:

1.  **The "Rubber Sheet" Coordinate System**:

    - Every component is positioned by its **Center Point** `(cx, cy)`.
    - When the Artboard scales (e.g., 1.5x), the center point's coordinate scales linearly: `(cx * 1.5, cy * 1.5)`.
    - This means relative positions are always preserved.

2.  **The "Fixed vs. Scaled" Size Logic**:

    - While the _position_ always scales, the _size_ behavior is controlled by `resizeMode`:
    - **`resizeMode: 'scale'` (Default)**:
      - The component's width/height also multiply by 1.5.
      - Result: The component looks like it was "zoomed in".
    - **`resizeMode: 'fixed'`**:
      - The component's width/height remains unchanged (e.g., 100px).
      - Result: The component "floats" at the new scaled position, but keeps its original physical size.
      - **Crucial**: Since it's center-anchored, it expands/contracts from the center, maintaining alignment.

3.  **Internal Reflow**:
    - If a 'fixed' component's content changes, it grows from the center outwards.

---

## 8. The "Hand" Module (Visual Builder)

**Concept**: A standalone "God Mode" editor.

- **Independence**: It does not depend on the `Eye` (IDE). It can run as a pure No-Code builder.
- **Output**: It generates the `PageSpec` JSON.
- **Function**:
  - **Selection**: Highlights components.
  - **Manipulation**: Drag, Drop, Resize (Center-Anchor Physics).
  - **Assembly**: Drag components from a library onto the canvas.

## 9. The "Eye" Module (Runtime IDE)

**Concept**: The intelligent observer and runtime environment (formerly "IDE").

- **Function**:
  - **Runtime**: Runs the WebContainer.
  - **Observer**: Watches for errors, console logs, and network requests.
  - **Debugger**: The AI lives here, "watching" the code run and fixing it.

**Relationship**:

- The **Hand** builds the world (JSON).
- The **Eye** brings it to life (React Runtime) and maintains it (AI Debugging).

为了让 AI 能高效工作，我们定义了一套标准的文件组织方式：

```text
src/
  ├── schema/           # [Step 1] 数据定义 (Zod)
  │   ├── User.ts
  │   └── Todo.ts
  ├── components/       # [Step 2] 组件实现 (React)
  │   ├── UserCard.tsx
  │   └── TodoItem.tsx
  ├── pages/            # [Step 3] 页面组装 (AppSpec JSON)
  │   ├── home.json
  │   └── profile.json
  ├── App.tsx           # 路由入口 (加载 pages/*.json)
  └── main.tsx
```

**AI 的工作流映射：**

1.  **写组件**: 在 `src/components` 创建文件，引用 `src/schema` 定义的类型。
2.  **组装页面**: 在 `src/pages` 创建 JSON，引用 `src/components` 里的组件 ID。
3.  **逻辑验证**: 运行 App，如果报错，AI 读取错误日志，定位到具体文件进行修复。

---

## 10. The App Anatomy (What is an "App"?)

In the Agent K ecosystem, an "App" is composed of two layers:

### A. The "Soul" (User Land)

This is what the User and AI care about. It is portable and platform-agnostic.

1.  **Components (`src/components/*.tsx`)**: The visual building blocks.
2.  **Page Specs (`src/pages/*.json`)**: The layout and structure.
3.  **Schemas (`src/schema/*.ts`)**: The data definitions.

### B. The "Body" (System Land)

This is the boilerplate required to run the app in a browser. Ideally, this is **hidden** from the user.

1.  **Build Config**: `vite.config.ts`, `tsconfig.json`, `package.json`.
2.  **Entry Points**: `index.html`, `main.tsx`.
3.  **Styles**: `index.css` (Global Tailwind setup).

**Vision**: In the future, the "Eye" (IDE) will manage the "Body" automatically. The user only sees and edits the "Soul".
