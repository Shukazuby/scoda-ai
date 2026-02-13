"use client";

import Navbar from "@/components/Navbar";
import { useAuth } from "@/contexts/AuthContext";
import Link from "next/link";

export default function HelpPage() {
  const { user } = useAuth();

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-950 via-purple-950/20 to-gray-950">
      <Navbar credits={user?.credits ?? 0} />

      <div className="container mx-auto px-4 py-10 max-w-5xl">
        <header className="mb-10">
          <p className="text-sm font-medium text-primary-300 mb-2">
            Need a hand?
          </p>
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-3">
            How to use Scoda AI
          </h1>
          <p className="text-gray-300 max-w-2xl">
            This page walks you through how the generator, credits, library, and
            insights work so you can get the most out of your content plans.
          </p>
        </header>

        <section className="grid gap-6 md:grid-cols-2 mb-10">
          <div className="bg-gray-900/60 border border-gray-800 rounded-xl p-5">
            <h2 className="text-lg font-semibold text-white mb-2">
              1. Generate a content plan
            </h2>
            <p className="text-sm text-gray-300 mb-3">
              Go to the{" "}
              <Link
                href="/"
                className="text-primary-300 hover:text-primary-200 underline"
              >
                Generator
              </Link>{" "}
              tab and enter a topic (e.g. &quot;Instagram growth for real
              estate agents&quot;).
            </p>
            <ul className="text-sm text-gray-300 space-y-1.5 list-disc list-inside">
              <li>Scoda creates ~1 week of posts across platforms.</li>
              <li>
                Each card includes platform, format, hook, script / caption,
                and hashtags.
              </li>
              <li>
                Video / reel ideas include an example script and shot
                breakdown.
              </li>
            </ul>
          </div>

          <div className="bg-gray-900/60 border border-gray-800 rounded-xl p-5">
            <h2 className="text-lg font-semibold text-white mb-2">
              2. Credits & limits
            </h2>
            <p className="text-sm text-gray-300 mb-3">
              Each generation uses <span className="font-semibold">1</span>{" "}
              credit. New accounts start with{" "}
              <span className="font-semibold">10</span> credits.
            </p>
            <ul className="text-sm text-gray-300 space-y-1.5 list-disc list-inside">
              <li>Your current credits are shown in the top-right Navbar.</li>
              <li>At 0 credits you can still view your library and insights.</li>
            </ul>
          </div>
        </section>

        <section className="mb-10 grid gap-6 md:grid-cols-2">
          <div className="bg-gray-900/60 border border-gray-800 rounded-xl p-5">
            <h2 className="text-lg font-semibold text-white mb-2">
              3. Library & deleting plans
            </h2>
            <p className="text-sm text-gray-300 mb-3">
              The{" "}
              <Link
                href="/library"
                className="text-primary-300 hover:text-primary-200 underline"
              >
                Library
              </Link>{" "}
              shows all content plans you’ve saved while logged in.
            </p>
            <ul className="text-sm text-gray-300 space-y-1.5 list-disc list-inside">
              <li>Click a saved topic on the left to view its plans.</li>
              <li>
                Use the trash icon to delete
              </li>
              <li>Deleted plans are removed from your library immediately.</li>
            </ul>
          </div>

          <div className="bg-gray-900/60 border border-gray-800 rounded-xl p-5">
            <h2 className="text-lg font-semibold text-white mb-2">
              4. Insights & analytics
            </h2>
            <p className="text-sm text-gray-300 mb-3">
              The{" "}
              <Link
                href="/insights"
                className="text-primary-300 hover:text-primary-200 underline"
              >
                Insights
              </Link>{" "}
              tab summarizes how you’ve been using Scoda.
            </p>
            <ul className="text-sm text-gray-300 space-y-1.5 list-disc list-inside">
              <li>Total ideas and nodes generated.</li>
              <li>Ideas created this week and your most active days.</li>
              <li>Top categories and credits used / remaining.</li>
            </ul>
          </div>
        </section>

        <section className="mb-10">
          <h2 className="text-lg font-semibold text-white mb-3">
            Tips for better results
          </h2>
          <div className="bg-gray-900/60 border border-gray-800 rounded-xl p-5 space-y-2 text-sm text-gray-300">
            <p>
              • Be specific with topics (&quot;7‑day Instagram Reels challenge
              for fitness coaches&quot; beats &quot;Instagram&quot;).
            </p>
            <p>
              • Regenerate with slightly different angles (e.g. &quot;only
              story ideas&quot;, &quot;UGC‑style hooks&quot;).
            </p>
            <p>
              • Treat scripts as a starting point and add your own voice and
              examples.
            </p>
          </div>
        </section>

        <section className="mb-4">
          <h2 className="text-lg font-semibold text-white mb-2">
            Still stuck?
          </h2>
          <p className="text-sm text-gray-300">
            If something feels off (errors, weird ideas, or UI issues), you can
            regenerate, tweak your topic, or refresh the page. You can also
            keep using the Library and Insights pages even when credits hit 0.
          </p>
        </section>
      </div>
    </main>
  );
}

