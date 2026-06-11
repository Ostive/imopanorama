'use client'

import { useReducer } from 'react'

/**
 * Regroupe un ensemble d'états liés dans un seul reducer.
 * `update({ search: 'x', page: 1 })` applique une mise à jour logique
 * en un seul render au lieu d'enchaîner plusieurs setState.
 */
export function useMergedState<T extends object>(initial: T | (() => T)) {
  return useReducer(
    (prev: T, next: Partial<T>) => ({ ...prev, ...next }),
    undefined,
    () => (typeof initial === 'function' ? (initial as () => T)() : initial),
  )
}
