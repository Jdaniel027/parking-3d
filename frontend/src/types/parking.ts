export type ParkingSpot = {
  id: number
  occupied: boolean
  parkedAt: number | null
}

export type ParkingData = {
  spots: ParkingSpot[]
  available: number
  total: number
  totalEntries: number
  dailyEntries: number[]
}
