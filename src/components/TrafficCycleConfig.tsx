import type { TrafficCycle } from '../types/dashboard'

type Props = { cycle: TrafficCycle; onChange: (cycle: TrafficCycle) => void }

const clamp = (v: number) => Math.max(1, Math.floor(v))

export default function TrafficCycleConfig({ cycle, onChange }: Props) {
  const total = cycle.verde + cycle.amarillo + cycle.rojo
  const handle = (key: keyof TrafficCycle, raw: string) => {
    const v = parseInt(raw, 10); if (isNaN(v)) return
    onChange({ ...cycle, [key]: clamp(v) })
  }
  return (
    <div className="flex flex-col gap-2">
      <span className="text-xs text-gray-400 uppercase tracking-wide font-medium">Tiempo de Ciclo</span>
      <div className="grid grid-cols-3 gap-3">
        {(['verde', 'amarillo', 'rojo'] as const).map((key) => {
          const ring = key === 'verde' ? 'border-lime-soft/40 focus:ring-lime-soft/30' : key === 'amarillo' ? 'border-amber-400/40 focus:ring-amber-400/30' : 'border-coral-soft/40 focus:ring-coral-soft/30'
          return (
            <label key={key} className="flex flex-col gap-1">
              <span className="text-xs text-gray-400 capitalize font-medium">{key}</span>
              <input type="number" min={1} value={cycle[key]} onChange={(e) => handle(key, e.target.value)}
                className={`w-full px-2 py-2 rounded-md border text-sm font-semibold text-center bg-gray-50 text-forest outline-none transition-all ${ring} focus:ring-2`} />
            </label>
          )
        })}
      </div>
      <div className="text-sm text-gray-500 text-center mt-1">Tiempo total: <span className="font-semibold text-forest">{total}s</span></div>
    </div>
  )
}
