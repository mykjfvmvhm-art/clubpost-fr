import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Check, Clock3, MessageCircle, Sparkles } from "lucide-react";

const packs = [
  {
    name: "Pack découverte",
    price: "15 €",
    note: "Pour tester sans s'engager",
    description: "Des contenus adaptés à ton club pour commencer à publier plus régulièrement.",
    items: ["5 légendes Instagram personnalisées", "5 idées de stories", "Appel à l'action adapté à ton objectif"],
    featured: false,
  },
  {
    name: "Pack semaine",
    price: "25 €",
    note: "Le plus simple pour démarrer",
    description: "Une petite semaine de contenus prête à relire et à publier.",
    items: ["3 publications personnalisées", "3 stories complémentaires", "Un mini-planning de publication"],
    featured: true,
  },
  {
    name: "Pack mois",
    price: "59 €",
    note: "Pour prendre de l'avance",
    description: "Une base de contenus pour préparer le mois à venir.",
    items: ["12 idées de publications et légendes", "12 idées de stories", "Un calendrier éditorial simple"],
    featured: false,
  },
];

export const Route = createFileRoute("/offres")({
  head: () => ({
    meta: [
      { title: "Création de contenus Instagram pour clubs sportifs — ClubPost" },
      { name: "description", content: "Des idées de posts, légendes et stories personnalisées pour coachs, studios et clubs sportifs. Packs de lancement à partir de 15 €." },
      { property: "og:title", content: "Des contenus réseaux sociaux pour ton club — ClubPost" },
      { property: "og:description", content: "Des contenus personnalisés, simples à relire et prêts à publier." },
    ],
  }),
  component: OffersPage,
});

function OffersPage() {
  return (
    <main>
      <section className="mx-auto max-w-6xl px-4 pb-12 pt-10 sm:pt-16">
        <div className="mx-auto max-w-3xl text-center">
          <p className="chip mb-4 bg-lime"><Sparkles size={14} aria-hidden /> Service de création de contenu</p>
          <h1 className="text-4xl font-extrabold leading-tight sm:text-6xl">
            Tu coaches. <span className="lime-underline">On prépare tes posts.</span>
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-lg text-muted-foreground">
            Des idées de publications, des légendes et des stories pensées pour les coachs indépendants, studios et clubs sportifs — sans devoir passer ta soirée à chercher quoi publier.
          </p>
          <div className="mt-7 flex flex-wrap justify-center gap-3">
            <a href="#packs" className="btn btn-ink px-6 py-3 text-base">Voir les packs <ArrowRight size={18} aria-hidden /></a>
            <Link to="/generateur" className="btn btn-outline px-6 py-3 text-base">Tester la démo gratuite</Link>
          </div>
          <p className="mt-4 text-xs text-muted-foreground">Service de lancement. Aucun paiement en ligne : la demande est préparée manuellement avant toute confirmation.</p>
        </div>
      </section>

      <section id="packs" className="mx-auto max-w-6xl px-4 py-10" aria-labelledby="packs-title">
        <div className="mb-8 max-w-2xl">
          <h2 id="packs-title" className="text-3xl font-bold">Choisis ton premier pack</h2>
          <p className="mt-2 text-muted-foreground">Tarifs de lancement indicatifs. Le contenu exact, le délai et le prix final seront confirmés avant de commencer.</p>
        </div>
        <div className="grid gap-5 md:grid-cols-3">
          {packs.map((pack) => (
            <article key={pack.name} className={`card-surface flex flex-col p-6 ${pack.featured ? "border-2 border-ink shadow-lg" : ""}`}>
              {pack.featured && <span className="chip mb-3 w-fit bg-lime">Pour commencer</span>}
              <h3 className="text-xl font-bold">{pack.name}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{pack.note}</p>
              <p className="mt-5 font-display text-4xl font-extrabold">{pack.price}</p>
              <p className="mt-3 min-h-12 text-sm text-muted-foreground">{pack.description}</p>
              <ul className="my-5 space-y-3 text-sm">
                {pack.items.map((item) => <li key={item} className="flex gap-2"><Check className="mt-0.5 shrink-0 text-success" size={17} aria-hidden /><span>{item}</span></li>)}
              </ul>
              <Link to="/contact" className={`btn mt-auto w-full ${pack.featured ? "btn-lime" : "btn-outline"}`}>Demander ce pack <ArrowRight size={16} aria-hidden /></Link>
            </article>
          ))}
        </div>
      </section>

      <section className="bg-ink py-14 text-ink-foreground">
        <div className="mx-auto grid max-w-6xl gap-8 px-4 md:grid-cols-3">
          <div><MessageCircle className="mb-3 text-lime" aria-hidden /><h2 className="font-bold">1. Tu expliques ton besoin</h2><p className="mt-2 text-sm opacity-75">Ton sport, ta ville, ton ton et ce que tu veux mettre en avant.</p></div>
          <div><Sparkles className="mb-3 text-lime" aria-hidden /><h2 className="font-bold">2. On définit le pack</h2><p className="mt-2 text-sm opacity-75">Le contenu et le prix sont confirmés avec toi avant tout travail.</p></div>
          <div><Clock3 className="mb-3 text-lime" aria-hidden /><h2 className="font-bold">3. Tu relis avant publication</h2><p className="mt-2 text-sm opacity-75">Tu vérifies chaque information et tu publies toi-même quand tout te convient.</p></div>
        </div>
      </section>

      <section className="mx-auto max-w-3xl px-4 py-14 text-center">
        <h2 className="text-3xl font-bold">On prépare ton premier pack ?</h2>
        <p className="mt-3 text-muted-foreground">Explique-nous ton activité et le type de contenus dont tu as besoin. Rien n'est facturé automatiquement.</p>
        <Link to="/contact" className="btn btn-ink mt-6 px-6 py-3">Faire une demande <ArrowRight size={18} aria-hidden /></Link>
      </section>
    </main>
  );
}
