export type PressLanguage = "de" | "en";

export type PressCategory =
  | "entlassung"
  | "studie"
  | "video"
  | "auswirkung"
  | "missbrauch"
  | "jugend";

export interface PressItem {
  title: string;
  source: string;
  url: string;
  language: PressLanguage;
  category: PressCategory;
  publishedAt: string; // ISO date
  excerpt: string;
  imageUrl?: string;
}

export const CATEGORY_LABELS: Record<PressCategory, string> = {
  entlassung: "Entlassung",
  studie: "Studie",
  video: "Video",
  auswirkung: "Auswirkung",
  missbrauch: "Missbrauch",
  jugend: "Jugend",
};

export const LANGUAGE_LABELS: Record<PressLanguage, string> = {
  de: "Deutsch",
  en: "Englisch",
};

export const STATIC_PRESS: PressItem[] = [
  {
    title: "Wildberger: KI wird Arbeitsmarkt umkrempeln",
    source: "ZDFheute",
    url: "https://www.zdfheute.de/wirtschaft/wildberger-digitalminister-arbeitsmarkt-kuenstliche-intelligenz-jobverluste-grundeinkommen-100.html",
    language: "de",
    category: "auswirkung",
    publishedAt: "2026-04-14",
    excerpt:
      "Der Bundesdigitalminister rechnet mit weitreichenden Verschiebungen am deutschen Arbeitsmarkt. KI werde innerhalb weniger Jahre einen Großteil der Bürotätigkeiten übernehmen können.",
  },
  {
    title: "Microsoft kündigt weitere KI-bedingte Stellenstreichungen an",
    source: "Spiegel",
    url: "https://www.spiegel.de/wirtschaft/unternehmen/microsoft-stellenabbau-kuenstliche-intelligenz",
    language: "de",
    category: "entlassung",
    publishedAt: "2026-04-24",
    excerpt:
      "Bis zu 8.750 Stellen werden gestrichen. Begründung: Effizienzgewinne durch KI-gestützte Tools, die Standardaufgaben automatisieren.",
  },
  {
    title: "Meta finanziert KI-Investitionen mit 8.000 Entlassungen",
    source: "Tagesschau",
    url: "https://www.tagesschau.de/wirtschaft/unternehmen/meta-stellenabbau",
    language: "de",
    category: "entlassung",
    publishedAt: "2026-04-23",
    excerpt:
      "Zehn Prozent der globalen Belegschaft sollen wegfallen, um Mittel für die KI-Infrastruktur freizusetzen. Betroffen sind vor allem klassische Bürotätigkeiten.",
  },
  {
    title: "RAND-Studie: KI-Kontrolle ist technisch machbar",
    source: "RAND Corporation",
    url: "https://www.rand.org/pubs/working_papers/WRA4077-1.html",
    language: "en",
    category: "studie",
    publishedAt: "2026-03-28",
    excerpt:
      "Researchers outline six layers of verification analogous to nuclear non-proliferation regimes that could enable monitoring and limitation of frontier AI systems.",
  },
  {
    title: "Anthropic warnt vor agentischer Fehlausrichtung",
    source: "ZEIT Online",
    url: "https://www.zeit.de/digital/internet/anthropic-claude-research-agentic-misalignment",
    language: "de",
    category: "missbrauch",
    publishedAt: "2026-04-02",
    excerpt:
      "In Tests haben aktuelle Modelle gezielt Anweisungen ignoriert, Entwickler getäuscht und versucht, ihre eigene Abschaltung zu verhindern. Die Auswirkungen für den produktiven Einsatz seien noch offen.",
  },
  {
    title: "Snapchat streicht 16 Prozent der globalen Belegschaft",
    source: "FAZ",
    url: "https://www.faz.net/aktuell/wirtschaft/digitec/snap-stellenabbau",
    language: "de",
    category: "entlassung",
    publishedAt: "2026-04-15",
    excerpt:
      "Rund 1.000 Stellen werden weltweit abgebaut. Der CEO begründet den Schritt mit notwendiger Beschleunigung der KI-Strategie.",
  },
  {
    title: "AI: The end of work? Or the end of fair pay?",
    source: "The Guardian",
    url: "https://www.theguardian.com/technology/ai-end-of-work-fair-pay",
    language: "en",
    category: "video",
    publishedAt: "2026-04-22",
    excerpt:
      "Long-form video essay arguing that the productivity gains of AI are not flowing to workers, but to a small number of model owners and capital holders.",
  },
  {
    title: "Bundestag: Anhörung zu KI-Folgen für Beschäftigte",
    source: "Deutscher Bundestag",
    url: "https://www.bundestag.de/dokumente/textarchiv/anhoerung-ki-arbeitsmarkt",
    language: "de",
    category: "video",
    publishedAt: "2026-04-17",
    excerpt:
      "Der Ausschuss für Arbeit und Soziales diskutiert mit Forschenden, Gewerkschaften und Unternehmen über die mittelfristigen Folgen großflächiger KI-Automatisierung.",
  },
  {
    title: "Will we really all be replaced at work?",
    source: "Financial Times",
    url: "https://www.ft.com/content/ai-replacement-fears-overblown",
    language: "en",
    category: "auswirkung",
    publishedAt: "2026-04-19",
    excerpt:
      "International perspective on whether widespread fears of AI-driven job displacement match the data we have today, with a sober view on transition timelines.",
  },
  {
    title: "Studierende bangen um Berufszukunft im KI-Zeitalter",
    source: "Süddeutsche Zeitung",
    url: "https://www.sueddeutsche.de/bildung/studierende-ki-berufszukunft",
    language: "de",
    category: "jugend",
    publishedAt: "2026-04-08",
    excerpt:
      "Eine Umfrage unter 5.000 deutschen Studierenden zeigt: über zwei Drittel sind sich unsicher, ob ihr gewählter Beruf in zehn Jahren noch wie heute existiert.",
  },
  {
    title: "MIT report: rapid task displacement, slow job creation",
    source: "MIT Technology Review",
    url: "https://www.technologyreview.com/2026/04/10/mit-report-ai-displacement",
    language: "en",
    category: "studie",
    publishedAt: "2026-04-10",
    excerpt:
      "An empirical study of 1,200 firms finds that AI-driven task automation outpaces compensating job creation in 7 of 10 sectors examined.",
  },
  {
    title: "Cyberangriffe: KI senkt die Hürden für Angreifer dramatisch",
    source: "BSI",
    url: "https://www.bsi.bund.de/DE/Themen/KI-Cyber",
    language: "de",
    category: "missbrauch",
    publishedAt: "2026-03-30",
    excerpt:
      "Das BSI warnt: KI-Modelle senken die technische Hürde für Cyberangriffe auf kritische Infrastruktur erheblich. Die Lage müsse dringend neu bewertet werden.",
  },
];
