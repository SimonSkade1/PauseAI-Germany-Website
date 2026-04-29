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
    name: "Marie",
    age: 40,
    profession: "Lehrerin für Philosophie",
    location: "München",
    story:
      "Seit ein Jahr KI-Werkzeuge im Unterricht angekommen sind, frage ich mich täglich, was Bildung morgen noch heißen soll. Wenn meine Schüler:innen mit ChatGPT in Sekunden Essays schreiben, was übe ich dann eigentlich noch ein? Ich glaube nicht, dass wir gerade entscheiden, was wir entscheiden sollten – wir reagieren bloß.",
    approved: true,
  },
  {
    name: "Tobias",
    age: 32,
    profession: "Softwareentwickler",
    location: "Berlin",
    story:
      "Mein Job ist es, Code zu schreiben. Heute schreibt der größte Teil meiner Aufgaben Claude oder Copilot. Ich bin produktiver als je zuvor. Ich bin auch verzichtbarer als je zuvor. Beides ist wahr. Und niemand redet darüber, dass das Tempo, in dem das passiert, gefährlich ist.",
    approved: true,
  },
  {
    name: "Aylin",
    age: 28,
    profession: "Grafikdesignerin",
    location: "Hamburg",
    story:
      "Vor zwei Jahren war meine Arbeit gefragt. Heute generieren Kunden Logos selbst mit Midjourney und kommen nur noch zu mir, um nachzubessern. Honorare halbieren sich. Das ist keine Innovation – das ist eine Übertragung von Wertschöpfung von Menschen zu wenigen Konzernen, die diese Modelle kontrollieren.",
    approved: true,
  },
  {
    name: "Henrik",
    age: 54,
    profession: "Buchhalter",
    location: "Leipzig",
    story:
      `Ich arbeite seit dreißig Jahren in mittelständischen Firmen. Letztes Jahr hat mein Chef eine KI-Software eingeführt, die meine Standardaufgaben in Minuten erledigt. Mir wurde gesagt, ich solle „mit der KI zusammenarbeiten“. Was niemand sagt: in zwei Jahren brauchen sie mich nicht mehr. Mit 56 fängt man nicht mehr neu an.`,
    approved: true,
  },
  {
    name: "Sara",
    age: 35,
    profession: "Übersetzerin",
    location: "Köln",
    story:
      "Mein gesamter Beruf wird gerade umgepflügt. DeepL und GPT machen meine Arbeit in einem Bruchteil der Zeit – und in vielen Fällen gut genug. Ich hänge mich nicht an die Vergangenheit. Aber ich frage: Wer entscheidet eigentlich, dass dieser Übergang so schnell passieren soll, ohne uns zu fragen?",
    approved: true,
  },
  {
    name: "Jonas",
    age: 22,
    profession: "Student der Medieninformatik",
    location: "Karlsruhe",
    story:
      "Ich studiere für einen Beruf, von dem niemand weiß, ob es ihn 2030 noch gibt. Meine Professoren sagen offen, sie wissen es selbst nicht. Wir lernen Werkzeuge, die jedes Semester durch ein neues Modell ersetzt werden. Ich will Sicherheit, dass ich auf etwas Reales hinarbeite – und genau die fehlt.",
    approved: true,
  },
  {
    name: "Fatima",
    age: 47,
    profession: "Sozialarbeiterin",
    location: "Essen",
    story:
      "Meine Arbeit ist menschlich. Ich begleite Familien in Krisen. Niemand glaubt, dass ein Chatbot das ersetzen kann – noch. Aber ich sehe, wie Behörden anfangen, KI-Systeme zur Vorprüfung einzusetzen. Wer wird abgelehnt? Wer fällt durchs Raster? Wenn Maschinen über Menschen entscheiden, ohne dass jemand versteht, wie, dann hat das mit Sozialarbeit nichts mehr zu tun.",
    approved: true,
  },
  {
    name: "Daniel",
    age: 38,
    profession: "Radiologe",
    location: "Frankfurt",
    story:
      "KI liest CT-Scans inzwischen besser als die meisten Kollegen – einschließlich mir. Das ist gut für Patienten. Aber niemand bereitet uns darauf vor, was passiert, wenn in fünf Jahren niemand mehr ausbildet, weil die Junior-Stellen wegfallen. Wer überprüft dann die Modelle? Wer trägt Verantwortung, wenn sie irren? Ich habe noch keine Antwort gehört, die mich beruhigt.",
    approved: true,
  },
];
