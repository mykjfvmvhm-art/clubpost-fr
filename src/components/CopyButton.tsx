import { useState } from "react";
import { Check, Copy } from "lucide-react";
import { copyText } from "@/lib/export";

export function CopyButton({ text, label = "Copier", className = "btn btn-outline btn-sm" }: { text: string; label?: string; className?: string }) {
  const [state, setState] = useState<"idle" | "ok" | "err">("idle");
  return (
    <button
      type="button"
      className={className}
      onClick={async () => {
        const ok = await copyText(text);
        setState(ok ? "ok" : "err");
        setTimeout(() => setState("idle"), 1800);
      }}
      aria-live="polite"
    >
      {state === "ok" ? <Check size={14} aria-hidden /> : <Copy size={14} aria-hidden />}
      {state === "ok" ? "Copié" : state === "err" ? "Copie impossible — sélectionne le texte" : label}
    </button>
  );
}
