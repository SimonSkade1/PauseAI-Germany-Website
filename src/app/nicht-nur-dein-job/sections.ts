export const SECTIONS = [
  { id: "counter", label: "Zähler" },
  { id: "mehr", label: "Gefahren" },
  { id: "politische-forderung", label: "Lösung" },
  { id: "stimmen", label: "Stimmen" },
  { id: "umfrage-cta", label: "Deine Geschichte" },
  { id: "teilen", label: "Teilen" },
  { id: "chart", label: "Daten" },
  { id: "presse", label: "Presse" },
] as const;

export type SectionId = (typeof SECTIONS)[number]["id"];
