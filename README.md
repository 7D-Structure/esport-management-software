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

### Multi-organisations (multi-tenant)

Le site est **multi-locataire** : chaque organisation (association/club) a son espace
d'administration **isolé** (ses joueurs, staff, équipes, agenda, coûts, serveurs, documents ne
sont visibles que dans son organisation).

- **Création en libre-service** : tout utilisateur connecté peut créer son organisation
  (`/onboarding/organization`) et en devient le propriétaire (`OWNER`).
- **Rôles d'organisation** (`OrgRole`) : `OWNER` > `ADMIN` > `MANAGER` > `COACH` > `STAFF`.
  Le propriétaire/admin gère les membres de l'org (`/admin/members`).
- **Organisation active** : un utilisateur peut appartenir à plusieurs organisations et bascule
  entre elles via le sélecteur dans l'en-tête de l'admin.
- **Super-admin du site** (`/site`, `isSiteAdmin`) : vue et gestion de **toutes** les
  organisations (création avec propriétaire, suppression) et de **tous** les comptes du site
  (dont l'octroi/retrait du statut super-admin).
- **Intégrations par organisation** (`/admin/integrations`, propriétaire/admin) : chaque
  organisation renseigne ses propres identifiants FaceIT / HelloAsso (stockés en base), qui
  priment sur les variables d'environnement globales.
- Le **marché du recrutement** (LFT / Player & Team Finder) reste **global** (inter-organisations).

- **Espace Administration d'une organisation** (`/admin`, réservé aux membres de l'organisation active) :
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
  - Gestion des membres de l'organisation (`/admin/members`, propriétaire/admin) : ajout d'un
    compte existant par email avec un rôle d'organisation, changement de rôle, retrait

La gestion **globale** des comptes du site (création/édition/suppression) est dans l'espace
super-admin `/site/users`, avec garde-fous (email unique, pas d'auto-suppression ni de
changement de son propre rôle).
  - Stats CS2 (FaceIT) : sur la fiche d'un joueur CS2, affichage des statistiques FaceIT à
    partir de son pseudo (niveau, elo, matchs, winrate, K/D, HS%)
  - Synchronisation HelloAsso : import des adhésions HelloAsso comme joueurs (licences)

- **Inscription publique** (`/register`) : n'importe qui crée un compte joueur en libre-service,
  est connecté automatiquement et arrive sur son profil LFT (recherche d'équipe).

- **Espace Joueur/Coach** (`/space`, auth required — any authenticated user):
  - Mes configs : stockage de fichiers `.cfg` par jeu, avec téléchargement
  - Mes objectifs : objectifs personnels avec statut (à faire / en cours / atteint) et échéance
  - Mon notebook : notes personnelles
  - Documents : consultation (lecture seule) des documents associatifs partagés par l'admin
  - Recrutement CS2 (self-service) : profil « en recherche d'équipe », **Player Finder** et
    **Team Finder**, création d'équipes (rosters), invitations de joueurs (envoi /
    acceptation / refus) et gestion des membres
  - Mon compte (RGPD) : **export** de toutes ses données au format JSON et **suppression**
    de son compte et de ses données personnelles

  Chaque ressource personnelle appartient à l'utilisateur connecté et n'est visible que par
  lui. Après connexion, `/enter` redirige les rôles `ADMIN`/`STAFF`/`MANAGER` vers l'espace
  admin et les autres (`COACH`, `PLAYER`) vers `/space`.

Rôles de compte (hiérarchie) : `ADMIN` > `STAFF` > `MANAGER` > `COACH` > `PLAYER`. Le `MANAGER`
est un rôle de gestion (accès admin) ; le responsable d'une équipe est le membre du staff dont
le rôle est `MANAGER`.

## Optional integrations

Both integrations are optional. Credentials are resolved **per organization** first (set in
`/admin/integrations`), falling back to the global environment variables below. When neither is
present the corresponding UI degrades gracefully (a "not configured" notice) and no external
call is made.

- **FaceIT** (CS2 stats): org `faceitApiKey` or global `FACEIT_API_KEY`. Stats appear on a CS2
  player's detail page once the player has a FaceIT nickname.
- **HelloAsso** (membership sync): org `helloAssoClientId` / `helloAssoClientSecret` /
  `helloAssoOrgSlug`, or the global `HELLOASSO_CLIENT_ID`, `HELLOASSO_CLIENT_SECRET` and
  `HELLOASSO_ORGANIZATION_SLUG` (and optionally `HELLOASSO_API_BASE` for the sandbox). The sync
  runs from `/admin/helloasso`.

See `.env.example` for the global fallback variables.

## Data storage & GDPR

- **Storage**: a PostgreSQL database accessed through the Prisma ORM. The schema lives in
  `prisma/schema.prisma` and versioned SQL migrations in `prisma/migrations/`. The connection is
  configured via `DATABASE_URL` (e.g. Vercel Postgres / Neon in production). Account passwords are
  **bcrypt-hashed**; they are never stored in clear text.
- **Right to data portability**: from `/space/account`, a user can download all data tied to
  their account as a JSON file (`/space/account/export`).
- **Right to erasure**: from `/space/account`, a user can delete their account after typing a
  confirmation. Deletion cascades their personal data (LFT profile, configs, goals, notes,
  rosters they own, memberships, invitations) and removes the link from any organization-owned
  Player/Staff record. If the user solely owns organizations, those organizations are deleted
  too; if an owned organization is shared with other members, deletion is blocked so other
  people's data is not erased.
