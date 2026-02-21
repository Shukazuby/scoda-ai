"use client";

import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Link from "next/link";
import IdeaInput from "@/components/IdeaInput";
import ContentPlansView from "@/components/ContentPlansView";
import { generateIdeas, saveIdea, UnauthorizedError } from "@/lib/api";
import type { IdeaGraph } from "@/types";
import { useAuth } from "@/contexts/AuthContext";
import { X } from "lucide-react";

export default function Home() {
  const [ideas, setIdeas] = useState<IdeaGraph | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [seedsPlanted, setSeedsPlanted] = useState(0);
  const [showUnauthorizedModal, setShowUnauthorizedModal] = useState(false);
  const { user, setUserCredits, openAccountModal } = useAuth();

  useEffect(() => {
    if (showUnauthorizedModal) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [showUnauthorizedModal]);

  const handleGenerateIdeas = async (topic: string) => {
    setLoading(true);
    setError(null);
    try {
      const { graph, remainingCredits } = await generateIdeas(topic);
      setIdeas(graph);
      setSeedsPlanted((prev) => prev + 1);
      if (user) {
        try {
          await saveIdea(topic, graph);
        } catch (saveError) {
          console.warn("Failed to save idea to library:", saveError);
        }
      }
      if (typeof remainingCredits === "number") {
        setUserCredits(remainingCredits);
      }
    } catch (err) {
      if (err instanceof UnauthorizedError) {
        setShowUnauthorizedModal(true);
        return;
      }
      setError(err instanceof Error ? err.message : "Failed to generate ideas");
      console.error("Error generating ideas:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleCultivateMore = () => {
    setIdeas(null);
    setError(null);
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-950 via-purple-950/20 to-gray-950">
      <Navbar credits={user?.credits ?? 0} />

      <div className="container mx-auto px-4 py-8 flex flex-col items-center sm:items-stretch">
        {/* Hero - center on mobile */}
        <div className="w-full max-w-4xl mx-auto mb-12 mt-8 text-center sm:text-left">
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-4">
            Your content planning sanctuary.
          </h1>
          <p className="text-md text-gray-300 max-w-2xl mx-auto sm:mx-0">
            Enter a topic, and get a strategic social media content plan.
          </p>
        </div>

        <div className="w-full max-w-4xl mb-12 mx-auto px-0 sm:-mx-3">
          <IdeaInput
            onGenerate={handleGenerateIdeas}
            loading={loading}
            suggestedTopics={[
              "7‑day Instagram Reels challenge for fitness coaches",
              "House hunting tips for buyers in Abuja",
              "Launching a new collection for a fashion brand",
            ]}
          />
        </div>

        {/* Error - center on mobile */}
        {error && (
          <div className="w-full max-w-4xl mx-auto mb-8 flex justify-center sm:justify-start">
            <div className="w-full bg-red-500/10 border border-red-500/50 rounded-lg p-4 text-red-300 text-center sm:text-left">
              {error}
            </div>
          </div>
        )}

        {/* Content plans - center on mobile */}
        {ideas && (
          <div className="w-full max-w-7xl mx-auto mb-12 flex flex-col items-center">
            <ContentPlansView graphData={ideas} />
          </div>
        )}

        {/* Footer - center on mobile */}
        {ideas && (
          <div className="w-full max-w-4xl mx-auto text-center mt-12 mb-8 flex flex-col items-center">
            <button
              onClick={handleCultivateMore}
              className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white rounded-full font-medium transition-all duration-200"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
              </svg>
              Generate New Content Plan
            </button>
            <p className="text-sm text-gray-400 mt-4">
              {seedsPlanted} CONTENT PLANS CREATED • {user?.credits ?? 0} MORE AVAILABLE
            </p>
          </div>
        )}

        {/* Unauthorized modal */}
        {showUnauthorizedModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowUnauthorizedModal(false)} aria-hidden />
            <div className="relative w-full max-w-sm bg-gray-900 border border-gray-800 rounded-2xl shadow-2xl p-6" role="dialog" aria-modal="true" aria-labelledby="unauthorized-title">
              <div className="flex items-center justify-between mb-4">
                <h2 id="unauthorized-title" className="text-xl font-bold text-white">Unauthorized</h2>
                <button onClick={() => setShowUnauthorizedModal(false)} className="p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg" aria-label="Close">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <p className="text-gray-300 mb-6">Log in or sign up to generate content.</p>
              <div className="flex flex-col sm:flex-row gap-3">
                <button onClick={() => { setShowUnauthorizedModal(false); openAccountModal("login"); }} className="flex-1 px-4 py-2.5 bg-primary-600 hover:bg-primary-700 text-white rounded-lg font-medium">
                  Log in
                </button>
                <button onClick={() => { setShowUnauthorizedModal(false); openAccountModal("signup"); }} className="flex-1 px-4 py-2.5 bg-gray-700 hover:bg-gray-600 text-white rounded-lg font-medium border border-gray-600">
                  Sign up
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Help */}
        <div className="fixed bottom-6 right-6">
          <Link href="/help" className="w-12 h-12 bg-gray-800 hover:bg-gray-700 rounded-full flex items-center justify-center text-white" aria-label="Help">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </Link>
        </div>
      </div>
    </main>
  );
}
