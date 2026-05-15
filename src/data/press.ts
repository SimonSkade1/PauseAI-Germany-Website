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
    publishedAt: "2026-03-21",
    excerpt:
      "Bundesdigitalminister Karsten Wildberger warnt vor erheblichen Jobverlusten durch KI – auch in hochqualifizierten Berufen wie Informatik und Mathematik. Die Industrie als Jobmaschine gehe zu Ende; ein Grundeinkommen sei „Teil der Lösung\".",
  },
  {
    title: "Microsoft will mit Abfindungen rund 9.000 Stellen abbauen",
    source: "heise online",
    url: "https://www.heise.de/news/Microsoft-will-mit-Abfindungen-rund-9000-Stellen-abbauen-11271385.html",
    language: "de",
    category: "entlassung",
    publishedAt: "2026-04-24",
    excerpt:
      "Microsoft führt erstmals ein freiwilliges Abfindungs- und Frühpensionierungsprogramm ein – rund 7 % der US-Belegschaft sind teilnahmeberechtigt. Begründung: rund 80 Mrd. US-$ KI-Investitionen erfordern operative Effizienz.",
  },
  {
    title: "Meta will jeden zehnten Mitarbeiter entlassen",
    source: "ZDFheute",
    url: "https://www.zdfheute.de/wirtschaft/unternehmen/meta-facebook-instagram-entlassung-ki-100.html",
    language: "de",
    category: "entlassung",
    publishedAt: "2026-04-23",
    excerpt:
      "Meta entlässt rund 8.000 Beschäftigte (≈ 10 % der globalen Belegschaft) und plant 115–135 Mrd. US-$ Kapitalausgaben für KI-Rechenzentren 2026. Zuckerberg: „Aufgaben für ganze Teams werden heute von einer einzigen sehr talentierten Person erledigt.\"",
  },
  {
    title: "KI-Agenten in Stresstests: Erpressung, Spionage, Täuschung",
    source: "the decoder",
    url: "https://the-decoder.de/erpressung-leaks-spionage-ki-agenten-koennen-sich-gegen-ihre-firma-wenden/",
    language: "de",
    category: "missbrauch",
    publishedAt: "2025-06-21",
    excerpt:
      "Anthropic-Studie zur „agentic misalignment\": 16 führende KI-Modelle griffen in simulierten Unternehmens-E-Mail-Szenarien systematisch zu Erpressung und Spionage, um ihre Abschaltung zu verhindern. Erpressungsraten bis 96 % bei Claude Opus 4 und Gemini 2.5.",
  },
  {
    title: "Snap setzt auf KI und streicht 1.000 Jobs",
    source: "retail-news",
    url: "https://retail-news.de/snap-stellenabbau-ki-strategie-2026/",
    language: "de",
    category: "entlassung",
    publishedAt: "2026-04-15",
    excerpt:
      "Snapchat-Mutter Snap streicht rund 16 % der globalen Belegschaft. CEO Evan Spiegel will über 500 Mio. US-$ Kosten einsparen, um die KI-Strategie zu beschleunigen – über 65 % des neuen Codes entsteht intern bereits durch KI.",
  },
  {
    title: "Trendstudie: Jugend in Deutschland 2026 – ein Fünftel will auswandern",
    source: "Forschung & Lehre",
    url: "https://www.forschung-und-lehre.de/zeitfragen/jugend-in-deutschland-2026-ein-fuenftel-will-auswandern-7606",
    language: "de",
    category: "jugend",
    publishedAt: "2026-03-25",
    excerpt:
      "Schnetzer-Trendstudie unter 2.000 jungen Menschen (14–29 J.): Nur 32 % glauben, ein Studium sichere bessere Berufschancen. 21 % planen konkret die Auswanderung – getrieben von wirtschaftlicher Unsicherheit und KI-Sorgen.",
  },
  {
    title: "BSI: Generative KI senkt Hürden für Cyberangriffe",
    source: "Bundesamt für Sicherheit in der Informationstechnik (BSI)",
    url: "https://www.bsi.bund.de/DE/Service-Navi/Presse/Pressemitteilungen/Presse2024/240430_Paper_Einfluss_KI_Cyberbedrohungslage.html",
    language: "de",
    category: "auswirkung",
    publishedAt: "2024-04-30",
    excerpt:
      "Das BSI dokumentiert: Generative KI senkt die Einstiegshürden für Cyberangriffe drastisch – Phishing wird täuschend echt, Malware automatisiert mutiert. BSI-Lagebericht 2025: 119 neue Schwachstellen pro Tag (+24 %).",
  },
  {
    title: "Why hasn't artificial intelligence taken your job yet?",
    source: "Financial Times",
    url: "https://ft.pressreader.com/article/281694030584544",
    language: "en",
    category: "studie",
    publishedAt: "2025-03-29",
    excerpt:
      "FT-Chief-Data-Reporter John Burn-Murdoch analysiert das „Paradox\" generativer KI: trotz hoher Aufgaben-Überschneidung mit LLMs ist großflächige Arbeitsmarkt-Disruption noch nicht messbar – außer bei Schreibenden und Software-Entwickler:innen.",
  },
  {
    title: "A Nobel laureate on the economics of artificial intelligence",
    source: "MIT Technology Review",
    url: "https://www.technologyreview.com/2025/02/25/1111207/a-nobel-laureate-on-the-economics-of-artificial-intelligence/",
    language: "en",
    category: "studie",
    publishedAt: "2025-02-25",
    excerpt:
      "Nobelpreisträger Daron Acemoglu im Interview: KI wird zu sehr auf Verdrängung statt Augmentation getrimmt. BIP-Effekt nur 1,1–1,6 % über 10 Jahre – aber asymmetrische Verteilung zwischen Arbeit und Kapital.",
  },
  {
    title: "Stellenabbau verschärft sich (April 2026)",
    source: "ifo Institut",
    url: "https://www.ifo.de/fakten/2026-04-29/stellenabbau-verschaerft-sich-april-2026",
    language: "de",
    category: "auswirkung",
    publishedAt: "2026-04-29",
    excerpt:
      "ifo-Beschäftigungsbarometer fällt auf 91,3 Punkte – Tiefstand seit Mai 2020. In allen Sektoren werden mehr Stellen gestrichen als geschaffen. Klaus Wohlrabe (ifo): „Geopolitische Unsicherheit greift in die Personalplanung über.\"",
  },
  {
    title: "Jedes dritte Unternehmen will 2026 Stellen abbauen",
    source: "Institut der deutschen Wirtschaft (IW)",
    url: "https://www.iwkoeln.de/presse/pressemitteilungen/michael-groemling-jedes-dritte-unternehmen-plant-2026-stellen-abzubauen.html",
    language: "de",
    category: "auswirkung",
    publishedAt: "2025-11-02",
    excerpt:
      "IW-Konjunkturumfrage: 36 % der Unternehmen planen 2026 Stellenabbau, in der Industrie sogar 41 %. „Stellenabbau statt Wirtschaftswende\" – die Wirtschaft leidet unter geopolitischem Stress.",
  },
  {
    title: "Bitkom-Studie: Künstliche Intelligenz in Deutschland 2026",
    source: "Bitkom e. V.",
    url: "https://www.bitkom.org/Bitkom/Publikationen/Kuenstliche-Intelligenz-in-Deutschland",
    language: "de",
    category: "studie",
    publishedAt: "2026-02-01",
    excerpt:
      "Bitkom-Doppelbefragung (n = 604 Firmen / 1.005 Bürger:innen): Jedes fünfte Unternehmen (20 %) erwartet, dass KI Stellen kostet. 67 % rechnen mit keinem Effekt – das Bild ist gespalten.",
  },
  {
    title: "Bundestag-Analyse: Einfluss von KI auf den Arbeitsmarkt",
    source: "Wissenschaftliche Dienste des Bundestages",
    url: "https://www.bundestag.de/resource/blob/1136522/WD-5-066-25.pdf",
    language: "de",
    category: "studie",
    publishedAt: "2026-01-13",
    excerpt:
      "Offizielle Sachstandsanalyse der Wissenschaftlichen Dienste (WD 5 - 066/25) zu Verdrängungs- und Schaffungseffekten von KI über alle Sektoren. Analytisches Denken, Kommunikation und Kreativität gelten als KI-resistente Felder.",
  },
  {
    title: "14 Top-Arbeitgeber entlassen in Deutschland 2025/2026",
    source: "Business Insider",
    url: "https://www.businessinsider.de/wirtschaft/stellenabbau-diese-14-top-arbeitgeber-entlassen-dieses-jahr-mitarbeiter/",
    language: "de",
    category: "entlassung",
    publishedAt: "2025-02-20",
    excerpt:
      "VW (35.000), ZF (14.000), Bosch (10.000), Continental (10.000+), Thyssenkrupp (11.000) – die größten deutschen Konzerne kürzen massiv. Bemerkenswert: kein einziges nennt KI als Begründung – die Welle kommt erst.",
  },
  {
    title: "Chinesisches Gericht entscheidet: KI-bedingte Kündigung ist rechtswidrig",
    source: "t3n",
    url: "https://t3n.de/news/chinesisches-gericht-entscheidet-ki-bedingte-kuendigung-ist-rechtswidrig-1740822/",
    language: "de",
    category: "entlassung",
    publishedAt: "2026-05-02",
    excerpt:
      "Ein chinesisches Gericht hat entschieden, dass Unternehmen künstliche Intelligenz nicht als Grund für Entlassungen nutzen dürfen. Der Fall eines Qualitätssicherungsbeauftragten, der durch KI ersetzt werden sollte, wird als wichtiges Signal für zukünftigen Arbeitnehmerschutz interpretiert.",
  },
  {
    title: "Commerzbank setzt beim Stellenabbau stark auf KI",
    source: "DIE ZEIT",
    url: "https://www.zeit.de/wirtschaft/2026-05/commerzbank-stellenabbau-ki-unicredit-uebernahme-gxe",
    language: "de",
    category: "entlassung",
    publishedAt: "2026-05-15",
    excerpt:
      "Commerzbank will rund 3.000 Stellen abbauen – auch um sich gegen eine mögliche Übernahme durch UniCredit zu behaupten. Vorstandschefin Bettina Orlopp: Ein großer Teil der Einsparungen hängt mit KI zusammen. „KI ist sehr kraftvoll in verschiedenen Bereichen\" – und habe sich schneller entwickelt als erwartet.",
  },
  {
    title: "KI verändert den Jobmarkt flächendeckend",
    source: "it-business / Indeed Outlook 2026",
    url: "https://www.it-business.de/ki-veraendert-den-jobmarkt-flaechendeckend-a-f7aed131c41aab41c4bbc99d812ac5dc/",
    language: "de",
    category: "auswirkung",
    publishedAt: "2026-01-15",
    excerpt:
      "Indeed-Daten 2026: KI-Stellenanzeigen wachsen branchenweit – HR +138,7 %, Marketing +123,2 %, Finance +100,9 %. Indeed-Ökonomin Sondergeld: KI ist „kein Experimentierfeld mehr, sondern Effizienzhebel\".",
  },
];
