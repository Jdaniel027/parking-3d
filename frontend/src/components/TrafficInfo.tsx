import type { TrafficLight } from '../types/dashboard'

type Props = { light: TrafficLight }

const MODE_LABEL: Record<string, string> = { automatic: 'Automático', manual: 'Manual', emergency: 'Emergencia' }
const MODE_BADGE: Record<string, string> = { automatic: 'bg-lime-soft/15 text-forest', manual: 'bg-cyan-accent/10 text-forest', emergency: 'bg-coral-soft/15 text-forest' }

export default function TrafficInfo({ light }: Props) {
  const total = light.cycle.verde + light.cycle.amarillo + light.cycle.rojo
  return (
    <div className="flex flex-col gap-2">
      <span className="text-xs text-gray-400 uppercase tracking-wide font-medium">Información</span>
      <div className="bg-gray-50 rounded-lg p-3 text-sm space-y-2">
        <div className="flex justify-between"><span className="text-gray-400">ID</span><span className="font-semibold text-forest">#{light.id}</span></div>
        <div className="flex justify-between"><span className="text-gray-400">Nombre</span><span className="font-semibold text-forest">{light.name}</span></div>
        <div className="flex justify-between">
          <span className="text-gray-400">Estado</span>
          <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${MODE_BADGE[light.mode]}`}>{MODE_LABEL[light.mode]}</span>
        </div>
        <div className="flex justify-between"><span className="text-gray-400">Ciclo total</span><span className="font-semibold text-forest">{total}s</span></div>
        <div className="flex justify-between">
          <span className="text-gray-400">Última actualización</span>
          <span className="font-semibold text-forest">{new Date().toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}</span>
        </div>
      </div>
    </div>
  )
}
