"use client";

import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import { useAuth } from "@/contexts/AuthContext";
import {
  fetchInsightsStats,
  fetchWeeklyActivity,
  fetchCategoryDistribution,
  fetchMostActiveCategories,
  WeeklyActivityPoint,
  CategoryDistribution,
  ActiveCategory,
} from "@/lib/api";

interface StatCardProps {
  title: string;
  value: string | number;
  change?: string;
  icon: React.ReactNode;
  color: "purple" | "blue" | "green" | "orange";
}

function StatCard({ title, value, change, icon, color }: StatCardProps) {
  const colorClasses = {
    purple: "bg-primary-900/30 border-primary-500/50 text-primary-300",
    blue: "bg-blue-900/30 border-blue-500/50 text-blue-300",
    green: "bg-green-900/30 border-green-500/50 text-green-300",
    orange: "bg-orange-900/30 border-orange-500/50 text-orange-300",
  };

  return (
    <div
      className={`${colorClasses[color]} border rounded-lg p-6 backdrop-blur-sm`}
    >
      <div className="flex items-center justify-between mb-4">
        <div className="p-2 bg-white/10 rounded-lg">{icon}</div>
        {change && (
          <span
            className={`text-xs font-medium ${
              change.startsWith("+") ? "text-green-400" : "text-red-400"
            }`}
          >
            {change}
          </span>
        )}
      </div>
      <h3 className="text-2xl font-bold text-white mb-1">{value}</h3>
      <p className="text-sm text-gray-400">{title}</p>
    </div>
  );
}

export default function InsightsPage() {
  const [stats, setStats] = useState({
    totalIdeas: 0,
    totalNodes: 0,
    avgNodesPerIdea: 0,
    mostUsedCategory: "",
    ideasThisWeek: 0,
    creditsUsed: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [categoryDistribution, setCategoryDistribution] = useState<
    (CategoryDistribution & { color: string })[]
  >([]);
  const [weeklyActivity, setWeeklyActivity] = useState<WeeklyActivityPoint[]>(
    []
  );
  const [activeCategories, setActiveCategories] = useState<ActiveCategory[]>(
    []
  );
  const { user } = useAuth();

  useEffect(() => {
    if (!user) {
      setLoading(false);
      setStats({
        totalIdeas: 0,
        totalNodes: 0,
        avgNodesPerIdea: 0,
        mostUsedCategory: "",
        ideasThisWeek: 0,
        creditsUsed: 0,
      });
      setWeeklyActivity([]);
      setCategoryDistribution([]);
      setActiveCategories([]);
      return;
    }

    const loadInsights = async () => {
      setLoading(true);
      setError(null);
      try {
        const [statsData, activityData, categoriesData, activeData] =
          await Promise.all([
            fetchInsightsStats(),
            fetchWeeklyActivity(),
            fetchCategoryDistribution(),
            fetchMostActiveCategories(),
          ]);

        setStats(statsData);
        setWeeklyActivity(activityData);

        const palette = [
          "bg-primary-500",
          "bg-blue-500",
          "bg-green-500",
          "bg-orange-500",
          "bg-pink-500",
          "bg-teal-500",
        ];

        setCategoryDistribution(
          categoriesData.map((cat, index) => ({
            ...cat,
            color: palette[index % palette.length],
          }))
        );

        setActiveCategories(activeData);
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Failed to load insights data"
        );
      } finally {
        setLoading(false);
      }
    };

    void loadInsights();
  }, [user]);

  const maxIdeas =
    weeklyActivity.length > 0
      ? Math.max(...weeklyActivity.map((d) => d.ideas))
      : 1;

  const remainingCredits = Math.max(
    0,
    (user?.credits ?? 0) - stats.creditsUsed
  );

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-950 via-purple-950/20 to-gray-950">
      <Navbar credits={user?.credits ?? 0} />
      
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">
            Insights & Analytics
          </h1>
          <p className="text-lg text-gray-300">
            Track your creative journey and idea generation patterns
          </p>
          {!user && (
            <p className="mt-2 text-sm text-red-300">
              Sign in to see personalized insights based on your idea history.
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

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Total Ideas Generated"
            value={loading ? "..." : stats.totalIdeas}
            change="+12%"
            color="purple"
            icon={
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                />
              </svg>
            }
          />
          <StatCard
            title="Total Nodes Created"
            value={loading ? "..." : stats.totalNodes}
            change="+18%"
            color="blue"
            icon={
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 5a1 1 0 011-1h4a1 1 0 011 1v7a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM14 5a1 1 0 011-1h4a1 1 0 011 1v7a1 1 0 01-1 1h-4a1 1 0 01-1-1V5zM4 16a1 1 0 011-1h4a1 1 0 011 1v3a1 1 0 01-1 1H5a1 1 0 01-1-1v-3zM14 16a1 1 0 011-1h4a1 1 0 011 1v3a1 1 0 01-1 1h-4a1 1 0 01-1-1v-3z"
                />
              </svg>
            }
          />
          <StatCard
            title="Avg Nodes per Idea"
            value={loading ? "..." : stats.avgNodesPerIdea.toFixed(1)}
            change="+0.3"
            color="green"
            icon={
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                />
              </svg>
            }
          />
          <StatCard
            title="Ideas This Week"
            value={loading ? "..." : stats.ideasThisWeek}
            change="+3"
            color="orange"
            icon={
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
            }
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Weekly Activity Chart */}
          <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-lg p-6">
            <h2 className="text-xl font-semibold text-white mb-6">
              Weekly Activity
            </h2>
              <div className="space-y-4">
              {weeklyActivity.map((day, index) => (
                <div key={index} className="flex items-center gap-4">
                  <div className="w-12 text-sm text-gray-400">{day.day}</div>
                  <div className="flex-1 relative">
                    <div className="h-8 bg-gray-800 rounded-lg overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-primary-600 to-primary-400 rounded-lg transition-all duration-500"
                        style={{
                          width: `${(day.ideas / maxIdeas) * 100}%`,
                        }}
                      ></div>
                    </div>
                  </div>
                  <div className="w-8 text-sm text-white font-medium text-right">
                    {day.ideas}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Category Distribution */}
          <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-lg p-6">
            <h2 className="text-xl font-semibold text-white mb-6">
              Category Distribution
            </h2>
            <div className="space-y-4">
              {categoryDistribution.map((category, index) => (
                <div key={index}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-300">
                      {category.name}
                    </span>
                    <span className="text-sm text-gray-400">
                      {category.value}%
                    </span>
                  </div>
                  <div className="h-3 bg-gray-800 rounded-full overflow-hidden">
                    <div
                      className={`h-full ${category.color} rounded-full transition-all duration-500`}
                      style={{ width: `${category.value}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Top Categories */}
          <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-lg p-6">
            <h2 className="text-xl font-semibold text-white mb-6">
              Most Active Categories
            </h2>
            <div className="space-y-4">
              {activeCategories.map((category, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 bg-gray-800/30 rounded-lg hover:bg-gray-800/50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">
                      {index === 0
                        ? "⚡"
                        : index === 1
                        ? "🧘"
                        : index === 2
                        ? "✨"
                        : "💡"}
                    </span>
                    <span className="text-white font-medium">
                      {category.name}
                    </span>
                  </div>
                  <span className="text-primary-400 font-semibold">
                    {category.count}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Usage Summary */}
          <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-lg p-6">
            <h2 className="text-xl font-semibold text-white mb-6">
              Usage Summary
            </h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-gray-800/30 rounded-lg">
                <div>
                  <p className="text-gray-400 text-sm">Credits Used</p>
                  <p className="text-white text-2xl font-bold">
                    {stats.creditsUsed}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-gray-400 text-sm">Credits Remaining</p>
                  <p className="text-primary-400 text-2xl font-bold">
                    {remainingCredits}
                  </p>
                </div>
              </div>
              <div className="p-4 bg-gray-800/30 rounded-lg">
                <p className="text-gray-400 text-sm mb-2">Most Active Day</p>
                <p className="text-white text-lg font-semibold">Friday</p>
                <p className="text-gray-500 text-xs mt-1">
                  You generate most ideas on Fridays
                </p>
              </div>
              <div className="p-4 bg-gray-800/30 rounded-lg">
                <p className="text-gray-400 text-sm mb-2">Favorite Category</p>
                <p className="text-white text-lg font-semibold">
                  {stats.mostUsedCategory}
                </p>
                <p className="text-gray-500 text-xs mt-1">
                  Your most explored topic area
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
