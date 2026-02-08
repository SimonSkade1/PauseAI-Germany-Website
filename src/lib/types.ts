// Task types - path can be any of the values stored in Convex
export type TaskPath = "onboarding" | "outreach" | "lobbying" | "special";

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
export type UserRole = "Besorgter Bürger" | "Engagierter Bürger" | "Aktivist";

export function getRoleForXp(xp: number): UserRole {
  if (xp >= 400) return "Aktivist";
  if (xp >= 150) return "Engagierter Bürger";
  return "Besorgter Bürger";
}

export function getRoleClass(role: UserRole): string {
  switch (role) {
    case "Aktivist":
      return "role-3";
    case "Engagierter Bürger":
      return "role-2";
    case "Besorgter Bürger":
      return "role-1";
    default:
      return "role-1";
  }
}
