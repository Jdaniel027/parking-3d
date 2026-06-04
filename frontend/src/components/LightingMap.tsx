import type { LightingZone } from "../types/dashboard";

type Props = { zones: LightingZone[]; selectedZoneId: number | null; onSelectZone: (id: number) => void; onToggleLamp: (zoneId: number, lampId: number) => void };

// Bloque izquierdo (Zone 1, Zona Este) — 8 lámparas: 2 arriba, 2 izquierda, 2 derecha, 2 abajo
const L1 = { cx: 60, cy: 14 };
const L2 = { cx: 240, cy: 14 };
const L3 = { cx: 14, cy: 170 };
const L4 = { cx: 14, cy: 340 };
const L5 = { cx: 278, cy: 170 };
const L6 = { cx: 278, cy: 340 };
const L7 = { cx: 60, cy: 506 };
const L8 = { cx: 240, cy: 506 };

// Bloque derecho (Zone 2, Zona Oeste) — 8 lámparas: 2 arriba, 2 izquierda, 2 derecha, 2 abajo
const L9 = { cx: 360, cy: 14 };
const L10 = { cx: 540, cy: 14 };
const L11 = { cx: 322, cy: 170 };
const L12 = { cx: 322, cy: 340 };
const L13 = { cx: 586, cy: 170 };
const L14 = { cx: 586, cy: 340 };
const L15 = { cx: 360, cy: 506 };
const L16 = { cx: 540, cy: 506 };

const LP = [L1, L2, L3, L4, L5, L6, L7, L8, L9, L10, L11, L12, L13, L14, L15, L16];

const BLOCKS = [
  {
    path: "M 35,25 L 268,28 L 268,235 L 258,250 L 268,265 L 268,488 L 35,485 Z",
    zoneId: 1,
    centerX: 155,
    centerY: 255,
  },
  {
    path: "M 332,28 L 565,25 L 565,485 L 332,488 L 332,265 L 342,250 L 332,235 Z",
    zoneId: 2,
    centerX: 445,
    centerY: 255,
  },
];

export default function LightingMap({ zones, selectedZoneId, onSelectZone, onToggleLamp }: Props) {
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-4 flex-1 flex flex-col min-h-0">
      <h2 className="text-sm font-semibold text-forest mb-3 flex items-center gap-2 shrink-0">
        <svg viewBox="0 0 16 16" className="w-3.5 h-3.5 text-cyan-accent" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M8 2a5 5 0 00-3.5 8.6c1 1 1.5 2.2 1.5 3h4c0-.8.5-2 1.5-3A5 5 0 008 2zM7 14h2M7.5 16h1" />
        </svg>
        Croquis del Estacionamiento
      </h2>
      <svg viewBox="0 0 600 520" className="w-[85%] mx-auto aspect-[600/420]" preserveAspectRatio="xMidYMid meet">
        <defs>
          <filter id="glow-purple" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="3.5" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <filter id="glow-green" x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation="6" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <filter id="glow-selected" x="-40%" y="-40%" width="180%" height="180%">
            <feGaussianBlur stdDeviation="8" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#1e293b" strokeWidth="0.5" />
          </pattern>
          <linearGradient id="glass" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="rgba(255,255,255,0.07)" />
            <stop offset="50%" stopColor="rgba(255,255,255,0.02)" />
            <stop offset="100%" stopColor="rgba(255,255,255,0)" />
          </linearGradient>
          <radialGradient id="bg-glow" cx="50%" cy="50%" r="60%">
            <stop offset="0%" stopColor="#1e293b" stopOpacity="1" />
            <stop offset="100%" stopColor="#0f172a" stopOpacity="1" />
          </radialGradient>
        </defs>

        <rect x={0} y={0} width={600} height={520} rx={10} fill="url(#bg-glow)" />
        <rect x={0} y={0} width={600} height={520} fill="url(#grid)" rx={10} />

        <rect x={280} y={0} width={40} height={520} fill="#1e293b" />
        <rect x={278} y={0} width={2} height={520} fill="#334155" />
        <rect x={320} y={0} width={2} height={520} fill="#334155" />
        <line x1={300} y1={0} x2={300} y2={520} stroke="#475569" strokeWidth={1.5} strokeDasharray="14 10" opacity={0.5} />

        <path d="M300,70 L291,85 L309,85 Z" fill="#475569" opacity={0.45} />
        <path d="M300,450 L291,435 L309,435 Z" fill="#475569" opacity={0.45} />
        <text x={300} y={268} textAnchor="middle" fill="#475569" fontSize={9} opacity={0.45} letterSpacing="2">VÍA CENTRAL</text>

        {BLOCKS.map((b) => {
          const sel = selectedZoneId === b.zoneId;
          const zone = zones.find((z) => z.id === b.zoneId);
          const off = zone?.mode === "apagado";

          const baseFill = off ? "#0f172a" : "rgba(124, 58, 237, 0.12)";
          const activeFill = sel ? (off ? "#1a0a0a" : "rgba(34, 197, 94, 0.15)") : baseFill;
          const borderColor = sel ? (off ? "#ef4444" : "#22c55e") : (off ? "#1e293b" : "rgba(124, 58, 237, 0.3)");

          return (
            <g key={`b-${b.zoneId}`} onClick={() => onSelectZone(b.zoneId)} className="cursor-pointer transition-all duration-150 hover:opacity-85 active:opacity-70">
              {sel && !off && (
                <path
                  d={b.path}
                  fill="rgba(34, 197, 94, 0.12)"
                  filter="url(#glow-green)"
                  className="transition-all duration-500"
                />
              )}
              <path
                d={b.path}
                fill={activeFill}
                stroke={borderColor}
                strokeWidth={sel ? 2.5 : 1.5}
                strokeLinejoin="round"
                className="transition-all duration-300 hover:brightness-125"
              />
              <path d={b.path} fill="url(#glass)" strokeLinejoin="round" pointerEvents="none" />
              {sel && (
                <path
                  d={b.path}
                  fill="none"
                  stroke={off ? "#ef4444" : "#22c55e"}
                  strokeWidth={1}
                  strokeLinejoin="round"
                  opacity={0.3}
                  filter="url(#glow-selected)"
                  pointerEvents="none"
                />
              )}
              <text
                x={b.centerX}
                y={b.centerY + 2}
                textAnchor="middle"
                fontSize={12}
                fontWeight="bold"
                fill={sel ? (off ? "#fca5a5" : "#86efac") : (off ? "#475569" : "#c4b5fd")}
                className="pointer-events-none transition-all duration-300"
              >
                Zona {zone?.name.split(" ").pop()}
              </text>
            </g>
          );
        })}

        {zones.flatMap((z) => z.lamps.map((lamp) => {
          const p = LP[lamp.id - 1];
          if (!p) return null;
          const az = selectedZoneId === z.id;
          const isActive = lamp.isOn;

          return (
            <g key={`l-${lamp.id}`}>
              {isActive && (
                <circle
                  cx={p.cx}
                  cy={p.cy}
                  r={11}
                  fill="#a78bfa"
                  opacity={0.35}
                  filter="url(#glow-purple)"
                  className="transition-all duration-300"
                />
              )}
              <circle
                cx={p.cx}
                cy={p.cy}
                r={6.5}
                fill={isActive ? "#c4b5fd" : "#1e293b"}
                stroke={isActive ? (az ? "#84cc16" : "#a78bfa") : "#334155"}
                strokeWidth={isActive ? 2 : 1}
                className="transition-all duration-150 hover:brightness-150 hover:scale-125 active:scale-110"
                onClick={() => onToggleLamp(z.id, lamp.id)}
                style={{ cursor: "pointer" }}
              />
              {isActive && (
                <circle
                  cx={p.cx}
                  cy={p.cy}
                  r={3}
                  fill="rgba(255,255,255,0.6)"
                  className="pointer-events-none"
                />
              )}
            </g>
          );
        }))}
      </svg>
      <div className="flex items-center gap-5 mt-3 text-[10px] text-gray-500">
        <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-sm bg-violet-400 inline-block" /> Lámpara</span>
        <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-sm bg-green-400 inline-block" /> Zona activa</span>
        <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-sm bg-slate-500 inline-block" /> Zona apagada</span>
      </div>
    </div>
  );
}
