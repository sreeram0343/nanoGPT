"use client";

import React, { useState, useEffect } from "react";
import { Header } from "@/components/Header";
import { GeneratorPanel } from "@/components/GeneratorPanel";
import { ManuscriptOutput } from "@/components/ManuscriptOutput";
import { TechnicalInspector } from "@/components/TechnicalInspector";
import { EducationalBreakdown } from "@/components/EducationalBreakdown";
import { AlertCircle, Terminal, Cpu } from "lucide-react";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://127.0.0.1:8000";

export default function Home() {
  const [prompt, setPrompt] = useState<string>("ROMEO:");
  const [temperature, setTemperature] = useState<number>(0.8);
  const [maxTokens, setMaxTokens] = useState<number>(150);
  const [output, setOutput] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [apiStatus, setApiStatus] = useState<"online" | "offline" | "checking">("checking");
  const [latencyMs, setLatencyMs] = useState<number | undefined>(undefined);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Ping backend health check
  const checkHealth = async () => {
    try {
      const res = await fetch(`${BACKEND_URL}/health`, { method: "GET" });
      if (res.ok) {
        setApiStatus("online");
      } else {
        setApiStatus("offline");
      }
    } catch (err) {
      setApiStatus("offline");
    }
  };

  useEffect(() => {
    checkHealth();
    const interval = setInterval(checkHealth, 5000);
    return () => clearInterval(interval);
  }, []);

  // Handle generation request
  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    setIsLoading(true);
    setErrorMessage(null);

    const startTime = performance.now();

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
      const elapsed = Math.round(performance.now() - startTime);

      setOutput(data.text);
      setLatencyMs(data.latency_ms || elapsed);
      setApiStatus("online");
    } catch (err: any) {
      console.error("Generation error:", err);
      setErrorMessage(
        err.message || "Failed to communicate with FastAPI backend. Ensure server is running on port 8000."
      );
      setApiStatus("offline");
    } finally {
      setIsLoading(false);
    }
  };

  const handleClear = () => {
    setOutput("");
    setLatencyMs(undefined);
    setErrorMessage(null);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-amber-500 selection:text-slate-950">
      
      {/* Navigation Header */}
      <Header apiStatus={apiStatus} latency={latencyMs} />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-8 py-8 flex flex-col gap-8">
        
        {/* Error Alert Banner if Backend Disconnected */}
        {apiStatus === "offline" && (
          <div className="bg-rose-950/60 border border-rose-800/80 rounded-xl p-4 flex items-center gap-3 text-rose-200 text-sm shadow-md animate-fadeIn">
            <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />
            <div>
              <p className="font-semibold text-rose-300">FastAPI Backend Server Disconnected</p>
              <p className="text-xs text-rose-300/80 mt-0.5">
                Run <code className="bg-rose-900/60 px-1.5 py-0.5 rounded font-mono text-rose-200">python -m uvicorn app:app --reload --port 8000</code> inside <code className="font-mono text-rose-200">/backend</code> to connect live PyTorch inference.
              </p>
            </div>
          </div>
        )}

        {/* Hero Section */}
        <div className="text-center max-w-3xl mx-auto flex flex-col gap-3 py-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs font-semibold self-center">
            <Cpu className="w-3.5 h-3.5" />
            <span>0.82M Parameter PyTorch Architecture</span>
          </div>

          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight bg-gradient-to-r from-amber-100 via-amber-300 to-indigo-300 bg-clip-text text-transparent">
            Super GPT Shakespeare Generator
          </h2>

          <p className="text-sm sm:text-base text-slate-400 leading-relaxed">
            Experience real-time character-level autoregressive text generation powered by a custom-trained Transformer decoder. Adjust sampling temperature and context window parameters below.
          </p>
        </div>

        {/* Interactive Workspace (Split Grid) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* Left Column: Generator Controls */}
          <div className="lg:col-span-5">
            <GeneratorPanel
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

          {/* Right Column: Manuscript Output */}
          <div className="lg:col-span-7">
            <ManuscriptOutput
              prompt={prompt}
              output={output}
              latencyMs={latencyMs}
              temperature={temperature}
              maxTokens={maxTokens}
              isLoading={isLoading}
              onClear={handleClear}
              onRegenerate={handleGenerate}
            />
          </div>

        </div>

        {/* Architecture & Technical Inspector Card Grid */}
        <section className="mt-4">
          <TechnicalInspector />
        </section>

        {/* Educational Deep-Dive Accordion / Tabs */}
        <section>
          <EducationalBreakdown />
        </section>

      </main>

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-slate-950 py-6 px-4 text-center text-xs text-slate-400">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="flex items-center gap-1.5 text-slate-400">
            <Terminal className="w-4 h-4 text-amber-400" />
            <span>Super GPT Showcase · Created with PyTorch, FastAPI & Next.js 14</span>
          </p>
          <div className="flex items-center gap-2 font-mono text-[11px]">
            <span className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-slate-300">PyTorch 2.0</span>
            <span className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-slate-300">FastAPI</span>
            <span className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-slate-300">Next.js 14</span>
            <span className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-slate-300">Tailwind CSS</span>
          </div>
        </div>
      </footer>

    </div>
  );
}
