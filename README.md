# Teja Priyan World 🎮

A neon cyberpunk gaming arena built with **Astro**, **React**, **TypeScript** and **Tailwind CSS**. Forge your player identity, connect to the grid, and battle through a growing collection of browser mini-games.

> Electric purple · Neon cyan · Magenta · Hard light · Cinematic

---

## ✨ Features

- **Player Card Generator** — create a unique gamer identity (name, age, gender, gamer tag) rendered as an animated holographic card.
- **Mini-Games Arena** — a responsive grid of games, each with a full detail page and a playable `<canvas>` experience.
- **4 game engines** — Arcade (catch), Shooter, Racing, and Puzzle (match-3), all rendered on a shared canvas loop with score + high-score tracking.
- **Cyberpunk UI** — scanlines, glitch text, neon glows, parallax scroll, and Framer Motion animations.
- **Standalone by default** — runs with zero external services using local seed data.
- **Optional Wix integration** — when `WIX=1`, reads/writes the Wix Data CMS (`minigames`, `playercards` collections) and enables member auth.

---

## 🛠 Tech Stack

| Layer | Tech |
|---|---|
| Framework | Astro 5 (static by default) |
| Frontend | React 18 + TypeScript |
| Styling | Tailwind CSS 3 + Radix UI |
| Animation | Framer Motion |
| Routing | React Router (SPA) |
| State | Zustand |
| Data (optional) | Wix Data SDK |
| Tests | Vitest |

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ and npm.

### Install & run

```bash
npm install
npm run dev
```

Open http://localhost:4321 — the arena loads instantly with bundled seed games.

### Production build (static)

```bash
npm run build
npm run preview
```

The static site is emitted to `dist/` and can be hosted anywhere (Vercel, Netlify, Cloudflare Pages, GitHub Pages).

---

## 📁 Project Structure

```
src/
├── components/
│   ├── pages/            # HomePage, GameDetailPage
│   ├── games/            # GameCanvas (canvas game engines)
│   ├── ui/               # Radix UI + shared components
│   ├── Header.tsx        # Navigation
│   ├── Footer.tsx
│   └── Router.tsx        # React Router setup
├── lib/
│   ├── seed-data.ts      # Bundled fallback games/cards
│   └── utils.ts
├── entities/             # MiniGames / PlayerCards types
├── pages/[...slug].astro # SPA shell
└── styles/               # Global + font styles
integrations/
├── cms/                  # BaseCrudService (Wix Data with local fallback)
└── members/              # Member auth (optional)
public/
└── images/games/         # Game cover art
```

---

## ⚙️ Configuration

### Standalone (default)

No configuration needed. The data layer falls back to `src/lib/seed-data.ts` when the Wix SDK isn't present.

### Wix mode

The project was scaffolded from the Wix Astro template. To use the live CMS and member auth:

```bash
npm run env          # pull Wix environment variables (requires Wix CLI auth)
npm run dev:wix      # run with Wix runtime
npm run build:wix    # build for Cloudflare/Wix
```

Set `WIX=1` before the relevant command to enable the Wix integrations in `astro.config.mjs`.

### Base path

For sub-directory hosting (e.g. GitHub Pages project sites), set the base before building:

```bash
ASTRO_BASE=/Gamehub/ npm run build
```

---

## 🧪 Testing

```bash
npm run test:run
```

---

## 🚀 Deployment

The site builds to a fully static `dist/`. A GitHub Actions workflow (`.github/workflows/deploy.yml`) is included to deploy to **GitHub Pages** — enable Pages in the repo settings (Source: *GitHub Actions*) and push.

## 🤝 Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md).

## 📄 License

[MIT](LICENSE)

---

Built with ❤️ using Astro, React, and a whole lot of neon.
