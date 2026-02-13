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
  {
    key: "eth-zurich",
    label: "ETH Zürich",
    signatories: [
      { name: "Prof. Dr. Name", chair: "Informatik" },
      { name: "Prof. Dr. Name", chair: "Technikethik" },
    ],
  },
  {
    key: "uni-frankfurt",
    label: "Goethe-Universität Frankfurt",
    signatories: [
      { name: "Prof. Dr. Name", chair: "Informatik" },
      { name: "Prof. Dr. Name", chair: "Philosophie" },
    ],
  },
  {
    key: "tu-dresden",
    label: "Technische Universität Dresden",
    signatories: [
      { name: "Prof. Dr. Name", chair: "Informatik" },
      { name: "Prof. Dr. Name", chair: "Psychologie" },
    ],
  },
  {
    key: "lmf-munchen",
    label: "LMU München",
    signatories: [
      { name: "Prof. Dr. Name", chair: "Informatik" },
      { name: "Prof. Dr. Name", chair: "Philosophie" },
      { name: "Prof. Dr. Name", chair: "Physik" },
      { name: "Prof. Dr. Name", chair: "Neurobiologie" },
    ],
  },
  {
    key: "saarland",
    label: "Universität des Saarlandes",
    signatories: [
      { name: "Prof. Dr. Name", chair: "Informatik" },
      { name: "Prof. Dr. Name", chair: "Robotik" },
    ],
  },
  {
    key: "uni-bonn",
    label: "Rheinische Friedrich-Wilhelms-Universität Bonn",
    signatories: [
      { name: "Prof. Dr. Name", chair: "Informatik" },
      { name: "Prof. Dr. Name", chair: "Mathematik" },
    ],
  },
  {
    key: "uni-freiburg",
    label: "Albert-Ludwigs-Universität Freiburg",
    signatories: [
      { name: "Prof. Dr. Name", chair: "Informatik" },
      { name: "Prof. Dr. Name", chair: "Ethik" },
      { name: "Prof. Dr. Name", chair: "Neurowissenschaften" },
    ],
  },
  {
    key: "tu-darmstadt",
    label: "Technische Universität Darmstadt",
    signatories: [
      { name: "Prof. Dr. Name", chair: "Informatik" },
      { name: "Prof. Dr. Name", chair: "Kognitionswissenschaft" },
    ],
  },
  {
    key: "uni-hamburg",
    label: "Universität Hamburg",
    signatories: [
      { name: "Prof. Dr. Name", chair: "Informatik" },
      { name: "Prof. Dr. Name", chair: "Philosophie" },
    ],
  },
  {
    key: "uni-tubingen",
    label: "Eberhard Karls Universität Tübingen",
    signatories: [
      { name: "Prof. Dr. Name", chair: "Informatik" },
      { name: "Prof. Dr. Name", chair: "Medizinische Ethik" },
      { name: "Prof. Dr. Name", chair: "Neuroinformatik" },
    ],
  },
  {
    key: "uni-wuppertal",
    label: "Bergische Universität Wuppertal",
    signatories: [
      { name: "Prof. Dr. Name", chair: "Informatik" },
      { name: "Prof. Dr. Name", chair: "Security Engineering" },
    ],
  },
  {
    key: "uni-potsdam",
    label: "Universität Potsdam",
    signatories: [
      { name: "Prof. Dr. Name", chair: "Informatik" },
      { name: "Prof. Dr. Name", chair: "Data Science" },
    ],
  },
  {
    key: "tu-ilmenau",
    label: "Technische Universität Ilmenau",
    signatories: [
      { name: "Prof. Dr. Name", chair: "Informatik" },
      { name: "Prof. Dr. Name", chair: "Künstliche Intelligenz" },
    ],
  },
  {
    key: "uni-leipzig",
    label: "Universität Leipzig",
    signatories: [
      { name: "Prof. Dr. Name", chair: "Informatik" },
      { name: "Prof. Dr. Name", chair: "Wissenschaftstheorie" },
    ],
  },
  {
    key: "uni-erlangen",
    label: "Friedrich-Alexander-Universität Erlangen-Nürnberg",
    signatories: [
      { name: "Prof. Dr. Name", chair: "Informatik" },
      { name: "Prof. Dr. Name", chair: "Technikethik" },
    ],
  },
  {
    key: "uni-ulm",
    label: "Universität Ulm",
    signatories: [
      { name: "Prof. Dr. Name", chair: "Informatik" },
      { name: "Prof. Dr. Name", chair: "Medizinische Ethik" },
    ],
  },
  {
    key: "tu-kaiserslautern",
    label: "Technische Universität Kaiserslautern",
    signatories: [
      { name: "Prof. Dr. Name", chair: "Informatik" },
      { name: "Prof. Dr. Name", chair: "Robotik" },
    ],
  },
  {
    key: "uni-passau",
    label: "Universität Passau",
    signatories: [
      { name: "Prof. Dr. Name", chair: "Informatik" },
      { name: "Prof. Dr. Name", chair: "Künstliche Intelligenz" },
    ],
  },
  {
    key: "uni-bielefeld",
    label: "Universität Bielefeld",
    signatories: [
      { name: "Prof. Dr. Name", chair: "Informatik" },
      { name: "Prof. Dr. Name", chair: "Kognitionswissenschaft" },
    ],
  },
  {
    key: "tu-braunschweig",
    label: "Technische Universität Braunschweig",
    signatories: [
      { name: "Prof. Dr. Name", chair: "Informatik" },
      { name: "Prof. Dr. Name", chair: "Künstliche Intelligenz" },
    ],
  },
  {
    key: "uni-osnabruck",
    label: "Universität Osnabrück",
    signatories: [
      { name: "Prof. Dr. Name", chair: "Informatik" },
      { name: "Prof. Dr. Name", chair: "Kognitionswissenschaft" },
    ],
  },
  {
    key: "tu-chemnitz",
    label: "Technische Universität Chemnitz",
    signatories: [
      { name: "Prof. Dr. Name", chair: "Informatik" },
      { name: "Prof. Dr. Name", chair: "Maschinelles Lernen" },
    ],
  },
  {
    key: "magdeburg",
    label: "Universität Magdeburg",
    signatories: [
      { name: "Prof. Dr. Name", chair: "Informatik" },
      { name: "Prof. Dr. Name", chair: "Systemtechnik" },
    ],
  },
  {
    key: "uni-rostock",
    label: "Universität Rostock",
    signatories: [
      { name: "Prof. Dr. Name", chair: "Informatik" },
      { name: "Prof. Dr. Name", chair: "Technikethik" },
    ],
  },
  {
    key: "hfi-munchen",
    label: "Hochschule für Philosophie München",
    signatories: [
      { name: "Prof. Dr. Name", chair: "Philosophie" },
      { name: "Prof. Dr. Name", chair: "Ethik" },
    ],
  },
  {
    key: "b-it",
    label: "B-IT Bonn-Rhein-Sieg",
    signatories: [
      { name: "Prof. Dr. Name", chair: "Informatik" },
    ],
  },
  {
    key: "dfki",
    label: "Deutsches Forschungszentrum für Künstliche Intelligenz",
    signatories: [
      { name: "Prof. Dr. Name", chair: "KI-Forschung" },
      { name: "Prof. Dr. Name", chair: "Safety Engineering" },
      { name: "Prof. Dr. Name", chair: "Multiagentensysteme" },
    ],
  },
  {
    key: "mpis-berlin",
    label: "Max-Planck-Institut für Bildungsforschung",
    signatories: [
      { name: "Prof. Dr. Name", chair: "Kognitive Psychologie" },
      { name: "Prof. Dr. Name", chair: "Lernforschung" },
    ],
  },
  {
    key: "fhi-munchen",
    label: "Forschungsinstitut für Philosophie München",
    signatories: [
      { name: "Prof. Dr. Name", chair: "Technikphilosophie" },
      { name: "Prof. Dr. Name", chair: "Ethik" },
    ],
  },
  {
    key: "weizenbaum",
    label: "Weizenbaum-Institut für die vernetzte Gesellschaft",
    signatories: [
      { name: "Prof. Dr. Name", chair: "Informatik und Gesellschaft" },
      { name: "Prof. Dr. Name", chair: "KI-Ethik" },
    ],
  },
  {
    key: "uni-graz",
    label: "Karl-Franzens-Universität Graz",
    signatories: [
      { name: "Prof. Dr. Name", chair: "Informatik" },
      { name: "Prof. Dr. Name", chair: "Kognitionswissenschaft" },
    ],
  },
  {
    key: "tu-wien",
    label: "Technische Universität Wien",
    signatories: [
      { name: "Prof. Dr. Name", chair: "Informatik" },
      { name: "Prof. Dr. Name", chair: "Automatentheorie" },
    ],
  },
  {
    key: "uni-zurich",
    label: "Universität Zürich",
    signatories: [
      { name: "Prof. Dr. Name", chair: "Informatik" },
      { name: "Prof. Dr. Name", chair: "Philosophie" },
    ],
  },
  {
    key: "epfl",
    label: "École Polytechnique Fédérale de Lausanne",
    signatories: [
      { name: "Prof. Dr. Name", chair: "Informatik" },
    ],
  },
  {
    key: "uni-mannheim",
    label: "Universität Mannheim",
    signatories: [
      { name: "Prof. Dr. Name", chair: "Informatik" },
      { name: "Prof. Dr. Name", chair: "Data Science" },
    ],
  },
  {
    key: "tu-munchen-weihenstephan",
    label: "TU München Weihenstephan",
    signatories: [
      { name: "Prof. Dr. Name", chair: "Informatik" },
      { name: "Prof. Dr. Name", chair: "Robotik" },
    ],
  },
  {
    key: "uni-gottingen",
    label: "Georg-August-Universität Göttingen",
    signatories: [
      { name: "Prof. Dr. Name", chair: "Informatik" },
      { name: "Prof. Dr. Name", chair: "Philosophie" },
      { name: "Prof. Dr. Name", chair: "Kognitionswissenschaft" },
    ],
  },
  {
    key: "uni-mainz",
    label: "Johannes Gutenberg-Universität Mainz",
    signatories: [
      { name: "Prof. Dr. Name", chair: "Informatik" },
      { name: "Prof. Dr. Name", chair: "Historisches Institut" },
    ],
  },
  {
    key: "uni-wurzburg",
    label: "Julius-Maximilians-Universität Würzburg",
    signatories: [
      { name: "Prof. Dr. Name", chair: "Informatik" },
      { name: "Prof. Dr. Name", chair: "Robotik" },
    ],
  },
  {
    key: "tuc",
    label: "Technische Universität Chemnitz",
    signatories: [
      { name: "Prof. Dr. Name", chair: "Informatik" },
      { name: "Prof. Dr. Name", chair: "Künstliche Intelligenz" },
    ],
  },
  {
    key: "hsu-harburg",
    label: "Hamburg University of Technology",
    signatories: [
      { name: "Prof. Dr. Name", chair: "Informatik" },
      { name: "Prof. Dr. Name", chair: "Künstliche Intelligenz" },
    ],
  },
  {
    key: "rwth-aachen-2",
    label: "RWTH Aachen - Weitere",
    signatories: [
      { name: "Prof. Dr. Name", chair: "Philosophie" },
      { name: "Prof. Dr. Name", chair: "Medizinische Ethik" },
    ],
  },
  {
    key: "tum-2",
    label: "TUM - Weitere",
    signatories: [
      { name: "Prof. Dr. Name", chair: "Management" },
      { name: "Prof. Dr. Name", chair: "Soziologie" },
      { name: "Prof. Dr. Name", chair: "Wissenschaftstheorie" },
    ],
  },
  {
    key: "hpi-potsdam",
    label: "Hasso Plattner Institut",
    signatories: [
      { name: "Prof. Dr. Name", chair: "Informatik" },
      { name: "Prof. Dr. Name", chair: "Data Engineering" },
    ],
  },
  {
    key: "caspers",
    label: "CASPER - Cybersecurity研究与教育",
    signatories: [
      { name: "Prof. Dr. Name", chair: "Cybersecurity" },
      { name: "Prof. Dr. Name", chair: "Privacy" },
    ],
  },
  {
    key: "tuhh",
    label: "Technische Universität Hamburg",
    signatories: [
      { name: "Prof. Dr. Name", chair: "Informatik" },
      { name: "Prof. Dr. Name", chair: "Technikethik" },
    ],
  },
  {
    key: "luh",
    label: "Leuphana Universität Lüneburg",
    signatories: [
      { name: "Prof. Dr. Name", chair: "Digitalisierung" },
      { name: "Prof. Dr. Name", chair: "Bildungsforschung" },
    ],
  },
  {
    key: "jacobs",
    label: "Jacobs University Bremen",
    signatories: [
      { name: "Prof. Dr. Name", chair: "Informatik" },
      { name: "Prof. Dr. Name", chair: "Data Science" },
    ],
  },
  {
    key: "uni-bayreuth",
    label: "Universität Bayreuth",
    signatories: [
      { name: "Prof. Dr. Name", chair: "Informatik" },
      { name: "Prof. Dr. Name", chair: "Philosophie" },
    ],
  },
  {
    key: "tu-clausthal",
    label: "Technische Universität Clausthal",
    signatories: [
      { name: "Prof. Dr. Name", chair: "Informatik" },
      { name: "Prof. Dr. Name", chair: "Robotik" },
    ],
  },
  {
    key: "uni-lubeck",
    label: "Universität zu Lübeck",
    signatories: [
      { name: "Prof. Dr. Name", chair: "Informatik" },
      { name: "Prof. Dr. Name", chair: "Medizinische Informatik" },
    ],
  },
  {
    key: "uni-regensburg",
    label: "Universität Regensburg",
    signatories: [
      { name: "Prof. Dr. Name", chair: "Informatik" },
      { name: "Prof. Dr. Name", chair: "Praktische Informatik" },
    ],
  },
  {
    key: "uni-siegen",
    label: "Universität Siegen",
    signatories: [
      { name: "Prof. Dr. Name", chair: "Informatik" },
      { name: "Prof. Dr. Name", chair: "Wirtschaftsinformatik" },
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
