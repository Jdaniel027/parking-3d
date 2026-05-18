import type { ParkingSpot } from "../types/dashboard";

type Props = {
  spot: ParkingSpot;
  onClick: (id: number) => void;
};

export default function ParkingSpotCard({ spot, onClick }: Props) {
  const idStr = String(spot.id).padStart(2, "0");

  return (
    <button
      onClick={() => onClick(spot.id)}
      className={`
        flex flex-col items-center justify-center gap-1
        w-full aspect-3/2 rounded-xl text-xs font-bold
        transition-all duration-300 ease-in-out hover:shadow-md hover:-translate-y-0.5
        border-2
        ${
          spot.occupied
            ? "bg-coral-soft/20 border-coral-soft"
            : "bg-lime-soft/15 border-lime-soft"
        }
      `}
    >
      <span className="text-base text-forest">Cajón {idStr}</span>
      <span className="text-[9px] font-medium text-forest">
        {spot.occupied ? "Ocupado" : "Disponible"}
      </span>
    </button>
  );
}
