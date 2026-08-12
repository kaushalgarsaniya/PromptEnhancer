# Product Requirements Document (PRD) — PromptForge

## 1. Executive Summary
PromptForge is a production-grade AI Prompt Engineering Platform ("Prompt Compiler") that transforms raw human intent—expressed in natural language (English, Hindi, Marathi, Bengali, Tamil, Telugu, Spanish, French, etc.)—into highly structured, clear, context-rich, and AI-ready prompts.

"You think. We engineer the prompt."

---

## 2. Target Persona & User Stories
1. **Developers & AI Engineers**: Want optimal system/user prompts for coding agents (Claude 3.5 Sonnet, GPT-4o, Gemini 1.5 Pro).
2. **Non-Technical Founders & Business Users**: Have vague ideas in various languages (e.g. English/Hindi/Spanish) and need crisp prompts to build MVPs or generate content.
3. **Students & Researchers**: Need structured educational and research prompts with strict constraints and output formats.
4. **Prompt Engineers & Creators**: Require version comparison, prompt quality heuristics (0-100 score), and target-model customization.

---

## 3. Core Capabilities & Feature Requirements

### 3.1 Multi-Language Input & Language Detection
- **Auto-Detection**: Automatic detection of input language with confidence score (e.g., English 99%).
- **Manual Override**: User capability to select input and target output prompt language.
- **Mixed-Language (Code-Mixing)**: Native handling of mixed-language inputs (e.g. English + regional terms).

### 3.2 Intent Classification & Extraction
- **Automatic Classification**: Classifies prompt intent into `build_something`, `learn_something`, `analyze_something`, `generate_code`, `debug_code`, `create_image`, `design_something`, etc.
- **Structured JSON Representation**: Extracts goal, target audience, features, technology stack, design preferences, and constraints into internal representation.

### 3.3 Interactive Missing Information Detector
- Identifies critical missing parameters (e.g. missing target framework, missing target audience, missing output format).
- Offers quick interactive options or allow custom input/skipping without blocking prompt optimization.

### 3.4 AI Interpretation & Review
- Generates a human-understandable summary of what the AI understood.
- Allows user editing of the interpretation before final prompt compilation.

### 3.5 Prompt Engineering Engine
- Injects standard prompt engineering patterns: **Role**, **Objective**, **Context**, **Task**, **Requirements**, **Constraints**, **Output Format**, **Edge Cases**, and **Evaluation Criteria**.
- Tailors verbosity to request complexity (concise for simple tasks, full framework for complex tasks).

### 3.6 Heuristic Prompt Quality Score (0–100)
- Breaks score down into **Clarity**, **Context**, **Specificity**, **Completeness**, **Constraints**, and **Output Format**.
- Provides actionable diagnostic breakdown ("Why isn't this 100?").

### 3.7 Target Model Optimization
- Supports targeting **General AI**, **Gemini**, **OpenAI (GPT-4o)**, **Anthropic (Claude)**, **Coding Agents (Cursor/Devin/Windsurf)**, and **Image Generation (Midjourney/DALL-E)**.

### 3.8 Before / After Comparison & Versioning
- Side-by-side (desktop) and stacked (mobile) diff UI highlighting added roles, constraints, formats, and structural improvements.
- Support for multiple preset versions: **Basic**, **Detailed**, **Expert**, **AI Agent Ready**.

### 3.9 Prompt Library, Favorites & Templates
- Categorized template library (Development, Design, Education, Business, AI Workflows).
- Full history management with search, tags, favorite toggle, copy, export, and delete actions.

---

## 4. Non-Functional Requirements
- **Performance**: Sub-100ms UI interactions; streaming or real-time phase updates during AI compilation.
- **Security**: Zero client-side API key exposure; rate limiting; sensitive secret detection & redaction (API keys, passwords).
- **Privacy**: Guest trial mode without immediate wall; opt-out prompt logging; standard data deletion mechanisms.
- **Accessibility**: WAI-ARIA compliant, full keyboard navigation, accessible contrast ratios, dark-first UI with light mode toggle.
