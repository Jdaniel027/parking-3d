import type { TrafficLight, LightColor, TrafficCycle } from '../types/dashboard'
import TrafficCycleConfig from './TrafficCycleConfig'
import TrafficActions from './TrafficActions'
import TrafficInfo from './TrafficInfo'

type Props = {
  light: TrafficLight | null
  onSetMode: (id: number, mode: TrafficLight['mode']) => void
  onSetColor: (id: number, color: LightColor) => void
  onSetCycle: (id: number, cycle: TrafficCycle) => void
  onSyncAll: (sourceId: number) => void
  onEmergencyAll: () => void
  onResetEmergency: () => void
}

const modeLabels: Record<string, string> = {
  automatic: 'Automático',
  manual: 'Manual',
  emergency: 'Emergencia',
}

const modeColors: Record<string, string> = {
  automatic: 'text-lime-soft',
  manual: 'text-cyan-accent',
  emergency: 'text-coral-soft',
}

export default function TrafficPanel({ light, onSetMode, onSetColor, onSetCycle, onSyncAll, onEmergencyAll, onResetEmergency }: Props) {
  if (!light) {
    return (
      <div className="bg-white border border-gray-200 rounded-xl p-5 w-80 flex flex-col items-center justify-center text-center gap-3">
        <span className="text-3xl text-gray-300">☝</span>
        <span className="text-xs text-gray-400">
          Selecciona un semáforo en el croquis para controlarlo
        </span>
      </div>
    )
  }

  const isManual = light.mode === 'manual'
  const isEmergency = light.mode === 'emergency'

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-5 w-80 flex flex-col gap-4">
      <div>
        <h3 className="text-base font-bold text-forest">{light.name}</h3>
      </div>

      <div className="flex flex-col items-center gap-1 py-2 bg-gray-50 rounded-lg">
        <span className={`text-xs font-semibold ${modeColors[light.mode]}`}>
          {light.activeColor === 'green' ? 'Verde' : light.activeColor === 'yellow' ? 'Amarillo' : 'Rojo'}
        </span>
        <div className="flex gap-2">
          <div className={`w-4 h-4 rounded-full transition-all duration-300 ${light.activeColor === 'red' ? 'bg-coral-soft shadow-[0_0_6px_rgba(251,113,133,0.5)]' : 'bg-gray-200'}`} />
          <div className={`w-4 h-4 rounded-full transition-all duration-300 ${light.activeColor === 'yellow' ? 'bg-amber-400 shadow-[0_0_6px_rgba(251,191,36,0.5)]' : 'bg-gray-200'}`} />
          <div className={`w-4 h-4 rounded-full transition-all duration-300 ${light.activeColor === 'green' ? 'bg-lime-soft shadow-[0_0_6px_rgba(132,196,22,0.5)]' : 'bg-gray-200'}`} />
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <span className="text-[10px] text-gray-400 uppercase tracking-wide">Modo</span>
        <div className="flex rounded-lg overflow-hidden text-[11px] font-medium border border-gray-200">
          {(['automatic', 'manual', 'emergency'] as const).map((m) => (
            <button
              key={m}
              onClick={() => onSetMode(light.id, m)}
              className={`flex-1 py-1.5 border-r last:border-r-0 transition-all duration-200
                ${light.mode === m
                  ? m === 'emergency' ? 'bg-coral-soft/15 text-forest' : 'bg-cyan-accent/10 text-forest'
                  : 'text-gray-400 hover:text-forest'}`}
            >
              {modeLabels[m]}
            </button>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <span className="text-[10px] text-gray-400 uppercase tracking-wide">Control Manual</span>
        <div className="flex gap-1.5">
          {(['green', 'yellow', 'red'] as const).map((c) => {
            const labels: Record<string, string> = { green: 'Verde', yellow: 'Amarillo', red: 'Rojo' }
            const accent: Record<string, string> = {
              green: 'bg-lime-soft/15 border-lime-soft/40 text-forest',
              yellow: 'bg-amber-400/15 border-amber-400/40 text-amber-700',
              red: 'bg-coral-soft/15 border-coral-soft/40 text-forest',
            }
            return (
              <button
                key={c}
                disabled={!isManual}
                onClick={() => onSetColor(light.id, c)}
                className={`flex-1 py-1.5 rounded-lg text-[10px] font-medium border transition-all duration-200
                  ${isManual ? accent[c] : 'bg-gray-50 border-gray-200 text-gray-300'}
                  disabled:opacity-40 disabled:cursor-not-allowed`}
              >
                {labels[c]}
              </button>
            )
          })}
        </div>
      </div>

      <hr className="border-gray-100" />

      <TrafficCycleConfig
        cycle={light.cycle}
        onChange={(cycle) => onSetCycle(light.id, cycle)}
      />

      <hr className="border-gray-100" />

      <TrafficInfo light={light} />

      <hr className="border-gray-100" />

      <TrafficActions
        hasSelection={!!light}
        onSyncAll={() => onSyncAll(light.id)}
        onEmergencyAll={onEmergencyAll}
        onResetEmergency={onResetEmergency}
        isEmergency={isEmergency}
      />
    </div>
  )
}
