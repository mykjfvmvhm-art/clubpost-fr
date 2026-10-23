import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { PageHeader } from "@/components/PageHeader";
import { CONTENTS_KEY, PROFILE_KEY, writeJSON } from "@/lib/storage";
import { SAMPLE_PROFILE } from "@/lib/sample";

export const Route = createFileRoute("/parametres")({
  head: () => ({
    meta: [
      { title: "Paramètres — ClubPost" },
      { name: "description", content: "Gère et réinitialise les données de démonstration stockées dans ton navigateur." },
      { property: "og:title", content: "Paramètres — ClubPost" },
      { property: "og:description", content: "Réinitialiser les données locales de ClubPost." },
    ],
  }),
  component: Settings,
});

type Action = "contents" | "profile" | "all";

function Settings() {
  const [pending, setPending] = useState<Action | null>(null);
  const [msg, setMsg] = useState("");
  const labels: Record<Action, string> = { contents: "Supprimer tous mes contenus", profile: "Supprimer mon profil club", all: "Tout réinitialiser" };
  const doIt = (a: Action) => {
    let ok = true;
    if (a !== "profile") ok = writeJSON(CONTENTS_KEY, null) && ok;
    if (a !== "contents") ok = writeJSON(PROFILE_KEY, null) && ok;
    setPending(null);
    setMsg(ok ? "Données supprimées de ce navigateur." : "Erreur : impossible d'accéder au stockage.");
  };
  return (
    <div className="mx-auto max-w-2xl px-4 py-8">
      <PageHeader eyebrow="Paramètres" title="Données de démo">Toutes tes données sont dans le localStorage de ce navigateur. Rien n'est envoyé.</PageHeader>
      <div className="card-surface space-y-4 p-5">
        <button type="button" className="btn btn-outline w-full" onClick={() => setMsg(writeJSON(PROFILE_KEY, SAMPLE_PROFILE) ? "Profil fictif Studio Atlas chargé." : "Erreur de stockage.")}>Charger le profil d'exemple (Studio Atlas, fictif)</button>
        {(Object.keys(labels) as Action[]).map((a) => (
          <div key={a}>
            {pending === a ? (
              <div className="rounded-xl bg-warning p-3 text-warning-foreground" role="alert">
                <p className="mb-2 text-sm font-bold">Confirmer : « {labels[a]} » ? Action irréversible.</p>
                <div className="flex gap-2">
                  <button type="button" className="btn btn-danger btn-sm" onClick={() => doIt(a)}>Oui, supprimer</button>
                  <button type="button" className="btn btn-outline btn-sm" onClick={() => setPending(null)}>Annuler</button>
                </div>
              </div>
            ) : (
              <button type="button" className="btn btn-danger w-full" onClick={() => { setPending(a); setMsg(""); }}>{labels[a]}</button>
            )}
          </div>
        ))}
        {msg && <p className="text-sm font-bold" role="status">{msg}</p>}
      </div>
    </div>
  );
}
