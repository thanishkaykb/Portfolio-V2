import { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";
import GoldenDust from "./GoldenDust";

function Rings() {
  const group = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (!group.current) return;
    const { x, y } = state.pointer;
    group.current.rotation.y = THREE.MathUtils.lerp(group.current.rotation.y, x * 0.22, 0.04);
    group.current.rotation.x = THREE.MathUtils.lerp(group.current.rotation.x, -y * 0.12, 0.04);
    group.current.position.y = Math.sin(state.clock.elapsedTime * 0.35) * 0.08;
  });

  return (
    <group ref={group} position={[0.6, 0.1, 0]}>
      {[1.55, 2.0, 2.55].map((radius, index) => (
        <mesh
          key={radius}
          rotation={[Math.PI / 2 + index * 0.12, index * 0.22, index * 0.35]}
        >
          <torusGeometry args={[radius, 0.004, 8, 140]} />
          <meshBasicMaterial
            color="#FFC928"
            transparent
            opacity={0.34 - index * 0.07}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
          />
        </mesh>
      ))}
      <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 0, -0.4]}>
        <ringGeometry args={[1.05, 1.06, 120]} />
        <meshBasicMaterial color="#F5F2E9" transparent opacity={0.22} side={THREE.DoubleSide} />
      </mesh>
      <mesh>
        <sphereGeometry args={[1.9, 32, 32]} />
        <meshBasicMaterial color="#FFC928" transparent opacity={0.03} side={THREE.BackSide} />
      </mesh>
    </group>
  );
}

export default function HeroScene({
  paused,
  reduced,
}: {
  paused: boolean;
  reduced?: boolean;
}) {
  return (
    <Canvas
      frameloop={paused ? "never" : reduced ? "demand" : "always"}
      dpr={[1, 1.5]}
      performance={{ min: 0.6 }}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      camera={{ position: [0, 0, 5.4], fov: 46 }}
      style={{ pointerEvents: "none" }}
      aria-hidden
    >
      <ambientLight intensity={0.8} />
      <pointLight position={[3, 3, 5]} intensity={22} color="#FFC928" distance={16} />
      <Rings />
      <GoldenDust count={700} spread={[13, 7.5, 6]} size={0.017} opacity={0.5} />
      <GoldenDust count={220} spread={[9, 5, 4]} size={0.032} opacity={0.35} speed={0.03} />
    </Canvas>
  );
}
