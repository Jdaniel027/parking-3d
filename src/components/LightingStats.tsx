import type { LightingStats } from '../types/dashboard'

type Props = {
  stats: LightingStats
}

export default function LightingStats({ stats }: Props) {
  const cards = [
    { label: 'Lámparas Totales', value: stats.totalLamps, color: 'text-violet-500', bg: 'bg-violet-50', border: 'border-violet-200/50' },
    { label: 'Lámparas Encendidas', value: stats.lampsOn, color: 'text-lime-soft', bg: 'bg-lime-50', border: 'border-lime-200/50' },
    { label: 'Promedio Iluminación', value: `${stats.avgIntensity}%`, color: 'text-cyan-accent', bg: 'bg-cyan-50', border: 'border-cyan-200/50' },
    { label: 'Consumo Total', value: `${stats.totalConsumption}W`, color: 'text-amber-500', bg: 'bg-amber-50', border: 'border-amber-200/50' },
  ]

  return (
    <div className="grid grid-cols-4 gap-3">
      {cards.map((c) => (
        <div key={c.label} className={`${c.bg} ${c.border} border rounded-xl p-3`}>
          <div className="text-[10px] text-gray-500 mb-0.5">{c.label}</div>
          <div className={`text-lg font-bold ${c.color}`}>{c.value}</div>
        </div>
      ))}
    </div>
  )
}
