export const SECTIONS = [
  { id: "hero", label: "Akt I" },
  { id: "mehr", label: "Akt II" },
] as const;

export type SectionId = (typeof SECTIONS)[number]["id"];
