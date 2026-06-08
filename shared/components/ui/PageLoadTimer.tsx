'use client'

import { useEffect, useState } from 'react'

type Phase = 'loading' | 'done'

interface Metric {
  label: string
  value: number
  color: string
}

export default function PageLoadTimer() {
  const [phase, setPhase] = useState<Phase>('loading')
  const [elapsed, setElapsed] = useState(0)
  const [metrics, setMetrics] = useState<Metric[]>([])
  const [visible, setVisible] = useState(true)
  const [tick, setTick] = useState(0)

  // Live counter while loading
  useEffect(() => {
    if (phase !== 'loading') return
    const start = performance.now()
    const interval = setInterval(() => {
      setElapsed(Math.round(performance.now() - start))
      setTick(t => t + 1)
    }, 50)
    return () => clearInterval(interval)
  }, [phase])

  // Capture final metrics on full load
  useEffect(() => {
    const capture = () => {
      const nav = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming | undefined
      const paints = performance.getEntriesByType('paint')

      const collected: Metric[] = []

      const fcp = paints.find(p => p.name === 'first-contentful-paint')
      if (fcp) collected.push({ label: 'FCP', value: Math.round(fcp.startTime), color: getColor(fcp.startTime, 1800, 3000) })

      if (nav) {
        collected.push({ label: 'TTFB', value: Math.round(nav.responseStart - nav.requestStart), color: getColor(nav.responseStart - nav.requestStart, 200, 500) })
        collected.push({ label: 'DOM', value: Math.round(nav.domContentLoadedEventEnd - nav.startTime), color: getColor(nav.domContentLoadedEventEnd - nav.startTime, 1500, 3000) })
        collected.push({ label: 'Total', value: Math.round(nav.loadEventEnd - nav.startTime), color: getColor(nav.loadEventEnd - nav.startTime, 2500, 4000) })
      }

      setMetrics(collected)
      setElapsed(Math.round(performance.now()))
      setPhase('done')
    }

    if (document.readyState === 'complete') {
      capture()
    } else {
      window.addEventListener('load', capture, { once: true })
      return () => window.removeEventListener('load', capture)
    }
  }, [])

  if (!visible) return null

  return (
    <div className="fixed bottom-4 right-4 z-[9999] font-mono text-xs select-none">
      <div className="bg-gray-950/95 backdrop-blur-sm text-white rounded-2xl shadow-2xl border border-white/10 overflow-hidden w-52">

        {/* Header */}
        <div className="flex items-center justify-between px-3 py-2 border-b border-white/10">
          <div className="flex items-center gap-2">
            <span className={`h-2 w-2 rounded-full ${phase === 'loading' ? 'bg-amber-400 animate-pulse' : 'bg-emerald-400'}`} />
            <span className="text-[11px] font-semibold text-white/80 uppercase tracking-wider">
              {phase === 'loading' ? 'Chargement…' : 'Chargé'}
            </span>
          </div>
          <button type="button"
            onClick={() => setVisible(false)}
            className="text-white/40 hover:text-white/80 transition-colors text-base leading-none"
          >
            ×
          </button>
        </div>

        {/* Live counter */}
        <div className="px-3 py-2.5 border-b border-white/10">
          <div className="text-2xl font-bold tabular-nums text-center">
            <span className={phase === 'loading' ? 'text-amber-400' : elapsed < 2000 ? 'text-emerald-400' : elapsed < 4000 ? 'text-amber-400' : 'text-red-400'}>
              {phase === 'loading'
                ? (elapsed / 1000).toFixed(2)
                : (elapsed / 1000).toFixed(2)}
            </span>
            <span className="text-white/40 text-sm ml-1">s</span>
          </div>
          {phase === 'done' && (
            <div className="text-center mt-0.5">
              <span className={`text-[10px] font-semibold ${elapsed < 2000 ? 'text-emerald-400' : elapsed < 4000 ? 'text-amber-400' : 'text-red-400'}`}>
                {elapsed < 2000 ? 'Rapide' : elapsed < 4000 ? 'Moyen' : 'Lent'}
              </span>
            </div>
          )}
        </div>

        {/* Metrics */}
        {phase === 'done' && metrics.length > 0 && (
          <div className="px-3 py-2 space-y-1.5">
            {metrics.map(m => (
              <div key={m.label} className="flex items-center justify-between">
                <span className="text-white/50">{m.label}</span>
                <div className="flex items-center gap-2">
                  <div className="w-16 h-1 bg-white/10 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-700"
                      style={{
                        width: `${Math.min((m.value / 5000) * 100, 100)}%`,
                        backgroundColor: m.color,
                      }}
                    />
                  </div>
                  <span className="text-white/80 w-12 text-right tabular-nums">{m.value} ms</span>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Footer hint */}
        <div className="px-3 py-1.5 bg-white/5 text-[9px] text-white/30 text-center">
          DEV ONLY · F5 pour relancer
        </div>
      </div>
    </div>
  )
}

function getColor(value: number, good: number, bad: number): string {
  if (value <= good) return '#34d399'   // emerald
  if (value <= bad)  return '#fbbf24'   // amber
  return '#f87171'                       // red
}
