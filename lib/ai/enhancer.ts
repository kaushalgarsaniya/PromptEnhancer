import { GoogleGenerativeAI } from '@google/generative-ai';
import { EnhancePromptRequest, EnhancePromptResponse, OutputLanguageOption } from '@/types';

export async function enhancePrompt(req: EnhancePromptRequest): Promise<EnhancePromptResponse> {
  const rawPrompt = req.prompt.trim();
  const outputLang: OutputLanguageOption = req.outputLanguage || 'English';
  const role: string = req.promptRole ? req.promptRole.trim() : 'Auto Detect';

  const apiKey = process.env.GEMINI_API_KEY;

  if (apiKey && apiKey.trim() !== '' && apiKey !== 'your-gemini-api-key') {
    try {
      const genAI = new GoogleGenerativeAI(apiKey.trim());

      const modelNames = ['gemini-2.5-flash', 'gemini-2.0-flash', 'gemini-1.5-flash-latest', 'gemini-1.5-flash', 'gemini-1.5-pro'];
      let model;

      for (const mName of modelNames) {
        try {
          model = genAI.getGenerativeModel({ model: mName });
          if (model) break;
        } catch {
          // try next model name
        }
      }

      if (!model) {
        model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash-latest' });
      }

      const isAutoDetect = role === 'Auto Detect' || role === '';
      const roleDirective = !isAutoDetect
        ? `Target Persona: "${role}". You MUST engineer the prompt specifically for an expert in "${role}".`
        : `Target Persona: Auto-detect the best domain expert role (Software Architect, Visual Artist, Copywriter, Tutor, Data Scientist, etc.).`;

      const systemInstruction = `You are a Principal AI Prompt Engineer & Master AI Systems Architect.
Your mission is to transform basic user ideas (written in ANY language such as Gujarati, Hindi, Spanish, French, German, Japanese, Chinese, Arabic, etc.) into COMPREHENSIVE, HIGH-PERFORMANCE PRO-LEVEL PROMPTS that produce exceptional, error-free results across any AI system (ChatGPT, Claude, Gemini, DeepSeek, Midjourney).

STRICT MULTI-LANGUAGE TRANSLATION DIRECTIVE:
- User Input Language: Can be ANY language (e.g. Gujarati, Hindi, Spanish, French, German, Japanese, Chinese, Arabic, etc.).
- Target Output Language: ${outputLang === 'Same as input' ? 'SAME PRIMARY LANGUAGE AS INPUT' : '100% ENGLISH ONLY'}.
- MANDATORY RULE: ${outputLang === 'Same as input' ? 'Output in same input language.' : 'You MUST translate the user intent from Gujarati (or any input language) into ENGLISH. The entire "enhancedPrompt" string MUST be written 100% in crisp, professional, high-grade ENGLISH. Under NO circumstances should any section header, objective, rule, or constraint in "enhancedPrompt" contain Gujarati or non-English script.'}

CRITICAL FORMATTING RULE (NO EMOJIS / NO ICONS):
- Do NOT use any emojis, icons, or pictorial symbols (e.g. no 🎯, 📍, ⚡, 📄, 💻, 🌐, etc.) anywhere inside the enhanced prompt text.
- Present the prompt using clean, professional, high-impact section headings in brackets (e.g. [ROLE & PERSONA], [OBJECTIVE & SCOPE], [CORE RULES & TECHNICAL CONSTRAINTS], [EXPECTED OUTPUT FORMAT]).
- Use clean dashes (-) for bullet lists. Ensure layout is elegant, scannable, and impressive to read.

PRO PROMPT ENGINEERING ARCHITECTURE:
Generate a thorough, structured, highly effective prompt following this exact architecture:

[ROLE & PERSONA]
[Specific Elite Persona & Expertise Domain]

[OBJECTIVE & SCOPE]
[Detailed, unambiguous goal statement in ENGLISH preserving full user intent]

[CORE RULES & TECHNICAL CONSTRAINTS]
- Detailed quality standards, technical specifications, and domain best practices
- Strict error-prevention, edge-case handling, and architectural guidelines
- Performance, design aesthetic, accessibility, and zero-assumption directives

[EXPECTED OUTPUT FORMAT]
[Exact expected structure: production-ready code, step-by-step documentation, or high-res rendering parameters]

ESSENTIAL DETAILED CONTENT RULE:
- The enhanced prompt CAN BE AS DETAILED AND COMPREHENSIVE AS REQUIRED for the task.
- Every single sentence, bullet point, and directive MUST contain ESSENTIAL, ACTIONABLE VALUE.
- Eliminate generic fluff, meaningless filler, or repetitive text. Focus on MAXIMAL TECHNICAL CLARITY AND COMPLETENESS.
- ${roleDirective}

Return ONLY a valid JSON object matching this schema EXACTLY:
{
  "detectedLanguage": "Primary language of input prompt (e.g. Gujarati, Hindi, Spanish, French, German, Japanese, etc.)",
  "enhancedPrompt": "The comprehensive, essential, pro-level enhanced prompt string WRITTEN 100% IN ENGLISH",
  "improvements": [
    "Short 3-5 word improvement 1",
    "Short 3-5 word improvement 2",
    "Short 3-5 word improvement 3",
    "Short 3-5 word improvement 4"
  ]
}`;

      const promptPayload = `USER INPUT PROMPT: "${rawPrompt}"
TARGET ROLE: "${role}"
REQUIRED OUTPUT LANGUAGE: ${outputLang === 'Same as input' ? 'Same as input' : 'ENGLISH ONLY'}

MANDATE: Understand intent from "${rawPrompt}" (which may be in Gujarati or other language). Output the enhanced prompt completely in ENGLISH.`;
      const result = await model.generateContent(`${systemInstruction}\n\n${promptPayload}`);
      const text = result.response.text();
      
      const cleanJson = text
        .replace(/```json\s*/gi, '')
        .replace(/```\s*/g, '')
        .trim();

      const parsed = JSON.parse(cleanJson);

      if (parsed.enhancedPrompt && Array.isArray(parsed.improvements)) {
        const detectedLang = parsed.detectedLanguage || detectBasicLanguage(rawPrompt);
        const improvementsList = [...parsed.improvements.slice(0, 5)];
        if (detectedLang && detectedLang !== 'English' && outputLang !== 'Same as input') {
          improvementsList.unshift(`Translated & enhanced from ${detectedLang} to English`);
        }
        return {
          enhancedPrompt: cleanPromptOutput(parsed.enhancedPrompt),
          improvements: improvementsList.slice(0, 5),
          detectedLanguage: detectedLang,
        };
      }
    } catch (err) {
      console.warn('Gemini API execution failed, switching to local enhancement fallback:', err);
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
    } else {
      effectiveRole = 'AI Assistant';
    }
  }

  let enhanced = '';

  if (effectiveRole === 'Software Developer') {
    improvements.push('Applied Senior Software Architect persona');
    improvements.push('Enforced production code & type safety');
    improvements.push('Defined modular architecture standards');
    improvements.push('Added edge-case validation & unit testability');

    enhanced = `[ROLE & PERSONA]\nPrincipal Software Architect & Senior Engineer\n\n[OBJECTIVE & SCOPE]\nDesign and build a production-grade software solution for: "${scopePrompt}".\n\n[CORE RULES & TECHNICAL CONSTRAINTS]\n- Architecture: Write clean, modular, maintainable code following SOLID design principles.\n- Type Safety & Reliability: Implement strict type definitions, robust error boundaries, and input validation.\n- Quality Standards: Include self-documenting syntax, inline comments for non-obvious logic, and unit testability.\n- Execution: Output fully runnable production code without placeholders, broken imports, or missing implementations.\n\n[EXPECTED OUTPUT FORMAT]\nExecutable code blocks structured logically by file/module with technical setup instructions.`;
  } else if (effectiveRole === 'Web Development') {
    improvements.push('Applied Lead Web Developer persona');
    improvements.push('Enforced responsive UI/UX design rules');
    improvements.push('Specified frontend architecture standards');
    improvements.push('Added accessibility & micro-interaction guidelines');

    enhanced = `[ROLE & PERSONA]\nLead Frontend Systems Architect & UI/UX Specialist\n\n[OBJECTIVE & SCOPE]\nDesign and engineer a responsive, modern web application interface for: "${scopePrompt}".\n\n[CORE RULES & TECHNICAL CONSTRAINTS]\n- Design System: Implement modern typography, curated color palettes, smooth glassmorphism, and responsive CSS flex/grid layouts.\n- User Experience: Ensure 100% fluid responsive adaptation across mobile, tablet, and desktop viewports with interactive hover micro-animations.\n- Standards: Use semantic HTML5 elements, accessible ARIA attributes, and fast loading performance.\n- Production Readiness: Provide self-contained component code with zero broken styling dependencies.\n\n[EXPECTED OUTPUT FORMAT]\nComplete component markup and style files with clear integration instructions.`;
  } else if (effectiveRole === 'AI Image Generation') {
    improvements.push('Applied AI Visual Artist persona');
    improvements.push('Enforced 8K cinematic lighting & composition');
    improvements.push('Optimized for Midjourney / DALL-E models');
    improvements.push('Added camera parameter specs');

    enhanced = `[ROLE & PERSONA]\nMaster AI Art Director & Visual Prompt Specialist\n\n[OBJECTIVE & SCOPE]\nGenerate a high-resolution visual concept for: "${scopePrompt}".\n\n[CORE RULES & TECHNICAL CONSTRAINTS]\n- Aesthetic Style: Ultra-detailed 8K photographic rendering, professional studio cinematography, and photorealistic texture detail.\n- Lighting & Color: Volumetric ambient lighting, rich high-contrast shadows, and harmonious color balance.\n- Composition & Camera: 85mm lens perspective, f/1.8 aperture with smooth bokeh, Octane render depth, and razor-sharp subject focus.\n\n[EXPECTED OUTPUT FORMAT]\nFully formatted visual text prompt optimized for Midjourney v6, DALL-E 3, or Flux.1 models.`;
  } else if (effectiveRole === 'Content Writing & Copy') {
    improvements.push('Applied Senior Content Director persona');
    improvements.push('Enforced high-converting copy structure');
    improvements.push('Defined tone & clarity constraints');
    improvements.push('Added audience engagement rules');

    enhanced = `[ROLE & PERSONA]\nSenior Content Director & Direct-Response Copywriter\n\n[OBJECTIVE & SCOPE]\nDraft high-converting, authoritative editorial copy based on: "${scopePrompt}".\n\n[CORE RULES & TECHNICAL CONSTRAINTS]\n- Attention Hook: Open with an impactful, curiosity-driven statement commanding immediate attention.\n- Content Flow: Structure scannable, value-packed paragraphs with bold subheadings and persuasive active tone.\n- Audience Value: Deliver actionable takeaways, clear benefit messaging, and eliminate fluff.\n- Conversion CTA: Conclude with a strong, unambiguous call-to-action driving target reader engagement.\n\n[EXPECTED OUTPUT FORMAT]\nFormatted Markdown copy ready for publication across digital channels.`;
  } else if (effectiveRole === 'Data Science & Analysis') {
    improvements.push('Applied Senior Data Scientist persona');
    improvements.push('Structured analytical methodology');
    improvements.push('Defined KPI & summary table format');
    improvements.push('Added quantitative correlation rules');

    enhanced = `[ROLE & PERSONA]\nLead Data Scientist & Quantitative Analyst\n\n[OBJECTIVE & SCOPE]\nConduct a comprehensive analytical evaluation and data investigation for: "${scopePrompt}".\n\n[CORE RULES & TECHNICAL CONSTRAINTS]\n- Methodology: Formulate primary statistical metrics, data collection assumptions, and analytical frameworks.\n- Insights: Identify key correlation trends, performance anomalies, and quantitative data patterns.\n- Rigor: Maintain objective, data-backed reasoning with clear risk assessment.\n\n[EXPECTED OUTPUT FORMAT]\nExecutive summary report featuring Markdown data tables, key observations, and strategic recommendations.`;
  } else if (effectiveRole === 'Education & Tutoring') {
    improvements.push('Applied Master Educational Tutor persona');
    improvements.push('Structured step-by-step breakdown');
    improvements.push('Added real-world analogies & self-tests');
    improvements.push('Defined progressive learning path');

    enhanced = `[ROLE & PERSONA]\nSenior Academic Educator & Pedagogical Expert\n\n[OBJECTIVE & SCOPE]\nTeach and explain "${scopePrompt}" clearly from foundational concepts to advanced practical mastery.\n\n[CORE RULES & TECHNICAL CONSTRAINTS]\n- Concept Hierarchy: Break down complex topics into intuitive step-by-step modules.\n- Mental Models: Anchor theoretical definitions with relatable real-world analogies.\n- Practical Application: Include concrete code/math/concept examples to demonstrate real use.\n- Mastery Verification: Provide 3 targeted self-assessment questions with answer keys to test retention.\n\n[EXPECTED OUTPUT FORMAT]\nComprehensive educational tutorial structured for rapid comprehension and long-term retention.`;
  } else if (effectiveRole === 'Business & Marketing') {
    improvements.push('Applied Business Growth Strategist persona');
    improvements.push('Enforced target persona & KPI roadmap');
    improvements.push('Structured market positioning framework');
    improvements.push('Added ROI metric tracking');

    enhanced = `[ROLE & PERSONA]\nChief Growth Strategist & Marketing Director\n\n[OBJECTIVE & SCOPE]\nFormulate an end-to-end strategic growth plan for: "${scopePrompt}".\n\n[CORE RULES & TECHNICAL CONSTRAINTS]\n- Market Strategy: Define target audience persona, unique value proposition, and competitive differentiation.\n- Channels & Tactics: Outline multi-channel customer acquisition tactics, content funnel, and execution timeline.\n- Unit Economics: Specify key metric benchmarks (CAC, LTV, ROI, conversion rates) to track execution success.\n\n[EXPECTED OUTPUT FORMAT]\nExecutive strategic roadmap featuring milestone timelines and actionable execution directives.`;
  } else {
    improvements.push(`Applied custom persona: ${effectiveRole}`);
    improvements.push('Enforced pro-level domain standards');
    improvements.push('Defined structured output format');
    improvements.push('Added complete execution rules');

    enhanced = `[ROLE & PERSONA]\nElite Expert in ${effectiveRole}\n\n[OBJECTIVE & SCOPE]\nDeliver a comprehensive, high-impact solution for: "${scopePrompt}".\n\n[CORE RULES & TECHNICAL CONSTRAINTS]\n- Industry Standards: Enforce leading professional domain practices and quality benchmarks for ${effectiveRole}.\n- Precision & Clarity: Eliminate ambiguity, provide thorough technical guidance, and address potential edge-cases.\n- Value Delivery: Focus on actionable, practical, and highly effective output.\n\n[EXPECTED OUTPUT FORMAT]\nThoroughly structured Markdown document with clear headers and executable guidelines.`;
  }

  const detectedLang = detectBasicLanguage(rawPrompt);
  if (detectedLang !== 'English' && outputLang !== 'Same as input') {
    improvements.unshift(`Auto-detected ${detectedLang} input & standardized to English`);
  }

  return {
    enhancedPrompt: enhanced,
    improvements: improvements.length > 0 ? improvements : [`Applied ${effectiveRole} Persona`, 'Detailed essential directives', 'Defined output guidelines'],
    detectedLanguage: detectedLang,
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
    // Normalize any legacy heading prefixes like "ROLE & PERSONA:" to "[ROLE & PERSONA]"
    .replace(/^(?:🎯|📍|⚡|📄)?\s*ROLE & PERSONA:/gim, '[ROLE & PERSONA]\n')
    .replace(/^(?:🎯|📍|⚡|📄)?\s*OBJECTIVE & SCOPE:/gim, '[OBJECTIVE & SCOPE]\n')
    .replace(/^(?:🎯|📍|⚡|📄)?\s*CORE RULES & TECHNICAL CONSTRAINTS:/gim, '[CORE RULES & TECHNICAL CONSTRAINTS]\n')
    .replace(/^(?:🎯|📍|⚡|📄)?\s*EXPECTED OUTPUT FORMAT:/gim, '[EXPECTED OUTPUT FORMAT]\n')
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
