import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import HeroSection from "./HeroSection";
import JumpBar from "./JumpBar";
import JobLossCounterSection from "./JobLossCounterSection";
import UmfrageCTASection from "./UmfrageCTASection";
import TestimonialsSection from "./TestimonialsSection";
import MehrAlsArbeitSection from "./MehrAlsArbeitSection";
import PolitischeForderungSection from "./PolitischeForderungSection";
import JobLossChartSection from "./JobLossChartSection";
import PresseSection from "./PresseSection";
import ShareSection from "./ShareSection";
import FloatingCTA from "./FloatingCTA";

const TITLE = "Nicht nur dein Job | PauseAI Deutschland";
const DESCRIPTION =
  "Wenn wir die Kontrolle über KI verlieren, steht weit mehr auf dem Spiel als unsere Jobs: unsere Selbstbestimmung, unsere Demokratie, unsere Existenz.";
const URL = "https://pause-ai.de/nicht-nur-dein-job";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: URL,
    siteName: "PauseAI Deutschland",
    type: "article",
    locale: "de_DE",
    images: [
      {
        url: "/og-nicht-nur-dein-job.png",
        width: 1200,
        height: 630,
        alt: "Nicht nur dein Job — PauseAI Deutschland",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
    images: ["/og-nicht-nur-dein-job.png"],
  },
  alternates: { canonical: URL },
};

export default function NichtNurDeinJobPage() {
  return (
    <>
      <Header />
      <main className="overflow-x-clip">
        <HeroSection description={DESCRIPTION} />
        <JumpBar />
        <JobLossCounterSection />
        <MehrAlsArbeitSection />
        <PolitischeForderungSection />
        <TestimonialsSection />
        <UmfrageCTASection />
        <ShareSection />
        <JobLossChartSection />
        <PresseSection />
      </main>
      <Footer />
      <FloatingCTA />
    </>
  );
}
