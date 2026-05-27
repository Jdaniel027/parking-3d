import { useLighting } from '../hooks/useLighting'
import LightingMap from '../components/LightingMap'
import LightingPanel from '../components/LightingPanel'
import LightingStats from '../components/LightingStats'

export default function ZonasIluminacion() {
  const { zones, selectedZone, selectedZoneId, stats, selectZone, setMode, setIntensity, toggleLamp, turnAllOn, turnAllOff } = useLighting()

  return (
    <div className="h-full flex flex-col gap-4">
      <div className="flex items-center gap-3 shrink-0">
        <svg viewBox="0 0 20 20" className="w-5 h-5 text-cyan-accent" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M10 2a6 6 0 00-4 10.3c1.2 1.2 1.8 2.7 1.8 3.7h4.4c0-1 .6-2.5 1.8-3.7A6 6 0 0010 2zM8.5 17h3M9.5 19h1" />
        </svg>
        <div>
          <h1 className="text-base font-bold text-forest">Zonas de Iluminación</h1>
          <p className="text-[11px] text-forest-muted">Control de intensidad y programación por zona</p>
        </div>
      </div>
      <div className="flex-1 flex gap-6 min-h-0">
        <div className="w-[55%] shrink-0 flex flex-col gap-4 min-h-0">
          <LightingMap zones={zones} selectedZoneId={selectedZoneId} onSelectZone={selectZone} onToggleLamp={toggleLamp} />
          <LightingStats stats={stats} />
        </div>
        <div className="flex-1 flex flex-col min-h-0">
          <LightingPanel zone={selectedZone} onSetMode={setMode} onSetIntensity={setIntensity} onTurnAllOn={turnAllOn} onTurnAllOff={turnAllOff} />
        </div>
      </div>
    </div>
  )
}
