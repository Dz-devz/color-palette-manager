# Palette Manager Backend

This is the API that powers the Palette Manager app. It does two jobs. It pulls the
Prolook color catalog from their public endpoint and hands it to the frontend, and it
stores the palettes that people build so they survive a page refresh.

It is a small Express server written in TypeScript, with Prisma talking to a PostgreSQL
database.

## Tech stack

- Express 5 for the HTTP server
- Prisma 7 for the database layer, using the native pg adapter
- PostgreSQL for storage
- Zod for validating request bodies and the shape of the Prolook response
- Helmet and CORS for the usual baseline protection
- tsx to run the TypeScript directly in development

## What the API looks like

Everything lives under the `/api` prefix, except the health check.

- `GET /health` returns server status and uptime
- `GET /api/colors` returns the live Prolook color catalog
- `GET /api/palettes` lists saved palettes, newest first
- `GET /api/palettes/:id` returns a single palette
- `POST /api/palettes` creates a palette from a name and a list of colors
- `PUT /api/palettes/:id` updates the name and colors of a palette
- `DELETE /api/palettes/:id` removes a palette

A palette is just a name plus an ordered array of color values, so the order people
choose in the UI is the order that comes back.

## Requirements

- Node 20 or newer
- pnpm (the repo is set up with pnpm, see the packageManager field in package.json)
- A running PostgreSQL instance you can connect to

## Installation

From the backend folder, install the dependencies.

```bash
cd backend
pnpm install
```

## Environment variables

Copy the example file and fill in your own values.

```bash
cp .env.example .env
```

The variables are:

- `DATABASE_URL` is the PostgreSQL connection string Prisma uses. The example points at a
  local database called `palette_manager`. Change the user, password, host, and database
  name to match your own setup.
- `PORT` is the port the server listens on. It defaults to 8080 if you leave it out.
- `NODE_ENV` is just the usual environment label, development or production.
- `PROLOOK_COLORS_URL` is the endpoint the server fetches the color catalog from. The real
  Prolook colors URL is `https://api.prolook.com/api/colors/prolook`.

Both `DATABASE_URL` and `PROLOOK_COLORS_URL` are required. The server refuses to start
without them, on purpose, so you find out early rather than at the first request.

## Database setup

First make sure PostgreSQL is running and that the database in your `DATABASE_URL` exists.
If it does not exist yet, create it.

Deployed the postgreSQL in neondb for production and in development we just use the local postgreSQL.

```bash
createdb palette_manager
```

Then generate the Prisma client and apply the migrations. The migration creates the single
Palette table the app needs.

```bash
pnpm prisma generate
pnpm prisma migrate
```

If you want to poke at the data by hand, Prisma Studio gives you a quick web view.

```bash
pnpm prisma studio
```

## Running the backend

For day to day work, run it in watch mode so it restarts when you change a file.

```bash
pnpm dev
```

To run it once without watching, for example on a server, use start.

```bash
pnpm start
```

Either way it will tell you the address it is listening on, which is
`http://localhost:8080` by default.

## How it is put together

The code is grouped by feature rather than by file type, so each thing the API does lives
next to its own pieces and it is inspired by a layered architecture approach.

- `src/index.ts` boots the HTTP server and handles graceful shutdown on Ctrl C
- `src/app.ts` wires up the Express middleware, the health check, and the routes
- `src/env.ts` reads and checks the environment variables in one place
- `src/controllers` holds the request handlers for colors and palettes, each with its own
  routes file
- `src/data` is the database layer, the only place that touches Prisma
- `src/schemas` holds the Zod schemas used to validate input
- `src/middlewares` has the not found handler and the central error handler
- `prisma/schema.prisma` is the database schema and `prisma/migrations` is its history

The controllers never talk to Prisma directly. They validate input with Zod, call into the
data layer, and let the error handler turn any thrown error into a clean JSON response.

## Assumptions and trade offs

- The color catalog is fetched live from Prolook on every `GET /api/colors` call. That keeps
  it always fresh and means there is nothing to seed, but it does depend on their endpoint
  being up. Adding a short cache would be the obvious next step if traffic grew.
- Colors that Prolook marks as inactive are filtered out, and the rest are sorted by the
  order field they give us. So the catalog the frontend sees is a clean, ordered subset, not
  the raw response.
