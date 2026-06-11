# Deploiement Coolify - ImoPanorama

Ce projet doit etre deploye en trois ressources Coolify separees :

1. `imopanorama-postgres` : base PostgreSQL avec `pgvector`
2. `imopanorama-redis` : cache/rate-limit Redis
3. `imopanorama-web` : application Next.js construite depuis la branche `production`

Le principe est volontairement simple : PostgreSQL et Redis sont deployes un par un dans Coolify, puis leurs URLs internes sont copiees dans les variables d'environnement de l'application web.

## Branches

- `developpement` : travail quotidien et tests.
- `main` : branche stable synchronisee.
- `production` : branche a connecter dans Coolify pour le deploiement.

## 1. PostgreSQL

L'application utilise Prisma et une colonne `vector(1536)` pour la recherche semantique. La base doit donc accepter l'extension `vector`.

Option recommandee :

- Creer une ressource Coolify de type service Docker Compose ou database personnalisee avec l'image `pgvector/pgvector:pg16`.
- Creer une base, par exemple `imopanorama`.
- Activer les extensions au premier demarrage ou via terminal Coolify :

```sql
CREATE EXTENSION IF NOT EXISTS vector;
CREATE EXTENSION IF NOT EXISTS pg_trgm;
CREATE EXTENSION IF NOT EXISTS fuzzystrmatch;
CREATE EXTENSION IF NOT EXISTS unaccent;
CREATE EXTENSION IF NOT EXISTS cube;
CREATE EXTENSION IF NOT EXISTS earthdistance;
CREATE EXTENSION IF NOT EXISTS btree_gin;
```

Si tu utilises le PostgreSQL one-click de Coolify, verifie d'abord que `CREATE EXTENSION vector;` fonctionne. Sinon, utilise l'image `pgvector/pgvector:pg16`.

Dans Coolify, copie l'URL interne de la base et mets-la dans l'application web :

```env
DATABASE_URL=postgresql://USER:PASSWORD@POSTGRES_INTERNAL_HOST:5432/imopanorama?schema=public
```

Utilise l'URL interne si l'application web et la base sont sur le meme serveur/destination Coolify. Utilise l'URL publique uniquement si elles ne partagent pas de reseau.

## 2. Redis

Creer une ressource Coolify Redis separee.

Dans Coolify, copie l'URL interne Redis et mets-la dans l'application web :

```env
REDIS_URL=redis://:PASSWORD@REDIS_INTERNAL_HOST:6379
```

Redis est utilise pour le cache et le rate limit. Si Redis tombe, l'application sait revenir en mode direct DB, mais la production doit avoir Redis configure.

## 3. Application web

Creer une application Coolify :

- Repository : `https://github.com/Ostive/imopanorama.git`
- Branch : `production`
- Build pack : Dockerfile
- Dockerfile : `Dockerfile`
- Port expose : `3000`
- Domain : domaine final du site, par exemple `https://imopanorama.mg`

Variables importantes a definir dans Coolify :

```env
NODE_ENV=production
PORT=3000
HOSTNAME=0.0.0.0
NEXT_PUBLIC_APP_URL=https://imopanorama.mg
BETTER_AUTH_URL=https://imopanorama.mg
BETTER_AUTH_SECRET=replace_with_strong_random_secret
DATABASE_URL=postgresql://USER:PASSWORD@POSTGRES_INTERNAL_HOST:5432/imopanorama?schema=public
REDIS_URL=redis://:PASSWORD@REDIS_INTERNAL_HOST:6379
NEXT_PUBLIC_DEFAULT_MARKET=MG
```

Complete ensuite les variables email, BunnyCDN, OpenAI, reCAPTCHA et analytics depuis `.env.coolify.example`.

Les variables `NEXT_PUBLIC_*` doivent etre disponibles au build et au runtime, car Next.js les integre dans le bundle client. Les secrets comme `BETTER_AUTH_SECRET`, `DATABASE_URL`, `REDIS_URL`, `SMTP_PASS`, `BUNNYCDN_API_KEY` et `OPENAI_API_KEY` doivent rester verrouilles dans Coolify.

## 4. Migrations Prisma

Apres le premier deploiement de PostgreSQL, lancer les migrations :

```bash
npm run db:deploy
```

Tu peux lancer cette commande depuis le terminal Coolify de l'application web, ou comme commande de migration manuelle apres chaque changement de schema.

Si la migration `CREATE EXTENSION IF NOT EXISTS vector;` echoue, c'est que la base ne supporte pas `pgvector`. Il faut alors changer l'image PostgreSQL ou installer l'extension.

## 5. Verification avant de deployer

En local, verifier :

```bash
npm run test:unit
npm run build
```

Puis pousser sur la branche de production :

```bash
git switch production
git merge main
git push origin production
```

Coolify peut ensuite deployer automatiquement la branche `production`.

## 6. Sauvegardes

Activer les backups Coolify pour PostgreSQL. Redis est moins critique car il sert de cache, mais son volume peut aussi etre persiste.

Conserver les secrets uniquement dans Coolify ou dans un coffre de mots de passe. Ne jamais commiter `.env`, `.env.production` ou les URLs reelles avec mots de passe.
