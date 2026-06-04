import type { LightingStats } from '../types/dashboard'

type Props = { stats: LightingStats }

export default function LightingStats({ stats }: Props) {
  const cards = [
    { label: 'Lámparas Totales', value: stats.totalLamps },
    { label: 'Lámparas Encendidas', value: stats.lampsOn },
    { label: 'Promedio Iluminación', value: `${stats.avgIntensity}%` },
    { label: 'Consumo Total', value: `${stats.totalConsumption}W` },
  ]
  return (
    <div className="grid grid-cols-4 gap-3">
      {cards.map((c) => (
        <div key={c.label} className="bg-white border border-gray-200 rounded-xl p-3 transition-all duration-200 hover:shadow-md hover:border-gray-300 hover:scale-[1.02]">
          <div className="text-[10px] text-gray-500 mb-0.5">{c.label}</div>
          <div className="text-lg font-bold text-forest">{c.value}</div>
        </div>
      ))}
    </div>
  )
}
