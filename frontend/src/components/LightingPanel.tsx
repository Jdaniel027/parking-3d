import { useState, useEffect, useRef } from "react";
import type { LightingZone, LightingMode } from "../types/dashboard";
import { useLuces } from "../hooks/useLuces";

type Props = {
  zone: LightingZone | null;
  onSetMode: (zoneId: number, mode: LightingMode) => void;
  onSetIntensity: (zoneId: number, value: number) => void;
  onTurnAllOn: (zoneId: number) => void;
  onTurnAllOff: (zoneId: number) => void;
};

const ML: Record<string, string> = { eco: "ECO", manual: "MANUAL", apagado: "APAGADO" };
const MC: Record<string, string> = {
  eco: "border-lime-soft/40 bg-lime-soft/15 text-forest",
  manual: "border-amber-400/40 bg-amber-400/15 text-amber-700",
  apagado: "border-coral-soft/40 bg-coral-soft/15 text-forest",
};

export default function LightingPanel({ zone, onSetMode, onSetIntensity, onTurnAllOn, onTurnAllOff }: Props) {
  const [draftIntensity, setDraftIntensity] = useState(zone?.intensity ?? 0);
  const { zona, setZona, mode, setMode, payload, setPayload, confirmar } = useLuces();
  const lastLoadedZoneId = useRef<number | null>(null);

  useEffect(() => {
    if (zone && lastLoadedZoneId.current !== zone.id) {
      setZona(zone.id === 1 ? 'este' : 'oeste');
      setMode(zone.mode === 'apagado' ? 'apagar' : zone.mode === 'eco' ? 'eco' : 'manual');
      setPayload({ intensidad: zone.intensity });
      setDraftIntensity(zone.intensity);
      lastLoadedZoneId.current = zone.id;
    }
  }, [zone, setZona, setMode, setPayload]);

  if (!zone) {
    return (
      <div className="bg-white border border-gray-200 rounded-xl p-6 flex flex-col items-center justify-center text-center gap-4 h-full">
        <svg viewBox="0 0 24 24" className="w-10 h-10 text-gray-300" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M10 2a6 6 0 00-4 10.3c1.2 1.2 1.8 2.7 1.8 3.7h4.4c0-1 .6-2.5 1.8-3.7A6 6 0 0010 2zM8.5 17h3M9.5 19h1" />
        </svg>
        <span className="text-sm text-gray-400">Selecciona una zona en el croquis para controlarla</span>
      </div>
    );
  }

  const handleSetMode = (m: LightingMode) => {
    onSetMode(zone.id, m);
    setZona(zone.id === 1 ? 'este' : 'oeste');
    setMode(m === 'apagado' ? 'apagar' : m === 'eco' ? 'eco' : 'manual');
  };

  const handleSetIntensity = (val: number) => {
    onSetIntensity(zone.id, val);
    setZona(zone.id === 1 ? 'este' : 'oeste');
    setPayload({ intensidad: val });
  };

  const handleTurnAllOn = () => {
    onTurnAllOn(zone.id);
    setZona('ambas');
    setMode('manual');
    const newPayload = { intensidad: 100 };
    setPayload(newPayload);
    setDraftIntensity(100);
    confirmar({ zona: 'ambas', mode: 'manual', payload: newPayload });
  };

  const handleTurnAllOff = () => {
    onTurnAllOff(zone.id);
    setZona('ambas');
    setMode('apagar');
    const newPayload = { intensidad: 0 };
    setPayload(newPayload);
    setDraftIntensity(0);
    confirmar({ zona: 'ambas', mode: 'apagar', payload: newPayload });
  };

  const lampsOn = zone.lamps.filter((l) => l.isOn).length;
  const isDirty = draftIntensity !== zone.intensity;

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-6 flex flex-col gap-5 h-full overflow-y-auto">
      <div>
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xl font-bold text-forest">
              {zona === 'ambas' ? 'Ambas Zonas (Sincronizado)' : zone.name}
            </h3>
            <span className="text-xs text-gray-400">
              {zona === 'ambas' ? 'ID #0' : `ID #${zone.id}`}
            </span>
          </div>
          <span className="text-xs text-gray-400">{lampsOn}/{zone.lamps.length}</span>
        </div>
        <div className="flex items-center gap-3 mt-4">
          <span className="text-3xl font-bold text-lime-soft">{zone.intensity}%</span>
          <div className="flex-1 h-3 bg-gray-100 rounded-full overflow-hidden">
            <div className="h-full bg-linear-to-r from-lime-soft to-cyan-accent rounded-full transition-all duration-500" style={{ width: `${zone.intensity}%` }} />
          </div>
        </div>
      </div>
      <hr className="border-gray-100" />
      <div className="flex flex-col gap-2">
        <span className="text-xs text-gray-400 uppercase tracking-wide font-medium">Acciones Rápidas</span>
        <div className="flex gap-2">
          <button onClick={handleTurnAllOn}
            className="flex-1 py-2 rounded-lg text-sm font-medium border border-lime-soft/40 bg-lime-soft/15 text-forest hover:bg-lime-soft/25 transition-all duration-200">
            Encender todas
          </button>
          <button onClick={handleTurnAllOff}
            className="flex-1 py-2 rounded-lg text-sm font-medium border border-coral-soft/40 bg-coral-soft/10 text-forest hover:bg-coral-soft/20 transition-all duration-200">
            Apagar todas
          </button>
        </div>
      </div>
      <hr className="border-gray-100" />
      <div className="flex flex-col gap-2">
        <span className="text-xs text-gray-400 uppercase tracking-wide font-medium">Modo de Control</span>
        <div className="flex rounded-lg overflow-hidden text-sm font-medium border border-gray-200">
          {(["eco", "manual", "apagado"] as const).map((m) => (
            <button key={m} onClick={() => handleSetMode(m)}
              className={`flex-1 py-2 border-r last:border-r-0 transition-all duration-200 ${zone.mode === m ? MC[m] : "text-gray-400 hover:text-forest"}`}>
              {ML[m]}
            </button>
          ))}
        </div>
      </div>
      <hr className="border-gray-100" />
      <div className="flex flex-col gap-2">
        <span className="text-xs text-gray-400 uppercase tracking-wide font-medium">Intensidad</span>
        <div className="flex items-center gap-3 mb-1">
          <span className="text-sm text-gray-500 min-w-[3rem]">{draftIntensity}%</span>
          <input type="range" min={0} max={100} value={draftIntensity}
            onChange={(e) => setDraftIntensity(Number(e.target.value))}
            className="flex-1 h-2 rounded-full appearance-none cursor-pointer bg-gray-200 accent-lime-soft
              [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5
              [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-lime-soft
              [&::-webkit-slider-thumb]:shadow-[0_0_8px_rgba(132,196,22,0.5)]" />
        </div>
        {isDirty && (
          <button onClick={() => handleSetIntensity(draftIntensity)}
            className="w-full py-2 rounded-lg text-sm font-medium bg-lime-soft text-white hover:bg-lime-soft/90 transition-all duration-200 flex items-center justify-center gap-2">
            <svg viewBox="0 0 20 20" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M4 10l4 4 8-8" />
            </svg>
            Confirmar {draftIntensity}%
          </button>
        )}
      </div>
      <hr className="border-gray-100" />
      <div className="flex flex-col gap-2">
        <span className="text-xs text-gray-400 uppercase tracking-wide font-medium">Información del Sistema</span>
        <div className="bg-gray-50 rounded-lg p-3 text-sm space-y-2">
          <div className="flex justify-between"><span className="text-gray-400">Controlador</span><span className="font-semibold text-forest">{zone.controllerNode}</span></div>
          <div className="flex justify-between"><span className="text-gray-400">Última actualización</span><span className="font-semibold text-forest">{zone.lastUpdated}</span></div>
          <div className="flex justify-between items-center">
            <span className="text-gray-400">Conexión</span>
            <span className={`flex items-center gap-1.5 text-xs font-semibold ${zone.connected ? "text-lime-soft" : "text-coral-soft"}`}>
              <span className={`w-2 h-2 rounded-full ${zone.connected ? "bg-lime-soft" : "bg-coral-soft"}`} />
              {zone.connected ? "Conectado" : "Desconectado"}
            </span>
          </div>
          <div className="flex justify-between"><span className="text-gray-400">Firmware</span><span className="font-semibold text-forest">{zone.firmware}</span></div>
        </div>
      </div>
      <hr className="border-gray-100" />
      <button
        onClick={() => confirmar()}
        className="w-full bg-forest text-white py-3 rounded-lg font-bold hover:bg-forest/90 transition-colors shadow-lg shadow-forest/20 flex items-center justify-center gap-2"
      >
        <svg viewBox="0 0 20 20" className="w-5 h-5" fill="currentColor">
          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
        </svg>
        Confirmar Configuración
      </button>
    </div>
  );
}
