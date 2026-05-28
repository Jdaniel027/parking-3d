import { useState } from 'react'
import type { ComponentType } from 'react'
import Sidebar from '../components/Sidebar'
import MapaCajones from './MapaCajones'
import ControlSemaforos from './ControlSemaforos'
import ZonasIluminacion from './ZonasIluminacion'
import type { View } from '../types/dashboard'

const VIEWS: { id: View; label: string }[] = [
  { id: 'mapa', label: 'Mapa de Cajones' },
  { id: 'semaforos', label: 'Control de Semáforos' },
  { id: 'iluminacion', label: 'Zonas de Iluminación' },
]

const PAGES: Record<View, ComponentType> = {
  mapa: MapaCajones,
  semaforos: ControlSemaforos,
  iluminacion: ZonasIluminacion,
}

export default function Dashboard() {
  const [activeView, setActiveView] = useState<View>('mapa')
  const Page = PAGES[activeView]

  return (
    <div className="min-h-screen bg-slate-50">
      <Sidebar activeView={activeView} onNavigate={(id) => setActiveView(id as View)} />
      <div className="ml-16 p-5 min-h-screen">
        <div className="transition-all duration-300" key={activeView}>
          <Page />
        </div>
      </div>
    </div>
  )
}
