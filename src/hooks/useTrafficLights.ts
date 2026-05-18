import { useState, useEffect, useCallback } from 'react'
import type { TrafficLight, TrafficLightMode, LightColor } from '../types/dashboard'

const COUNT = 5
const CYCLE: LightColor[] = ['green', 'yellow', 'red']
const DURATIONS: Record<LightColor, number> = { green: 4000, yellow: 2000, red: 4000 }

const getNextColor = (c: LightColor): LightColor => {
  const idx = CYCLE.indexOf(c)
  return CYCLE[(idx + 1) % CYCLE.length]
}

function createInitial(): TrafficLight[] {
  return Array.from({ length: COUNT }, (_, i) => ({
    id: i + 1,
    mode: 'automatic' as TrafficLightMode,
    activeColor: 'green' as LightColor,
  }))
}

export function useTrafficLights() {
  const [lights, setLights] = useState<TrafficLight[]>(createInitial)

  useEffect(() => {
    const timeouts: ReturnType<typeof setTimeout>[] = []
    for (const l of lights) {
      if (l.mode !== 'automatic') continue
      const timeout = setTimeout(() => {
        setLights((prev) =>
          prev.map((t) =>
            t.id !== l.id || t.mode !== 'automatic'
              ? t
              : { ...t, activeColor: getNextColor(t.activeColor) },
          ),
        )
      }, DURATIONS[l.activeColor])
      timeouts.push(timeout)
    }
    return () => timeouts.forEach(clearTimeout)
  }, [lights])

  const setMode = useCallback((id: number, mode: TrafficLightMode) => {
    setLights((prev) =>
      prev.map((t) => {
        if (t.id !== id) return t
        if (mode === 'emergency') return { ...t, mode, activeColor: 'red' as LightColor }
        return { ...t, mode }
      }),
    )
  }, [])

  const setActiveColor = useCallback((id: number, color: LightColor) => {
    setLights((prev) =>
      prev.map((t) => (t.id === id ? { ...t, activeColor: color } : t)),
    )
  }, [])

  return { lights, setMode, setActiveColor }
}
