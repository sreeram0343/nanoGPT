"use client";

import React, { useState } from "react";
import { Header } from "@/components/Header";
import { EmptyState } from "@/components/EmptyState";
import { OutputBlock } from "@/components/OutputBlock";
import { InputPill } from "@/components/InputPill";
import { SpecsDrawer } from "@/components/SpecsDrawer";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://127.0.0.1:8000";

export default function Home() {
  const [prompt, setPrompt] = useState<string>("");
  const [temperature, setTemperature] = useState<number>(0.8);
  const [maxTokens, setMaxTokens] = useState<number>(150);
  const [output, setOutput] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isSpecsOpen, setIsSpecsOpen] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    setIsLoading(true);
    setError(null);

    try {
      const res = await fetch(`${BACKEND_URL}/api/generate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: prompt,
          max_tokens: maxTokens,
          temperature: temperature,
        }),
      });

      if (!res.ok) {
        throw new Error(`HTTP ${res.status}: ${res.statusText}`);
      }

      const data = await res.json();
      setOutput(data.text);
    } catch (err: any) {
      console.error("Generation error:", err);
      setError("Failed to connect to FastAPI backend on port 8000.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectPrompt = (p: string) => {
    setPrompt(p);
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-200 flex flex-col justify-between selection:bg-neutral-800 selection:text-neutral-100">
      
      {/* Header Bar */}
      <Header onOpenSpecs={() => setIsSpecsOpen(true)} />

      {/* Centered Main Workspace Container */}
      <main className="flex-1 max-w-2xl w-full mx-auto px-4 py-8 flex flex-col justify-center gap-6">
        
        {/* Error Alert */}
        {error && (
          <div className="w-full bg-neutral-900 border border-neutral-800 rounded-xl p-3.5 text-xs text-neutral-400 text-center font-mono">
            {error}
          </div>
        )}

        {/* Dynamic Workspace Content */}
        {!output && !isLoading ? (
          <EmptyState onSelectPrompt={handleSelectPrompt} />
        ) : (
          <OutputBlock
            prompt={prompt}
            output={output}
            isLoading={isLoading}
            onRegenerate={handleGenerate}
          />
        )}

        {/* Floating Bottom Input Pill */}
        <div className="w-full mt-4 sticky bottom-6 z-30">
          <InputPill
            prompt={prompt}
            setPrompt={setPrompt}
            temperature={temperature}
            setTemperature={setTemperature}
            maxTokens={maxTokens}
            setMaxTokens={setMaxTokens}
            onGenerate={handleGenerate}
            isLoading={isLoading}
          />
        </div>

      </main>

      {/* Slide-Over Model Specs Drawer */}
      <SpecsDrawer
        isOpen={isSpecsOpen}
        onClose={() => setIsSpecsOpen(false)}
      />

    </div>
  );
}
