import { useState, useEffect, useCallback } from 'react'
import type { LightingZone, LightingMode } from '../types/dashboard'

const INITIAL: LightingZone[] = [
  { id: 1, name: 'Zona Este', mode: 'eco', brightness: 50, ldrValue: 50 },
  { id: 2, name: 'Zona Oeste', mode: 'eco', brightness: 50, ldrValue: 50 },
]

export function useLightingZones() {
  const [zones, setZones] = useState<LightingZone[]>(INITIAL)

  useEffect(() => {
    const interval = setInterval(() => {
      setZones((prev) =>
        prev.map((z) => {
          if (z.mode !== 'eco') return z
          const delta = Math.floor(Math.random() * 30) - 15
          const newLdr = Math.max(20, Math.min(90, z.ldrValue + delta))
          const newBrightness = Math.round((100 - newLdr) * 0.8) + 10
          return { ...z, ldrValue: newLdr, brightness: Math.min(100, newBrightness) }
        }),
      )
    }, 2500)
    return () => clearInterval(interval)
  }, [])

  const setMode = useCallback((id: number, mode: LightingMode) => {
    setZones((prev) =>
      prev.map((z) => {
        if (z.id !== id) return z
        if (mode === 'cutoff') return { ...z, mode, brightness: 0 }
        if (mode === 'eco') return { ...z, mode, brightness: z.ldrValue ? Math.round((100 - z.ldrValue) * 0.8) + 10 : 50 }
        return { ...z, mode }
      }),
    )
  }, [])

  const setBrightness = useCallback((id: number, brightness: number) => {
    setZones((prev) =>
      prev.map((z) => (z.id === id ? { ...z, brightness } : z)),
    )
  }, [])

  return { zones, setMode, setBrightness }
}
