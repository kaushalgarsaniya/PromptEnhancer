# API Specification — PromptForge

All backend routes are built as Next.js App Router Route Handlers (`app/api/...`).

## 1. Core Endpoints

### `POST /api/analyze`
Analyzes raw input text, detects language, extracts intent, structured entity data, missing information, and secrets warning.

**Request Body:**
```json
{
  "prompt": "I want to build a modern gym website with workout plans and calorie calculator.",
  "targetLanguage": "English",
  "targetModel": "Coding AI"
}
```

**Response (200 OK):**
```json
{
  "detectedLanguage": "English",
  "confidence": 0.99,
  "intent": "build_website",
  "entities": {
    "goal": "create gym website",
    "features": ["workout plans", "calorie calculator"],
    "design": "modern"
  },
  "missingInformation": [
    {
      "key": "technology",
      "question": "What technology stack should be used?",
      "options": ["Next.js & React", "HTML/CSS/JS", "Vue.js", "Let AI decide"]
    },
    {
      "key": "target_audience",
      "question": "Who is the primary target audience?",
      "options": ["Gym Members & Fitness Enthusiasts", "Personal Trainers", "General Public"]
    }
  ],
  "interpretation": "The user wants to build a modern fitness/gym web application featuring customizable workout plans and an interactive calorie calculator.",
  "sensitiveDataWarning": null
}
```

---

### `POST /api/optimize`
Runs the full multi-stage AI compilation pipeline to produce the optimized prompt, quality score breakdown, multiple versions, and improvements list.

**Request Body:**
```json
{
  "prompt": "...",
  "detectedLanguage": "English",
  "intent": "build_website",
  "targetModel": "Coding AI",
  "answers": {
    "technology": "Next.js & React",
    "target_audience": "Gym Members"
  },
  "interpretation": "..."
}
```

**Response (200 OK):**
```json
{
  "optimizedPrompt": "# ROLE\nYou are a Principal Full-Stack Engineer...\n\n# OBJECTIVE\nBuild a modern, high-performance gym web application...",
  "score": 94,
  "breakdown": {
    "clarity": 96,
    "context": 90,
    "specificity": 95,
    "completeness": 92,
    "constraints": 90,
    "outputFormat": 95
  },
  "improvements": [
    "Added expert Software Architect role",
    "Defined clear tech stack (Next.js, TypeScript, Tailwind)",
    "Added structured functional requirements for Workout Plans & Calorie Calculator",
    "Specified modern UI/UX design constraints & accessibility guidelines"
  ],
  "versions": [
    { "name": "Basic", "score": 82, "content": "..." },
    { "name": "Detailed", "score": 90, "content": "..." },
    { "name": "Expert", "score": 94, "content": "..." },
    { "name": "AI Agent Ready", "score": 96, "content": "..." }
  ]
}
```

---

### `POST /api/score`
Fast standalone heuristic quality score computation.

---

### `POST /api/detect-language`
Standalone fast language detection.

---

### `POST /api/interpret`
Generates human-readable AI interpretation of intent.

---

### `GET /api/prompts` & `POST /api/prompts` & `DELETE /api/prompts/[id]`
CRUD operations for history and library management.

---

### `GET /api/templates`
Retrieves pre-seeded template collection.

---

### `GET /api/analytics`
Fetches real usage statistics (total prompts optimized, average score, category distributions).

---

## 2. Security & Validation Controls
- **Zod Validation**: Strict runtime validation on all request bodies.
- **Rate Limiter Middleware**: Sliding window rate limiting based on client IP or user token.
- **Secret Scanner**: Regular expression scanner checking for AWS keys, OpenAI keys, Bearer tokens, private keys.
