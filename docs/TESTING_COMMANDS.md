# Commandes de test

## Tests rapides

- `npm run test:unit` : tests unitaires.
- `npm run test:integration` : tests d'integration Vitest.
- `npm run test:api` : flux API critiques avec mocks.
- `npm run test:all` : toute la suite Vitest.

## Tests navigateur

- `npm run test:e2e:smoke` : pages publiques et acces admin anonyme.
- `npm run test:e2e:api` : auth + API avec serveur local Playwright.
- `npm run test:e2e:crud` : CRUD admin reel sur les proprietes, protege par variable d'environnement.
- `npm run test:e2e` : toutes les specs Playwright.
- `npm run test:e2e:ui` : interface Playwright.
- `npm run verify:e2e` : smoke navigateur + flux API E2E.

Le test CRUD reel de propriete est protege pour eviter de modifier une mauvaise base.
Pour l'activer en PowerShell:

```powershell
$env:E2E_RUN_ADMIN_CRUD="true"
$env:E2E_ADMIN_EMAIL="admin@imopanorama.mg"
$env:E2E_ADMIN_PASSWORD="Admin123!"
npm run test:e2e:api -- --grep "@crud"
```

Ou directement:

```powershell
$env:E2E_RUN_ADMIN_CRUD="true"
npm run test:e2e:crud
```

Avant le CRUD reel, verifier que la base est alignee:

```powershell
npm run db:status
npm run db:deploy
```

## Verification production

- `npm run check:security` : audit npm.
- `npm run prod:check` : variables, images, sitemap, health endpoint.
- `npm run verify:prod` : audit production + securite + tests Vitest + build.
