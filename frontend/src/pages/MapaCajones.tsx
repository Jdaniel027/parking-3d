import { useEffect, useState } from "react";
import { useParking } from "../hooks/useParking";

function Elapsed({ parkedAt }: { parkedAt: number | null }) {
  const [now, setNow] = useState(Date.now());
  useEffect(() => {
    if (!parkedAt) return;
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, [parkedAt]);

  if (!parkedAt) return null;
  const sec = Math.floor((Date.now() - parkedAt) / 1000);
  const min = Math.floor(sec / 60);
  const s = sec % 60;
  const cost = (sec < 120 ? 1 : Math.floor((sec - 120) / 60) + 2) * 15;
  return (
    <span className="flex flex-col items-center gap-0.5">
      <span className="flex items-center gap-1">
        <svg viewBox="0 0 12 12" className="w-2.5 h-2.5" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <circle cx={6} cy={6} r={5} />
          <path d="M6 3v3l2 2" />
        </svg>
        {sec < 60 ? `${sec}s` : `${min}:${String(s).padStart(2, "0")}`}
      </span>
      <span className="text-[8px] font-medium text-red-600/80">${cost} MXN</span>
    </span>
  );
}

function ParkingBay({
  occupied,
  num,
  parkedAt,
}: {
  occupied: boolean;
  num: string;
  parkedAt: number | null;
}) {
  return (
    <div
      className={`flex flex-col items-stretch rounded-xl border-2 transition-all duration-300 overflow-hidden ${occupied ? "border-red-400 bg-red-50" : "border-lime-400 bg-lime-50"}`}
    >
      <div className="flex items-center justify-center py-8">
        <span
          className={`text-3xl font-black ${occupied ? "text-red-500" : "text-lime-600"}`}
        >
          {num}
        </span>
      </div>
      <div
        className={`text-center text-[9px] font-semibold py-1 ${occupied ? "bg-red-100 text-red-700" : "bg-lime-100 text-lime-700"}`}
      >
        {occupied ? (
          <Elapsed parkedAt={parkedAt} />
        ) : "Libre"}
      </div>
    </div>
  );
}

function DonutChart({ pct }: { pct: number }) {
  const r = 36;
  const circ = 2 * Math.PI * r;
  const filled = circ * (pct / 100);
  return (
    <svg viewBox="0 0 100 100" className="w-28 h-28">
      <circle
        cx={50}
        cy={50}
        r={r}
        fill="none"
        stroke="#e5e7eb"
        strokeWidth={8}
      />
      <circle
        cx={50}
        cy={50}
        r={r}
        fill="none"
        stroke="#ef4444"
        strokeWidth={8}
        strokeDasharray={`${filled} ${circ - filled}`}
        strokeLinecap="round"
        transform="rotate(-90 50 50)"
        className="transition-all duration-700"
      />
      <text
        x={50}
        y={46}
        textAnchor="middle"
        fill="#1f2937"
        fontSize={16}
        fontWeight="bold"
        fontFamily="Inter, sans-serif"
      >
        {pct}%
      </text>
      <text
        x={50}
        y={60}
        textAnchor="middle"
        fill="#6b7280"
        fontSize={7}
        fontFamily="Inter, sans-serif"
      >
        Ocupación
      </text>
    </svg>
  );
}

export default function MapaCajones() {
  const { cajones, ocupados, disponibles, porcentaje } = useParking();
  const spots = cajones.map(c => ({
    id: c.id,
    occupied: c.ocupado,
    parkedAt: null as number | null
  }));
  const available = disponibles;
  const occupied = ocupados;
  const pct = porcentaje;
  const totalEntries = 0;
  const dailyEntries = [0, 0, 0, 0, 0, 0, 0];
  const [ts, setTs] = useState(Date.now());

  useEffect(() => {
    const id = setInterval(() => setTs(Date.now()), 2000);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="h-full flex flex-col gap-4">
      {/* title */}
      <div className="flex items-center gap-3 shrink-0">
        <svg
          viewBox="0 0 20 20"
          className="w-5 h-5 text-cyan-accent"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M4 4h7v7H4V4zm9 0h7v7h-7V4zM4 13h7v7H4v-7zm9 0h7v7h-7v-7z" />
        </svg>
        <div>
          <h1 className="text-base font-bold text-forest">
            P3 — Mapa de Cajones
          </h1>
          <p className="text-[11px] text-forest-muted">
            Monitoreo en tiempo real de disponibilidad
          </p>
        </div>
      </div>

      <div className="flex-1 flex gap-5 min-h-0">
        {/* ─── left column 60% ─── */}
        <div className="w-[60%] shrink-0 flex flex-col gap-4 min-h-0">
          {/* CCTV panel */}
          <div className="bg-gray-900 rounded-xl border border-gray-700 flex flex-col min-h-0 flex-1 overflow-hidden">
            <div className="flex items-center justify-between px-4 py-2 bg-gray-800 border-b border-gray-700 shrink-0">
              <span className="text-[11px] font-medium text-gray-300 tracking-wide">
                CAM_01 · Arducam
              </span>
              <span className="text-[10px] font-mono text-green-400 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                LIVE
              </span>
            </div>

            <div className="flex-1 relative bg-gradient-to-b from-gray-800 to-gray-900 min-h-0 overflow-hidden">
              <img
                src={`http://${window.location.hostname}:3000/camera/en_vivo.jpg?t=${ts}`}
                className="absolute inset-0 w-full h-full object-contain"
                alt="Cámara en vivo"
              />
            </div>
          </div>

        </div>

        {/* ─── right column 40% ─── */}
        <div className="flex-1 flex flex-col gap-4 min-h-0">
          {/* KPIs card */}
          <div className="bg-white border border-gray-200 rounded-xl p-5 shrink-0">
            <span className="text-xs text-gray-500 font-medium mb-4 block">
              Estadísticas Rápidas de Ocupación
            </span>
            <div className="flex items-center gap-6">
              <DonutChart pct={pct} />
              <div className="flex gap-3">
                <div className="flex-1 flex items-center gap-3 px-4 py-3 rounded-lg border border-lime-300 bg-lime-50">
                  <span className="w-3 h-3 rounded-full bg-lime-500" />
                  <div>
                    <span className="text-[10px] text-lime-700 font-medium">
                      Disponibles
                    </span>
                    <div className="text-xl font-bold text-lime-700">
                      {available}
                    </div>
                  </div>
                </div>
                <div className="flex-1 flex items-center gap-3 px-4 py-3 rounded-lg border border-red-300 bg-red-50">
                  <span className="w-3 h-3 rounded-full bg-red-500" />
                  <div>
                    <span className="text-[10px] text-red-700 font-medium">
                      Ocupados
                    </span>
                    <div className="text-xl font-bold text-red-700">
                      {occupied}
                    </div>
                  </div>
            </div>
            <div className="mt-3 flex items-center gap-1.5 text-[10px] text-gray-400">
              <svg viewBox="0 0 12 12" className="w-3 h-3 shrink-0" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M6 1v5l3 3" />
                <circle cx={6} cy={6} r={5} />
              </svg>
              Tarifa: $15 / hora
            </div>
          </div>
            </div>
          </div>

          {/* Physical map card */}
          <div className="bg-white border border-gray-200 rounded-xl p-5 flex-1 flex flex-col min-h-0">
            <span className="text-xs text-gray-500 font-medium mb-3 block shrink-0">
              Croquis / Mapa de Cajones Físico
            </span>

            <div className="flex-1 flex flex-col gap-3 min-h-0">
              {/* top row: spots 1-5 */}
              <div className="grid grid-cols-5 gap-2 h-fit">
                {spots.map((s) => (
                  <ParkingBay
                    key={s.id}
                    occupied={s.occupied}
                    num={`C${s.id}`}
                    parkedAt={s.parkedAt}
                  />
                ))}
              </div>

              {/* legend */}
              <div className="flex flex-col items-center gap-1 shrink-0">
                <div className="flex items-center justify-center gap-5 text-[11px] font-medium">
                  <span className="flex items-center gap-1.5 text-lime-700">
                    <span className="w-2 h-2 rounded-full bg-lime-500" /> Libre
                  </span>
                  <span className="text-gray-300">|</span>
                  <span className="flex items-center gap-1.5 text-red-700">
                    <span className="w-2 h-2 rounded-full bg-red-500" /> Ocupado
                  </span>
                </div>
                <span className="text-[9px] text-gray-400">Tarifa: $15 / hora</span>
              </div>

              {/* traffic chart */}
              <div className="border-t border-gray-100 pt-3 mt-1 shrink-0">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-medium text-gray-500">Flujo diario</span>
                  <span className="text-sm font-bold text-forest">{totalEntries}</span>
                </div>
                <div className="flex items-center gap-3 h-32">
                  <div className="flex-1 h-full flex flex-col justify-end">
                    <div className="w-full rounded-sm transition-all duration-500 bg-cyan-accent" style={{ height: `${totalEntries > 0 ? Math.min(totalEntries * 10, 100) : 6}%` }} />
                  </div>
                  <div className="flex flex-col items-center gap-0.5 shrink-0">
                    <span className="text-2xl font-bold text-forest">{totalEntries}</span>
                    <span className="text-[8px] text-gray-400">hoy</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
