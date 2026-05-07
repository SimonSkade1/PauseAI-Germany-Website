export interface Testimonial {
  name: string;
  age?: number;
  profession: string;
  location?: string;
  story: string;
  approved: boolean;
}

export const STATIC_TESTIMONIALS: Testimonial[] = [
  {
    name: "Benjamin",
    age: 30,
    profession: "Bioinformatiker",
    location: "Halle (Saale)",
    story:
      "Über 2025 hinweg haben die KIs schon viel mehr Aufgaben übernommen. Seit Anfang 2026 habe ich jetzt keinen Code mehr selbst geschrieben. Auch die Datenanalyse und das Design von Tools habe ich zum größten Teil an die KIs abgegeben. Aus Techniksicht ist das erstmal super cool. Aber es lässt sich absehen, dass meine Arbeit in ein paar Jahren komplett automatisiert ist (bis auf die per Hand unterschriebenen Urlaubsanträge, gute deutsche Bürokratie). Sorgen mache ich mir auch, dass die Herstellung von Biowaffen für immer mehr Leute immer einfacher wird durch KI-Modelle. Und Cyberattacken sowieso. Gerade waren Supercomputer in der Schweiz, Italien und Deutschland offline, weil mit KI-Unterstützung eine Sicherheitslücke in allen Linux-Betriebssystemen gefunden wurde.\n\nDie KIs werden immer mehr Aufgaben übernehmen bis wir als Menschheit komplett vom System entkoppelt sind. Aber wir können es jetzt noch stoppen. Niemand ist gezwungen KI zu bauen!",
    approved: true,
  },
];
