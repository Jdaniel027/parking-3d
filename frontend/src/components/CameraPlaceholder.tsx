export default function CameraPlaceholder() {
  return (
    <div className="bg-gray-50 border border-gray-200 rounded-xl p-6 flex-1 flex flex-col min-h-0 items-center justify-center gap-4">
      <div className="w-12 h-12 rounded-full border-2 border-gray-200 flex items-center justify-center">
        <svg viewBox="0 0 24 24" className="w-6 h-6 text-cyan-accent/60" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2v11z" />
          <circle cx="12" cy="13" r="4" />
        </svg>
      </div>
      <div className="text-center">
        <span className="text-sm text-forest font-medium">Transmisión en Vivo - Arducam (OpenCV)</span>
        <div className="text-[10px] text-forest-muted mt-1">Feed de video en espera...</div>
      </div>
    </div>
  )
}
