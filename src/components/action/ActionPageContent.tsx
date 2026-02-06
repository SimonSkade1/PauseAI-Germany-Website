"use client";

import { useState } from "react";
import { ActionTabs, ActionTree, Leaderboard } from "@/components/action";

export function ActionPageContent() {
  const [activeTab, setActiveTab] = useState<"actions" | "leaderboard">("actions");

  return (
    <>
      <ActionTabs activeTab={activeTab} onTabChange={setActiveTab} />
      {activeTab === "actions" ? <ActionTree /> : <Leaderboard />}
    </>
  );
}
