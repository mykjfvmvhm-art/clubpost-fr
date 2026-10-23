import { afterEach, describe, expect, it, vi } from "vitest";
import { CONTENTS_KEY, deleteContent, readJSON, upsertContent, writeJSON } from "./storage";
import type { ContentItem } from "./types";

const sample: ContentItem = {
  id: "content-1",
  title: "Test",
  goal: "essai",
  format: "caption",
  status: "draft",
  createdAt: 1,
  updatedAt: 1,
  pieces: [],
};

afterEach(() => {
  window.localStorage.clear();
  vi.restoreAllMocks();
});

describe("local storage helpers", () => {
  it("returns the fallback when storage is empty or invalid JSON", () => {
    expect(readJSON("missing", ["fallback"])).toEqual(["fallback"]);
    window.localStorage.setItem("broken", "{");
    expect(readJSON("broken", ["fallback"])).toEqual(["fallback"]);
  });

  it("rejects a parsed value with the wrong container shape", () => {
    window.localStorage.setItem("not-an-array", JSON.stringify({ unexpected: true }));
    expect(readJSON("not-an-array", ["fallback"])).toEqual(["fallback"]);
  });

  it("writes and removes JSON values", () => {
    expect(writeJSON("value", { ok: true })).toBe(true);
    expect(readJSON("value", { ok: false })).toEqual({ ok: true });
    expect(writeJSON("value", null)).toBe(true);
    expect(readJSON("value", { ok: false })).toEqual({ ok: false });
  });

  it("upserts without duplicating an existing content ID", () => {
    expect(upsertContent(sample)).toBe(true);
    expect(upsertContent({ ...sample, title: "Updated" })).toBe(true);
    const result = readJSON<ContentItem[]>(CONTENTS_KEY, []);
    expect(result).toHaveLength(1);
    expect(result[0]?.title).toBe("Updated");
  });

  it("deletes only the requested content", () => {
    upsertContent(sample);
    upsertContent({ ...sample, id: "content-2", title: "Keep me" });
    expect(deleteContent("content-1")).toBe(true);
    expect(readJSON<ContentItem[]>(CONTENTS_KEY, []).map((item) => item.id)).toEqual(["content-2"]);
  });

  it("returns false when browser storage throws", () => {
    vi.spyOn(Storage.prototype, "setItem").mockImplementation(() => {
      throw new DOMException("Quota exceeded", "QuotaExceededError");
    });
    expect(writeJSON("full", { value: true })).toBe(false);
  });
});
