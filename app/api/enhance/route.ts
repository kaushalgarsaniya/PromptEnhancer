import { NextResponse } from 'next/server';
import { enhancePrompt } from '@/lib/ai/enhancer';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { prompt, outputLanguage, promptRole } = body;

    if (!prompt || typeof prompt !== 'string' || !prompt.trim()) {
      return NextResponse.json(
        { error: 'Prompt text is required' },
        { status: 400 }
      );
    }

    if (prompt.length > 5000) {
      return NextResponse.json(
        { error: 'Prompt exceeds maximum length of 5,000 characters' },
        { status: 400 }
      );
    }

    const result = await enhancePrompt({ prompt, outputLanguage, promptRole });

    return NextResponse.json(result);
  } catch (error) {
    console.error('Enhance API error:', error);
    return NextResponse.json(
      { error: 'Failed to enhance prompt. Please try again.' },
      { status: 500 }
    );
  }
}
