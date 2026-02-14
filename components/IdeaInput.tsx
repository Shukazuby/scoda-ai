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

  const handleSuggestedTopicClick = (suggestedTopic: string) => {
    setTopic(suggestedTopic);
  };

  const submitIfValid = () => {
    if (topic.trim() && !loading) {
      onGenerate(topic.trim()).then(() => setTopic(""));
    }
  };

  return (
    <div className="space-y-6">
      {/* Input Field with Generate Button */}
      <form onSubmit={handleSubmit} className="relative w-full">
        <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-3 bg-gray-900/50 border border-primary-500/50 rounded-2xl sm:rounded-full px-6 py-5 sm:px-5 sm:py-4 glow-purple backdrop-blur-sm overflow-hidden min-h-[6rem] sm:min-h-[4.5rem] w-full max-w-full">
          <div className="flex items-start sm:items-center gap-3 flex-1 min-w-0 w-full">
            <svg
              className="w-5 h-5 text-primary-400 flex-shrink-0 mt-0.5 sm:mt-0"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"
              />
            </svg>
            <textarea
              rows={1}
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  submitIfValid();
                }
              }}
              placeholder="What's on your mind?"
              className="flex-1 min-w-0 w-full bg-transparent text-white placeholder-gray-400 outline-none text-base sm:text-lg resize-none min-h-[3.5rem] max-h-40 py-2 break-words"
              disabled={loading}
            />
          </div>
          <button
            type="submit"
            disabled={!topic.trim() || loading}
            className="w-full sm:w-auto flex-shrink-0 px-6 py-3 sm:py-2.5 bg-primary-600 hover:bg-primary-700 disabled:bg-gray-700 disabled:cursor-not-allowed text-white rounded-full font-medium transition-all duration-200 disabled:opacity-50 whitespace-normal text-center break-words"
          >
            {loading ? "Generating..." : "Generate"}
          </button>
        </div>
      </form>

      {/* Suggested Topics */}
      <div className="flex flex-wrap items-center justify-center gap-3">
        {suggestedTopics.map((suggestedTopic, index) => (
          <button
            key={index}
            onClick={() => handleSuggestedTopicClick(suggestedTopic)}
            className="px-4 py-2 bg-gray-800/50 hover:bg-gray-800 text-gray-300 hover:text-white rounded-full text-sm transition-colors border border-gray-700/50 text-left break-words max-w-full"
          >
            {suggestedTopic}
          </button>
        ))}
      </div>
    </div>
  );
}
