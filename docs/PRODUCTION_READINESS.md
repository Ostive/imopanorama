# Production Readiness

Ce document sert de checklist avant mise en production d'ImoPanorama.

## Architecture applicative

- `app/` contient les routes Next.js, separees entre public, admin, auth et API.
- `features/` contient la logique metier par domaine: proprietes, contacts, notifications, news, favoris, settings.
- `infrastructure/` contient les adaptateurs externes: auth, database, cache, email, search, logger.
- `shared/` contient les composants, utilitaires, configuration de marches et base i18n.
- `prisma/` contient schema, migrations et seeds.

Principe a conserver: les pages appellent des API ou services metier; les requetes Prisma restent dans les services/repositories.

## Checklist de production

- Lancer l'audit automatique: `npm run prod:check`.
- Appliquer les migrations: `npm run db:migrate`.
- Generer Prisma: `npm run prisma:generate`.
- Verifier les variables `.env`: auth, database, Redis, SMTP, BunnyCDN, OpenAI.
- Lancer le build: `npm run build`.
- Lancer les tests: `npm test -- --run`.
- Verifier l'endpoint de sante: `/api/health`.
- Verifier les emails en environnement reel ou staging.
- Verifier les uploads BunnyCDN avec une image de test.
- Verifier la recherche semantique apres `npm run embeddings:backfill`.
- Verifier le sitemap avec la base disponible.

## Performance et N+1

Points traites:

- Les listes de proprietes utilisent `findManyWithCount` avec pagination.
- Les contacts admin sont pagines cote API et ne chargent plus toute la boite de reception.
- Les notifications sont paginees cote API.
- Les favoris recuperent les proprietes via `include`, ce qui evite un N+1 classique.

Points a surveiller:

- Les pages admin news et certains modules BatiPanorama filtrent encore parfois cote client. C'est acceptable pour un petit volume, a migrer vers pagination serveur si le volume grandit.
- La recherche de biens similaires sur-echantillonne puis score en memoire. Le volume est limite par `take: limit * 3`.
- La recherche semantique garde les IDs en memoire avant filtrage. Le nombre de hits doit rester borne.

## Documents immobiliers Madagascar

Pour chaque bien, les champs existants doivent permettre de suivre:

- statut foncier: titre, cadastre, bail long terme, copropriete, autre;
- etat documentaire: inconnu, en verification, partiel, verifie;
- bien verifie;
- region, district, commune, fokontany;
- reference interne.

Documents a demander selon les cas:

- copie du titre foncier ou document cadastral;
- certificat de situation juridique si applicable;
- plan ou bornage;
- piece d'identite du vendeur ou mandat de representation;
- documents de mutation ou historique de propriete;
- autorisations specifiques pour projet commercial, touristique ou construction.

Important: le site doit presenter ces points comme une aide a la verification, pas comme une garantie juridique finale.

## CRM et notifications

Les leads disposent maintenant de:

- statut commercial;
- priorite;
- prochaine relance;
- visite prevue;
- resultat de visite;
- notes internes.

Les notifications admin couvrent:

- nouveau contact;
- demande sur un bien;
- demande de visite detectee dans le message;
- centre de notifications avec lu/non lu.

Prochaine evolution recommandee:

- job planifie pour creer une notification quand `nextFollowUpAt` arrive;
- notification email/WhatsApp pour les leads urgents;
- assignation explicite a un agent depuis l'admin.

## Responsive et UI

Pages a verifier avant production sur mobile et desktop:

- `/`
- `/proprietes`
- `/proprietes/[id]`
- `/immobilier/antananarivo`
- `/calculateur-budget`
- `/admin/contacts`
- `/admin/notifications`
- `/admin/proprietes`

Points visuels critiques:

- les cartes de biens ne doivent pas changer de hauteur brutalement au hover;
- les boutons doivent garder leur texte sur mobile;
- les badges de statut doivent rester lisibles;
- les modales admin doivent scroller correctement sur petit ecran;
- les tableaux admin doivent rester utilisables avec overflow horizontal.

## Donnees et contenu

Les seeds principaux sont alignes Madagascar avec MGA et champs fonciers. Avant lancement public:

- remplacer les images Unsplash par des photos reelles ou legalement utilisables;
- remplacer les placeholders dans `public/images/properties`, `public/images/seo/cities`, `public/images/batipanorama` et `public/images/news`;
- relire les contenus juridiques par un professionnel local;
- eviter les chiffres non verifies sur frais, rendements ou durees administratives;
- ajouter des biens reels par ville prioritaire.

## Monitoring minimum

Configurer un outil externe pour appeler `/api/health` toutes les 1 a 5 minutes. Une reponse `503` indique que l'application tourne mais que la base de donnees n'est pas disponible.

Alertes recommandees:

- erreur `/api/health`;
- hausse des erreurs 4xx/5xx;
- file de contacts sans agent assigne;
- relances CRM depassees;
- espace disque ou volume BunnyCDN proche de la limite;
- expiration domaine, SSL et cles API.
