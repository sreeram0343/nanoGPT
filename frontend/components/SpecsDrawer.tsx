"use client";

import React from "react";
import { X, Cpu, Layers, Maximize2, Type, BookOpen } from "lucide-react";

interface SpecsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SpecsDrawer: React.FC<SpecsDrawerProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-black/60 backdrop-blur-xs animate-fade-in"
      />

      {/* Slide-over Panel */}
      <div className="relative w-full max-w-md bg-neutral-950 border-l border-neutral-800/80 h-full p-6 overflow-y-auto flex flex-col justify-between z-50 shadow-2xl animate-fade-in">
        
        <div className="flex flex-col gap-6">
          
          {/* Header */}
          <div className="flex items-center justify-between border-b border-neutral-800 pb-4">
            <div>
              <h2 className="text-base font-semibold text-neutral-200">SuperGPT Specs</h2>
              <p className="text-xs text-neutral-400 mt-0.5">Tiny Shakespeare PyTorch Architecture</p>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-lg bg-neutral-900 border border-neutral-800 text-neutral-400 hover:text-neutral-200 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Metric Grid */}
          <div className="grid grid-cols-1 gap-3">
            
            <div className="bg-neutral-900/60 border border-neutral-800 rounded-xl p-4 flex items-start justify-between">
              <div>
                <span className="text-xs text-neutral-400 font-medium">Parameter Count</span>
                <p className="text-lg font-mono font-semibold text-neutral-200 mt-0.5">824,897</p>
                <span className="text-[11px] text-neutral-400">0.82M Total Trainable Parameters</span>
              </div>
              <Cpu className="w-4 h-4 text-neutral-400 mt-1" />
            </div>

            <div className="bg-neutral-900/60 border border-neutral-800 rounded-xl p-4 flex items-start justify-between">
              <div>
                <span className="text-xs text-neutral-400 font-medium">Architecture</span>
                <p className="text-lg font-mono font-semibold text-neutral-200 mt-0.5">4 L · 4 H · 128 C</p>
                <span className="text-[11px] text-neutral-400">4 Layers | 4 Attention Heads | 128 Embed Dim</span>
              </div>
              <Layers className="w-4 h-4 text-neutral-400 mt-1" />
            </div>

            <div className="bg-neutral-900/60 border border-neutral-800 rounded-xl p-4 flex items-start justify-between">
              <div>
                <span className="text-xs text-neutral-400 font-medium">Context Window</span>
                <p className="text-lg font-mono font-semibold text-neutral-200 mt-0.5">128 Tokens</p>
                <span className="text-[11px] text-neutral-400">Maximum Autoregressive Context Length</span>
              </div>
              <Maximize2 className="w-4 h-4 text-neutral-400 mt-1" />
            </div>

            <div className="bg-neutral-900/60 border border-neutral-800 rounded-xl p-4 flex items-start justify-between">
              <div>
                <span className="text-xs text-neutral-400 font-medium">Vocabulary</span>
                <p className="text-lg font-mono font-semibold text-neutral-200 mt-0.5">65 Characters</p>
                <span className="text-[11px] text-neutral-400">Character-Level Tokenizer (stoi/itos)</span>
              </div>
              <Type className="w-4 h-4 text-neutral-400 mt-1" />
            </div>

          </div>

          {/* Breakdown */}
          <div className="border-t border-neutral-800 pt-5 flex flex-col gap-4">
            <div className="flex items-center gap-2 text-xs font-semibold text-neutral-300">
              <BookOpen className="w-4 h-4 text-neutral-400" />
              <span>Technical Summary</span>
            </div>

            <div className="bg-neutral-900/40 border border-neutral-800/80 rounded-xl p-3.5 text-xs text-neutral-400 leading-relaxed flex flex-col gap-2">
              <p>
                <strong className="text-neutral-200">Tokenizer:</strong> Character-level encoding ($V=65$) mapping characters directly to integer IDs.
              </p>
              <p>
                <strong className="text-neutral-200">Attention:</strong> Pre-LayerNorm decoder blocks with lower-triangular causal attention masking.
              </p>
              <p>
                <strong className="text-neutral-200">Loss:</strong> Cross-entropy loss reduction from baseline 4.22 down to ~1.56.
              </p>
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="border-t border-neutral-800 pt-4 text-[11px] text-neutral-400 text-center font-mono">
          FastAPI Backend · PyTorch 2.0 · Next.js 14
        </div>

      </div>
    </div>
  );
};
