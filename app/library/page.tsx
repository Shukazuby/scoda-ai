"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import ContentPlansView from "@/components/ContentPlansView";
import type { IdeaGraph } from "@/types";
import { useAuth } from "@/contexts/AuthContext";
import { fetchIdeas, deleteIdea, refineIdea, IdeaSummary } from "@/lib/api";

interface SavedIdea {
  id: string;
  topic: string;
  graph: IdeaGraph;
  createdAt: string;
  updatedAt: string;
}

export default function LibraryPage() {
  const [savedIdeas, setSavedIdeas] = useState<SavedIdea[]>([]);
  const [selectedIdea, setSelectedIdea] = useState<SavedIdea | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    // If user is not authenticated, don't attempt to load ideas.
    if (!user) {
      setSavedIdeas([]);
      setSelectedIdea(null);
      setLoading(false);
      return;
    }

    const loadIdeas = async () => {
      setLoading(true);
      setError(null);
      try {
        const ideas = await fetchIdeas();
        const mapped: SavedIdea[] = ideas.map((idea: IdeaSummary) => ({
          id: idea.id,
          topic: idea.topic,
          graph: idea.graph,
          createdAt: idea.createdAt,
          updatedAt: idea.updatedAt,
        }));
        setSavedIdeas(mapped);
        if (mapped.length > 0) {
          setSelectedIdea(mapped[0]);
        }
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to load your ideas"
        );
      } finally {
        setLoading(false);
      }
    };

    void loadIdeas();
  }, [user]);

  const handleDeleteIdea = async (id: string) => {
    try {
      await deleteIdea(id);
      setSavedIdeas((prev) => prev.filter((idea) => idea.id !== id));
      if (selectedIdea?.id === id) {
        setSelectedIdea(null);
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to delete the idea"
      );
    }
  };

  const handleRefineIdea = async (idea: SavedIdea) => {
    try {
      const refined = await refineIdea(idea.id);
      const updated: SavedIdea = {
        id: refined.id,
        topic: refined.topic,
        graph: refined.graph,
        createdAt: refined.createdAt,
        updatedAt: refined.updatedAt,
      };

      setSavedIdeas((prev) =>
        prev.map((i) => (i.id === updated.id ? updated : i))
      );
      setSelectedIdea(updated);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to refine the idea"
      );
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-950 via-purple-950/20 to-gray-950">
      <Navbar credits={user?.credits ?? 0} />
      
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">
            Your Content Plan Library
          </h1>
          <p className="text-lg text-gray-300">
            Browse and manage your saved content plans
          </p>
          {!user && (
            <p className="mt-2 text-sm text-red-300">
              You need to sign in to save and view your ideas.
            </p>
          )}
        </div>

        {error && (
          <div className="mb-6 max-w-xl">
            <div className="bg-red-500/10 border border-red-500/50 rounded-lg p-3 text-sm text-red-200">
              {error}
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Sidebar - Saved Ideas List */}
          <div className="lg:col-span-1">
            <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-lg p-4">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-white">
                  Saved Content Plans ({savedIdeas.length})
                </h2>
                <Link
                  href="/"
                  className="text-primary-400 hover:text-primary-300 text-sm font-medium"
                >
                  + New
                </Link>
              </div>

              {loading ? (
                <div className="space-y-3">
                  {[1, 2, 3].map((i) => (
                    <div
                      key={i}
                      className="h-20 bg-gray-800/50 rounded-lg animate-pulse"
                    ></div>
                  ))}
                </div>
              ) : !user ? (
                <div className="text-center py-12">
                  <p className="text-gray-400 mb-4">
                    Sign in to start saving ideas to your library.
                  </p>
                  <p className="text-gray-500 text-sm">
                    Use the account button in the top right to create an
                    account or log in.
                  </p>
                </div>
              ) : savedIdeas.length === 0 ? (
                <div className="text-center py-12">
                  <svg
                    className="w-16 h-16 text-gray-600 mx-auto mb-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                  <p className="text-gray-400 mb-4">No saved content plans yet</p>
                  <Link
                    href="/"
                    className="inline-block px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-full text-sm font-medium transition-colors"
                  >
                    Create Your First Content Plan
                  </Link>
                </div>
              ) : (
                <div className="space-y-3">
                  {savedIdeas.map((idea) => (
                    <div
                      key={idea.id}
                      onClick={() => setSelectedIdea(idea)}
                      className={`p-4 rounded-lg border cursor-pointer transition-all ${
                        selectedIdea?.id === idea.id
                          ? "bg-primary-900/30 border-primary-500 glow-purple"
                          : "bg-gray-800/30 border-gray-700 hover:border-gray-600"
                      }`}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="text-white font-medium text-sm">
                          {idea.topic}
                        </h3>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteIdea(idea.id);
                          }}
                          className="text-gray-400 hover:text-red-400 transition-colors"
                          aria-label="Delete idea"
                        >
                          <svg
                            className="w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                            />
                          </svg>
                        </button>
                      </div>
                      <div className="flex items-center justify-between text-xs text-gray-400">
                        <span>{idea.graph.nodes.length} content plans</span>
                        <span>{formatDate(idea.createdAt)}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Main Content - Graph Visualization */}
          <div className="lg:col-span-2">
            {selectedIdea ? (
              <div className="space-y-4">
                <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-lg p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h2 className="text-2xl font-bold text-white mb-1">
                        {selectedIdea.topic}
                      </h2>
                      <p className="text-sm text-gray-400">
                        Created {formatDate(selectedIdea.createdAt)} • Updated{" "}
                        {formatDate(selectedIdea.updatedAt)}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      {/* <button className="px-4 py-2 bg-white text-gray-900 rounded-lg hover:bg-gray-100 text-sm font-medium transition-colors">
                        Export
                      </button>
                      <button
                        onClick={() => handleRefineIdea(selectedIdea)}
                        className="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg text-sm font-medium transition-colors"
                      >
                        Refine
                      </button> */}
                    </div>
                  </div>
                </div>
                <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-lg p-4">
                  <ContentPlansView 
                    graphData={selectedIdea.graph}
                    onRefine={(planId) => {
                      // Handle refine for specific plan if needed
                      console.log("Refine plan:", planId);
                    }}
                  />
                </div>
              </div>
            ) : (
              <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-lg p-12 text-center">
                <svg
                  className="w-24 h-24 text-gray-600 mx-auto mb-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
                <h3 className="text-xl font-semibold text-white mb-2">
                  Select a content plan to view
                </h3>
                <p className="text-gray-400 mb-6">
                  Choose a content plan from the sidebar to see its visualization
                </p>
                <Link
                  href="/"
                  className="inline-block px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white rounded-full font-medium transition-colors"
                >
                  Create New Content Plan
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
