'use client'

import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ShareIcon } from '@heroicons/react/24/outline'
import { Button } from '@/shared/components/ui/button'
import { toast } from 'react-hot-toast'

// ─── SVG icons ───────────────────────────────────────────────────────────────

const WhatsappIcon = () => (
  <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
    <path d="M12 0C5.373 0 0 5.373 0 12c0 2.123.554 4.118 1.526 5.845L.057 23.428a.75.75 0 00.917.908l5.688-1.457A11.944 11.944 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.75a9.712 9.712 0 01-4.98-1.374l-.356-.212-3.696.947.977-3.589-.232-.369A9.718 9.718 0 012.25 12C2.25 6.615 6.615 2.25 12 2.25S21.75 6.615 21.75 12 17.385 21.75 12 21.75z" />
  </svg>
)

const FacebookIcon = () => (
  <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
  </svg>
)

const XIcon = () => (
  <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.747l7.73-8.835L1.254 2.25H8.08l4.253 5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
)

const CopyIcon = () => (
  <svg className="w-4 h-4 text-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
  </svg>
)

// ─── types ────────────────────────────────────────────────────────────────────

export interface ShareMenuProps {
  /** Title used for native Web Share API and X tweet */
  title: string
  /** Short text for WhatsApp / X — defaults to title */
  text?: string
  /** URL to share — defaults to current page URL */
  url?: string
  className?: string
}

// ─── component ────────────────────────────────────────────────────────────────

export function ShareDropdown({ title, text, url: urlProp, className }: ShareMenuProps) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  const getUrl = () => urlProp ?? (typeof window !== 'undefined' ? window.location.href : '')
  const getText = () => text ?? title

  // Close on outside click
  useEffect(() => {
    if (!open) return
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [open])

  const ITEMS = [
    {
      key: 'whatsapp',
      label: 'WhatsApp',
      sublabel: 'Partager sur WhatsApp',
      icon: <WhatsappIcon />,
      iconBg: 'bg-green-500',
      hoverBg: 'hover:bg-green-50 dark:hover:bg-green-900/20',
      separator: false,
      action: () => window.open(`https://wa.me/?text=${encodeURIComponent(`${getText()}\n${getUrl()}`)}`, '_blank'),
    },
    {
      key: 'facebook',
      label: 'Facebook',
      sublabel: 'Partager sur Facebook',
      icon: <FacebookIcon />,
      iconBg: 'bg-primary-600',
      hoverBg: 'hover:bg-primary-50 dark:hover:bg-primary-900/20',
      separator: false,
      action: () => window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(getUrl())}`, '_blank', 'width=600,height=400'),
    },
    {
      key: 'x',
      label: 'X (Twitter)',
      sublabel: 'Partager sur X',
      icon: <XIcon />,
      iconBg: 'bg-black',
      hoverBg: 'hover:bg-gray-50 dark:hover:bg-gray-800',
      separator: false,
      action: () => window.open(`https://x.com/intent/tweet?text=${encodeURIComponent(getText())}&url=${encodeURIComponent(getUrl())}`, '_blank', 'width=600,height=400'),
    },
    {
      key: 'copy',
      label: 'Copier le lien',
      sublabel: 'Copier dans le presse-papier',
      icon: <CopyIcon />,
      iconBg: 'bg-muted',
      hoverBg: 'hover:bg-gray-50 dark:hover:bg-gray-800',
      separator: true,
      action: () =>
        navigator.clipboard.writeText(getUrl())
          .then(() => toast.success('Lien copié dans le presse-papier'))
          .catch(() => toast.error('Erreur lors de la copie')),
    },
  ]

  return (
    <div className={`relative${className ? ` ${className}` : ''}`} ref={ref}>
      <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
        <Button
          onClick={() => setOpen(v => !v)}
          variant="secondary"
          className="gap-2"
        >
          <ShareIcon className="w-5 h-5" />
          <span>Partager</span>
        </Button>
      </motion.div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -8 }}
            transition={{ duration: 0.15 }}
            className="absolute left-0 top-full mt-2 z-50 bg-card border border-border rounded-2xl shadow-2xl overflow-hidden min-w-56"
          >
            {ITEMS.map(item => (
              <button type="button"
                key={item.key}
                onClick={() => { setOpen(false); item.action() }}
                className={`flex items-center gap-3 w-full px-4 py-3 ${item.hoverBg} transition-colors text-left${item.separator ? ' border-t border-border' : ''}`}
              >
                <span className={`w-8 h-8 rounded-full ${item.iconBg} flex items-center justify-center shrink-0`}>
                  {item.icon}
                </span>
                <div>
                  <div className="text-sm font-semibold text-foreground">{item.label}</div>
                  <div className="text-xs text-gray-500">{item.sublabel}</div>
                </div>
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
