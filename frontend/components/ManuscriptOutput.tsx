"use client";

import React, { useState } from "react";
import { Copy, Check, Trash2, RotateCw, Terminal, Clock, Cpu, FileText } from "lucide-react";

interface ManuscriptOutputProps {
  prompt: string;
  output: string;
  latencyMs?: number;
  temperature: number;
  maxTokens: number;
  isLoading: boolean;
  onClear: () => void;
  onRegenerate: () => void;
}

export const ManuscriptOutput: React.FC<ManuscriptOutputProps> = ({
  prompt,
  output,
  latencyMs,
  temperature,
  maxTokens,
  isLoading,
  onClear,
  onRegenerate,
}) => {
  const [copied, setCopied] = useState(false);

  const fullText = output ? (output.startsWith(prompt) ? output : prompt + output) : "";
  const completionText = output ? (output.startsWith(prompt) ? output.slice(prompt.length) : output) : "";

  const handleCopy = () => {
    if (!fullText) return;
    navigator.clipboard.writeText(fullText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="glass-panel rounded-2xl p-5 sm:p-6 flex flex-col justify-between min-h-[420px] border border-slate-800 shadow-xl">
      
      {/* Header Bar */}
      <div className="flex items-center justify-between border-b border-slate-800/80 pb-3 mb-4">
        <div className="flex items-center gap-2.5">
          <Terminal className="w-5 h-5 text-amber-400" />
          <h2 className="text-lg font-bold text-slate-100">Manuscript Terminal</h2>
        </div>

        {/* Output Action Buttons */}
        <div className="flex items-center gap-2">
          {output && (
            <>
              <button
                type="button"
                onClick={handleCopy}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-750 text-xs font-medium text-slate-300 transition-colors"
                title="Copy Full Output"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? "Copied!" : "Copy"}</span>
              </button>

              <button
                type="button"
                onClick={onRegenerate}
                disabled={isLoading}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-750 text-xs font-medium text-amber-400 transition-colors disabled:opacity-50"
                title="Regenerate with same parameters"
              >
                <RotateCw className={`w-3.5 h-3.5 ${isLoading ? "animate-spin" : ""}`} />
                <span>Retry</span>
              </button>

              <button
                type="button"
                onClick={onClear}
                className="p-1.5 rounded-lg bg-slate-900 hover:bg-rose-950/50 border border-slate-750 hover:border-rose-800/50 text-slate-400 hover:text-rose-400 transition-colors"
                title="Clear Output"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </>
          )}
        </div>
      </div>

      {/* Main Terminal Output Content Area */}
      <div className="flex-1 bg-slate-950/90 border border-slate-850 rounded-xl p-4 sm:p-5 font-mono text-sm leading-relaxed overflow-y-auto max-h-[380px] shadow-inner">
        {isLoading ? (
          <div className="h-full min-h-[220px] flex flex-col items-center justify-center text-slate-400 gap-3">
            <div className="relative">
              <div className="w-10 h-10 rounded-full border-2 border-amber-500/20 border-t-amber-400 animate-spin" />
              <Cpu className="w-5 h-5 text-amber-400 absolute inset-0 m-auto" />
            </div>
            <p className="text-xs text-amber-300 animate-pulse font-sans">
              Autoregressively sampling PyTorch Transformer logits...
            </p>
          </div>
        ) : output ? (
          <div className="whitespace-pre-wrap break-words">
            <span className="text-amber-400 font-bold bg-amber-500/10 px-1.5 py-0.5 rounded border border-amber-500/30 mr-1 select-all">
              {prompt}
            </span>
            <span className="text-slate-100">{completionText}</span>
          </div>
        ) : (
          <div className="h-full min-h-[220px] flex flex-col items-center justify-center text-slate-500 gap-2 select-none">
            <FileText className="w-8 h-8 opacity-40 text-amber-400" />
            <p className="text-xs font-sans text-slate-400">
              Select a prompt and click <span className="text-amber-400 font-medium">&quot;Generate Shakespearean Text&quot;</span> to begin.
            </p>
          </div>
        )}
      </div>

      {/* Output Metadata Bar */}
      <div className="mt-4 pt-3 border-t border-slate-800/80 flex flex-wrap items-center justify-between text-xs text-slate-400 gap-2">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-slate-400" />
            Latency: <strong className="text-slate-200 font-mono">{latencyMs ? `${latencyMs} ms` : "--"}</strong>
          </span>

          <span>
            Generated Chars: <strong className="text-slate-200 font-mono">{output ? completionText.length : 0}</strong>
          </span>
        </div>

        <div className="flex items-center gap-3 text-[11px] font-mono text-slate-400">
          <span>Temp: <strong className="text-amber-400">{temperature}</strong></span>
          <span>Max Tokens: <strong className="text-indigo-400">{maxTokens}</strong></span>
        </div>
      </div>

    </div>
  );
};
