export interface Section {
  id: string;
  label: string;
}

export const sections: Section[] = [
  { id: "appell", label: "Appell" },
  { id: "zitate", label: "Zitate" },
  { id: "unterzeichnende", label: "Unterzeichnende" },
  { id: "hintergrund", label: "Kontext" },
  { id: "faq", label: "FAQ" },
  { id: "experten", label: "Expert:innen" },
  { id: "petition", label: "Petition" },
  { id: "medien", label: "Presse" },
];
