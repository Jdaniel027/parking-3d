import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";

function Box() {
  return (
    <mesh>
      <boxGeometry args={[2, 2, 2]} />
      <meshStandardMaterial color="#6366f1" />
    </mesh>
  );
}

function Scene() {
  return (
    <Canvas
      camera={{ position: [5, 5, 5], fov: 50 }}
      style={{ width: "100%", height: "100%" }}
    >
      <ambientLight intensity={0.5} />
      <directionalLight position={[5, 5, 5]} intensity={1} />
      <Box />
      <OrbitControls />
      <gridHelper args={[20, 20]} />
    </Canvas>
  );
}

export default Scene;
