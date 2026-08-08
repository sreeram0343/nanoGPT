"use client";

import React from "react";
import { Loader2, Thermometer, Hash, MessageSquare, Sparkles } from "lucide-react";

interface GeneratorPanelProps {
  prompt: string;
  setPrompt: (p: string) => void;
  temperature: number;
  setTemperature: (t: number) => void;
  maxTokens: number;
  setMaxTokens: (m: number) => void;
  onGenerate: () => void;
  isLoading: boolean;
  disabled?: boolean;
}

const PRESET_PROMPTS = [
  "ROMEO:",
  "JULIET:",
  "HAMLET:",
  "KING RICHARD:",
  "OTHELLO:",
  "To be, or not to be:",
];

export const GeneratorPanel: React.FC<GeneratorPanelProps> = ({
  prompt,
  setPrompt,
  temperature,
  setTemperature,
  maxTokens,
  setMaxTokens,
  onGenerate,
  isLoading,
  disabled,
}) => {

  const getTempTooltip = (temp: number) => {
    if (temp < 0.5) return { text: "Conservative / Deterministic", color: "text-blue-400 bg-blue-500/10 border-blue-500/30" };
    if (temp <= 1.2) return { text: "Balanced / Creative", color: "text-emerald-400 bg-emerald-500/10 border-emerald-500/30" };
    return { text: "Wild / Chaotic", color: "text-amber-400 bg-amber-500/10 border-amber-500/30" };
  };

  const tempDesc = getTempTooltip(temperature);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if ((e.ctrlKey || e.metaKey) && e.key === "Enter" && !isLoading && !disabled) {
      e.preventDefault();
      onGenerate();
    }
  };

  return (
    <div className="glass-panel-amber rounded-2xl p-5 sm:p-6 flex flex-col gap-5 border border-amber-500/20 shadow-xl">
      
      {/* Panel Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <MessageSquare className="w-5 h-5 text-amber-400" />
          <h2 className="text-lg font-bold text-slate-100">Generation Controls</h2>
        </div>
        <span className="text-xs text-slate-400">Ctrl + Enter to run</span>
      </div>

      {/* Preset Pills */}
      <div>
        <label className="text-xs font-semibold text-slate-300 mb-2 block">
          Preset Prompts
        </label>
        <div className="flex flex-wrap gap-2">
          {PRESET_PROMPTS.map((p) => (
            <button
              key={p}
              type="button"
              onClick={() => setPrompt(p)}
              className={`px-2.5 py-1 text-xs rounded-md font-mono transition-all duration-150 ${
                prompt === p
                  ? "bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-sm"
                  : "bg-slate-900/80 text-slate-300 hover:bg-slate-800 border border-slate-800"
              }`}
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      {/* Prompt Textarea */}
      <div>
        <label htmlFor="prompt-input" className="text-xs font-semibold text-slate-300 mb-1.5 block">
          Input Prompt String
        </label>
        <textarea
          id="prompt-input"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          onKeyDown={handleKeyDown}
          rows={4}
          placeholder="Enter prompt e.g. ROMEO:..."
          className="w-full bg-slate-950/90 border border-slate-800 rounded-xl p-3.5 text-sm font-mono text-amber-300 placeholder-slate-600 focus:outline-none focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/50 transition-all resize-none"
        />
      </div>

      {/* Sliders Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        
        {/* Temperature Slider */}
        <div className="bg-slate-950/60 p-3.5 rounded-xl border border-slate-800/80 flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-300">
              <Thermometer className="w-4 h-4 text-amber-400" />
              <span>Temperature ($T$)</span>
            </div>
            <span className="text-xs font-mono font-bold text-amber-300">{temperature.toFixed(2)}</span>
          </div>

          <input
            type="range"
            min="0.1"
            max="2.0"
            step="0.05"
            value={temperature}
            onChange={(e) => setTemperature(parseFloat(e.target.value))}
            className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-amber-400"
          />

          <span className={`text-[11px] px-2 py-0.5 rounded-md border font-medium self-start mt-0.5 ${tempDesc.color}`}>
            {tempDesc.text}
          </span>
        </div>

        {/* Max Tokens Slider */}
        <div className="bg-slate-950/60 p-3.5 rounded-xl border border-slate-800/80 flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-300">
              <Hash className="w-4 h-4 text-indigo-400" />
              <span>Max Characters</span>
            </div>
            <span className="text-xs font-mono font-bold text-indigo-300">{maxTokens} chars</span>
          </div>

          <input
            type="range"
            min="50"
            max="300"
            step="10"
            value={maxTokens}
            onChange={(e) => setMaxTokens(parseInt(e.target.value))}
            className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-500"
          />

          <span className="text-[11px] text-slate-400 mt-0.5">
            Context window cap: 128 tokens
          </span>
        </div>

      </div>

      {/* Generate Action Button */}
      <button
        type="button"
        onClick={onGenerate}
        disabled={isLoading || disabled || !prompt.trim()}
        className="w-full py-3.5 px-6 rounded-xl font-semibold text-sm tracking-wide bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 shadow-lg shadow-amber-500/20 active:scale-[0.99] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2.5"
      >
        {isLoading ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin text-slate-950" />
            <span>Sampling Next Tokens...</span>
          </>
        ) : (
          <>
            <Sparkles className="w-5 h-5 text-slate-950" />
            <span>Generate Shakespearean Text</span>
          </>
        )}
      </button>

    </div>
  );
};
