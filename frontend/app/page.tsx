"use client";

import React, { useState } from "react";
import { Header } from "@/components/Header";
import { EmptyState } from "@/components/EmptyState";
import { ChatFeed, MessageTurn } from "@/components/ChatFeed";
import { InputPill } from "@/components/InputPill";
import { SpecsDrawer } from "@/components/SpecsDrawer";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://127.0.0.1:8000";

export default function Home() {
  const [prompt, setPrompt] = useState<string>("");
  const [temperature, setTemperature] = useState<number>(0.8);
  const [maxTokens, setMaxTokens] = useState<number>(150);
  const [turns, setTurns] = useState<MessageTurn[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isSpecsOpen, setIsSpecsOpen] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async (overridePrompt?: string) => {
    const activePrompt = overridePrompt || prompt;
    if (!activePrompt.trim() || isLoading) return;

    setIsLoading(true);
    setError(null);
    setPrompt("");

    const turnId = Date.now().toString();

    try {
      const res = await fetch(`${BACKEND_URL}/api/generate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: activePrompt,
          max_tokens: maxTokens,
          temperature: temperature,
        }),
      });

      if (!res.ok) {
        throw new Error(`HTTP ${res.status}: ${res.statusText}`);
      }

      const data = await res.json();

      setTurns((prev) => [
        ...prev,
        {
          id: turnId,
          prompt: activePrompt,
          response: data.text,
        },
      ]);
    } catch (err) {
      console.error("Generation error:", err);
      setError("Failed to connect to FastAPI backend on port 8000.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectPrompt = (p: string) => {
    setPrompt(p);
    handleGenerate(p);
  };

  const handleRegenerateLast = () => {
    if (turns.length === 0) return;
    const lastTurn = turns[turns.length - 1];
    setTurns((prev) => prev.slice(0, -1));
    handleGenerate(lastTurn.prompt);
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-200 flex flex-col justify-between selection:bg-neutral-800 selection:text-neutral-100">
      
      {/* Header Bar */}
      <Header onOpenSpecs={() => setIsSpecsOpen(true)} />

      {/* Centered Chat Workspace Container */}
      <main className="flex-1 max-w-2xl w-full mx-auto px-4 py-6 flex flex-col justify-between gap-4">
        
        {/* Error Notification */}
        {error && (
          <div className="w-full bg-neutral-900 border border-neutral-800 rounded-xl p-3 text-xs text-neutral-400 text-center font-mono">
            {error}
          </div>
        )}

        {/* Multi-Turn Chat Feed or Empty State */}
        <div className="flex-1 flex flex-col justify-center">
          {turns.length === 0 && !isLoading ? (
            <EmptyState onSelectPrompt={handleSelectPrompt} />
          ) : (
            <ChatFeed
              turns={turns}
              isLoading={isLoading}
              onRegenerateLast={handleRegenerateLast}
            />
          )}
        </div>

        {/* Floating Bottom Input Pill */}
        <div className="w-full mt-4 sticky bottom-6 z-30">
          <InputPill
            prompt={prompt}
            setPrompt={setPrompt}
            temperature={temperature}
            setTemperature={setTemperature}
            maxTokens={maxTokens}
            setMaxTokens={setMaxTokens}
            onGenerate={() => handleGenerate()}
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
