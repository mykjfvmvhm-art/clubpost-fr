<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

- ClubPost data lives only in browser localStorage via src/lib/storage.ts (no backend); keeps the MVP free and privacy-friendly.
- Content generation is rule/template-based in src/lib/generator.ts and must never invent prices, schedules, results or testimonials (use "[à compléter]"); covered by src/lib/generator.test.ts.
