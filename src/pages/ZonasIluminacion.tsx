import { useLighting } from '../hooks/useLighting'
import LightingMap from '../components/LightingMap'
import LightingPanel from '../components/LightingPanel'
import LightingStats from '../components/LightingStats'

export default function ZonasIluminacion() {
  const {
    zones, selectedZone, selectedZoneId, stats,
    selectZone, setMode, setIntensity, toggleLamp,
    turnAllOn, turnAllOff,
  } = useLighting()

  return (
    <div className="h-full flex flex-col gap-4">
      <div className="flex-1 flex gap-6 min-h-0">
        <div className="flex-1 flex flex-col gap-4 min-h-0">
          <LightingMap
            zones={zones}
            selectedZoneId={selectedZoneId}
            onSelectZone={selectZone}
            onToggleLamp={toggleLamp}
          />
          <LightingStats stats={stats} />
        </div>
        <div className="min-w-80 min-h-0">
          <LightingPanel
            zone={selectedZone}
            onSetMode={setMode}
            onSetIntensity={setIntensity}
            onTurnAllOn={turnAllOn}
            onTurnAllOff={turnAllOff}
          />
        </div>
      </div>
    </div>
  )
}
