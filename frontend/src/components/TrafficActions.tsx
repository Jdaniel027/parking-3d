type Props = { hasSelection: boolean; onSyncAll: () => void; onEmergencyAll: () => void; onResetEmergency: () => void; isEmergency: boolean }

export default function TrafficActions({ hasSelection, onSyncAll, onEmergencyAll, onResetEmergency, isEmergency }: Props) {
  return (
    <div className="flex flex-col gap-2">
      <span className="text-xs text-gray-400 uppercase tracking-wide font-medium">Acciones Rápidas</span>
      <button disabled={!hasSelection} onClick={onSyncAll}
        className="w-full py-2 rounded-lg text-sm font-medium border transition-all duration-200
          bg-blue-50/50 border-blue-300/40 text-forest hover:bg-blue-100/50 disabled:opacity-30 disabled:cursor-not-allowed">
        Sincronizar todo
      </button>
      <button onClick={isEmergency ? onResetEmergency : onEmergencyAll}
        className={`w-full py-2 rounded-lg text-sm font-bold tracking-wide border transition-all duration-200
          ${isEmergency ? 'bg-amber-50 border-amber-400/40 text-amber-700 hover:bg-amber-100/50' : 'bg-coral-soft/10 border-coral-soft/40 text-forest hover:bg-coral-soft/20'}`}>
        {isEmergency ? '● Reset general' : 'Paro de emergencia'}
      </button>
    </div>
  )
}
