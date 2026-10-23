import { z } from "zod";
import { GOALS, FORMATS, SPORTS, TONES, type ClubProfile, type ContentItem } from "./types";

const profileSchema = z.object({
  name: z.string().max(60),
  sport: z.enum(SPORTS),
  town: z.string().max(60),
  audience: z.string().max(160),
  tone: z.enum(TONES),
  colors: z.string().max(60),
  objective: z.string().max(200),
  contact: z.string().max(120),
  classInfo: z.string().max(200),
});

const pieceSchema = z.object({
  id: z.string().min(1).max(200),
  kind: z.enum(["post", "carousel", "story"]),
  label: z.string().max(200),
  hook: z.string().max(5000),
  caption: z.string().max(30000),
  cta: z.string().max(5000),
  hashtags: z.string().max(5000),
  visual: z.string().max(5000),
});

const contentSchema = z.object({
  id: z.string().min(1).max(200),
  title: z.string().max(500),
  goal: z.enum(GOALS.map((goal) => goal.id) as [string, ...string[]]),
  format: z.enum(FORMATS.map((format) => format.id) as [string, ...string[]]),
  status: z.enum(["draft", "approved"]),
  createdAt: z.number().finite(),
  updatedAt: z.number().finite(),
  pieces: z.array(pieceSchema).max(100),
  weeklyPlan: z.string().max(30000).optional(),
});

const backupSchema = z.object({
  format: z.literal("clubpost-backup"),
  version: z.literal(1),
  exportedAt: z.string().datetime(),
  profile: profileSchema.nullable(),
  contents: z.array(contentSchema).max(5000),
});

export interface ClubPostBackup {
  format: "clubpost-backup";
  version: 1;
  exportedAt: string;
  profile: ClubProfile | null;
  contents: ContentItem[];
}

export function createBackup(profile: ClubProfile | null, contents: ContentItem[]): ClubPostBackup {
  return {
    format: "clubpost-backup",
    version: 1,
    exportedAt: new Date().toISOString(),
    profile,
    contents,
  };
}

export function parseBackup(raw: string): ClubPostBackup {
  if (raw.length > 5_000_000) throw new Error("Le fichier de sauvegarde dépasse 5 Mo.");
  const json: unknown = JSON.parse(raw);
  const result = backupSchema.safeParse(json);
  if (!result.success) {
    throw new Error("Ce fichier n'est pas une sauvegarde ClubPost valide.");
  }
  return result.data as ClubPostBackup;
}

export function downloadBackup(profile: ClubProfile | null, contents: ContentItem[]) {
  const backup = createBackup(profile, contents);
  const blob = new Blob([JSON.stringify(backup, null, 2)], { type: "application/json;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `clubpost-sauvegarde-${new Date().toISOString().slice(0, 10)}.json`;
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 1000);
}
