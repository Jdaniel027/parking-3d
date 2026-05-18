import type { LightingZone, LightingMode } from '../types/dashboard'
import LightingCard from './LightingCard'

type Props = {
  zones: LightingZone[]
  onSetMode: (id: number, mode: LightingMode) => void
  onSetBrightness: (id: number, value: number) => void
}

export default function LightingSection({ zones, onSetMode, onSetBrightness }: Props) {
  return (
    <section className="bg-white/[0.02] backdrop-blur-md border border-white/[0.06] rounded-2xl p-4">
      <h2 className="text-sm font-semibold text-white/90 mb-3 flex items-center gap-2">
        <span className="w-2 h-2 rounded-full bg-amber-400" />
        Zonas de Iluminación
      </h2>
      <div className="grid grid-cols-3 gap-3">
        {zones.map((z) => (
          <LightingCard key={z.id} zone={z} onSetMode={onSetMode} onSetBrightness={onSetBrightness} />
        ))}
      </div>
    </section>
  )
}
