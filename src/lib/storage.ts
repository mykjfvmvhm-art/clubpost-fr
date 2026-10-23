import { useCallback, useEffect, useState } from "react";
import type { ClubProfile, ContentItem } from "./types";

export const PROFILE_KEY = "clubpost.profile.v1";
export const CONTENTS_KEY = "clubpost.contents.v1";
const EVT = "clubpost-storage";

export function readJSON<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return fallback;
    const parsed: unknown = JSON.parse(raw);

    // Protect consumers from malformed or outdated localStorage values.
    if (Array.isArray(fallback) && !Array.isArray(parsed)) return fallback;
    if (fallback === null && parsed !== null && typeof parsed !== "object") return fallback;
    return parsed as T;
  } catch {
    return fallback;
  }
}

export function writeJSON(key: string, value: unknown): boolean {
  if (typeof window === "undefined") return false;
  try {
    if (value === null) window.localStorage.removeItem(key);
    else window.localStorage.setItem(key, JSON.stringify(value));
    window.dispatchEvent(new Event(EVT));
    return true;
  } catch {
    return false;
  }
}

function useStored<T>(key: string, fallback: T) {
  const [value, setValue] = useState<T>(fallback);
  const [loaded, setLoaded] = useState(false);
  useEffect(() => {
    const sync = () => setValue(readJSON(key, fallback));
    sync();
    setLoaded(true);
    window.addEventListener(EVT, sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener(EVT, sync);
      window.removeEventListener("storage", sync);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);
  const save = useCallback((v: T) => writeJSON(key, v), [key]);
  return [value, save, loaded] as const;
}

export const useProfile = () => useStored<ClubProfile | null>(PROFILE_KEY, null);
export const useContents = () => useStored<ContentItem[]>(CONTENTS_KEY, []);

export function upsertContent(item: ContentItem): boolean {
  const stored = readJSON<unknown>(CONTENTS_KEY, []);
  const list: ContentItem[] = Array.isArray(stored) ? stored as ContentItem[] : [];
  const i = list.findIndex((c) => c?.id === item.id);
  if (i >= 0) list[i] = item;
  else list.unshift(item);
  return writeJSON(CONTENTS_KEY, list);
}

export function deleteContent(id: string): boolean {
  const stored = readJSON<unknown>(CONTENTS_KEY, []);
  const list: ContentItem[] = Array.isArray(stored) ? stored as ContentItem[] : [];
  return writeJSON(CONTENTS_KEY, list.filter((c) => c?.id !== id));
}

export const newId = () => `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
