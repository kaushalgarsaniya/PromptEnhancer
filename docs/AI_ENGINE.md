# AI Engine Architecture — PromptForge

## 1. Provider Abstraction Layer

PromptForge is decoupled from any single AI vendor via a clean provider interface:

```typescript
export interface AIProvider {
  detectLanguage(input: string): Promise<{ language: string; confidence: number }>;
  analyzeIntent(input: string): Promise<IntentAnalysisResult>;
  extractMissingInfo(input: string, intent: string): Promise<MissingInfoQuestion[]>;
  generateInterpretation(input: string, intent: string): Promise<string>;
  optimizePrompt(params: PromptOptimizationParams): Promise<OptimizationResult>;
  calculateQualityScore(prompt: string): Promise<QualityScoreBreakdown>;
}
```

Implementations:
- `GeminiProvider` (Google Gemini 1.5 Pro / Flash via official SDK `@google/genai` or `@google/generative-ai`)
- `OpenAIProvider` (Fallback / Alternative)
- `AnthropicProvider` (Fallback / Alternative)
- `MockAIProvider` (For offline testing & automated fallback)

---

## 2. Multi-Stage AI Pipeline

```
[Raw User Input]
       │
       ▼
[Language Detection] ── (Detects English, Hindi, Spanish, etc.)
       │
       ▼
[Intent Classifier] ── (Categorizes goal into Build, Learn, Code, etc.)
       │
       ▼
[Entity Extraction] ── (Identifies features, tools, design style, target audience)
       │
       ▼
[Missing Information Analyzer] ── (Generates context-rich targeted questions)
       │
       ▼
[AI Interpretation Generator] ── (Provides transparent breakdown for user review)
       │
       ▼
[Prompt Engineering Engine] ── (Applies Role, Context, Requirements, Constraints, Output Format)
       │
       ▼
[Target Model Optimizer] ── (Adapts formatting for Claude, Gemini, GPT-4o, Coding Agents)
       │
       ▼
[Quality Evaluator & Diagnostician] ── (Computes 0-100 score + improvement feedback)
```

---

## 3. Supported Target Models & Customizations

1. **General AI**: Clean markdown layout with role, clear objective, bulleted requirements.
2. **Gemini**: Concise structured sections, explicit system prompt guidelines.
3. **OpenAI (GPT-4o)**: XML/Markdown hybrid tags (`<role>`, `<context>`, `<constraints>`, `<output_format>`).
4. **Anthropic (Claude 3.5)**: Strict `<thinking>` and `<instructions>` XML tagging formatting.
5. **Coding AI (Cursor / Windsurf / Devin)**: Technical stack specification, file structure expectations, edge cases, error handling, strict code-only output rules.
6. **Image Generation (Midjourney / Flux / DALL-E 3)**: Aspect ratio parameters, art style, lighting, render details, negative prompt suggestions.

---

## 4. Prompt Engineering Heuristic Scoring Framework

Overall Score = W1(Clarity) + W2(Context) + W3(Specificity) + W4(Completeness) + W5(Constraints) + W6(Output Format)

- **Clarity (20%)**: Ambiguity check, action verbs present.
- **Context (15%)**: User background, domain framing, audience defined.
- **Specificity (20%)**: Technical terms, exact scope boundaries.
- **Completeness (15%)**: Minimal missing core parameters.
- **Constraints (15%)**: Negative constraints ("Do NOT use...", "Must support...").
- **Output Format (15%)**: Explicit output expectation (JSON, Markdown code blocks, Step-by-step).
