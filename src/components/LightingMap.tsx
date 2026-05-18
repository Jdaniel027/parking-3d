import type { LightingZone } from "../types/dashboard";

type Props = {
  zones: LightingZone[];
  selectedZoneId: number | null;
  onSelectZone: (id: number) => void;
  onToggleLamp: (zoneId: number, lampId: number) => void;
};

const LAMP_POSITIONS: { cx: number; cy: number }[] = [
  { cx: 65, cy: 62 }, // 1  — Block 1 (Zone 1, top-left)
  { cx: 155, cy: 62 }, // 2
  { cx: 65, cy: 118 }, // 3
  { cx: 155, cy: 118 }, // 4
  { cx: 65, cy: 382 }, // 5  — Block 2 (Zone 1, bottom-left)
  { cx: 155, cy: 382 }, // 6
  { cx: 65, cy: 438 }, // 7
  { cx: 155, cy: 438 }, // 8
  { cx: 445, cy: 62 }, // 9  — Block 3 (Zone 2, top-right)
  { cx: 535, cy: 62 }, // 10
  { cx: 445, cy: 118 }, // 11
  { cx: 535, cy: 118 }, // 12
  { cx: 445, cy: 382 }, // 13 — Block 4 (Zone 2, bottom-right)
  { cx: 535, cy: 382 }, // 14
  { cx: 445, cy: 438 }, // 15
  { cx: 535, cy: 438 }, // 16
];

const BLOCKS = [
  { x: 20, y: 20, w: 180, h: 140, zoneId: 1 },
  { x: 20, y: 340, w: 180, h: 140, zoneId: 1 },
  { x: 400, y: 20, w: 180, h: 140, zoneId: 2 },
  { x: 400, y: 340, w: 180, h: 140, zoneId: 2 },
];

export default function LightingMap({
  zones,
  selectedZoneId,
  onSelectZone,
  onToggleLamp,
}: Props) {
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-4 flex-1 flex flex-col min-h-0">
      <h2 className="text-sm font-semibold text-forest mb-3 flex items-center gap-2 shrink-0">
        <span className="w-2 h-2 rounded-full bg-cyan-accent" />
        Croquis del Estacionamiento
      </h2>

      <svg
        viewBox="0 0 600 520"
        className="w-[77%] mx-auto aspect-600/420"
        preserveAspectRatio="xMidYMid meet"
      >
        <rect x={0} y={0} width={600} height={520} rx={10} fill="#3a3a3a" />

        <rect x={220} y={0} width={160} height={520} fill="#555" />
        <rect x={0} y={190} width={600} height={140} fill="#555" />

        <rect x={0} y={188} width={600} height={4} fill="#666" />
        <rect x={0} y={328} width={600} height={4} fill="#666" />
        <rect x={218} y={0} width={4} height={520} fill="#666" />
        <rect x={378} y={0} width={4} height={520} fill="#666" />

        <line
          x1={0}
          y1={260}
          x2={218}
          y2={260}
          stroke="white"
          strokeWidth={2}
          strokeDasharray="14 10"
          opacity={0.5}
        />
        <line
          x1={382}
          y1={260}
          x2={600}
          y2={260}
          stroke="white"
          strokeWidth={2}
          strokeDasharray="14 10"
          opacity={0.5}
        />
        <line
          x1={300}
          y1={0}
          x2={300}
          y2={188}
          stroke="white"
          strokeWidth={2}
          strokeDasharray="14 10"
          opacity={0.5}
        />
        <line
          x1={300}
          y1={328}
          x2={300}
          y2={520}
          stroke="white"
          strokeWidth={2}
          strokeDasharray="14 10"
          opacity={0.5}
        />

        {BLOCKS.map((b) => {
          const isSelected = selectedZoneId === b.zoneId;
          const zone = zones.find((z) => z.id === b.zoneId);
          const isOff = zone?.mode === "apagado";
          const fillColor = isSelected
            ? isOff
              ? "#fca5a5"
              : "#86efac"
            : isOff
              ? "#6b7280"
              : "#7c3aed";
          const strokeColor = isSelected
            ? isOff
              ? "#ef4444"
              : "#22c55e"
            : "#9ca3af";

          return (
            <g key={`block-${b.zoneId}-${b.x}`}>
              <rect
                x={b.x}
                y={b.y}
                width={b.w}
                height={b.h}
                rx={8}
                fill={fillColor}
                stroke={strokeColor}
                strokeWidth={isSelected ? 2.5 : 1.5}
                className={`transition-all duration-300 ${isSelected ? "" : "hover:brightness-110"}`}
                onClick={() => onSelectZone(b.zoneId)}
                style={{ cursor: "pointer" }}
              />
              <text
                x={b.x + b.w / 2}
                y={b.y + b.h / 2 + 2}
                textAnchor="middle"
                fontSize={11}
                fontWeight="bold"
                fill={isSelected ? "#015249" : "#e5e7eb"}
                className="pointer-events-none"
              >
                Zona {zone?.name.split(" ").pop()}
              </text>
            </g>
          );
        })}

        {zones.flatMap((z) =>
          z.lamps.map((lamp) => {
            const pos = LAMP_POSITIONS[lamp.id - 1];
            if (!pos) return null;
            const isSelected = selectedZoneId === z.id;
            return (
              <circle
                key={`lamp-${lamp.id}`}
                cx={pos.cx}
                cy={pos.cy}
                r={6}
                fill={lamp.isOn ? "#a78bfa" : "#4b5563"}
                stroke={isSelected ? "#22c55e" : "none"}
                strokeWidth={isSelected && lamp.isOn ? 1.5 : 0}
                className="transition-all duration-200 hover:brightness-125"
                onClick={() => onToggleLamp(z.id, lamp.id)}
                style={{ cursor: "pointer" }}
              />
            );
          }),
        )}

        <text
          x={300}
          y={268}
          textAnchor="middle"
          fill="#999"
          fontSize={11}
          className="pointer-events-none"
        >
          Intersección
        </text>
      </svg>

      <div className="flex items-center gap-5 mt-3 text-[10px] text-gray-500">
        <span className="flex items-center gap-1">
          <span className="w-2.5 h-2.5 rounded-sm bg-violet-400 inline-block" />{" "}
          Lámpara
        </span>
        <span className="flex items-center gap-1">
          <span className="w-2.5 h-2.5 rounded-sm bg-green-400 inline-block" />{" "}
          Zona activa
        </span>
        <span className="flex items-center gap-1">
          <span className="w-2.5 h-2.5 rounded-sm bg-gray-500 inline-block" />{" "}
          Zona apagada
        </span>
        <span className="flex items-center gap-1">
          <span className="w-3 h-1.5 rounded-sm bg-[#555] inline-block" /> Vía
        </span>
      </div>
    </div>
  );
}
