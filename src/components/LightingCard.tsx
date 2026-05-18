import type { LightingZone, LightingMode } from '../types/dashboard'

type Props = {
  zone: LightingZone
  onSetMode: (id: number, mode: LightingMode) => void
  onSetBrightness: (id: number, value: number) => void
}

export default function LightingCard({ zone, onSetMode, onSetBrightness }: Props) {
  const isCutoff = zone.mode === 'cutoff'
  const isEco = zone.mode === 'eco'

  return (
    <div className={`bg-white border border-gray-200 rounded-xl p-5
      transition-all duration-300 hover:shadow-md ${isCutoff ? 'opacity-60' : ''}`}
    >
      <div className="flex items-center justify-between mb-3">
        <div>
          <span className="text-sm font-semibold text-forest">{zone.name}</span>
          <div className="text-[10px] text-forest-muted mt-0.5">
            Luz Ambiental LDR: <span className="text-cyan-accent font-medium">{zone.ldrValue}%</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className={`text-lg font-bold ${isCutoff ? 'text-coral-soft' : 'text-lime-soft'}`}>
            {zone.brightness}%
          </span>
        </div>
      </div>

      <div className="flex rounded-lg overflow-hidden w-full text-[10px] font-medium border border-gray-200 mb-3">
        {(['eco', 'manual', 'cutoff'] as const).map((m) => {
          const labels: Record<string, string> = { eco: 'MODO ECO', manual: 'MANUAL', cutoff: 'CORTE DE LUZ' }
          const activeColors: Record<string, string> = {
            eco: 'bg-lime-soft/15 text-forest',
            manual: 'bg-cyan-accent/10 text-forest',
            cutoff: 'bg-coral-soft/15 text-forest',
          }
          const inactive = 'text-gray-400 hover:text-forest'
          return (
            <button
              key={m}
              onClick={() => onSetMode(zone.id, m)}
              className={`flex-1 py-1.5 border-r last:border-r-0 transition-all duration-200 ${zone.mode === m ? activeColors[m] : inactive}`}
            >
              {labels[m]}
            </button>
          )
        })}
      </div>

      {isEco && (
        <div className="text-center text-[10px] text-forest-muted bg-lime-soft/10 rounded-lg py-2">
          Controlado por Fotorresistencia
        </div>
      )}

      {zone.mode === 'manual' && (
        <div className="flex items-center gap-2">
          <span className="text-[10px] text-gray-400">0%</span>
          <input
            type="range"
            min={0}
            max={100}
            value={zone.brightness}
            onChange={(e) => onSetBrightness(zone.id, Number(e.target.value))}
            className="flex-1 h-1.5 rounded-full appearance-none cursor-pointer
              bg-gray-200 accent-lime-soft
              [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3
              [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-lime-soft
              [&::-webkit-slider-thumb]:shadow-[0_0_4px_rgba(132,196,22,0.5)]"
          />
          <span className="text-[10px] text-gray-400">100%</span>
        </div>
      )}

      {isCutoff && (
        <div className="text-center text-[10px] text-coral-soft bg-coral-soft/10 border border-coral-soft/20 rounded-lg py-2 font-semibold tracking-wide">
          CORTE DE ENERGÍA ACTIVO
        </div>
      )}
    </div>
  )
}
