import { describe, expect, it } from "vitest";
import { generate, TODO } from "./generator";
import { SAMPLE_PROFILE } from "./sample";
import type { GenerateInput } from "./types";

const base: GenerateInput = { goal: "essai", format: "caption", topic: "", eventDetails: "", tone: "Motivant", cta: "", variants: 3 };

describe("generator", () => {
  it("weekly kit = 3 posts + 3 stories + plan", () => {
    const r = generate(SAMPLE_PROFILE, { ...base, format: "weekly" });
    expect(r.pieces.filter((p) => p.kind !== "story")).toHaveLength(3);
    expect(r.pieces.filter((p) => p.kind === "story")).toHaveLength(3);
    expect(r.weeklyPlan).toBeTruthy();
  });
  it("respects variant count", () => {
    expect(generate(SAMPLE_PROFILE, base).pieces).toHaveLength(3);
  });
  it("never invents prices", () => {
    for (let s = 1; s < 30; s++) {
      const r = generate(SAMPLE_PROFILE, { ...base, goal: "promo", format: "weekly" }, s);
      const all = JSON.stringify(r);
      expect(all).not.toMatch(/\d+\s?(€|euros?)/i);
    }
  });
  it("flags missing event details instead of inventing", () => {
    const r = generate(SAMPLE_PROFILE, { ...base, goal: "evenement", variants: 5 });
    expect(r.pieces.some((p) => p.caption.includes(TODO))).toBe(true);
  });
  it("personalizes with club name", () => {
    expect(generate(SAMPLE_PROFILE, base).title).toContain("Studio Atlas");
  });
});
