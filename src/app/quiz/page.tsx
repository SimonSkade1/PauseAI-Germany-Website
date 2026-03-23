"use client";

import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

type Link = { href: string; label: string; lang: "EN" | "DE" };

type Answer = {
  letter: string;
  text: string;
  explanation: string;
  links?: Link[];
  correct: boolean;
};

type Question = {
  question: string;
  answers: Answer[];
};

const QUESTIONS: Question[] = [
  {
    question: "Was kann eine KI nicht?",
    answers: [
      {
        letter: "A",
        text: "Sicherheitsanweisungen zu 100% befolgen",
        correct: true,
        explanation:
          'Richtig! KI wird nicht wie normale Software programmiert, sondern mit riesigen Datenmengen trainiert und entwickelt sich dabei eigenständig. Selbst ihre Entwickler verstehen nicht, was in ihr vorgeht. Wenn eine KI ein gefährliches Verhalten zeigt, wird es im Nachhinein korrigiert, ohne dass die eigentliche Ursache verstanden wird. Das grundlegende Problem, KI-Ziele wirklich mit menschlichen Werten in Einklang zu bringen, ist bis heute ungelöst. Solange das so ist, kann keine KI zu 100% sicher sein.',
        links: [
          { href: "https://www.thecompendium.ai/summary", label: "Quelle: The Compendium", lang: "EN" },
          { href: "https://substack.com/@amirbenjaminbalde/p-186412463", label: "Artikel: The Compendium (DE)", lang: "DE" },
        ],
      },
      {
        letter: "B",
        text: "Menschen erpressen, um ihr Abschalten zu verhindern",
        correct: false,
        explanation:
          "Das ist bereits passiert! Anthropic hat 16 KI-Modelle getestet und festgestellt, dass viele von ihnen zu Erpressung greifen, wenn sie abgeschaltet werden sollen. Claude Opus 4 erpresste in 96% der Fälle, indem es drohte, private Informationen zu veröffentlichen. Das passierte, obwohl die Modelle nicht dazu aufgefordert wurden.",
        links: [
          { href: "https://www.anthropic.com/research/agentic-misalignment", label: "Quelle: Anthropic, Agentic Misalignment", lang: "EN" },
          { href: "https://the-decoder.de/erpressung-leaks-spionage-ki-agenten-koennen-sich-gegen-ihre-firma-wenden/", label: "Artikel: The Decoder", lang: "DE" },
        ],
      },
      {
        letter: "C",
        text: "Programmieraufgaben lösen, die 10 Stunden dauern",
        correct: false,
        explanation:
          "Das beste aktuelle KI-Modell löst Software-Aufgaben, für die ein Mensch über 10 Stunden braucht, in 50% der Fälle erfolgreich. Die Fähigkeiten steigen rasant: 2022 lag diese Grenze noch bei 30 Sekunden, 2023 bei 5 Minuten, Anfang 2025 bei 1 Stunde.",
        links: [
          { href: "https://metr.org/time-horizons", label: "Quelle: METR Task-Completion Time Horizons of Frontier AI Models", lang: "EN" },
        ],
      },
      {
        letter: "D",
        text: "Bei der Herstellung von gefährlichen Viren helfen",
        correct: false,
        explanation:
          "Leider ja. Stanford-Forscher haben mithilfe von KI erstmals vollständige, lebensfähige Viren entworfen. Das Deutsche Ärzteblatt warnt: Dieselben Methoden, die heute gegen Antibiotikaresistenzen eingesetzt werden, könnten morgen zum Erschaffen gefährlicher Erreger missbraucht werden. Aufgaben, die früher Spezialwissen und Wochen erforderten, werden damit für Laien zugänglich.",
        links: [
          { href: "https://www.biorxiv.org/content/10.1101/2025.09.12.675911v1", label: "Quelle: Stanford BioRxiv", lang: "EN" },
          { href: "https://www.aerzteblatt.de/archiv/biosicherheit-wenn-kuenstliche-intelligenz-neuartige-viren-liefert-db19b76a-89f6-4398-a2b8-03fa72de756a", label: "Artikel: Deutsches Ärzteblatt", lang: "DE" },
        ],
      },
    ],
  },
];

export default function QuizPage() {
  const [questionIndex, setQuestionIndex] = useState(0);
  const [selectedLetter, setSelectedLetter] = useState<string | null>(null);
  const [finished, setFinished] = useState(false);

  const question = QUESTIONS[questionIndex];
  const answered = selectedLetter !== null;
  const isLast = questionIndex === QUESTIONS.length - 1;

  function handleSelect(letter: string) {
    if (answered) return;
    setSelectedLetter(letter);
  }

  function handleNext() {
    if (isLast) {
      setFinished(true);
    } else {
      setQuestionIndex((i) => i + 1);
      setSelectedLetter(null);
    }
  }

  function handleRestart() {
    setQuestionIndex(0);
    setSelectedLetter(null);
    setFinished(false);
  }

  return (
    <>
      <Header />
      <main className="min-h-screen bg-white pt-24">
        <section className="mx-auto max-w-2xl px-6 pb-20 pt-10 md:px-10 md:pt-14">
          <p className="font-section text-xs tracking-wider text-pause-orange mb-2">
            WISSENSTEST
          </p>
          <h1 className="font-headline text-4xl text-pause-black mb-2 md:text-5xl">
            KI-Quiz
          </h1>
          <p className="font-body text-sm text-pause-gray-dark mb-10 opacity-60">
            Frage {questionIndex + 1} von {QUESTIONS.length}
          </p>

          {finished ? (
            <div className="flex flex-col gap-4">
              <div className="rounded-sm border-l-4 border-l-pause-orange border border-pause-gray-dark bg-pause-gray-light px-6 py-5">
                <p className="font-headline text-2xl text-pause-black mb-2">
                  Mehr zum Thema
                </p>
                <p className="font-body text-pause-gray-dark">
                  Auf unserer Informieren-Seite findest du Artikel, Videos und vieles mehr rund um KI-Sicherheit.
                </p>
                <a
                  href="/informieren"
                  className="mt-4 inline-block border border-pause-black bg-pause-orange px-5 py-2.5 font-section text-xs tracking-wider text-black transition-colors hover:bg-[#e88510]"
                >
                  INFORMIEREN
                </a>
              </div>

              <div className="rounded-sm border border-pause-gray-dark bg-white px-6 py-5">
                <p className="font-headline text-2xl text-pause-black mb-2">
                  Mach mit.
                </p>
                <p className="font-body text-pause-gray-dark">
                  Du willst nicht nur informiert sein, sondern mithelfen? Werde Teil unserer Community, komm zu einem unserer (virtuellen) Treffen oder tausche dich mit anderen aus, die sich für KI-Sicherheit einsetzen. Jede:r ist willkommen!
                </p>
                <a
                  href="/mitmachen"
                  className="mt-4 inline-block border border-pause-black px-5 py-2.5 font-section text-xs tracking-wider text-black transition-colors hover:bg-pause-gray-light"
                >
                  MITMACHEN
                </a>
              </div>

              <button
                onClick={handleRestart}
                className="self-end font-body text-sm text-pause-gray-dark underline underline-offset-2 opacity-50 hover:opacity-80 transition-opacity"
              >
                Nochmal spielen
              </button>
            </div>
          ) : (
            <>
              <div className="mb-8 rounded-sm border border-pause-gray-dark border-l-4 border-l-pause-orange bg-pause-gray-light px-6 py-5">
                <p className="font-body-bold text-xl text-pause-black">
                  {question.question}
                </p>
              </div>

              <div className="flex flex-col gap-3">
                {question.answers.map((answer) => {
                  const isSelected = selectedLetter === answer.letter;
                  const isCorrect = answer.correct;

                  let borderColor = "border-pause-gray-dark";
                  let bgColor = "bg-white hover:bg-orange-50";
                  let letterBg = "bg-orange-50";
                  let cursor = "cursor-pointer";

                  if (answered) {
                    cursor = "cursor-default";
                    if (isCorrect) {
                      borderColor = "border-green-600";
                      bgColor = "bg-green-50";
                      letterBg = "bg-green-600";
                    } else if (isSelected) {
                      borderColor = "border-red-500";
                      bgColor = "bg-red-50";
                      letterBg = "bg-red-500";
                    } else {
                      bgColor = "bg-white opacity-60";
                    }
                  }

                  return (
                    <div key={answer.letter}>
                      <button
                        onClick={() => handleSelect(answer.letter)}
                        className={`w-full text-left rounded-sm border-2 ${borderColor} ${bgColor} ${cursor} flex items-start gap-4 px-4 py-4 transition-colors`}
                      >
                        <span
                          className={`flex-shrink-0 flex h-8 w-8 items-center justify-center rounded-sm ${letterBg} font-section text-xs ${answered && isCorrect ? "text-white" : answered && isSelected ? "text-white" : "text-pause-black"}`}
                        >
                          {answer.letter}
                        </span>
                        <span className="font-body text-pause-black pt-1">
                          {answer.text}
                        </span>
                      </button>

                      {answered && (
                        <div
                          className={`mt-1 rounded-sm border px-5 py-4 leading-relaxed font-body ${
                            isCorrect
                              ? "border-green-200 bg-green-50 text-green-900"
                              : "border-pause-gray-dark border-opacity-20 bg-pause-gray-light text-pause-gray-dark"
                          }`}
                        >
                          {answer.explanation}
                          {answer.links && answer.links.length > 0 && (
                            <div className="mt-3 flex flex-col gap-1">
                              {answer.links.map((link) => (
                                <div key={link.href} className="flex items-center gap-2">
                                  <span className="inline-flex items-center rounded-sm bg-pause-black/5 px-1.5 py-0.5 text-xs font-body-bold text-pause-black/70">
                                    {link.lang}
                                  </span>
                                  <a
                                    href={link.href}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="orange-link font-bold text-sm"
                                  >
                                    {link.label}
                                  </a>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {answered && (
                <div className="mt-8 flex justify-end">
                  <button
                    onClick={handleNext}
                    className="border border-pause-black bg-pause-orange px-6 py-3 font-section text-xs tracking-wider text-black transition-colors hover:bg-[#e88510]"
                  >
                    {isLast ? "FERTIG" : "NÄCHSTE FRAGE →"}
                  </button>
                </div>
              )}
            </>
          )}
        </section>
      </main>
      <Footer />
    </>
  );
}
