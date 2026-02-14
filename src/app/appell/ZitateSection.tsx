import QuoteCarouselSection, { type QuoteCarouselItem } from "./QuoteCarouselSection";

const QUOTES: QuoteCarouselItem[] = [
  {
    text: "Mit KI erschaffen wir eine neue intelligente Spezies, und wir tun dies häufig nicht mit der nötigen Sorgfalt, sondern in einem Wettlauf darum, wer es am schnellsten schafft. KI bietet viele Möglichkeiten, aber ohne internationale Sicherheitsstandards riskieren wir, von intellektuell überlegenen KIs verdrängt zu werden.",
    name: "Andrzej J. Buras",
    subtitle: "Max-Planck-Medaillen-Träger (2020), Professor emeritus für Theoretische Physik an der TU München",
  },
  {
    text: "Bereits jetzt halte ich den Einfluss von KI für stark negativ: Auf die Menschheit, auf die Demokratie, auf den Planeten.",
    name: "Peter Scholze",
    subtitle: "Fields-Medaillen-Träger (2018), Direktor am Max-Planck-Institut für Mathematik in Bonn",
  },
  {
    text: "Als Dekan für Mathematik und Informatik habe ich die Begeisterung über KI-Fortschritte jeden Tag erlebt. Nicht zuletzt durch die intensive Auseinandersetzung im Rahmen unserer Vortragsreihe 'KI und Ethik', habe ich aber auch eine Vielzahl offener Sicherheitsbedenken und ethischer Fragestellungen erkannt, die mit jedem Fähigkeitssprung drängender werden. Ein internationaler Ordnungsrahmen ist daher längst überfällig.",
    name: "Otmar Venjakob",
    subtitle: "Professor für Mathematik an der Universität Heidelberg",
  },
];

export default function ZitateSection() {
  return (
    <QuoteCarouselSection heading="Zitate" quotes={QUOTES} dotsAriaLabel="Zitat auswählen" />
  );
}
