import { describe, expect, it } from "vitest";
import { createBackup, parseBackup } from "./backup";
import { SAMPLE_PROFILE } from "./sample";
import type { ContentItem } from "./types";

const content: ContentItem = {
  id: "content-1",
  title: "Mon post",
  goal: "essai",
  format: "caption",
  status: "draft",
  createdAt: 1,
  updatedAt: 2,
  pieces: [{
    id: "piece-1",
    kind: "post",
    label: "Légende",
    hook: "Une accroche",
    caption: "Un texte",
    cta: "Contacte-nous",
    hashtags: "#sport",
    visual: "Photo du club",
  }],
};

describe("ClubPost backup", () => {
  it("creates and parses a valid backup", () => {
    const backup = createBackup(SAMPLE_PROFILE, [content]);
    const parsed = parseBackup(JSON.stringify(backup));
    expect(parsed.profile?.name).toBe("Studio Atlas");
    expect(parsed.contents).toEqual([content]);
    expect(parsed.version).toBe(1);
  });

  it("accepts an empty backup with no club profile", () => {
    const parsed = parseBackup(JSON.stringify(createBackup(null, [])));
    expect(parsed.profile).toBeNull();
    expect(parsed.contents).toEqual([]);
  });

  it("rejects malformed JSON with a readable message", () => {
    expect(() => parseBackup("{not-json")).toThrow(/JSON valide/);
  });

  it("rejects an unsupported version or malformed content", () => {
    const backup = createBackup(null, [content]);
    expect(() => parseBackup(JSON.stringify({ ...backup, version: 2 }))).toThrow(/valide/);
    expect(() => parseBackup(JSON.stringify({ ...backup, contents: [{ id: "broken" }] }))).toThrow(/valide/);
  });

  it("rejects files larger than 5 MB", () => {
    expect(() => parseBackup(" ".repeat(5_000_001))).toThrow(/5 Mo/);
  });
});
