type Props = {
  hasSelection: boolean
  onSyncAll: () => void
  onEmergencyAll: () => void
  onResetEmergency: () => void
  isEmergency: boolean
}

export default function TrafficActions({ hasSelection, onSyncAll, onEmergencyAll, onResetEmergency, isEmergency }: Props) {
  return (
    <div className="flex flex-col gap-2">
      <span className="text-[10px] text-gray-400 uppercase tracking-wide">Acciones Rápidas</span>

      <button
        disabled={!hasSelection}
        onClick={onSyncAll}
        className="w-full py-1.5 rounded-lg text-[11px] font-medium border transition-all duration-200
          bg-blue-50/50 border-blue-300/40 text-forest hover:bg-blue-100/50
          disabled:opacity-30 disabled:cursor-not-allowed"
      >
        Sincronizar todo
      </button>

      <button
        onClick={isEmergency ? onResetEmergency : onEmergencyAll}
        className={`w-full py-1.5 rounded-lg text-[11px] font-bold tracking-wide border transition-all duration-200
          ${isEmergency
            ? 'bg-amber-50 border-amber-400/40 text-amber-700 hover:bg-amber-100/50'
            : 'bg-coral-soft/10 border-coral-soft/40 text-forest hover:bg-coral-soft/20'}`}
      >
        {isEmergency ? '● Reset general' : 'Paro de emergencia'}
      </button>
    </div>
  )
}
