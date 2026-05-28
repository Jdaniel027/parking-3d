import { useState } from 'react'
import { useTrafficLights } from '../hooks/useTrafficLights'
import TrafficMap from '../components/TrafficMap'
import TrafficPanel from '../components/TrafficPanel'

export default function ControlSemaforos() {
  const { lights, setMode, setActiveColor, setCycle, syncAllCycles, setAllEmergency, resetAllEmergency } = useTrafficLights()
  const [selectedId, setSelectedId] = useState<number | null>(null)
  const selected = lights.find((l) => l.id === selectedId) ?? null

  return (
    <div className="h-full flex flex-col gap-4">
      <div className="flex items-center gap-3 shrink-0">
        <svg viewBox="0 0 20 20" className="w-5 h-5 text-cyan-accent" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M7 2h6v16H7V2zm1 2v2h4V4H8zm0 4v2h4V8H8zm0 4v2h4v-2H8z" />
        </svg>
        <div>
          <h1 className="text-base font-bold text-forest">Control de Semáforos</h1>
          <p className="text-[11px] text-forest-muted">Gestión de tiempos y modos de operación</p>
        </div>
      </div>
      <div className="flex-1 flex gap-6 min-h-0">
        <div className="w-[55%] shrink-0 flex flex-col min-h-0">
          <TrafficMap lights={lights} selectedId={selectedId} onSelect={setSelectedId} />
        </div>
        <div className="flex-1 flex flex-col min-h-0">
          <TrafficPanel
            light={selected}
            onSetMode={setMode}
            onSetColor={setActiveColor}
            onSetCycle={setCycle}
            onSyncAll={syncAllCycles}
            onEmergencyAll={setAllEmergency}
            onResetEmergency={resetAllEmergency}
          />
        </div>
      </div>
    </div>
  )
}
