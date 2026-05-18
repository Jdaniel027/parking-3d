import type { ParkingSpot } from '../types/dashboard'

type Props = {
  spot: ParkingSpot
  onClick: (id: number) => void
}

export default function ParkingSpotCard({ spot, onClick }: Props) {
  const idStr = String(spot.id).padStart(2, '0')

  return (
    <button
      onClick={() => onClick(spot.id)}
      className={`
        flex flex-col items-center justify-center gap-1
        w-full aspect-[3/2] rounded-xl text-xs font-bold
        transition-all duration-300 ease-in-out hover:scale-[1.03]
        ${spot.occupied
          ? 'bg-red-500/20 border border-red-500/50 text-red-400 shadow-[0_0_10px_rgba(239,68,68,0.25)]'
          : 'bg-emerald-500/15 border border-emerald-500/40 text-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.2)]'
        }
      `}
    >
      <span className="text-base">Cajón {idStr}</span>
      <span className={`text-[9px] font-medium ${spot.occupied ? 'text-red-400/70' : 'text-emerald-400/70'}`}>
        {spot.occupied ? 'Ocupado' : 'Disponible'}
      </span>
    </button>
  )
}
