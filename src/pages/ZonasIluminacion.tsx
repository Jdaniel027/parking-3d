import { useLightingZones } from '../hooks/useLightingZones'
import LightingSection from '../components/LightingSection'

export default function ZonasIluminacion() {
  const { zones, setMode, setBrightness } = useLightingZones()

  return (
    <div className="max-w-4xl mx-auto">
      <LightingSection
        zones={zones}
        onSetMode={setMode}
        onSetBrightness={setBrightness}
      />
    </div>
  )
}
