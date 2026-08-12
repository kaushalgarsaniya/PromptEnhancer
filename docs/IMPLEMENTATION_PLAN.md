# PromptForge — Master Architecture & Implementation Plan

## 1. Product Architecture Overview
PromptForge is designed as a modular, full-stack Next.js application utilizing TypeScript, Tailwind CSS, Supabase PostgreSQL, and an extensible multi-provider AI pipeline.

"You think. We engineer the prompt."

---

## 2. System Architecture Diagram

```
┌──────────────────────────────────────────────────────────────────┐
│                      FRONTEND CLIENT (Next.js)                   │
│  Landing Page | Playground | Templates | History | Analytics | Settings│
└────────────────────────────────┬─────────────────────────────────┘
                                 │ HTTP API / Server Actions
                                 ▼
┌──────────────────────────────────────────────────────────────────┐
│                    API ROUTE HANDLERS (app/api)                  │
│  /analyze | /optimize | /score | /prompts | /templates | /analytics│
└───────────────┬──────────────────────────────────┬───────────────┘
                │                                  │
                ▼                                  ▼
┌───────────────────────────────┐  ┌──────────────────────────────┐
│  AI PROVIDER ABSTRACTION      │  │  SUPABASE / POSTGRESQL DB    │
│  Gemini / OpenAI / Anthropic  │  │  Prompts, Versions, Scores,   │
│  Mock Fallback Provider       │  │  Profiles, Templates, History│
└───────────────────────────────┘  └──────────────────────────────┘
```

---

## 3. Technology Stack & Dependencies

- **Framework**: Next.js 14+ (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS + Custom CSS Variables + Framer Motion
- **Icons**: Lucide Icons (`lucide-react`)
- **Database & Auth**: Supabase JS SDK (`@supabase/supabase-js`, `@supabase/ssr`)
- **AI SDK**: `@google/genai` / AI Provider Abstraction
- **Validation**: Zod
- **Testing**: Vitest / Playwright / Custom runner

---

## 4. Phase-by-Phase Execution Strategy

### Phase 1 — Foundation & Project Setup
- Initialize Next.js project with App Router, TypeScript, Tailwind CSS, Framer Motion, Lucide Icons.
- Configure theme provider (dark/light mode), design system tokens, global CSS.
- Establish folder structure (`app/`, `components/`, `lib/`, `types/`, `services/`).

### Phase 2 — Brand & High-Impact Landing Page
- Build responsive Navigation bar with Auth trigger & Theme toggle.
- Create Hero section with interactive live Prompt Transformation animation (Gujarati idea ➔ AI interpretation ➔ Optimized prompt).
- Build How It Works, Features grid, Before/After Interactive Comparison, Supported Languages carousel, Template preview, CTA, and Footer.

### Phase 3 — Playground & Core UI
- Build main `/playground` experience.
- Prompt Editor with auto-resize, token count estimate, language badge, paste/clear triggers.
- Language selector dropdown, Intent selector, Target model selector (General, Gemini, OpenAI, Claude, Coding AI, Image Gen).
- Interactive Missing Information step card drawer.
- AI Interpretation panel with quick edit option.
- Optimized output display with score breakdown, version tabs (Basic, Detailed, Expert, AI Agent Ready), side-by-side diff view, copy, save, export.

### Phase 4 — AI Engine & Provider Abstraction
- Implement `AIProvider` interface and `GeminiProvider` using Google Gemini API with fallback to `MockAIProvider` if API key is not configured.
- Build multi-stage pipeline: Language Detection, Intent Classification, Entity Extraction, Missing Info Detector, AI Interpretation, Prompt Compiler, Quality Scorer.
- Add Sensitive Data Scanner & Redaction warning (for API keys, passwords, credentials).

### Phase 5 — Database Integration (Supabase)
- Set up Supabase client helpers (`lib/supabase/client.ts`, `lib/supabase/server.ts`).
- Create database schemas for `prompts`, `prompt_versions`, `prompt_analysis`, `templates`, `favorites`, `profiles`, `usage_events`.
- Build persistent LocalStorage fallback for seamless guest usage before login.

### Phase 6 — Authentication & Guest Mode
- Supabase Auth integration (Google, GitHub, Email magic link).
- Enable "Try without account" flow allowing users to engineer prompts first and save/sync upon signup.

### Phase 7 — Dashboard, Templates, History, Analytics, Settings
- `/dashboard`: Personal stats, quick actions, recent prompts list.
- `/templates`: Searchable, filterable library of prebuilt starter prompts across Development, Design, Education, Business, AI categories.
- `/history`: History timeline with search, category filtering, favorite toggles, copy, edit, delete.
- `/favorites`: Bookmarked prompts manager.
- `/analytics`: User activity metrics, average score improvement chart, language & target model usage stats.
- `/settings`: Preferences (default target model, output language, dark mode, data management).

### Phase 8 — Security, Rate Limiting & Validation
- Implement Zod schema validation for all API inputs.
- Sliding-window rate limiter for guest and authenticated sessions.
- Input sanitization & secret protection.

### Phase 9 — Automated Verification & Testing
- Unit tests for AI compiler logic, heuristic scoring algorithm, language detection, secret scanner.
- Browser & mobile responsive validation (Playwright / end-to-end verification).

### Phase 10 — Polish, SEO & Final Delivery
- Open Graph tags, Twitter cards, meta tags, semantic HTML tags.
- Accessibility audit (ARIA tags, keyboard navigation, contrast check).
- Final code cleanup & comprehensive report documentation.
