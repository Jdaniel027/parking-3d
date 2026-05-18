import { useState, useEffect, useCallback } from 'react'
import type { TrafficLight, TrafficLightMode, LightColor, TrafficCycle } from '../types/dashboard'
import { DEFAULT_CYCLE } from '../types/dashboard'

const NAMES = ['Norte', 'Sur', 'Este', 'Oeste']
const CYCLE: LightColor[] = ['green', 'yellow', 'red']

const getNextColor = (c: LightColor): LightColor => {
  const idx = CYCLE.indexOf(c)
  return CYCLE[(idx + 1) % CYCLE.length]
}

function getDuration(light: TrafficLight): number {
  switch (light.activeColor) {
    case 'green':
      return light.cycle.verde * 1000
    case 'yellow':
      return light.cycle.amarillo * 1000
    case 'red':
      return light.cycle.rojo * 1000
  }
}

function createInitial(): TrafficLight[] {
  return NAMES.map((name, i) => ({
    id: i + 1,
    name,
    mode: 'automatic' as TrafficLightMode,
    activeColor: 'green' as LightColor,
    cycle: { ...DEFAULT_CYCLE },
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
      }, getDuration(l))
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

  const setCycle = useCallback((id: number, cycle: TrafficCycle) => {
    setLights((prev) =>
      prev.map((t) => (t.id === id ? { ...t, cycle } : t)),
    )
  }, [])

  const syncAllCycles = useCallback((sourceId: number) => {
    setLights((prev) => {
      const source = prev.find((t) => t.id === sourceId)
      if (!source) return prev
      return prev.map((t) => ({ ...t, cycle: { ...source.cycle } }))
    })
  }, [])

  const setAllEmergency = useCallback(() => {
    setLights((prev) =>
      prev.map((t) => ({ ...t, mode: 'emergency' as TrafficLightMode, activeColor: 'red' as LightColor })),
    )
  }, [])

  const resetAllEmergency = useCallback(() => {
    setLights((prev) =>
      prev.map((t) =>
        t.mode === 'emergency' ? { ...t, mode: 'automatic' as TrafficLightMode } : t,
      ),
    )
  }, [])

  return { lights, setMode, setActiveColor, setCycle, syncAllCycles, setAllEmergency, resetAllEmergency }
}
