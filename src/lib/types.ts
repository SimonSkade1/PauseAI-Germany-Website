// Task interface for Notion-based tasks
export interface Task {
  id: string;          // Notion page ID
  name: string;        // Task name from Notion
  xp: number;          // Calculated from time investment (1h = 100xp)
  icon: string;        // Lucide icon name (mapped from emoji)
  emoji: string;       // Original emoji from Notion
  link?: string;       // Link to Notion page
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
