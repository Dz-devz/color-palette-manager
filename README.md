# Palette Manager

Palette Manager is a small full stack app for working with colors. People browse the Prolook
color catalog, build a palette by picking and arranging colors, and save it so they can come
back to it later.

The repo is split into two parts that run side by side:

- `frontend` is the React web app where all of that browsing, building, and saving happens.
- `backend` is the Express API that serves the catalog and stores the saved palettes.

Each folder has its own README with the full details. This one is just the map.

## How the two fit together

The backend does two jobs. It pulls the Prolook color catalog from their public endpoint and
hands it to the frontend, and it stores the palettes people build in a PostgreSQL database so
they survive a refresh. The frontend reads the catalog and the saved palettes from the backend
and never talks to Prolook directly.

A palette is just a name plus an ordered array of color values, so the order someone chooses in
the UI is the order that comes back from the API.

## Tech stack

- Frontend: React 19 and TypeScript, Vite, TanStack Router and Query, Tailwind CSS v4 with
  Shadcn (Radix) UI, dnd kit for drag and drop, Zod for validating API responses
- Backend: Express 5 and TypeScript, Prisma 7 over PostgreSQL, Zod for input validation, Helmet
  and CORS for baseline protection

## Requirements

- Node 20 or newer
- pnpm
- A running PostgreSQL instance you can connect to

## Getting started

Bring the backend up first, since the frontend reads the catalog and palettes from it on load.

```bash
# 1. Backend
cd backend
pnpm install
cp .env.example .env   # then fill in DATABASE_URL and PROLOOK_COLORS_URL
pnpm prisma:generate
pnpm prisma:migrate
pnpm dev               # serves http://localhost:8080
```

```bash
# 2. Frontend, in a second terminal
cd frontend
pnpm install
cp .env.example .env   # VITE_API_URL defaults to http://localhost:8080
pnpm dev               # serves http://localhost:5173
```

Open `http://localhost:5173` in your browser. The frontend's `VITE_API_URL` already points at
the backend's default address, so the two line up without extra config.

For anything beyond this, the per folder READMEs cover environment variables, the database
setup, the API shape, and the project layout in full:

- [Frontend README](frontend/README.md)
- [Backend README](backend/README.md)

## Deployment

The frontend is built as a static site, and the backend runs as a standard Node server against
a PostgreSQL database. The production setup uses a managed Postgres instance rather than a local
one. See the per folder READMEs for the build and start commands.
