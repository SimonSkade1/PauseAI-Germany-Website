import type { Metadata } from "next";
import RetiredPageNotice from "@/components/RetiredPageNotice";

export const metadata: Metadata = {
  title: "Page moved — PauseAI",
  robots: { index: false, follow: false },
};

export default function LobbyingSetupPage() {
  return <RetiredPageNotice />;
}
