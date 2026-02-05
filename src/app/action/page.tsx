"use client";

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { ActionTabs, ActionTree, Leaderboard } from "@/components/action";
import { useState } from "react";

export default function ActionPage() {
  const [activeTab, setActiveTab] = useState<"actions" | "leaderboard">("actions");

  return (
    <>
      <Header />
      <main className="pt-20">
        <ActionTabs activeTab={activeTab} onTabChange={setActiveTab} />
        {activeTab === "actions" ? <ActionTree /> : <Leaderboard />}
      </main>
      <Footer />
    </>
  );
}
