import type { TrafficLight } from '../types/dashboard'

type Props = {
  lights: TrafficLight[]
  selectedId: number | null
  onSelect: (id: number) => void
}

const POSITIONS: Record<number, { cx: number; cy: number }> = {
  1: { cx: 250, cy: 105 },
  2: { cx: 250, cy: 395 },
  3: { cx: 395, cy: 250 },
  4: { cx: 105, cy: 250 },
}

const DIRECTIONS: Record<number, string> = {
  1: 'Norte',
  2: 'Sur',
  3: 'Este',
  4: 'Oeste',
}

function LightBulb({ cx, cy, color, lit }: { cx: number; cy: number; color: string; lit: boolean }) {
  return (
    <circle
      cx={cx}
      cy={cy}
      r={7}
      fill={lit ? color : '#555'}
      className="transition-all duration-300"
    />
  )
}

export default function TrafficMap({ lights, selectedId, onSelect }: Props) {
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-4 flex-1 flex flex-col min-h-0">
      <h2 className="text-sm font-semibold text-forest mb-3 flex items-center gap-2 shrink-0">
        <span className="w-2 h-2 rounded-full bg-cyan-accent" />
        Croquis de Intersección
      </h2>

      <div className="flex-1 flex flex-col min-h-0 justify-center">
        <svg viewBox="0 0 500 500" className="w-full max-w-[57%] mx-auto aspect-square" preserveAspectRatio="xMidYMid meet">
        <rect x={0} y={0} width={500} height={500} rx={12} fill="#3a3a3a" />

        <rect x={0} y={190} width={500} height={120} fill="#555" />
        <rect x={190} y={0} width={120} height={500} fill="#555" />

        <rect x={0} y={188} width={500} height={4} fill="#666" />
        <rect x={0} y={308} width={500} height={4} fill="#666" />
        <rect x={188} y={0} width={4} height={500} fill="#666" />
        <rect x={308} y={0} width={4} height={500} fill="#666" />

        <line x1={0} y1={250} x2={188} y2={250} stroke="white" strokeWidth={2} strokeDasharray="12 8" opacity={0.6} />
        <line x1={312} y1={250} x2={500} y2={250} stroke="white" strokeWidth={2} strokeDasharray="12 8" opacity={0.6} />
        <line x1={250} y1={0} x2={250} y2={188} stroke="white" strokeWidth={2} strokeDasharray="12 8" opacity={0.6} />
        <line x1={250} y1={312} x2={250} y2={500} stroke="white" strokeWidth={2} strokeDasharray="12 8" opacity={0.6} />

        {lights.map((tl) => {
          const pos = POSITIONS[tl.id]
          if (!pos) return null
          const isSelected = tl.id === selectedId

          return (
            <g
              key={tl.id}
              onClick={() => onSelect(tl.id)}
              className="cursor-pointer"
            >
              {isSelected && (
                <rect
                  x={pos.cx - 22}
                  y={pos.cy - 32}
                  width={44}
                  height={64}
                  rx={8}
                  fill="none"
                  stroke="#06b6d4"
                  strokeWidth={2.5}
                  className="animate-pulse"
                />
              )}

              <rect
                x={pos.cx - 16}
                y={pos.cy - 26}
                width={32}
                height={52}
                rx={6}
                fill="#222"
                stroke={isSelected ? '#06b6d4' : '#555'}
                strokeWidth={isSelected ? 2 : 1}
                className="transition-all duration-300"
              />

              <LightBulb cx={pos.cx} cy={pos.cy - 14} color="#fb7185" lit={tl.activeColor === 'red'} />
              <LightBulb cx={pos.cx} cy={pos.cy} color="#fbbf24" lit={tl.activeColor === 'yellow'} />
              <LightBulb cx={pos.cx} cy={pos.cy + 14} color="#84cc16" lit={tl.activeColor === 'green'} />

              <text
                x={pos.cx}
                y={pos.cy + 38}
                textAnchor="middle"
                fill={isSelected ? '#06b6d4' : '#aaa'}
                fontSize={11}
                fontWeight={isSelected ? 'bold' : 'normal'}
                className="transition-all duration-300"
              >
                {DIRECTIONS[tl.id]}
              </text>
            </g>
          )
        })}
      </svg>
      </div>
    </div>
  )
}
