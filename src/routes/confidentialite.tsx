import { createFileRoute } from "@tanstack/react-router";
import { LegalPage } from "@/components/PageHeader";

export const Route = createFileRoute("/confidentialite")({
  head: () => ({
    meta: [
      { title: "Politique de confidentialité (brouillon) — ClubPost" },
      { name: "description", content: "Comment ClubPost traite tes données : stockage local uniquement." },
      { property: "og:title", content: "Confidentialité — ClubPost" },
      { property: "og:description", content: "Brouillon : données stockées uniquement dans ton navigateur." },
    ],
  }),
  component: () => (
    <LegalPage title="Politique de confidentialité">
      <h2>Fonctionnement actuel (démo)</h2>
      <p>Le profil club et les contenus sont enregistrés uniquement dans le stockage local (localStorage) de ton navigateur. Ils ne sont pas transmis à ClubPost ni à un tiers.</p>
      <p>Le formulaire de contact n'envoie rien : il prépare un texte que tu copies ou ouvres dans ta propre messagerie.</p>
      <h2>Suppression</h2><p>Tu peux tout supprimer depuis la page Paramètres ou en effaçant les données de ton navigateur.</p>
      <h2>Responsable du traitement, droits RGPD, cookies, mesures d'audience</h2><p>[à compléter avant lancement — notamment si des comptes, une base de données ou des statistiques sont ajoutés]</p>
    </LegalPage>
  ),
});
