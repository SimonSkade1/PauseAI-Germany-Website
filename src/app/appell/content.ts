/* ============================================
   Appell Page - Structured Content Source
   ============================================ */

export interface QuoteDE {
  quote: string;
  name: string;
  chair: string;
}

export interface Signatory {
  name: string;
  chair: string;
}

export interface University {
  key: string;
  label: string;
  signatories: Signatory[];
}

export interface FAQ {
  q: string;
  a: string;
}

export interface Expert {
  quote: string;
  name: string;
  role: string;
  orgOrCountry: string;
  sourceUrl?: string;
}

export interface Petition {
  url: string;
  label: string;
  note?: string;
}

export interface Media {
  email: string;
  contactName?: string;
  note?: string;
}

export interface AppellContent {
  headline: string;
  paragraph: string;
  priorities: Array<{
    number: string;
    title: string;
    text: string;
  }>;
  conclusion: string;
}

// ============================================
// Content Exports
// ============================================

export const appell: AppellContent = {
  headline: "Appell zum KI-Gipfel 2026",
  paragraph:
    "Wir fordern die deutsche Delegation des bevorstehenden KI-Gipfels auf, sich öffentlich für ein globales Abkommen auszusprechen, das die folgenden Prioritäten verankert:",
  priorities: [
    {
      number: "1",
      title: "Rote Linien",
      text: "KI birgt das Risiko unvertretbarer globaler Auswirkungen. Es braucht klare Grenzen, die nicht überschritten werden dürfen.",
    },
    {
      number: "2",
      title: "Verbindliche Sicherheitsstandards",
      text: "Der unkontrollierte KI-Wettlauf führt zur Vernachlässigung von Sicherheit. Regulierung mit unabhängiger internationaler Durchsetzung ist erforderlich.",
    },
  ],
  conclusion: "Sicherheit und Fortschritt gehören zusammen.",
};

export const quotesDE: QuoteDE[] = [
  {
    quote:
      "Die Entwicklung von KI-Systemen, die menschliches Intelligenzniveau erreichen oder übertreffen könnten, stellt eine der größten Herausforderungen für die Menschheit dar. Wir müssen jetzt handeln.",
    name: "Prof. Dr. Dr. h.c. mult. Name",
    chair: "Inhaber des Lehrstuhls für Informatik",
  },
  {
    quote:
      "Ohne verbindliche internationale Sicherheitsstandards riskieren wir ein unkontrolliertes Wettrüsten mit existenziellen Risiken für unsere Gesellschaft.",
    name: "Prof. Dr. Name",
    chair: "Leiter Institut für Technologieethik",
  },
  {
    quote:
      "Deutschland hat die Verantwortung, bei kommenden KI-Gipfeln eine führende Rolle bei der Entwicklung globaler Sicherheitsstandards zu übernehmen.",
    name: "Prof. Dr. Name",
    chair: "Direktor Forschungszentrum",
  },
];

export const universities: University[] = [
  {
    key: "tum",
    label: "Technische Universität München",
    signatories: [
      { name: "Prof. Dr. Dr. h.c. mult. Name", chair: "Informatik" },
      { name: "Prof. Dr. Name", chair: "Philosophie" },
    ],
  },
  {
    key: "lmu",
    label: "Ludwig-Maximilians-Universität München",
    signatories: [
      { name: "Prof. Dr. Name", chair: "Informatik" },
      { name: "Prof. Dr. Name", chair: "Physik" },
    ],
  },
  {
    key: "hu-berlin",
    label: "Humboldt-Universität zu Berlin",
    signatories: [
      { name: "Prof. Dr. Name", chair: "Informatik" },
      { name: "Prof. Dr. Name", chair: "Philosophie" },
    ],
  },
  {
    key: "tu-berlin",
    label: "Technische Universität Berlin",
    signatories: [
      { name: "Prof. Dr. Name", chair: "Künstliche Intelligenz" },
      { name: "Prof. Dr. Name", chair: "Technikethik" },
    ],
  },
  {
    key: "rwth-aachen",
    label: "RWTH Aachen",
    signatories: [
      { name: "Prof. Dr. Name", chair: "Informatik" },
      { name: "Prof. Dr. Name", chair: "Maschinenbau" },
    ],
  },
  {
    key: "uni-heidelberg",
    label: "Universität Heidelberg",
    signatories: [
      { name: "Prof. Dr. Name", chair: "Informatik" },
    ],
  },
  {
    key: "kit",
    label: "Karlsruher Institut für Technologie",
    signatories: [
      { name: "Prof. Dr. Name", chair: "Informatik" },
      { name: "Prof. Dr. Name", chair: "Philosophie" },
    ],
  },
];

export const faq: FAQ[] = [
  {
    q: "Warum ist ein globales KI-Abkommen notwendig?",
    a: "Ein globales Abkommen ist notwendig, da KI-Entwicklung international stattfindet. Nationale Regeln allein reichen nicht aus, um ein unkontrolliertes Wettrüsten zu verhindern und verbindliche Sicherheitsstandards durchzusetzen.",
  },
  {
    q: "Was fordert der Appell konkret?",
    a: "Wir fordern die deutsche Delegation auf, sich für ein globales Abkommen einzusetzen, das klare rote Linien für KI-Entwicklung definiert und verbindliche Sicherheitsstandards etabliert, bevor KI-Systeme menschliches Intelligenzniveau erreichen.",
  },
];

export const experts: Expert[] = [
  {
    quote:
      "The stakes could not be higher: advanced AI could represent a profound change in the history of life on Earth.",
    name: "Stuart Russell",
    role: "Professor of Computer Science",
    orgOrCountry: "UC Berkeley",
    sourceUrl: "https://example.com",
  },
  {
    quote:
      "AI risk mitigation should be a global priority alongside other societal-scale risks such as pandemics and nuclear war.",
    name: "Geoffrey Hinton",
    role: "Turing Award Winner",
    orgOrCountry: "Canada",
  },
  {
    quote:
      "We need to coordinate internationally to ensure advanced AI systems are safe before they are deployed.",
    name: "Yoshua Bengio",
    role: "Turing Award Winner",
    orgOrCountry: "Canada",
  },
];

export const petition: Petition = {
  url: "https://change.org/pauseai-germany",
  label: "Jetzt unterschreiben",
  note: "Hilf uns, mehr Unterstützung für diesen Appell zu sammeln.",
};

export const media: Media = {
  email: "presse@pauseai.de",
  contactName: "Mustermann Max",
  note: "Für Interviews und Hintergrundgespräche kontaktieren Sie uns gerne.",
};
