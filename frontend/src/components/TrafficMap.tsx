import type { TrafficLight } from '../types/dashboard'

type Props = {
  lights: TrafficLight[]
  selectedId: number | null
  onSelect: (id: number) => void
}

const SEMAFORO_NORTE_X = 250
const SEMAFORO_NORTE_Y = 97
const SEMAFORO_SUR_X = 250
const SEMAFORO_SUR_Y = 402
const SEMAFORO_ESTE_X = 422
const SEMAFORO_ESTE_Y = 320
const SEMAFORO_OESTE_X = 130
const SEMAFORO_OESTE_Y = 97

const POSITIONS: Record<number, { cx: number; cy: number }> = {
  1: { cx: SEMAFORO_NORTE_X, cy: SEMAFORO_NORTE_Y },
  2: { cx: SEMAFORO_SUR_X, cy: SEMAFORO_SUR_Y },
  3: { cx: SEMAFORO_ESTE_X, cy: SEMAFORO_ESTE_Y },
  4: { cx: SEMAFORO_OESTE_X, cy: SEMAFORO_OESTE_Y },
}

const ROTATIONS: Record<number, number> = {
  1: 0,
  2: 0,
  3: 90,
  4: 0,
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

function ArrowRight({ cx, cy }: { cx: number; cy: number }) {
  return (
    <g transform={`translate(${cx}, ${cy})`} opacity={0.6}>
      <line x1={-22} y1={0} x2={12} y2={0} stroke="white" strokeWidth={3} strokeLinecap="round" />
      <polygon points="12,-7 24,0 12,7" fill="white" />
    </g>
  )
}

function ArrowLeft({ cx, cy }: { cx: number; cy: number }) {
  return (
    <g transform={`translate(${cx}, ${cy})`} opacity={0.6}>
      <line x1={22} y1={0} x2={-12} y2={0} stroke="white" strokeWidth={3} strokeLinecap="round" />
      <polygon points="-12,-7 -24,0 -12,7" fill="white" />
    </g>
  )
}

function ArrowDown({ cx, cy }: { cx: number; cy: number }) {
  return (
    <g transform={`translate(${cx}, ${cy})`} opacity={0.6}>
      <line x1={0} y1={-22} x2={0} y2={12} stroke="white" strokeWidth={3} strokeLinecap="round" />
      <polygon points="-7,12 0,24 7,12" fill="white" />
    </g>
  )
}

function ArrowUp({ cx, cy }: { cx: number; cy: number }) {
  return (
    <g transform={`translate(${cx}, ${cy})`} opacity={0.6}>
      <line x1={0} y1={22} x2={0} y2={-12} stroke="white" strokeWidth={3} strokeLinecap="round" />
      <polygon points="-7,-12 0,-24 7,-12" fill="white" />
    </g>
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
        <svg viewBox="0 0 500 500" className="w-full max-w-[85%] mx-auto aspect-square" preserveAspectRatio="xMidYMid meet">
          <filter id="shadow" x="-10%" y="-10%" width="130%" height="130%">
            <feDropShadow dx={1} dy={2} stdDeviation={2} floodColor="#000" floodOpacity={0.35} />
          </filter>

          <rect x={0} y={0} width={500} height={500} rx={12} fill="#3a3a3a" />

          <rect x={0} y={0} width={50} height={500} fill="#2d5a27" />
          <circle cx={25} cy={120} r={10} fill="#3a7a32" opacity={0.8} />
          <circle cx={25} cy={250} r={12} fill="#3a7a32" opacity={0.8} />
          <circle cx={25} cy={380} r={10} fill="#3a7a32" opacity={0.8} />

          <rect x={50} y={70} width={400} height={55} fill="#555" rx={2} />
          <rect x={50} y={375} width={400} height={55} fill="#555" rx={2} />
          <rect x={50} y={70} width={55} height={360} fill="#555" />
          <rect x={395} y={70} width={55} height={360} fill="#555" />
          <rect x={220} y={125} width={60} height={250} fill="#555" rx={2} />

          <rect x={50} y={68} width={400} height={2} fill="#666" />
          <rect x={50} y={125} width={400} height={2} fill="#666" />
          <rect x={50} y={373} width={400} height={2} fill="#666" />
          <rect x={50} y={430} width={400} height={2} fill="#666" />

          <rect x={48} y={70} width={2} height={360} fill="#666" />
          <rect x={105} y={70} width={2} height={360} fill="#666" />
          <rect x={393} y={70} width={2} height={360} fill="#666" />
          <rect x={450} y={70} width={2} height={360} fill="#666" />

          <rect x={218} y={125} width={2} height={250} fill="#666" />
          <rect x={280} y={125} width={2} height={250} fill="#666" />

          <line x1={105} y1={97} x2={220} y2={97} stroke="white" strokeWidth={2} strokeDasharray="10 8" opacity={0.5} />
          <line x1={280} y1={97} x2={395} y2={97} stroke="white" strokeWidth={2} strokeDasharray="10 8" opacity={0.5} />
          <line x1={105} y1={402} x2={220} y2={402} stroke="white" strokeWidth={2} strokeDasharray="10 8" opacity={0.5} />
          <line x1={280} y1={402} x2={395} y2={402} stroke="white" strokeWidth={2} strokeDasharray="10 8" opacity={0.5} />
          <line x1={77} y1={125} x2={77} y2={375} stroke="white" strokeWidth={2} strokeDasharray="10 8" opacity={0.5} />
          <line x1={422} y1={125} x2={422} y2={375} stroke="white" strokeWidth={2} strokeDasharray="10 8" opacity={0.5} />
          <line x1={250} y1={125} x2={250} y2={375} stroke="white" strokeWidth={2} strokeDasharray="10 8" opacity={0.5} />

          <g filter="url(#shadow)">
            <rect x={105} y={125} width={115} height={125} rx={4} fill="#4a4a4a" stroke="#5a5a5a" strokeWidth={1} />
            <rect x={280} y={125} width={115} height={125} rx={4} fill="#4a4a4a" stroke="#5a5a5a" strokeWidth={1} />
            <rect x={105} y={250} width={115} height={125} rx={4} fill="#4a4a4a" stroke="#5a5a5a" strokeWidth={1} />
            <rect x={280} y={250} width={115} height={125} rx={4} fill="#4a4a4a" stroke="#5a5a5a" strokeWidth={1} />
          </g>

          <ArrowRight cx={160} cy={97} />
          <ArrowRight cx={340} cy={97} />
          <ArrowDown cx={422} cy={200} />
          <ArrowDown cx={422} cy={310} />
          <ArrowLeft cx={160} cy={402} />
          <ArrowLeft cx={340} cy={402} />
          <ArrowUp cx={77} cy={200} />
          <ArrowUp cx={77} cy={310} />
          <ArrowDown cx={250} cy={190} />
          <ArrowDown cx={250} cy={300} />

          {lights.map((tl) => {
            const pos = POSITIONS[tl.id]
            if (!pos) return null
            const isSelected = selectedId !== null && ((tl.id <= 2 && selectedId <= 2) || (tl.id > 2 && selectedId > 2))
            const rotation = ROTATIONS[tl.id]

            return (
              <g
                key={tl.id}
                onClick={() => onSelect(tl.id <= 2 ? 1 : 3)}
                className="cursor-pointer transition-all duration-150 hover:opacity-85 active:opacity-70"
              >
                {isSelected && (
                  <rect
                    x={pos.cx - (rotation === 90 ? 26 : 22)}
                    y={pos.cy - (rotation === 90 ? 22 : 32)}
                    width={rotation === 90 ? 52 : 44}
                    height={rotation === 90 ? 44 : 64}
                    rx={8}
                    fill="none"
                    stroke="#06b6d4"
                    strokeWidth={2.5}
                    className="animate-pulse"
                  />
                )}

                {rotation > 0 ? (
                  <g transform={`rotate(${rotation}, ${pos.cx}, ${pos.cy})`}>
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
                  </g>
                ) : (
                  <>
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
                  </>
                )}

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
