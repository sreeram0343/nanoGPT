"use client";

import React, { useState, useRef, useEffect } from "react";
import { ArrowUp, Sliders, X } from "lucide-react";

interface InputPillProps {
  prompt: string;
  setPrompt: (p: string) => void;
  temperature: number;
  setTemperature: (t: number) => void;
  maxTokens: number;
  setMaxTokens: (m: number) => void;
  onGenerate: () => void;
  isLoading: boolean;
}

export const InputPill: React.FC<InputPillProps> = ({
  prompt,
  setPrompt,
  temperature,
  setTemperature,
  maxTokens,
  setMaxTokens,
  onGenerate,
  isLoading,
}) => {
  const [showSettings, setShowSettings] = useState(false);
  const popoverRef = useRef<HTMLDivElement>(null);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey && !isLoading && prompt.trim()) {
      e.preventDefault();
      onGenerate();
    }
  };

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (popoverRef.current && !popoverRef.current.contains(e.target as Node)) {
        setShowSettings(false);
      }
    };
    if (showSettings) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showSettings]);

  return (
    <div className="w-full relative">
      
      {/* Settings Popover */}
      {showSettings && (
        <div
          ref={popoverRef}
          className="absolute bottom-full mb-3 left-0 w-full max-w-xs bg-neutral-900 border border-neutral-800 rounded-xl p-4 shadow-2xl z-50 text-xs flex flex-col gap-4 animate-fade-in"
        >
          <div className="flex items-center justify-between border-b border-neutral-800 pb-2">
            <span className="font-medium text-neutral-300">Model Parameters</span>
            <button
              type="button"
              onClick={() => setShowSettings(false)}
              className="text-neutral-400 hover:text-neutral-200"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Temperature */}
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center justify-between text-neutral-400">
              <span>Temperature</span>
              <span className="font-mono text-neutral-200">{temperature.toFixed(2)}</span>
            </div>
            <input
              type="range"
              min="0.1"
              max="2.0"
              step="0.05"
              value={temperature}
              onChange={(e) => setTemperature(parseFloat(e.target.value))}
              className="w-full h-1 bg-neutral-800 rounded appearance-none cursor-pointer accent-neutral-300"
            />
          </div>

          {/* Max Tokens */}
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center justify-between text-neutral-400">
              <span>Max Tokens</span>
              <span className="font-mono text-neutral-200">{maxTokens}</span>
            </div>
            <input
              type="range"
              min="50"
              max="300"
              step="10"
              value={maxTokens}
              onChange={(e) => setMaxTokens(parseInt(e.target.value))}
              className="w-full h-1 bg-neutral-800 rounded appearance-none cursor-pointer accent-neutral-300"
            />
          </div>
        </div>
      )}

      {/* Main Floating Input Pill Container */}
      <div className="w-full rounded-2xl bg-neutral-900 border border-neutral-800 focus-within:border-neutral-700 p-2.5 flex items-center gap-2 shadow-xl transition-colors">
        
        {/* Settings Toggle Icon Button */}
        <button
          type="button"
          onClick={() => setShowSettings(!showSettings)}
          className={`p-2.5 rounded-xl transition-colors ${
            showSettings
              ? "bg-neutral-800 text-neutral-200"
              : "text-neutral-400 hover:text-neutral-200 hover:bg-neutral-850"
          }`}
          title="Adjust Hyperparameters"
        >
          <Sliders className="w-4 h-4" />
        </button>

        {/* Textarea Input */}
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          onKeyDown={handleKeyDown}
          rows={1}
          placeholder="Ask SuperGPT a prompt (e.g., ROMEO:)..."
          className="flex-1 bg-transparent text-sm text-neutral-200 placeholder-neutral-500 focus:outline-none resize-none font-sans px-1"
        />

        {/* Generate Button */}
        <button
          type="button"
          onClick={onGenerate}
          disabled={isLoading || !prompt.trim()}
          className="p-2.5 rounded-xl bg-neutral-800 hover:bg-neutral-750 disabled:opacity-40 text-neutral-200 disabled:cursor-not-allowed transition-all shrink-0"
          title="Send Prompt"
        >
          {isLoading ? (
            <div className="w-4 h-4 rounded-full border-2 border-neutral-500 border-t-neutral-200 animate-spin" />
          ) : (
            <ArrowUp className="w-4 h-4" />
          )}
        </button>

      </div>
    </div>
  );
};
