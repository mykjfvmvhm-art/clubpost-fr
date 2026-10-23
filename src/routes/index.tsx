import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, CalendarRange, ClipboardCopy, FileDown, Layers, ShieldCheck, UserRound, Wand2 } from "lucide-react";
import { Dashboard } from "@/components/Dashboard";
import { FeedbackForm } from "@/components/FeedbackForm";
import { generate } from "@/lib/generator";
import { SAMPLE_PROFILE } from "@/lib/sample";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "ClubPost — Le contenu de ton club, prêt à publier" },
      { name: "description", content: "Prépare en quelques minutes les posts Instagram, stories et le planning hebdo de ton club de sport. Démo gratuite, en français." },
      { property: "og:title", content: "ClubPost — Le contenu de ton club, prêt à publier" },
      { property: "og:description", content: "Ton club. Ton contenu. Une semaine d'avance." },
    ],
  }),
  component: Index,
});

const FAQ = [
  ["Est-ce que ClubPost utilise l'IA ?", "Pas pour l'instant. La démo utilise des modèles et des règles rédigés à la main, personnalisés avec ton profil de club. Une intégration IA est une piste pour plus tard."],
  ["Est-ce que ça publie sur Instagram ?", "Non. Tu copies ou exportes tes contenus, puis tu les publies toi-même. Aucune connexion à Instagram n'existe à ce jour."],
  ["Où sont stockées mes données ?", "Uniquement dans ton navigateur (localStorage). Rien n'est envoyé à un serveur. Si tu effaces les données du navigateur, tes contenus disparaissent."],
  ["Faut-il créer un compte ?", "Non, pas de compte pour la démo. Pas de synchronisation entre appareils pour le moment."],
  ["Le contenu invente-t-il des prix ou des horaires ?", "Jamais. Quand une info manque, ClubPost affiche « [à compléter] » pour que tu la renseignes toi-même."],
];

function Index() {
  const sample = generate(SAMPLE_PROFILE, { goal: "essai", format: "caption", topic: "reprendre le sport en douceur", eventDetails: "", tone: "Motivant", cta: "", variants: 1 }, 3).pieces[0]!;
  return (
    <div>
      <section className="mx-auto max-w-6xl px-4 pb-12 pt-10 sm:pt-16">
        <div className="grid items-center gap-10 lg:grid-cols-[1.2fr_1fr]">
          <div>
            <p className="chip mb-4 bg-lime">Bêta gratuite · 100 % français</p>
            <h1 className="text-4xl font-extrabold leading-[1.05] sm:text-6xl">
              Ton club. Ton contenu. <span className="lime-underline">Une semaine d'avance.</span>
            </h1>
            <p className="mt-5 max-w-xl text-lg text-muted-foreground">
              ClubPost prépare les posts, carrousels, stories et le planning hebdo de ta box, ton studio ou ton club — à partir de ton profil, en quelques clics.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Link to="/generateur" className="btn btn-ink px-6 py-3 text-base">Créer mon premier kit <ArrowRight size={18} aria-hidden /></Link>
              <Link to="/generateur" search={{ demo: 1 }} className="btn btn-outline px-6 py-3 text-base">Voir un exemple</Link>
            </div>
            <p className="mt-4 text-xs text-muted-foreground">Générateur de démonstration à base de modèles — pas d'IA, pas de publication automatique, pas de compte.</p>
          </div>
          <div className="card-surface rotate-1 p-5 shadow-xl">
            <p className="chip mb-3 bg-secondary">Exemple · Studio Atlas (club fictif)</p>
            <p className="font-display text-xl font-bold">{sample.hook}</p>
            <p className="mt-3 line-clamp-6 whitespace-pre-line text-sm text-muted-foreground">{sample.caption}</p>
            <p className="mt-3 text-xs font-bold text-success">{sample.hashtags}</p>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-14" aria-labelledby="dash">
        <h2 id="dash" className="mb-4 text-2xl font-bold">Ton tableau de bord</h2>
        <Dashboard />
      </section>

      <section className="bg-ink py-14 text-ink-foreground" aria-labelledby="how">
        <div className="mx-auto max-w-6xl px-4">
          <h2 id="how" className="mb-8 text-3xl font-bold">Comment ça marche</h2>
          <ol className="grid gap-4 sm:grid-cols-3">
            {[
              [UserRound, "1. Présente ton club", "Nom, sport, ville, public, ton, objectif. Une seule fois."],
              [Wand2, "2. Choisis ton objectif", "Essais, événement, cours, communauté, conseils ou offre."],
              [ClipboardCopy, "3. Copie, ajuste, publie", "Édite, valide, exporte en .txt ou .md, publie toi-même."],
            ].map(([Icon, t, d]) => {
              const I = Icon as typeof UserRound;
              return (
                <li key={t as string} className="rounded-2xl border border-ink-foreground/15 p-5">
                  <I className="mb-3 text-lime" aria-hidden />
                  <p className="text-lg font-bold">{t as string}</p>
                  <p className="text-sm opacity-75">{d as string}</p>
                </li>
              );
            })}
          </ol>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-14" aria-labelledby="feat">
        <h2 id="feat" className="mb-8 text-3xl font-bold">Ce que tu peux faire aujourd'hui</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[
            [CalendarRange, "Kit de la semaine", "3 posts + 3 stories + un planning du lundi au dimanche."],
            [Layers, "4 formats", "Légende Instagram, plan de carrousel, story, kit hebdo."],
            [Wand2, "Variantes", "Jusqu'à 5 variantes, et « Regénérer » pour d'autres formulations."],
            [ClipboardCopy, "Copier en un clic", "Chaque champ ou tout le contenu d'un coup."],
            [FileDown, "Export .txt / .md", "Partage avec ton équipe ou garde une archive."],
            [ShieldCheck, "Respect de la vie privée", "Aucune donnée envoyée. Tout reste sur ton appareil."],
          ].map(([Icon, t, d]) => {
            const I = Icon as typeof UserRound;
            return (
              <div key={t as string} className="card-surface p-5">
                <I className="mb-3" aria-hidden />
                <p className="font-bold">{t as string}</p>
                <p className="text-sm text-muted-foreground">{d as string}</p>
              </div>
            );
          })}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-14" aria-labelledby="price">
        <h2 id="price" className="mb-2 text-3xl font-bold">Tarifs</h2>
        <p className="mb-6 text-sm text-muted-foreground">Bêta en cours — aucun paiement n'est intégré pour le moment.</p>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="card-surface p-6">
            <p className="font-bold">Démo gratuite</p>
            <p className="mt-2 font-display text-4xl font-extrabold">0 €</p>
            <ul className="mt-4 space-y-1 text-sm text-muted-foreground">
              <li>✓ Générateur à base de modèles</li><li>✓ Tous les formats</li><li>✓ Stockage local sur ton appareil</li>
            </ul>
            <Link to="/generateur" className="btn btn-outline mt-6 w-full">Essayer maintenant</Link>
          </div>
          <div className="card-surface border-2 border-ink p-6">
            <div className="flex items-center justify-between"><p className="font-bold">ClubPost Plus</p><span className="chip bg-lime">Prévu</span></div>
            <p className="mt-2 font-display text-4xl font-extrabold">19 €<span className="text-base font-medium">/mois</span></p>
            <p className="mt-1 text-xs text-muted-foreground">Tarif de lancement envisagé — bêta, sans paiement intégré pour le moment.</p>
            <ul className="mt-4 space-y-1 text-sm text-muted-foreground">
              <li>• Compte et synchronisation multi-appareils (prévu)</li><li>• Génération enrichie (prévu)</li><li>• Calendrier éditorial (prévu)</li>
            </ul>
            <a href="#contact" className="btn btn-lime mt-6 w-full">Rejoindre la bêta</a>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-3xl px-4 pb-14" aria-labelledby="faq">
        <h2 id="faq" className="mb-6 text-3xl font-bold">Questions fréquentes</h2>
        <div className="space-y-2">
          {FAQ.map(([q, a]) => (
            <details key={q} className="card-surface group p-4">
              <summary className="cursor-pointer font-bold">{q}</summary>
              <p className="mt-2 text-sm text-muted-foreground">{a}</p>
            </details>
          ))}
        </div>
      </section>

      <section id="contact" className="mx-auto max-w-3xl scroll-mt-24 px-4 pb-16" aria-labelledby="contact-title">
        <h2 id="contact-title" className="mb-2 text-3xl font-bold">Donner mon avis / demander un accès bêta</h2>
        <p className="mb-6 text-muted-foreground">Ton retour façonne ClubPost.</p>
        <FeedbackForm />
      </section>
    </div>
  );
}
