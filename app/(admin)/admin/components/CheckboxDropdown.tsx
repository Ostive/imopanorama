'use client'

import { useState, useEffect, useRef } from 'react'
import { ChevronDownIcon } from '@heroicons/react/24/outline'
import { Checkbox } from '@/shared/components/ui/checkbox'

export interface DropdownOption { value: string; label: string }
export interface DropdownGroup { label: string; options: DropdownOption[] }

interface CheckboxDropdownProps {
  label: string
  selected: string[]
  onChange: (values: string[]) => void
  options?: DropdownOption[]
  groups?: DropdownGroup[]
}

export function CheckboxDropdown({ label, selected, onChange, options, groups }: CheckboxDropdownProps) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [open])

  const toggle = (value: string) => {
    onChange(selected.includes(value) ? selected.filter((v) => v !== value) : [...selected, value])
  }

  const allOptions = options || groups?.flatMap((g) => g.options) || []
  const count = selected.length
  const displayLabel = count === 0 ? label
    : count === 1 ? allOptions.find((o) => o.value === selected[0])?.label || label
    : `${label} (${count})`

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className={`w-full h-10 flex items-center justify-between px-3 border rounded-lg text-sm transition-colors ${
          count > 0 ? 'border-primary-300 bg-primary-50 text-primary-700' : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50'
        }`}
      >
        <span className="truncate">{displayLabel}</span>
        <ChevronDownIcon className={`h-4 w-4 shrink-0 ml-2 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && (
        <div className="absolute z-50 mt-1 w-full min-w-48 bg-white border border-gray-200 rounded-xl shadow-xl py-1 max-h-72 overflow-y-auto">
          {count > 0 && (
            <button onClick={() => onChange([])} className="w-full px-3 py-1.5 text-xs text-primary-600 hover:bg-primary-50 text-left font-medium">
              Tout décocher
            </button>
          )}
          {options?.map((opt) => (
            <label key={opt.value} className="flex items-center gap-2.5 px-3 py-2 hover:bg-gray-50 cursor-pointer">
              <Checkbox checked={selected.includes(opt.value)} onCheckedChange={() => toggle(opt.value)} />
              <span className="text-sm text-gray-700">{opt.label}</span>
            </label>
          ))}
          {groups?.map((group) => (
            <div key={group.label}>
              <p className="px-3 pt-2 pb-1 text-xs font-semibold text-gray-400 uppercase tracking-wide">{group.label}</p>
              {group.options.map((opt) => (
                <label key={opt.value} className="flex items-center gap-2.5 px-3 py-2 hover:bg-gray-50 cursor-pointer">
                  <Checkbox checked={selected.includes(opt.value)} onCheckedChange={() => toggle(opt.value)} />
                  <span className="text-sm text-gray-700">{opt.label}</span>
                </label>
              ))}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
