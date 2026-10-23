import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Download } from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { CONTENTS_KEY, PROFILE_KEY, readJSON, useContents, useProfile, writeJSON } from "@/lib/storage";
import { SAMPLE_PROFILE } from "@/lib/sample";
import { downloadBackup, parseBackup, type ClubPostBackup } from "@/lib/backup";
import type { ClubProfile, ContentItem } from "@/lib/types";

export const Route = createFileRoute("/parametres")({
  head: () => ({
    meta: [
      { title: "Paramètres — ClubPost" },
      { name: "description", content: "Gère tes données locales et crée une sauvegarde de ClubPost." },
      { property: "og:title", content: "Paramètres — ClubPost" },
      { property: "og:description", content: "Sauvegarder, restaurer ou réinitialiser les données locales de ClubPost." },
    ],
  }),
  component: Settings,
});

type Action = "contents" | "profile" | "all";

function Settings() {
  const [pending, setPending] = useState<Action | null>(null);
  const [msg, setMsg] = useState("");
  const [msgError, setMsgError] = useState(false);
  const [backupMsg, setBackupMsg] = useState("");
  const [backupError, setBackupError] = useState(false);
  const [pendingBackup, setPendingBackup] = useState<ClubPostBackup | null>(null);
  const [profile, , profileLoaded] = useProfile();
  const [contents, , contentsLoaded] = useContents();
  const storageLoaded = profileLoaded && contentsLoaded;

  const labels: Record<Action, string> = {
    contents: "Supprimer tous mes contenus",
    profile: "Supprimer mon profil club",
    all: "Tout réinitialiser",
  };

  const doIt = (action: Action) => {
    const previousContents = readJSON<ContentItem[]>(CONTENTS_KEY, []);
    const previousProfile = readJSON<ClubProfile | null>(PROFILE_KEY, null);
    const contentsChanged = action !== "profile";
    const profileChanged = action !== "contents";

    const contentsOk = !contentsChanged || writeJSON(CONTENTS_KEY, null);
    const profileOk = !profileChanged || writeJSON(PROFILE_KEY, null);

    setPending(null);
    if (contentsOk && profileOk) {
      setMsgError(false);
      setMsg("Données supprimées de ce navigateur.");
      return;
    }

    // If one part of a multi-key reset fails, attempt to restore the previous
    // values so the user is not left with a silently half-reset app.
    let rollbackOk = true;
    if (contentsChanged) rollbackOk = writeJSON(CONTENTS_KEY, previousContents) && rollbackOk;
    if (profileChanged) rollbackOk = writeJSON(PROFILE_KEY, previousProfile) && rollbackOk;
    setMsgError(true);
    setMsg(
      rollbackOk
        ? "La suppression a échoué. Les données précédentes ont été restaurées."
        : "La suppression a échoué et la restauration automatique n'a pas pu être confirmée. Vérifie tes données et restaure une sauvegarde si nécessaire.",
    );
  };

  const importFile = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const input = event.currentTarget;
    const file = input.files?.[0];
    if (!file) return;

    setBackupMsg("");
    setBackupError(false);
    setPendingBackup(null);
    try {
      const backup = parseBackup(await file.text());
      setPendingBackup(backup);
      setBackupMsg(
        `Fichier vérifié : ${backup.contents.length} contenu(s) et ${backup.profile ? "un profil club" : "aucun profil club"}. Confirme la restauration pour remplacer tes données actuelles.`,
      );
    } catch (error) {
      setBackupError(true);
      setBackupMsg(
        error instanceof Error
          ? error.message
          : "Impossible de lire ce fichier de sauvegarde.",
      );
    } finally {
      input.value = "";
    }
  };

  const restoreBackup = () => {
    if (!pendingBackup) return;
    const backup = pendingBackup;
    const previousContents = readJSON<ContentItem[]>(CONTENTS_KEY, []);
    const previousProfile = readJSON<ClubProfile | null>(PROFILE_KEY, null);

    if (!writeJSON(CONTENTS_KEY, backup.contents)) {
      setBackupError(true);
      setBackupMsg("Impossible d'enregistrer les contenus dans ce navigateur. Tes données actuelles n'ont pas été remplacées.");
      return;
    }
    if (!writeJSON(PROFILE_KEY, backup.profile)) {
      const contentsRestored = writeJSON(CONTENTS_KEY, previousContents);
      const profileRestored = writeJSON(PROFILE_KEY, previousProfile);
      setBackupError(true);
      setBackupMsg(
        contentsRestored && profileRestored
          ? "Impossible d'enregistrer le profil. La restauration a échoué ; tes données précédentes ont été restaurées."
          : "Impossible d'enregistrer le profil et la restauration automatique n'a pas pu être confirmée. Vérifie tes données et restaure une sauvegarde si nécessaire.",
      );
      return;
    }

    setPendingBackup(null);
    setBackupError(false);
    setBackupMsg(
      `Sauvegarde restaurée : ${backup.contents.length} contenu(s) et ${backup.profile ? "un profil club" : "aucun profil club"}.`,
    );
  };

  const exportFile = () => {
    try {
      downloadBackup(profile, contents);
      setBackupError(false);
      setBackupMsg("Sauvegarde téléchargée. Conserve ce fichier en lieu sûr.");
    } catch {
      setBackupError(true);
      setBackupMsg("Le téléchargement a échoué. Réessaie depuis un autre navigateur.");
    }
  };

  const loadSample = () => {
    const ok = writeJSON(PROFILE_KEY, SAMPLE_PROFILE);
    setMsgError(!ok);
    setMsg(ok ? "Profil fictif Studio Atlas chargé." : "Erreur : impossible d'accéder au stockage.");
  };

  return (
    <div className="mx-auto max-w-2xl px-4 py-8">
      <PageHeader eyebrow="Paramètres" title="Données et sauvegarde">
        Tes données restent dans le localStorage de ce navigateur. Une sauvegarde te permet de les transférer ou de les restaurer plus tard.
      </PageHeader>

      <section className="card-surface mb-5 space-y-4 p-5" aria-labelledby="backup-title">
        <div>
          <h2 id="backup-title" className="text-lg font-bold">Sauvegarder mes données</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Le fichier JSON contient ton profil de club et tous tes contenus sauvegardés. Il reste sur ton appareil jusqu'à ce que tu choisisses de le partager.
          </p>
        </div>
        <button type="button" className="btn btn-ink w-full" onClick={exportFile} disabled={!storageLoaded}>
          <Download size={16} aria-hidden />
          {storageLoaded ? "Télécharger ma sauvegarde" : "Chargement des données…"}
        </button>
        <div className="space-y-2">
          <label htmlFor="restore-backup" className="block text-sm font-bold">Restaurer une sauvegarde ClubPost</label>
          <input id="restore-backup" type="file" accept="application/json,.json" className="field" onChange={importFile} disabled={!storageLoaded} />
          <p className="text-xs text-muted-foreground">
            La restauration remplace le profil et la bibliothèque présents dans ce navigateur. Exporte d'abord une sauvegarde si tu veux conserver les données actuelles.
          </p>
          {pendingBackup && (
            <div className="rounded-xl border border-warning p-3" role="alert">
              <p className="text-sm font-bold">Remplacer les données actuelles par cette sauvegarde ?</p>
              <p className="mt-1 text-xs text-muted-foreground">Cette action remplace ton profil et tous les contenus enregistrés dans ce navigateur.</p>
              <div className="mt-3 flex flex-col gap-2 sm:flex-row">
                <button type="button" className="btn btn-danger" onClick={restoreBackup}>Confirmer la restauration</button>
                <button
                  type="button"
                  className="btn btn-outline"
                  onClick={() => {
                    setPendingBackup(null);
                    setBackupMsg("Restauration annulée. Tes données actuelles sont conservées.");
                    setBackupError(false);
                  }}
                >
                  Annuler
                </button>
              </div>
            </div>
          )}
        </div>
        {backupMsg && (
          <p className={`text-sm font-bold ${backupError ? "text-destructive" : "text-success"}`} role="status">
            {backupMsg}
          </p>
        )}
      </section>

      <section className="card-surface space-y-4 p-5" aria-labelledby="reset-title">
        <h2 id="reset-title" className="text-lg font-bold">Réinitialisation</h2>
        <button type="button" className="btn btn-outline w-full" onClick={loadSample}>
          Charger le profil d'exemple (Studio Atlas, fictif)
        </button>
        {(Object.keys(labels) as Action[]).map((action) => (
          <div key={action}>
            {pending === action ? (
              <div className="rounded-xl bg-warning p-3 text-warning-foreground" role="alert">
                <p className="mb-2 text-sm font-bold">Confirmer : « {labels[action]} » ? Action irréversible.</p>
                <div className="flex gap-2">
                  <button type="button" className="btn btn-danger btn-sm" onClick={() => doIt(action)}>Oui, supprimer</button>
                  <button type="button" className="btn btn-outline btn-sm" onClick={() => setPending(null)}>Annuler</button>
                </div>
              </div>
            ) : (
              <button
                type="button"
                className="btn btn-danger w-full"
                onClick={() => {
                  setPending(action);
                  setMsg("");
                  setMsgError(false);
                }}
              >
                {labels[action]}
              </button>
            )}
          </div>
        ))}
        {msg && (
          <p className={`text-sm font-bold ${msgError ? "text-destructive" : "text-success"}`} role={msgError ? "alert" : "status"}>
            {msg}
          </p>
        )}
      </section>
    </div>
  );
}
