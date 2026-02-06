"use client";

import React, { useEffect, useState } from "react";
import { getLeaderboard } from "@/lib/api";
import { LeaderboardEntry, getRoleClass } from "@/lib/types";

function getRankDisplay(rank: number): string {
  if (rank === 1) return "🥇";
  if (rank === 2) return "🥈";
  if (rank === 3) return "🥉";
  return rank.toString();
}

export function Leaderboard() {
  const [data, setData] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        const leaderboard = await getLeaderboard();
        setData(leaderboard);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Fehler beim Laden");
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  if (loading) {
    return (
      <section className="bg-white py-12 md:py-16 min-h-[600px]">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <div className="inline-block w-8 h-8 border-2 border-[#FF9416] border-t-transparent rounded-full animate-spin"></div>
          <p className="font-body text-gray-500 mt-4">Lade Rangliste...</p>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="bg-white py-12 md:py-16 min-h-[600px]">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <p className="font-body text-red-500">Fehler: {error}</p>
        </div>
      </section>
    );
  }

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
          {data.length === 0 ? (
            <div className="px-6 py-12 text-center">
              <p className="font-body text-gray-500">Noch keine Einträge</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {data.map((entry) => (
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
                    {entry.discord_name}
                  </span>

                  {/* Role Badge */}
                  <span className={`text-xs md:text-sm px-2 py-1 rounded-full text-center ${getRoleClass(entry.role as any)}`}>
                    {entry.role}
                  </span>

                  {/* XP */}
                  <span className="font-body-bold text-[#4fc3f7] text-right">
                    {entry.total_xp}
                  </span>
                </div>
              ))}
            </div>
          )}
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
