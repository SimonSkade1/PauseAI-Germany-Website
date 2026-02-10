// Task types - path can be any of the values stored in Convex
export type TaskPath = "onboarding" | "outreach" | "lobbying";

export interface Task {
  id: string;
  name: string;
  level: number;
  xp: number;
  icon: string;
  repeatable: boolean;
  path: TaskPath;
  link?: string;
}

// User types
export interface User {
  discord_id: string;
  discord_name: string;
  total_xp: number;
  role: string;
  completed_tasks: string[];
}

// Task completion response
export interface TaskCompletionResponse {
  total_xp: number;
  xp_earned: number;
}

// Role levels based on XP
export type UserRole = "Neues Mitglied" | "Engagiertes Mitglied" | "Aktives Mitglied";

export function getRoleForXp(xp: number): UserRole {
  if (xp >= 400) return "Aktives Mitglied";
  if (xp >= 150) return "Engagiertes Mitglied";
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
