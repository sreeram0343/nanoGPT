"use client";

import React, { useRef, useEffect, useState } from "react";
import { Copy, Check, RotateCw } from "lucide-react";

export interface MessageTurn {
  id: string;
  prompt: string;
  response: string;
}

interface ChatFeedProps {
  turns: MessageTurn[];
  isLoading: boolean;
  onRegenerateLast: () => void;
}

export const ChatFeed: React.FC<ChatFeedProps> = ({
  turns,
  isLoading,
  onRegenerateLast,
}) => {
  const bottomRef = useRef<HTMLDivElement>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [turns, isLoading]);

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="w-full flex flex-col gap-6 py-4">
      {turns.map((turn, index) => {
        const isLast = index === turns.length - 1;
        return (
          <div key={turn.id} className="flex flex-col gap-4">
            
            {/* 1. User Message Bubble (Right-aligned) */}
            <div className="max-w-[80%] ml-auto bg-neutral-800 text-neutral-100 rounded-2xl px-4 py-3 text-sm leading-relaxed font-sans shadow-sm">
              {turn.prompt}
            </div>

            {/* 2. SuperGPT Response Message (Left-aligned, borderless) */}
            <div className="w-full flex flex-col gap-1.5 pl-1">
              
              {/* Model Label */}
              <div className="flex items-center gap-2 text-xs text-neutral-400 font-medium">
                <span>SuperGPT</span>
              </div>

              {/* Response Text Content */}
              <div className="font-mono text-sm leading-relaxed text-neutral-200 whitespace-pre-wrap break-words py-1">
                {turn.response}
                {isLast && isLoading && (
                  <span className="inline-block w-2 h-4 ml-1 bg-neutral-400 animate-pulse align-middle" />
                )}
              </div>

              {/* Action Row */}
              <div className="flex items-center gap-3 pt-1 text-xs text-neutral-400">
                <button
                  type="button"
                  onClick={() => handleCopy(turn.id, turn.response)}
                  className="flex items-center gap-1 hover:text-neutral-200 transition-colors py-1"
                >
                  {copiedId === turn.id ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-neutral-200" />
                      <span>Copied</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy</span>
                    </>
                  )}
                </button>

                {isLast && !isLoading && (
                  <button
                    type="button"
                    onClick={onRegenerateLast}
                    className="flex items-center gap-1 hover:text-neutral-200 transition-colors py-1"
                  >
                    <RotateCw className="w-3.5 h-3.5" />
                    <span>Regenerate</span>
                  </button>
                )}
              </div>

            </div>

          </div>
        );
      })}

      {/* Loading Indicator when no turns exist */}
      {isLoading && turns.length === 0 && (
        <div className="flex flex-col gap-1.5 pl-1">
          <div className="text-xs text-neutral-400 font-medium">SuperGPT</div>
          <div className="flex items-center gap-2 text-neutral-400 text-sm font-mono py-2">
            <div className="w-3.5 h-3.5 rounded-full border-2 border-neutral-600 border-t-neutral-200 animate-spin" />
            <span>Generating...</span>
          </div>
        </div>
      )}

      <div ref={bottomRef} />
    </div>
  );
};
