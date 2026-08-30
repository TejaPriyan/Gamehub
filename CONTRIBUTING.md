# Contributing to Teja Priyan World

Thanks for wanting to contribute! Here's how to get set up and submit changes.

## Getting started

```bash
npm install
npm run dev        # start the dev server at http://localhost:4321
npm run test:run   # run the test suite
npm run check      # type-check
```

## Workflow

1. Fork the repository.
2. Create a feature branch: `git checkout -b feat/my-feature`.
3. Make your changes.
4. Verify: `npm run build` and `npm run test:run`.
5. Commit with a clear message and open a pull request.

## Conventions

- **Components** live under `src/components/` (page-level under `components/pages/`, reusable UI under `components/ui/`).
- **Data types** live in `src/entities/` and mirror the collections used by the app.
- **Fallback data** lives in `src/lib/seed-data.ts` — keep it in sync with the entities so the site works standalone.
- **Data access** goes through `BaseCrudService` (`integrations/cms/`), which transparently falls back to local data without a Wix runtime.

## Adding a mini-game

1. Add a `MiniGames` entry to `src/lib/seed-data.ts` with a unique `_id`, title, description, and a `genre` that maps to an engine in `src/components/games/GameCanvas.tsx`:
   - `arcade` → catch falling objects
   - `shooter` / `action` → space shooter
   - `racing` / `speed` → avoid obstacles
   - `puzzle` / `match` → match-3 grid
2. Drop cover art in `public/images/games/` (16:9 recommended).

## Code of conduct

Be kind and respectful. Keep PRs focused and small.
