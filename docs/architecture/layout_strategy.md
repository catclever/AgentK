# Layout Architecture Strategy: The Layered Approach

## 1. The Core Conflict: Canvas (Absolute) vs. Code (Flow)

Modern web development faces a fundamental tension between design freedom and code maintainability:

- **Design Tools (Sketch/Figma)**: Use **Absolute Positioning** (x, y coordinates). Allows "pixel-perfect" freedom but lacks responsiveness.
- **Code (React/Tailwind)**: Uses **Flow Layout** (Flexbox/Grid). Ensures responsiveness but is hard to map back to "arbitrary drag-and-drop".

**The Trap**: Trying to reverse-engineer "clean Flexbox code" from "arbitrary absolute coordinates" (e.g., Lovable/v0) is extremely difficult and often results in unmaintainable "spaghetti code".

## 2. The Solution: Layered Layout Architecture

Instead of choosing one, we adopt a **Layered Architecture** common in Low-Code platforms (Retool, Appsmith).

### A. Macro Layer: Absolute/Grid (The Canvas)

- **Concept**: The page is a fixed coordinate system (or coarse grid).
- **Mechanism**: Components are positioned absolutely (`x: 100, y: 200`) or snapped to grid cells.
- **Responsiveness**: Handled via **Adaptive Layouts** (multiple JSONs for Mobile/Desktop) + **Global Scaling** (Zooming the entire container).
- **AI Role**: AI easily determines "macro placement" (e.g., "Put the table at the top") without needing to write complex CSS flex logic.

### B. Micro Layer: Fluid/Responsive (The Component)

- **Concept**: The internal content of a component.
- **Mechanism**: Standard HTML/CSS (Flux/Grid).
- **Behavior**: A component accepts a fixed `width/height` from the Macro Layer, but its _internal_ content reflows naturally.
  - Example: A "Card" component at `w: 400px` might show 3 columns of text; at `w: 200px` it reflows to 1 column.

## 3. Implementation Strategy: "Adaptive + Scaling"

To solve the "Screen Size" problem without flow layout:

1.  **Multiple Layouts**: Define separate JSON specs for Mobile (375px), Tablet, Desktop.
2.  **Runtime Selection**: Select the closest matching layout at runtime.
3.  **Scale Fitting**: Calculate `scale = currentWidth / designWidth` and apply `transform: scale()` to the root container. This ensures 100% fit without overlapping elements.

## 4. Industry Validation & AI Evolution

Research confirms that leading low-code platforms are evolving towards AI using this exact architectural pattern:

### Retool AI

- **Architecture**: Uses a "Fixed Grid" (Macro) combined with "Stacks" (Micro-Flex).
- **AI Integration**: "Retool AI" generates app structures by placing pre-built components (Tables, Charts) onto the grid. AI handles the data binding and query generation, while the grid layout ensures the UI doesn't break.
- **Strategy**: AI acts as a "Grid Placer", avoiding the need to write complex CSS.

### Appsmith AI Copilot

- **Architecture**: "Intent-based auto-layouts" which hybrids absolute positioning with auto-grouping (Row Wrappers).
- **AI Integration**: AI generates "Custom Widgets" (Micro Layer) using standard code, while the platform handles the macro positioning. This validates the "Layered" approach where AI generates the internal component logic while the platform manages the container.

### Microsoft Power Apps Copilot

- **Architecture**: Containers and Form-based rendering.
- **AI Integration**: Users describe business needs ("I need an expense tracker"), and Copilot generates the **Data Schema** (Tables) first, then scaffolds a UI based on standard layouts. It doesn't "draw" the UI pixel-by-pixel but "assembles" it from patterns.

## 5. Decision for Project `agnet_f`

We will proceed with this **Runtime-First, Layered approach**:

- **Data Model**: Keep strictly typed `x/y/w/h` in JSON schema.
- **Constraint**: Add `layouts` field to support multi-device specs.
- **Renderer**: Implement "Scale-to-Fit" logic in `Artboard`.
