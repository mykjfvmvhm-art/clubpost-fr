export function PageHeader({ eyebrow, title, children }: { eyebrow: string; title: string; children?: React.ReactNode }) {
  return (
    <div className="mb-6">
      <p className="chip mb-3 bg-lime">{eyebrow}</p>
      <h1 className="text-3xl font-bold sm:text-4xl">{title}</h1>
      {children && <div className="mt-2 max-w-2xl text-muted-foreground">{children}</div>}
    </div>
  );
}

export function LegalPage({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <p className="chip mb-3 bg-warning text-warning-foreground">Brouillon — à compléter avant tout lancement commercial</p>
      <h1 className="mb-6 text-3xl font-bold">{title}</h1>
      <div className="card-surface space-y-4 p-6 text-sm leading-relaxed [&_h2]:mt-4 [&_h2]:text-lg [&_h2]:font-bold">{children}</div>
    </div>
  );
}
