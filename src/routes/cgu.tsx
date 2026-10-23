import { createFileRoute } from "@tanstack/react-router";
import { LegalPage } from "@/components/PageHeader";

export const Route = createFileRoute("/cgu")({
  head: () => ({
    meta: [
      { title: "Conditions d'utilisation (brouillon) — ClubPost" },
      { name: "description", content: "Conditions d'utilisation de la bêta ClubPost — brouillon." },
      { property: "og:title", content: "Conditions d'utilisation — ClubPost" },
      { property: "og:description", content: "Brouillon à compléter avant lancement commercial." },
    ],
  }),
  component: () => (
    <LegalPage title="Conditions d'utilisation">
      <h2>Objet</h2><p>ClubPost est un prototype gratuit en bêta qui aide à rédiger des contenus pour les réseaux sociaux à partir de modèles.</p>
      <h2>Responsabilité</h2><p>Les textes proposés sont des suggestions. Tu restes responsable de leur relecture et de leur publication.</p>
      <h2>Tarifs</h2><p>Aucun paiement n'est proposé actuellement. Le tarif de 19 €/mois est envisagé et non contractuel.</p>
      <h2>Conditions complètes (CGU/CGV)</h2><p>[à compléter avant tout lancement commercial]</p>
    </LegalPage>
  ),
});
