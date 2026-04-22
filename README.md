# ImoPanorama Madagascar  

Site web d'agence immobilière spécialisée dans la vente de terrains à Madagascar, avec présentation du partenaire BatiPanorama pour la construction.  

## 🌟 Fonctionnalités  

- **Vente de terrains**: Catalogue complet de terrains disponibles à Madagascar  
- **BatiPanorama**: Présentation du partenaire construction  
- **Design moderne**: Interface utilisateur moderne et responsive  
- **Optimisé mobile**: Parfaitement adapté à tous les écrans  
- **SEO optimisé**: Méta-données et structure optimisées pour le référencement  

## 🚀 Technologies utilisées  

- **Next.js 16** - Framework React avec App Router  
- **TypeScript** - Typage statique  
- **Tailwind CSS 4** - Framework CSS utilitaire  
- **Heroicons** - Icônes SVG  
- **Next.js Image** - Optimisation d'images  
- **Prisma** - ORM pour la base de données
- **PostgreSQL** - Base de données relationnelle
- **Vitest** - Tests unitaires  

## 📦 Installation  

1. Cloner le projet :
```bash
git clone [votre-repo]
cd imopanorama
``` 

2. Installer les dépendances :
```bash
npm install
```

3. Configurer l'environnement :
   - Dupliquer le fichier `.env.local.example` en `.env` (si applicable)
   - Configurer les variables d'environnement (Base de données, API keys, etc)

4. Initialiser la base de données :
```bash
npx prisma generate
npx prisma migrate dev
```

5. Lancer le serveur de développement :
```bash
npm run dev
```

6. Ouvrir [http://localhost:3000](http://localhost:3000) dans votre navigateur  

## 🏗️ Architecture Modulaire  

Le projet utilise une architecture modulaire préparée pour une future migration vers les microservices.

```
src/
├── app/                    # Next.js App Router
├── modules/               # Modules métier
│   ├── properties/
│   │   ├── components/    # Composants spécifiques
│   │   ├── hooks/        # Hooks React
│   │   ├── services/     # Logic métier
│   │   └── types/        # Types TypeScript
│   └── batipanorama/
├── shared/                # Code partagé
│   ├── components/       # Composants réutilisables
│   ├── services/         # Services communs
│   ├── types/           # Types partagés
│   └── utils/           # Utilitaires
├── components/           # Composants de layout
└── config/              # Configuration centralisée
```

### 📋 Modules  

- **properties/** : Gestion des propriétés/terrains (types, services, hooks, composants)  
- **batipanorama/** : Gestion du partenaire construction  
- **shared/** : Code réutilisable entre modules  
- **config/** : Configuration centralisée  

## 📄 Pages principales  

- **Accueil** (`/`) - Page d'accueil avec présentation générale  
- **Terrains** (`/terrains`) - Catalogue des terrains disponibles  
- **BatiPanorama** (`/batipanorama`) - Présentation du partenaire construction  
- **Contact** - Section de contact intégrée  

## 🎨 Couleurs du thème  

- **Primary**: Bleu (#0ea5e9)  
- **Madagascar**: Orange (#f97316)  
- **Gris**: Nuances de gris pour le texte et les fonds  

## 📱 Responsive Design  

Le site est entièrement responsive et optimisé pour :  
- 📱 Mobile (320px+)  
- 📱 Tablette (768px+)  
- 💻 Desktop (1024px+)  
- 🖥️ Large screens (1280px+)  

## 🔧 Commandes disponibles  

```bash
# Développement
npm run dev

# Production
npm run build
npm start

# Base de données
npm run prisma:generate
npm run prisma:migrate

# Tests
npm run test
npm run test:ui

# Linting
npm run lint
```

## 🚀 Déploiement  

Le site peut être déployé sur :  
- **Vercel** (recommandé pour Next.js)  
- **Netlify**  
- **GitHub Pages**  
- Tout hébergeur supportant Node.js  

## 🎯 Stratégie de Migration Microservices  

### Phase 1 : Monolithe Modulaire ✅ (Actuelle)  
- Structure modulaire en place  
- Services séparés par domaine  
- API Routes internes  
- Types et hooks organisés  

### Phase 2 : API Gateway (6-12 mois)  
- [ ] Authentification centralisée  
- [ ] Rate limiting  
- [ ] Monitoring et logs  
- [ ] Cache distribué  

### Phase 3 : Microservices (12-18 mois)  
- [ ] Service Terrains indépendant  
- [ ] Service BatiPanorama séparé  
- [ ] Service Users/Auth  
- [ ] Service Notifications  
- [ ] Base de données par service  

## 📈 Évolutions fonctionnelles  

- [ ] Système d'administration  
- [ ] Authentification utilisateurs  
- [ ] Paiements en ligne  
- [ ] Système de favoris  
- [ ] Recherche avancée  
- [ ] Blog immobilier  
- [ ] Calculatrice de prêt  
- [ ] Intégration Google Maps  

## 📞 Contact  

Pour toute question concernant le développement :  
- Email: contact@imopanorama.mg  
- Téléphone: +261 34 XX XX XX XX  

## 📄 Licence  

Ce projet est la propriété d'ImoPanorama Madagascar.
