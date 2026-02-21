"use client";

import { useState } from "react";

interface IdeaInputProps {
  onGenerate: (topic: string) => Promise<void>;
  loading: boolean;
  suggestedTopics: string[];
}

export default function IdeaInput({
  onGenerate,
  loading,
  suggestedTopics,
}: IdeaInputProps) {
  const [topic, setTopic] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (topic.trim() && !loading) {
      await onGenerate(topic.trim());
      setTopic("");
    }
  };

  return (
    <div className="w-full max-w-full space-y-5">
      <form onSubmit={handleSubmit} className="relative w-full" aria-label="Generate content ideas">
        <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 bg-gray-900/60 border border-primary-500/40 rounded-2xl sm:rounded-full px-4 py-6 md:py-6 lg:px-6 lg:py-4 lg:min-h-[5.5rem] shadow-lg shadow-primary-950/20 backdrop-blur-md overflow-hidden min-h-[8rem] md:min-h-[9rem] w-full max-w-full">
          <div className="flex items-center gap-3 flex-1 min-w-0 w-full min-h-[5rem] md:min-h-[6rem] lg:min-h-[3.5rem]">
            <span className="flex h-10 w-10 sm:h-9 sm:w-9 lg:h-10 lg:w-10 shrink-0 items-center justify-center rounded-xl bg-primary-500/20 text-primary-400 ring-1 ring-primary-500/30">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
              </svg>
            </span>
            <textarea
              rows={1}
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  if (topic.trim() && !loading) onGenerate(topic.trim()).then(() => setTopic(""));
                }
              }}
              placeholder="Enter a topic—e.g. Instagram reels for fitness, launch tips…"
              className="flex-1 min-w-0 w-full bg-transparent text-white placeholder-gray-500 outline-none text-[15px] sm:text-base resize-none min-h-[5rem] md:min-h-[6rem] lg:min-h-[3.5rem] max-h-56 py-2 break-words leading-relaxed"
              disabled={loading}
              aria-label="Topic or content idea"
            />
          </div>
          <button
            type="submit"
            disabled={!topic.trim() || loading}
            className="w-full sm:w-auto shrink-0 h-9 py-2 sm:h-10 sm:py-0 px-4 sm:px-6 rounded-full bg-primary-500 hover:bg-primary-400 disabled:bg-gray-800 disabled:text-gray-500 disabled:cursor-not-allowed text-white font-semibold text-xs sm:text-sm transition-all duration-200"
          >
            {loading ? "Generating…" : "Generate"}
          </button>
        </div>
      </form>
      {suggestedTopics.length > 0 && (
        <div className="space-y-2 flex flex-col items-center sm:block">
          <p className="text-xs font-medium uppercase tracking-wider text-gray-500 text-center sm:text-left">Try a suggestion</p>
          <div className="flex flex-wrap items-center justify-center gap-2">
            {suggestedTopics.map((suggestedTopic, index) => (
              <button
                key={index}
                type="button"
                onClick={() => setTopic(suggestedTopic)}
                className="px-4 py-2 rounded-full text-sm text-gray-300 bg-gray-800/60 hover:bg-gray-700/80 hover:text-white border border-gray-700/60 hover:border-gray-600 transition-colors text-center"
              >
                {suggestedTopic}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
