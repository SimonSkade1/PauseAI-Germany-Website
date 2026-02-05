"use client";

import React from "react";

interface TabsProps {
  activeTab: "actions" | "leaderboard";
  onTabChange: (tab: "actions" | "leaderboard") => void;
}

export function ActionTabs({ activeTab, onTabChange }: TabsProps) {
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
            onClick={() => onTabChange("leaderboard")}
            className={`font-section text-sm md:text-base tracking-wider py-4 px-2 border-b-2 transition-colors ${
              activeTab === "leaderboard"
                ? "border-[#FF9416] text-[#FF9416]"
                : "border-transparent text-gray-500 hover:text-gray-700"
            }`}
          >
            Rangliste
          </button>
        </div>
      </div>
    </section>
  );
}
