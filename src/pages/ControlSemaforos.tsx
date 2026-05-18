import { useTrafficLights } from '../hooks/useTrafficLights'
import TrafficLightSection from '../components/TrafficLightSection'

export default function ControlSemaforos() {
  const { lights, setMode, setActiveColor } = useTrafficLights()

  return (
    <TrafficLightSection
      lights={lights}
      onSetMode={setMode}
      onSetColor={setActiveColor}
    />
  )
}
