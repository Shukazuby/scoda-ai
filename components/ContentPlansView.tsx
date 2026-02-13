"use client";

import { useState } from "react";
import ContentPlanCard from "./ContentPlanCard";
import type { IdeaGraph } from "@/types";

interface ContentPlansViewProps {
  graphData: IdeaGraph;
  onRefine?: (planId: string) => void;
}

export default function ContentPlansView({
  graphData,
  onRefine,
}: ContentPlansViewProps) {
  const [selectedType, setSelectedType] = useState<"all" | "main" | "sub" | "related">("all");

  // Group plans by type
  const mainPlans = graphData.nodes.filter((n) => n.type === "main");
  const subPlans = graphData.nodes.filter((n) => n.type === "sub");
  const relatedPlans = graphData.nodes.filter((n) => n.type === "related");

  const filteredPlans =
    selectedType === "all"
      ? graphData.nodes
      : graphData.nodes.filter((n) => n.type === selectedType);

  return (
    <div className="space-y-6">
      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2">
        <button
          onClick={() => setSelectedType("all")}
          className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
            selectedType === "all"
              ? "bg-primary-600 text-white"
              : "bg-gray-800 text-gray-300 hover:bg-gray-700"
          }`}
        >
          All Plans ({graphData.nodes.length})
        </button>
        {/* <button
          onClick={() => setSelectedType("main")}
          className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
            selectedType === "main"
              ? "bg-primary-600 text-white"
              : "bg-gray-800 text-gray-300 hover:bg-gray-700"
          }`}
        >
          Pillars ({mainPlans.length})
        </button> */}
        {/* <button
          onClick={() => setSelectedType("sub")}
          className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
            selectedType === "sub"
              ? "bg-primary-600 text-white"
              : "bg-gray-800 text-gray-300 hover:bg-gray-700"
          }`}
        >
          Content Plans ({subPlans.length})
        </button>
        <button
          onClick={() => setSelectedType("related")}
          className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
            selectedType === "related"
              ? "bg-primary-600 text-white"
              : "bg-gray-800 text-gray-300 hover:bg-gray-700"
          }`}
        >
          Related ({relatedPlans.length})
        </button> */}
      </div>

      {/* Content Plans Grid */}
      {filteredPlans.length === 0 ? (
        <div className="text-center py-12 bg-gray-900/50 rounded-lg border border-gray-800">
          <p className="text-gray-400">No content plans found for this filter.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPlans.map((plan) => (
            <ContentPlanCard
              key={plan.id}
              plan={plan}
              onRefine={onRefine ? () => onRefine(plan.id) : undefined}
            />
          ))}
        </div>
      )}

      {/* Summary Stats */}
      <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-lg p-4">
        {/* <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <div>
            <div className="text-2xl font-bold text-white">{mainPlans.length}</div>
            <div className="text-xs text-gray-400 uppercase">Content Pillars</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-white">{subPlans.length}</div>
            <div className="text-xs text-gray-400 uppercase">Content Plans</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-white">{relatedPlans.length}</div>
            <div className="text-xs text-gray-400 uppercase">Related Ideas</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-white">{graphData.edges.length}</div>
            <div className="text-xs text-gray-400 uppercase">Connections</div>
          </div>
        </div> */}
      </div>
    </div>
  );
}
