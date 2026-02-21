
import axios, { AxiosError } from "axios";
import type { IdeaGraph, GenerateIdeasResponse } from "@/types";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

if (typeof window !== "undefined" && process.env.NODE_ENV === "development") {
}

interface BackendErrorPayload {
  statusCode: number;
  message: string | string[];
  error: string;
  path?: string;
  timestamp?: string;
}

export interface AuthResponse {
  user: {
    _id: string;
    name: string;
    email: string;
    credits?: number;
  };
  token: string;
}

export interface IdeaSummary {
  id: string;
  topic: string;
  graph: IdeaGraph;
  createdAt: string;
  updatedAt: string;
}

export interface InsightsStats {
  totalIdeas: number;
  totalNodes: number;
  avgNodesPerIdea: number;
  mostUsedCategory: string;
  ideasThisWeek: number;
  creditsUsed: number;
  remainingCredits: number;
}

export interface WeeklyActivityPoint {
  day: string;
  ideas: number;
}

export interface CategoryDistribution {
  name: string;
  value: number;
  count: number;
}

export interface ActiveCategory {
  name: string;
  count: number;
}

let authToken: string | null = null;

const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 30000, // 30 seconds timeout for AI generation
});

apiClient.interceptors.request.use((config) => {
  if (authToken) {
    config.headers = config.headers ?? {};
    config.headers.Authorization = `Bearer ${authToken}`;
  }
  return config;
});

export function setAuthToken(token: string | null) {
  authToken = token;
}

export class UnauthorizedError extends Error {
  constructor(message = "Please sign in to continue.") {
    super(message);
    this.name = "UnauthorizedError";
    Object.setPrototypeOf(this, UnauthorizedError.prototype);
  }
}

function extractErrorMessage(error: AxiosError<BackendErrorPayload>): string {
  const payload = error.response?.data;
  if (!payload) {
    return error.message;
  }

  if (Array.isArray(payload.message)) {
    return payload.message.join("; ");
  }

  return payload.message || payload.error || error.message;
}

function handleApiError(error: unknown, defaultMessage: string): never {
  if (axios.isAxiosError<BackendErrorPayload>(error)) {
    // Network errors (backend not reachable)
    if (error.code === "ERR_NETWORK" || error.message === "Network Error") {
      throw new Error(
        `${defaultMessage}: Server is not reachable. Try again.`
      );
    }

    // Request was made but server responded with error
    if (error.response) {
      const message = extractErrorMessage(error);
      throw new Error(`${defaultMessage}: ${message}`);
    }

    // Request was made but no response received
    if (error.request) {
      throw new Error(
        `${defaultMessage}: No response from server. Try again.`
      );
    }

    // Something else happened
    throw new Error(`${defaultMessage}: ${error.message}`);
  }

  if (error instanceof Error) {
    throw new Error(`${defaultMessage}: ${error.message}`);
  }

  throw new Error(defaultMessage);
}

// ---------- AUTH ----------

export async function apiSignup(
  name: string,
  email: string,
  password: string
): Promise<AuthResponse> {
  try {
    const { data } = await apiClient.post<AuthResponse>("/auth/signup", {
      name,
      email,
      password,
    });
    return data;
  } catch (error) {
    handleApiError(error, "Signup failed");
  }
}

export async function apiLogin(
  email: string,
  password: string
): Promise<AuthResponse> {
  try {
    const { data } = await apiClient.post<AuthResponse>("/auth/login", {
      email,
      password,
    });
    return data;
  } catch (error) {
    handleApiError(error, "Login failed");
  }
}

export async function apiGetCurrentUser() {
  try {
    const { data } = await apiClient.get("/auth/me");
    return data as {
      _id: string;
      name: string;
      email: string;
      credits?: number;
    };
  } catch (error) {
    handleApiError(error, "Failed to fetch current user");
  }
}

export async function apiUpdateProfile(name: string, email: string) {
  try {
    const { data } = await apiClient.put("/auth/profile", { name, email });
    return data as {
      _id: string;
      name: string;
      email: string;
      credits?: number;
    };
  } catch (error) {
    handleApiError(error, "Failed to update profile");
  }
}

export async function apiLogout(): Promise<void> {
  try {
    await apiClient.post("/auth/logout");
  } catch (error) {
    // Logout failures shouldn't block local cleanup; log and swallow.
    if (axios.isAxiosError(error)) {
      console.warn("Logout request failed:", extractErrorMessage(error));
    } else {
      console.warn("Logout request failed:", error);
    }
  }
}

/** Permanently delete the current user account. Clears auth token after success. */
export async function apiDeleteAccount(): Promise<void> {
  try {
    await apiClient.delete("/auth/account");
  } catch (error) {
    handleApiError(error, "Failed to delete account");
  } finally {
    setAuthToken(null);
  }
}

// ---------- IDEAS ----------

/**
 * Generate ideas from a topic string.
 * Requires the user to be authenticated (backend enforces JWT).
 */
export async function generateIdeas(topic: string): Promise<{
  graph: IdeaGraph;
  remainingCredits?: number;
}> {
  try {
    const response = await apiClient.post<GenerateIdeasResponse>(
      "/generate-ideas",
      { topic }
    );

    return {
      graph: response.data.graph,
      remainingCredits: response.data.remainingCredits,
    };
  } catch (error) {
    if (
      axios.isAxiosError(error) &&
      error.response?.status === 401
    ) {
      throw new UnauthorizedError(
        typeof error.response?.data?.message === "string"
          ? error.response.data.message
          : "Please sign in to generate content."
      );
    }
    handleApiError(error, "Failed");
  }
}

export async function saveIdea(
  topic: string,
  graph: IdeaGraph
): Promise<IdeaSummary> {
  try {
    const { data } = await apiClient.post("/ideas", {
      topic,
      nodes: graph.nodes,
      edges: graph.edges,
      metadata: graph.metadata,
    });

    return {
      id: data._id || data.id,
      topic: data.topic,
      graph: {
        nodes: data.nodes,
        edges: data.edges,
        metadata: data.metadata,
      },
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
    };
  } catch (error) {
    handleApiError(error, "Failed to save idea");
  }
}

export async function fetchIdeas(): Promise<IdeaSummary[]> {
  try {
    const { data } = await apiClient.get<IdeaSummary[]>("/ideas");
    return data.map((idea) => ({
      ...idea,
      graph: {
        ...idea.graph,
      },
    }));
  } catch (error) {
    handleApiError(error, "Failed to load ideas");
  }
}

export async function deleteIdea(id: string): Promise<void> {
  try {
    await apiClient.delete(`/ideas/${id}`);
  } catch (error) {
    handleApiError(error, "Failed to delete idea");
  }
}

export async function refineIdea(id: string): Promise<IdeaSummary> {
  try {
    const { data } = await apiClient.post(`/ideas/${id}/refine`);
    return {
      id: data._id || data.id,
      topic: data.topic,
      graph: {
        nodes: data.nodes,
        edges: data.edges,
        metadata: data.metadata,
      },
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
    };
  } catch (error) {
    handleApiError(error, "Failed to refine idea");
  }
}

// ---------- INSIGHTS ----------

export async function fetchInsightsStats(): Promise<InsightsStats> {
  try {
    const { data } = await apiClient.get<InsightsStats>("/insights/stats");
    return data;
  } catch (error) {
    handleApiError(error, "Failed to load insights stats");
  }
}

export async function fetchWeeklyActivity(): Promise<WeeklyActivityPoint[]> {
  try {
    const { data } = await apiClient.get<WeeklyActivityPoint[]>(
      "/insights/activity"
    );
    return data;
  } catch (error) {
    handleApiError(error, "Failed to load weekly activity");
  }
}

export async function fetchCategoryDistribution(): Promise<
  CategoryDistribution[]
> {
  try {
    const { data } = await apiClient.get<CategoryDistribution[]>(
      "/insights/categories"
    );
    return data;
  } catch (error) {
    handleApiError(error, "Failed to load category distribution");
  }
}

export async function fetchMostActiveCategories(): Promise<ActiveCategory[]> {
  try {
    const { data } = await apiClient.get<ActiveCategory[]>(
      "/insights/most-active"
    );
    return data;
  } catch (error) {
    handleApiError(error, "Failed to load most active categories");
  }
}

// ---------- HEALTH ----------

/**
 * Health check endpoint to verify backend connesctivity.
 */
export async function healthCheck(): Promise<boolean> {
  try {
    await apiClient.get("/health");
    return true;
  } catch {
    return false;
  }
}

