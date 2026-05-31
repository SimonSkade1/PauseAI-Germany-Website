export interface Testimonial {
  name: string;
  location?: string;
  story: string;
  approved: boolean;
}

export const STATIC_TESTIMONIALS: Testimonial[] = [
  {
    name: "Benjamin",
    location: "Halle (Saale)",
    story:
      "Über 2025 hinweg haben die KIs schon viel mehr Aufgaben übernommen. Seit Anfang 2026 habe ich jetzt keinen Code mehr selbst geschrieben. Auch die Datenanalyse und das Design von Tools habe ich zum größten Teil an die KIs abgegeben. Aus Techniksicht ist das erstmal super cool. Aber es lässt sich absehen, dass meine Arbeit in ein paar Jahren komplett automatisiert ist (bis auf die per Hand unterschriebenen Urlaubsanträge, gute deutsche Bürokratie). Sorgen mache ich mir auch, dass die Herstellung von Biowaffen für immer mehr Leute immer einfacher wird durch KI-Modelle. Und Cyberattacken sowieso. Gerade waren Supercomputer in der Schweiz, Italien und Deutschland offline, weil mit KI-Unterstützung eine Sicherheitslücke in allen Linux-Betriebssystemen gefunden wurde.\n\nDie KIs werden immer mehr Aufgaben übernehmen bis wir als Menschheit komplett vom System entkoppelt sind. Aber wir können es jetzt noch stoppen. Niemand ist gezwungen KI zu bauen!",
    approved: true,
  },
  {
    name: "Simon Wahl",
    story:
    "Ich arbeite in der außerschulischen Jugendbildung. In der Vorbereitung meiner Bildungsveranstaltungen ist KI eine enorme Hilfe. Vieles kann sie bereits besser (und vor allem schneller) als ich. Aber vieles von meinem Job ist auch persönliche zwischenmenschliche Interaktion. Das kann die KI zwar teilweise auch ganz gut, aber Menschen bevorzugen oft eben noch den direkten Kontakt mit anderen Menschen. Solange das so bleibt, ist mein Job relativ sicher. Aber die Kolleginnen in der Verwaltung sehe ich bereits jetzt zunehmend bedroht. In wenigen Jahren sind ihre Jobs fast komplett automatisierbar.",
    approved: true,
  },
  {
    name: "Markus Weiss",
    location: "Weiden",
    story:
    "Ich habe Informatik studiert mit Schwerpunkt KI. Danach viele Jahre gearbeitet als Software-Entwickler. Mein Job ist derzeit schon weitgehend automatisiert worden mit den neuen KI-Agenten-Tools. Ich schreibe keinen Code mehr selbst, sondern lese nur noch was die KI schreibt und versuche Fehler zu finden. Schon jetzt fällt es mir schwer da noch die Übersicht zu behalten. Diese Automatisierung wird sich in den nächsten Jahren auf sämtliche Bürojobs ausbreiten. Die damit einhergehende Welle an Arbeitslosigkeit wird aber nicht das größte Problem werden. Führende Wissenschaftler warnen, dass KI schlauer als wir Menschen werden kann und eigene Ziele haben kann. Ich mache mir große Sorgen, wie wir neben diese neuen Spezies weiterhin die Kontrolle über den Planeten behalten können.",
    approved: true,
  },
  {
    name: "Britta",
    story:
    "Eins meiner Kinder arbeitet als Contentmanager für eine Social-media-Firma. Dort wurden in letzter Zeit viele Mitarbeiter entlassen, vorzugsweise die, die noch in der Probezeit waren. Die erfahreneren Mitarbeiter konnten bleiben, mussten dann zum Teil andere Aufgaben verlassen, um zur Moderation von Inhalten zurückzukehren.",
    approved: true,
  },
  {
    name: "David",
    location: "Bonn",
    story:
    "Wie auch viele andere Leute im Tech-Sektor war ich zuerst massiv begeistert von KI und den Möglichkeiten, die so eine Technologie bringen kann. Leider mustste ich bei intensiverer Beschäftigung mit dem Thema feststellen, dass es noch viele ungelöste technische und ethische Fragen gibt, die nach wie vor ignoriert oder nicht mit der notwendigen Sorgfalt angegangen werden, um die Risiken, die mit KI einhergehen, auf ein akzeptables Maß einzudämmen.",
    approved: true,
  },
  {
    name: "Sohkie",
    location: "",
    story:
    "Eine Bekannte Dame war Texterin und hat Webseiten konzeptioniert. Seit 2024 ist die Auftragslage extrem eingebrochen. Als Sie bei einem langjährigen Kunden nachgefragt hat, wo denn die Aufträge bleiben, wurde ihr eröffnet, daß man eine KI mit ihren Texten gefüttert hatte und sie nicht länger benötigt werden. Sie kann nunmehr nicht mehr von ihrem Beruf leben. Sie gibt jetzt Workshops über Aufklärung und Risiken in Verbindung mit KI. Doch fragt sie sich wie lange das noch geht.",
    approved: true,
  },
];
