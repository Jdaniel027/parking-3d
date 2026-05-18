import type { LightingZone, LightingMode } from "../types/dashboard";

type Props = {
  zone: LightingZone | null;
  onSetMode: (zoneId: number, mode: LightingMode) => void;
  onSetIntensity: (zoneId: number, value: number) => void;
  onTurnAllOn: (zoneId: number) => void;
  onTurnAllOff: (zoneId: number) => void;
};

const MODE_LABELS: Record<string, string> = {
  eco: "ECO",
  manual: "MANUAL",
  apagado: "APAGADO",
};
const MODE_CLASS: Record<string, string> = {
  eco: "border-lime-soft/40 bg-lime-soft/15 text-forest",
  manual: "border-amber-400/40 bg-amber-400/15 text-amber-700",
  apagado: "border-coral-soft/40 bg-coral-soft/15 text-forest",
};

export default function LightingPanel({
  zone,
  onSetMode,
  onSetIntensity,
  onTurnAllOn,
  onTurnAllOff,
}: Props) {
  if (!zone) {
    return (
      <div className="bg-white border border-gray-200 rounded-xl p-5 w-80 flex flex-col items-center justify-center text-center gap-3">
        <span className="text-3xl text-gray-300">💡</span>
        <span className="text-xs text-gray-400">
          Selecciona una zona en el croquis para controlarla
        </span>
      </div>
    );
  }

  const lampsOn = zone.lamps.filter((l) => l.isOn).length;

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-5 w-80 flex flex-col gap-4 h-full overflow-y-auto shrink-0">
      <div>
        <h3 className="text-base font-bold text-forest">{zone.name}</h3>
        <div className="flex items-center gap-2 mt-1">
          <span className="text-2xl font-bold text-lime-soft">
            {zone.intensity}%
          </span>
          <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-linear-to-r from-lime-soft to-cyan-accent rounded-full transition-all duration-500"
              style={{ width: `${zone.intensity}%` }}
            />
          </div>
        </div>
        <span className="text-[10px] text-gray-400">
          {lampsOn} / {zone.lamps.length} lámparas encendidas
        </span>
      </div>

      <hr className="border-gray-100" />

      <div className="flex flex-col gap-1.5">
        <span className="text-[10px] text-gray-400 uppercase tracking-wide">
          Acciones Rápidas
        </span>
        <div className="flex gap-2">
          <button
            onClick={() => onTurnAllOn(zone.id)}
            className="flex-1 py-1.5 rounded-lg text-[11px] font-medium border border-lime-soft/40
              bg-lime-soft/15 text-forest hover:bg-lime-soft/25 transition-all duration-200"
          >
            Encender todas
          </button>
          <button
            onClick={() => onTurnAllOff(zone.id)}
            className="flex-1 py-1.5 rounded-lg text-[11px] font-medium border border-coral-soft/40
              bg-coral-soft/10 text-forest hover:bg-coral-soft/20 transition-all duration-200"
          >
            Apagar todas
          </button>
        </div>
      </div>

      <hr className="border-gray-100" />

      <div className="flex flex-col gap-1.5">
        <span className="text-[10px] text-gray-400 uppercase tracking-wide">
          Modo de Control
        </span>
        <div className="flex rounded-lg overflow-hidden text-[11px] font-medium border border-gray-200">
          {(["eco", "manual", "apagado"] as const).map((m) => (
            <button
              key={m}
              onClick={() => onSetMode(zone.id, m)}
              className={`flex-1 py-1.5 border-r last:border-r-0 transition-all duration-200
                ${zone.mode === m ? MODE_CLASS[m] : "text-gray-400 hover:text-forest"}`}
            >
              {MODE_LABELS[m]}
            </button>
          ))}
        </div>
      </div>

      <hr className="border-gray-100" />

      <div className="flex flex-col gap-2">
        <span className="text-[10px] text-gray-400 uppercase tracking-wide">
          Configuración
        </span>

        <label className="text-[11px] text-gray-500">
          Intensidad deseada ({zone.intensity}%)
        </label>
        <input
          type="range"
          min={0}
          max={100}
          value={zone.intensity}
          onChange={(e) => onSetIntensity(zone.id, Number(e.target.value))}
          className="w-full h-1.5 rounded-full appearance-none cursor-pointer
            bg-gray-200 accent-lime-soft
            [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3.5 [&::-webkit-slider-thumb]:h-3.5
            [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-lime-soft
            [&::-webkit-slider-thumb]:shadow-[0_0_4px_rgba(132,196,22,0.5)]"
        />
      </div>

      <hr className="border-gray-100" />

      <div className="flex flex-col gap-1.5">
        <span className="text-[10px] text-gray-400 uppercase tracking-wide">
          Información del Sistema
        </span>
        <div className="bg-gray-50 rounded-lg p-2.5 text-[11px] space-y-1">
          <div className="flex justify-between">
            <span className="text-gray-400">Controlador</span>
            <span className="font-medium text-forest">
              {zone.controllerNode}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">Última actualización</span>
            <span className="font-medium text-forest">{zone.lastUpdated}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-400">Conexión</span>
            <span
              className={`flex items-center gap-1 text-[10px] font-medium ${zone.connected ? "text-lime-soft" : "text-coral-soft"}`}
            >
              <span
                className={`w-1.5 h-1.5 rounded-full ${zone.connected ? "bg-lime-soft" : "bg-coral-soft"}`}
              />
              {zone.connected ? "Conectado" : "Desconectado"}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">Firmware</span>
            <span className="font-medium text-forest">{zone.firmware}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
