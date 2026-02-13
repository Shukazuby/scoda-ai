/**
 * Type definitions for Scoda AI application
 */

export interface IdeaNode {
  id: string;
  label: string;
  type: "main" | "sub" | "related";
  description?: string;
  category?: string;
  // Content plan specific fields
  platform?: string; // Instagram, TikTok, YouTube, LinkedIn, Twitter/X
  format?: string; // Reel, Post, Story, Carousel, Video, Short, Thread, etc.
  hook?: string; // Attention-grabbing opening line
  keyPoints?: string[]; // Array of key talking points
  hashtags?: string[]; // Array of relevant hashtags
  postingTime?: string; // Suggested best time to post
  engagementStrategy?: string; // How to encourage engagement
   script?: string; // Optional script or outline
   caption?: string; // Optional caption text
  metadata?: Record<string, any>;
}

export interface IdeaEdge {
  id: string;
  source: string;
  target: string;
  type: "hierarchical" | "related" | "suggested";
  weight?: number;
}

export interface IdeaGraph {
  nodes: IdeaNode[];
  edges: IdeaEdge[];
  metadata?: {
    topic: string;
    generatedAt: string;
    version?: string;
  };
}

export interface GenerateIdeasResponse {
  graph: IdeaGraph;
  creditsUsed?: number;
  remainingCredits?: number;
}
