export const SPORTS = ["CrossFit", "Fitness", "Musculation", "Coaching", "Yoga", "Autre"] as const;
export const TONES = ["Motivant", "Bienveillant", "Expert", "Fun"] as const;
export const GOALS = [
  { id: "essai", label: "Nouvelles inscriptions à l'essai" },
  { id: "evenement", label: "Annoncer un événement" },
  { id: "cours", label: "Mettre en avant un cours" },
  { id: "communaute", label: "Communauté des membres" },
  { id: "conseils", label: "Conseils / pédagogie" },
  { id: "promo", label: "Offre / promotion" },
] as const;
export const FORMATS = [
  { id: "caption", label: "Légende Instagram" },
  { id: "carousel", label: "Plan de carrousel" },
  { id: "story", label: "Story" },
  { id: "weekly", label: "Kit de la semaine" },
] as const;

export type Sport = (typeof SPORTS)[number];
export type Tone = (typeof TONES)[number];
export type GoalId = (typeof GOALS)[number]["id"];
export type FormatId = (typeof FORMATS)[number]["id"];

export interface ClubProfile {
  name: string;
  sport: Sport;
  town: string;
  audience: string;
  tone: Tone;
  colors: string;
  objective: string;
  contact: string;
  classInfo: string;
}

export interface Piece {
  id: string;
  kind: "post" | "carousel" | "story";
  label: string;
  hook: string;
  caption: string;
  cta: string;
  hashtags: string;
  visual: string;
}

export interface ContentItem {
  id: string;
  title: string;
  goal: GoalId;
  format: FormatId;
  status: "draft" | "approved";
  createdAt: number;
  updatedAt: number;
  pieces: Piece[];
  weeklyPlan?: string | undefined;
}

export interface GenerateInput {
  goal: GoalId;
  format: FormatId;
  topic: string;
  eventDetails: string;
  tone: Tone;
  cta: string;
  variants: number;
}

export const goalLabel = (id: string) => GOALS.find((g) => g.id === id)?.label ?? id;
export const formatLabel = (id: string) => FORMATS.find((f) => f.id === id)?.label ?? id;
