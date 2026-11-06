import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

type Props = {
  count?: number;
  spread?: [number, number, number];
  size?: number;
  opacity?: number;
  speed?: number;
};

/** Fine golden dust used behind the hero and inside the door corridor. */
export default function GoldenDust({
  count = 650,
  spread = [14, 8, 8],
  size = 0.016,
  opacity = 0.55,
  speed = 0.014,
}: Props) {
  const points = useRef<THREE.Points>(null);

  const positions = useMemo(() => {
    const array = new Float32Array(count * 3);
    for (let i = 0; i < count; i += 1) {
      array[i * 3] = (Math.random() - 0.5) * spread[0];
      array[i * 3 + 1] = (Math.random() - 0.5) * spread[1];
      array[i * 3 + 2] = (Math.random() - 0.5) * spread[2];
    }
    return array;
  }, [count, spread]);

  useFrame((state, delta) => {
    if (!points.current) return;
    points.current.rotation.y += delta * speed;
    points.current.position.y = Math.sin(state.clock.elapsedTime * 0.18) * 0.08;
  });

  return (
    <points ref={points} frustumCulled={false}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        size={size}
        color="#FFC928"
        transparent
        opacity={opacity}
        sizeAttenuation
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}
