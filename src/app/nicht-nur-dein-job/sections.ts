export const SECTIONS = [
  { id: "hero", label: "Einstieg" },
  { id: "counter", label: "Zähler" },
  { id: "umfrage-cta", label: "Deine Geschichte" },
  { id: "stimmen", label: "Stimmen" },
  { id: "mehr", label: "Mehr als Jobs" },
  { id: "politische-forderung", label: "Forderung" },
  { id: "chart", label: "Daten" },
  { id: "presse", label: "Presse" },
] as const;

export type SectionId = (typeof SECTIONS)[number]["id"];
