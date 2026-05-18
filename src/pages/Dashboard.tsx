import { useState } from 'react'
import { useTrafficLights } from '../hooks/useTrafficLights'
import { useLightingZones } from '../hooks/useLightingZones'
import { useParkingData } from '../hooks/useParkingData'
import Sidebar from '../components/Sidebar'
import TrafficLightSection from '../components/TrafficLightSection'
import LightingSection from '../components/LightingSection'
import ParkingSpotCard from '../components/ParkingSpotCard'
import CameraPlaceholder from '../components/CameraPlaceholder'
import type { View } from '../types/dashboard'

const views: { id: View; label: string }[] = [
  { id: 'mapa', label: 'Mapa de Cajones' },
  { id: 'semaforos', label: 'Control de Semáforos' },
  { id: 'iluminacion', label: 'Zonas de Iluminación' },
]

export default function Dashboard() {
  const [activeView, setActiveView] = useState<View>('mapa')
  const { lights, setMode, setActiveColor } = useTrafficLights()
  const { zones, setMode: setZoneMode, setBrightness } = useLightingZones()
  const { spots, available, total, toggleSpot } = useParkingData()

  const handleNavigate = (id: string) => {
    setActiveView(id as View)
  }

  return (
    <div className="min-h-screen bg-[#121214] text-white">
      <Sidebar activeView={activeView} onNavigate={handleNavigate} />

      <div className="ml-20 p-5 min-h-screen">
        <header className="mb-5">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-bold tracking-tight text-white/90">
                Estacionamiento Inteligente
              </h1>
              <p className="text-xs text-white/40 mt-1">Sistema de monitoreo y control — Prototipo</p>
            </div>
            <div className="flex gap-1 bg-white/[0.04] rounded-lg p-1">
              {views.map((v) => (
                <button
                  key={v.id}
                  onClick={() => handleNavigate(v.id)}
                  className={`px-3 py-1.5 rounded-md text-[11px] font-medium transition-all duration-200
                    ${activeView === v.id
                      ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30'
                      : 'text-white/40 hover:text-white/70 border border-transparent'}`}
                >
                  {v.label}
                </button>
              ))}
            </div>
          </div>
        </header>

        <div className="transition-all duration-300">
          {activeView === 'mapa' && (
            <div className="grid grid-cols-2 gap-6">
              <div>
                <h2 className="text-sm font-semibold text-white/90 mb-3 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-cyan-400" />
                  Monitoreo Visual
                </h2>
                <CameraPlaceholder />
              </div>
              <div>
                <h2 className="text-sm font-semibold text-white/90 mb-3 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-400" />
                  Estado del Estacionamiento
                </h2>
                <div className="bg-white/[0.04] backdrop-blur-md border border-white/[0.06] rounded-2xl p-5">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xs text-white/50">
                      <span className="text-emerald-400 font-semibold">{available}</span> disponibles de{' '}
                      <span className="text-white/80 font-semibold">{total}</span>
                    </span>
                    <div className="flex gap-3 text-[10px]">
                      <span className="flex items-center gap-1 text-emerald-400">
                        <span className="w-2 h-2 rounded-full bg-emerald-500" /> Libre
                      </span>
                      <span className="flex items-center gap-1 text-red-400">
                        <span className="w-2 h-2 rounded-full bg-red-500" /> Ocupado
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
          )}

          {activeView === 'semaforos' && (
            <TrafficLightSection
              lights={lights}
              onSetMode={setMode}
              onSetColor={setActiveColor}
            />
          )}

          {activeView === 'iluminacion' && (
            <div className="max-w-4xl mx-auto">
              <LightingSection
                zones={zones}
                onSetMode={setZoneMode}
                onSetBrightness={setBrightness}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
