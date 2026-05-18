export type TrafficLightMode = 'automatic' | 'manual' | 'emergency'
export type LightColor = 'green' | 'yellow' | 'red'

export interface TrafficLight {
  id: number
  name: string
  mode: TrafficLightMode
  activeColor: LightColor
}

export type LightingMode = 'eco' | 'manual' | 'cutoff'

export interface LightingZone {
  id: number
  name: string
  mode: LightingMode
  brightness: number
  ldrValue: number
}

export type ParkingSpot = {
  id: number
  occupied: boolean
}

export type View = 'mapa' | 'semaforos' | 'iluminacion'
