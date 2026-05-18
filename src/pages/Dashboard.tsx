import { useParkingData } from '../hooks/useParkingData'
import ParkingGrid from '../components/ParkingGrid'

export default function Dashboard() {
  const { spots, available, total, toggleSpot } = useParkingData()

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center p-6 gap-8">
      <h1 className="text-3xl font-bold tracking-tight mt-4">
        Estacionamiento
      </h1>

      <div className="text-lg text-gray-300">
        <span className="text-emerald-400 font-semibold">{available}</span>
        {' '}de{' '}
        <span className="text-white font-semibold">{total}</span>
        {' '}libres
      </div>

      <ParkingGrid spots={spots} onToggle={toggleSpot} />

      <button
        onClick={() => alert('Pluma abierta (demo)')}
        className="
          mt-4 px-8 py-3 rounded-xl font-semibold text-lg
          bg-indigo-600 hover:bg-indigo-500
          transition-all duration-200
          active:scale-95
        "
      >
        Abrir pluma
      </button>
    </div>
  )
}
