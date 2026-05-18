const navItems = [
  { id: 'mapa', label: 'Mapa de Cajones', icon: '◈' },
  { id: 'semaforos', label: 'Control de Semáforos', icon: '●' },
  { id: 'iluminacion', label: 'Zonas de Iluminación', icon: '☀' },
]

type Props = {
  activeView: string
  onNavigate: (id: string) => void
}

export default function Sidebar({ activeView, onNavigate }: Props) {
  return (
    <aside className="fixed left-0 top-0 h-screen w-20 z-50
      flex flex-col items-center gap-6 py-6
      bg-white border-r border-gray-200"
    >
      <div className="text-cyan-accent text-xl font-bold mb-4">P3</div>
      {navItems.map((item) => (
        <button
          key={item.id}
          onClick={() => onNavigate(item.id)}
          className={`flex flex-col items-center gap-1 transition-colors duration-200 group
            ${activeView === item.id ? 'text-cyan-accent' : 'text-forest hover:text-cyan-accent'}`}
          title={item.label}
        >
          <span className="text-lg group-hover:scale-110 transition-transform">{item.icon}</span>
          <span className="text-[9px] leading-tight text-center">{item.label}</span>
        </button>
      ))}
    </aside>
  )
}
