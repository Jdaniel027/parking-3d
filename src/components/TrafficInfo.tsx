import type { TrafficLight } from '../types/dashboard'

type Props = {
  light: TrafficLight
}

const modeLabels: Record<string, string> = {
  automatic: 'Automático',
  manual: 'Manual',
  emergency: 'Emergencia',
}

const modeBadge: Record<string, string> = {
  automatic: 'bg-lime-soft/15 text-forest',
  manual: 'bg-cyan-accent/10 text-forest',
  emergency: 'bg-coral-soft/15 text-forest',
}

export default function TrafficInfo({ light }: Props) {
  const total = light.cycle.verde + light.cycle.amarillo + light.cycle.rojo

  return (
    <div className="flex flex-col gap-1.5">
      <span className="text-[10px] text-gray-400 uppercase tracking-wide">Información</span>

      <div className="bg-gray-50 rounded-lg p-2.5 text-[11px] space-y-1">
        <div className="flex justify-between">
          <span className="text-gray-400">ID</span>
          <span className="font-medium text-forest">#{light.id}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-400">Nombre</span>
          <span className="font-medium text-forest">{light.name}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-400">Estado</span>
          <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-medium ${modeBadge[light.mode]}`}>
            {modeLabels[light.mode]}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-400">Ciclo total</span>
          <span className="font-medium text-forest">{total}s</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-400">Última actualización</span>
          <span className="font-medium text-forest">
            {new Date().toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
          </span>
        </div>
      </div>
    </div>
  )
}
