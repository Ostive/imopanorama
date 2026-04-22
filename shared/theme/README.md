# Système de Thèmes ImoPanorama

Ce document décrit le système de thèmes implémenté dans ImoPanorama, permettant une personnalisation complète des couleurs et la prise en charge du mode sombre.

## Architecture

Le système de thèmes est basé sur:
- **Context API React** pour la gestion d'état global
- **Tailwind CSS** pour l'application des styles
- **localStorage** pour la persistance des préférences utilisateur

## Structure des fichiers

```
src/shared/theme/
├── ThemeContext.tsx    # Contexte React et hook useTheme
├── ThemeProvider.tsx   # Provider pour envelopper l'application
├── ThemeSelector.tsx   # Composant UI pour sélectionner un thème
├── themes.ts           # Définition des thèmes disponibles
└── README.md           # Cette documentation
```

## Thèmes disponibles

Chaque thème est défini avec:
- Un nom unique
- Une couleur primaire
- Une couleur secondaire

Les thèmes actuellement disponibles sont:
- **Bleu (défaut)**: primary: blue, secondary: indigo
- **Vert**: primary: green, secondary: emerald
- **Rouge**: primary: red, secondary: rose
- **Violet**: primary: purple, secondary: violet
- **Orange**: primary: orange, secondary: amber

## Utilisation

### 1. Importer le hook useTheme

```tsx
import { useTheme } from '@/shared/theme/ThemeContext'
```

### 2. Utiliser le hook dans votre composant

```tsx
const { currentTheme, themeMode, setThemeMode, setTheme } = useTheme()
```

### 3. Accéder aux propriétés du thème

```tsx
// Nom du thème
console.log(currentTheme.name) // "blue", "green", etc.

// Couleurs du thème
console.log(currentTheme.colors.primary) // "blue", "green", etc.
console.log(currentTheme.colors.secondary) // "indigo", "emerald", etc.

// Mode actuel (light/dark)
console.log(themeMode) // "light" ou "dark"
```

### 4. Utiliser les couleurs du thème dans les classes Tailwind

```tsx
<button className={`bg-${currentTheme.colors.primary}-500 text-white`}>
  Mon bouton
</button>
```

### 5. Changer de thème

```tsx
// Changer pour le thème "green"
setTheme("green")

// Basculer entre mode clair et sombre
setThemeMode(themeMode === "light" ? "dark" : "light")
```

### 6. Support du mode sombre

Utilisez les classes Tailwind `dark:` pour définir des styles spécifiques au mode sombre:

```tsx
<div className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white">
  Contenu avec support du mode sombre
</div>
```

## Composant ThemeSelector

Un composant de sélection de thème est disponible pour permettre aux utilisateurs de choisir leur thème préféré:

```tsx
import ThemeSelector from '@/shared/theme/ThemeSelector'

// Dans votre composant:
<ThemeSelector />
```

## Page de démonstration

Une page de démonstration est disponible à l'adresse `/theme-demo` pour visualiser tous les thèmes disponibles et leur application sur différents composants UI.

## Étendre le système

### Ajouter un nouveau thème

Pour ajouter un nouveau thème, modifiez le fichier `themes.ts`:

```tsx
// Ajouter un nouveau thème "teal"
export const themes: ThemeOption[] = [
  // Thèmes existants...
  {
    name: "teal",
    colors: {
      primary: "teal",
      secondary: "cyan"
    }
  }
]
```

### Personnaliser les couleurs Tailwind

Si vous avez besoin d'ajouter de nouvelles couleurs ou de modifier les nuances existantes, modifiez le bloc `@theme` dans le fichier `src/app/globals.css`.

## Bonnes pratiques

1. **Toujours utiliser les variables de thème** plutôt que des couleurs codées en dur
2. **Supporter le mode sombre** pour tous les nouveaux composants
3. **Tester les composants** avec différents thèmes pour assurer la cohérence visuelle
4. **Utiliser les classes dynamiques** avec la syntaxe template string pour appliquer les couleurs du thème

## Dépannage

### Les couleurs ne s'appliquent pas correctement

Vérifiez que:
- Le composant est bien enveloppé par `ThemeProvider`
- Les classes dynamiques sont correctement formées (ex: `` `bg-${currentTheme.colors.primary}-500` ``)
- Les couleurs utilisées sont définies dans le bloc `@theme` de `src/app/globals.css`

### Le mode sombre ne fonctionne pas

Vérifiez que:
- La classe `dark` est bien appliquée à l'élément HTML racine
- Les classes `dark:` sont correctement définies dans vos composants
- Le thème sombre est activé dans les préférences utilisateur
