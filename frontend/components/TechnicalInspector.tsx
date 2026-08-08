"use client";

import React from "react";
import { Cpu, Layers, Maximize2, Type, Activity } from "lucide-react";

export const TechnicalInspector: React.FC = () => {
  const metrics = [
    {
      title: "Model Parameters",
      value: "824,897",
      subtext: "0.82M Total Trainable Parameters",
      icon: Cpu,
      accent: "from-amber-500/20 to-amber-600/10 border-amber-500/30 text-amber-400",
      pill: "PyTorch state_dict",
    },
    {
      title: "Architecture",
      value: "4 L | 4 H | 128 C",
      subtext: "4 Blocks · 4 Attention Heads · 128 Embed Dim",
      icon: Layers,
      accent: "from-indigo-500/20 to-indigo-600/10 border-indigo-500/30 text-indigo-400",
      pill: "Pre-LN Decoder",
    },
    {
      title: "Context Window",
      value: "128 Tokens",
      subtext: "Maximum Autoregressive Sequence Length",
      icon: Maximize2,
      accent: "from-emerald-500/20 to-emerald-600/10 border-emerald-500/30 text-emerald-400",
      pill: "Positional Embeddings",
    },
    {
      title: "Vocabulary Size",
      value: "65 Characters",
      subtext: "Character-Level Tokenizer Mapping (stoi/itos)",
      icon: Type,
      accent: "from-purple-500/20 to-purple-600/10 border-purple-500/30 text-purple-400",
      pill: "Tiny Shakespeare",
    },
  ];

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Activity className="w-5 h-5 text-indigo-400" />
          <h2 className="text-xl font-bold text-slate-100">Architecture & Technical Inspector</h2>
        </div>
        <span className="text-xs text-slate-400 bg-slate-900 border border-slate-800 px-3 py-1 rounded-full">
          Super GPT Specs
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map((m, idx) => {
          const IconComponent = m.icon;
          return (
            <div
              key={idx}
              className="glass-panel rounded-2xl p-4 sm:p-5 flex flex-col justify-between border border-slate-800 hover:border-slate-700 transition-all duration-200 hover:-translate-y-0.5 shadow-lg group"
            >
              <div className="flex items-start justify-between">
                <div className={`p-2.5 rounded-xl bg-gradient-to-br ${m.accent} border`}>
                  <IconComponent className="w-5 h-5" />
                </div>
                <span className="text-[10px] font-mono font-medium px-2 py-0.5 rounded-full bg-slate-900 text-slate-400 border border-slate-800">
                  {m.pill}
                </span>
              </div>

              <div className="mt-4">
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  {m.title}
                </p>
                <p className="text-xl sm:text-2xl font-black text-slate-100 mt-1 font-mono tracking-tight group-hover:text-amber-300 transition-colors">
                  {m.value}
                </p>
                <p className="text-xs text-slate-400 mt-1">
                  {m.subtext}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
