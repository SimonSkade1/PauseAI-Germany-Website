import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Link from "next/link";
import { ExternalLink } from "lucide-react";

type Resource = {
  title: string;
  href: string;
  description?: string;
  external?: boolean;
  language?: "DE" | "EN";
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
          {item.language && (
            <span className="ml-2 inline-flex items-center rounded-sm bg-pause-black/5 px-1.5 py-0.5 text-xs font-body-bold text-pause-black/70">
              {item.language}
            </span>
          )}
          {item.description && <> — {item.description}</>}
        </li>
      ))}
    </ul>
  );
}

const internalLinks: Resource[] = [
  {
    title: "Appell zum KI-Gipfel 2026",
    href: "/appell",
    description: "Unser offener Appell für sichere KI-Entwicklung.",
  },
  {
    title: "Über 140 Professor*innen fordern KI-Sicherheit",
    href: "https://www.forschung-und-lehre.de/politik/ueber-140-professorinnen-und-professoren-fordern-ki-sicherheit-7541",
    description: "Artikel über unseren Appell in Forschung & Lehre.",
    external: true,
    language: "DE",
  },
  {
    title: "EU parliamentarians acknowledge the catastrophic risks of artificial intelligence",
    href: "https://pauseai.substack.com/p/eu-parliamentarians-acknowledge-the",
    description: "Bericht über unseren Protest vor dem EU-Parlament im Februar.",
    external: true,
    language: "EN",
  },
];

const importantWebsites: Resource[] = [
  {
    title: "PauseAI Global",
    href: "https://pauseai.info/",
    description: "Die internationale Bewegung.",
    external: true,
    language: "EN",
  },
  {
    title: "KI-Risiken.de",
    href: "https://ki-risiken.de",
    description: "Umfassende Übersicht über die Risiken der KI von Karl Olsberg.",
    external: true,
    language: "DE",
  },
  {
    title: "Benjamin Balde's Blog",
    href: "https://substack.com/@amirbenjaminbalde",
    description: "Blog über das existenzielle Risiko durch KI und verwandte Themen.",
    external: true,
    language: "DE",
  },
  {
    title: "ControlAI Quotes",
    href: "https://controlai.com/quotes",
    description: "Zitate wichtiger Personen zum Thema exisistenzielle Risiken der KI.",
    external: true,
    language: "EN",
  },
  {
    title: "The Compendium",
    href: "https://www.thecompendium.ai/",
    description: "Warum das aktuelle KI-Wettrennen so gefährlich ist und was wir dagegen tun können, von Connor Leahy et al.",
    external: true,
    language: "EN",
  },
  {
    title: "A Narrow Path",
    href: "https://www.narrowpath.co/",
    description: "Ein detaillierter Plan, wie wir die Zukunft sicher gestalten können, von Andrea Miotti et al.",
    external: true,
    language: "EN",
  },
  {
    title: "Keep the Future Human",
    href: "https://keepthefuturehuman.ai/",
    description: "Ein Essay, wie wir die Zukunft menschlich halten können, von Anthony Aguirre.",
    external: true,
    language: "EN",
  },
  {
    title: "IncidentDatabase.ai",
    href: "https://incidentdatabase.ai/",
    description: "Datenbank von Vorfällen, bei denen KI-Systeme Schaden verursacht haben.",
    external: true,
    language: "EN",
  },
];

const newsletters: Resource[] = [
  {
    title: "PauseAI Global Newsletter",
    href: "https://pauseai.substack.com/",
    external: true,
    language: "EN",
  },
  {
    title: "ControlAI Newsletter",
    href: "https://controlai.com/newsletter",
    external: true,
    language: "EN",
  },
  {
    title: "Future of Life Institute Newsletter",
    href: "https://futureoflife.org/newsletter/",
    external: true,
    language: "EN",
  },
];

const videos: Resource[] = [
  {
    title: "Warum fordern 133 deutsche Professoren ein KI-Sicherheitsabkommen? Mit Simon Skade von Pause AI",
    href: "https://www.youtube.com/watch?v=4QwlOJzKGGw",
    external: true,
    language: "DE",
  },
  {
    title: "Karl Olsberg's YouTube Kanal",
    href: "https://www.youtube.com/@KarlOlsbergAutor",
    external: true,
    language: "DE",
  },
  {
    title: "Kurzgesagt: Superintelligenz",
    href: "https://www.youtube.com/watch?v=lHlxx9gS7Ek",
    external: true,
    language: "DE",
  },
  {
    title: "Why AI Is Our Ultimate Test and Greatest Invitation | Tristan Harris | TED",
    href: "https://www.youtube.com/watch?v=6kPHnl-RsVI",
    external: true,
    language: "EN",
  },
  {
    title: "Playlist: Introduction to AI Risks",
    href: "https://www.youtube.com/playlist?list=PLI46NoubGtIJa0JVCBR-9CayxCOmU0EJt",
    description:
      "YouTube-Playlist von PauseAI Global mit Videos von 1 Minute bis 1 Stunde, kein Vorwissen nötig.",
    external: true,
    language: "EN",
  },
  {
    title: "Playlist: Alignmentpilling with Rob",
    href: "https://www.youtube.com/watch?v=tlS5Y2vm02c&list=PLfHsskCxi_g-c62a_dmsNuHynaXsRQm40",
    description: "Hervorragender Einstieg in die Grundlagen des KI-Alignments, von Rob Miles.",
    external: true,
    language: "EN",
  },
];

const podcasts: Resource[] = [
  {
    title: "Experte: KI wird später keine Kontrolle durch Menschen mehr zulassen",
    href: "https://www.deutschlandfunk.de/forschende-fordern-sicherheitsstandards-fuer-ki-interview-k-h-blaesius-100.html",
    description: "Interview mit Karl Hans Bläsius im Deutschlandfunk (18.2.2026).",
    external: true,
    language: "DE",
  },
  {
    title: "AI is MUTATING: And We Don't Know What It is Doing | Connor Leahy",
    href: "https://www.youtube.com/watch?v=rf2KFVcKQdQ",
    description: "Aktuelles Interview mit Connor Leahy (10.3.2026).",
    external: true,
    language: "EN",
  },
  {
    title: "Why Superhuman AI Would Kill Us All - Eliezer Yudkowsky",
    href: "https://www.youtube.com/watch?v=nRvAt4H7d7E",
    description: "Aktuelles Interview mit Eliezer Yudkowsky (25.10.2025).",
    external: true,
    language: "EN",
  },
  {
    title: "DoomDebates",
    href: "https://www.youtube.com/@DoomDebates",
    description:
      "Debatten über das existenzielle Risiko durch KI von Liron Shapira.",
    external: true,
    language: "EN",
  },
  {
    title: "For Humanity: An AI Risk Podcast",
    href: "https://podcasts.apple.com/de/podcast/for-humanity-an-ai-risk-podcast/id1713853739",
    description: "Podcast über das existenzielle Risiko durch KI von John Sherman.",
    external: true,
    language: "EN",
  },
  {
    title: "Max Tegmark: The Case for Halting AI Development | Lex Fridman Podcast #371",
    href: "https://youtu.be/VcVfceTsD0A?si=1fRfgtsKWSxh8T8F",
    external: true,
    language: "EN",
  },
];

const articles: Resource[] = [
  {
    title: "DER SPIEGEL Titelstory: Die Todesmaschine",
    href: "https://www.spiegel.de/ausland/kuenstliche-intelligenz-regulierung-dringend-noetig-um-toedliche-risiken-zu-vermeiden-a-c0a9b62d-5872-40ef-a503-8d3213d21aac",
    description: "Der Aufstieg von künstlicher Intelligenz ist so gefährlich wie die Erfindung der Atombombe. KI-Pioniere warnen: Die Menschheit muss die Maschinen einhegen, solange sie das noch kann. (03.03.2026)",
    external: true,
    language: "DE",
  },
  {
    title: "DER SPIEGEL Kolumne: KI-Schöpfer warnen vor tödlichen Gefahren der Technik. Warum ignorieren wir sie?",
    href: "https://www.spiegel.de/ausland/ki-schoepfer-warnen-vor-toedlichen-gefahren-der-technik-warum-ignorieren-wir-sie-kolumne-a-6df9e814-33b6-4251-9e7f-129df15eff3b",
    description: "Künstliche Intelligenz könnte eines Tages die perfekte Waffe in den Händen von Diktatoren und Terroristen sein – oder sich gegen die Menschheit wenden. Wer das für Sci­ence-Fic­tion hält, hat das Wesen der neuen Technik nicht verstanden. (08.02.2026)",
    external: true,
    language: "DE",
  },
  {
    title: "DER SPIEGEL Interview: »Als mir klar wurde, dass die Zukunft meiner Kinder bedroht ist, musste ich handeln«",
    href: "https://www.spiegel.de/netzwelt/web/kuenstliche-intelligenz-gruendervater-warnt-vor-kontrollverlust-sollten-den-stecker-ziehen-koennen-a-634f4958-a1fe-4c3e-8d51-bf187902c5fc",
    description: "Der Informatiker Yoshua Bengio gilt als einer der wichtigsten KI-Forscher der Welt und wichtiger Gründervater der Technik. Heute hält er seine Schöpfung für brandgefährlich – und warnt vor dem Kontrollverlust. (14.11.2025)",
    external: true,
    language: "DE",
  },
  {
    title: "The 'Don't Look Up' Thinking That Could Doom Us With AI (Max Tegmark)",
    href: "https://time.com/6273743/thinking-that-could-doom-us-with-ai/",
    external: true,
    language: "EN",
  },
  {
    title: "Pausing AI Developments Isn't Enough. We Need to Shut it All Down (Eliezer Yudkowsky)",
    href: "https://time.com/6266923/ai-eliezer-yudkowsky-open-letter-not-enough/",
    external: true,
    language: "EN",
  },
  {
    title: "The Case for Slowing Down AI (Sigal Samuel)",
    href: "https://www.vox.com/the-highlight/23621198/artificial-intelligence-chatgpt-openai-existential-risk-china-ai-safety-technology",
    external: true,
    language: "EN",
  },
  {
    title: "The AI Revolution: The Road to Superintelligence (WaitButWhy)",
    href: "https://waitbutwhy.com/2015/01/artificial-intelligence-revolution-1.html",
    external: true,
    language: "EN",
  },
  {
    title: "How rogue AIs may arise (Yoshua Bengio)",
    href: "https://yoshuabengio.org/2023/05/22/how-rogue-ais-may-arise/",
    external: true,
    language: "EN",
  },
];

const books: Resource[] = [
  {
    title: "Kontroll-Illusion",
    href: "https://www.ki-risiken.de/kontroll-illusion/",
    description: "Warum KI unsere Existenz bedroht (Karl Olsberg, 2025)",
    external: true,
    language: "DE",
  },
  {
    title: "If Anyone Builds It, Everyone Dies",
    href: "https://ifanyonebuildsit.com/",
    description: "Eliezer Yudkowsky & Nate Soares, 2025",
    external: true,
    language: "EN",
  },
  {
    title: "Uncontrollable: The Threat of Artificial Superintelligence",
    href: "https://www.goodreads.com/book/show/202416160-uncontrollable",
    description: "Darren McKee, 2023",
    external: true,
    language: "EN",
  },
  {
    title: "The Alignment Problem",
    href: "https://www.goodreads.com/book/show/50489349-the-alignment-problem",
    description: "Brian Christian, 2020",
    external: true,
    language: "EN",
  },
  {
    title: "Human Compatible",
    href: "https://www.goodreads.com/en/book/show/44767248",
    description: "Stuart Russell, 2019",
    external: true,
    language: "EN",
  },
  {
    title: "Life 3.0",
    href: "https://www.goodreads.com/en/book/show/34272565",
    description: "Max Tegmark, 2017",
    external: true,
    language: "EN",
  },
  {
    title: "Superintelligence",
    href: "https://www.goodreads.com/en/book/show/20527133",
    description: "Nick Bostrom, 2014",
    external: true,
    language: "EN",
  },
];

const papers: Resource[] = [
  {
    title: "Sammlung von KI-Sicherheitsartikeln",
    href: "https://arkose.org/aisafety",
    external: true,
    language: "EN",
  },
  {
    title: "Weitere Sammlung",
    href: "https://futureoflife.org/resource/introductory-resources-on-ai-risks/#toc-44245428-2",
    external: true,
    language: "EN",
  },
  {
    title: "Alignment faking in large language models",
    href: "https://www.anthropic.com/news/alignment-faking",
    description: "Aktuelle Arbeit von Anthropic.",
    external: true,
    language: "EN",
  },
  {
    title: "Managing extreme AI risks amid rapid progress",
    href: "https://www.science.org/doi/abs/10.1126/science.adn0117",
    description: "Von den Pionieren des Feldes.",
    external: true,
    language: "EN",
  },
];

const statements: Resource[] = [
  {
    title: "Statement on AI Safety",
    href: "https://aistatement.com/",
    external: true,
    language: "EN",
  },
  {
    title: "Red Lines for AI",
    href: "https://red-lines.ai/",
    external: true,
    language: "EN",
  },
  {
    title: "Superintelligence Statement",
    href: "https://superintelligence-statement.org/",
    external: true,
    language: "EN",
  },
  {
    title: "ControlAI Open Statement",
    href: "https://controlai.com/open-statement",
    external: true,
    language: "EN",
  },
  {
    title: "International AI Treaty",
    href: "https://aitreaty.org/",
    external: true,
    language: "EN",
  },
  {
    title: "KI-Gipfel müssen Sicherheit wieder ernst nehmen",
    href: "https://www.change.org/p/ki-gipfel-m%C3%BCssen-sicherheit-wieder-ernst-nehmen",
    external: true,
    language: "DE",
  },
  {
    title: "PauseAI Global Statement",
    href: "https://pauseai.info/statement",
    external: true,
    language: "EN",
  },
  {
    title: "Say No to Dangerous AI",
    href: "https://pauseai.info/sayno",
    external: true,
    language: "EN",
  },
];

const organizations: Resource[] = [
  {
    title: "ControlAI",
    href: "https://controlai.com/",
    description: "NGO für Lobby- und Kampagnenarbeit in Großbritannien und Europa.",
    external: true,
    language: "EN",
  },
  {
    title: "Future of Life Institute",
    href: "https://futureoflife.org/cause-area/artificial-intelligence/",
    description:
      "Hat den offenen Brief initiiert, geleitet von Max Tegmark.",
    external: true,
    language: "EN",
  },
  {
    title: "Center for AI Safety (CAIS)",
    href: "https://www.safe.ai/",
    description: "Forschungszentrum unter Dan Hendrycks.",
    external: true,
    language: "EN",
  },
  {
    title: "Conjecture",
    href: "https://www.conjecture.dev/",
    description:
      "Start-up für KI-Alignment und KI-Politik unter Connor Leahy.",
    external: true,
    language: "EN",
  },
  {
    title: "Machine Intelligence Research Institute (MIRI)",
    href: "https://intelligence.org/",
    description:
      "Mathematische Forschung zur KI-Sicherheit unter Eliezer Yudkowsky.",
    external: true,
    language: "EN",
  },
  {
    title: "Institute for AI Policy and Strategy (IAPS)",
    href: "https://www.iaps.ai/",
    external: true,
    language: "EN",
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
        <ResourceSection title="Unsere Aktionen" items={internalLinks} />
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
        <ResourceSection title="Stellungnahmen" items={statements} />
        <ResourceSection title="Organisationen" items={organizations} />

        {/* CTA */}
        <section className="mx-auto max-w-5xl px-6 pb-10 md:px-10">
          <div className="rounded-sm border-2 border-[#1a1a1a] bg-[#FFFAF5] p-6 md:p-8">
            <h2 className="font-section text-lg text-pause-black md:text-xl mb-4">
            Du hast Fragen, möchtest dich mit anderen austauschen oder erfahren was du tun kannst?
            </h2>
            <p className="font-body text-pause-black/85 max-w-3xl">
            All das kannst du in unserer Community tun. Wir laden dich herzlich ein, uns kennenzulernen. 
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
            Dir fällt es schwer, über das Thema nachzudenken?
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
