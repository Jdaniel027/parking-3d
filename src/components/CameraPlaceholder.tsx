export default function CameraPlaceholder() {
  return (
    <div className="bg-gray-50 border border-gray-200 rounded-xl p-6
      flex flex-col items-center justify-center gap-4 aspect-video"
    >
      <div className="w-12 h-12 rounded-full border-2 border-gray-200 flex items-center justify-center">
        <span className="text-2xl text-cyan-accent/60">◉</span>
      </div>
      <div className="text-center">
        <span className="text-sm text-forest font-medium">Transmisión en Vivo - Arducam (OpenCV)</span>
        <div className="text-[10px] text-forest-muted mt-1">Feed de video en espera...</div>
      </div>
    </div>
  )
}
