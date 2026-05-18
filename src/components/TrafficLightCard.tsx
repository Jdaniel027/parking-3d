import { useEffect, useState } from 'react'
import type { TrafficLight, LightColor } from '../types/dashboard'

type Props = {
  data: TrafficLight
  onSetMode: (id: number, mode: TrafficLight['mode']) => void
  onSetColor: (id: number, color: LightColor) => void
}

const ledColors: Record<LightColor, string> = {
  green: 'bg-lime-soft shadow-[0_0_10px_rgba(132,196,22,0.5)]',
  yellow: 'bg-amber-400 shadow-[0_0_10px_rgba(251,191,36,0.5)]',
  red: 'bg-coral-soft shadow-[0_0_10px_rgba(251,113,133,0.5)]',
}

const ledDim = 'bg-gray-200'

const modeLabels: Record<string, string> = {
  automatic: 'AUTOMÁTICO',
  manual: 'MANUAL',
  emergency: 'PARO DE EMERGENCIA',
}

const modeBadgeColors: Record<string, string> = {
  automatic: 'bg-lime-soft/15 text-forest-muted border-lime-soft/30',
  manual: 'bg-cyan-accent/10 text-forest border-cyan-accent/30',
  emergency: 'bg-coral-soft/15 text-forest border-coral-soft/30',
}

export default function TrafficLightCard({ data, onSetMode, onSetColor }: Props) {
  const [blink, setBlink] = useState(true)

  useEffect(() => {
    if (data.mode !== 'emergency') { setBlink(true); return }
    const id = setInterval(() => setBlink((b) => !b), 350)
    return () => clearInterval(id)
  }, [data.mode])

  const isManual = data.mode === 'manual'

  const led = (color: LightColor) => {
    const isActive = data.activeColor === color
    if (data.mode === 'emergency' && color === 'red') return blink ? ledColors.red : 'bg-gray-200'
    if (isActive) return ledColors[color]
    return ledDim
  }

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-3
      flex flex-col items-center gap-2 transition-all duration-300 hover:shadow-md"
    >
      <div className="flex items-center justify-between w-full">
        <span className="text-xs font-semibold text-forest">{data.name}</span>
        <span className={`text-[8px] px-1.5 py-0.5 rounded-full border font-medium ${modeBadgeColors[data.mode]}`}>
          {modeLabels[data.mode]}
        </span>
      </div>

      <div className="flex flex-col items-center gap-1.5 py-2">
        <div className={`w-5 h-5 rounded-full transition-all duration-300 ${led('red')}`} />
        <div className={`w-5 h-5 rounded-full transition-all duration-300 ${led('yellow')}`} />
        <div className={`w-5 h-5 rounded-full transition-all duration-300 ${led('green')}`} />
      </div>

      <div className="flex rounded-lg overflow-hidden w-full text-[9px] font-medium border border-gray-200">
        {(['automatic', 'manual', 'emergency'] as const).map((m) => {
          const tabActive: Record<string, string> = {
            automatic: 'bg-lime-soft/15 text-forest',
            manual: 'bg-cyan-accent/10 text-forest',
            emergency: 'bg-coral-soft/15 text-forest',
          }
          return (
            <button
              key={m}
              onClick={() => onSetMode(data.id, m)}
              className={`flex-1 py-1 border-r last:border-r-0 transition-all duration-200
                ${data.mode === m ? tabActive[m] : 'text-gray-400 hover:text-forest'}`}
            >
              {modeLabels[m]}
            </button>
          )
        })}
      </div>

      <div className="flex gap-1 w-full">
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
              onClick={() => onSetColor(data.id, c)}
              className={`flex-1 py-1 rounded-lg text-[9px] font-medium border transition-all duration-200
                ${isManual ? accent[c] : 'bg-gray-50 border-gray-200 text-gray-300'}
                disabled:opacity-40 disabled:cursor-not-allowed pointer-events-none`}
            >
              {labels[c]}
            </button>
          )
        })}
      </div>

      <button
        onClick={() => onSetMode(data.id, data.mode === 'emergency' ? 'automatic' : 'emergency')}
        className={`w-full py-1.5 rounded-lg text-[9px] font-bold tracking-wide border transition-all duration-200
          ${data.mode === 'emergency'
            ? 'bg-coral-soft/20 border-coral-soft text-forest animate-pulse'
            : 'bg-coral-soft/10 border-coral-soft/40 text-forest hover:bg-coral-soft/20'}`}
      >
        {data.mode === 'emergency' ? '● RESET' : 'PARO DE EMERGENCIA'}
      </button>
    </div>
  )
}
