export type ParkingSpot = {
  id: number
  occupied: boolean
}

export type ParkingData = {
  spots: ParkingSpot[]
  available: number
  total: number
}
