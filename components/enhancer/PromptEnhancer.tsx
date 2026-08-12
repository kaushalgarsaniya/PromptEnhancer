'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/Button';
import { OutputLanguageOption, PresetPromptRole, EnhancePromptResponse } from '@/types';
import { Sparkles, Copy, Check, RefreshCw, Trash2, Edit3, CheckCircle2, AlertCircle, Briefcase, ChevronDown, UserCheck, PenTool } from 'lucide-react';

const LOADING_MESSAGES = [
  'Understanding your idea...',
  'Applying selected role persona...',
  'Improving clarity & structure...',
  'Preparing your enhanced prompt...',
];

const PRESET_ROLES: { value: PresetPromptRole; label: string; icon: string }[] = [
  { value: 'Auto Detect', label: 'Auto Detect', icon: '⚡' },
  { value: 'Software Developer', label: 'Software Developer', icon: '💻' },
  { value: 'Web Development', label: 'Web Development', icon: '🌐' },
  { value: 'AI Image Generation', label: 'AI Image Generation', icon: '🎨' },
  { value: 'Content Writing & Copy', label: 'Content Writing & Copy', icon: '✍️' },
  { value: 'Data Science & Analysis', label: 'Data Science', icon: '📊' },
  { value: 'Education & Tutoring', label: 'Educational Tutor', icon: '🎓' },
  { value: 'Business & Marketing', label: 'Business & Marketing', icon: '📈' },
];

export const PromptEnhancer: React.FC = () => {
  const [prompt, setPrompt] = useState('');
  const [outputLanguage, setOutputLanguage] = useState<OutputLanguageOption>('English');
  
  // Role State: Preset role selection vs Custom user role text
  const [selectedRoleType, setSelectedRoleType] = useState<PresetPromptRole | 'Custom'>('Auto Detect');
  const [customRoleText, setCustomRoleText] = useState('');

  const [isLoading, setIsLoading] = useState(false);
  const [loadingMsgIdx, setLoadingMsgIdx] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const [result, setResult] = useState<EnhancePromptResponse | null>(null);
  const [originalPromptText, setOriginalPromptText] = useState('');
  
  const [copied, setCopied] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedPromptText, setEditedPromptText] = useState('');

  // Determine actual role string sent to backend API
  const activeRoleString = selectedRoleType === 'Custom' 
    ? (customRoleText.trim() || 'AI Expert') 
    : selectedRoleType;

  // Cycle loading messages during API processing
  useEffect(() => {
    let interval: any;
    if (isLoading) {
      setLoadingMsgIdx(0);
      interval = setInterval(() => {
        setLoadingMsgIdx((prev) => (prev + 1) % LOADING_MESSAGES.length);
      }, 700);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isLoading]);

  const handleEnhance = async (textToEnhance?: string) => {
    const target = (textToEnhance !== undefined ? textToEnhance : prompt).trim();
    if (!target) {
      setError('Please write a prompt or idea to enhance.');
      return;
    }

    setError(null);
    setIsLoading(true);
    setOriginalPromptText(target);
    setIsEditing(false);

    try {
      const res = await fetch('/api/enhance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          prompt: target, 
          outputLanguage, 
          promptRole: activeRoleString 
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to enhance prompt.');
      }

      setResult(data);
      setEditedPromptText(data.enhancedPrompt);
    } catch (err: any) {
      setError(err.message || 'Something went wrong while enhancing. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = () => {
    const textToCopy = isEditing ? editedPromptText : result?.enhancedPrompt;
    if (textToCopy) {
      navigator.clipboard.writeText(textToCopy);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleClear = () => {
    setPrompt('');
    setResult(null);
    setError(null);
    setIsEditing(false);
  };

  return (
    <section id="editor" className="py-12 sm:py-16 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-7">
      {/* MAIN PROMPT EDITOR CARD */}
      <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 p-6 sm:p-7 space-y-5 shadow-xl dark:shadow-2xl transition-colors">
        
        {/* CARD HEADER */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-zinc-200 dark:border-zinc-800 pb-3.5">
          <div className="space-y-0.5">
            <h2 className="text-lg font-bold text-zinc-900 dark:text-white flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-zinc-900 dark:text-white" /> AI Prompt Enhancer
            </h2>
            <p className="text-xs text-zinc-600 dark:text-zinc-400">
              Select or type a role persona, write your prompt idea, and let AI transform it into structured instructions.
            </p>
          </div>

          <div className="flex items-center gap-2">
            {prompt && (
              <button
                onClick={handleClear}
                className="text-xs text-zinc-500 hover:text-rose-600 dark:text-zinc-400 dark:hover:text-rose-400 flex items-center gap-1 transition-colors px-2 py-1"
              >
                <Trash2 className="w-3.5 h-3.5" /> Clear All
              </button>
            )}
          </div>
        </div>

        {/* STEP 1: ROLE SELECTION SECTION */}
        <div className="space-y-2">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-1 sm:gap-2">
            <label className="text-xs font-bold text-zinc-900 dark:text-white uppercase tracking-wider flex items-center gap-1.5">
              <UserCheck className="w-4 h-4 text-zinc-900 dark:text-white" />
              1. Select or Write Prompt Role Persona
            </label>
            <span className="text-[11px] text-zinc-500 font-mono">
              Active Role: <strong className="text-zinc-900 dark:text-white">{activeRoleString}</strong>
            </span>
          </div>

          {/* ROLE PILLS & CUSTOM ROLE CONTAINER BOX */}
          <div className="space-y-2.5 bg-zinc-50 dark:bg-black/60 rounded-xl p-3.5 sm:p-4 border border-zinc-200 dark:border-zinc-800/80">
            {/* SUGGESTED ROLE BADGES / PILLS */}
            <div className="flex flex-wrap gap-2">
              {PRESET_ROLES.map((r) => {
                const isSelected = selectedRoleType === r.value;
                return (
                  <button
                    key={r.value}
                    type="button"
                    onClick={() => setSelectedRoleType(r.value)}
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                      isSelected
                        ? 'bg-black text-white dark:bg-white dark:text-black font-bold shadow-md scale-[1.01]'
                        : 'bg-white dark:bg-zinc-900 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-800 border border-zinc-200 dark:border-zinc-800'
                    }`}
                  >
                    <span>{r.icon}</span>
                    <span>{r.label}</span>
                  </button>
                );
              })}

              {/* CUSTOM ROLE OPTION PILL */}
              <button
                type="button"
                onClick={() => setSelectedRoleType('Custom')}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  selectedRoleType === 'Custom'
                    ? 'bg-black text-white dark:bg-white dark:text-black font-bold shadow-md scale-[1.01]'
                    : 'bg-white dark:bg-zinc-900 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-800 border border-zinc-200 dark:border-zinc-800'
                }`}
              >
                <PenTool className="w-3.5 h-3.5" />
                <span>Write Personal Role...</span>
              </button>
            </div>

            {/* CUSTOM ROLE INPUT FIELD */}
            {selectedRoleType === 'Custom' && (
              <div className="pt-1.5">
                <div className="relative">
                  <input
                    type="text"
                    value={customRoleText}
                    onChange={(e) => setCustomRoleText(e.target.value)}
                    placeholder="Type custom role (e.g. Senior DevOps Architect, UI Designer, Legal Advisor)..."
                    className="w-full bg-white dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 rounded-lg pl-8 pr-3 py-2 text-xs text-zinc-900 dark:text-white placeholder:text-zinc-400 dark:placeholder:text-zinc-600 focus:outline-none focus:border-zinc-500 font-sans"
                  />
                  <PenTool className="w-3.5 h-3.5 text-zinc-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* STEP 2: BALANCED TEXTAREA */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-zinc-900 dark:text-white uppercase tracking-wider flex items-center gap-1.5">
            <Briefcase className="w-4 h-4 text-zinc-900 dark:text-white" />
            2. Write Prompt or Idea
          </label>
          <textarea
            value={prompt}
            onChange={(e) => {
              setPrompt(e.target.value);
              if (error) setError(null);
            }}
            onKeyDown={(e) => {
              if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
                e.preventDefault();
                handleEnhance();
              }
            }}
            placeholder={`Write your prompt or idea here...`}
            className="w-full h-36 sm:h-40 bg-zinc-50 dark:bg-black border border-zinc-200 dark:border-zinc-800 rounded-xl p-4 text-xs sm:text-sm text-zinc-900 dark:text-white placeholder:text-zinc-400 dark:placeholder:text-zinc-600 focus:outline-none focus:border-zinc-400 dark:focus:border-zinc-500 font-sans leading-relaxed resize-none transition-colors"
          />

          <div className="flex items-center justify-between text-[11px] text-zinc-500 font-mono px-0.5">
            <span>Press Ctrl + Enter to enhance</span>
            <span>{prompt.length} characters</span>
          </div>
        </div>

        {/* ERROR STATE ALERT */}
        {error && (
          <div className="p-3.5 rounded-lg bg-rose-50 dark:bg-zinc-950 border border-rose-200 dark:border-rose-900/60 text-rose-700 dark:text-rose-300 text-xs flex items-center gap-2.5">
            <AlertCircle className="w-4 h-4 text-rose-600 dark:text-rose-400 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* BOTTOM CONTROLS & ACTION */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-1">
          <div className="flex items-center gap-2">
            {/* OUTPUT LANGUAGE DROPDOWN */}
            <span className="text-xs font-semibold text-zinc-600 dark:text-zinc-400 uppercase tracking-wider">Output Language:</span>
            <div className="relative inline-block">
              <select
                value={outputLanguage}
                onChange={(e) => setOutputLanguage(e.target.value as OutputLanguageOption)}
                className="appearance-none bg-zinc-100 dark:bg-black border border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-white text-xs font-medium rounded-lg pl-3 pr-8 py-2 focus:outline-none focus:border-zinc-400 dark:focus:border-zinc-500 cursor-pointer transition-colors"
              >
                <option value="English">English</option>
                <option value="Same as input">Same as input</option>
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-zinc-500 dark:text-zinc-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>

          <Button
            size="lg"
            onClick={() => handleEnhance()}
            disabled={isLoading || !prompt.trim()}
            className="px-7 py-2.5 text-xs font-bold shadow-md"
          >
            {isLoading ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin text-white dark:text-black" />
                <span>Enhancing...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 text-white dark:text-black" />
                <span>Enhance Prompt</span>
              </>
            )}
          </Button>
        </div>
      </div>

      {/* LOADING STATE CARD */}
      {isLoading && (
        <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 p-8 text-center space-y-3 shadow-lg transition-colors">
          <div className="w-10 h-10 rounded-full bg-black text-white dark:bg-white dark:text-black flex items-center justify-center mx-auto shadow-md animate-pulse">
            <Sparkles className="w-5 h-5 text-white dark:text-black" />
          </div>
          <div className="space-y-1">
            <p className="text-xs sm:text-sm font-bold text-zinc-900 dark:text-white">
              {LOADING_MESSAGES[loadingMsgIdx]}
            </p>
            <p className="text-xs text-zinc-500 font-medium">Building structured instructions for role: {activeRoleString}</p>
          </div>
        </div>
      )}

      {/* RESULT SECTION (ORIGINAL VS ENHANCED COMPARISON + EXPLANATION + ACTIONS) */}
      {result && !isLoading && (
        <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 p-6 sm:p-7 space-y-5 shadow-lg dark:shadow-2xl transition-colors">
          <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-zinc-200 dark:border-zinc-800">
            <h3 className="text-xs sm:text-sm font-bold text-zinc-900 dark:text-white flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-zinc-900 dark:text-white" /> Enhanced Prompt Result
            </h3>
            <div className="flex items-center gap-2">
              <Button size="sm" variant="ghost" onClick={() => setIsEditing(!isEditing)}>
                <Edit3 className="w-3.5 h-3.5" />
                <span>{isEditing ? 'Cancel Edit' : 'Edit'}</span>
              </Button>
              <Button size="sm" variant="outline" onClick={() => handleEnhance(originalPromptText)}>
                <RefreshCw className="w-3.5 h-3.5 text-zinc-700 dark:text-white" />
                <span>Regenerate</span>
              </Button>
              <Button size="sm" onClick={handleCopy}>
                {copied ? <Check className="w-3.5 h-3.5 text-white dark:text-black" /> : <Copy className="w-3.5 h-3.5 text-white dark:text-black" />}
                <span>{copied ? 'Copied!' : 'Copy Prompt'}</span>
              </Button>
            </div>
          </div>

          {/* FULL WIDTH ENHANCED PROMPT RESULT */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-zinc-900 dark:text-white uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-zinc-900 dark:text-white" /> Enhanced Prompt ({activeRoleString})
              </span>
              {isEditing && <span className="text-xs text-zinc-500 font-mono">Editing Mode</span>}
            </div>

            {isEditing ? (
              <textarea
                value={editedPromptText}
                onChange={(e) => setEditedPromptText(e.target.value)}
                className="w-full min-h-[150px] max-h-72 p-4 rounded-xl bg-zinc-50 dark:bg-black border border-zinc-300 dark:border-zinc-700 text-xs sm:text-sm text-zinc-900 dark:text-white leading-relaxed font-mono focus:outline-none focus:border-zinc-500 resize-y shadow-inner"
              />
            ) : (
              <div className="rounded-xl border border-zinc-800 dark:border-zinc-800 bg-zinc-900 dark:bg-zinc-950 overflow-hidden shadow-sm">
                <div className="p-4 sm:p-5 text-xs sm:text-sm text-white dark:text-zinc-100 leading-relaxed font-mono whitespace-pre-wrap min-h-[150px] sm:min-h-[170px] max-h-72 overflow-y-auto">
                  {editedPromptText}
                </div>
              </div>
            )}



          </div>


          {/* IMPROVEMENT HIGHLIGHTS */}
          {result.improvements && result.improvements.length > 0 && (
            <div className="pt-3 border-t border-zinc-200 dark:border-zinc-800 space-y-2">
              <span className="text-[11px] font-semibold text-zinc-700 dark:text-zinc-300 uppercase tracking-wider block">
                Key Improvements Applied
              </span>
              <div className="flex flex-wrap gap-2">
                {result.improvements.map((imp, idx) => (
                  <span
                    key={idx}
                    className="inline-flex items-center gap-1 px-3 py-1 rounded-md bg-zinc-100 dark:bg-black border border-zinc-200 dark:border-zinc-800 text-xs font-medium text-zinc-800 dark:text-zinc-300"
                  >
                    <Check className="w-3 h-3 text-zinc-900 dark:text-white" />
                    {imp}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </section>
  );
};
