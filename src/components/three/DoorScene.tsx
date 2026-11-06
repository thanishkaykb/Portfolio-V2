import { useRef, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { doors } from "../../lib/data";
import GoldenDust from "./GoldenDust";

type LabelRefs = React.RefObject<Array<HTMLDivElement | null>>;

const SPACING = 4.2;
// Only used to place the wall pillars; the door row itself is always centred.
const INITIAL_OFFSET = ((doors.length - 1) / 2) * SPACING;

type DoorProps = {
  index: number;
  title: string;
  short: string;
  opened: boolean;
  expanding: boolean;
  hovered: boolean;
  dimmed: boolean;
  onHover: (index: number | null) => void;
  onExpand: (index: number) => void;
  labels: LabelRefs;
};

function Door({
  index,
  opened,
  expanding,
  hovered,
  dimmed,
  onHover,
  onExpand,
  labels,
}: DoorProps) {
  const group = useRef<THREE.Group>(null);
  const pivot = useRef<THREE.Group>(null);
  const seamMaterial = useRef<THREE.MeshStandardMaterial>(null);
  const panelMaterial = useRef<THREE.MeshStandardMaterial>(null);
  const glowMaterial = useRef<THREE.MeshBasicMaterial>(null);
  const doorwayLight = useRef<THREE.PointLight>(null);
  const labelAnchor = useRef<THREE.Object3D>(null);
  const projected = useRef(new THREE.Vector3());

  useFrame((state, delta) => {
    const d = Math.min(delta, 0.05);
    if (pivot.current) {
      const target = opened ? -1.92 : 0;
      pivot.current.rotation.y = THREE.MathUtils.damp(pivot.current.rotation.y, target, 4.6, d);
    }
    if (group.current) {
      const lift = opened || expanding ? 0 : hovered ? 0.12 : 0;
      group.current.position.y = THREE.MathUtils.damp(group.current.position.y, lift, 6, d);
      // Clicking a door pulls it forward before the panel opens.
      const push = expanding && !opened ? 2.1 : hovered && !opened ? 0.06 : 0;
      group.current.position.z = THREE.MathUtils.damp(group.current.position.z, push, 5.5, d);
      const scale = expanding && !opened ? 1.16 : 1;
      const next = THREE.MathUtils.damp(group.current.scale.x, scale, 5.5, d);
      group.current.scale.setScalar(next);
    }
    if (seamMaterial.current) {
      const target = opened ? 3.4 : hovered ? 2.6 : dimmed ? 0.55 : 1.1;
      seamMaterial.current.emissiveIntensity = THREE.MathUtils.damp(
        seamMaterial.current.emissiveIntensity,
        target,
        5,
        d,
      );
    }
    if (panelMaterial.current) {
      const target = hovered ? 0.14 : 0.05;
      panelMaterial.current.emissiveIntensity = THREE.MathUtils.damp(
        panelMaterial.current.emissiveIntensity,
        target,
        4,
        d,
      );
    }
    if (glowMaterial.current) {
      const target = opened ? 0.5 : hovered ? 0.16 : 0.05;
      glowMaterial.current.opacity = THREE.MathUtils.damp(
        glowMaterial.current.opacity,
        target,
        5,
        d,
      );
    }
    if (doorwayLight.current) {
      const target = opened ? 9 : hovered ? 2.4 : 0.6;
      doorwayLight.current.intensity = THREE.MathUtils.damp(
        doorwayLight.current.intensity,
        target,
        5,
        d,
      );
    }
    // Project this door's label anchor to screen space and drive the DOM label
    // that DoorWorld renders over the canvas. Doing the label in the DOM tree
    // (not a portal inside this reconciler) keeps real, focusable HTML.
    const label = labels.current?.[index];
    const anchor = labelAnchor.current;
    if (label && anchor) {
      anchor.getWorldPosition(projected.current);
      projected.current.project(state.camera);
      const width = state.size.width;
      const x = (projected.current.x * 0.5 + 0.5) * width;
      const y = (-projected.current.y * 0.5 + 0.5) * state.size.height;
      // Keep the label inside the canvas: labels are up to 168px wide and their
      // own height sits above the door, so clamp both axes instead of letting
      // the frame crop them. On narrow screens the labels are wider relative to
      // the canvas, so the clamp stays proportional and reserves more headroom.
      const labelHalf = Math.min(84, width * 0.3);
      const minTop = width < 480 ? 104 : 60;
      const clampedX = Math.min(Math.max(x, labelHalf), width - labelHalf);
      const clampedY = Math.max(y, minTop);
      const onScreen = projected.current.z < 1 && x > -140 && x < width + 140;
      label.style.visibility = onScreen ? "visible" : "hidden";
      label.style.opacity = dimmed ? "0.45" : "1";
      label.style.transform = `translate3d(${clampedX}px, ${clampedY}px, 0) translate(-50%, -100%)`;
    }
  });

  return (
    <group ref={group} position={[(index - (doors.length - 1) / 2) * SPACING, 0, 0]}>
      {/* frame */}
      <mesh position={[-1.02, 0, 0]} castShadow>
        <boxGeometry args={[0.16, 3.3, 0.34]} />
        <meshStandardMaterial color="#1b1b18" metalness={0.55} roughness={0.5} />
      </mesh>
      <mesh position={[1.02, 0, 0]}>
        <boxGeometry args={[0.16, 3.3, 0.34]} />
        <meshStandardMaterial color="#1b1b18" metalness={0.55} roughness={0.5} />
      </mesh>
      <mesh position={[0, 1.68, 0]}>
        <boxGeometry args={[2.2, 0.18, 0.34]} />
        <meshStandardMaterial color="#1b1b18" metalness={0.55} roughness={0.5} />
      </mesh>
      <mesh position={[0, -1.67, 0.12]}>
        <boxGeometry args={[2.16, 0.1, 0.62]} />
        <meshStandardMaterial color="#141412" metalness={0.6} roughness={0.55} />
      </mesh>

      {/* doorway interior + light */}
      <mesh position={[0, 0, -0.3]}>
        <planeGeometry args={[1.92, 3.2]} />
        <meshBasicMaterial color="#050504" />
      </mesh>
      <mesh position={[0, 0, -0.2]}>
        <planeGeometry args={[1.86, 3.12]} />
        <meshBasicMaterial
          ref={glowMaterial}
          color="#FFC928"
          transparent
          opacity={0.05}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>
      <pointLight
        ref={doorwayLight}
        position={[0, 0.2, -0.6]}
        color="#FFC928"
        intensity={0.6}
        distance={7}
        decay={2}
      />

      {/* door panel, hinged on the left */}
      <group ref={pivot} position={[-0.92, 0, 0]}>
        <mesh position={[0.92, 0, 0]}>
          <boxGeometry args={[1.84, 3.16, 0.1]} />
          <meshStandardMaterial
            ref={panelMaterial}
            color="#101010"
            metalness={0.72}
            roughness={0.36}
            emissive="#FFC928"
            emissiveIntensity={0.05}
          />
        </mesh>

        {/* panel insets */}
        <mesh position={[0.92, 0.7, 0.06]}>
          <boxGeometry args={[1.4, 1.1, 0.012]} />
          <meshStandardMaterial color="#0b0b0a" metalness={0.5} roughness={0.5} />
        </mesh>
        <mesh position={[0.92, -0.62, 0.06]}>
          <boxGeometry args={[1.4, 1.1, 0.012]} />
          <meshStandardMaterial color="#0b0b0a" metalness={0.5} roughness={0.5} />
        </mesh>

        {/* gold seam + handle */}
        <mesh position={[1.78, 0, 0.02]}>
          <boxGeometry args={[0.022, 2.9, 0.03]} />
          <meshStandardMaterial
            ref={seamMaterial}
            color="#FFC928"
            emissive="#FFC928"
            emissiveIntensity={1.1}
            metalness={0.4}
            roughness={0.3}
          />
        </mesh>
        <mesh position={[1.6, -0.02, 0.1]}>
          <boxGeometry args={[0.045, 0.3, 0.055]} />
          <meshStandardMaterial color="#C9A227" metalness={0.9} roughness={0.25} />
        </mesh>
        <mesh position={[1.6, 0.02, 0.13]}>
          <sphereGeometry args={[0.045, 16, 16]} />
          <meshStandardMaterial
            color="#FFD75E"
            metalness={0.85}
            roughness={0.2}
            emissive="#FFC928"
            emissiveIntensity={0.35}
          />
        </mesh>
      </group>

      {/* hit area */}
      <mesh
        position={[0, 0, 0.4]}
        onPointerOver={(event) => {
          event.stopPropagation();
          onHover(index);
          document.body.style.cursor = "pointer";
        }}
        onPointerOut={() => {
          onHover(null);
          document.body.style.cursor = "";
        }}
        onClick={(event) => {
          event.stopPropagation();
          onExpand(index);
        }}
      >
        <boxGeometry args={[2.24, 3.4, 0.5]} />
        <meshBasicMaterial transparent opacity={0} depthWrite={false} />
      </mesh>

      {/* anchor the DOM label above the door; DoorWorld positions it */}
      <object3D ref={labelAnchor} position={[0, 1.92, 0.3]} />
    </group>
  );
}

function SceneCamera({ entered }: { entered: number | null }) {
  const { camera, size } = useThree();
  const perspective = camera as THREE.PerspectiveCamera;

  // The whole row of doors is always framed dead centre. The camera pulls back
  // as far as it needs to so no door is ever cropped, on any viewport, and it
  // never drifts with the pointer: the row stays put. Once a door opens the
  // camera walks toward that doorway, so the visitor sees the panel swing and
  // the frame fill up before the content sheet covers the scene.
  useFrame((_, delta) => {
    const d = Math.min(delta, 0.05);
    const fov = size.width < 768 ? 50 : 46;
    const halfRow = ((doors.length - 1) / 2) * SPACING + 1.55;
    const aspect = Math.max(0.45, size.width / Math.max(1, size.height));
    const tan = Math.tan(THREE.MathUtils.degToRad(fov / 2));
    const zForWidth = halfRow / (tan * aspect);
    // leave room above the door for its label
    const zForHeight = 2.55 / tan;
    const framedZ = THREE.MathUtils.clamp(Math.max(zForWidth, zForHeight), 6.2, 17);

    const walking = entered !== null;
    const doorX = walking ? (entered - (doors.length - 1) / 2) * SPACING : 0;
    const targetZ = walking ? Math.min(framedZ, 3.6) : framedZ;
    const speed = walking ? 2.4 : 3.2;

    perspective.position.z = THREE.MathUtils.damp(perspective.position.z, targetZ, speed, d);
    perspective.position.x = THREE.MathUtils.damp(perspective.position.x, doorX, speed, d);
    perspective.position.y = THREE.MathUtils.damp(
      perspective.position.y,
      walking ? 0.1 : 0.42,
      speed,
      d,
    );
    perspective.fov = THREE.MathUtils.damp(perspective.fov, walking ? fov + 12 : fov, 2.6, d);
    perspective.updateProjectionMatrix();
    perspective.lookAt(doorX * 0.9, walking ? 0.04 : 0.08, 0);
  });

  return null;
}

function Wall({
  opened,
  expanding,
  hovered,
  onHover,
  onExpand,
  labels,
}: {
  opened: number | null;
  expanding: number | null;
  hovered: number | null;
  onHover: (index: number | null) => void;
  onExpand: (index: number) => void;
  labels: LabelRefs;
}) {
  const wall = useRef<THREE.Group>(null);

  useFrame((_, delta) => {
    if (!wall.current) return;
    const d = Math.min(delta, 0.05);
    // The row never slides and never tilts with the pointer.
    wall.current.position.x = THREE.MathUtils.damp(wall.current.position.x, 0, 4.2, d);
    wall.current.rotation.y = THREE.MathUtils.damp(wall.current.rotation.y, 0, 4, d);
    wall.current.rotation.x = THREE.MathUtils.damp(wall.current.rotation.x, 0, 4, d);
  });

  return (
    <group ref={wall}>
      {/* back wall */}
      <mesh position={[0, 0.2, -0.72]}>
        <planeGeometry args={[60, 16]} />
        <meshStandardMaterial color="#0b0b0a" roughness={0.95} metalness={0.1} />
      </mesh>

      {/* wall pillars between doors */}
      {Array.from({ length: doors.length + 1 }).map((_, index) => (
        <mesh
          key={index}
          position={[index * SPACING - INITIAL_OFFSET - SPACING / 2, 0.2, -0.4]}
        >
          <boxGeometry args={[0.5, 16, 0.5]} />
          <meshStandardMaterial color="#0d0d0c" roughness={0.85} metalness={0.25} />
        </mesh>
      ))}

      {/* floor */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.74, 0.4]}>
        <planeGeometry args={[70, 26]} />
        <meshStandardMaterial color="#0a0a09" metalness={0.75} roughness={0.42} />
      </mesh>

      {/* soft gold pools on the floor */}
      {doors.map((door, index) => (
        <mesh
          key={door.id}
          rotation={[-Math.PI / 2, 0, 0]}
          position={[(index - (doors.length - 1) / 2) * SPACING, -1.72, 0.55]}
        >
          <circleGeometry args={[1.1, 40]} />
          <meshBasicMaterial
            color="#FFC928"
            transparent
            opacity={opened === index ? 0.22 : hovered === index ? 0.1 : 0.035}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
          />
        </mesh>
      ))}

      {doors.map((door, index) => (
        <Door
          key={door.id}
          index={index}
          title={door.title}
          short={door.short}
          opened={opened === index}
          expanding={expanding === index}
          hovered={hovered === index}
          dimmed={opened !== null && opened !== index}
          onHover={onHover}
          onExpand={onExpand}
          labels={labels}
        />
      ))}
    </group>
  );
}

export default function DoorScene({
  opened,
  expanding,
  paused,
  onExpand,
  labels,
}: {
  opened: number | null;
  expanding: number | null;
  paused: boolean;
  onExpand: (index: number) => void;
  labels: LabelRefs;
}) {
  const entered = opened;
  const [hovered, setHovered] = useState<number | null>(null);

  return (
    <Canvas
      frameloop={paused ? "never" : "always"}
      dpr={[1, 1.7]}
      shadows={false}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      camera={{ position: [0, 0.25, 7.0], fov: 46, near: 0.1, far: 80 }}
      style={{ touchAction: "pan-y" }}
      aria-hidden
    >
      <SceneCamera entered={entered} />
      <ambientLight intensity={0.55} />
      <hemisphereLight args={["#4a4436", "#050505", 0.55]} />
      <directionalLight position={[4, 7, 8]} intensity={1.35} color="#FFF1CE" />
      <pointLight position={[-5, 2.4, 4]} intensity={12} color="#FFC928" distance={18} decay={2} />
      <pointLight position={[5, 2.4, 4]} intensity={12} color="#FFC928" distance={18} decay={2} />
      <pointLight position={[0, 4.4, 2]} intensity={8} color="#F5F2E9" distance={14} decay={2} />

      <Wall
        opened={opened}
        expanding={expanding}
        hovered={hovered}
        onHover={setHovered}
        onExpand={onExpand}
        labels={labels}
      />
      <GoldenDust count={420} spread={[20, 7, 7]} size={0.014} opacity={0.35} speed={0.008} />
    </Canvas>
  );
}
