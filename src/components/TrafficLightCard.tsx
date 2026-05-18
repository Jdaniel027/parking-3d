import { useEffect, useState } from 'react'
import type { TrafficLight, LightColor } from '../types/dashboard'

type Props = {
  data: TrafficLight
  onSetMode: (id: number, mode: TrafficLight['mode']) => void
  onSetColor: (id: number, color: LightColor) => void
}

const ledColors: Record<LightColor, string> = {
  green: 'bg-emerald-500 shadow-[0_0_12px_rgba(52,211,153,0.6)]',
  yellow: 'bg-amber-400 shadow-[0_0_12px_rgba(251,191,36,0.6)]',
  red: 'bg-red-500 shadow-[0_0_12px_rgba(239,68,68,0.6)]',
}

const ledDim = 'bg-white/10'

const modeLabels: Record<string, string> = {
  automatic: 'AUTOMÁTICO',
  manual: 'MANUAL',
  emergency: 'PARO DE EMERGENCIA',
}

const modeBadgeColors: Record<string, string> = {
  automatic: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
  manual: 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30',
  emergency: 'bg-red-500/20 text-red-400 border-red-500/30',
}

const modeTabColors: Record<string, string> = {
  automatic: 'bg-amber-500/30 text-amber-300 border-amber-500/50',
  manual: 'bg-cyan-500/30 text-cyan-300 border-cyan-500/50',
  emergency: 'bg-red-500/30 text-red-300 border-red-500/50',
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
    if (data.mode === 'emergency' && color === 'red') return blink ? ledColors.red : 'bg-red-900'
    if (isActive) return ledColors[color]
    return ledDim
  }

  return (
    <div className="bg-white/[0.04] backdrop-blur-md border border-white/[0.06] rounded-2xl p-3
      flex flex-col items-center gap-2 transition-all duration-300 hover:border-white/[0.12]"
    >
      <div className="flex items-center justify-between w-full">
        <span className="text-xs font-semibold text-white/80">Semáforo {data.id}</span>
        <span className={`text-[8px] px-1.5 py-0.5 rounded-full border font-medium ${modeBadgeColors[data.mode]}`}>
          {modeLabels[data.mode]}
        </span>
      </div>

      <div className="flex flex-col items-center gap-1.5 py-2">
        <div className={`w-5 h-5 rounded-full transition-all duration-300 ${led('red')}`} />
        <div className={`w-5 h-5 rounded-full transition-all duration-300 ${led('yellow')}`} />
        <div className={`w-5 h-5 rounded-full transition-all duration-300 ${led('green')}`} />
      </div>

      <div className="flex rounded-lg overflow-hidden w-full text-[9px] font-medium">
        {(['automatic', 'manual', 'emergency'] as const).map((m) => (
          <button
            key={m}
            onClick={() => onSetMode(data.id, m)}
            className={`flex-1 py-1 border transition-all duration-200
              ${data.mode === m ? modeTabColors[m] : 'text-white/40 border-white/10'}`}
          >
            {modeLabels[m]}
          </button>
        ))}
      </div>

      <div className="flex gap-1 w-full">
        {(['green', 'yellow', 'red'] as const).map((c) => {
          const labels: Record<string, string> = { green: 'Verde', yellow: 'Amarillo', red: 'Rojo' }
          const accent: Record<string, string> = {
            green: 'bg-emerald-500/20 border-emerald-500/40 text-emerald-400',
            yellow: 'bg-amber-500/20 border-amber-500/40 text-amber-400',
            red: 'bg-red-500/20 border-red-500/40 text-red-400',
          }
          return (
            <button
              key={c}
              disabled={!isManual}
              onClick={() => onSetColor(data.id, c)}
              className={`flex-1 py-1 rounded-lg text-[9px] font-medium border transition-all duration-200
                ${isManual ? `${accent[c]} hover:bg-opacity-40` : 'bg-white/5 border-white/5 text-white/20'}
                disabled:opacity-30 disabled:cursor-not-allowed pointer-events-none`}
            >
              {labels[c]}
            </button>
          )
        })}
      </div>
    </div>
  )
}
