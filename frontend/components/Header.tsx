"use client";

import React from "react";
import { SlidersHorizontal } from "lucide-react";

interface HeaderProps {
  onOpenSpecs: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenSpecs }) => {
  return (
    <header className="w-full border-b border-neutral-800/60 bg-neutral-950 px-4 sm:px-6 py-3.5 flex items-center justify-between sticky top-0 z-40">
      
      {/* Left: Product Title & Tag */}
      <div className="flex items-center gap-2.5">
        <span className="text-sm font-medium text-neutral-200 tracking-tight">
          SuperGPT
        </span>
        <span className="text-[11px] font-mono font-medium px-2 py-0.5 rounded-md bg-neutral-900 border border-neutral-800 text-neutral-400">
          0.82M
        </span>
      </div>

      {/* Right: Model Specs Button ONLY */}
      <div className="flex items-center gap-1.5">
        <button
          type="button"
          onClick={onOpenSpecs}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-neutral-900 hover:bg-neutral-850 border border-neutral-800 text-xs font-medium text-neutral-300 transition-colors"
          title="Open Model Specs"
        >
          <SlidersHorizontal className="w-3.5 h-3.5 text-neutral-400" />
          <span>Model Specs</span>
        </button>
      </div>

    </header>
  );
};
