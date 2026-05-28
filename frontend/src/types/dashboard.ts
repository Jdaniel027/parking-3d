export type TrafficLightMode = 'automatic' | 'manual' | 'emergency'
export type LightColor = 'green' | 'yellow' | 'red'

export interface TrafficCycle {
  verde: number
  amarillo: number
  rojo: number
}

export interface TrafficLight {
  id: number
  name: string
  mode: TrafficLightMode
  activeColor: LightColor
  cycle: TrafficCycle
}

export const DEFAULT_CYCLE: TrafficCycle = { verde: 4, amarillo: 2, rojo: 4 }

export type LightingMode = 'eco' | 'manual' | 'apagado'

export interface Lamp {
  id: number
  zoneId: number
  isOn: boolean
}

export interface LightingZone {
  id: number
  name: string
  mode: LightingMode
  intensity: number
  ldrValue: number
  lamps: Lamp[]
  scheduleEnabled: boolean
  scheduleStart: string
  scheduleEnd: string
  scheduleDays: boolean[]
  controllerNode: string
  firmware: string
  connected: boolean
  activationDelay: number
  lastUpdated: string
}

export interface LightingStats {
  totalLamps: number
  lampsOn: number
  avgIntensity: number
  totalConsumption: number
}

export type ParkingSpot = {
  id: number
  occupied: boolean
}

export type View = 'mapa' | 'semaforos' | 'iluminacion'
