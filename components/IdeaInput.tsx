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

  return (
    <div className="space-y-6">
      {/* Input Field with Generate Button */}
      <form onSubmit={handleSubmit} className="relative">
        <div className="flex items-center gap-2 bg-gray-900/50 border border-primary-500/50 rounded-full px-4 py-3 glow-purple backdrop-blur-sm">
          <svg
            className="w-5 h-5 text-primary-400 flex-shrink-0"
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
          <input
            type="text"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder="What's on your mind?"
            className="flex-1 bg-transparent text-white placeholder-gray-400 outline-none text-lg"
            disabled={loading}
          />
          <button
            type="submit"
            disabled={!topic.trim() || loading}
            className="px-6 py-2 bg-primary-600 hover:bg-primary-700 disabled:bg-gray-700 disabled:cursor-not-allowed text-white rounded-full font-medium transition-all duration-200 disabled:opacity-50"
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
            className="px-4 py-2 bg-gray-800/50 hover:bg-gray-800 text-gray-300 hover:text-white rounded-full text-sm transition-colors border border-gray-700/50"
          >
            {suggestedTopic}
          </button>
        ))}
      </div>
    </div>
  );
}
