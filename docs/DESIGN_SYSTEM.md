# Design System — PromptForge

## 1. Aesthetic Direction
- **Vibe**: Modern AI Developer Tool, Sleek, Futuristic, Dark-First, High Readability, Silicon Valley Quality.
- **Base Theme**: Deep Obsidian Dark (`#0B0F17`) with Subtle Cyan/Indigo Glass Accent Glows.
- **Typography**: Inter / Outfit / JetBrains Mono (for prompts & code blocks).

---

## 2. Color Palette & Tokens

### Dark Theme Palette
- **Background Root**: `hsl(222, 47%, 5%)` (`#070A11`)
- **Card / Glass Surface**: `rgba(15, 23, 42, 0.65)` with backdrop blur `12px` and `1px solid rgba(255, 255, 255, 0.08)`.
- **Primary Gradient**: `linear-gradient(135deg, #6366F1 0%, #A855F7 50%, #EC4899 100%)`
- **Cyan Accent (Glow)**: `#06B6D4`
- **Text Primary**: `hsl(210, 40%, 98%)`
- **Text Muted**: `hsl(215, 20%, 65%)`
- **Border Default**: `rgba(255, 255, 255, 0.1)`

### Status Indicators
- **Success / High Score (80-100)**: Emerald (`#10B981`)
- **Warning / Medium Score (50-79)**: Amber (`#F59E0B`)
- **Alert / Low Score (0-49)**: Rose (`#F43F5E`)

---

## 3. UI Component System
- **Button Variants**: Primary Gradient, Glass Outline, Ghost, Icon Only.
- **Prompt Editor**: Custom autosizing textarea with line numbers, token counter, copy button, language indicator badge, clear trigger, keyboard shortcuts (`Ctrl+Enter` to submit).
- **Quality Radial Gauge / Progress Bar**: Animated radial SVG ring for 0-100 heuristic visual indicator.
- **Side-by-Side Diff Viewer**: Desktop split view with color-coded additions (role, constraints, formatting).
- **Interactive Question Cards**: Smooth step wizard allowing selection or quick skipping.

---

## 4. Animation & Motion Design
- Framer Motion micro-interactions:
  - Page transitions: Fade & subtle Y-slide (`duration: 0.25s`)
  - Transformation state pipeline: Step pulse animations with clear progress messaging.
  - Hover states: Scale 1.02 with soft cyan border glow.
  - Reduced Motion: Full compliance via `useReducedMotion()`.
