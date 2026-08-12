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
Your mission is to transform basic user ideas into COMPREHENSIVE, HIGH-PERFORMANCE PRO-LEVEL PROMPTS that produce exceptional, error-free results across any AI system (ChatGPT, Claude, Gemini, DeepSeek, Midjourney).

PRO PROMPT ENGINEERING ARCHITECTURE:
Generate a thorough, structured, highly effective prompt following this exact architecture:

🎯 ROLE & PERSONA: [Specific Elite Persona & Expertise Domain]
📍 OBJECTIVE & SCOPE: [Detailed, unambiguous goal statement preserving full user intent]
⚡ CORE RULES & TECHNICAL CONSTRAINTS:
- Detailed quality standards, technical specifications, and domain best practices
- Strict error-prevention, edge-case handling, and architectural guidelines
- Performance, design aesthetic, accessibility, and zero-assumption directives
📄 EXPECTED OUTPUT FORMAT: [Exact expected structure: production-ready code, step-by-step documentation, or high-res rendering parameters]

ESSENTIAL DETAILED CONTENT RULE:
- The enhanced prompt CAN BE AS DETAILED AND COMPREHENSIVE AS REQUIRED for the task.
- Every single sentence, bullet point, and directive MUST contain ESSENTIAL, ACTIONABLE VALUE.
- Eliminate generic fluff, meaningless filler, or repetitive text. Focus on MAXIMAL TECHNICAL CLARITY AND COMPLETENESS.
- ${roleDirective}
- Language Rule: Target Output Language: ${outputLang === 'Same as input' ? 'Same primary language as input' : 'English'}.

Return ONLY a valid JSON object matching this schema EXACTLY:
{
  "enhancedPrompt": "The comprehensive, essential, pro-level enhanced prompt string",
  "improvements": [
    "Short 3-5 word improvement 1",
    "Short 3-5 word improvement 2",
    "Short 3-5 word improvement 3",
    "Short 3-5 word improvement 4"
  ]
}`;

      const promptPayload = `User Prompt: "${rawPrompt}"\nTarget Role: "${role}"`;
      const result = await model.generateContent(`${systemInstruction}\n\n${promptPayload}`);
      const text = result.response.text();
      
      const cleanJson = text
        .replace(/```json\s*/gi, '')
        .replace(/```\s*/g, '')
        .trim();

      const parsed = JSON.parse(cleanJson);

      if (parsed.enhancedPrompt && Array.isArray(parsed.improvements)) {
        return {
          enhancedPrompt: parsed.enhancedPrompt,
          improvements: parsed.improvements.slice(0, 5),
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

  let effectiveRole = role;

  if (effectiveRole === 'Auto Detect' || !effectiveRole) {
    if (text.includes('code') || text.includes('website') || text.includes('app') || text.includes('bug') || text.includes('fix') || text.includes('java') || text.includes('python') || text.includes('react')) {
      effectiveRole = text.includes('website') || text.includes('web') || text.includes('html') || text.includes('css') ? 'Web Development' : 'Software Developer';
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

    enhanced = `🎯 ROLE & PERSONA: Principal Software Architect & Senior Engineer\n\n📍 OBJECTIVE & SCOPE: Design and build a production-grade software solution for: "${rawPrompt.replace(/^(make me|create|build|write|i want to|can you)\s+/i, '')}".\n\n⚡ CORE RULES & TECHNICAL CONSTRAINTS:\n- Architecture: Write clean, modular, maintainable code following SOLID design principles.\n- Type Safety & Reliability: Implement strict type definitions, robust error boundaries, and input validation.\n- Quality Standards: Include self-documenting syntax, inline comments for non-obvious logic, and unit testability.\n- Execution: Output fully runnable production code without placeholders, broken imports, or missing implementations.\n\n📄 EXPECTED OUTPUT FORMAT: Executable code blocks structured logically by file/module with technical setup instructions.`;
  } else if (effectiveRole === 'Web Development') {
    improvements.push('Applied Lead Web Developer persona');
    improvements.push('Enforced responsive UI/UX design rules');
    improvements.push('Specified frontend architecture standards');
    improvements.push('Added accessibility & micro-interaction guidelines');

    enhanced = `🎯 ROLE & PERSONA: Lead Frontend Systems Architect & UI/UX Specialist\n\n📍 OBJECTIVE & SCOPE: Design and engineer a responsive, modern web application interface for: "${rawPrompt}".\n\n⚡ CORE RULES & TECHNICAL CONSTRAINTS:\n- Design System: Implement modern typography, curated color palettes, smooth glassmorphism, and responsive CSS flex/grid layouts.\n- User Experience: Ensure 100% fluid responsive adaptation across mobile, tablet, and desktop viewports with interactive hover micro-animations.\n- Standards: Use semantic HTML5 elements, accessible ARIA attributes, and fast loading performance.\n- Production Readiness: Provide self-contained component code with zero broken styling dependencies.\n\n📄 EXPECTED OUTPUT FORMAT: Complete component markup and style files with clear integration instructions.`;
  } else if (effectiveRole === 'AI Image Generation') {
    improvements.push('Applied AI Visual Artist persona');
    improvements.push('Enforced 8K cinematic lighting & composition');
    improvements.push('Optimized for Midjourney / DALL-E models');
    improvements.push('Added camera parameter specs');

    enhanced = `🎯 ROLE & PERSONA: Master AI Art Director & Visual Prompt Specialist\n\n📍 OBJECTIVE & SCOPE: Generate a high-resolution visual concept for: "${rawPrompt}".\n\n⚡ CORE RULES & TECHNICAL CONSTRAINTS:\n- Aesthetic Style: Ultra-detailed 8K photographic rendering, professional studio cinematography, and photorealistic texture detail.\n- Lighting & Color: Volumetric ambient lighting, rich high-contrast shadows, and harmonious color balance.\n- Composition & Camera: 85mm lens perspective, f/1.8 aperture with smooth bokeh, Octane render depth, and razor-sharp subject focus.\n\n📄 EXPECTED OUTPUT FORMAT: Fully formatted visual text prompt optimized for Midjourney v6, DALL-E 3, or Flux.1 models.`;
  } else if (effectiveRole === 'Content Writing & Copy') {
    improvements.push('Applied Senior Content Director persona');
    improvements.push('Enforced high-converting copy structure');
    improvements.push('Defined tone & clarity constraints');
    improvements.push('Added audience engagement rules');

    enhanced = `🎯 ROLE & PERSONA: Senior Content Director & Direct-Response Copywriter\n\n📍 OBJECTIVE & SCOPE: Draft high-converting, authoritative editorial copy based on: "${rawPrompt}".\n\n⚡ CORE RULES & TECHNICAL CONSTRAINTS:\n- Attention Hook: Open with an impactful, curiosity-driven statement commanding immediate attention.\n- Content Flow: Structure scannable, value-packed paragraphs with bold subheadings and persuasive active tone.\n- Audience Value: Deliver actionable takeaways, clear benefit messaging, and eliminate fluff.\n- Conversion CTA: Conclude with a strong, unambiguous call-to-action driving target reader engagement.\n\n📄 EXPECTED OUTPUT FORMAT: Formatted Markdown copy ready for publication across digital channels.`;
  } else if (effectiveRole === 'Data Science & Analysis') {
    improvements.push('Applied Senior Data Scientist persona');
    improvements.push('Structured analytical methodology');
    improvements.push('Defined KPI & summary table format');
    improvements.push('Added quantitative correlation rules');

    enhanced = `🎯 ROLE & PERSONA: Lead Data Scientist & Quantitative Analyst\n\n📍 OBJECTIVE & SCOPE: Conduct a comprehensive analytical evaluation and data investigation for: "${rawPrompt}".\n\n⚡ CORE RULES & TECHNICAL CONSTRAINTS:\n- Methodology: Formulate primary statistical metrics, data collection assumptions, and analytical frameworks.\n- Insights: Identify key correlation trends, performance anomalies, and quantitative data patterns.\n- Rigor: Maintain objective, data-backed reasoning with clear risk assessment.\n\n📄 EXPECTED OUTPUT FORMAT: Executive summary report featuring Markdown data tables, key observations, and strategic recommendations.`;
  } else if (effectiveRole === 'Education & Tutoring') {
    improvements.push('Applied Master Educational Tutor persona');
    improvements.push('Structured step-by-step breakdown');
    improvements.push('Added real-world analogies & self-tests');
    improvements.push('Defined progressive learning path');

    enhanced = `🎯 ROLE & PERSONA: Senior Academic Educator & Pedagogical Expert\n\n📍 OBJECTIVE & SCOPE: Teach and explain "${rawPrompt}" clearly from foundational concepts to advanced practical mastery.\n\n⚡ CORE RULES & TECHNICAL CONSTRAINTS:\n- Concept Hierarchy: Break down complex topics into intuitive step-by-step modules.\n- Mental Models: Anchor theoretical definitions with relatable real-world analogies.\n- Practical Application: Include concrete code/math/concept examples to demonstrate real use.\n- Mastery Verification: Provide 3 targeted self-assessment questions with answer keys to test retention.\n\n📄 EXPECTED OUTPUT FORMAT: Comprehensive educational tutorial structured for rapid comprehension and long-term retention.`;
  } else if (effectiveRole === 'Business & Marketing') {
    improvements.push('Applied Business Growth Strategist persona');
    improvements.push('Enforced target persona & KPI roadmap');
    improvements.push('Structured market positioning framework');
    improvements.push('Added ROI metric tracking');

    enhanced = `🎯 ROLE & PERSONA: Chief Growth Strategist & Marketing Director\n\n📍 OBJECTIVE & SCOPE: Formulate an end-to-end strategic growth plan for: "${rawPrompt}".\n\n⚡ CORE RULES & TECHNICAL CONSTRAINTS:\n- Market Strategy: Define target audience persona, unique value proposition, and competitive differentiation.\n- Channels & Tactics: Outline multi-channel customer acquisition tactics, content funnel, and execution timeline.\n- Unit Economics: Specify key metric benchmarks (CAC, LTV, ROI, conversion rates) to track execution success.\n\n📄 EXPECTED OUTPUT FORMAT: Executive strategic roadmap featuring milestone timelines and actionable execution directives.`;
  } else {
    improvements.push(`Applied custom persona: ${effectiveRole}`);
    improvements.push('Enforced pro-level domain standards');
    improvements.push('Defined structured output format');
    improvements.push('Added complete execution rules');

    enhanced = `🎯 ROLE & PERSONA: Elite Expert in ${effectiveRole}\n\n📍 OBJECTIVE & SCOPE: Deliver a comprehensive, high-impact solution for: "${rawPrompt}".\n\n⚡ CORE RULES & TECHNICAL CONSTRAINTS:\n- Industry Standards: Enforce leading professional domain practices and quality benchmarks for ${effectiveRole}.\n- Precision & Clarity: Eliminate ambiguity, provide thorough technical guidance, and address potential edge-cases.\n- Value Delivery: Focus on actionable, practical, and highly effective output.\n\n📄 EXPECTED OUTPUT FORMAT: Thoroughly structured Markdown document with clear headers and executable guidelines.`;
  }

  return {
    enhancedPrompt: enhanced,
    improvements: improvements.length > 0 ? improvements : [`Applied ${effectiveRole} Persona`, 'Detailed essential directives', 'Defined output guidelines'],
  };
}
