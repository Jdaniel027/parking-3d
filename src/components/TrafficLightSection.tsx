import type { TrafficLight, LightColor } from '../types/dashboard'
import TrafficLightCard from './TrafficLightCard'

type Props = {
  lights: TrafficLight[]
  onSetMode: (id: number, mode: TrafficLight['mode']) => void
  onSetColor: (id: number, color: LightColor) => void
}

export default function TrafficLightSection({ lights, onSetMode, onSetColor }: Props) {
  return (
    <section className="bg-white border border-gray-200 rounded-xl p-4">
      <h2 className="text-sm font-semibold text-forest mb-3 flex items-center gap-2">
        <span className="w-2 h-2 rounded-full bg-cyan-accent" />
        Control de Semáforos
      </h2>
      <div className="grid grid-cols-5 gap-3">
        {lights.map((l) => (
          <TrafficLightCard
            key={l.id}
            data={l}
            onSetMode={onSetMode}
            onSetColor={onSetColor}
          />
        ))}
      </div>
    </section>
  )
}
