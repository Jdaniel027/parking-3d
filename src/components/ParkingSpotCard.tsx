import type { ParkingSpot } from '../types/parking'

type Props = {
  spot: ParkingSpot
  onClick: (id: number) => void
}

export default function ParkingSpotCard({ spot, onClick }: Props) {
  return (
    <button
      onClick={() => onClick(spot.id)}
      className={`
        flex items-center justify-center
        w-full aspect-square rounded-xl text-2xl font-bold
        transition-all duration-300 ease-in-out
        hover:scale-105 hover:shadow-lg
        ${spot.occupied
          ? 'bg-red-600 text-white shadow-red-500/40'
          : 'bg-emerald-500 text-white shadow-emerald-500/40'
        }
      `}
    >
      {spot.id}
    </button>
  )
}
