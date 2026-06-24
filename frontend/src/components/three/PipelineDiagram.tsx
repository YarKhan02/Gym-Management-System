import { Suspense, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Html } from "@react-three/drei";
import * as THREE from "three";

const ACCENT = "#00F5C4";
const LABELS = ["MEMBERS", "SCHEDULE", "BILLING", "ANALYTICS", "AUTOMATION"];

function Panel({ angle, label }: { angle: number; label: string }) {
  const ref = useRef<THREE.Mesh>(null!);
  const baseScale = useRef(1);
  const radius = 2.6;
  useFrame((_, delta) => {
    if (!ref.current) return;
    const t = baseScale.current;
    ref.current.scale.lerp(new THREE.Vector3(t, t, t), 0.1);
  });
  return (
    <group rotation={[0, angle, 0]}>
      <mesh
        ref={ref}
        position={[radius, 0, 0]}
        onPointerOver={() => (baseScale.current = 1.2)}
        onPointerOut={() => (baseScale.current = 1)}
      >
        <boxGeometry args={[1.4, 0.9, 0.05]} />
        <meshStandardMaterial
          color="#0C1526"
          emissive={ACCENT}
          emissiveIntensity={0.15}
          metalness={0.7}
          roughness={0.3}
        />
        <Html center distanceFactor={6}>
          <div
            style={{
              fontFamily: "'JetBrains Mono', monospace",
              color: ACCENT,
              fontSize: 11,
              letterSpacing: "0.2em",
              whiteSpace: "nowrap",
              pointerEvents: "none",
            }}
          >
            {label}
          </div>
        </Html>
      </mesh>
      <line>
        <bufferGeometry
          attach="geometry"
          onUpdate={(g) => {
            g.setFromPoints([
              new THREE.Vector3(0, 0, 0),
              new THREE.Vector3(radius - 0.7, 0, 0),
            ]);
          }}
        />
        <lineBasicMaterial color={ACCENT} transparent opacity={0.4} />
      </line>
    </group>
  );
}

function Scene() {
  const group = useRef<THREE.Group>(null!);
  const core = useRef<THREE.Mesh>(null!);
  useFrame((state, delta) => {
    if (group.current) group.current.rotation.y += delta * 0.2;
    if (core.current) {
      const s = 1 + Math.sin(state.clock.elapsedTime * 1.5) * 0.05;
      core.current.scale.set(s, s, s);
    }
  });
  return (
    <group ref={group}>
      <mesh ref={core}>
        <sphereGeometry args={[0.6, 32, 32]} />
        <meshStandardMaterial
          color={ACCENT}
          emissive={ACCENT}
          emissiveIntensity={0.6}
          metalness={0.5}
          roughness={0.2}
        />
      </mesh>
      {LABELS.map((label, i) => (
        <Panel key={label} angle={(i / LABELS.length) * Math.PI * 2} label={label} />
      ))}
    </group>
  );
}

export default function PipelineDiagram() {
  return (
    <Canvas
      gl={{ antialias: true, alpha: true }}
      camera={{ position: [0, 2.2, 5.5], fov: 55 }}
      style={{ background: "transparent" }}
      dpr={[1, 1.5]}
    >
      <Suspense fallback={null}>
        <ambientLight intensity={0.4} />
        <pointLight position={[0, 3, 3]} color={ACCENT} intensity={2} />
        <Scene />
      </Suspense>
    </Canvas>
  );
}