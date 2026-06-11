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
  {
    name: "Henrik Jacobsen",
    location: "Osnabrück",
    story:
      "Ich sorge mich stark um die Zukunft meiner Freunde und meiner Familie. Die großen KI-Fimen in den USA werben damit möglichst schnell eine Superintelligenz schaffen zu wollen. Auch wenn niemand weiß, ob eine starke Allgemeine KI in den nächsten Jahren möglich sein wird, halte ich es für absolut unverantwortlich, diese Entwicklung politisch aber auch gesellschaftlich zu dulden. Alle Expertinnen und Experten sind sich einig, dass wir eine solche Technologie aktuell nicht kontrollieren können und diese Firmen mit der Zukunft der gesamten Menschheit spielen.",
    approved: true,
  },
  {
    name: "Pia",
    location: "Osnabrück",
    story:
      "KI bringt einfach mit den aktuellen Regulationen viel mehr Risiken als Vorteile mit sich. Besonders große Sorgen mache ich mir um die autonomen Waffen, die mit KI möglich sind.",
    approved: true,
  },
  {
    name: "Lennard",
    story:
      "Zuallererst und am größten ist die Sorge nach weiter grassierender Ungleichheit und Verarmung - trotz Effizienzgewinnen.\n\nDieses wahrscheinliche Szenario, dass sich eine vergleichsweise kleine Gruppe ein Werkzeug geschaffen hat, um mit dem Wissen und der Kreativität anderer enorme Macht und später dann auch Reichtum anzuhäufen, gehört asap kontrolliert. Solange es noch geht. Demokratische Institutionen sind offensichtlich nicht ganz so stabil, wie wir uns das immer eingeredet haben.\n\nAnsonsten der übliche technische Kram: Besorgnis über die digitale Sicherheit unserer modernen Welt. Seien es Banken, Behörden aber auch Infrastruktur und Energieversorgung. Kriegsführung, Überwachung und irgendwann auch Stagnation in der Forschung. Letzteres vor allem durch AI-Slop und -Inzucht. Ich glaube nicht, dass wir in der geistigen Spitze der Menschheit dümmer werden werden.\n\nMeinen eigenen Job sehe ich auf absehbare Zeit übrigens nicht gefährdet, allerdings würde ich in naher Zukunft als Berufseinsteiger nicht mehr so einfach eine vergleichbare Stelle finden.",
    approved: true,
  },
  {
    name: "Christian Fischer",
    story:
      "Ich beobachte die Entwicklung von KI seit über 2 Jahren und frage mich, was macht sie mit uns Menschen und den nachfolgenden Generationen? Wem nützt sie? Wem schadet sie? Wer kontrolliert sie (wenn überhaupt)? Zu welchem Zweck? Wer trägt die Verantwortung der Konsequenzen? Die Entwicklung geht schneller voran, als wir die entscheidenden Fragen beantworten können. Das halte ich für höchst bedenklich. Deshalb finde ich das Bemühen und die Forderung, die Entwicklung zu pausieren für enorm wichtig und absolut Wert zu unterstützen.",
    approved: true,
  },
  {
    name: "Simon Skade",
    story:
      "Ich habe 3,5 Jahre an KI-Sicherheit geforscht und denke es ist relativ wahrscheinlich dass die Menschheit aussterben wird wenn wir kein internationales KI-Sicherheitsabkommen abschließen. Wir können die Entwicklung unkontrollierbarer KI noch stoppen, aber dafür müssen wir aufwachen und aktiv werden.",
    approved: true,
  },
  {
    name: "Karen",
    location: "Dresden",
    story:
      "Es hat mich sehr schockiert, zu erfahren, dass KI-Experten wie Geoffrey Hinton KI für eine existenzielle Bedrohung für die Menschheit halten. Obwohl viele Entwickler der Technologie selbst sich Sorgen darüber machen, investieren KI-Firmen kaum Ressourcen in Sicherheit - sondern oft sogar in Lobbyarbeit gegen gesetzliche Regulierung. Es gibt immer noch kein Gesetz, das unabhängige Sicherheitsüberprüfungen vorschreibt, bevor ein neues Modell oder System zum Einsatz kommt. Schon jetzt sehen wir katastrophale Folgen: Chatbots, die Leute mit psychischen Erkrankungen noch weiter in die Krise treiben bis hin zum Suizid, und Bildgeneratoren, die Leute entkleiden. Obwohl solche Verhaltensweisen mit angemessenen Sicherheitsmaßnahmen größtenteils verhindert werden könnten, tragen die KI-Firmen für ihr verantwortungsloses Vorgehen keine Konsequenzen! Da habe ich wenig Vertrauen, dass das besser wird, sobald KI Fähigkeiten erreicht, mit denen sie der Menschheit als Ganzes gefährlich werden kann.\n\nIch erwarte, dass die Welt sich immer schneller verändern wird, und da ist es kaum abzuschätzen, wie die Zukunft aussehen wird. Deshalb bin ich auch verunsichert, welcher Berufs- und Lebensweg für mich Sinn ergibt. Gerade bei langfristigen Projekten ist es unmöglich zu wissen, ob sie sich auszahlen werden.",
    approved: true,
  },
  {
    name: "Stefan",
    story:
      "Ich bin davon überzeugt, dass bereits die heutigen KI-Modelle unsere kritische Infrastruktur wie Stromnetz, Wassernetz, Finanzsystem und Internet lahmlegen könnten. Und es könnte bereits morgen passieren.",
    approved: true,
  },
  {
    name: "Hauke Harders",
    location: "Freiburg",
    story:
      "Ich studiere Politikwissenschaften und möchte langfristig gerne in einem Ministerium arbeiten. Meine Mutter hat mich letztens gefragt, ob ich mir Sorgen mache, dass mein potentieller Job durch KI ersetzt wird und ich konnte nur antworten, dass ich darauf hoffe, dass die Behörden KI nicht so schnell einsetzen wie es die Unternehmen tun werden. So hoffe ich, einen Job zu finden nach meinem Master.\n\nBei meinen Brüdern bin ich froh, dass sie mit Physiotherapie und Landwirtschaft in Bereichen arbeiten, wo die Aufgaben nicht nur am Rechner erledigt werden. Trotz eines langen Studiums werde ich der in meiner Familie sein, dessen Job am gefährdetsten ist.",
    approved: true,
  },
  {
    name: "Patric Rommel",
    location: "Schlierbach",
    story:
      "Ich beobachte mit Sorge, wie rapide sich die Fähigkeiten von KI-Systemen entwickeln, und verhältnismäßig klein die öffentliche Diskussion darum ist. Unabhängig davon wie sich die Technologie kurzfristig entwickelt, halte ich es mittelfristig für fast sicher, dass sie enorme gesellschaftliche Veränderungen bringen wird. Um diese zu bewältigen, ist es dringend notwendig, dass es zu einem viel umfangreicheren öffentlichen Diskurs dazu kommt, wie wir damit umgehen wollen. Wie sieht unsere Zukunft als Menschen in einer Welt aus, in der es Maschinen gibt die uns kognitiv weit überlegen sind? Wie können wir die Entwicklung dieser Technologie zu unserem Wohle lenken? Dürfen wir zulassen, dass einige wenige Firmen aus den USA in einer solchen Geschwindigkeit eine solch mächtige Technologie auf die Menschheit loslässt, bevor die gesellschaftlichen Rahmenbedingungen geschaffen sind, diese Veränderungen aufzufangen und zu kanalisieren?\n\nUnd all das setzt voraus, dass diese Technologie von uns beherrschbar bleibt. Daran zweifeln inzwischen immer mehr auch sehr prominente Experten und Wissenschaftler. Die Technologie-Konzerne spielen mit dem Feuer, und wir brauchen dringend mehr Augen, die sich auf das richten, was dort geschieht.",
    approved: true,
  },
  {
    name: "Henning",
    story:
      "Es geht ja nicht darum, dass manche Jobs momentan stärker in Gefahr sind, als andere - sondern dass langfristig alle Tätigkeiten durch Maschinen übernommen werden können. Wenn durch Menschen keine Wertschöpfung mehr passiert, wie kann man das Geld verdienen? Unser gesamtes Wirtschaftssystem ist nicht darauf ausgelegt. Und wie Menschen damit zurecht kommen, nicht mehr klar eine Aufgabe/Sinn/Zweck zu haben, wissen wir überhaupt nicht.",
    approved: true,
  },
  {
    name: "Jens",
    location: "Bonn",
    story:
      "Ich habe ein KI-Abo, das ich bei der Arbeit benutze, und merke, wie übermenschlich intelligent die neuen, großen Modelle inzwischen geworden sind, und wie sie von Monat zu Monat intelligenter werden. Einerseits bin ich manchmal euphorisch, weil ich mit der KI viel lerne und sich die Produktivität und Qualität meiner Arbeit mindestens verdoppelt hat. Andererseits mache mich mir Sorgen, wie es in Zukunft weitergeht.\n\nWer sich der KI verweigert, fällt im Wettbewerb zurück. Dadurch machen wir uns immer mehr von KI abhängig.\n\nEs spricht im Moment alles dafür, dass die Fähigkeiten der KI weiter schnell wachsen werden. Ich kann mir nur schwer vorstellen, wie es der Menschheit gelingen soll, diese Geister, die wir gerufen haben, dauerhaft zu kontrollieren.\n\nMeine aktuelle Stelle ist befristet. Und ich erwarte, dass es schwierig werden wird, eine neue Stelle zu finden.",
    approved: true,
  },
  {
    name: "Jan Czerny",
    location: "Denzlingen",
    story:
      "Ich bin Vater von zwei Söhnen und mache mir große Sorgen um deren Zukunft und um die Perspektive für die gesamte Menschheit falls eine künstliche Superintelligenz entsteht welche nicht kontrollierbar ist!",
    approved: true,
  },
  {
    name: "Omar Kohl",
    story:
      "Der Gedanke dass das Wohlergehen meiner Kinder auf dem Spiel steht und ihnen vielleicht nur ein kurzes Leben bevorsteht erfüllt mich mit Trauer und Machtlosigkeit.",
    approved: true,
  },
  {
    name: "Ben Mor Fuchs",
    location: "Freiburg",
    story:
      "Ich arbeite in der Überwachung von Software und Anlagen in der Pharma- und Medizintechnik. Viele Kunden planen, KI einzusetzen, um diese Aufgaben zu automatisieren. Um meine eigene berufliche Zukunft mache ich mir dabei keine Sorgen – wohl aber um das Ergebnis.\n\nEinerseits begrüße ich das: Mit gleichen Ressourcen ließen sich mehr Qualitätssicherungsmaßnahmen durchführen.\n\nAndererseits lassen sich KIs leichter dazu bringen, notwendige Schritte 'wegzuargumentieren' wo ein Mensch auf der Umsetzung bestehen würde.\n\nIch befürchte, dass ökonomische Interessen die Qualitätssicherung verdrängen.\n\nDas betrifft uns alle: Schlechtere Produktqualität bedeutet schlechtere Behandlung von Patienten und vermeidbares Leid.",
    approved: true,
  },
  {
    name: "Evander",
    location: "Würzburg",
    story:
      "Mein Hintergrund ist Sonderpädagogik. Ich arbeite mit Menschen, da, wo der menschliche Faktor zählt. Mein Beruf gilt als der, der am spätesten automatisiert wird. Beruhigt hat mich das nie.\n\nDenn im Moment schützt uns nur unsere Körperlichkeit. Bürojobs werden längst automatisiert, die Robotik hängt noch hinterher. Aber sobald KI die Software der Robotik löst, und daran wird gearbeitet, fällt auch dieser Schutz. Erst ersetzt KI das Denken, dann die Hände.\n\nAm Ende kann kaum ein Mensch noch etwas beitragen. Und wer nichts mehr beiträgt, auf den ist auch niemand mehr angewiesen. Früher konnte eine Bevölkerung streiken oder protestieren. Wenn Arbeit, Polizei und Militär automatisiert sind, bleibt davon nichts.\n\nSo entsteht Macht, die auf niemanden mehr angewiesen ist. Genau das ist die Gefahr, nicht die Automatisierung selbst. Aktuell steuern wir genau darauf zu. Aber wir stehen an einem Scheideweg, und noch können wir den Kurs ändern.\n\nIch bin optimistisch, dass wir das schaffen, wenn wir uns informieren, das Thema ernst nehmen und uns als Menschheit koordinieren. Der wichtigste Schritt ist eine Pause. Sie gibt uns die Zeit, innezuhalten und gemeinsam zu entscheiden, welche Zukunft wir eigentlich wollen. Noch können wir umsteuern, aber jetzt ist der Zeitpunkt.",
    approved: true,
  },
];
