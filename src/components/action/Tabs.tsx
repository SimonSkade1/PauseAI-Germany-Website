"use client";

import React from "react";
import { useSession, signIn } from "next-auth/react";

interface TabsProps {
  activeTab: "actions" | "leaderboard";
  onTabChange: (tab: "actions" | "leaderboard") => void;
}

export function ActionTabs({ activeTab, onTabChange }: TabsProps) {
  const { data: session } = useSession();
  const isLoggedIn = !!session;

  const handleLeaderboardClick = () => {
    if (!isLoggedIn) {
      signIn("discord");
      return;
    }
    onTabChange("leaderboard");
  };

  return (
    <section className="bg-white border-b border-gray-200">
      <div className="max-w-4xl mx-auto px-6">
        <div className="flex gap-8">
          <button
            onClick={() => onTabChange("actions")}
            className={`font-section text-sm md:text-base tracking-wider py-4 px-2 border-b-2 transition-colors ${
              activeTab === "actions"
                ? "border-[#FF9416] text-[#FF9416]"
                : "border-transparent text-gray-500 hover:text-gray-700"
            }`}
          >
            Actions
          </button>
          <button
            onClick={handleLeaderboardClick}
            disabled={!isLoggedIn && activeTab !== "leaderboard"}
            className={`font-section text-sm md:text-base tracking-wider py-4 px-2 border-b-2 transition-colors relative ${
              activeTab === "leaderboard"
                ? "border-[#FF9416] text-[#FF9416]"
                : isLoggedIn
                  ? "border-transparent text-gray-500 hover:text-gray-700"
                  : "border-transparent text-gray-300 cursor-not-allowed"
            }`}
            title={!isLoggedIn ? "Login erforderlich" : "Rangliste"}
          >
            Rangliste
            {!isLoggedIn && (
              <span className="absolute -top-1 -right-1">
                <svg className="w-3 h-3 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                </svg>
              </span>
            )}
          </button>
        </div>
      </div>
    </section>
  );
}
