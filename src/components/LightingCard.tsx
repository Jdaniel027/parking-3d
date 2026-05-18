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
    <div className={`bg-white/[0.04] backdrop-blur-md border border-white/[0.06] rounded-2xl p-5
      transition-all duration-300 hover:border-white/[0.12] ${isCutoff ? 'opacity-40' : ''}`}
    >
      <div className="flex items-center justify-between mb-3">
        <div>
          <span className="text-sm font-semibold text-white/80">{zone.name}</span>
          <div className="text-[10px] text-white/50 mt-0.5">
            Luz Ambiental LDR: <span className="text-cyan-400 font-medium">{zone.ldrValue}%</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className={`text-lg font-bold ${isCutoff ? 'text-red-400' : 'text-emerald-400'}`}>
            {zone.brightness}%
          </span>
          {isCutoff && <span className="text-lg text-red-400">⛔</span>}
        </div>
      </div>

      <div className="flex rounded-lg overflow-hidden w-full text-[10px] font-medium mb-3">
        {(['eco', 'manual', 'cutoff'] as const).map((m) => {
          const labels: Record<string, string> = { eco: 'MODO ECO', manual: 'MANUAL', cutoff: 'CORTE DE LUZ' }
          const activeColors: Record<string, string> = {
            eco: 'bg-emerald-500/30 text-emerald-300 border-emerald-500/50',
            manual: 'bg-cyan-500/30 text-cyan-300 border-cyan-500/50',
            cutoff: 'bg-red-500/30 text-red-300 border-red-500/50',
          }
          const inactive = 'text-white/40 border-white/10'
          return (
            <button
              key={m}
              onClick={() => onSetMode(zone.id, m)}
              className={`flex-1 py-1.5 border transition-all duration-200 ${zone.mode === m ? activeColors[m] : inactive}`}
            >
              {labels[m]}
            </button>
          )
        })}
      </div>

      {isEco && (
        <div className="text-center text-[10px] text-emerald-400/80 bg-emerald-500/10 rounded-lg py-2">
          Controlado por Fotorresistencia
        </div>
      )}

      {zone.mode === 'manual' && (
        <div className="flex items-center gap-2">
          <span className="text-[10px] text-white/40">0%</span>
          <input
            type="range"
            min={0}
            max={100}
            value={zone.brightness}
            onChange={(e) => onSetBrightness(zone.id, Number(e.target.value))}
            className="flex-1 h-1.5 rounded-full appearance-none cursor-pointer
              bg-white/10 accent-cyan-400
              [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3
              [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-cyan-400
              [&::-webkit-slider-thumb]:shadow-[0_0_6px_rgba(34,211,238,0.6)]"
          />
          <span className="text-[10px] text-white/40">100%</span>
        </div>
      )}

      {isCutoff && (
        <div className="text-center text-[10px] text-red-400/80 bg-red-500/15 border border-red-500/30 rounded-lg py-2 font-semibold tracking-wide">
          CORTE DE ENERGÍA ACTIVO
        </div>
      )}
    </div>
  )
}
