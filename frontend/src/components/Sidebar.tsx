type Props = { activeView: string; onNavigate: (id: string) => void }

function CarIcon() {
  return (
    <svg viewBox="0 0 20 20" className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x={3} y={8} width={14} height={7} rx={2} />
      <rect x={6} y={5} width={8} height={3} rx={1} />
      <circle cx={6.5} cy={15} r={2} />
      <circle cx={13.5} cy={15} r={2} />
      <line x1={3} y1={10} x2={5} y2={10} />
      <line x1={17} y1={10} x2={15} y2={10} />
      <rect x={7.5} y={8} width={1.5} height={2} rx={0.3} />
      <rect x={11} y={8} width={1.5} height={2} rx={0.3} />
    </svg>
  )
}

function TrafficLightIcon() {
  return (
    <svg viewBox="0 0 20 20" className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x={7} y={1} width={6} height={18} rx={2} />
      <circle cx={10} cy={5.5} r={2.5} fill="currentColor" opacity={0.15} />
      <circle cx={10} cy={10} r={2.5} fill="currentColor" opacity={0.15} />
      <circle cx={10} cy={14.5} r={2.5} fill="currentColor" opacity={0.15} />
      <circle cx={10} cy={5.5} r={2} strokeWidth={1.2} />
      <circle cx={10} cy={10} r={2} strokeWidth={1.2} />
      <circle cx={10} cy={14.5} r={2} strokeWidth={1.2} />
    </svg>
  )
}

function LightbulbIcon() {
  return (
    <svg viewBox="0 0 20 20" className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M10 2a6 6 0 00-3.5 10.8c1 1 1.3 2.3 1.3 3.2h4.4c0-1 .4-2.2 1.3-3.2A6 6 0 0010 2z" />
      <line x1={8.5} y1={17} x2={11.5} y2={17} />
      <line x1={9.5} y1={19} x2={10.5} y2={19} />
      <line x1={10} y1={14} x2={10} y2={11} />
      <line x1={8} y1={12} x2={10} y2={10} />
      <line x1={10} y1={10} x2={12} y2={12} />
    </svg>
  )
}

const ICONS = {
  mapa: CarIcon,
  semaforos: TrafficLightIcon,
  iluminacion: LightbulbIcon,
}

export default function Sidebar({ activeView, onNavigate }: Props) {
  return (
    <aside className="fixed left-0 top-0 h-screen w-16 z-50
      flex flex-col items-center gap-7 py-6
      bg-white border-r border-gray-200">
      <span className="text-cyan-accent text-xl font-bold">P3</span>
      {Object.entries(ICONS).map(([id, Icon]) => {
        const isActive = activeView === id
        return (
          <button key={id} onClick={() => onNavigate(id)}
            className={`relative flex items-center justify-center transition-colors duration-200 group w-full py-2
              ${isActive ? 'text-cyan-accent' : 'text-forest hover:text-cyan-accent'}`}
            title={id === 'mapa' ? 'Mapa de Cajones' : id === 'semaforos' ? 'Control de Semáforos' : 'Zonas de Iluminación'}>
            {isActive && (
              <span className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-6 bg-cyan-accent rounded-r" />
            )}
            <span className="group-hover:scale-110 transition-transform">
              <Icon />
            </span>
          </button>
        )
      })}
    </aside>
  )
}
