import { Suspense, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";

const ACCENT = "#00F5C4";
const SKIN = "#d49a6a";
const SKIN_DARK = "#a06a3a";


function Figure({ slow = false }: { slow?: boolean }) {
  const group = useRef<THREE.Group>(null!);
  const target = useRef({ x: 0, y: 0 });

  useFrame((state, delta) => {
    if (!group.current) return;
    const speed = slow ? 0.15 : 0.45;
    group.current.rotation.y += delta * speed;
    const mx = state.mouse.x * 0.3;
    const my = state.mouse.y * 0.15;
    target.current.x += (my - target.current.x) * 0.05;
    target.current.y += (mx - target.current.y) * 0.05;
    group.current.rotation.x = target.current.x;
    // subtle breathing
    const s = 1 + Math.sin(state.clock.elapsedTime * 1.6) * 0.015;
    group.current.scale.set(s, s, s);
  });

  return (
    <group ref={group} position={[0, -0.4, 0]}>
      {/* Head */}
      <mesh position={[0, 2.55, 0]} castShadow>
        <sphereGeometry args={[0.42, 32, 32]} />
        <meshStandardMaterial color={SKIN} roughness={0.6} metalness={0.1} />
      </mesh>
      {/* Neck */}
      <mesh position={[0, 2.05, 0]}>
        <cylinderGeometry args={[0.22, 0.26, 0.3, 16]} />
        <meshStandardMaterial color={SKIN_DARK} roughness={0.6} />
      </mesh>

      {/* Torso — V-shape: wide shoulders, narrow waist */}
      <mesh position={[0, 1.25, 0]} castShadow>
        <boxGeometry args={[1.85, 1.4, 0.85]} />
        <meshStandardMaterial color={SKIN} roughness={0.5} metalness={0.15} />
      </mesh>
      {/* Pec definition */}
      <mesh position={[-0.42, 1.55, 0.4]}>
        <sphereGeometry args={[0.42, 24, 24]} />
        <meshStandardMaterial color={SKIN} roughness={0.45} />
      </mesh>
      <mesh position={[0.42, 1.55, 0.4]}>
        <sphereGeometry args={[0.42, 24, 24]} />
        <meshStandardMaterial color={SKIN} roughness={0.45} />
      </mesh>
      {/* Abs (six pack) */}
      {[
        [-0.2, 1.05, 0.43],
        [0.2, 1.05, 0.43],
        [-0.2, 0.75, 0.43],
        [0.2, 0.75, 0.43],
        [-0.2, 0.45, 0.43],
        [0.2, 0.45, 0.43],
      ].map((p, i) => (
        <mesh key={i} position={p as [number, number, number]}>
          <sphereGeometry args={[0.16, 16, 16]} />
          <meshStandardMaterial color={SKIN_DARK} roughness={0.5} />
        </mesh>
      ))}
      {/* Waist */}
      <mesh position={[0, 0.25, 0]}>
        <boxGeometry args={[1.2, 0.4, 0.75]} />
        <meshStandardMaterial color={SKIN_DARK} roughness={0.55} />
      </mesh>

      {/* Shoulders (delts) */}
      <mesh position={[-1.0, 1.85, 0]} castShadow>
        <sphereGeometry args={[0.42, 24, 24]} />
        <meshStandardMaterial color={SKIN} roughness={0.45} />
      </mesh>
      <mesh position={[1.0, 1.85, 0]} castShadow>
        <sphereGeometry args={[0.42, 24, 24]} />
        <meshStandardMaterial color={SKIN} roughness={0.45} />
      </mesh>

      {/* Left arm — flexed (bicep up) */}
      <group position={[-1.05, 1.7, 0]} rotation={[0, 0, Math.PI / 2.2]}>
        {/* Upper arm */}
        <mesh position={[0.0, -0.55, 0]} castShadow>
          <capsuleGeometry args={[0.3, 0.7, 8, 16]} />
          <meshStandardMaterial color={SKIN} roughness={0.45} />
        </mesh>
        {/* Bicep peak */}
        <mesh position={[0.0, -0.4, 0.18]}>
          <sphereGeometry args={[0.28, 20, 20]} />
          <meshStandardMaterial color={SKIN} roughness={0.4} />
        </mesh>
        {/* Forearm — rotated up */}
        <group position={[0, -1.0, 0]} rotation={[0, 0, -Math.PI / 1.15]}>
          <mesh position={[0, -0.55, 0]} castShadow>
            <capsuleGeometry args={[0.22, 0.7, 8, 16]} />
            <meshStandardMaterial color={SKIN} roughness={0.5} />
          </mesh>
          {/* Fist */}
          <mesh position={[0, -1.05, 0]}>
            <sphereGeometry args={[0.24, 16, 16]} />
            <meshStandardMaterial color={SKIN_DARK} roughness={0.55} />
          </mesh>
        </group>
      </group>

      {/* Right arm — mirrored flex */}
      <group position={[1.05, 1.7, 0]} rotation={[0, 0, -Math.PI / 2.2]}>
        <mesh position={[0.0, -0.55, 0]} castShadow>
          <capsuleGeometry args={[0.3, 0.7, 8, 16]} />
          <meshStandardMaterial color={SKIN} roughness={0.45} />
        </mesh>
        <mesh position={[0.0, -0.4, 0.18]}>
          <sphereGeometry args={[0.28, 20, 20]} />
          <meshStandardMaterial color={SKIN} roughness={0.4} />
        </mesh>
        <group position={[0, -1.0, 0]} rotation={[0, 0, Math.PI / 1.15]}>
          <mesh position={[0, -0.55, 0]} castShadow>
            <capsuleGeometry args={[0.22, 0.7, 8, 16]} />
            <meshStandardMaterial color={SKIN} roughness={0.5} />
          </mesh>
          <mesh position={[0, -1.05, 0]}>
            <sphereGeometry args={[0.24, 16, 16]} />
            <meshStandardMaterial color={SKIN_DARK} roughness={0.55} />
          </mesh>
        </group>
      </group>

      {/* Legs */}
      <mesh position={[-0.35, -0.55, 0]} castShadow>
        <capsuleGeometry args={[0.32, 1.0, 8, 16]} />
        <meshStandardMaterial color={SKIN} roughness={0.5} />
      </mesh>
      <mesh position={[0.35, -0.55, 0]} castShadow>
        <capsuleGeometry args={[0.32, 1.0, 8, 16]} />
        <meshStandardMaterial color={SKIN} roughness={0.5} />
      </mesh>
      {/* Calves */}
      <mesh position={[-0.35, -1.8, 0]} castShadow>
        <capsuleGeometry args={[0.26, 0.9, 8, 16]} />
        <meshStandardMaterial color={SKIN_DARK} roughness={0.55} />
      </mesh>
      <mesh position={[0.35, -1.8, 0]} castShadow>
        <capsuleGeometry args={[0.26, 0.9, 8, 16]} />
        <meshStandardMaterial color={SKIN_DARK} roughness={0.55} />
      </mesh>

      {/* Accent floor ring */}
      <mesh position={[0, -2.45, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[1.6, 0.02, 8, 64]} />
        <meshBasicMaterial color={ACCENT} transparent opacity={0.7} />
      </mesh>
      <mesh position={[0, -2.45, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[2.0, 0.012, 8, 64]} />
        <meshBasicMaterial color={ACCENT} transparent opacity={0.35} />
      </mesh>
    </group>
  );
}

export default function Bodybuilder({ slow = false }: { slow?: boolean }) {
  return (
    <Canvas
      gl={{ antialias: true, alpha: true }}
      camera={{ position: [0, 0.6, 7], fov: 50 }}
      style={{ background: "transparent" }}
      dpr={[1, 1.5]}
    >
      <Suspense fallback={null}>
        <ambientLight intensity={0.35} />
        <pointLight position={[3, 4, 4]} color={ACCENT} intensity={2.2} />
        <pointLight position={[-4, 2, 2]} color="#FFD166" intensity={0.8} />
        <pointLight position={[0, -3, 3]} color="#ffffff" intensity={0.4} />
        <Figure slow={slow} />
      </Suspense>
    </Canvas>
  );
}
