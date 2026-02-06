import { Task, User, TaskCompletionResponse } from "./types";

const API_BASE_URL = process.env.API_BASE_URL || "http://localhost:8000";

// Helper to get cookies for API requests
async function apiFetch(
  endpoint: string,
  options: RequestInit = {},
  cookies?: string
): Promise<Response> {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string>),
  };

  // Forward cookies to external API
  if (cookies) {
    headers.Cookie = cookies;
  }

  const url = `${API_BASE_URL}${endpoint}`;
  return fetch(url, { ...options, headers });
}

// Get all tasks
export async function getTasks(cookies?: string): Promise<Task[]> {
  const response = await apiFetch("/api/tasks", {}, cookies);
  if (!response.ok) {
    throw new Error("Failed to fetch tasks");
  }
  return response.json();
}

// Get current user data
export async function getMe(cookies?: string): Promise<User | null> {
  try {
    const response = await apiFetch("/api/me", {}, cookies);
    if (!response.ok) {
      return null;
    }
    return response.json();
  } catch {
    return null;
  }
}

// Complete a task
export async function completeTask(
  taskId: string,
  comment: string,
  cookies?: string
): Promise<TaskCompletionResponse> {
  const response = await apiFetch(
    "/api/complete-task",
    {
      method: "POST",
      body: JSON.stringify({ task_id: taskId, comment }),
    },
    cookies
  );

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || "Failed to complete task");
  }

  return response.json();
}
