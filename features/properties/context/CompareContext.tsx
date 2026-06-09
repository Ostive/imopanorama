'use client'

import React, { createContext, useContext, useState, useCallback, useMemo } from 'react'
import { Property } from '@/features/properties/types/properties.types'
import { toast } from 'react-hot-toast'

const MAX_COMPARE = 4

interface CompareContextType {
  compareList: Property[]
  addToCompare: (property: Property) => void
  removeFromCompare: (propertyId: string) => void
  isInCompare: (propertyId: string) => boolean
  clearCompare: () => void
  canAdd: boolean
}

const CompareContext = createContext<CompareContextType | null>(null)

export function CompareProvider({ children }: { children: React.ReactNode }) {
  const [compareList, setCompareList] = useState<Property[]>([])

  const addToCompare = useCallback((property: Property) => {
    if (compareList.find(p => p.id === property.id)) {
      toast.error('Cette propriété est déjà dans la comparaison')
      return
    }
    if (compareList.length >= MAX_COMPARE) {
      toast.error(`Maximum ${MAX_COMPARE} propriétés comparables à la fois`)
      return
    }
    toast.success('Ajouté à la comparaison')
    setCompareList(prev => [...prev, property])
  }, [compareList])

  const removeFromCompare = useCallback((propertyId: string) => {
    setCompareList(prev => prev.filter(p => p.id !== propertyId))
  }, [])

  const isInCompare = useCallback(
    (propertyId: string) => compareList.some(p => p.id === propertyId),
    [compareList]
  )

  const clearCompare = useCallback(() => setCompareList([]), [])

  const value = useMemo(() => ({
    compareList,
    addToCompare,
    removeFromCompare,
    isInCompare,
    clearCompare,
    canAdd: compareList.length < MAX_COMPARE,
  }), [compareList, addToCompare, removeFromCompare, isInCompare, clearCompare])

  return (
    <CompareContext.Provider value={value}>
      {children}
    </CompareContext.Provider>
  )
}

export function useCompare() {
  const ctx = useContext(CompareContext)
  if (!ctx) throw new Error('useCompare must be used within CompareProvider')
  return ctx
}
