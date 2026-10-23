import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
  type ErrorComponentProps,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";
import { Home, Info, Library, Settings, Sparkles, UserRound } from "lucide-react";

import appCss from "../styles.css?url";
import { reportLovableError } from "../lib/lovable-error-reporting";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-foreground">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-foreground">Page not found</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: ErrorComponentProps) {
  console.error(error);
  const router = useRouter();
  useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold tracking-tight text-foreground">
          This page didn't load
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Something went wrong on our end. You can try refreshing or head back home.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Try again
          </button>
          <a
            href="/"
            className="inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent"
          >
            Go home
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "ClubPost — Le contenu de ton club, prêt à publier" },
      { name: "description", content: "ClubPost aide les coachs, box CrossFit et petits clubs à préparer leurs posts Instagram, stories et kits de la semaine en français." },
      { property: "og:title", content: "ClubPost — Le contenu de ton club, prêt à publier" },
      { property: "og:description", content: "Posts, carrousels, stories et planning hebdo pour ton club de sport." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "icon", href: "/favicon.ico", type: "image/x-icon" },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      { rel: "stylesheet", href: "https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:wght@600;700;800&family=Manrope:wght@400;500;700&display=swap" },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="fr">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

const NAV = [
  { to: "/", label: "Accueil", icon: Home },
  { to: "/generateur", label: "Générateur", icon: Sparkles },
  { to: "/contenus", label: "Mes contenus", icon: Library },
  { to: "/club", label: "Mon club", icon: UserRound },
] as const;

function RootComponent() {
  const { queryClient } = Route.useRouteContext();

  return (
    <QueryClientProvider client={queryClient}>
      <a href="#main" className="sr-only focus:not-sr-only focus:absolute focus:p-2">Aller au contenu</a>
      <div className="bg-warning px-4 py-2 text-center text-xs text-warning-foreground sm:text-sm" role="note">
        <Info size={14} className="mr-1 inline" aria-hidden />
        Mode démo : tes données restent uniquement dans ce navigateur, sur cet appareil. Effacer les données du navigateur peut les supprimer. Pas encore de synchronisation.
      </div>
      <header className="sticky top-0 z-30 border-b bg-background/90 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
          <Link to="/" className="flex items-center gap-2 font-display text-xl font-extrabold">
            <span className="grid size-8 place-items-center rounded-lg bg-lime text-lime-foreground">C</span>ClubPost
          </Link>
          <nav aria-label="Navigation principale" className="hidden gap-1 md:flex">
            {NAV.map((n) => (
              <Link key={n.to} to={n.to} activeOptions={{ exact: true }} className="rounded-full px-4 py-2 text-sm font-bold hover:bg-secondary" activeProps={{ className: "bg-ink text-ink-foreground hover:bg-ink" }}>
                {n.label}
              </Link>
            ))}
          </nav>
          <Link to="/parametres" className="btn btn-outline btn-sm" aria-label="Paramètres"><Settings size={16} aria-hidden /></Link>
        </div>
      </header>
      <main id="main" className="min-h-[70vh] pb-24 md:pb-0">
        <Outlet />
      </main>
      <footer className="border-t bg-card">
        <div className="mx-auto grid max-w-6xl gap-6 px-4 py-10 pb-28 text-sm sm:grid-cols-3 md:pb-10">
          <div>
            <p className="font-display text-lg font-extrabold">ClubPost</p>
            <p className="text-muted-foreground">Ton club. Ton contenu. Une semaine d'avance.</p>
            <p className="mt-2 text-xs text-muted-foreground">Prototype bêta. Générateur à base de modèles, pas d'IA générative.</p>
          </div>
          <nav aria-label="Liens légaux" className="flex flex-col gap-2">
            <Link to="/mentions-legales" className="hover:underline">Mentions légales (brouillon)</Link>
            <Link to="/confidentialite" className="hover:underline">Politique de confidentialité (brouillon)</Link>
            <Link to="/cgu" className="hover:underline">Conditions d'utilisation (brouillon)</Link>
          </nav>
          <nav aria-label="Liens utiles" className="flex flex-col gap-2">
            <Link to="/contact" className="hover:underline">Contact / avis</Link>
            <Link to="/parametres" className="hover:underline">Paramètres & réinitialisation</Link>
          </nav>
        </div>
      </footer>
      <nav aria-label="Navigation mobile" className="fixed inset-x-0 bottom-0 z-40 grid grid-cols-4 border-t bg-card md:hidden">
        {NAV.map((n) => (
          <Link key={n.to} to={n.to} activeOptions={{ exact: true }} className="flex flex-col items-center gap-1 py-2 text-[11px] font-bold text-muted-foreground" activeProps={{ className: "text-foreground" }}>
            <n.icon size={20} aria-hidden />
            {n.label}
          </Link>
        ))}
      </nav>
    </QueryClientProvider>
  );
}
