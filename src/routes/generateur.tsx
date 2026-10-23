import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { CheckCircle2, FileDown, RefreshCw, Save, Wand2 } from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { PieceCard, PlanCard } from "@/components/ContentEditor";
import { CopyButton } from "@/components/CopyButton";
import { generate } from "@/lib/generator";
import { SAMPLE_INPUT, SAMPLE_PROFILE } from "@/lib/sample";
import { newId, upsertContent, useProfile, writeJSON, PROFILE_KEY } from "@/lib/storage";
import { exportItem, itemToText } from "@/lib/export";
import { FORMATS, GOALS, TONES, type ContentItem, type GenerateInput } from "@/lib/types";

export const Route = createFileRoute("/generateur")({
  validateSearch: (s: Record<string, unknown>): { demo?: number } => (s["demo"] ? { demo: 1 } : {}),
  head: () => ({
    meta: [
      { title: "Générateur — ClubPost" },
      { name: "description", content: "Génère légendes Instagram, carrousels, stories et kits de la semaine pour ton club de sport." },
      { property: "og:title", content: "Générateur — ClubPost" },
      { property: "og:description", content: "Crée le contenu de la semaine de ton club en quelques clics." },
    ],
  }),
  component: Generator,
});

const EMPTY: GenerateInput = { goal: "essai", format: "caption", topic: "", eventDetails: "", tone: "Motivant", cta: "", variants: 2 };

function Generator() {
  const { demo } = Route.useSearch();
  const [profile, , loaded] = useProfile();
  const [input, setInput] = useState<GenerateInput>(EMPTY);
  const [seed, setSeed] = useState(1);
  const [item, setItem] = useState<ContentItem | null>(null);
  const [saved, setSaved] = useState<"idle" | "ok" | "err">("idle");
  const [error, setError] = useState("");

  useEffect(() => {
    if (profile?.tone) setInput((i) => ({ ...i, tone: profile.tone }));
  }, [profile?.tone]);

  const run = (inp: GenerateInput, s: number, prof = profile) => {
    if (inp.topic.length > 120 || inp.eventDetails.length > 300 || inp.cta.length > 120) {
      setError("Un des champs est trop long.");
      return;
    }
    if (inp.goal === "evenement" && !inp.eventDetails.trim()) {
      setError("");
    }
    setError("");
    const r = generate(prof, inp, s);
    setItem({ id: newId(), title: r.title, goal: inp.goal, format: inp.format, status: "draft", createdAt: Date.now(), updatedAt: Date.now(), pieces: r.pieces, weeklyPlan: r.weeklyPlan });
    setSaved("idle");
  };

  useEffect(() => {
    if (demo && loaded) {
      setInput(SAMPLE_INPUT);
      run(SAMPLE_INPUT, 1, profile ?? SAMPLE_PROFILE);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [demo, loaded]);

  const set = <K extends keyof GenerateInput>(k: K, v: GenerateInput[K]) => setInput((i) => ({ ...i, [k]: v }));

  const save = (status?: ContentItem["status"]) => {
    if (!item) return;
    const next = { ...item, status: status ?? item.status, updatedAt: Date.now() };
    setItem(next);
    setSaved(upsertContent(next) ? "ok" : "err");
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <PageHeader eyebrow="Générateur de démo · à base de modèles" title="Crée ton contenu">
        Ce générateur assemble des modèles rédigés à la main avec les infos de ton club. Ce n'est pas de l'IA générative. Les infos manquantes apparaissent en « [à compléter] » — rien n'est inventé.
      </PageHeader>

      {loaded && !profile && (
        <div className="card-surface mb-6 flex flex-col gap-3 bg-accent p-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm"><strong>Pas encore de profil club.</strong> Les contenus seront génériques.</p>
          <div className="flex flex-wrap gap-2">
            <button type="button" className="btn btn-ink btn-sm" onClick={() => writeJSON(PROFILE_KEY, SAMPLE_PROFILE)}>Charger l'exemple Studio Atlas (fictif)</button>
            <Link to="/club" className="btn btn-outline btn-sm">Créer mon profil</Link>
          </div>
        </div>
      )}
      {profile && <p className="mb-4 text-sm text-muted-foreground">Profil utilisé : <strong className="text-foreground">{profile.name}</strong> ({profile.sport}, {profile.town}) · <Link to="/club" className="underline">modifier</Link></p>}

      <div className="grid gap-6 lg:grid-cols-[360px_1fr]">
        <form
          className="card-surface h-fit space-y-4 p-5 lg:sticky lg:top-24"
          onSubmit={(e) => {
            e.preventDefault();
            setSeed(1);
            run(input, 1);
          }}
        >
          <div>
            <label htmlFor="g-goal" className="mb-1 block text-sm font-bold">Objectif</label>
            <select id="g-goal" className="field" value={input.goal} onChange={(e) => set("goal", e.target.value as GenerateInput["goal"])}>
              {GOALS.map((g) => <option key={g.id} value={g.id}>{g.label}</option>)}
            </select>
          </div>
          <fieldset>
            <legend className="mb-1 text-sm font-bold">Format</legend>
            <div className="grid grid-cols-2 gap-2">
              {FORMATS.map((f) => (
                <label key={f.id} className={`cursor-pointer rounded-xl border-2 p-2 text-center text-sm font-bold ${input.format === f.id ? "border-ink bg-lime" : "border-border"}`}>
                  <input type="radio" name="format" className="sr-only" checked={input.format === f.id} onChange={() => set("format", f.id)} />
                  {f.label}
                </label>
              ))}
            </div>
          </fieldset>
          <div>
            <label htmlFor="g-topic" className="mb-1 block text-sm font-bold">Sujet (optionnel)</label>
            <input id="g-topic" className="field" maxLength={120} placeholder="ex. reprise après l'été" value={input.topic} onChange={(e) => set("topic", e.target.value)} />
          </div>
          {(input.goal === "evenement" || input.goal === "promo") && (
            <div>
              <label htmlFor="g-event" className="mb-1 block text-sm font-bold">Détails (date, lieu, conditions)</label>
              <textarea id="g-event" rows={3} className="field" maxLength={300} placeholder="Seules les infos que tu saisis seront utilisées" value={input.eventDetails} onChange={(e) => set("eventDetails", e.target.value)} />
              {!input.eventDetails.trim() && <p className="mt-1 text-xs text-muted-foreground">Sans détails, le texte affichera « [à compléter] ».</p>}
            </div>
          )}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label htmlFor="g-tone" className="mb-1 block text-sm font-bold">Ton</label>
              <select id="g-tone" className="field" value={input.tone} onChange={(e) => set("tone", e.target.value as GenerateInput["tone"])}>
                {TONES.map((t) => <option key={t}>{t}</option>)}
              </select>
            </div>
            <div>
              <label htmlFor="g-n" className="mb-1 block text-sm font-bold">Variantes</label>
              <select id="g-n" className="field" disabled={input.format === "weekly"} value={input.variants} onChange={(e) => set("variants", Number(e.target.value))}>
                {[1, 2, 3, 4, 5].map((n) => <option key={n}>{n}</option>)}
              </select>
            </div>
          </div>
          <div>
            <label htmlFor="g-cta" className="mb-1 block text-sm font-bold">Appel à l'action (optionnel)</label>
            <input id="g-cta" className="field" maxLength={120} placeholder="ex. Réserve ta séance d'essai" value={input.cta} onChange={(e) => set("cta", e.target.value)} />
          </div>
          {error && <p className="text-sm text-destructive" role="alert">{error}</p>}
          <button type="submit" className="btn btn-ink w-full"><Wand2 size={16} aria-hidden /> Générer</button>
        </form>

        <section aria-live="polite" aria-label="Résultats">
          {!item ? (
            <div className="card-surface grid min-h-64 place-items-center p-8 text-center">
              <div>
                <Wand2 className="mx-auto mb-3 text-muted-foreground" aria-hidden />
                <p className="font-bold">Aucun contenu généré</p>
                <p className="text-sm text-muted-foreground">Choisis un objectif et un format, puis clique sur « Générer ».</p>
                <Link to="/generateur" search={{ demo: 1 }} className="btn btn-outline btn-sm mt-4">Tester avec un exemple</Link>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="card-surface flex flex-col gap-3 p-4">
                <label htmlFor="g-title" className="text-xs font-bold uppercase text-muted-foreground">Titre</label>
                <input id="g-title" className="field font-bold" value={item.title} onChange={(e) => setItem({ ...item, title: e.target.value })} />
                <div className="flex flex-wrap gap-2">
                  <button type="button" className="btn btn-outline btn-sm" onClick={() => { const s = seed + 1; setSeed(s); run(input, s); }}><RefreshCw size={14} aria-hidden /> Regénérer</button>
                  <CopyButton text={itemToText(item)} label="Copier tout" />
                  <button type="button" className="btn btn-ink btn-sm" onClick={() => save()}><Save size={14} aria-hidden /> Sauvegarder</button>
                  <button type="button" className={`btn btn-sm ${item.status === "approved" ? "btn-lime" : "btn-outline"}`} onClick={() => save(item.status === "approved" ? "draft" : "approved")} aria-pressed={item.status === "approved"}>
                    <CheckCircle2 size={14} aria-hidden /> {item.status === "approved" ? "Validé" : "Marquer validé"}
                  </button>
                  <button type="button" className="btn btn-outline btn-sm" onClick={() => exportItem(item, "txt")}><FileDown size={14} aria-hidden /> .txt</button>
                  <button type="button" className="btn btn-outline btn-sm" onClick={() => exportItem(item, "md")}><FileDown size={14} aria-hidden /> .md</button>
                </div>
                {saved === "ok" && <p className="text-sm font-bold text-success" role="status">Sauvegardé dans ce navigateur. <Link to="/contenus" className="underline">Voir Mes contenus</Link></p>}
                {saved === "err" && <p className="text-sm text-destructive" role="alert">Impossible d'enregistrer (stockage du navigateur indisponible ou plein). Exporte ton contenu en .txt.</p>}
              </div>
              {item.weeklyPlan !== undefined && <PlanCard plan={item.weeklyPlan} onChange={(p) => setItem({ ...item, weeklyPlan: p })} />}
              <div className="grid gap-4 xl:grid-cols-2">
                {item.pieces.map((p) => (
                  <PieceCard
                    key={p.id}
                    piece={p}
                    onChange={(np) => setItem({ ...item, pieces: item.pieces.map((x) => (x.id === p.id ? np : x)) })}
                    onDelete={item.pieces.length > 1 ? () => setItem({ ...item, pieces: item.pieces.filter((x) => x.id !== p.id) }) : undefined}
                  />
                ))}
              </div>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
