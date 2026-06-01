import { useState, useEffect, useCallback } from 'react'
import type { TrafficLight, TrafficLightMode, LightColor, TrafficCycle } from '../types/dashboard'
import { DEFAULT_CYCLE } from '../types/dashboard'

const NAMES = ['Norte', 'Sur', 'Este', 'Oeste']

const pairIds = (id: number) =>
  id <= 2 ? [1, 2] : [3, 4]

type Phase = 'ns-green' | 'ns-yellow' | 'eo-green' | 'eo-yellow'

function phaseDuration(phase: Phase, c: TrafficCycle): number {
  switch (phase) {
    case 'ns-green': return c.verde * 1000
    case 'ns-yellow': return c.amarillo * 1000
    case 'eo-green': return c.rojo * 1000
    case 'eo-yellow': return c.amarillo * 1000
  }
}

function nextPhase(p: Phase): Phase {
  const order: Phase[] = ['ns-green', 'ns-yellow', 'eo-green', 'eo-yellow']
  return order[(order.indexOf(p) + 1) % order.length]
}

function applyPhase(lights: TrafficLight[], phase: Phase): TrafficLight[] {
  const nsGreen = phase === 'ns-green'
  const nsYellow = phase === 'ns-yellow'
  const eoGreen = phase === 'eo-green'
  const eoYellow = phase === 'eo-yellow'
  return lights.map((t) => {
    if (t.mode !== 'automatic') return t
    const inNS = t.id <= 2
    if (inNS && nsGreen) return { ...t, activeColor: 'green' }
    if (inNS && nsYellow) return { ...t, activeColor: 'yellow' }
    if (inNS && (eoGreen || eoYellow)) return { ...t, activeColor: 'red' }
    if (!inNS && eoGreen) return { ...t, activeColor: 'green' }
    if (!inNS && eoYellow) return { ...t, activeColor: 'yellow' }
    if (!inNS && (nsGreen || nsYellow)) return { ...t, activeColor: 'red' }
    return t
  })
}

function detectPhase(lights: TrafficLight[]): Phase {
  const ns = lights[0]
  const eo = lights[2]
  if (!ns || !eo) return 'ns-green'
  if (ns.activeColor === 'green') return 'ns-green'
  if (ns.activeColor === 'yellow') return 'ns-yellow'
  if (eo.activeColor === 'green') return 'eo-green'
  return 'eo-yellow'
}

function createInitial(): TrafficLight[] {
  return NAMES.map((name, i) => ({
    id: i + 1,
    name,
    mode: 'automatic' as TrafficLightMode,
    activeColor: i <= 1 ? 'green' as LightColor : 'red' as LightColor,
    cycle: { ...DEFAULT_CYCLE },
  }))
}

export function useTrafficLights() {
  const [lights, setLights] = useState<TrafficLight[]>(createInitial)

  useEffect(() => {
    const auto = lights.filter((l) => l.mode === 'automatic')
    if (auto.length === 0) return

    const phase = detectPhase(lights)
    const dur = phaseDuration(phase, lights[0].cycle)

    const id = setTimeout(() => {
      setLights((prev) => {
        const autoLights = prev.filter((l) => l.mode === 'automatic')
        if (autoLights.length === 0) return prev
        const next = nextPhase(detectPhase(prev))
        return applyPhase(prev, next)
      })
    }, dur)

    return () => clearTimeout(id)
  }, [lights])

  const setMode = useCallback((id: number, mode: TrafficLightMode) => {
    const ids = pairIds(id)
    setLights((prev) => {
      if (mode === 'emergency') {
        return prev.map((t) => ({ ...t, mode: 'emergency', activeColor: 'red' as LightColor }))
      }
      if (mode === 'automatic') {
        const phase = detectPhase(prev)
        const inNS = ids[0] <= 2
        const nsGreen = phase === 'ns-green'
        const nsYellow = phase === 'ns-yellow'
        const eoGreen = phase === 'eo-green'
        const eoYellow = phase === 'eo-yellow'
        let color: LightColor
        if (inNS && nsGreen) color = 'green'
        else if (inNS && nsYellow) color = 'yellow'
        else if (inNS && (eoGreen || eoYellow)) color = 'red'
        else if (!inNS && eoGreen) color = 'green'
        else if (!inNS && eoYellow) color = 'yellow'
        else color = 'red'
        return prev.map((t) => (ids.includes(t.id) ? { ...t, mode, activeColor: color } : t))
      }
      return prev.map((t) => (ids.includes(t.id) ? { ...t, mode, activeColor: 'red' } : t))
    })
  }, [])

  const setActiveColor = useCallback((id: number, color: LightColor) => {
    const ids = pairIds(id)
    setLights((prev) =>
      prev.map((t) => (ids.includes(t.id) ? { ...t, activeColor: color } : t)),
    )
  }, [])

  const setCycle = useCallback((id: number, cycle: TrafficCycle) => {
    setLights((prev) => prev.map((t) => ({ ...t, cycle })))
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
      prev.map((t) => ({ ...t, mode: 'emergency', activeColor: 'red' as LightColor })),
    )
  }, [])

  const resetAllEmergency = useCallback(() => {
    setLights((prev) =>
      prev.map((t) => {
        if (t.mode !== 'emergency') return t
        const inNS = t.id <= 2
        return { ...t, mode: 'automatic', activeColor: inNS ? 'green' as LightColor : 'red' as LightColor }
      }),
    )
  }, [])

  return { lights, setMode, setActiveColor, setCycle, syncAllCycles, setAllEmergency, resetAllEmergency }
}
