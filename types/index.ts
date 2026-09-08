export type OutputLanguageOption = 'English' | 'Same as input';

export type PresetPromptRole =
  | 'Auto Detect'
  | 'Software Developer'
  | 'Web Development'
  | 'AI Image Generation'
  | 'Content Writing & Copy'
  | 'Data Science & Analysis'
  | 'Education & Tutoring'
  | 'Business & Marketing';

export type PromptRole = PresetPromptRole | string;

export interface EnhancePromptRequest {
  prompt: string;
  outputLanguage?: OutputLanguageOption;
  promptRole?: string;
}

export interface ScoreMetrics {
  clarity: number;
  context: number;
  specificity: number;
  requirements: number;
  constraints: number;
  expectedOutput: number;
}

export interface PromptQualityReport {
  beforeScore: number;
  afterScore: number;
  beforeMetrics: ScoreMetrics;
  afterMetrics: ScoreMetrics;
}

export interface EnhancePromptResponse {
  enhancedPrompt: string;
  improvements: string[];
  detectedLanguage?: string;
  scoreReport?: PromptQualityReport;
}

export interface PromptExample {
  before: string;
  after: string;
  tag: string;
}
