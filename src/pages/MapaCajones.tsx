import { useParkingData } from '../hooks/useParkingData'
import ParkingSpotCard from '../components/ParkingSpotCard'
import CameraPlaceholder from '../components/CameraPlaceholder'

export default function MapaCajones() {
  const { spots, available, total, toggleSpot } = useParkingData()

  return (
    <div className="grid grid-cols-2 gap-6">
      <div>
        <h2 className="text-sm font-semibold text-forest mb-3 flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-cyan-accent" />
          Monitoreo Visual
        </h2>
        <CameraPlaceholder />
      </div>

      <div>
        <h2 className="text-sm font-semibold text-forest mb-3 flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-lime-soft" />
          Estado del Estacionamiento
        </h2>
        <div className="bg-white border border-gray-200 rounded-xl p-5">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs text-forest-muted">
              <span className="text-forest font-semibold">{available}</span> disponibles de{' '}
              <span className="text-forest font-semibold">{total}</span>
            </span>
            <div className="flex gap-3 text-[10px]">
              <span className="flex items-center gap-1 text-forest">
                <span className="w-2 h-2 rounded-full bg-lime-soft" /> Libre
              </span>
              <span className="flex items-center gap-1 text-forest">
                <span className="w-2 h-2 rounded-full bg-coral-soft" /> Ocupado
              </span>
            </div>
          </div>
          <div className="grid grid-cols-5 gap-2.5">
            {spots.map((spot) => (
              <ParkingSpotCard key={spot.id} spot={spot} onClick={toggleSpot} />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
