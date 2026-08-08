"use client";

import React, { useState } from "react";
import { BookOpen, Code, Eye, LineChart, CheckCircle2, ArrowRight } from "lucide-react";

export const EducationalBreakdown: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"tokenizer" | "attention" | "training">("tokenizer");

  return (
    <div className="glass-panel-indigo rounded-2xl p-5 sm:p-6 border border-indigo-500/20 shadow-xl flex flex-col gap-5">
      
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
        <div className="flex items-center gap-2.5">
          <BookOpen className="w-5 h-5 text-indigo-400" />
          <h2 className="text-xl font-bold text-slate-100">Educational Transformer Deep-Dive</h2>
        </div>
        <span className="text-xs text-indigo-300 bg-indigo-500/10 border border-indigo-500/30 px-3 py-1 rounded-full">
          Super GPT Concepts
        </span>
      </div>

      {/* Tabs Switcher */}
      <div className="flex flex-wrap gap-2 border-b border-slate-800/80 pb-2">
        <button
          type="button"
          onClick={() => setActiveTab("tokenizer")}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
            activeTab === "tokenizer"
              ? "bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20"
              : "bg-slate-900 text-slate-300 hover:bg-slate-800 border border-slate-800"
          }`}
        >
          <Code className="w-4 h-4" />
          <span>1. Character Tokenizer (V = 65)</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("attention")}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
            activeTab === "attention"
              ? "bg-indigo-500 text-white shadow-md shadow-indigo-500/20"
              : "bg-slate-900 text-slate-300 hover:bg-slate-800 border border-slate-800"
          }`}
        >
          <Eye className="w-4 h-4" />
          <span>2. Causal Self-Attention</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("training")}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
            activeTab === "training"
              ? "bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20"
              : "bg-slate-900 text-slate-300 hover:bg-slate-800 border border-slate-800"
          }`}
        >
          <LineChart className="w-4 h-4" />
          <span>3. Training & Loss Curves</span>
        </button>
      </div>

      {/* Tab Content */}
      <div className="bg-slate-950/80 border border-slate-850 rounded-xl p-5 text-sm leading-relaxed text-slate-300">
        
        {/* Tab 1: Tokenizer */}
        {activeTab === "tokenizer" && (
          <div className="flex flex-col gap-4 animate-fadeIn">
            <h3 className="text-base font-bold text-amber-300 flex items-center gap-2">
              <Code className="w-4 h-4 text-amber-400" />
              Character-Level Tokenization (Vocab Size V = 65)
            </h3>
            <p>
              Unlike BPE (Byte-Pair Encoding) used in GPT-4 or LLaMA, Super GPT uses a clean <strong>character-level vocabulary</strong> extracted directly from the Tiny Shakespeare dataset. Every unique character (uppercase, lowercase, punctuation, space, newline) is assigned an integer index from <code className="text-amber-400 font-mono">0</code> to <code className="text-amber-400 font-mono">64</code>.
            </p>

            <div className="bg-slate-900/90 border border-slate-800 rounded-lg p-3 font-mono text-xs text-amber-300">
              <span className="text-slate-400">{"// Character Mapping Snippet"}</span>
              <br />
              {"stoi = {'\\n': 0, ' ': 1, '!': 2, ... 'R': 30, 'O': 27, 'M': 25, 'E': 17}"}
              <br />
              {"encode('ROMEO:')"} <ArrowRight className="inline w-3 h-3 mx-1 text-slate-400" /> [30, 27, 25, 17, 27, 10]
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs text-slate-300 mt-1">
              <div className="bg-slate-900/60 p-3 rounded-lg border border-slate-800 flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span><strong>No Out-Of-Vocabulary (OOV) Errors:</strong> Any text containing Shakespearean characters can be encoded directly into input index tensors.</span>
              </div>
              <div className="bg-slate-900/60 p-3 rounded-lg border border-slate-800 flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span><strong>Compact Embedding Table:</strong> Token embedding matrix shape is <code className="text-indigo-300 font-mono">[65, 128]</code>, consuming just 8,320 parameters.</span>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Self-Attention */}
        {activeTab === "attention" && (
          <div className="flex flex-col gap-4 animate-fadeIn">
            <h3 className="text-base font-bold text-indigo-300 flex items-center gap-2">
              <Eye className="w-4 h-4 text-indigo-400" />
              Causal Multi-Head Self-Attention Architecture
            </h3>
            <p>
              Each token vector (embedding dim = 128) undergoes linear projections into <strong>Queries (Q)</strong>, <strong>Keys (K)</strong>, and <strong>Values (V)</strong>. Across 4 parallel heads (head size = 32), attention weights compute pairwise character affinity:
            </p>

            <div className="bg-slate-900/90 border border-slate-800 rounded-lg p-3 font-mono text-xs text-indigo-300 overflow-x-auto">
              <span className="text-slate-400">{"// Scaled Dot-Product Causal Masking"}</span>
              <br />
              {"Wei = Softmax( (Q @ K.T) / sqrt(d_k) + Tril_Mask )"}
              <br />
              {"Out = Wei @ V"}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs text-slate-300 mt-1">
              <div className="bg-slate-900/60 p-3 rounded-lg border border-slate-800 flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
                <span><strong>Causal Masking (tril):</strong> Future tokens are zeroed out via lower-triangular matrix masking so character position t can only attend to past characters ≤ t.</span>
              </div>
              <div className="bg-slate-900/60 p-3 rounded-lg border border-slate-800 flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
                <span><strong>Residual Skip Connections:</strong> Pre-LayerNorm block outputs <code className="text-amber-300 font-mono">{"x = x + sa(ln1(x))"}</code> enable stable backpropagation gradient flow.</span>
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: Training & Loss */}
        {activeTab === "training" && (
          <div className="flex flex-col gap-4 animate-fadeIn">
            <h3 className="text-base font-bold text-emerald-300 flex items-center gap-2">
              <LineChart className="w-4 h-4 text-emerald-400" />
              Optimization & Cross-Entropy Loss Curve
            </h3>
            <p>
              Super GPT was trained from scratch in PyTorch using the <strong>AdamW optimizer</strong> (<code className="text-emerald-400 font-mono">lr=1e-3</code>). The initial baseline loss for random sampling among 65 characters is -ln(1/65) ≈ 4.17.
            </p>

            <div className="bg-slate-900/90 border border-slate-800 rounded-lg p-3 text-xs flex flex-col gap-2">
              <div className="flex items-center justify-between text-slate-300">
                <span>Step 0 (Random Weights):</span>
                <span className="font-mono text-rose-400 font-bold">Train Loss ~ 4.22</span>
              </div>
              <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                <div className="bg-rose-500 h-full w-[95%]" />
              </div>

              <div className="flex items-center justify-between text-slate-300 mt-2">
                <span>Step 1,000 (Patterns Emerging):</span>
                <span className="font-mono text-amber-300 font-bold">Train Loss ~ 2.10</span>
              </div>
              <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                <div className="bg-amber-400 h-full w-[50%]" />
              </div>

              <div className="flex items-center justify-between text-slate-300 mt-2">
                <span>Step 2,500 (Shakespeare Dialogue Trained):</span>
                <span className="font-mono text-emerald-400 font-bold">Train Loss ~ 1.56</span>
              </div>
              <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                <div className="bg-emerald-400 h-full w-[35%]" />
              </div>
            </div>

            <p className="text-xs text-slate-400">
              At loss ~1.56, Super GPT consistently produces coherent Shakespearean rhythm, character names, colon dialogues, and Elizabethan vocabulary structure!
            </p>
          </div>
        )}

      </div>

    </div>
  );
};
