import { createFileRoute } from "@tanstack/react-router";
import { LegalPage } from "@/components/PageHeader";

export const Route = createFileRoute("/mentions-legales")({
  head: () => ({
    meta: [
      { title: "Mentions légales (brouillon) — ClubPost" },
      { name: "description", content: "Mentions légales de ClubPost — brouillon à compléter." },
      { property: "og:title", content: "Mentions légales — ClubPost" },
      { property: "og:description", content: "Brouillon à compléter avant lancement commercial." },
    ],
  }),
  component: () => (
    <LegalPage title="Mentions légales">
      <h2>Éditeur du site</h2><p>Nom / raison sociale : [à compléter]<br />Statut (ex. micro-entreprise), SIRET : [à compléter]<br />Adresse : [à compléter]<br />Contact : [à compléter]</p>
      <h2>Directeur de la publication</h2><p>[à compléter]</p>
      <h2>Hébergement</h2><p>Nom et adresse de l'hébergeur : [à compléter selon la solution de publication utilisée]</p>
      <p className="text-muted-foreground">Ce texte est un modèle. Fais-le vérifier avant toute exploitation commerciale.</p>
    </LegalPage>
  ),
});
