# Palette Manager Frontend

This is the web app where people browse the color catalog, build a palette by picking and
arranging colors, and save it so they can come back to it later. It talks to the Palette
Manager backend for both the catalog and the saved palettes.

It is a React app built with Vite, using TanStack Router for pages and TanStack Query for
talking to the API.

## Tech stack

- React 19 with TypeScript
- Vite for the dev server and build
- TanStack Router for routing, with file based routes
- TanStack Query for fetching, caching, and keeping server data in sync
- Tailwind CSS v4 for styling, with Radix UI primitives for the accessible components
- dnd kit for the drag and drop ordering of colors
- Zod for validating what comes back from the API
- next themes for the dark mode toggle and sonner for toasts

## Requirements

- Node 20 or newer
- pnpm
- The Palette Manager backend running somewhere you can reach

## Installation

From the frontend folder, install the dependencies.

```bash
cd frontend
pnpm install
```

## Environment variables

Copy the example file and adjust it if your backend lives somewhere other than the default.

```bash
cp .env.example .env
```

There is only one variable:

- `VITE_API_URL` is the base origin of the backend, for example `http://localhost:8080`.
  The app adds the `/api` part itself, so you only give it the origin, not the full API
  path. If you leave it out the app falls back to `http://localhost:8080`.

## Running the frontend

Start the dev server.

```bash
pnpm dev
```

Vite show `http://localhost:5173`. Open that in your browser.

Make sure the backend is up first, since the app reads the catalog and palettes from it on load.

## Building for production

Build the static site, then preview the built output locally if you want to check it.

```bash
pnpm build
pnpm preview
```

The build runs the TypeScript compiler first and then Vite, so a type error will stop the build rather than slip through.

## Running the backend

The backend lives in the sibling `backend` folder and has its own README with full setup
steps, including the database. The short version is:

```bash
cd ../backend
pnpm install
cp .env.example .env   # then fill in DATABASE_URL and PROLOOK_COLORS_URL
pnpm prisma:generate
pnpm prisma:migrate
pnpm dev
```

That brings the API up on `http://localhost:8080`, which is what `VITE_API_URL` points at by
default.

## How it is put together

The source is grouped so that related things sit together.

- `src/routes` holds the pages. The root layout, the catalog and composer on the index
  route, and the saved palettes view.
- `src/components` is split by feature, catalog, composer, library, color, plus a `ui`
  folder of the shared Radix based building blocks.
- `src/api` is the data access layer. A small typed `request` helper, the colors and
  palettes calls, and the query and mutation definitions.
- `src/hooks` holds the reusable logic, like the composer state and the clipboard and media
  query helpers.
- `src/lib` has the smaller utilities, the env parsing, color helpers, the export logic, and
  the query client setup.

A few choices worth calling out. The API responses are validated with Zod before the app
trusts them, so a surprise from the backend turns into a clear error instead of a confusing
crash deeper in the UI. State that belongs in the URL stays in the URL, so links and the
back button behave the way you expect. And the routes stay thin by pushing the real work
into hooks.

## Extra features

- Drag and drop ordering of the colors in a palette, so the order is yours to choose
- A dark mode toggle that remembers your choice
- Exporting a palette as JSON
- Click to copy a color value, with a toast to confirm it

## Assumptions and trade offs

- The backend stays the single source of truth, but TanStack Query caches responses in memory
  and persists the colors catalog to localStorage, so a reload or a brief outage still shows
  the last known catalog instead of an error. Only the catalog is persisted, since it is stable
  reference data, while palettes are shared and mutable and revalidation keeps them correct. The
  backend stays authoritative when up. This covers reads only, writes still need the backend.
- The split of work on the catalog is deliberate. The backend owns data validity, dropping
  inactive colors and sorting by Prolook's order, so there is one source of truth for what the
  catalog is.
