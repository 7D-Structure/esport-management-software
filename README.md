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

   By default the seed creates an admin (`admin@example.com`) and a player
   (`joueur@example.com`), both with password `changeme123`. Override with the
   `SEED_ADMIN_EMAIL` / `SEED_ADMIN_PASSWORD` / `SEED_PLAYER_EMAIL` /
   `SEED_PLAYER_PASSWORD` env vars before seeding.

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

- **Espace Administration** (`/admin`, auth required — roles `ADMIN`, `STAFF`, `MANAGER`, `COACH`):
  - Gestion des équipes (par jeu : CS2, Rainbow Six Siege, Overwatch 2, Valorant, ...), avec le
    responsable de chaque équipe (le membre du staff ayant le rôle `MANAGER`)
  - Gestion des joueurs : licences, rôle en jeu, contacts, disponibilités
  - Gestion du staff : rôle, contacts, disponibilités
  - Agenda & scrims : calendrier mensuel et liste des événements à venir (scrims,
    entraînements, matchs, réunions) rattachés à une équipe, avec adversaire, lieu/serveur,
    statut et notes
  - Gestion des coûts : dépenses et recettes catégorisées, rattachées à une équipe ou à
    l'association, avec récapitulatif recettes/dépenses/solde (montants stockés en centimes)
  - Gestion des serveurs : inventaire des serveurs de jeu (hôte/port, statut, mots de passe
    serveur/RCON, hébergeur, localisation), avec commande de connexion console pour les jeux
    Source (CS2)
  - Documents associatifs : catalogue de documents (statuts, PV, règlement, licences...)
    référencés par lien externe (Drive, Nextcloud, PDF public), gérés par l'admin
  - Stats CS2 (FaceIT) : sur la fiche d'un joueur CS2, affichage des statistiques FaceIT à
    partir de son pseudo (niveau, elo, matchs, winrate, K/D, HS%)
  - Synchronisation HelloAsso : import des adhésions HelloAsso comme joueurs (licences)

- **Espace Joueur/Coach** (`/space`, auth required — any authenticated user):
  - Mes configs : stockage de fichiers `.cfg` par jeu, avec téléchargement
  - Mes objectifs : objectifs personnels avec statut (à faire / en cours / atteint) et échéance
  - Mon notebook : notes personnelles
  - Documents : consultation (lecture seule) des documents associatifs partagés par l'admin
  - Recrutement CS2 (self-service) : profil « en recherche d'équipe », **Player Finder** et
    **Team Finder**, création d'équipes (rosters), invitations de joueurs (envoi /
    acceptation / refus) et gestion des membres

  Chaque ressource personnelle appartient à l'utilisateur connecté et n'est visible que par
  lui. Après connexion, `/enter` redirige les rôles `ADMIN`/`STAFF`/`MANAGER` vers l'espace
  admin et les autres (`COACH`, `PLAYER`) vers `/space`.

Rôles de compte (hiérarchie) : `ADMIN` > `STAFF` > `MANAGER` > `COACH` > `PLAYER`. Le `MANAGER`
est un rôle de gestion (accès admin) ; le responsable d'une équipe est le membre du staff dont
le rôle est `MANAGER`.

## Optional integrations

Both integrations are optional and read their credentials from environment variables. When the
credentials are absent, the corresponding UI degrades gracefully (a "not configured" notice)
and no external call is made.

- **FaceIT** (CS2 stats): set `FACEIT_API_KEY`. Stats appear on a CS2 player's detail page
  once the player has a FaceIT nickname.
- **HelloAsso** (membership sync): set `HELLOASSO_CLIENT_ID`, `HELLOASSO_CLIENT_SECRET` and
  `HELLOASSO_ORGANIZATION_SLUG` (and optionally `HELLOASSO_API_BASE` for the sandbox). The sync
  runs from `/admin/helloasso`.

See `.env.example` for all variables.
