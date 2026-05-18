import type { ParkingSpot } from '../types/parking'
import ParkingSpotCard from './ParkingSpotCard'

type Props = {
  spots: ParkingSpot[]
  onToggle: (id: number) => void
}

export default function ParkingGrid({ spots, onToggle }: Props) {
  return (
    <div className="grid grid-cols-5 gap-4 w-full max-w-2xl mx-auto">
      {spots.map((spot) => (
        <ParkingSpotCard key={spot.id} spot={spot} onClick={onToggle} />
      ))}
    </div>
  )
}
