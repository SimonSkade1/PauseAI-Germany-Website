import type { Metadata } from "next";
import { Saira_Condensed, Montserrat, Roboto_Slab } from "next/font/google";
import "./globals.css";

const sairaCondensed = Saira_Condensed({
  weight: "700",
  subsets: ["latin"],
  variable: "--font-saira-condensed",
  display: "swap",
});

const montserrat = Montserrat({
  weight: "900",
  subsets: ["latin"],
  variable: "--font-montserrat",
  display: "swap",
});

const robotoSlab = Roboto_Slab({
  weight: ["300", "700"],
  subsets: ["latin"],
  variable: "--font-roboto-slab",
  display: "swap",
});

export const metadata: Metadata = {
  title: "PauseAI Germany | Wir sind nicht bereit für Superintelligenz",
  description:
    "Wir bei PauseAI Deutschland klären die Bevölkerung und Politik über KI Risiken auf, insbesondere über existenzielles Risiko.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="de" className="scroll-smooth">
      <body
        className={`${sairaCondensed.variable} ${montserrat.variable} ${robotoSlab.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
