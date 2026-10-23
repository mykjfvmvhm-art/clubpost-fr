import { createFileRoute } from "@tanstack/react-router";
import { FeedbackForm } from "@/components/FeedbackForm";
import { PageHeader } from "@/components/PageHeader";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact & avis — ClubPost" },
      { name: "description", content: "Donne ton avis sur ClubPost ou demande un accès à la bêta." },
      { property: "og:title", content: "Contact & avis — ClubPost" },
      { property: "og:description", content: "Aide-nous à construire ClubPost." },
    ],
  }),
  component: () => (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <PageHeader eyebrow="Contact" title="Donner mon avis / demander un accès bêta" />
      <FeedbackForm />
    </div>
  ),
});
