# ImoPanorama

Plateforme immobilière à Madagascar : catalogue de biens (terrains, maisons, appartements, commercial), espace client (favoris, comparaison, demandes), back-office complet, et présentation du partenaire construction **BatiPanorama**.

---

## Stack technique

| Domaine | Technologie |
|---|---|
| Framework | Next.js 16 (App Router) + React 19 |
| Langage | TypeScript 5 |
| ORM | Prisma 7 |
| Base de données | PostgreSQL 16 (image `pgvector/pgvector:pg16`) avec extensions `vector`, `pg_trgm`, `unaccent`, `earthdistance` |
| Auth | better-auth 1.3 (email/password + OAuth Google) |
| UI | Tailwind CSS 4, Radix UI, shadcn (cf [components.json](components.json)), framer-motion, lucide-react, heroicons |
| Data fetching | TanStack Query v5 + TanStack Table |
| Cache | Redis 7 (via `ioredis`) |
| Recherche sémantique | pgvector + OpenAI `text-embedding-3-small` (1536 dim), avec fallback ILIKE Postgres |
| Cartographie | MapLibre GL + react-map-gl |
| Email | Nodemailer + Mailtrap (dev) |
| Stockage médias | BunnyCDN (storage + CDN pull zone) |
| API docs | swagger-jsdoc + swagger-ui-react (UI accessible sur `/admin/api-docs`) |
| Validation | Zod 4 |
| Tests | Vitest + Testing Library + happy-dom |
| Process prod | PM2 |
| Analytics | Umami (self-hosted), modèles `PageView`/`Event`/`AnalyticsSession` |
| Monitoring | Grafana + Loki + Promtail + Uptime Kuma |

---

## Architecture

Architecture feature-sliced. Les domaines métier sont indépendants et coexistent avec une couche d'infrastructure partagée.

```
app/                       # Routes Next.js (App Router)
  (admin)/                 # Back-office (CRUD propriétés, news, FAQ, users, partners, settings)
  (auth)/                  # Login / Register / Forgot password / Reset password
  (client)/                # Site public + espace client
  api/                     # Route handlers REST

features/                  # Domaines métier — chaque feature contient components/ hooks/ services/ server/ schemas/ types/
  analytics  auth  batipanorama  contacts  faqs
  favorites  news  properties  search  settings  upload  users

shared/                    # Code partagé entre features
  components/              # ui (shadcn) / sections / gallery / layout / loading / map
  hooks/  lib/  utils/  types/  theme/  providers/  services/  config/  data/

infrastructure/            # Adaptateurs vers les services externes
  auth/                    # Configuration better-auth + guards
  cache/                   # Wrapper Redis (cached, invalidateCache)
  database/                # Client Prisma
  email/                   # Templates et envoi via Nodemailer
  logger/                  # Logger structuré
  middleware/              # withErrorHandler, apiError, etc.
  search/                  # Recherche vectorielle (pgvector) + embeddings HF
  swagger/                 # Génération de la doc OpenAPI

prisma/                    # schema.prisma + migrations + seeders
__tests__/                 # unit + integration + fixtures
docker/                    # docker-compose.yml + configs des services (loki, grafana, promtail)
docs/                      # Documentation détaillée (voir section dédiée)
```

---

## Prérequis

- Node.js 20+
- Docker + Docker Compose
- Compte BunnyCDN (storage zone + pull zone) pour les uploads
- Clé API OpenAI pour la génération d'embeddings (recherche sémantique)
- Compte Mailtrap pour tester les emails en local

---

## Installation

```bash
git clone <repository-url>
cd Imo
npm install
```

### 1. Variables d'environnement

```bash
cp .env.exemple .env
```

Puis remplir `.env` selon les variables documentées plus bas.

### 2. Démarrer l'infrastructure Docker

```bash
npm run docker:up
```

Cela démarre Postgres (pgvector), Redis, Umami, Grafana, Loki, Promtail et Uptime Kuma. Voir [docker/docker-compose.yml](docker/docker-compose.yml) pour les ports exposés.

### 3. Initialiser la base de données

```bash
npm run prisma:generate
npm run db:migrate
npm run db:seed                 # seed minimal (users, FAQ, news, batipanorama)
npm run db:seed:properties      # propriétés de démo
npm run embeddings:backfill     # génère les embeddings pgvector pour les biens seedés
```

### 4. Lancer le serveur de dev

```bash
npm run dev
```

L'application écoute sur [http://localhost:3000](http://localhost:3000) (le `.env.exemple` configure better-auth sur 3001 — adapter selon le port utilisé).

---

## Variables d'environnement

| Variable | Requise | Description |
|---|---|---|
| `DATABASE_URL` | oui | Connexion Postgres. Avec Docker : `postgresql://postgres:root@localhost:5433/db_imo` |
| `BETTER_AUTH_SECRET` | oui | Secret de signature. Générer avec `openssl rand -base64 32` |
| `BETTER_AUTH_URL` | oui | URL publique de l'app (ex: `http://localhost:3000`) |
| `NEXT_PUBLIC_APP_URL` | oui | Même valeur que `BETTER_AUTH_URL`, exposée au client |
| `GOOGLE_CLIENT_ID` | non | OAuth Google (sinon login email/password uniquement) |
| `GOOGLE_CLIENT_SECRET` | non | OAuth Google |
| `REDIS_URL` | oui | `redis://localhost:6379` avec Docker |
| `MAILTRAP_HOST` / `MAILTRAP_PORT` / `MAILTRAP_USER` / `MAILTRAP_PASS` | dev | SMTP Mailtrap pour les emails transactionnels |
| `ADMIN_EMAIL` | oui | Destinataire des notifications admin (devis, contacts) |
| `BUNNYCDN_STORAGE_ZONE_NAME` | oui | Nom de la storage zone |
| `BUNNYCDN_API_KEY` | oui | Clé API Storage (serveur uniquement) |
| `BUNNYCDN_PULL_ZONE_URL` | oui | URL CDN (lecture serveur) |
| `NEXT_PUBLIC_BUNNYCDN_PULL_ZONE_URL` | oui | Même URL CDN exposée au client |
| `OPENAI_API_KEY` | oui | Clé OpenAI pour générer les embeddings de recherche sémantique |
| `LOG_LEVEL` | non | `debug` / `info` / `warn` / `error` |
| `NODE_ENV` | oui | `development` / `production` / `test` |

---

## Services Docker

Démarré via `npm run docker:up`. Ports exposés (tous bindés sur `127.0.0.1` sauf indication) :

| Service | Port host | Rôle |
|---|---|---|
| `postgres` | 5433 → 5432 | PostgreSQL + pgvector (recherche sémantique embarquée) |
| `redis` | 6379 | Cache, sessions, queues |
| `umami` | 3100 | Analytics web (alternative à GA) |
| `grafana` | 3200 | Dashboards monitoring |
| `loki` | 3101 | Agrégation de logs |
| `promtail` | — | Collecteur de logs → Loki |
| `uptime-kuma` | 3300 | Monitoring uptime |

Configuration : [docker/.env](docker/.env) (POSTGRES_USER, GRAFANA_PASSWORD, UMAMI_APP_SECRET, etc.).

---

## Commandes

```bash
# Développement
npm run dev                     # Next.js dev server
npm run build                   # Build production
npm start                       # Run production build

# Base de données
npm run prisma:generate         # Génère le client Prisma
npm run prisma:studio           # Ouvre Prisma Studio
npm run db:migrate              # Applique les migrations en dev
npm run db:migrate:create       # Crée une migration sans l'appliquer
npm run db:reset                # Reset complet (DANGER)
npm run db:seed                 # Seed base (users, FAQ, news, batipanorama)
npm run db:seed:properties      # Seed propriétés de démo
npm run db:reset:seed           # Reset + seed

# Recherche sémantique
npm run embeddings:backfill     # Embed les propriétés sans embedding (incrémental)
npm run embeddings:rebuild      # Force la régénération de tous les embeddings

# Tests
npm test                        # Vitest run
npm run test:ui                 # Interface Vitest UI
npm run test:watch              # Mode watch
npm run test:coverage           # Couverture de code

# Docker
npm run docker:up               # Démarre les services
npm run docker:down             # Arrête les services
npm run docker:logs             # Suit les logs
npm run docker:ps               # Liste les conteneurs
npm run docker:restart          # Redémarre

# Lint
npm run lint

# Production (PM2)
npm run prod:start              # Démarre via ecosystem.config.js
npm run prod:stop
npm run prod:logs
npm run deploy                  # build + pm2 restart
```

---

## Pages principales

### Site public

| URL | Description |
|---|---|
| `/` | Accueil |
| `/proprietes` | Catalogue avec filtres (type, transaction, ville, prix, surface, chambres, etc.) + grille/liste/carte |
| `/proprietes/[id]` | Fiche détaillée d'un bien |
| `/proprietes/comparer` | Comparaison de plusieurs biens |
| `/terrains-a-vendre`, `/maisons-a-vendre`, `/appartements-a-louer` | Landings SEO redirigeant vers `/proprietes?...` |
| `/batipanorama` | Présentation du partenaire construction |
| `/batipanorama/projets`, `/batipanorama/projet/[slug]` | Portfolio + fiches projet |
| `/batipanorama/contact` | Demande de devis construction |
| `/actualites`, `/actualites/[slug]` | Articles d'actualité et conseils SEO |
| `/faq` | Questions fréquentes |
| `/services`, `/guide-achat`, `/guide-location`, `/investir-a-madagascar`, `/temoignages` | Contenus éditoriaux |
| `/calculateur-budget`, `/estimation`, `/vendre` | Outils |
| `/contact` | Formulaire de contact général |
| `/cgu`, `/mentions-legales`, `/politique-confidentialite`, `/qui-sommes-nous` | Pages légales |

### Espace client (auth requise)

| URL | Description |
|---|---|
| `/profile` | Profil + changement de mot de passe |
| `/favoris` | Biens favoris |
| `/mes-demandes` | Historique des demandes de contact / visite / devis |

### Authentification

`/login`, `/register`, `/forgot-password`, `/reset-password`.

### Back-office (rôle ADMIN ou SUPER_ADMIN)

| URL | Description |
|---|---|
| `/admin` | Dashboard |
| `/admin/proprietes` | CRUD propriétés |
| `/admin/news` | CRUD actualités |
| `/admin/faqs` | CRUD FAQ |
| `/admin/users` | Gestion utilisateurs + rôles |
| `/admin/contacts` | Messages reçus |
| `/admin/partners` | Logos partenaires |
| `/admin/settings` | Paramètres globaux du site |
| `/admin/batipanorama` | Projets, services, processus, devis BatiPanorama |
| `/admin/images` | Médiathèque BunnyCDN |
| `/admin/analytics` | Vues, sessions, événements |
| `/admin/api-docs` | Swagger UI (doc OpenAPI live) |

---

## Tests

```bash
npm test                # Vitest run
npm run test:watch      # Watch mode
npm run test:coverage   # Coverage report
```

Tests actuels dans [__tests__/](__tests__/) : unitaires (schemas Zod, services, utils) + intégration (API propriétés). Couverture à étendre — voir [docs/TESTING_SETUP.md](docs/TESTING_SETUP.md).

---

## Déploiement

Cible : VPS avec PM2.

```bash
npm run build
npm run prod:start          # Démarre via ecosystem.config.js
# ou
npm run deploy              # build + pm2 restart imopanorama
```

Logs : `npm run prod:logs`. La configuration PM2 est dans [ecosystem.config.js](ecosystem.config.js).

Le proxy d'entrée (Nginx ou autre) doit pointer vers le port Next configuré dans `ecosystem.config.js`.

---

## Rôles utilisateur

Enum `Role` dans [prisma/schema.prisma](prisma/schema.prisma) :

- `CLIENT` — utilisateur standard (favoris, demandes)
- `AGENT` — agent immobilier (création de biens)
- `ADMIN` — back-office complet
- `SUPER_ADMIN` — gestion des autres admins

Les guards sont dans [infrastructure/auth/auth-guard.ts](infrastructure/auth/auth-guard.ts) (`requireStaff`, etc.).

---

## Documentation complémentaire

| Fichier | Sujet |
|---|---|
| [docs/DEVELOPER_GUIDE.md](docs/DEVELOPER_GUIDE.md) | Guide développeur (setup approfondi) |
| [docs/API_DOCUMENTATION.md](docs/API_DOCUMENTATION.md) | Référence API (en plus de Swagger UI) |
| [docs/CHARTE_GRAPHIQUE.md](docs/CHARTE_GRAPHIQUE.md) | Charte graphique et tokens de design |
| [docs/MAILTRAP_SETUP.md](docs/MAILTRAP_SETUP.md) | Configuration Mailtrap pour le dev |
| [docs/TESTING_SETUP.md](docs/TESTING_SETUP.md) | Stratégie de tests |
| [docs/PRODUCTION_READINESS.md](docs/PRODUCTION_READINESS.md) | Checklist production, performance, documents et CRM |
| [docs/SKELETON_LOADING_GUIDE.md](docs/SKELETON_LOADING_GUIDE.md) | Conventions de skeletons |
| [docs/AUDIT_MIGRATION.md](docs/AUDIT_MIGRATION.md) | Historique de migration |
| [AGENTS.md](AGENTS.md) / [CLAUDE.md](CLAUDE.md) | Instructions pour les agents IA |

Swagger UI live : démarrer l'app puis se connecter en admin et ouvrir `/admin/api-docs`.

---

## Licence

Propriété d'ImoPanorama Madagascar.
