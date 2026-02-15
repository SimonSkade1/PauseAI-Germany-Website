import QuoteCarouselSection, { type QuoteCarouselItem } from "./QuoteCarouselSection";

const EXPERT_QUOTES: QuoteCarouselItem[] = [
  {
    text: "Die Minderung des Risikos eines Aussterbens durch KI sollte eine globale Priorität sein, gleichrangig mit anderen Risiken gesamtgesellschaftlichen Ausmaßes wie Pandemien und Atomkrieg.",
    name: "Statement on AI Risk",
    subtitle: "unterzeichnet von den 2 meistzitierten KI-Wissenschaftlern und den CEOs führender KI-Unternehmen",
  },
  {
    text: "Ich habe vier Jahre im Sicherheitsteam von OpenAI gearbeitet und kann Ihnen mit Gewissheit sagen: KI-Unternehmen nehmen ihre Sicherheit nicht ernst genug, und sie sind nicht auf Kurs, kritische Sicherheitsprobleme zu lösen.",
    name: "Steven Adler",
    subtitle: "ehemaliger Leiter der Dangerous Capability Evaluations bei OpenAI",
  },
  {
    text: "Wir betonen: Einige KI-Systeme zeigen bereits heute die Fähigkeit und Neigung, die Sicherheits- und Kontrollbemühungen ihrer Entwickler zu untergraben.",
    name: "Konsens führender KI-Sicherheitsforscher",
    subtitle: "darunter Stuart Russell und Andrew Yao · International Dialogues on AI Safety, Shanghai 2025",
  },
];

export default function ExpertenSection() {
  return (
    <QuoteCarouselSection
      heading="Internationale Expert:innen"
      quotes={EXPERT_QUOTES}
      dotsAriaLabel="Expertenzitat auswählen"
    />
  );
}
