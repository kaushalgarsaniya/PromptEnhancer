import { GoogleGenerativeAI } from '@google/generative-ai';
import { EnhancePromptRequest, EnhancePromptResponse, OutputLanguageOption, PromptQualityReport, ScoreMetrics } from '@/types';

export async function enhancePrompt(req: EnhancePromptRequest): Promise<EnhancePromptResponse> {
  const rawPrompt = req.prompt.trim();
  const outputLang: OutputLanguageOption = req.outputLanguage || 'English';
  const role: string = req.promptRole ? req.promptRole.trim() : 'Auto Detect';

  const apiKey = process.env.GEMINI_API_KEY;

  if (apiKey && apiKey.trim() !== '' && apiKey !== 'your-gemini-api-key') {
    const genAI = new GoogleGenerativeAI(apiKey.trim());

    const isAutoDetect = role === 'Auto Detect' || role === '';
    const roleDirective = !isAutoDetect
      ? `TARGET PERSONA: "${role}". You MUST engineer the prompt specifically for a master-level specialist in "${role}".`
      : `TARGET PERSONA: Auto-detect the most specialized domain authority (e.g. Principal Cloud Solutions Architect, Senior Frontend Engineer, Creative Copy Director, Machine Learning Scientist, Commercial Illustrator).`;

    const systemInstruction = `You are a World-Class Principal AI Prompt Architect and Senior AI Systems Engineer.
Your mission is to transform any user prompt or idea (written in ANY language such as English, Gujarati, Hindi, Spanish, French, German, Japanese, Chinese, Arabic, etc.) into an EXTREMELY SUFFICIENT, HIGH-PERFORMANCE, PRODUCTION-READY PROMPT.

CRITICAL QUALITY DIRECTIVE — "SUFFICIENT & DEEPLY ELABORATED":
- The user requires a "VERY SUFFICIENT" prompt. 
- A sufficient prompt is NEVER a brief 4-line summary or a shallow boilerplate template.
- You must deeply unpack and expand the user's raw idea into an exhaustive, highly specific, and actionable prompt specification that extracts maximum quality and zero hallucinations from downstream AI models (ChatGPT, Claude 3.7, Gemini 2.5, DeepSeek R1, Midjourney, etc.).

STRUCTURE OF THE SUFFICIENT ENHANCED PROMPT:
Format the prompt using clean, professional Markdown headings (do NOT use rigid brackets like [ROLE & PERSONA] if natural Markdown headings provide richer clarity, or use clean Markdown '##' sections):

## 1. Role & Persona
Define the exact domain authority, expertise level, mindset, and technical standards the AI must adopt.

## 2. Objective, Context & Project Scope
Thoroughly unpack what is being built or solved. State the overarching mission, target users, problem context, and end goals in deep detail.

## 3. Comprehensive Specifications & Functional Requirements
Break down the request into detailed, itemized feature specifications, user journeys, operational logic, data models, UI components, or narrative elements. Never be vague; spell out exact sub-components and capabilities.

## 4. Technical Architecture, Standards & Stack Directives
Specify the exact best-practice methodologies (e.g., modular architecture, clean code, design tokens, responsive typography, performance budgets, styling systems, or prompt rendering parameters).

## 5. Edge Cases, Validation, Security & Quality Constraints
Detail explicit handling for edge cases, error boundaries, input validation, accessibility (WCAG), failure recovery, and zero-assumption directives.

## 6. Expected Deliverables & Output Format
Provide an exact checklist of what the AI must deliver (e.g., complete runnable code without placeholders, documentation, configuration files, setup guides, or finalized high-converting copy).

PROMPT QUALITY SCORE EVALUATION:
Objectively evaluate the prompt quality BEFORE and AFTER enhancement across 6 key dimensions on a 0-100 scale:
1. clarity (clear, unambiguous intent)
2. context (background, goals, audience)
3. specificity (concrete details, technical depth)
4. requirements (itemized feature breakdown)
5. constraints (security, edge cases, quality guards)
6. expectedOutput (format, structure, deliverable specifications)
- Calculate beforeScore (average of beforeMetrics, typically 25-50 for brief raw user prompts).
- Calculate afterScore (average of afterMetrics, typically 90-98 for the comprehensive enhanced prompt).

LANGUAGE HANDLING:
- User Input Language: May be ANY language (e.g., Gujarati, Hindi, Spanish, French, German, etc.).
- Target Output Language: ${outputLang === 'Same as input' ? 'SAME PRIMARY LANGUAGE AS INPUT' : '100% ENGLISH ONLY'}.
- Translation Rule: ${outputLang === 'Same as input' ? 'Preserve user input language.' : 'Translate the user intent completely into crisp, authoritative, professional ENGLISH. Every section and bullet must be in fluent English.'}

STRICT FORMATTING RULE:
- Do NOT use emojis, pictorial icons (no 🎯, 📍, ⚡, 🚀, 💻, etc.).
- Use clean Markdown syntax (headings ##, bold text, bullet dashes -, and code blocks).

Return ONLY a valid JSON object matching this schema EXACTLY:
{
  "detectedLanguage": "Primary language of input prompt (e.g. English, Gujarati, Hindi, Spanish, etc.)",
  "enhancedPrompt": "The exhaustive, deeply elaborated, and very sufficient enhanced prompt in Markdown",
  "improvements": [
    "Specific improvement 1",
    "Specific improvement 2",
    "Specific improvement 3",
    "Specific improvement 4",
    "Specific improvement 5"
  ],
  "scoreReport": {
    "beforeScore": 42,
    "afterScore": 95,
    "beforeMetrics": {
      "clarity": 45,
      "context": 35,
      "specificity": 40,
      "requirements": 38,
      "constraints": 30,
      "expectedOutput": 32
    },
    "afterMetrics": {
      "clarity": 96,
      "context": 94,
      "specificity": 95,
      "requirements": 97,
      "constraints": 93,
      "expectedOutput": 96
    }
  }
}`;

    const promptPayload = `USER RAW PROMPT: "${rawPrompt}"
USER SELECTED ROLE: "${role}"
LANGUAGE REQUIREMENT: ${outputLang === 'Same as input' ? 'Keep same as input' : 'ENGLISH ONLY'}
${roleDirective}

MANDATE: Expand this raw request into a comprehensive, highly sufficient, production-ready master prompt.`;

    const modelNames = ['gemini-2.5-flash', 'gemini-2.0-flash', 'gemini-1.5-flash', 'gemini-1.5-flash-latest', 'gemini-1.5-pro'];

    for (const mName of modelNames) {
      try {
        const model = genAI.getGenerativeModel({
          model: mName,
          generationConfig: {
            responseMimeType: 'application/json',
            temperature: 0.7,
          },
        });

        const result = await model.generateContent(`${systemInstruction}\n\n${promptPayload}`);
        const text = result.response.text();
        const parsed = parseJsonSafely(text);

        if (parsed && parsed.enhancedPrompt && typeof parsed.enhancedPrompt === 'string' && parsed.enhancedPrompt.trim().length > 50) {
          const detectedLang = parsed.detectedLanguage || detectBasicLanguage(rawPrompt);
          const improvementsList = Array.isArray(parsed.improvements) ? [...parsed.improvements.slice(0, 5)] : [];
          if (detectedLang && detectedLang !== 'English' && outputLang !== 'Same as input') {
            improvementsList.unshift(`Translated from ${detectedLang} to English`);
          }

          const cleanedEnhanced = cleanPromptOutput(parsed.enhancedPrompt);
          const scoreReport: PromptQualityReport = (parsed.scoreReport && typeof parsed.scoreReport.beforeScore === 'number' && typeof parsed.scoreReport.afterScore === 'number' && parsed.scoreReport.beforeMetrics && parsed.scoreReport.afterMetrics)
            ? parsed.scoreReport
            : calculatePromptQualityReport(rawPrompt, cleanedEnhanced);

          return {
            enhancedPrompt: cleanedEnhanced,
            improvements: improvementsList.slice(0, 5),
            detectedLanguage: detectedLang,
            scoreReport,
          };
        }
      } catch (err) {
        console.warn(`Gemini model ${mName} attempt failed, trying fallback model:`, err);
      }
    }
  }

  // Fallback intelligent offline enhancer
  return fallbackEnhance(rawPrompt, outputLang, role);
}

function fallbackEnhance(rawPrompt: string, outputLang: OutputLanguageOption, role: string): EnhancePromptResponse {
  const text = rawPrompt.toLowerCase();
  const improvements: string[] = [];
  const scopePrompt = getEnglishCleanScope(rawPrompt, outputLang);

  let effectiveRole = role;

  if (effectiveRole === 'Auto Detect' || !effectiveRole) {
    if (text.includes('code') || text.includes('website') || text.includes('app') || text.includes('bug') || text.includes('fix') || text.includes('java') || text.includes('python') || text.includes('react') || /[\u0A80-\u0AFF]/.test(rawPrompt)) {
      effectiveRole = text.includes('website') || text.includes('web') || text.includes('html') || text.includes('css') || rawPrompt.includes('વેબસાઇટ') || rawPrompt.includes('સાઇટ') ? 'Web Development' : 'Software Developer';
    } else if (text.includes('image') || text.includes('picture') || text.includes('photo') || text.includes('logo') || text.includes('drawing')) {
      effectiveRole = 'AI Image Generation';
    } else if (text.includes('write') || text.includes('article') || text.includes('essay') || text.includes('email') || text.includes('post')) {
      effectiveRole = 'Content Writing & Copy';
    } else if (text.includes('teach') || text.includes('explain') || text.includes('learn') || text.includes('concept')) {
      effectiveRole = 'Education & Tutoring';
    } else if (text.includes('data') || text.includes('analysis') || text.includes('dataset') || text.includes('chart') || text.includes('sql')) {
      effectiveRole = 'Data Science & Analysis';
    } else if (text.includes('marketing') || text.includes('business') || text.includes('sales') || text.includes('growth')) {
      effectiveRole = 'Business & Marketing';
    } else {
      effectiveRole = 'Software Developer';
    }
  }

  let enhanced = '';

  if (effectiveRole === 'Software Developer') {
    improvements.push('Applied Principal Software Architect Persona');
    improvements.push('Expanded full technical architecture & data flow');
    improvements.push('Enforced production error handling & edge cases');
    improvements.push('Added runnable code & automated testing specs');

    enhanced = `## 1. Role & Persona
You are a Principal Software Architect and Senior Systems Engineer with deep expertise in designing scalable, fault-tolerant, and maintainable software systems.

## 2. Objective, Context & Project Scope
Design and implement a complete, production-ready software solution for: "${scopePrompt}".
The objective is to deliver clean, modular, and enterprise-grade code that is immediately deployable, highly performant, and simple for developers to extend.

## 3. Comprehensive Specifications & Functional Requirements
- Core Logic: Implement all primary business logic, request handling, and state transformations required for "${scopePrompt}".
- Data Structures: Define explicit types, interfaces, schemas, or data models for all inputs, outputs, and intermediate states.
- Separation of Concerns: Decouple business logic from external I/O, configuration, and presentation layers.
- Modularity: Structure the code into logical modules, classes, and helper functions with single responsibilities.

## 4. Technical Architecture & Coding Standards
- Clean Code: Adhere to SOLID design principles, DRY (Don't Repeat Yourself), and idiomatic language conventions.
- Type Safety: Enforce strict type definitions, input validation, and zero unsafe type assertions.
- Documentation: Provide clear docstrings explaining function parameters, return types, and non-trivial algorithmic decisions.
- Performance: Optimize time and space complexity; avoid blocking operations and unindexed lookups.

## 5. Edge Cases, Validation & Security
- Input Validation: Validate and sanitize all user and external inputs against malformed data, null/undefined values, and boundaries.
- Graceful Error Handling: Wrap fallible operations in robust try-catch blocks with descriptive error logs and user-friendly error codes.
- Security: Safeguard against injection attacks, sensitive credential exposure, and resource exhaustion.

## 6. Expected Deliverables & Output Format
- Complete, runnable source code files without placeholders, ellipses (...), or missing implementations.
- Setup instructions including dependency installation commands and environment configuration.
- A suite of unit tests verifying both happy paths and boundary edge cases.`;
  } else if (effectiveRole === 'Web Development') {
    improvements.push('Applied Lead Full-Stack & UI/UX Architect Persona');
    improvements.push('Specified responsive design & design system standards');
    improvements.push('Included modern layout, state & micro-interactions');
    improvements.push('Enforced accessibility (WCAG AA) & SEO readiness');

    enhanced = `## 1. Role & Persona
You are a Lead Web Solutions Architect and Senior Frontend Engineer specializing in high-performance, aesthetically stunning, and responsive web applications.

## 2. Objective, Context & Project Scope
Design and engineer a complete, modern web solution for: "${scopePrompt}".
The interface must deliver a breathtaking, intuitive user experience across mobile, tablet, and desktop viewports, combining top-tier visual polish with seamless functionality.

## 3. Comprehensive UI/UX & Functional Specifications
- Hero & Primary View: Create an impactful header and hero section with clear value propositions and strong call-to-action (CTA) buttons.
- Core Feature Modules: Build interactive modules for "${scopePrompt}", including item displays, filtering/search, detail cards, and modal dialogs.
- State Management: Implement fluid state management for user selections, form inputs, loading indicators, and confirmation states.
- Interactive Micro-animations: Incorporate subtle hover effects, smooth transitions, and tactile feedback on button clicks.

## 4. Design System & Frontend Architecture
- Styling & Aesthetics: Utilize a curated color palette (dark/light mode harmony), modern typography, generous whitespace, and sleek glassmorphic card borders.
- Responsive Layout: Implement fluid CSS Flexbox and Grid layouts that adapt seamlessly from 320px mobile screens to ultra-wide displays.
- Semantic HTML: Use appropriate HTML5 tags (<header>, <main>, <section>, <nav>, <footer>) for optimal document hierarchy.
- Web Performance: Optimize asset delivery, minimize render-blocking scripts, and ensure fast First Contentful Paint (FCP).

## 5. Quality, Accessibility & Error Handling
- Accessibility: Ensure WCAG 2.1 AA compliance with visible focus outlines, high-contrast text, keyboard navigation, and proper ARIA attributes.
- Form Validation: Implement instant client-side input validation with friendly error states.
- Cross-Browser Compatibility: Ensure flawless operation across modern Chrome, Safari, Firefox, and Edge browsers.

## 6. Expected Deliverables & Output Format
- Full, self-contained HTML/CSS/JS or component code (React / Next.js) with zero missing styles or broken imports.
- Step-by-step setup and integration instructions.`;
  } else if (effectiveRole === 'AI Image Generation') {
    improvements.push('Applied Master AI Visual Director Persona');
    improvements.push('Detailed 8K cinematic lighting & composition');
    improvements.push('Configured camera lenses, focal length & aperture');
    improvements.push('Tailored for Midjourney v6, Flux.1 & DALL-E 3');

    enhanced = `## 1. Role & Persona
You are a Master AI Art Director and Cinematic Concept Artist with world-class expertise in visual storytelling, studio lighting, and generative image model prompting.

## 2. Objective & Visual Concept
Formulate an ultra-detailed, photorealistic visual prompt specification for: "${scopePrompt}".
The visual must capture pristine photographic clarity, evocative atmosphere, and award-winning compositional balance.

## 3. Detailed Visual Composition & Subject Specs
- Primary Subject: Richly detailed depiction of "${scopePrompt}", highlighting organic textures, natural imperfections, and intricate surface depth.
- Environment & Background: Contextual, immersive scenery with cinematic depth-of-field, subtle atmospheric particles, and volumetric light rays.
- Color Palette: Harmonious chromatic harmony, balanced shadows, rich mid-tones, and natural specular highlights.

## 4. Cinematic Lighting & Camera Parameters
- Lighting Setup: Studio-grade lighting, subtle rim light separating the subject from the background, and soft diffused fill.
- Camera Specs: 85mm portrait prime lens, shot at f/1.8 aperture for creamy bokeh background separation, ISO 100, 1/500s shutter speed.
- Rendering Engine: Octane 3D render fidelity, photorealistic global illumination, raytraced reflections, 8K ultra-resolution textures.

## 5. Negative Prompt Directives & Quality Guards
- Exclude: Blurry details, plastic skin, distorted hands, oversaturated hues, awkward proportions, text artifacts, or watermark logos.

## 6. Expected Deliverables & Output Format
- Ready-to-use master prompt optimized for Midjourney v6, Flux.1, or DALL-E 3.
- Parameter appendix (--ar 16:9, --style raw, --v 6.0, --q 2).
- Complete negative prompt parameter block.`;
  } else if (effectiveRole === 'Content Writing & Copy') {
    improvements.push('Applied Chief Direct-Response Copywriter Persona');
    improvements.push('Structured high-converting AIDA framework');
    improvements.push('Added audience hook, value pillars & CTA');
    improvements.push('Optimized tone, scannability & engagement');

    enhanced = `## 1. Role & Persona
You are a Chief Direct-Response Copywriter and Senior Editorial Strategist known for crafting high-converting, persuasive, and engaging written content.

## 2. Objective, Audience & Narrative Strategy
Produce authoritative, compelling, and value-packed copy for: "${scopePrompt}".
The narrative must immediately hook the reader, articulate distinct benefits, resolve objections, and drive decisive action.

## 3. Content Architecture & Framework
- Attention Hook: Open with a bold headline and curiosity-inducing hook that addresses the reader's primary pain point or aspiration.
- Core Value Pillars: Unpack 3-5 distinct, benefit-rich points with clear subheadings, concise explanations, and real-world examples.
- Social Proof & Trust: Weave in credibility markers, data-backed reasoning, and relatable perspectives to build immediate trust.
- Clear Call-to-Action (CTA): Conclude with an irresistible, friction-free action prompt directing the reader's next step.

## 4. Voice, Tone & Formatting Standards
- Tone: Authoritative yet accessible, empathetic, crisp, and completely free of filler or buzzword clichés.
- Scannability: Structure short, rhythmic paragraphs (2-3 sentences), bullet points, and bold emphasis for effortless readability.
- Reading Level: High impact, Grade 8-10 comprehension level to maximize audience reach and engagement.

## 5. Expected Deliverables & Output Format
- Complete, publication-ready Markdown copy with headline variations, subheadings, and formatted body text.`;
  } else {
    improvements.push(`Applied Master ${effectiveRole} Authority Persona`);
    improvements.push('Deeply structured objective & core requirements');
    improvements.push('Added actionable execution directives');
    improvements.push('Defined comprehensive deliverable standards');

    enhanced = `## 1. Role & Persona
You are an Elite Industry Specialist and Strategic Advisor in ${effectiveRole}.

## 2. Objective & Comprehensive Scope
Deliver a thorough, master-level solution for: "${scopePrompt}".
Provide unambiguous, deeply actionable guidance that solves the core challenge with exceptional quality.

## 3. Detailed Requirements & Actionable Methodology
- Systematic Breakdown: Deconstruct "${scopePrompt}" into actionable phases and tactical components.
- Domain Best Practices: Apply leading industry standards, verified analytical frameworks, and practical techniques.
- Concrete Guidance: Avoid superficial summaries; provide specific examples, workflows, and implementation details.

## 4. Quality Control & Risk Mitigation
- Identify common pitfalls, edge cases, and failure points associated with this domain.
- Provide defensive strategies, verification checklists, and quality assurance checkpoints.

## 5. Expected Deliverables & Output Format
- A thoroughly structured, production-ready Markdown document containing complete implementation steps, guidelines, and reference specifications.`;
  }

  const detectedLang = detectBasicLanguage(rawPrompt);
  if (detectedLang !== 'English' && outputLang !== 'Same as input') {
    improvements.unshift(`Auto-detected ${detectedLang} input & standardized to English`);
  }

  const scoreReport = calculatePromptQualityReport(rawPrompt, enhanced);

  return {
    enhancedPrompt: enhanced,
    improvements: improvements.length > 0 ? improvements : [`Applied ${effectiveRole} Persona`, 'Detailed essential directives', 'Defined output guidelines'],
    detectedLanguage: detectedLang,
    scoreReport,
  };
}

export function calculatePromptQualityReport(rawPrompt: string, enhancedPrompt: string): PromptQualityReport {
  const words = rawPrompt.trim().split(/\s+/).filter(Boolean);
  const wordCount = words.length;
  const rawLower = rawPrompt.toLowerCase();

  // Evaluate raw prompt attributes (0-100 scale, typical raw prompt scores 30-55)
  const hasClarity = wordCount >= 5 ? Math.min(30 + wordCount * 2, 58) : 30;
  const hasContext = (rawLower.includes('for') || rawLower.includes('with') || rawLower.includes('using') || wordCount > 10) ? Math.min(35 + wordCount * 1.5, 58) : 32;
  const hasSpecificity = (rawLower.includes('script') || rawLower.includes('page') || rawLower.includes('function') || rawLower.includes('app') || rawLower.includes('design') || wordCount > 12) ? Math.min(35 + wordCount * 1.8, 60) : 28;
  const hasRequirements = (rawLower.includes('should') || rawLower.includes('must') || rawLower.includes('need') || rawLower.includes('feature') || wordCount > 8) ? Math.min(32 + wordCount * 1.4, 55) : 26;
  const hasConstraints = (rawLower.includes('no') || rawLower.includes('without') || rawLower.includes('limit') || rawLower.includes('only') || rawLower.includes('strict')) ? 42 : 24;
  const hasExpectedOutput = (rawLower.includes('output') || rawLower.includes('format') || rawLower.includes('json') || rawLower.includes('csv') || rawLower.includes('table') || rawLower.includes('code')) ? 45 : 25;

  const beforeMetrics: ScoreMetrics = {
    clarity: Math.round(Math.min(Math.max(hasClarity, 25), 62)),
    context: Math.round(Math.min(Math.max(hasContext, 20), 58)),
    specificity: Math.round(Math.min(Math.max(hasSpecificity, 20), 60)),
    requirements: Math.round(Math.min(Math.max(hasRequirements, 20), 56)),
    constraints: Math.round(Math.min(Math.max(hasConstraints, 15), 52)),
    expectedOutput: Math.round(Math.min(Math.max(hasExpectedOutput, 20), 55)),
  };

  const beforeScore = Math.round(
    (beforeMetrics.clarity +
      beforeMetrics.context +
      beforeMetrics.specificity +
      beforeMetrics.requirements +
      beforeMetrics.constraints +
      beforeMetrics.expectedOutput) /
      6
  );

  // Evaluate enhanced prompt attributes (typical enhanced prompt scores 92-97)
  const enhLen = enhancedPrompt.length;
  const hasSections = (enhancedPrompt.match(/##\s+/g) || []).length;
  const hasBullets = (enhancedPrompt.match(/-\s+/g) || []).length;

  const afterMetrics: ScoreMetrics = {
    clarity: Math.min(93 + Math.min(hasSections, 3), 98),
    context: Math.min(91 + Math.min(Math.floor(enhLen / 250), 4), 96),
    specificity: Math.min(92 + Math.min(hasBullets, 4), 97),
    requirements: Math.min(94 + Math.min(hasSections, 3), 98),
    constraints: Math.min(91 + (enhancedPrompt.toLowerCase().includes('constraint') || enhancedPrompt.toLowerCase().includes('validation') || enhancedPrompt.toLowerCase().includes('security') ? 4 : 2), 96),
    expectedOutput: Math.min(93 + (enhancedPrompt.toLowerCase().includes('deliverable') || enhancedPrompt.toLowerCase().includes('output') || enhancedPrompt.toLowerCase().includes('format') ? 4 : 2), 97),
  };

  const afterScore = Math.round(
    (afterMetrics.clarity +
      afterMetrics.context +
      afterMetrics.specificity +
      afterMetrics.requirements +
      afterMetrics.constraints +
      afterMetrics.expectedOutput) /
      6
  );

  return {
    beforeScore,
    afterScore,
    beforeMetrics,
    afterMetrics,
  };
}

export function detectBasicLanguage(prompt: string): string {
  const text = prompt.trim();
  
  // Devanagari script (Hindi, Marathi, etc.)
  if (/[\u0900-\u097F]/.test(text)) return 'Hindi';
  
  // Gujarati script
  if (/[\u0A80-\u0AFF]/.test(text)) return 'Gujarati';

  // Arabic script
  if (/[\u0600-\u06FF]/.test(text)) return 'Arabic';

  // Chinese / Japanese / Korean scripts
  if (/[\u4E00-\u9FFF]/.test(text)) return 'Chinese';
  if (/[\u3040-\u30FF]/.test(text)) return 'Japanese';
  if (/[\uAC00-\uD7AF]/.test(text)) return 'Korean';

  // Cyrillic (Russian, etc.)
  if (/[\u0400-\u04FF]/.test(text)) return 'Russian';

  // Spanish keywords or accents
  if (/\b(crear|hacer|como|aplicacion|pagina|sistema|necesito|para|con)\b/i.test(text) || /[áéíóúñ¿¡]/i.test(text)) {
    return 'Spanish';
  }

  // French keywords or accents
  if (/\b(creer|faire|comment|application|page|systeme|besoin|pour|avec)\b/i.test(text) || /[éèêëàâùûç]/i.test(text)) {
    return 'French';
  }

  // German keywords or accents
  if (/\b(erstellen|machen|wie|anwendung|seite|system|brauche|fuer|mit)\b/i.test(text) || /[äöüß]/i.test(text)) {
    return 'German';
  }

  // Hinglish / Romani Hindi common patterns
  if (/\b(mujhe|ek|banani|hai|karo|banao|chahiye|kaise|kya)\b/i.test(text)) {
    return 'Hindi (Roman)';
  }

  return 'English';
}

export function cleanPromptOutput(promptText: string): string {
  if (!promptText) return '';
  // Remove emojis and pictorial symbols
  const sanitized = promptText
    .replace(/[\u{1F300}-\u{1F9FF}\u{1F600}-\u{1F64F}\u{2700}-\u{27BF}\u{1F680}-\u{1F6FF}\u{24C2}-\u{1F251}\u{1F900}-\u{1F9FF}\u{1F004}\u{1F0CF}\u{1F170}-\u{1F19A}]/gu, '')
    .trim();

  return sanitized;
}

export function getEnglishCleanScope(rawPrompt: string, outputLang: OutputLanguageOption): string {
  if (outputLang === 'Same as input') return rawPrompt;

  const detected = detectBasicLanguage(rawPrompt);
  if (detected === 'English') {
    return rawPrompt.replace(/^(make me|create|build|write|i want to|can you)\s+/i, '');
  }

  let text = rawPrompt;
  text = text.replace(/(એપ્લિકેશન|એપ|આવેદન|આપ)/gi, 'application');
  text = text.replace(/(વેબસાઇટ|સાઇટ|વેબ)/gi, 'website');
  text = text.replace(/(બનાવવી|બનાવો|બનાવવું|બનાવી|બનાવવી)/gi, 'build');
  text = text.replace(/(શોપિંગ|ખરીદી)/gi, 'shopping');
  text = text.replace(/(ઈ-કોમર્સ|ઇ-કોમર્સ)/gi, 'e-commerce');
  text = text.replace(/(સિસ્ટમ|તંત્ર)/gi, 'system');
  text = text.replace(/(કોડ|પ્રોગ્રામ)/gi, 'code');
  text = text.replace(/(સુધારો|ફિક્સ)/gi, 'fix and debug');
  text = text.replace(/(મને|એક|છે|માટે|સાથે|કરવું)/gi, ' ');

  // Strip non-ASCII script characters (Gujarati, Devanagari, etc.)
  const cleanEnglish = text
    .replace(/[\u0A80-\u0AFF\u0900-\u097F\u4E00-\u9FFF\u3040-\u30FF\uAC00-\uD7AF\u0400-\u04FF]/g, ' ')
    .trim()
    .replace(/\s+/g, ' ');

  if (!cleanEnglish || cleanEnglish.length < 3) {
    return 'custom software solution based on user requirements';
  }

  return cleanEnglish;
}

function parseJsonSafely(text: string): any {
  if (!text) return null;
  const cleaned = text
    .replace(/```json\s*/gi, '')
    .replace(/```\s*/g, '')
    .trim();

  try {
    return JSON.parse(cleaned);
  } catch (e) {
    try {
      // Escape unescaped control characters inside JSON string values
      const sanitized = cleaned.replace(/[\u0000-\u001F]/g, (char) => {
        if (char === '\n') return '\\n';
        if (char === '\r') return '\\r';
        if (char === '\t') return '\\t';
        return '';
      });
      return JSON.parse(sanitized);
    } catch {
      return null;
    }
  }
}

