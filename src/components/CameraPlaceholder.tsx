export default function CameraPlaceholder() {
  return (
    <div className="bg-white/[0.04] backdrop-blur-md border border-white/[0.06] rounded-2xl p-6
      flex flex-col items-center justify-center gap-4 aspect-video"
    >
      <div className="w-12 h-12 rounded-full border-2 border-white/20 flex items-center justify-center">
        <span className="text-2xl text-white/30">◉</span>
      </div>
      <div className="text-center">
        <span className="text-sm text-white/40 font-medium">Transmisión en Vivo - Arducam (OpenCV)</span>
        <div className="text-[10px] text-white/20 mt-1">Feed de video en espera...</div>
      </div>
    </div>
  )
}
