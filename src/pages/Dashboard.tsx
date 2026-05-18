import { useState } from 'react'
import type { ComponentType } from 'react'
import Sidebar from '../components/Sidebar'
import MapaCajones from './MapaCajones'
import ControlSemaforos from './ControlSemaforos'
import ZonasIluminacion from './ZonasIluminacion'
import type { View } from '../types/dashboard'

const views: { id: View; label: string }[] = [
  { id: 'mapa', label: 'Mapa de Cajones' },
  { id: 'semaforos', label: 'Control de Semáforos' },
  { id: 'iluminacion', label: 'Zonas de Iluminación' },
]

const pages: Record<View, ComponentType> = {
  mapa: MapaCajones,
  semaforos: ControlSemaforos,
  iluminacion: ZonasIluminacion,
}

export default function Dashboard() {
  const [activeView, setActiveView] = useState<View>('mapa')
  const Page = pages[activeView]

  return (
    <div className="min-h-screen bg-white">
      <Sidebar activeView={activeView} onNavigate={(id) => setActiveView(id as View)} />

      <div className="ml-20 p-5 min-h-screen">
        <header className="mb-5">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-bold tracking-tight text-forest">
                Estacionamiento Inteligente
              </h1>
              <p className="text-xs text-forest-muted mt-0.5">Sistema de monitoreo y control — Prototipo</p>
            </div>
            <div className="flex gap-1 rounded-lg p-1 bg-gray-100">
              {views.map((v) => (
                <button
                  key={v.id}
                  onClick={() => setActiveView(v.id)}
                  className={`px-3 py-1.5 rounded-md text-[11px] font-medium transition-all duration-200
                    ${activeView === v.id
                      ? 'bg-cyan-accent text-white'
                      : 'text-forest hover:bg-gray-200'}`}
                >
                  {v.label}
                </button>
              ))}
            </div>
          </div>
        </header>

        <div className="transition-all duration-300" key={activeView}>
          <Page />
        </div>
      </div>
    </div>
  )
}
