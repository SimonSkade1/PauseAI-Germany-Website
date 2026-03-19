import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Link from "next/link";
import { ExternalLink } from "lucide-react";

type Resource = {
  title: string;
  href: string;
  description?: string;
  external?: boolean;
};

function ResourceList({ items }: { items: Resource[] }) {
  return (
    <ul className="space-y-3">
      {items.map((item) => (
        <li key={item.href} className="font-body text-pause-black/85">
          {item.external ? (
            <a
              href={item.href}
              target="_blank"
              rel="noopener noreferrer"
              className="orange-link font-body-bold inline-flex items-center gap-1"
            >
              {item.title}
              <ExternalLink className="inline h-3.5 w-3.5 shrink-0" />
            </a>
          ) : (
            <Link href={item.href} className="orange-link font-body-bold">
              {item.title}
            </Link>
          )}
          {item.description && <> — {item.description}</>}
        </li>
      ))}
    </ul>
  );
}

const internalLinks: Resource[] = [
  {
    title: "KI-Risiken",
    href: "https://ki-risiken.de",
    description: "Unsere umfassende Übersicht über die Risiken der KI.",
    external: true,
  },
  {
    title: "Appell",
    href: "/appell",
    description: "Unser offener Appell für sichere KI-Entwicklung.",
  },
  {
    title: "Über uns",
    href: "/ueber-uns",
    description: "Wer wir sind und was wir tun.",
  },
  {
    title: "Mitmachen",
    href: "/mitmachen",
    description: "Wie du aktiv werden kannst.",
  },
];

const importantWebsites: Resource[] = [
  {
    title: "The Compendium",
    href: "https://www.thecompendium.ai/",
    description:
      "Ein umfassendes Kompendium darüber, warum das aktuelle KI-Wettrennen so gefährlich ist und was wir dagegen tun können.",
    external: true,
  },
  {
    title: "A Narrow Path",
    href: "https://www.narrowpath.co/",
    description:
      "Ein detaillierter Plan für die Schritte, die wir unternehmen müssen, um die nächsten Jahrzehnte zu überstehen.",
    external: true,
  },
  {
    title: "Keep the Future Human",
    href: "https://keepthefuturehuman.ai/",
    description:
      "Ein Artikel von FLIs Anthony Aguirre darüber, warum und wie wir die Zukunft menschlich halten können.",
    external: true,
  },
  {
    title: "AISafety.com & AISafety.info",
    href: "https://www.aisafety.com",
    description:
      "Die Einstiegsseiten für KI-Sicherheit. Risiken, Communities, Events, Jobs, Kurse und mehr.",
    external: true,
  },
  {
    title: "Existential Safety",
    href: "https://existentialsafety.org/",
    description:
      "Eine umfassende Liste von Maßnahmen zur Erhöhung unserer existenziellen Sicherheit vor KI.",
    external: true,
  },
  {
    title: "AISafety.dance",
    href: "https://aisafety.dance",
    description:
      "Eine spielerische und interaktive Einführung in die katastrophalen KI-Risiken.",
    external: true,
  },
  {
    title: "AISafety.world",
    href: "https://aisafety.world/tiles/",
    description:
      "Die gesamte KI-Sicherheitslandschaft mit allen Organisationen, Medien, Foren und Ressourcen.",
    external: true,
  },
  {
    title: "IncidentDatabase.ai",
    href: "https://incidentdatabase.ai/",
    description:
      "Datenbank von Vorfällen, bei denen KI-Systeme Schaden verursacht haben.",
    external: true,
  },
];

const newsletters: Resource[] = [
  {
    title: "PauseAI Substack",
    href: "https://pauseai.substack.com/",
    description: "Unser internationaler Newsletter.",
    external: true,
  },
  {
    title: "TransformerNews",
    href: "https://www.transformernews.ai/",
    description:
      "Umfassender wöchentlicher Newsletter zu KI-Sicherheit und Governance.",
    external: true,
  },
  {
    title: "Don't Worry About The Vase",
    href: "https://thezvi.substack.com/",
    description:
      "Newsletter über KI-Sicherheit, Rationalität und andere Themen.",
    external: true,
  },
];

const videos: Resource[] = [
  {
    title: "PauseAI Playlist",
    href: "https://www.youtube.com/playlist?list=PLI46NoubGtIJa0JVCBR-9CayxCOmU0EJt",
    description:
      "Von uns zusammengestellte YouTube-Playlist mit Videos von 1 Minute bis 1 Stunde, kein Vorwissen nötig.",
    external: true,
  },
  {
    title: "Robert Miles' YouTube",
    href: "https://www.youtube.com/watch?v=tlS5Y2vm02c&list=PLfHsskCxi_g-c62a_dmsNuHynaXsRQm40",
    description:
      "Hervorragender Einstieg in die Grundlagen des KI-Alignments.",
    external: true,
  },
];

const podcasts: Resource[] = [
  {
    title: "DoomDebates",
    href: "https://www.youtube.com/@DoomDebates",
    description:
      "Von Liron Shapira, vollständig auf KI-Risiken fokussiert.",
    external: true,
  },
  {
    title: "For Humanity Podcast",
    href: "https://www.youtube.com/@ForHumanityPodcast",
    description: "Von Ex-Nachrichtenanchor John Sherman.",
    external: true,
  },
  {
    title: "Future of Life Institute | Connor Leahy on AI Safety",
    href: "https://youtu.be/cSL3Zau1X8g?t=1803",
    description: "Interview mit Connor über KI-Sicherheitsstrategien.",
    external: true,
  },
  {
    title: "Lex Fridman | Max Tegmark: The Case for Halting AI Development",
    href: "https://youtu.be/VcVfceTsD0A?t=1547",
    description: "Interview über unsere aktuelle gefährliche Situation.",
    external: true,
  },
  {
    title: "Sam Harris | Eliezer Yudkowsky: AI, Racing Toward the Brink",
    href: "https://samharris.org/episode/SE60B0CF4B8",
    description:
      "Gespräch über die Natur der Intelligenz und das Alignment-Problem.",
    external: true,
  },
];

const articles: Resource[] = [
  {
    title:
      "The 'Don't Look Up' Thinking That Could Doom Us With AI (Max Tegmark)",
    href: "https://time.com/6273743/thinking-that-could-doom-us-with-ai/",
    external: true,
  },
  {
    title:
      "Pausing AI Developments Isn't Enough. We Need to Shut it All Down (Eliezer Yudkowsky)",
    href: "https://time.com/6266923/ai-eliezer-yudkowsky-open-letter-not-enough/",
    external: true,
  },
  {
    title: "The Case for Slowing Down AI (Sigal Samuel)",
    href: "https://www.vox.com/the-highlight/23621198/artificial-intelligence-chatgpt-openai-existential-risk-china-ai-safety-technology",
    external: true,
  },
  {
    title:
      "The AI Revolution: The Road to Superintelligence (WaitButWhy)",
    href: "https://waitbutwhy.com/2015/01/artificial-intelligence-revolution-1.html",
    external: true,
  },
  {
    title: "How rogue AIs may arise (Yoshua Bengio)",
    href: "https://yoshuabengio.org/2023/05/22/how-rogue-ais-may-arise/",
    external: true,
  },
];

const books: Resource[] = [
  {
    title: "If Anyone Builds It, Everyone Dies",
    href: "https://ifanyonebuildsit.com/",
    description: "Eliezer Yudkowsky & Nate Soares, 2025",
    external: true,
  },
  {
    title: "Introduction to AI Safety, Ethics, and Society",
    href: "https://www.aisafetybook.com/",
    description:
      "Dan Hendrycks, 2024 — Kostenloses Buch und Online-Kurs.",
    external: true,
  },
  {
    title: "Uncontrollable: The Threat of Artificial Superintelligence",
    href: "https://www.goodreads.com/book/show/202416160-uncontrollable",
    description: "Darren McKee, 2023",
    external: true,
  },
  {
    title: "The Alignment Problem",
    href: "https://www.goodreads.com/book/show/50489349-the-alignment-problem",
    description: "Brian Christian, 2020",
    external: true,
  },
  {
    title: "Human Compatible",
    href: "https://www.goodreads.com/en/book/show/44767248",
    description: "Stuart Russell, 2019",
    external: true,
  },
  {
    title: "Life 3.0",
    href: "https://www.goodreads.com/en/book/show/34272565",
    description: "Max Tegmark, 2017",
    external: true,
  },
  {
    title: "Superintelligence",
    href: "https://www.goodreads.com/en/book/show/20527133",
    description: "Nick Bostrom, 2014",
    external: true,
  },
];

const papers: Resource[] = [
  {
    title: "Sammlung von KI-Sicherheitsartikeln",
    href: "https://arkose.org/aisafety",
    external: true,
  },
  {
    title: "Weitere Sammlung",
    href: "https://futureoflife.org/resource/introductory-resources-on-ai-risks/#toc-44245428-2",
    external: true,
  },
  {
    title: "Alignment faking in large language models",
    href: "https://www.anthropic.com/news/alignment-faking",
    description: "Aktuelle Arbeit von Anthropic.",
    external: true,
  },
  {
    title: "Managing extreme AI risks amid rapid progress",
    href: "https://www.science.org/doi/abs/10.1126/science.adn0117",
    description: "Von den Pionieren des Feldes.",
    external: true,
  },
];

const courses: Resource[] = [
  {
    title: "Intro to Transformative AI",
    href: "https://aisafetyfundamentals.com/intro-to-tai/",
    description: "15 Stunden",
    external: true,
  },
  {
    title: "AGI Safety Fundamentals",
    href: "https://www.agisafetyfundamentals.com/",
    description: "30 Stunden",
    external: true,
  },
  {
    title: "CHAI Bibliography",
    href: "https://humancompatible.ai/bibliography",
    description: "50+ Stunden",
    external: true,
  },
  {
    title: "AISafety.training",
    href: "https://aisafety.training/",
    description:
      "Übersicht über Trainingsprogramme, Konferenzen und Events.",
    external: true,
  },
];

const organizations: Resource[] = [
  {
    title: "Future of Life Institute",
    href: "https://futureoflife.org/cause-area/artificial-intelligence/",
    description:
      "Hat den offenen Brief initiiert, geleitet von Max Tegmark.",
    external: true,
  },
  {
    title: "Center for AI Safety (CAIS)",
    href: "https://www.safe.ai/",
    description: "Forschungszentrum unter Dan Hendrycks.",
    external: true,
  },
  {
    title: "Conjecture",
    href: "https://www.conjecture.dev/",
    description:
      "Start-up für KI-Alignment und KI-Politik unter Connor Leahy.",
    external: true,
  },
  {
    title: "ControlAI",
    href: "https://controlai.com/",
    description: "NGO für Lobby- und Kampagnenarbeit in Großbritannien.",
    external: true,
  },
  {
    title: "Machine Intelligence Research Institute (MIRI)",
    href: "https://intelligence.org/",
    description:
      "Mathematische Forschung zur KI-Sicherheit unter Eliezer Yudkowsky.",
    external: true,
  },
  {
    title: "Institute for AI Policy and Strategy (IAPS)",
    href: "https://www.iaps.ai/",
    external: true,
  },
];

type SectionProps = {
  title: string;
  items: Resource[];
};

function ResourceSection({ title, items }: SectionProps) {
  return (
    <section className="mx-auto max-w-5xl px-6 pb-10 md:px-10">
      <h2 className="font-section text-lg text-pause-black md:text-xl mb-4">
        {title}
      </h2>
      <ResourceList items={items} />
    </section>
  );
}

export default function InformierenPage() {
  return (
    <>
      <Header />
      <main className="bg-white pt-24">
        {/* Hero */}
        <section className="mx-auto max-w-5xl px-6 pb-12 pt-10 md:px-10 md:pt-14">
          <div className="mb-4">
            <p className="font-section text-sm text-[#FF9416]">Informieren</p>
            <h1 className="font-headline mt-2 text-3xl text-pause-black md:text-5xl">
              Warum KI-Sicherheit wichtig ist
            </h1>
            <p className="mt-6 max-w-3xl font-body text-pause-black/85">
              Hier findest du die besten Ressourcen, um die Risiken künstlicher
              Intelligenz zu verstehen — von kurzen Videos bis zu
              wissenschaftlichen Artikeln.
            </p>
          </div>
        </section>

        {/* Sections */}
        <ResourceSection title="Auf unserer Website" items={internalLinks} />
        <ResourceSection title="Wichtige Websites" items={importantWebsites} />
        <ResourceSection title="Newsletter" items={newsletters} />
        <ResourceSection title="Videos" items={videos} />
        <ResourceSection title="Podcasts" items={podcasts} />
        <ResourceSection title="Artikel" items={articles} />
        <ResourceSection title="Bücher" items={books} />
        <ResourceSection
          title="Wissenschaftliche Arbeiten"
          items={papers}
        />
        <ResourceSection title="Kurse" items={courses} />
        <ResourceSection title="Organisationen" items={organizations} />

        {/* CTA */}
        <section className="mx-auto max-w-5xl px-6 pb-10 md:px-10">
          <div className="rounded-sm border-2 border-[#1a1a1a] bg-[#FFFAF5] p-6 md:p-8">
            <h2 className="font-section text-lg text-pause-black md:text-xl mb-4">
              Überzeugt? Dann werde aktiv!
            </h2>
            <p className="font-body text-pause-black/85 max-w-3xl">
              Es gibt viele Möglichkeiten zu helfen — einen Brief schreiben, zu
              einer Aktion gehen, spenden oder einer Community beitreten. Auch
              angesichts großer Risiken gibt es Hoffnung und wichtige Arbeit zu
              tun.
            </p>
            <Link
              href="/mitmachen"
              className="mt-5 inline-flex items-center justify-center border border-[#1a1a1a] bg-[#FF9416] px-4 py-2 font-section text-xs tracking-wider text-black transition-colors hover:bg-[#e88510]"
            >
              Mitmachen
            </Link>
          </div>
        </section>

        {/* Noch nicht ganz sicher? */}
        <section className="mx-auto max-w-5xl px-6 pb-16 md:px-10">
          <h2 className="font-section text-lg text-pause-black md:text-xl mb-4">
            Noch nicht ganz sicher?
          </h2>
          <p className="font-body text-pause-black/85">
            Erfahre mehr über die{" "}
            <a
              href="https://pauseai.info/psychology-of-x-risk"
              target="_blank"
              rel="noopener noreferrer"
              className="orange-link font-body-bold inline-flex items-center gap-1"
            >
              Psychologie existenzieller Risiken
              <ExternalLink className="inline h-3.5 w-3.5 shrink-0" />
            </a>
            , um zu verstehen, warum es so schwer fällt, diese Bedrohung ernst
            zu nehmen.
          </p>
        </section>
      </main>
      <Footer />
    </>
  );
}
