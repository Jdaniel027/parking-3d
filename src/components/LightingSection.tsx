import type { LightingZone, LightingMode } from '../types/dashboard'
import LightingCard from './LightingCard'

type Props = {
  zones: LightingZone[]
  onSetMode: (id: number, mode: LightingMode) => void
  onSetBrightness: (id: number, value: number) => void
}

export default function LightingSection({ zones, onSetMode, onSetBrightness }: Props) {
  return (
    <section className="bg-white border border-gray-200 rounded-xl p-4">
      <h2 className="text-sm font-semibold text-forest mb-3 flex items-center gap-2">
        <span className="w-2 h-2 rounded-full bg-lime-soft" />
        Zonas de Iluminación
      </h2>
      <div className="grid grid-cols-2 gap-3">
        {zones.map((z) => (
          <LightingCard key={z.id} zone={z} onSetMode={onSetMode} onSetBrightness={onSetBrightness} />
        ))}
      </div>
    </section>
  )
}
