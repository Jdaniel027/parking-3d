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
      <div className="flex-1 flex gap-6 min-h-0">
        <div className="flex-1 flex flex-col min-h-0">
          <TrafficMap
            lights={lights}
            selectedId={selectedId}
            onSelect={setSelectedId}
          />
        </div>
        <div className="min-w-80 min-h-0">
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
