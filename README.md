# esport-management-software

Manage your players, licenses (if association), training schedules, staff members, communications and more.

Espace Administration (joueurs, staff, licences, statistiques, coûts, serveurs, agenda, documents) et Espace
Joueur/Coach (configurations, objectifs, notebook, agenda) pour votre structure esport.

## Stack

- [Next.js](https://nextjs.org) (App Router) + React + TypeScript
- [Tailwind CSS](https://tailwindcss.com)
- [Prisma](https://www.prisma.io) + PostgreSQL
- [Auth.js / NextAuth](https://authjs.dev) (Credentials, JWT sessions)

## Getting started

1. Install dependencies:

   ```bash
   npm install
   ```

2. Copy the environment file and fill in your own values:

   ```bash
   cp .env.example .env
   ```

   - `DATABASE_URL`: connection string to a PostgreSQL database.
   - `AUTH_SECRET`: generate one with `npx auth secret`.

3. Apply the database schema and seed an initial admin user:

   ```bash
   npm run db:migrate
   npm run db:seed
   ```

   By default the seed creates `admin@example.com` / `changeme123`. Override with
   `SEED_ADMIN_EMAIL` / `SEED_ADMIN_PASSWORD` env vars before seeding.

4. Start the dev server:

   ```bash
   npm run dev
   ```

   Visit [http://localhost:3000](http://localhost:3000), then sign in at `/login` to access `/admin`.

## Scripts

| Script             | Description                              |
| ------------------ | ----------------------------------------- |
| `npm run dev`       | Start the Next.js dev server             |
| `npm run build`     | Production build                         |
| `npm run start`     | Run the production build                 |
| `npm run lint`      | Run ESLint                               |
| `npm run db:migrate`| Apply Prisma migrations (dev)            |
| `npm run db:seed`   | Seed an initial admin user                |
| `npm run db:studio` | Open Prisma Studio                       |

## Current features

- **Espace Administration** (`/admin`, auth required — roles `ADMIN`, `STAFF`, `COACH`):
  - Gestion des équipes (par jeu : CS2, Rainbow Six Siege, Overwatch 2, Valorant, ...)
  - Gestion des joueurs : licences, rôle en jeu, contacts, disponibilités
  - Gestion du staff : rôle, contacts, disponibilités

Other modules described in the product roadmap (stats CS2 via Leetify/FaceIT, sync HelloAsso, gestion des
coûts, gestion des serveurs, agenda/scrims, documents associatifs, espace joueur/coach) are not yet
implemented.
