"use client";

import React from "react";
import { ArrowUpRight } from "lucide-react";

interface EmptyStateProps {
  onSelectPrompt: (p: string) => void;
}

const SAMPLE_PROMPTS = [
  "ROMEO: Shall I hear more?",
  "HAMLET: To be, or not to be",
  "JULIET: O Romeo, Romeo!",
];

export const EmptyState: React.FC<EmptyStateProps> = ({ onSelectPrompt }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[320px] text-center px-4 py-8">
      <h1 className="text-2xl sm:text-3xl font-normal text-neutral-200 tracking-tight mb-2">
        Tiny Shakespeare Transformer
      </h1>
      <p className="text-sm text-neutral-400 max-w-md mb-8">
        Character-level autoregressive language model trained in PyTorch. Select a prompt or enter your own text below.
      </p>

      <div className="flex flex-col sm:flex-row flex-wrap items-center justify-center gap-2.5 max-w-xl w-full">
        {SAMPLE_PROMPTS.map((promptText) => (
          <button
            key={promptText}
            type="button"
            onClick={() => onSelectPrompt(promptText)}
            className="flex items-center justify-between gap-3 px-4 py-2.5 rounded-xl bg-neutral-900 hover:bg-neutral-850 border border-neutral-800 hover:border-neutral-700 text-xs font-mono text-neutral-300 transition-all text-left group"
          >
            <span>{promptText}</span>
            <ArrowUpRight className="w-3.5 h-3.5 text-neutral-500 group-hover:text-neutral-300 transition-colors shrink-0" />
          </button>
        ))}
      </div>
    </div>
  );
};
