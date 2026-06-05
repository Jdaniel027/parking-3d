import { useSemaforo, SemaforoMode, SemaforoColor } from '../hooks/useSemaforo'
import type { TrafficLight, LightColor, TrafficCycle } from '../types/dashboard'
import { useEffect, useRef, useState } from 'react'

type Props = {
  light: TrafficLight | null
  onSetMode: (id: number, mode: TrafficLight['mode']) => void
  onSetColor: (id: number, color: LightColor) => void
  onSetCycle: (id: number, cycle: TrafficCycle) => void
  onSyncAll: (sourceId: number) => void
  onEmergencyAll: () => void
  onResetEmergency: () => void
}

const DIR_LABEL: Record<number, string> = { 1: 'Norte', 2: 'Sur', 3: 'Este', 4: 'Oeste' }
const MODE_LABEL: Record<string, string> = { automatic: 'Automático', manual: 'Manual', emergency: 'Emergencia' }
const clamp = (v: number) => Math.max(1, Math.floor(v))

function ModeIcon({ mode }: { mode: string }) {
  if (mode === 'automatic') {
    return (
      <svg viewBox="0 0 16 16" className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M13 2.5a6 6 0 01-3 11M3 13.5a6 6 0 013-11" />
        <path d="M13 2.5v4h-4M3 13.5v-4h4" />
      </svg>
    )
  }
  if (mode === 'manual') {
    return (
      <svg viewBox="0 0 16 16" className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M8 2v5M6 4l2 3 2-3M4 10h8l-1 4H5L4 10z" />
      </svg>
    )
  }
  return (
    <svg viewBox="0 0 16 16" className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M8 2L2 14h12L8 2zM8 10V6M8 11.5v.5" />
    </svg>
  )
}

export default function TrafficPanel({ light, onSetMode, onSetColor, onSetCycle, onSyncAll, onEmergencyAll, onResetEmergency }: Props) {
  const { mode, setMode, semaforo, setSemaforo, payload, setPayload, aplicar } = useSemaforo();
  const [dirty, setDirty] = useState(false);

  // Usamos un ref para rastrear qué semáforo está cargado y evitar sobreescrituras accidentales del "0"
  const lastLoadedId = useRef<number | null>(null);

  useEffect(() => {
    if (light && lastLoadedId.current !== light.id) {
      setSemaforo(light.id);
      setMode(light.mode === 'automatic' ? 'automatico' : light.mode === 'manual' ? 'manual' : 'emergencia');
      setPayload({
        verde: light.cycle.verde,
        amarillo: light.cycle.amarillo,
        rojo: light.cycle.rojo,
        color: light.activeColor === 'green' ? 'verde' : light.activeColor === 'yellow' ? 'amarillo' : 'rojo'
      });
      setDirty(false);
      lastLoadedId.current = light.id;
    }
  }, [light, setSemaforo, setMode, setPayload]);

  const handleSetMode = (m: TrafficLight['mode']) => {
    if (!light) return;
    onSetMode(light.id, m);
    setSemaforo(light.id);
    setMode(m === 'automatic' ? 'automatico' : m === 'manual' ? 'manual' : 'emergencia');
    setDirty(true);
  };

  const handleSetColor = (c: LightColor) => {
    if (!light) return;
    onSetColor(light.id, c);
    setSemaforo(light.id);
    setPayload(prev => ({ ...prev, color: c === 'green' ? 'verde' : c === 'yellow' ? 'amarillo' : 'rojo' }));
    setDirty(true);
  };

  const handleSetCycle = (key: 'verde' | 'amarillo' | 'rojo', val: number) => {
    if (!light) return;
    const newCycle = { ...light.cycle, [key]: val };
    onSetCycle(light.id, newCycle);
    setSemaforo(light.id);
    setPayload(prev => ({ ...prev, [key]: val }));
    setDirty(true);
  };

  const handleSync = () => {
    if (!light) return;
    onSyncAll(light.id);
    setSemaforo(0);
    aplicar({ semaforo: 0 });
    setDirty(false);
  };

  const handleEmergencyAll = () => {
    onEmergencyAll();
    setSemaforo(0);
    setMode('emergencia');
    aplicar({ mode: 'emergencia', semaforo: 0 });
    setDirty(false);
  };

  const handleResetEmergency = () => {
    onResetEmergency();
    setSemaforo(0);
    setMode('automatico');
    aplicar({ mode: 'automatico', semaforo: 0 });
    setDirty(false);
  };

  if (!light) {
    return (
      <div className="rounded-xl p-6 flex flex-col items-center justify-center text-center gap-4 h-full border border-gray-200 bg-white shadow-xs">
        <svg viewBox="0 0 24 24" className="w-10 h-10 text-gray-300" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M7 2h6v16H7V2zm1 2v2h4V4H8zm0 4v2h4V8H8zm0 4v2h4v-2H8z" />
        </svg>
        <span className="text-sm text-gray-400">Selecciona un semáforo en el croquis para controlarlo</span>
      </div>
    )
  }

  const isManual = light.mode === 'manual'
  const total = light.cycle.verde + light.cycle.amarillo + light.cycle.rojo

  return (
    <div className="rounded-xl p-4 border border-gray-200 bg-white shadow-xs space-y-3">

      {/* Sección 1 — Encabezado */}
      <div className="flex items-start justify-between">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-gray-700">Semáforo Seleccionado</span>
            <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded-full bg-amber-100 text-amber-700">
              {semaforo === 0 ? 'TODOS (Sincronizado)' : (light.id <= 2 ? 'Norte + Sur' : 'Este + Oeste')}
            </span>
          </div>
          <div className="flex items-center gap-2 mt-2">
            <span className={`w-2 h-2 rounded-full ${light.mode === 'automatic' ? 'bg-lime-soft' : light.mode === 'manual' ? 'bg-cyan-accent' : 'bg-coral-soft'}`} />
            <span className={`text-sm font-bold ${light.mode === 'automatic' ? 'text-lime-soft' : light.mode === 'manual' ? 'text-cyan-accent' : 'text-coral-soft'}`}>
              {MODE_LABEL[light.mode]}
            </span>
          </div>
          <div className="flex items-center gap-2 mt-1.5 text-[11px] text-gray-400">
            <span>ID: {light.id}</span>
            <span>•</span>
            <span>{DIR_LABEL[light.id] || '—'}</span>

          </div>
        </div>
        <svg viewBox="0 0 36 90" className="w-7 h-[70px] shrink-0 ml-3">
          <rect x={2} y={0} width={32} height={90} rx={8} fill="#1e293b" />
          <circle cx={18} cy={18} r={11}
            fill={light.activeColor === 'red' ? '#fb7185' : '#334155'}
            stroke={light.activeColor === 'red' ? '#fb7185' : '#475569'}
            strokeWidth={1}
            className="transition-all duration-300" />
          {light.activeColor === 'red' && (
            <circle cx={18} cy={18} r={14} fill="none" stroke="#fb7185" strokeWidth={2} opacity={0.25} />
          )}
          <circle cx={18} cy={45} r={11}
            fill={light.activeColor === 'yellow' ? '#fbbf24' : '#334155'}
            stroke={light.activeColor === 'yellow' ? '#fbbf24' : '#475569'}
            strokeWidth={1}
            className="transition-all duration-300" />
          {light.activeColor === 'yellow' && (
            <circle cx={18} cy={45} r={14} fill="none" stroke="#fbbf24" strokeWidth={2} opacity={0.25} />
          )}
          <circle cx={18} cy={72} r={11}
            fill={light.activeColor === 'green' ? '#84cc16' : '#334155'}
            stroke={light.activeColor === 'green' ? '#84cc16' : '#475569'}
            strokeWidth={1}
            className="transition-all duration-300" />
          {light.activeColor === 'green' && (
            <circle cx={18} cy={72} r={14} fill="none" stroke="#84cc16" strokeWidth={2} opacity={0.25} />
          )}
        </svg>
      </div>

      <hr className="border-gray-100" />

      {/* Sección 2 — Modo de Control */}
      <div>
        <span className="text-[11px] text-gray-500 font-medium mb-2 block">Modo de Control</span>
        <div className="flex gap-1.5">
          {(['automatic', 'manual', 'emergency'] as const).map((m) => {
            const active = light.mode === m
            const base = 'flex-1 flex items-center justify-center gap-1 py-2 rounded-lg text-xs font-medium border transition-all duration-200 cursor-pointer'
            const style = active
              ? m === 'automatic'
                ? 'bg-lime-50 border-lime-300 text-lime-700'
                : m === 'manual'
                  ? 'bg-cyan-50 border-cyan-300 text-cyan-700'
                  : 'bg-red-50 border-red-300 text-red-700'
              : 'bg-white border-gray-200 text-gray-400 hover:border-gray-300 hover:text-gray-600'
            return (
              <button key={m} onClick={() => handleSetMode(m)} className={`${base} ${style}`}>
                <ModeIcon mode={m} />
                {MODE_LABEL[m]}
              </button>
            )
          })}
        </div>
      </div>

      <hr className="border-gray-100" />

      {/* Sección 3 — Control Manual */}
      <div>
        <span className="text-[11px] text-gray-500 font-medium mb-2 block">Control Manual</span>
        <div className="flex gap-1.5">
          {(['green', 'yellow', 'red'] as const).map((c) => {
            const labels: Record<string, string> = { green: 'Verde', yellow: 'Amarillo', red: 'Rojo' }
            const active = isManual && light.activeColor === c
            return (
              <button key={c} disabled={!isManual} onClick={() => handleSetColor(c)}
                className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-medium border transition-all duration-200
                  ${isManual ? (active ? 'ring-1 ring-inset ring-current' : '') : 'opacity-40 cursor-not-allowed'}
                  ${c === 'green' ? (isManual ? 'bg-lime-50 border-lime-300 text-lime-700' : 'bg-white border-gray-200 text-gray-300') : ''}
                  ${c === 'yellow' ? (isManual ? 'bg-amber-50 border-amber-300 text-amber-700' : 'bg-white border-gray-200 text-gray-300') : ''}
                  ${c === 'red' ? (isManual ? 'bg-red-50 border-red-300 text-red-700' : 'bg-white border-gray-200 text-gray-300') : ''}`}>
                <span className={`w-2.5 h-2.5 rounded-full ${c === 'green' ? 'bg-lime-500' : c === 'yellow' ? 'bg-amber-400' : 'bg-red-400'}`} />
                {labels[c]}
              </button>
            )
          })}
        </div>
      </div>

      <hr className="border-gray-100" />

      {/* Sección 4 — Tiempos del Ciclo */}
      <div>
        <span className="text-[11px] text-gray-500 font-medium mb-2 block">Tiempos del Ciclo (segundos)</span>
        <div className="grid grid-cols-3 gap-2">
          {(['verde', 'amarillo', 'rojo'] as const).map((key) => {
            const ring = key === 'verde'
              ? 'border-lime-400/60 focus:ring-lime-400/30 bg-lime-50'
              : key === 'amarillo'
                ? 'border-amber-400/60 focus:ring-amber-400/30 bg-amber-50'
                : 'border-red-400/60 focus:ring-red-400/30 bg-red-50'
            const text = key === 'verde' ? 'text-lime-700' : key === 'amarillo' ? 'text-amber-700' : 'text-red-700'
            return (
              <label key={key} className="flex flex-col gap-0.5">
                <span className="text-[10px] text-gray-400 capitalize font-medium">{key}</span>
                <input type="number" min={1} value={light.cycle[key]}
                  onChange={(e) => {
                    const v = parseInt(e.target.value, 10); if (isNaN(v)) return
                    handleSetCycle(key, clamp(v))
                  }}
                  className={`w-full px-1.5 py-1.5 rounded-lg border text-xs font-bold text-center outline-none transition-all ${ring} ${text} focus:ring-2`} />
              </label>
            )
          })}
        </div>
        <div className="mt-2 py-1.5 px-2 rounded-lg bg-gray-100 text-center">
          <span className="text-xs text-gray-500">Total del Ciclo: <strong className="text-gray-700">{total}s</strong></span>
        </div>
      </div>

      <hr className="border-gray-100" />

      {/* Sección 5 — Acciones Rápidas */}
      <div>
        <span className="text-[11px] text-gray-500 font-medium mb-2 block">Acciones Rápidas</span>
        <div className="flex gap-2">
          <button onClick={handleSync}
            className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-medium border border-gray-200 bg-gray-50 text-gray-700 hover:bg-gray-100 transition-all duration-200">
            <svg viewBox="0 0 16 16" className="w-3.5 h-3.5 shrink-0" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M13 2.5a6 6 0 01-3 11M3 13.5a6 6 0 013-11" />
              <path d="M13 2.5v4h-4M3 13.5v-4h4" />
            </svg>
            Sincronizar
          </button>
          <button onClick={light.mode === 'emergency' ? handleResetEmergency : handleEmergencyAll}
            className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-semibold border transition-all duration-200
              ${light.mode === 'emergency' ? 'bg-amber-50 border-amber-300 text-amber-700 hover:bg-amber-100' : 'bg-red-50 border-red-200 text-red-700 hover:bg-red-100'}`}>
            <svg viewBox="0 0 16 16" className="w-3.5 h-3.5 shrink-0" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M8 2L2 14h12L8 2zM8 10V6M8 11.5v.5" />
            </svg>
            {light.mode === 'emergency' ? 'Reset general' : 'Paro de emergencia'}
          </button>
        </div>
      </div>

      <hr className="border-gray-100" />

      {/* Sección 6 — Aplicar Cambios */}
      <button
        onClick={() => { aplicar(); setDirty(false); }}
        disabled={!dirty}
        className={`w-full py-3 rounded-lg font-bold flex items-center justify-center gap-2 transition-all duration-200
          ${dirty
            ? 'bg-forest text-white hover:bg-forest/90 shadow-lg shadow-forest/20 cursor-pointer'
            : 'bg-gray-200 text-gray-400 cursor-not-allowed'}`}
      >
        <svg viewBox="0 0 20 20" className="w-5 h-5" fill="currentColor">
          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
        </svg>
        Aplicar Cambios
      </button>
    </div>
  )
}
