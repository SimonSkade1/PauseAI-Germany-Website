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
  role?: string;
  orgOrCountry?: string;
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
// ============================================ */

export const petitionDE: Petition = {
  url: "https://www.change.org/p/ki-gipfel-deutschland-muss-f%C3%BCr-sicherheit-eintreten",
  label: "Jetzt unterschreiben",
};

export const expertsDE: Expert[] = [
  {
    quote: "Die Minderung des Risikos eines Aussterbens durch KI sollte eine globale Priorität sein, gleichrangig mit anderen Risiken gesamtgesellschaftlichen Ausmaßes wie Pandemien und Atomkrieg.",
    name: "Statement on AI Risk",
    role: "unterzeichnet von den 3 meistzitierten KI-Wissenschaftlern und den CEOs führender KI-Unternehmen",
  },
  {
    quote: "Ich habe vier Jahre im Sicherheitsteam von OpenAI gearbeitet und kann Ihnen mit Gewissheit sagen: KI-Unternehmen nehmen ihre Sicherheit nicht ernst genug, und sie sind nicht auf Kurs, kritische Sicherheitsprobleme zu lösen.",
    name: "Steven Adler",
    role: "ehemaliger Leiter der Dangerous Capability Evaluations bei OpenAI",
  },
  {
    quote: "Wir betonen: Einige KI-Systeme zeigen bereits heute die Fähigkeit und Neigung, die Sicherheits- und Kontrollbemühungen ihrer Entwickler zu untergraben.",
    name: "Konsens führender KI-Sicherheitsforscher",
    role: "darunter Stuart Russell und Andrew Yao",
    orgOrCountry: "International Dialogues on AI Safety, Shanghai 2025",
  },
];

export const faqDE: FAQ[] = [
  {
    q: "Was sind rote Linien für KI?",
    a: "Rote Linien verbieten KI-Systeme, die ein unannehmbares Risiko für uns alle bedeuten würden. Darunter fallen etwa Systeme, die: sich unkontrolliert selbst verbessern, Menschen systematisch täuschen, oder katastrophalen Missbrauch wie die Entwicklung von Biowaffen zulassen.",
  },
  {
    q: "Wie könnte ein internationales Abkommen durchgesetzt werden?",
    a: "Das Training der größten allgemeinen KI-Modelle erfordert heute riesige Rechenzentren mit spezialisierten Computerchips. Diese Konzentration macht eine Regulierung gut umsetzbar. Ein internationales Abkommen könnte auf drei Säulen basieren: 1) Internationale Aufsicht: Eine neue internationale Behörde überprüft die Einhaltung von Sicherheitsstandards in Zusammenarbeit mit nationalen Behörden. Whistleblower werden geschützt. 2) Rechenleistung sichtbar machen: Große Trainingsläufe werden registriert und beaufsichtigt. KI-Chips können technisch so gestaltet werden, dass ihre Nutzung nachvollziehbar wird. 3) Konsequenzen bei Verstößen: Staaten beschließen gemeinsame Sanktionen gegen Akteure, die rote Linien überschreiten, und entwickeln Strategien für den Umgang mit Krisen.",
  },
];
