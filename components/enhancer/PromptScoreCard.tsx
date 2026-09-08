import React, { useState } from 'react';
import { PromptQualityReport } from '@/types';
import { ChevronDown, ChevronUp, Target, BarChart2 } from 'lucide-react';

interface PromptScoreCardProps {
  scoreReport: PromptQualityReport;
}

const CRITERIA_DEFINITIONS: { key: keyof PromptQualityReport['beforeMetrics']; label: string; desc: string }[] = [
  { key: 'clarity', label: 'Clarity', desc: 'Clear, unambiguous, and readable intent' },
  { key: 'context', label: 'Context', desc: 'Background context, persona & target domain' },
  { key: 'specificity', label: 'Specificity', desc: 'Precise technical terms and concrete parameters' },
  { key: 'requirements', label: 'Requirements', desc: 'Exhaustive feature & functional specifications' },
  { key: 'constraints', label: 'Constraints', desc: 'Error handling, security & boundary rules' },
  { key: 'expectedOutput', label: 'Expected Output', desc: 'Exact deliverable structure and format rules' },
];

export const PromptScoreCard: React.FC<PromptScoreCardProps> = ({ scoreReport }) => {
  const [showBreakdown, setShowBreakdown] = useState(true);

  const { beforeScore, afterScore, beforeMetrics, afterMetrics } = scoreReport;
  const scoreDiff = afterScore - beforeScore;

  return (
    <div className="bg-zinc-50 dark:bg-black/60 rounded-xl border border-zinc-200 dark:border-zinc-800 p-4 sm:p-5 space-y-4 shadow-sm transition-colors">
      {/* HEADER WITH BEFORE & AFTER SCORES */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-zinc-200 dark:border-zinc-800 pb-3.5">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-black text-white dark:bg-white dark:text-black flex items-center justify-center font-bold text-xs shadow-sm">
            <Target className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-xs sm:text-sm font-bold text-zinc-900 dark:text-white flex items-center gap-1.5">
              Prompt Quality Score
            </h4>
            <p className="text-[11px] text-zinc-500">6-dimensional AI prompt engineering benchmark</p>
          </div>
        </div>

        {/* SUMMARY SCORE PILLS */}
        <div className="flex items-center gap-2 w-full sm:w-auto justify-between sm:justify-end">
          {/* Before Score */}
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg px-3 py-1.5 flex flex-col items-center">
            <span className="text-[10px] text-zinc-500 font-medium uppercase tracking-wider">Before</span>
            <span className="text-xs sm:text-sm font-extrabold text-zinc-600 dark:text-zinc-400 font-mono">
              {beforeScore}<span className="text-[10px] font-normal text-zinc-400">/100</span>
            </span>
          </div>

          <span className="text-xs font-bold text-zinc-400">➔</span>

          {/* After Score */}
          <div className="bg-black text-white dark:bg-white dark:text-black rounded-lg px-3.5 py-1.5 flex flex-col items-center shadow-sm">
            <span className="text-[10px] text-zinc-300 dark:text-zinc-600 font-bold uppercase tracking-wider">Enhanced</span>
            <span className="text-xs sm:text-sm font-black font-mono flex items-center">
              {afterScore}<span className="text-[10px] font-medium opacity-80">/100</span>
            </span>
          </div>
        </div>
      </div>

      {/* OVERALL COMPARISON PROGRESS BAR */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between text-[11px] font-medium text-zinc-600 dark:text-zinc-400">
          <span>Overall Prompt Readiness</span>
          <span className="font-mono font-bold text-zinc-900 dark:text-white">
            {beforeScore}% ➔ <strong className="text-zinc-900 dark:text-white">{afterScore}%</strong>
          </span>
        </div>
        <div className="w-full h-2.5 bg-zinc-200 dark:bg-zinc-800 rounded-full overflow-hidden flex relative">
          <div
            className="h-full bg-zinc-400 dark:bg-zinc-600 transition-all duration-500"
            style={{ width: `${beforeScore}%` }}
            title={`Before: ${beforeScore}%`}
          />
          <div
            className="h-full bg-black dark:bg-white transition-all duration-500"
            style={{ width: `${Math.max(afterScore - beforeScore, 0)}%` }}
            title={`Enhanced Boost: +${scoreDiff}%`}
          />
        </div>
      </div>

      {/* 6-DIMENSION METRICS TOGGLE */}
      <div className="pt-1">
        <button
          type="button"
          onClick={() => setShowBreakdown(!showBreakdown)}
          className="w-full flex items-center justify-between text-xs font-bold text-zinc-700 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-white py-1 transition-colors"
        >
          <span className="flex items-center gap-1.5 uppercase tracking-wider text-[11px]">
            <BarChart2 className="w-3.5 h-3.5" /> Metric Breakdown
          </span>
          <span className="text-[11px] text-zinc-500 flex items-center gap-1">
            {showBreakdown ? 'Hide Details' : 'Show Details'}
            {showBreakdown ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </span>
        </button>

        {/* METRICS GRID */}
        {showBreakdown && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3 pt-2.5 animate-in fade-in-50 duration-200">
            {CRITERIA_DEFINITIONS.map(({ key, label, desc }) => {
              const bVal = beforeMetrics[key] || 0;
              const aVal = afterMetrics[key] || 0;

              return (
                <div
                  key={key}
                  className="bg-white dark:bg-zinc-900/90 rounded-lg p-2.5 sm:p-3 border border-zinc-200 dark:border-zinc-800 space-y-1.5 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-zinc-900 dark:text-white">{label}</span>
                    <div className="flex items-center gap-1.5 font-mono text-[11px]">
                      <span className="text-zinc-400 dark:text-zinc-500">{bVal}%</span>
                      <span className="text-zinc-400">➔</span>
                      <span className="font-bold text-zinc-900 dark:text-white">{aVal}%</span>
                    </div>
                  </div>

                  <p className="text-[10px] text-zinc-500 leading-tight truncate">{desc}</p>

                  {/* MINI BAR */}
                  <div className="w-full h-1.5 bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden flex">
                    <div
                      className="h-full bg-zinc-400 dark:bg-zinc-600 transition-all duration-500"
                      style={{ width: `${bVal}%` }}
                    />
                    <div
                      className="h-full bg-black dark:bg-white transition-all duration-500"
                      style={{ width: `${Math.max(aVal - bVal, 0)}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
