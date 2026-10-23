import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { CheckCircle2, ChevronDown, FileDown, Search, Trash2 } from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { PieceCard, PlanCard } from "@/components/ContentEditor";
import { CopyButton } from "@/components/CopyButton";
import { Dashboard } from "@/components/Dashboard";
import { deleteContent, upsertContent, useContents } from "@/lib/storage";
import { exportItem, itemToText } from "@/lib/export";
import { FORMATS, formatLabel, goalLabel, type ContentItem } from "@/lib/types";

export const Route = createFileRoute("/contenus")({
  head: () => ({
    meta: [
      { title: "Mes contenus — ClubPost" },
      { name: "description", content: "Retrouve, modifie, valide et exporte les contenus sauvegardés de ton club." },
      { property: "og:title", content: "Mes contenus — ClubPost" },
      { property: "og:description", content: "Ta bibliothèque de posts et stories, stockée sur ton appareil." },
    ],
  }),
  component: Contents,
});

function Contents() {
  const [contents, , loaded] = useContents();
  const [q, setQ] = useState("");
  const [status, setStatus] = useState("all");
  const [format, setFormat] = useState("all");
  const [open, setOpen] = useState<string | null>(null);

  const list = useMemo(() => {
    const s = q.trim().toLowerCase();
    return contents.filter(
      (c) =>
        (status === "all" || c.status === status) &&
        (format === "all" || c.format === format) &&
        (!s || itemToText(c).toLowerCase().includes(s)),
    );
  }, [contents, q, status, format]);

  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <PageHeader eyebrow="Bibliothèque" title="Mes contenus">Stockés uniquement dans ce navigateur.</PageHeader>
      <div className="mb-8"><Dashboard /></div>
      <div className="mb-4 grid gap-2 sm:grid-cols-[1fr_auto_auto]">
        <div className="relative">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" aria-hidden />
          <label htmlFor="s-q" className="sr-only">Rechercher</label>
          <input id="s-q" className="field pl-9" placeholder="Rechercher…" value={q} onChange={(e) => setQ(e.target.value)} />
        </div>
        <label htmlFor="s-status" className="sr-only">Statut</label>
        <select id="s-status" className="field" value={status} onChange={(e) => setStatus(e.target.value)}>
          <option value="all">Tous statuts</option><option value="draft">Brouillons</option><option value="approved">Validés</option>
        </select>
        <label htmlFor="s-format" className="sr-only">Format</label>
        <select id="s-format" className="field" value={format} onChange={(e) => setFormat(e.target.value)}>
          <option value="all">Tous formats</option>
          {FORMATS.map((f) => <option key={f.id} value={f.id}>{f.label}</option>)}
        </select>
      </div>

      {loaded && contents.length === 0 && (
        <div className="card-surface p-8 text-center">
          <p className="font-bold">Ta bibliothèque est vide</p>
          <p className="mb-4 text-sm text-muted-foreground">Génère un contenu puis clique sur « Sauvegarder ».</p>
          <Link to="/generateur" className="btn btn-ink">Créer mon premier kit</Link>
        </div>
      )}
      {loaded && contents.length > 0 && list.length === 0 && <p className="card-surface p-6 text-center text-sm text-muted-foreground">Aucun contenu ne correspond à ta recherche.</p>}

      <ul className="space-y-3">
        {list.map((c) => <Row key={c.id} item={c} open={open === c.id} toggle={() => setOpen(open === c.id ? null : c.id)} />)}
      </ul>
    </div>
  );
}

function Row({ item, open, toggle }: { item: ContentItem; open: boolean; toggle: () => void }) {
  const [draft, setDraft] = useState(item);
  const [confirm, setConfirm] = useState(false);
  const [msg, setMsg] = useState("");
  const dirty = JSON.stringify(draft) !== JSON.stringify(item);
  const persist = (next: ContentItem) => {
    const n = { ...next, updatedAt: Date.now() };
    setDraft(n);
    setMsg(upsertContent(n) ? "Enregistré." : "Erreur d'enregistrement.");
  };
  return (
    <li className="card-surface p-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <button type="button" onClick={toggle} aria-expanded={open} className="flex min-w-0 flex-1 items-center gap-2 text-left">
          <ChevronDown size={18} className={`shrink-0 transition ${open ? "rotate-180" : ""}`} aria-hidden />
          <span className="min-w-0">
            <span className="block truncate font-bold">{item.title}</span>
            <span className="text-xs text-muted-foreground">{formatLabel(item.format)} · {goalLabel(item.goal)} · {new Date(item.updatedAt).toLocaleDateString("fr-FR")}</span>
          </span>
        </button>
        <span className={`chip ${item.status === "approved" ? "bg-lime" : "bg-secondary"}`}>{item.status === "approved" ? "Validé" : "Brouillon"}</span>
      </div>
      {open && (
        <div className="mt-4 space-y-4">
          <div className="flex flex-wrap gap-2">
            <button type="button" className="btn btn-ink btn-sm" disabled={!dirty} onClick={() => persist(draft)}>Enregistrer les modifications</button>
            <button type="button" className="btn btn-outline btn-sm" onClick={() => persist({ ...draft, status: draft.status === "approved" ? "draft" : "approved" })}>
              <CheckCircle2 size={14} aria-hidden /> {draft.status === "approved" ? "Repasser en brouillon" : "Marquer validé"}
            </button>
            <CopyButton text={itemToText(draft)} label="Copier tout" />
            <button type="button" className="btn btn-outline btn-sm" onClick={() => exportItem(draft, "txt")}><FileDown size={14} aria-hidden /> .txt</button>
            <button type="button" className="btn btn-outline btn-sm" onClick={() => exportItem(draft, "md")}><FileDown size={14} aria-hidden /> .md</button>
            {!confirm ? (
              <button type="button" className="btn btn-danger btn-sm" onClick={() => setConfirm(true)}><Trash2 size={14} aria-hidden /> Supprimer</button>
            ) : (
              <span className="flex items-center gap-2 text-sm" role="alert">
                Supprimer définitivement ?
                <button type="button" className="btn btn-danger btn-sm" onClick={() => deleteContent(item.id)}>Oui</button>
                <button type="button" className="btn btn-outline btn-sm" onClick={() => setConfirm(false)}>Annuler</button>
              </span>
            )}
          </div>
          {msg && <p className="text-sm font-bold text-success" role="status">{msg}</p>}
          <label className="block text-xs font-bold uppercase text-muted-foreground" htmlFor={`t-${item.id}`}>Titre</label>
          <input id={`t-${item.id}`} className="field" value={draft.title} onChange={(e) => setDraft({ ...draft, title: e.target.value })} />
          {draft.weeklyPlan !== undefined && <PlanCard plan={draft.weeklyPlan} onChange={(p) => setDraft({ ...draft, weeklyPlan: p })} />}
          <div className="grid gap-4 lg:grid-cols-2">
            {draft.pieces.map((p) => (
              <PieceCard key={p.id} piece={p} onChange={(np) => setDraft({ ...draft, pieces: draft.pieces.map((x) => (x.id === p.id ? np : x)) })} />
            ))}
          </div>
        </div>
      )}
    </li>
  );
}
