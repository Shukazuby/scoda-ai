"use client";

import type { IdeaNode } from "@/types";

interface ContentPlanCardProps {
  plan: IdeaNode;
  onRefine?: () => void;
}

export default function ContentPlanCard({ plan, onRefine }: ContentPlanCardProps) {
  const getPlatformIcon = (platform?: string) => {
    if (!platform) return "📱";
    const platformLower = platform.toLowerCase();
    if (platformLower.includes("instagram")) return "📷";
    if (platformLower.includes("tiktok")) return "🎵";
    if (platformLower.includes("youtube")) return "▶️";
    if (platformLower.includes("linkedin")) return "💼";
    if (platformLower.includes("twitter") || platformLower.includes("x")) return "🐦";
    return "📱";
  };

  const platformTypeBadge = () => {
    const parts: string[] = [];
    if (plan.platform) parts.push(plan.platform);
    if (plan.format) parts.push(plan.format);
    return parts.join(" • ") || "Content Idea";
  };

  const isVideoFormat =
    !!plan.format && /video|short|story|reel/i.test(plan.format);

  return (
    <div className="relative flex flex-col bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-[0_18px_45px_rgba(15,23,42,0.15)] hover:border-primary-400/60 hover:shadow-[0_22px_60px_rgba(59,130,246,0.25)] transition-all duration-200">
      {/* Top accent bar */}
      <div className="h-1 w-full bg-gradient-to-r from-primary-500 via-fuchsia-500 to-amber-400" />

      {/* Header */}
      <div className="px-4 pt-4 pb-3 flex items-start justify-between gap-3">
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-50 text-xl">
            <span>{getPlatformIcon(plan.platform)}</span>
          </div>
          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-primary-50 text-primary-700 border border-primary-200">
                {platformTypeBadge()}
              </span>
              {plan.category && (
                <span className="px-2 py-1 rounded-full text-[11px] font-medium bg-gray-100 text-gray-700 border border-gray-200">
                  {plan.category}
                </span>
              )}
              {isVideoFormat && (
                <span className="px-2 py-1 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                  🎬 Video / Reel
                </span>
              )}
            </div>
            <h3 className="text-base md:text-lg font-semibold text-slate-900 leading-snug">
              {plan.label}
            </h3>
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="px-4 pb-4 pt-1 space-y-4 text-sm">
        {/* Hook */}
        {plan.hook && (
          <div className="rounded-xl border border-primary-200 bg-primary-50 px-3 py-2">
            <p className="text-xs font-semibold uppercase tracking-wide text-primary-700 mb-1">
              Hook
            </p>
            <p className="text-sm text-primary-900 italic">“{plan.hook}”</p>
          </div>
        )}

        {/* Description */}
        {plan.description && (
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-gray-500 mb-1">
              Content idea
            </p>
            <p className="text-sm text-gray-800 leading-relaxed">
              {plan.description}
            </p>
          </div>
        )}

        {/* Script / Caption */}
        {(plan.script || plan.caption) && (
          <div className="grid gap-3 md:grid-cols-2">
            {plan.script && (
              <div className="rounded-xl bg-gray-50 border border-gray-200 p-3">
                <p className="text-[11px] font-semibold uppercase tracking-wide text-gray-500 mb-1 flex items-center gap-1">
                  <span>{isVideoFormat ? "Example video script" : "Script / Outline"}</span>
                </p>
                <pre className="text-xs text-gray-800 whitespace-pre-wrap max-h-40 overflow-y-auto leading-relaxed">
                  {plan.script}
                </pre>
              </div>
            )}
            {plan.caption && (
              <div className="rounded-xl bg-gray-50 border border-gray-200 p-3">
                <p className="text-[11px] font-semibold uppercase tracking-wide text-gray-500 mb-1">
                  Caption suggestion
                </p>
                <p className="text-xs text-gray-800 whitespace-pre-wrap max-h-32 overflow-y-auto leading-relaxed">
                  {plan.caption}
                </p>
              </div>
            )}
          </div>
        )}

        {/* Key Points & Hashtags */}
        {(plan.keyPoints && plan.keyPoints.length > 0) ||
        (plan.hashtags && plan.hashtags.length > 0) ? (
          <div className="grid gap-3 md:grid-cols-2">
            {plan.keyPoints && plan.keyPoints.length > 0 && (
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-wide text-gray-500 mb-1">
                  Key talking points
                </p>
                <ul className="space-y-1.5">
                  {plan.keyPoints.map((point, index) => (
                    <li
                      key={index}
                      className="flex items-start gap-2 text-xs text-gray-800"
                    >
                      <span className="mt-[3px] h-1.5 w-1.5 rounded-full bg-primary-400" />
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {plan.hashtags && plan.hashtags.length > 0 && (
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-wide text-gray-500 mb-1">
                  Hashtags
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {plan.hashtags.map((tag, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 bg-gray-100 border border-gray-200 text-[11px] text-gray-800 rounded-full hover:border-primary-500/60 hover:text-primary-700 transition-colors"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : null}

        {/* Meta: time & engagement */}
        {(plan.postingTime || plan.engagementStrategy) && (
          <div className="flex flex-wrap gap-4 pt-2 border-t border-gray-200 mt-1">
            {plan.postingTime && (
              <div className="flex items-center gap-2 text-xs text-gray-700">
                <span>📅</span>
                <div>
                  <p className="font-semibold text-gray-900">Best time</p>
                  <p className="text-gray-500">{plan.postingTime}</p>
                </div>
              </div>
            )}
            {plan.engagementStrategy && (
              <div className="flex items-center gap-2 text-xs text-gray-700">
                <span>💬</span>
                <div>
                  <p className="font-semibold text-gray-900">Engagement</p>
                  <p className="text-gray-500">{plan.engagementStrategy}</p>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Actions */}
      {onRefine && (
        <div className="px-4 py-3 border-t border-gray-200 bg-gray-50">
          {/* <button
            onClick={onRefine}
            className="w-full px-4 py-2.5 bg-primary-600 hover:bg-primary-500 text-white rounded-lg text-sm font-medium transition-colors"
          >
            Refine this plan
          </button> */}
        </div>
      )}
    </div>
  );
}
