// Task interface for Notion-based tasks
export interface Task {
  id: string;
  name: string;
  xp: number;
  emoji: string;
  link: string;
  icon?: string;       // Computed from emoji via getLucideForEmoji()
  repeatable?: boolean; // Whether the task can be completed multiple times
  kommentarNoetig?: boolean; // Whether a comment (min 100 chars) is required
}

// User types
export interface User {
  discord_id: string;
  discord_name: string;
  total_xp: number;
  role: string;
  completed_tasks: string[];
  completion_counts?: Record<string, number>; // taskId -> count
}

// Task completion response
export interface TaskCompletionResponse {
  total_xp: number;
  xp_earned: number;
}

// Role levels based on XP
export type UserRole = "Neues Mitglied" | "Engagiertes Mitglied" | "Aktives Mitglied";

export function getRoleForXp(xp: number): UserRole {
  if (xp >= 900) return "Aktives Mitglied";
  if (xp >= 300) return "Engagiertes Mitglied";
  return "Neues Mitglied";
}

export function getRoleClass(role: UserRole): string {
  switch (role) {
    case "Aktives Mitglied":
      return "role-3";
    case "Engagiertes Mitglied":
      return "role-2";
    case "Neues Mitglied":
      return "role-1";
    default:
      return "role-1";
  }
}
