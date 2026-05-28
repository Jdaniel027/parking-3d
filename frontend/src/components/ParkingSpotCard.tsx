import type { ParkingSpot } from "../types/dashboard";

type Props = { spot: ParkingSpot; onClick: (id: number) => void };

export default function ParkingSpotCard({ spot, onClick }: Props) {
  const occ = spot.occupied;
  return (
    <button onClick={() => onClick(spot.id)}
      className={`flex flex-col items-center justify-center gap-1 w-full h-auto py-3 px-2 rounded-xl text-xs font-bold
        transition-all duration-300 ease-in-out border
        ${occ ? "bg-coral-soft/10 border-coral-soft/30 hover:bg-coral-soft/20 hover:border-coral-soft/50" : "bg-lime-soft/10 border-lime-soft/30 hover:bg-lime-soft/20 hover:border-lime-soft/50"}`}>
      <div className={`w-5 h-5 rounded-full flex items-center justify-center text-white text-[10px] font-bold ${occ ? "bg-coral-soft" : "bg-lime-soft"}`}>
        {spot.id}
      </div>
      <span className="text-[10px] font-medium text-forest mt-0.5">{occ ? "Ocupado" : "Libre"}</span>
    </button>
  );
}
