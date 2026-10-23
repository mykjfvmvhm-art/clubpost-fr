import { useState } from "react";
import { z } from "zod";
import { CopyButton } from "./CopyButton";

const schema = z.object({
  email: z.string().trim().email("Adresse e-mail invalide").max(255),
  club: z.string().trim().max(100).optional(),
  message: z.string().trim().min(10, "Ton message doit faire au moins 10 caractères").max(1000, "1000 caractères maximum"),
});

export function FeedbackForm() {
  const [v, setV] = useState({ email: "", club: "", message: "", type: "Avis" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [ready, setReady] = useState<string | null>(null);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const r = schema.safeParse(v);
    if (!r.success) {
      const errs: Record<string, string> = {};
      r.error.issues.forEach((i) => (errs[String(i.path[0])] = i.message));
      setErrors(errs);
      setReady(null);
      return;
    }
    setErrors({});
    setReady(`Objet : ClubPost — ${v.type}\n\nE-mail : ${r.data.email}\nClub : ${r.data.club || "—"}\n\n${r.data.message}`);
  };

  return (
    <form onSubmit={submit} noValidate className="card-surface space-y-4 p-5 sm:p-6">
      <fieldset>
        <legend className="mb-2 text-sm font-bold">Je veux…</legend>
        <div className="flex flex-wrap gap-2">
          {["Avis", "Accès bêta", "Question"].map((t) => (
            <label key={t} className={`chip cursor-pointer border ${v.type === t ? "bg-lime" : "bg-card"}`}>
              <input type="radio" name="type" className="sr-only" checked={v.type === t} onChange={() => setV({ ...v, type: t })} />
              {t === "Avis" ? "Donner mon avis" : t === "Accès bêta" ? "Demander un accès bêta" : "Poser une question"}
            </label>
          ))}
        </div>
      </fieldset>
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="fb-email" className="mb-1 block text-sm font-bold">E-mail *</label>
          <input id="fb-email" type="email" className="field" value={v.email} aria-invalid={!!errors["email"]} aria-describedby="fb-email-err" onChange={(e) => setV({ ...v, email: e.target.value })} />
          {errors["email"] && <p id="fb-email-err" className="mt-1 text-sm text-destructive">{errors["email"]}</p>}
        </div>
        <div>
          <label htmlFor="fb-club" className="mb-1 block text-sm font-bold">Club (optionnel)</label>
          <input id="fb-club" className="field" value={v.club} maxLength={100} onChange={(e) => setV({ ...v, club: e.target.value })} />
        </div>
      </div>
      <div>
        <label htmlFor="fb-msg" className="mb-1 block text-sm font-bold">Message *</label>
        <textarea id="fb-msg" rows={4} className="field" value={v.message} maxLength={1000} aria-invalid={!!errors["message"]} aria-describedby="fb-msg-err" onChange={(e) => setV({ ...v, message: e.target.value })} />
        {errors["message"] && <p id="fb-msg-err" className="mt-1 text-sm text-destructive">{errors["message"]}</p>}
      </div>
      <p className="text-xs text-muted-foreground">
        Rien n'est envoyé depuis ce site : aucun serveur n'est connecté. Ta demande est préparée ici, à toi de la copier ou de l'ouvrir dans ta messagerie.
      </p>
      <button type="submit" className="btn btn-ink">Préparer ma demande</button>
      {ready && (
        <div className="rounded-xl bg-warning p-4 text-warning-foreground" role="status">
          <p className="mb-2 font-bold">Demande prête — pas encore envoyée.</p>
          <pre className="mb-3 whitespace-pre-wrap rounded-lg bg-card p-3 text-xs text-foreground">{ready}</pre>
          <div className="flex flex-wrap gap-2">
            <CopyButton text={ready} label="Copier ma demande" className="btn btn-ink btn-sm" />
          </div>
          <p className="mt-2 text-xs">Colle le texte copié dans ta messagerie pour envoyer ta demande. L’envoi automatique n’est pas configuré dans cette bêta.</p>
        </div>
      )}
    </form>
  );
}
