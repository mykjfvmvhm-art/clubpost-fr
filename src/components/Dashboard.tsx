import { Link } from "@tanstack/react-router";
import { CalendarDays, CheckCircle2, FileText, PencilLine, UserRound } from "lucide-react";
import { useContents, useProfile } from "@/lib/storage";

export function Dashboard() {
  const [contents, , loaded] = useContents();
  const [profile] = useProfile();
  const drafts = contents.filter((c) => c.status === "draft").length;
  const approved = contents.length - drafts;
  const weekly = contents.find((c) => c.format === "weekly");
  if (!loaded) return <div className="card-surface h-40 animate-pulse" aria-hidden />;
  const stats = [
    { label: "Contenus sauvegardés", value: contents.length, icon: FileText },
    { label: "Brouillons", value: drafts, icon: PencilLine },
    { label: "Validés", value: approved, icon: CheckCircle2 },
  ];
  return (
    <div className="space-y-4">
      {!profile && (
        <div className="card-surface flex flex-col gap-3 bg-accent p-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-3">
            <UserRound className="mt-1 shrink-0" aria-hidden />
            <div>
              <p className="font-bold">Étape 1 : présente ton club</p>
              <p className="text-sm">2 minutes pour des contenus personnalisés — ou charge l'exemple fictif Studio Atlas.</p>
            </div>
          </div>
          <Link to="/club" className="btn btn-ink">Créer mon profil</Link>
        </div>
      )}
      <div className="grid grid-cols-3 gap-3">
        {stats.map((s) => (
          <div key={s.label} className="card-surface p-4">
            <s.icon size={18} className="text-muted-foreground" aria-hidden />
            <p className="mt-2 font-display text-3xl font-bold">{s.value}</p>
            <p className="text-xs text-muted-foreground sm:text-sm">{s.label}</p>
          </div>
        ))}
      </div>
      <div className="card-surface p-5">
        <div className="mb-2 flex items-center gap-2"><CalendarDays size={18} aria-hidden /><h3 className="font-bold">Planning de la semaine</h3></div>
        {weekly?.weeklyPlan ? (
          <pre className="whitespace-pre-wrap font-sans text-sm text-muted-foreground">{weekly.weeklyPlan}</pre>
        ) : (
          <p className="text-sm text-muted-foreground">
            Aucun kit de la semaine sauvegardé. <Link to="/generateur" className="font-bold text-foreground underline">Générer un kit</Link>
          </p>
        )}
      </div>
    </div>
  );
}
