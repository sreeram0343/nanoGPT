"use client";

import React, { useState } from "react";
import { Copy, Check, RotateCw } from "lucide-react";

interface OutputBlockProps {
  prompt: string;
  output: string;
  isLoading: boolean;
  onRegenerate: () => void;
}

export const OutputBlock: React.FC<OutputBlockProps> = ({
  output,
  isLoading,
  onRegenerate,
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    if (!output) return;
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="w-full bg-neutral-900/40 border border-neutral-800 rounded-xl p-5 flex flex-col gap-4">
      {isLoading ? (
        <div className="flex items-center gap-3 py-6 px-2 text-neutral-400 text-sm font-mono">
          <div className="w-4 h-4 rounded-full border-2 border-neutral-600 border-t-neutral-200 animate-spin" />
          <span>Generating tokens...</span>
        </div>
      ) : (
        <>
          <div className="font-mono text-sm leading-relaxed text-neutral-200 whitespace-pre-wrap break-words">
            {output}
          </div>

          <div className="flex items-center justify-end gap-2 pt-2 border-t border-neutral-800/60 text-xs text-neutral-400">
            <button
              type="button"
              onClick={handleCopy}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-neutral-900 hover:bg-neutral-850 border border-neutral-800 text-neutral-300 transition-colors"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-neutral-200" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? "Copied" : "Copy"}</span>
            </button>

            <button
              type="button"
              onClick={onRegenerate}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-neutral-900 hover:bg-neutral-850 border border-neutral-800 text-neutral-300 transition-colors"
            >
              <RotateCw className="w-3.5 h-3.5 text-neutral-400" />
              <span>Regenerate</span>
            </button>
          </div>
        </>
      )}
    </div>
  );
};
