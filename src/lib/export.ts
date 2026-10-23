import type { ContentItem, Piece } from "./types";
import { formatLabel, goalLabel } from "./types";

export function pieceToText(p: Piece, md = false): string {
  const h = (s: string) => (md ? `**${s}**` : s.toUpperCase());
  return [
    md ? `### ${p.label}` : `— ${p.label} —`,
    `${h("Accroche")} : ${p.hook}`,
    `${h("Légende")} :\n${p.caption}`,
    `${h("Appel à l'action")} : ${p.cta}`,
    `${h("Hashtags")} : ${p.hashtags}`,
    `${h("Idée visuelle")} : ${p.visual}`,
  ].join("\n\n");
}

export function itemToText(item: ContentItem, md = false): string {
  const head = md
    ? `# ${item.title}\n\n_${formatLabel(item.format)} · ${goalLabel(item.goal)} · ${item.status === "approved" ? "Validé" : "Brouillon"}_`
    : `${item.title}\n${formatLabel(item.format)} · ${goalLabel(item.goal)}`;
  const plan = item.weeklyPlan ? `\n\n${md ? "## Planning de la semaine" : "PLANNING DE LA SEMAINE"}\n\n${item.weeklyPlan}` : "";
  return `${head}\n\n${item.pieces.map((p) => pieceToText(p, md)).join("\n\n")}${plan}\n\n— Généré avec ClubPost (générateur de démonstration à base de modèles). Relis avant publication.\n`;
}

export function download(filename: string, content: string, type = "text/plain") {
  const blob = new Blob([content], { type: `${type};charset=utf-8` });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

export function exportItem(item: ContentItem, ext: "txt" | "md") {
  const slug = item.title.toLowerCase().normalize("NFD").replace(/[^\w]+/g, "-").replace(/^-|-$/g, "").slice(0, 40) || "contenu";
  download(`clubpost-${slug}.${ext}`, itemToText(item, ext === "md"), ext === "md" ? "text/markdown" : "text/plain");
}

export async function copyText(text: string): Promise<boolean> {
  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text);
      return true;
    }
  } catch {
    /* fallback */
  }
  try {
    const ta = document.createElement("textarea");
    ta.value = text;
    ta.setAttribute("readonly", "");
    ta.style.position = "fixed";
    ta.style.opacity = "0";
    document.body.appendChild(ta);
    ta.select();
    const ok = document.execCommand("copy");
    ta.remove();
    return ok;
  } catch {
    return false;
  }
}
