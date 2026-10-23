import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { z } from "zod";
import { PageHeader } from "@/components/PageHeader";
import { useProfile } from "@/lib/storage";
import { SAMPLE_PROFILE } from "@/lib/sample";
import { SPORTS, TONES, type ClubProfile } from "@/lib/types";

export const Route = createFileRoute("/club")({
  head: () => ({
    meta: [
      { title: "Mon club — ClubPost" },
      { name: "description", content: "Renseigne le profil de ton club pour personnaliser tes contenus." },
      { property: "og:title", content: "Mon club — ClubPost" },
      { property: "og:description", content: "Le profil de ton club, stocké uniquement dans ton navigateur." },
    ],
  }),
  component: Club,
});

const schema = z.object({
  name: z.string().trim().min(2, "2 caractères minimum").max(60, "60 caractères maximum"),
  sport: z.enum(SPORTS),
  town: z.string().trim().min(2, "Indique ta ville").max(60),
  audience: z.string().trim().max(160),
  tone: z.enum(TONES),
  colors: z.string().trim().max(60),
  objective: z.string().trim().max(200),
  contact: z.string().trim().max(120),
  classInfo: z.string().trim().max(200),
});

const EMPTY: ClubProfile = { name: "", sport: "CrossFit", town: "", audience: "", tone: "Motivant", colors: "", objective: "", contact: "", classInfo: "" };

const TEXT_FIELDS: { k: keyof ClubProfile; label: string; ph: string; area?: boolean; max: number }[] = [
  { k: "audience", label: "Public cible", ph: "ex. actifs 25-45 ans, débutants", max: 160 },
  { k: "colors", label: "Couleurs de marque", ph: "ex. noir et jaune", max: 60 },
  { k: "objective", label: "Objectif principal", ph: "ex. remplir les cours du soir", area: true, max: 200 },
  { k: "contact", label: "Contact / appel à l'action", ph: "ex. Réserve via le lien en bio", max: 120 },
  { k: "classInfo", label: "Cours / événements", ph: "ex. WOD midi, yoga du dimanche", area: true, max: 200 },
];

function Club() {
  const [profile, save, loaded] = useProfile();
  const [v, setV] = useState<ClubProfile>(EMPTY);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [status, setStatus] = useState<"" | "ok" | "err">("");

  useEffect(() => {
    if (loaded && profile) setV({ ...EMPTY, ...profile });
  }, [loaded, profile]);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const r = schema.safeParse(v);
    if (!r.success) {
      const errs: Record<string, string> = {};
      r.error.issues.forEach((i) => (errs[String(i.path[0])] = i.message));
      setErrors(errs);
      setStatus("");
      return;
    }
    setErrors({});
    setStatus(save(r.data) ? "ok" : "err");
  };

  const f = (k: keyof ClubProfile, val: string) => { setV({ ...v, [k]: val }); setStatus(""); };

  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <PageHeader eyebrow="Profil" title="Mon club">Ces infos personnalisent tes contenus. Elles restent dans ce navigateur.</PageHeader>
      <div className="mb-4 flex flex-wrap gap-2">
        <button type="button" className="btn btn-outline btn-sm" onClick={() => { setV(SAMPLE_PROFILE); setStatus(""); }}>Remplir avec l'exemple Studio Atlas (club fictif)</button>
      </div>
      <form onSubmit={submit} noValidate className="card-surface space-y-4 p-5 sm:p-6">
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="c-name" className="mb-1 block text-sm font-bold">Nom du club *</label>
            <input id="c-name" className="field" maxLength={60} value={v.name} aria-invalid={!!errors.name} onChange={(e) => f("name", e.target.value)} />
            {errors.name && <p className="mt-1 text-sm text-destructive">{errors.name}</p>}
          </div>
          <div>
            <label htmlFor="c-town" className="mb-1 block text-sm font-bold">Ville *</label>
            <input id="c-town" className="field" maxLength={60} value={v.town} aria-invalid={!!errors.town} onChange={(e) => f("town", e.target.value)} />
            {errors.town && <p className="mt-1 text-sm text-destructive">{errors.town}</p>}
          </div>
          <div>
            <label htmlFor="c-sport" className="mb-1 block text-sm font-bold">Sport</label>
            <select id="c-sport" className="field" value={v.sport} onChange={(e) => f("sport", e.target.value)}>{SPORTS.map((s) => <option key={s}>{s}</option>)}</select>
          </div>
          <div>
            <label htmlFor="c-tone" className="mb-1 block text-sm font-bold">Ton de marque</label>
            <select id="c-tone" className="field" value={v.tone} onChange={(e) => f("tone", e.target.value)}>{TONES.map((s) => <option key={s}>{s}</option>)}</select>
          </div>
        </div>
        {TEXT_FIELDS.map((t) => (
          <div key={t.k}>
            <label htmlFor={`c-${t.k}`} className="mb-1 block text-sm font-bold">{t.label}</label>
            {t.area ? (
              <textarea id={`c-${t.k}`} rows={2} className="field" maxLength={t.max} placeholder={t.ph} value={v[t.k]} onChange={(e) => f(t.k, e.target.value)} />
            ) : (
              <input id={`c-${t.k}`} className="field" maxLength={t.max} placeholder={t.ph} value={v[t.k]} onChange={(e) => f(t.k, e.target.value)} />
            )}
          </div>
        ))}
        <p className="text-xs text-muted-foreground">N'indique pas de données personnelles sensibles. Aucune donnée n'est transmise.</p>
        <div className="flex flex-wrap items-center gap-3">
          <button type="submit" className="btn btn-ink">Enregistrer le profil</button>
          {status === "ok" && <p className="text-sm font-bold text-success" role="status">Profil enregistré. <Link to="/generateur" className="underline">Aller au générateur</Link></p>}
          {status === "err" && <p className="text-sm text-destructive" role="alert">Enregistrement impossible : stockage du navigateur indisponible.</p>}
        </div>
      </form>
    </div>
  );
}
