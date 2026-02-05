"use client";

import React from "react";

// Placeholder data - will be replaced with API calls later
const placeholderData = [
  { rank: 1, name: "BeispielNutzer", role: "Beschützer der Menschheit", xp: 1250, roleClass: "role-3" },
  { rank: 2, name: "Aktivist2024", role: "Aktivist", xp: 980, roleClass: "role-2" },
  { rank: 3, name: "NeuerMitstreiter", role: "Besorgter Bürger", xp: 750, roleClass: "role-1" },
  { rank: 4, name: "EngagierterBürger", role: "Besorgter Bürger", xp: 520, roleClass: "role-1" },
  { rank: 5, name: "Lernender", role: "Besorgter Bürger", xp: 300, roleClass: "role-1" },
];

function getRankDisplay(rank: number): string {
  if (rank === 1) return "🥇";
  if (rank === 2) return "🥈";
  if (rank === 3) return "🥉";
  return rank.toString();
}

export function Leaderboard() {
  return (
    <section className="bg-white py-12 md:py-16 min-h-[600px]">
      <div className="max-w-4xl mx-auto px-6">
        <div className="bg-gray-50 rounded-xl border border-gray-200 overflow-hidden">
          {/* Header */}
          <div className="hidden md:grid grid-cols-[60px_1fr_140px_100px] gap-4 px-6 py-4 bg-gray-100 border-b border-gray-200">
            <span className="font-section text-xs tracking-wider text-gray-500 uppercase">Rang</span>
            <span className="font-section text-xs tracking-wider text-gray-500 uppercase">Name</span>
            <span className="font-section text-xs tracking-wider text-gray-500 uppercase">Rolle</span>
            <span className="font-section text-xs tracking-wider text-gray-500 uppercase text-right">XP</span>
          </div>

          {/* Rows */}
          <div className="divide-y divide-gray-200">
            {placeholderData.map((entry) => (
              <div
                key={entry.rank}
                className="grid grid-cols-[80px_1fr_120px_80px] md:grid-cols-[60px_1fr_140px_100px] gap-2 md:gap-4 px-4 md:px-6 py-4 hover:bg-gray-100 transition-colors items-center"
              >
                {/* Rank */}
                <span className="font-body-bold text-lg md:text-xl">
                  {getRankDisplay(entry.rank)}
                </span>

                {/* Name */}
                <span className="font-body text-gray-900 truncate">
                  {entry.name}
                </span>

                {/* Role Badge */}
                <span className={`text-xs md:text-sm px-2 py-1 rounded-full text-center ${entry.roleClass}`}>
                  {entry.role}
                </span>

                {/* XP */}
                <span className="font-body-bold text-[#4fc3f7] text-right">
                  {entry.xp}
                </span>
              </div>
            ))}
          </div>

          {/* Loading indicator placeholder */}
          <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 text-center">
            <p className="font-body text-gray-500 text-sm">
 Weitere Daten werden später geladen...
            </p>
          </div>
        </div>

        {/* Legend */}
        <div className="mt-6 flex flex-wrap gap-4 justify-center">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-[#6bcf8e]"></span>
            <span className="font-body text-sm text-gray-600">Besorgter Bürger</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-[#cfaa6b]"></span>
            <span className="font-body text-sm text-gray-600">Aktivist</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-[#cf6bcf]"></span>
            <span className="font-body text-sm text-gray-600">Beschützer der Menschheit</span>
          </div>
        </div>
      </div>
    </section>
  );
}
