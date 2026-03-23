# Recommended Open Source Stack

To realize the "Layered Architecture" (Runtime Layout + Code Generation) without reinventing the wheel, we recommend the following stack:

## 1. Core (State & Editor Engine) -> **Craft.js**

Instead of writing your own node tree logic, undo/redo, and serialization, use **Craft.js**.

- **Role**: It manages the "Tree" of components. It handles the logic of "User dropped Button A into Container B".
- **Why**: It is "Headless". It doesn't force a UI on you. It gives you the hooks (`useNode`, `useEditor`) to build your own Figma-like UI.
- **Key Feature**: It serializes to JSON automatically, which fits perfectly with your `app_spec.ts` needs.

## 2. Tentacles (Interaction Layer) -> **React-RND** or **Scena**

You need the "Rubber Band" effect (Drag, Resize, Rotate).

- **Recommendation**: **React-RND** (Simpler, stable) or **React-Moveable** / **Scena** (Advanced, Figma-like).
- **Why**:
  - `react-rnd`: Great for simple "Drag & Resize". Easy to set `bounds` to parent.
  - `moveable`: If you need "Snapping", "Alignment Lines", "Multi-Select Group Resize". It is much more powerful but complex.
- **Integration**: You wrap your Craft.js components in a `Selectable` wrapper that uses `react-rnd`.

## 3. Eyes (Runtime Preview) -> **WebContainer API**

You are already using this, and it is the best choice.

- **Role**: Runs the generated project in the browser.
- **Why**: It's a full Node.js environment. You can run `vite`, `npm install`, etc. securely in the browser.
- **Alternative**: **Sandpack** (by CodeSandbox). Lighter, easier to setup for simple React component previews, but less flexible for full "backend-inclusive" projects.

## 4. UI Components (Micro Layer) -> **Shadcn/UI** (Radix UI)

For the actual components (Buttons, Tables) that the AI places:

- **Recommendation**: **Shadcn/UI**.
- **Why**: It is not a library you "install", but code you "copy". This means the User (Developer) gets full control of the component source code, which matches the "Clean Code" goal for the micro-layer.

## Architecture Diagram

```mermaid
graph TD
    A[User Drags Component] -->|Intercepted by| B[Tentacles (React-RND)]
    B -->|Updates| C[Core (Craft.js)]
    C -->|Serializes to| D[JSON Spec]
    D -->|AI / Transformer| E[Code Generator]
    E -->|Writes Files to| F[Eyes (WebContainer)]
    F -->|Renders| G[Live Preview]
```
