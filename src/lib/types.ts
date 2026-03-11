// Task interface for Notion-based tasks
export interface Task {
  id: string;
  name: string;
  xp: number;
  level: number;
  emoji: string;
  link: string;
  icon?: string;       // Computed from emoji via getLucideForEmoji()
  repeatable?: boolean; // Whether the task can be completed multiple times
  kommentarNoetig?: boolean; // Whether a comment (min 100 chars) is required
  wichtig?: boolean;   // Whether the task is marked as important (Wichtig)
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

export interface RankInfo {
  level: number;
  minXp: number;
  label: string;
  className: string;
}

export const RANKS: RankInfo[] = [
  { level: 0, minXp: 0, label: "Kein Rang", className: "role-0" },
  { level: 1, minXp: 30, label: "Neuling", className: "role-1" },
  { level: 2, minXp: 200, label: "Lehrling", className: "role-2" },
  { level: 3, minXp: 600, label: "Aufklärer:in", className: "role-3" },
  { level: 4, minXp: 2000, label: "Aktivist:in", className: "role-4" },
  { level: 5, minXp: 6000, label: "Pionier:in", className: "role-5" },
  { level: 6, minXp: 20000, label: "Meister:in", className: "role-6" },
];

export type UserRole = RankInfo["label"];

export function getRankForKarma(karma: number): RankInfo {
  const safeKarma = Math.max(0, karma);
  let activeRank = RANKS[0];
  for (const rank of RANKS) {
    if (safeKarma >= rank.minXp) {
      activeRank = rank;
    } else {
      break;
    }
  }
  return activeRank;
}

export function getRankLevelForKarma(karma: number): number {
  return getRankForKarma(karma).level;
}

export function getRankForLevel(level: number): RankInfo {
  const normalizedLevel = Number.isFinite(level) ? Math.max(0, Math.floor(level)) : 0;
  return RANKS.find((rank) => rank.level === normalizedLevel) ?? RANKS[RANKS.length - 1];
}

export function canAccessTaskLevel(userKarma: number, taskLevel: number): boolean {
  const normalizedTaskLevel = Number.isFinite(taskLevel) ? Math.max(0, Math.floor(taskLevel)) : 0;
  return getRankLevelForKarma(userKarma) >= normalizedTaskLevel;
}

// Backward-compatible helpers for existing call sites
export function getRoleForKarma(karma: number): UserRole {
  return getRankForKarma(karma).label;
}

export function getRoleClass(role: UserRole): string {
  const rank = RANKS.find((r) => r.label === role);
  return rank?.className ?? "role-0";
}
