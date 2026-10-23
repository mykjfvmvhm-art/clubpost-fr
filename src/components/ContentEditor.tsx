import { Trash2 } from "lucide-react";
import type { Piece } from "@/lib/types";
import { pieceToText } from "@/lib/export";
import { CopyButton } from "./CopyButton";

const FIELDS: { key: keyof Piece; label: string; rows: number }[] = [
  { key: "hook", label: "Accroche", rows: 2 },
  { key: "caption", label: "Légende / contenu", rows: 8 },
  { key: "cta", label: "Appel à l'action", rows: 2 },
  { key: "hashtags", label: "Hashtags suggérés", rows: 2 },
  { key: "visual", label: "Idée visuelle", rows: 2 },
];

export function PieceCard({ piece, onChange, onDelete }: { piece: Piece; onChange: (p: Piece) => void; onDelete?: (() => void) | undefined }) {
  return (
    <article className="card-surface p-4 sm:p-5">
      <header className="mb-3 flex flex-wrap items-center justify-between gap-2">
        <h3 className="text-lg font-bold">{piece.label}</h3>
        <div className="flex gap-2">
          <CopyButton text={pieceToText(piece)} label="Tout copier" />
          {onDelete && (
            <button type="button" className="btn btn-danger btn-sm" onClick={onDelete} aria-label={`Retirer ${piece.label}`}>
              <Trash2 size={14} aria-hidden />
            </button>
          )}
        </div>
      </header>
      <div className="space-y-3">
        {FIELDS.map((f) => {
          const id = `${piece.id}-${f.key}`;
          return (
            <div key={f.key}>
              <div className="mb-1 flex items-center justify-between">
                <label htmlFor={id} className="text-xs font-bold uppercase tracking-wide text-muted-foreground">{f.label}</label>
                <CopyButton text={String(piece[f.key])} className="btn btn-sm px-2 text-muted-foreground hover:text-foreground" />
              </div>
              <textarea id={id} rows={f.rows} className="field text-sm" value={String(piece[f.key])} onChange={(e) => onChange({ ...piece, [f.key]: e.target.value })} />
            </div>
          );
        })}
      </div>
    </article>
  );
}

export function PlanCard({ plan, onChange }: { plan: string; onChange: (s: string) => void }) {
  return (
    <article className="card-surface bg-ink p-5 text-ink-foreground">
      <div className="mb-3 flex items-center justify-between gap-2">
        <label htmlFor="weekly-plan" className="text-lg font-bold">Planning de la semaine</label>
        <CopyButton text={plan} className="btn btn-lime btn-sm" />
      </div>
      <textarea id="weekly-plan" rows={10} className="field text-sm" value={plan} onChange={(e) => onChange(e.target.value)} />
    </article>
  );
}
