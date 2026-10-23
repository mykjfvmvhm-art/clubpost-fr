/**
 * Générateur de démonstration À BASE DE MODÈLES (règles + gabarits).
 * Ce n'est PAS de l'IA générative. Aucun prix, horaire, résultat ou témoignage
 * n'est inventé : les infos manquantes sont signalées par [à compléter].
 */
import type { ClubProfile, GenerateInput, GoalId, Piece, Tone } from "./types";

export const TODO = "[à compléter]";

function rng(seed: number) {
  let s = seed >>> 0 || 1;
  return () => {
    s = (s * 1664525 + 1013904223) >>> 0;
    return s / 4294967296;
  };
}
const pick = <T,>(r: () => number, arr: readonly T[]) => arr[Math.floor(r() * arr.length)] as T;

const slug = (s: string) =>
  s.normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-zA-Z0-9]/g, "").toLowerCase();

const SPORT_TAGS: Record<string, string[]> = {
  CrossFit: ["#crossfit", "#wod", "#crossfitbox", "#functionaltraining"],
  Fitness: ["#fitness", "#sportensalle", "#remiseenforme", "#training"],
  Musculation: ["#musculation", "#force", "#salledesport", "#strength"],
  Coaching: ["#coachsportif", "#coaching", "#coachingperso", "#sport"],
  Yoga: ["#yoga", "#yogafrance", "#respiration", "#mobilite"],
  Autre: ["#sport", "#clubdesport", "#bougersacorps", "#entrainement"],
};
const GOAL_TAGS: Record<GoalId, string[]> = {
  essai: ["#seancedessai", "#debutant", "#reprisedusport"],
  evenement: ["#evenementsportif", "#challenge", "#communautesport"],
  cours: ["#cours", "#planning", "#entrainementcollectif"],
  communaute: ["#communaute", "#teamspirit", "#ensemble"],
  conseils: ["#conseilsport", "#astuce", "#santé"],
  promo: ["#offre", "#rentree", "#motivation"],
};

const TONE_END: Record<Tone, string[]> = {
  Motivant: ["On y va ? 💪", "Pas d'excuse, juste un premier pas.", "Ta meilleure version commence ici. 🔥"],
  Bienveillant: ["À ton rythme, toujours.", "Ici, chacun avance à sa façon. 🤍", "On t'accueille comme tu es."],
  Expert: ["La progression, c'est de la méthode.", "Technique d'abord, intensité ensuite.", "Chaque séance a un objectif."],
  Fun: ["Viens transpirer avec nous 😄", "Ambiance garantie, courbatures offertes 😅", "Bonne humeur obligatoire 🎉"],
};

type Ctx = { club: string; sport: string; town: string; audience: string; topic: string; classInfo: string; event: string };

const HOOKS: Record<GoalId, ((c: Ctx) => string)[]> = {
  essai: [
    (c) => `Tu hésites à te lancer en ${c.sport.toLowerCase()} ? Lis ça.`,
    (c) => `Ta première séance chez ${c.club}, ça se passe comment ?`,
    (c) => `« Je ne suis pas assez en forme pour commencer. » On en parle ?`,
    (c) => `${c.town} : et si cette semaine, c'était la bonne ?`,
  ],
  evenement: [
    (c) => `📣 Ça se prépare chez ${c.club}…`,
    (c) => `Note la date : ${c.event || TODO}`,
    (c) => `Un moment à vivre ensemble à ${c.town}.`,
  ],
  cours: [
    (c) => `Zoom sur un cours que vous adorez : ${c.topic || c.classInfo || TODO}`,
    (c) => `Tu connais ce créneau chez ${c.club} ?`,
    (c) => `Ce qui se passe vraiment pendant ce cours 👇`,
  ],
  communaute: [
    (c) => `Ce qu'on préfère chez ${c.club} ? Vous.`,
    (c) => `Une salle, c'est des murs. Une communauté, c'est autre chose.`,
    (c) => `Merci à celles et ceux qui font vivre le club cette semaine.`,
  ],
  conseils: [
    (c) => `3 réflexes simples pour ${c.topic || "mieux t'entraîner"}`,
    (c) => `L'erreur qu'on voit souvent en ${c.sport.toLowerCase()} (et comment l'éviter)`,
    (c) => `Conseil du coach : ${c.topic || "progresser sans se blesser"}`,
  ],
  promo: [
    (c) => `Une offre à saisir chez ${c.club} 👀`,
    (c) => `Moment idéal pour nous rejoindre à ${c.town}.`,
    (c) => `On a pensé à toi qui voulais t'y mettre.`,
  ],
};

const BODIES: Record<GoalId, ((c: Ctx) => string)[]> = {
  essai: [
    (c) => `Chez ${c.club}, ta première séance est pensée pour ${c.audience || "les débutants comme les confirmés"}. Accueil, échauffement guidé, mouvements adaptés à ton niveau : tu n'as rien à prouver, juste à venir.${c.topic ? `\n\nThème du moment : ${c.topic}.` : ""}`,
    (c) => `Pas besoin d'être déjà sportif·ve pour commencer. Nos coachs adaptent chaque exercice. Tu repars avec une idée claire de ce qui t'attend et de comment progresser.${c.classInfo ? `\n\nAu programme du club : ${c.classInfo}.` : ""}`,
  ],
  evenement: [
    (c) => `${c.club} organise un moment spécial${c.topic ? ` : ${c.topic}` : ""}.\n\n📅 Infos pratiques : ${c.event || TODO}\n\nMembres, ami·es, curieux·ses : vous êtes les bienvenu·es.`,
    (c) => `On prépare quelque chose pour la communauté${c.topic ? ` autour de « ${c.topic} »` : ""}.\n\nDétails : ${c.event || TODO}\n\nPartage ce post avec la personne que tu veux embarquer.`,
  ],
  cours: [
    (c) => `Ce cours, c'est ${c.topic || TODO}. Idéal pour ${c.audience || "tous les niveaux"}. Encadrement par un coach, progression semaine après semaine.\n\nHoraires : ${TODO}`,
    (c) => `Pourquoi nos membres reviennent sur ce créneau ? L'énergie du groupe, un coach attentif et un format qui va droit au but.${c.classInfo ? `\n\nInfos : ${c.classInfo}.` : ""}`,
  ],
  communaute: [
    (c) => `Chaque semaine, des membres se dépassent, s'encouragent et se retrouvent. C'est ça, l'esprit ${c.club}.${c.topic ? `\n\nCette semaine : ${c.topic}.` : ""}\n\nDis-nous en commentaire ce que tu préfères au club 👇`,
    (c) => `Derrière chaque séance, il y a des visages, des progrès et des fous rires. Merci de faire de ${c.club} un lieu où l'on a envie de revenir.`,
  ],
  conseils: [
    (c) => `1. Échauffe-toi vraiment (5 à 10 min).\n2. Priorise la technique avant la charge.\n3. Hydrate-toi et récupère.\n\n${c.topic ? `Spécial « ${c.topic} » : ` : ""}en cas de doute, demande à ton coach — c'est son rôle.`,
    (c) => `Progresser, ce n'est pas tout donner à chaque séance. C'est être régulier·ère, écouter son corps et suivre un plan.${c.topic ? `\n\nAujourd'hui on parle de : ${c.topic}.` : ""}`,
  ],
  promo: [
    (c) => `${c.club} propose une offre${c.topic ? ` : ${c.topic}` : ""}.\n\nConditions et tarif : ${TODO}\nValable jusqu'au : ${TODO}`,
    (c) => `Envie de commencer ? C'est le bon moment.\n\nDétails de l'offre : ${c.event || TODO}\n\nPlaces et conditions à confirmer auprès du club.`,
  ],
};

const VISUALS: Record<GoalId, string[]> = {
  essai: ["Photo d'un coach qui accueille un·e nouveau·elle membre à l'entrée", "Vidéo courte : échauffement de groupe filmé de dos, lumière naturelle", "Plan large de la salle vide avant le cours, texte « Ta place t'attend »"],
  evenement: ["Visuel affiche aux couleurs du club, date en grand", "Montage photos de l'édition précédente (si existante, sinon photos de groupe)", "Reel teaser : 3 plans rapides du matériel préparé"],
  cours: ["Reel 15 s : moments forts du cours en accéléré", "Photo du coach en démonstration d'un mouvement", "Carrousel : 1 photo par étape du cours"],
  communaute: ["Photo de groupe après la séance (avec accord des membres)", "Mur de high-fives en vidéo", "Portrait d'un membre volontaire avec son accord"],
  conseils: ["Coach face caméra, texte incrusté avec les 3 points", "Avant/après technique (bonne vs mauvaise posture)", "Infographie simple fond clair, chiffres en lime"],
  promo: ["Visuel épuré : nom de l'offre en gros, fond de la couleur du club", "Photo dynamique en séance + bandeau « Offre »", "Story compte à rebours"],
};

const DEFAULT_CTA: Record<GoalId, string> = {
  essai: "Réserve ta séance d'essai",
  evenement: "Inscris-toi / réponds en message",
  cours: "Viens tester ce cours",
  communaute: "Partage ton moment préféré en commentaire",
  conseils: "Enregistre ce post pour ta prochaine séance",
  promo: "Écris-nous pour en profiter",
};

export function buildContext(profile: ClubProfile | null, input: GenerateInput): Ctx {
  return {
    club: profile?.name?.trim() || "ton club",
    sport: profile?.sport && profile.sport !== "Autre" ? profile.sport : "sport",
    town: profile?.town?.trim() || "ta ville",
    audience: profile?.audience?.trim() || "",
    topic: input.topic.trim(),
    classInfo: profile?.classInfo?.trim() || "",
    event: input.eventDetails.trim(),
  };
}

function hashtags(profile: ClubProfile | null, goal: GoalId, r: () => number) {
  const tags = [...(SPORT_TAGS[profile?.sport ?? "Autre"] ?? []), ...GOAL_TAGS[goal]];
  const town = profile?.town ? slug(profile.town) : "";
  if (town) tags.push(`#${town}`, `#sport${town}`);
  if (profile?.name) tags.push(`#${slug(profile.name)}`);
  return tags.sort(() => r() - 0.5).slice(0, 8).join(" ");
}

function makeCta(profile: ClubProfile | null, input: GenerateInput) {
  const base = input.cta.trim() || DEFAULT_CTA[input.goal];
  const contact = profile?.contact?.trim();
  return contact ? `${base} — ${contact}` : base;
}

function makePiece(kind: Piece["kind"], label: string, profile: ClubProfile | null, input: GenerateInput, r: () => number, goal: GoalId = input.goal): Piece {
  const ctx = buildContext(profile, input);
  const tone = input.tone;
  const hook = pick(r, HOOKS[goal])(ctx);
  const body = pick(r, BODIES[goal])(ctx);
  const end = pick(r, TONE_END[tone]);
  const cta = makeCta(profile, { ...input, goal });
  let caption = `${hook}\n\n${body}\n\n${end}\n\n👉 ${cta}`;
  let visual = pick(r, VISUALS[goal]);
  if (kind === "carousel") {
    caption = [
      `Slide 1 — Accroche : ${hook}`,
      `Slide 2 — Le constat : ${pick(r, ["ce que vivent beaucoup de débutants", "pourquoi on repousse souvent", "ce qu'on entend souvent au club"])}`,
      `Slide 3 — Notre approche chez ${ctx.club}`,
      `Slide 4 — Concrètement : ${ctx.topic || ctx.classInfo || TODO}`,
      `Slide 5 — ${end}`,
      `Slide 6 — Appel à l'action : ${cta}`,
      ``,
      `Légende courte : ${(body.split("\n")[0] ?? "")}`,
    ].join("\n");
    visual = `Carrousel 6 slides, fond clair, titres gras${profile?.colors ? `, couleurs : ${profile.colors}` : ""}. ${visual}`;
  }
  if (kind === "story") {
    caption = [
      `Écran 1 : ${hook}`,
      `Écran 2 : ${(body.split("\n")[0] ?? "")}`,
      `Écran 3 : sticker sondage « ${pick(r, ["Tu viens cette semaine ?", "Tu as déjà testé ?", "On se voit au club ?"])} » Oui / Bientôt`,
      `Écran 4 : sticker lien ou « Écris-nous » → ${cta}`,
    ].join("\n");
    visual = `Format vertical 9:16. ${visual}`;
  }
  return {
    id: `${kind}-${Math.floor(r() * 1e9).toString(36)}`,
    kind,
    label,
    hook,
    caption,
    cta,
    hashtags: hashtags(profile, goal, r),
    visual,
  };
}

export interface GenerateResult {
  title: string;
  pieces: Piece[];
  weeklyPlan?: string;
}

export function generate(profile: ClubProfile | null, input: GenerateInput, seed = 1): GenerateResult {
  const r = rng(seed * 7919 + input.topic.length * 31 + input.variants);
  const club = profile?.name?.trim() || "Mon club";
  const n = Math.min(Math.max(input.variants, 1), 5);
  if (input.format === "weekly") {
    const goals: GoalId[] = [input.goal, input.goal === "conseils" ? "communaute" : "conseils", input.goal === "communaute" ? "essai" : "communaute"];
    const posts: Piece[] = goals.map((g, i) => makePiece(i === 1 ? "carousel" : "post", `Post ${i + 1}`, profile, input, r, g));
    const stories: Piece[] = goals.map((g, i) => makePiece("story", `Story ${i + 1}`, profile, input, r, g));
    const weeklyPlan = [
      `Lundi — ${posts[0]!.label} : ${posts[0]!.hook}`,
      `Mardi — ${stories[0]!.label} (coulisses / sondage)`,
      `Mercredi — ${posts[1]!.label} (carrousel) : ${posts[1]!.hook}`,
      `Jeudi — ${stories[1]!.label} (rappel du cours / question)`,
      `Vendredi — ${posts[2]!.label} : ${posts[2]!.hook}`,
      `Samedi — ${stories[2]!.label} (ambiance du week-end)`,
      `Dimanche — Repos, réponds aux messages et commentaires`,
      ``,
      `Horaires de publication conseillés : ${TODO} (à adapter à ton audience)`,
    ].join("\n");
    return { title: `Kit semaine — ${club}${input.topic ? ` · ${input.topic}` : ""}`, pieces: [...posts, ...stories], weeklyPlan };
  }
  const kind = input.format === "carousel" ? "carousel" : input.format === "story" ? "story" : "post";
  const name = kind === "carousel" ? "Carrousel" : kind === "story" ? "Story" : "Légende";
  const pieces = Array.from({ length: n }, (_, i) => makePiece(kind, `${name} — variante ${i + 1}`, profile, input, r));
  return { title: `${name} — ${club}${input.topic ? ` · ${input.topic}` : ""}`, pieces };
}
