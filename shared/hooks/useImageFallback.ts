'use client'

import { useCallback, useRef } from 'react'

const PLACEHOLDER = '/images/properties/property-placeholder.jpg'

// Set global partagé entre toutes les instances — si une image 404 une fois,
// on ne la retente plus jamais pendant la session.
const failedImages = new Set<string>()

/**
 * Retourne une version "safe" d'une URL d'image :
 * - si elle a déjà échoué → placeholder immédiat (pas de requête)
 * - sinon → URL originale
 *
 * + un handler onError qui marque l'image comme cassée et force le placeholder.
 */
export function getSafeImageSrc(src: string): string {
  if (!src || failedImages.has(src)) return PLACEHOLDER
  return src
}

function markImageFailed(src: string) {
  if (src && src !== PLACEHOLDER) {
    failedImages.add(src)
  }
}

/**
 * Hook pour un composant qui gère une liste d'images.
 * Retourne les images filtrées (failed → placeholder) et un handler onError.
 */
export function useImageFallback() {
  const rerenderRef = useRef(0)

  const handleImageError = useCallback((e: React.SyntheticEvent<HTMLImageElement>) => {
    const target = e.target as HTMLImageElement
    const originalSrc = target.getAttribute('data-original-src') || target.src

    if (originalSrc && originalSrc !== PLACEHOLDER && !failedImages.has(originalSrc)) {
      failedImages.add(originalSrc)
      target.src = PLACEHOLDER
    }
  }, [])

  const safeSrc = useCallback((src: string): string => {
    return getSafeImageSrc(src)
  }, [])

  const safeImages = useCallback((images: string[]): string[] => {
    if (!images || images.length === 0) return [PLACEHOLDER]
    return images.map(img => getSafeImageSrc(img))
  }, [])

  return { handleImageError, safeSrc, safeImages, PLACEHOLDER }
}
