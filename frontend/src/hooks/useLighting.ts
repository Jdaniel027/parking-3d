import { useState, useCallback, useMemo } from 'react'
import type { Lamp, LightingMode, LightingZone, LightingStats } from '../types/dashboard'

function buildLamps(zoneId: number, count: number): Lamp[] {
  return Array.from({ length: count }, (_, i) => ({
    id: zoneId === 1 ? i + 1 : 8 + i + 1,
    zoneId,
    isOn: true,
  }))
}

function createZones(): LightingZone[] {
  const now = new Date().toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit', second: '2-digit' })
  return [
    {
      id: 1,
      name: 'Zona Este',
      mode: 'eco',
      intensity: 65,
      ldrValue: 48,
      lamps: buildLamps(1, 8),
      scheduleEnabled: true,
      scheduleStart: '18:00',
      scheduleEnd: '06:00',
      scheduleDays: [true, true, true, true, true, false, false],
      controllerNode: 'Nodo-01',
      firmware: 'v2.3.1',
      connected: true,
      activationDelay: 2,
      lastUpdated: now,
    },
    {
      id: 2,
      name: 'Zona Oeste',
      mode: 'manual',
      intensity: 72,
      ldrValue: 52,
      lamps: buildLamps(2, 8),
      scheduleEnabled: false,
      scheduleStart: '18:00',
      scheduleEnd: '06:00',
      scheduleDays: [true, true, true, true, true, true, false],
      controllerNode: 'Nodo-02',
      firmware: 'v2.3.1',
      connected: true,
      activationDelay: 3,
      lastUpdated: now,
    },
  ]
}

export function useLighting() {
  const [zones, setZones] = useState<LightingZone[]>(createZones)
  const [selectedZoneId, setSelectedZoneId] = useState<number | null>(null)

  const selectedZone = zones.find((z) => z.id === selectedZoneId) ?? null

  const setMode = useCallback((zoneId: number, mode: LightingMode) => {
    setZones((prev) =>
      prev.map((z) => {
        if (z.id !== zoneId) return z
        const isOff = mode === 'apagado'
        return {
          ...z,
          mode,
          lamps: z.lamps.map((l) => ({ ...l, isOn: !isOff })),
          lastUpdated: new Date().toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
        }
      }),
    )
  }, [])

  const setIntensity = useCallback((zoneId: number, intensity: number) => {
    setZones((prev) =>
      prev.map((z) =>
        z.id === zoneId
          ? { ...z, intensity, lastUpdated: new Date().toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit', second: '2-digit' }) }
          : z,
      ),
    )
  }, [])

  const toggleLamp = useCallback((_zoneId: number, lampId: number) => {
    setZones((prev) =>
      prev.map((z) => ({
        ...z,
        lamps: z.lamps.map((l) => (l.id === lampId ? { ...l, isOn: !l.isOn } : l)),
      })),
    )
  }, [])

  const turnAllOn = useCallback((zoneId: number) => {
    setZones((prev) =>
      prev.map((z) =>
        z.id === zoneId
          ? { ...z, lamps: z.lamps.map((l) => ({ ...l, isOn: true })), mode: z.mode === 'apagado' ? 'manual' : z.mode, lastUpdated: new Date().toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit', second: '2-digit' }) }
          : z,
      ),
    )
  }, [])

  const turnAllOff = useCallback((zoneId: number) => {
    setZones((prev) =>
      prev.map((z) =>
        z.id === zoneId
          ? { ...z, lamps: z.lamps.map((l) => ({ ...l, isOn: false })), lastUpdated: new Date().toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit', second: '2-digit' }) }
          : z,
      ),
    )
  }, [])

  const stats = useMemo<LightingStats>(() => {
    let lampsOn = 0
    let totalIntensity = 0
    for (const z of zones) {
      lampsOn += z.lamps.filter((l) => l.isOn).length
      totalIntensity += z.intensity
    }
    return {
      totalLamps: 16,
      lampsOn,
      avgIntensity: Math.round(totalIntensity / zones.length),
      totalConsumption: lampsOn * 15,
    }
  }, [zones])

  return {
    zones,
    selectedZone,
    selectedZoneId,
    stats,
    selectZone: setSelectedZoneId,
    setMode,
    setIntensity,
    toggleLamp,
    turnAllOn,
    turnAllOff,
  }
}
