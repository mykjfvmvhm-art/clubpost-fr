# Clubpost Fr

Build a polished, mobile-first French web application named ClubPost, for French independent fitness coaches, CrossFit boxes and small sports clubs. The owner is a beginner with €0 budget, so prioritize a working MVP that can be published on a free Lovable URL and tested immediately. Product must be honest about current capabilities: do NOT claim real AI integration, Instagram auto-publishing, user accounts, or paid subscriptions unless truly configured. Build a complete frontend and working prototype with clear upgrade paths.

DESIGN:
- Premium modern SaaS, French language throughout, clean off-white background, near-black text, vivid lime accent, tasteful rounded cards, strong typography, excellent mobile layout and accessibility. Not generic purple AI aesthetic.
- Brand ClubPost. Tagline: "Ton club. Ton contenu. Une semaine d'avance."
- Landing page with hero, CTA "Créer mon premier kit", how it works, features, sample outputs, simple pricing (€19/mois lancement; explicitly label "tarif de lancement envisagé — bêta, sans paiement intégré pour le moment"), FAQ, contact/feedback form.
- Add clear footer links/placeholders for legal notice, privacy policy, terms, contact; label legal placeholders as draft / must be completed before commercial launch.

WORKING MVP:
1. Navigation: Accueil, Générateur, Mes contenus, Mon club.
2. Club profile form: name, sport (CrossFit, fitness, musculation, coaching, yoga, autre), town, target audience, brand tone, brand colors, objective, CTA/contact details, class/event info. Persist in browser localStorage. Validate inputs.
3. Generator form: goal (new trial signups, announce event, highlight class, member community, tips/education, promotion), format (Instagram caption, carousel outline, story, weekly kit), topic, optional event details, tone, call-to-action, number of variants. Generate genuinely useful French content locally using well-designed template/rule-based logic (no API keys required), personalized from club profile. Clearly label this as a demo/template-based generator, not generative AI. Never invent prices, schedules, results or testimonials. Include editable output cards: hook, caption, CTA, hashtag suggestions, visual idea. For weekly kit, create a coherent set of 3 post ideas + 3 stories + weekly plan. Allow regenerate variation, copy each field, copy all, edit, save, delete, mark approved, download/export content as .txt or .md. Show helpful validation and empty states.
4. "Mes contenus" saved content library with search/filter/status and localStorage persistence; allow open/edit/delete/export.
5. Dashboard summary: number of saved contents, drafts, approved, this week's plan, onboarding prompt.
6. Demo mode banner: data currently saved only in this browser/device; clearing browser data can erase it. No cross-device sync yet.
7. CTA "Donner mon avis / demander un accès bêta" with working form validating email and message; in absence of backend, do not pretend to send it. Provide mailto fallback or clearly explain user can copy their request. Prefer a mailto link using a generic contact placeholder only if marked to configure; don't invent a real email.
8. Add a sample club profile and sample output option so user can experience app quickly without filling all fields.
9. Add pricing cards for beta: free demo (template generator), and future ClubPost Plus at €19/month (planned, no active checkout); button says "Rejoindre la bêta" and directs to feedback/contact flow, not fake checkout.
10. Add privacy-friendly functionality and safe React code. Keep all data in localStorage only. Do not collect or transmit personal data. No auth or database necessary for this MVP.
11. Add a simple accessible settings/reset demo data function with confirmation.
12. Build realistic sample copy in French for a fictional club "Studio Atlas" and clearly label it fictional.

TECHNICAL:
- Use React + TypeScript + Tailwind/shadcn available default stack.
- All visible buttons must work. No dead links or fake success notifications.
- Use browser localStorage with error handling; include download via Blob and copy-to-clipboard with fallback.
- Use Lucide icons, responsive layout, no external API required.
- SEO metadata title "ClubPost — Le contenu de ton club, prêt à publier" and a descriptive meta description.
- Do not add payment collection, Stripe, Instagram API, AI API, or external services without credentials. Keep this honest and usable at zero cost.
- Finish implementation, test/build if available, fix errors. Then summarize what works and what still needs configuring before commercial use.

This project was built with [Lovable](https://lovable.dev).

**Live app**: https://clubpost-fr.lovable.app

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/239bea26-a8d5-4c55-9bd5-8d844d9fd1b0).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
