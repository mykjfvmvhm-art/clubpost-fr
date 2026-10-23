import type { ClubProfile, GenerateInput } from "./types";

/** Club FICTIF utilisé pour la démonstration. */
export const SAMPLE_PROFILE: ClubProfile = {
  name: "Studio Atlas",
  sport: "CrossFit",
  town: "Nantes",
  audience: "Actifs de 25 à 45 ans qui veulent reprendre le sport sans se blesser",
  tone: "Motivant",
  colors: "Noir, vert lime",
  objective: "Remplir les créneaux du midi et faire venir de nouveaux membres à l'essai",
  contact: "Réserve ta séance via le lien en bio",
  classInfo: "WOD du midi, cours débutants, open gym le samedi",
};

export const SAMPLE_INPUT: GenerateInput = {
  goal: "essai",
  format: "weekly",
  topic: "reprendre le sport en douceur",
  eventDetails: "",
  tone: "Motivant",
  cta: "",
  variants: 1,
};
