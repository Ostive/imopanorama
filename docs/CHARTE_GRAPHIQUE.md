# Charte Graphique — Imo

> Document de référence design. À consulter avant tout développement d'interface.  
> Dernière mise à jour : 2026-04-12

---

## Sommaire

1. [Identité visuelle](#1-identité-visuelle)
2. [Palette de couleurs](#2-palette-de-couleurs)
3. [Typographie](#3-typographie)
4. [Espacements & Layout](#4-espacements--layout)
5. [Ombres & Rayons](#5-ombres--rayons)
6. [Composants UI](#6-composants-ui)
7. [Patterns d'animation](#7-patterns-danimation)
8. [Dark Mode](#8-dark-mode)
9. [Règles d'usage](#9-règles-dusage)

---

## 1. Identité visuelle

| Élément | Valeur |
|---|---|
| **Marque** | Imo — Immobilier & Construction |
| **Positionnement** | Professionnel, moderne, épuré |
| **Tons** | Bleu ciel (confiance) + Orange (énergie) + Teal (fraîcheur) |
| **Police principale** | Poppins (Google Fonts) |
| **Style général** | Cards arrondies, gradients subtils, animations douces |

---

## 2. Palette de couleurs

### 🔵 Primary — Bleu Ciel (couleur principale)

> Utilisé pour : CTA principaux, liens actifs, focus, barres de progression, badges "publié"

| Token | Valeur HEX | Usage |
|---|---|---|
| `primary-50` | `#f0f9ff` | Fonds de hover léger, badges light |
| `primary-100` | `#e0f2fe` | Arrière-plans de sections actives |
| `primary-200` | `#bae6fd` | Bordures soft |
| `primary-300` | `#7dd3fc` | Icônes secondaires |
| `primary-400` | `#38bdf8` | États intermédiaires |
| **`primary-500`** | **`#0ea5e9`** | **Couleur principale — icônes, indicateurs** |
| **`primary-600`** | **`#0284c7`** | **Boutons primaires, liens** |
| **`primary-700`** | **`#0369a1`** | **Hover de boutons primaires** |
| `primary-800` | `#075985` | Textes foncés |
| `primary-900` | `#0c4a6e` | Textes très foncés |
| `primary-950` | `#082f49` | — |

```css
/* Exemple d'usage */
bg-primary-600      /* fond bouton principal */
text-primary-700    /* texte lien */
border-primary-200  /* bordure card selected */
hover:bg-primary-50 /* hover léger */
```

---

### 🟢 Secondary — Teal (couleur secondaire)

> Utilisé pour : éléments de mise en valeur, statistiques, accents décoratifs

| Token | Valeur HEX | Usage |
|---|---|---|
| `secondary-50` | `#f0fdfa` | Fond de highlight |
| `secondary-500` | `#14b8a6` | Icônes secondaires |
| **`secondary-600`** | **`#0d9488`** | **Boutons secondaires** |
| `secondary-700` | `#0f766e` | Hover secondaire |

---

### 🟠 Accent — Orange (couleur d'accentuation)

> Utilisé pour : badges "nouveau", éléments d'alerte positive, mise en avant prix

| Token | Valeur HEX | Usage |
|---|---|---|
| `accent-50` | `#fef7ee` | Fond de badge orange |
| `accent-400` | `#f7a13a` | Icône énergie |
| **`accent-500`** | **`#f97316`** | **Accent principal** |
| `accent-600` | `#ea580c` | Hover accent |

---

### ⚫ Neutres — Gris (textes, fonds, bordures)

> Utilisé pour : la majorité du texte, fonds de sections, bordures

| Token | Usage |
|---|---|
| `gray-50` | Fond de sections alternées (`bg-gray-50`) |
| `gray-100` | Bordures légères (`border-gray-100`) |
| `gray-200` | Séparateurs, squelettes de chargement |
| `gray-400` | Textes placeholder, icônes inactives |
| **`gray-500`** | **Textes secondaires** |
| **`gray-700`** | **Textes de corps** |
| **`gray-900`** | **Titres principaux** |
| `gray-950` | Fond dark mode principal |

---

### 🎨 Gradients standards

```css
/* Bouton principal — Tailwind v4 */
bg-linear-to-r from-primary-600 to-blue-600

/* Badge hero / stats */
bg-linear-to-br from-primary-500 to-blue-500

/* Bouton danger */
bg-red-600 hover:bg-red-700

/* Fond admin */
bg-gray-50 dark:bg-gray-950
```

---

### 🔴 Couleurs sémantiques

| Rôle | Couleur | Classes |
|---|---|---|
| **Succès** | Vert | `bg-green-100 text-green-800` / `text-green-600` |
| **Erreur** | Rouge | `bg-red-100 text-red-800` / `text-red-500` |
| **Avertissement** | Jaune | `bg-yellow-100 text-yellow-800` |
| **Info** | Bleu | `bg-blue-100 text-blue-800` |
| **Publié** | Vert | `bg-green-100 text-green-800` |
| **Brouillon** | Gris | `bg-gray-100 text-gray-800` |
| **En cours** | Jaune | `bg-yellow-100 text-yellow-800` |
| **Terminé** | Vert | `bg-green-100 text-green-800` |
| **Planifié** | Gris | `bg-gray-100 text-gray-800` |

---

## 3. Typographie

### Police

```css
font-family: 'Poppins', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
```

> Poppins est chargée via Google Fonts. Elle apporte une lisibilité moderne et géométrique.

### Hiérarchie des titres

| Niveau | Classe | Taille | Poids | Usage |
|---|---|---|---|---|
| **H1 Hero** | `text-5xl lg:text-7xl font-black` | 48–72px | 900 | Titre hero principal |
| **H1 Section** | `text-4xl lg:text-5xl font-black` | 36–48px | 900 | Titre de section principale |
| **H2** | `text-2xl lg:text-3xl font-bold` | 24–30px | 700 | Sous-titre de section |
| **H3 Card** | `text-xl font-bold` | 20px | 700 | Titre de carte |
| **H4** | `text-base font-semibold` | 16px | 600 | Label, sous-titre de carte |
| **Corps** | `text-base` | 16px | 400 | Texte courant |
| **Small** | `text-sm` | 14px | 400 | Métadonnées, labels |
| **XSmall** | `text-xs` | 12px | — | Badges, captions |

### Texte courant

```css
/* Titre de page admin */
text-2xl font-bold text-gray-900 dark:text-white

/* Titre de card */
text-lg font-bold text-gray-900 dark:text-white

/* Corps de texte */
text-base text-gray-700 dark:text-gray-300

/* Texte secondaire */
text-sm text-gray-500 dark:text-gray-400

/* Label de formulaire */
text-sm font-medium text-gray-700 dark:text-gray-300
```

---

## 4. Espacements & Layout

### Containers

| Contexte | Classe | Largeur max |
|---|---|---|
| **Admin** | `max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8` | 1600px |
| **Client** | `container mx-auto px-4` | ~1280px |
| **Contenu modal** | `max-w-md` / `max-w-2xl` | 448–672px |

### Grilles

```css
/* Admin — formulaire 12 colonnes */
grid grid-cols-12 gap-6 lg:gap-8
/* └── Contenu principal : col-span-12 lg:col-span-9 */
/* └── Sidebar           : col-span-12 lg:col-span-3 */

/* Cards produit */
grid sm:grid-cols-2 lg:grid-cols-3 gap-6

/* Stats */
grid grid-cols-2 lg:grid-cols-4 gap-8
```

### Sections (client)

```css
py-24          /* section standard */
py-16          /* section compacte (stats, partenaires) */
py-12 px-6     /* section contenu dense */
```

### Espacements internes

```css
p-6            /* padding card standard */
p-8            /* padding card large / modale */
gap-4          /* grille form labels/inputs */
gap-6          /* grille de cards */
gap-8          /* grille espacée (stats) */
space-y-6      /* pile de champs de formulaire */
mb-3           /* espace sous label */
mt-1.5         /* espace au-dessus de FieldError */
```

---

## 5. Ombres & Rayons

### Ombres

| Classe | Valeur | Usage |
|---|---|---|
| `shadow-sm` | `0 1px 3px rgb(0 0 0/10%)` | Card au repos |
| `shadow-md` | `0 4px 6px rgb(0 0 0/7%)` | Card hover |
| `shadow-lg` | `0 10px 15px rgb(0 0 0/8%)` | Modal, dropdown |
| `shadow-xl` | `0 20px 25px rgb(0 0 0/8%)` | Hero card flottante |
| `shadow-2xl` | `0 25px 50px rgb(0 0 0/15%)` | Éléments en avant-plan |

### Rayons (border-radius)

| Classe | Valeur | Usage |
|---|---|---|
| `rounded-lg` | 8px | Inputs, petits éléments |
| `rounded-xl` | 12px | Cards, boutons |
| `rounded-2xl` | 16px | Cards principales, modales |
| `rounded-3xl` | 24px | Sections hero, grandes cards |
| `rounded-full` | 9999px | Badges, avatars, pills |

> **Variable globale** : `--radius: 0.75rem` (définie dans globals.css)

---

## 6. Composants UI

### Boutons

```tsx
/* Primaire — action principale */
<Button className="bg-gradient-to-r from-primary-600 to-blue-600 text-white hover:opacity-90">
  Enregistrer
</Button>

/* Outline primaire */
<Button variant="outline" className="border-primary-200 text-primary-700 hover:bg-primary-50">
  Modifier
</Button>

/* Danger */
<Button className="bg-red-600 hover:bg-red-700 text-white">
  Supprimer
</Button>

/* Ghost */
<Button variant="ghost">Annuler</Button>

/* Avec icône */
<Button className="gap-2">
  <PlusIcon className="h-4 w-4" /> Ajouter
</Button>
```

### Inputs

```tsx
/* Standard */
<div className="space-y-1.5">
  <Label htmlFor="field">Label <span className="text-red-500">*</span></Label>
  <Input id="field" placeholder="Placeholder..." />
  {/* Erreur Zod */}
  <p className="text-xs text-red-500 mt-1">Message d'erreur</p>
</div>

/* Textarea */
<Textarea rows={4} placeholder="..." />
```

### Cards

```tsx
/* Card standard admin */
<Card className="dark:bg-gray-900">
  <CardHeader className="border-b border-gray-100 dark:border-gray-800">
    <CardTitle>Titre</CardTitle>
    <CardDescription>Sous-titre</CardDescription>
  </CardHeader>
  <CardContent className="pt-6">
    {/* contenu */}
  </CardContent>
</Card>

/* Card sélectionnée / en avant */
<Card className="border-primary-200 dark:border-primary-800 shadow-lg">
```

### Badges

```tsx
/* Actif / Publié */
<Badge variant="default">Actif</Badge>

/* Inactif / Brouillon */
<Badge variant="secondary">Inactif</Badge>

/* Outline */
<Badge variant="outline">Planifié</Badge>

/* Statut coloré manuel */
<span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
  <CheckCircleIcon className="w-3.5 h-3.5" />
  Terminé
</span>
```

### Progress

```tsx
/* Progression de formulaire */
<Progress
  value={completionPct}
  className={completionPct === 100
    ? '[&>div]:bg-green-500'
    : '[&>div]:bg-primary-500'
  }
/>
```

### Switch

```tsx
<div className="flex items-center gap-3">
  <Switch checked={value} onCheckedChange={setValue} />
  <span className="text-sm text-gray-600 dark:text-gray-400">
    {value ? 'Actif' : 'Inactif'}
  </span>
</div>
```

### Modales de suppression

Structure standard pour toutes les modales de confirmation :

```tsx
<motion.div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
  <motion.div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl max-w-md w-full p-6 border border-gray-100 dark:border-gray-800">
    {/* Icon + Titre */}
    <div className="flex items-center gap-4 mb-4">
      <div className="w-12 h-12 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center">
        <TrashIcon className="w-6 h-6 text-red-600 dark:text-red-400" />
      </div>
      <div>
        <h3 className="text-lg font-bold text-gray-900 dark:text-white">Supprimer X</h3>
        <p className="text-sm text-gray-500 dark:text-gray-400">Cette action est irréversible</p>
      </div>
    </div>
    {/* Zone warning */}
    <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-4 mb-6 text-sm">…</div>
    {/* Actions */}
    <div className="flex gap-3">
      <Button variant="outline" className="flex-1">Annuler</Button>
      <Button className="flex-1 bg-red-600 hover:bg-red-700 text-white gap-2">Supprimer</Button>
    </div>
  </motion.div>
</motion.div>
```

### Toasts (react-hot-toast)

```tsx
toast.success('Message de succès')               // vert, auto-dismiss
toast.error('Message d\'erreur', { duration: 4000 }) // rouge, 4s
```

> **Règle** : Ne jamais utiliser `alert()`, `window.confirm()`, ni de state `notification` custom. Toujours `toast`.

### Tables admin

```tsx
<table className="w-full">
  <thead className="bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
    <tr>
      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
        Colonne
      </th>
    </tr>
  </thead>
  <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
    <tr className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
      <td className="px-6 py-4">…</td>
    </tr>
  </tbody>
</table>
```

---

## 7. Patterns d'animation

### Framer Motion — entrées de cards

```tsx
/* Card individuelle */
<motion.div
  initial={{ opacity: 0, y: 16 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ delay: index * 0.07 }}
>

/* Liste de lignes */
initial={{ opacity: 0, x: -12 }}
animate={{ opacity: 1, x: 0 }}
transition={{ delay: i * 0.04 }}

/* Section (whileInView) */
<motion.div
  initial={{ opacity: 0, y: 30 }}
  whileInView={{ opacity: 1, y: 0 }}
  viewport={{ once: true }}
  transition={{ duration: 0.6 }}
>
```

### AnimatePresence — formulaires / modales

```tsx
<AnimatePresence>
  {showForm && (
    <motion.div
      key="form"
      initial={{ opacity: 0, y: -12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12 }}
      transition={{ duration: 0.2 }}
    >
```

### Durées standard

| Contexte | Durée |
|---|---|
| Modale d'entrée | `0.2s` |
| Section whileInView | `0.6s` |
| Hover transition | `150–200ms` (Tailwind `transition-colors`) |
| Délai stagger cards | `index * 0.07s` |

---

## 8. Dark Mode

### Principe

Le dark mode est activé via la classe `.dark` sur `<html>`. Il utilise `@custom-variant dark (&:is(.dark *))`.

### Paires de classes standard

| Élément | Light | Dark |
|---|---|---|
| Fond de page | `bg-gray-50` | `dark:bg-gray-950` |
| Fond de card | `bg-white` | `dark:bg-gray-900` |
| Fond de header table | `bg-gray-50` | `dark:bg-gray-800` |
| Bordure card | `border-gray-100` | `dark:border-gray-800` |
| Séparateur | `divide-gray-100` | `dark:divide-gray-800` |
| Titre (H1–H3) | `text-gray-900` | `dark:text-white` |
| Corps | `text-gray-700` | `dark:text-gray-300` |
| Secondaire | `text-gray-500` | `dark:text-gray-400` |
| Placeholder | `text-gray-400` | `dark:text-gray-600` |
| Hover row table | `hover:bg-gray-50` | `dark:hover:bg-gray-800/50` |
| Bouton outline primary | `border-primary-200 text-primary-700 hover:bg-primary-50` | `dark:border-primary-800 dark:text-primary-400 dark:hover:bg-primary-900/20` |
| Bouton outline danger | `border-red-200 text-red-600 hover:bg-red-50` | `dark:border-red-800 dark:text-red-400 dark:hover:bg-red-900/20` |
| Zone warning rouge | `bg-red-50 border-red-200` | `dark:bg-red-900/20 dark:border-red-800` |

> **Règle** : Tout composant doit avoir ses variantes `dark:` correspondantes. Ne jamais laisser un composant sans dark mode.

---

## 9. Règles d'usage

### ✅ À faire

- Utiliser les tokens `primary-*`, `secondary-*`, `accent-*` définis dans `globals.css`
- Appliquer `dark:` sur **tous** les composants (textes, fonds, bordures)
- Valider les formulaires avec **Zod** (`safeParse`) + affichage inline des erreurs
- Utiliser `toast.success` / `toast.error` pour les retours utilisateur
- Utiliser les composants partagés : `Button`, `Input`, `Textarea`, `Label`, `Card`, `Badge`, `Switch`, `Progress`
- Lier les pages de création/édition à des routes dédiées (`/new`, `/[id]/edit`) — jamais inline dans la liste
- Respecter le container `max-w-[1600px]` dans l'admin

### ❌ À ne pas faire

- Créer des couleurs HEX en dur dans le code (utiliser les tokens)
- Utiliser `alert()` ou `window.confirm()` — toujours `toast`
- Mélanger les styles inline et les classes Tailwind
- Créer des composants de notification custom (state + timeout) — toujours `react-hot-toast`
- Oublier `dark:` sur les nouveaux composants
- Utiliser `bg-gradient-to-*` — ce projet est sur **Tailwind v4** qui utilise `bg-linear-to-*` (syntaxe correcte)
- Inventer des routes ou des pages qui n'existent pas dans les liens

### 📐 Hiérarchie d'un formulaire admin

```
ProtectedRoute
└── div.min-h-screen.bg-gray-50.dark:bg-gray-950.py-8
    └── div.max-w-[1600px].mx-auto.px-4.sm:px-6.lg:px-8
        ├── En-tête (back link + titre + sous-titre)
        ├── form (grid grid-cols-12 gap-6)
        │   ├── Section principale (col-span-12 lg:col-span-9)
        │   │   └── Card(s) avec les champs
        │   └── Sidebar (col-span-12 lg:col-span-3, sticky top-6)
        │       ├── Card Progression (Progress + checklist)
        │       ├── Card Actions (boutons Enregistrer / Annuler)
        │       └── Card Conseils
        └── Barre flottante mobile (fixed bottom-0, visible sous lg)
```

---

*Ce document est la source de vérité pour les décisions de design du projet.*  
*Mettre à jour à chaque ajout de nouveau token, composant ou pattern.*
