"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { Edges, Float, Grid } from "@react-three/drei";
import type { CSSProperties } from "react";
import { useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";

type Vec3 = [number, number, number];

const toxin = new THREE.Color("#39ff88");
const rot = new THREE.Color("#ff3b45");
const amber = new THREE.Color("#d6aa3f");

function useReducedMotion() {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setReduced(media.matches);
    sync();
    media.addEventListener("change", sync);
    return () => media.removeEventListener("change", sync);
  }, []);

  return reduced;
}

function useTinyViewport() {
  const [tiny, setTiny] = useState(false);

  useEffect(() => {
    const sync = () => setTiny(window.innerWidth < 360);
    sync();
    window.addEventListener("resize", sync);
    return () => window.removeEventListener("resize", sync);
  }, []);

  return tiny;
}

function CoreCube({ reduced }: { reduced: boolean }) {
  const group = useRef<THREE.Group>(null);

  useFrame((_, delta) => {
    if (!group.current || reduced) return;
    group.current.rotation.y += delta * 0.24;
    group.current.rotation.x = Math.sin(Date.now() * 0.00035) * 0.08;
  });

  return (
    <Float speed={reduced ? 0 : 1.1} rotationIntensity={reduced ? 0 : 0.28} floatIntensity={reduced ? 0 : 0.22}>
      <group ref={group}>
        <mesh>
          <boxGeometry args={[1.55, 1.55, 1.55]} />
          <meshStandardMaterial color="#07100c" roughness={0.52} metalness={0.7} emissive="#06170d" emissiveIntensity={0.38} />
          <Edges threshold={10} color="#39ff88" scale={1.02} />
        </mesh>
        <mesh rotation={[0.72, 0.18, 0.45]}>
          <boxGeometry args={[1.88, 1.88, 1.88]} />
          <meshBasicMaterial color="#39ff88" wireframe transparent opacity={0.12} />
        </mesh>
      </group>
    </Float>
  );
}

function ScanBeam({ reduced }: { reduced: boolean }) {
  const beam = useRef<THREE.Mesh>(null);
  const material = useRef<THREE.MeshBasicMaterial>(null);

  useFrame(({ clock }) => {
    if (!beam.current || !material.current || reduced) return;
    const t = clock.elapsedTime;
    beam.current.position.x = Math.sin(t * 0.9) * 0.85;
    material.current.opacity = 0.22 + Math.sin(t * 3.4) * 0.08;
    beam.current.scale.y = 0.92 + Math.sin(t * 2.1) * 0.08;
  });

  return (
    <mesh ref={beam} rotation={[0, 0.18, 0]}>
      <boxGeometry args={[0.07, 2.55, 2.55]} />
      <meshBasicMaterial
        ref={material}
        color="#39ff88"
        transparent
        opacity={0.26}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </mesh>
  );
}

function Orbits({ reduced }: { reduced: boolean }) {
  const group = useRef<THREE.Group>(null);

  useFrame((_, delta) => {
    if (!group.current || reduced) return;
    group.current.rotation.y += delta * 0.12;
    group.current.rotation.z -= delta * 0.05;
  });

  return (
    <group ref={group}>
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[1.88, 0.008, 8, 96]} />
        <meshBasicMaterial color="#39ff88" transparent opacity={0.42} />
      </mesh>
      <mesh rotation={[0.62, 0.18, 0.38]}>
        <torusGeometry args={[2.22, 0.006, 8, 112]} />
        <meshBasicMaterial color="#39ff88" transparent opacity={0.28} />
      </mesh>
      <mesh rotation={[1.2, -0.55, 0.08]}>
        <torusGeometry args={[2.62, 0.004, 8, 128]} />
        <meshBasicMaterial color="#ff3b45" transparent opacity={0.22} />
      </mesh>
      {[
        [-1.8, 0.8, 0.2],
        [1.55, -0.55, 0.55],
        [-0.9, -1.2, -0.65],
        [1.05, 1.1, -0.35]
      ].map((position, index) => (
        <mesh key={index} position={position as Vec3}>
          <sphereGeometry args={[0.07, 16, 16]} />
          <meshStandardMaterial
            color={index < 2 ? "#ff3b45" : "#39ff88"}
            emissive={index < 2 ? "#ff3b45" : "#39ff88"}
            emissiveIntensity={1.2}
          />
        </mesh>
      ))}
    </group>
  );
}

function RescueParticles({ reduced }: { reduced: boolean }) {
  const positionsRef = useRef<THREE.BufferAttribute>(null);
  const colorsRef = useRef<THREE.BufferAttribute>(null);
  const particles = useMemo(
    () =>
      Array.from({ length: 56 }, (_, index) => {
        const angle = (index / 56) * Math.PI * 2;
        const radius = 1.65 + (index % 7) * 0.16;
        const y = ((index % 9) - 4) * 0.18;
        const start: Vec3 = [Math.cos(angle) * radius - 0.5, y, Math.sin(angle) * radius * 0.55];
        const end: Vec3 = [Math.cos(angle + 0.8) * (radius * 0.72) + 0.52, y * 0.42, Math.sin(angle + 0.8) * radius * 0.4];
        return { start, end, phase: index * 0.17 };
      }),
    []
  );
  const initialPositions = useMemo(() => {
    const data = new Float32Array(particles.length * 3);
    particles.forEach((particle, index) => data.set(particle.start, index * 3));
    return data;
  }, [particles]);
  const initialColors = useMemo(() => {
    const data = new Float32Array(particles.length * 3);
    particles.forEach((_, index) => rot.toArray(data, index * 3));
    return data;
  }, [particles]);

  useFrame(({ clock }) => {
    const positionAttr = positionsRef.current;
    const colorAttr = colorsRef.current;
    if (!positionAttr || !colorAttr || reduced) return;

    particles.forEach((particle, index) => {
      const flow = (Math.sin(clock.elapsedTime * 0.62 + particle.phase) + 1) / 2;
      const eased = flow * flow * (3 - 2 * flow);
      const x = THREE.MathUtils.lerp(particle.start[0], particle.end[0], eased);
      const y = THREE.MathUtils.lerp(particle.start[1], particle.end[1], eased);
      const z = THREE.MathUtils.lerp(particle.start[2], particle.end[2], eased);
      positionAttr.setXYZ(index, x, y, z);

      const color = rot.clone().lerp(toxin, eased);
      if (eased > 0.48 && eased < 0.68) color.lerp(amber, 0.28);
      colorAttr.setXYZ(index, color.r, color.g, color.b);
    });

    positionAttr.needsUpdate = true;
    colorAttr.needsUpdate = true;
  });

  return (
    <points>
      <bufferGeometry>
        <bufferAttribute ref={positionsRef} attach="attributes-position" args={[initialPositions, 3]} />
        <bufferAttribute ref={colorsRef} attach="attributes-color" args={[initialColors, 3]} />
      </bufferGeometry>
      <pointsMaterial size={0.052} transparent opacity={0.9} vertexColors depthWrite={false} blending={THREE.AdditiveBlending} />
    </points>
  );
}

function Scene({ reduced }: { reduced: boolean }) {
  return (
    <>
      <ambientLight intensity={0.42} />
      <pointLight position={[3.2, 3.4, 4.4]} intensity={4.1} color="#39ff88" />
      <pointLight position={[-3.4, -1.2, 2.6]} intensity={2.6} color="#ff3b45" />
      <group position={[0, 0.08, 0]}>
        <Grid
          args={[7.2, 7.2]}
          cellSize={0.38}
          cellThickness={0.35}
          cellColor="#1f6d45"
          sectionSize={1.52}
          sectionThickness={0.55}
          sectionColor="#39ff88"
          fadeDistance={5}
          fadeStrength={1.2}
          position={[0, -1.8, 0]}
        />
        <Orbits reduced={reduced} />
        <RescueParticles reduced={reduced} />
        <ScanBeam reduced={reduced} />
        <CoreCube reduced={reduced} />
      </group>
    </>
  );
}

export function ResurrectionCoreFallback() {
  return (
    <div className="core-fallback" aria-label="CSS Repo Resurrection Core fallback">
      <div className="fallback-ring fallback-ring-one" />
      <div className="fallback-ring fallback-ring-two" />
      <div className="fallback-cube" />
      <div className="fallback-beam" />
      {Array.from({ length: 18 }).map((_, index) => (
        <span className="fallback-particle" key={index} style={{ "--i": index } as CSSProperties} />
      ))}
    </div>
  );
}

export default function ResurrectionCore() {
  const reduced = useReducedMotion();
  const tinyViewport = useTinyViewport();

  if (tinyViewport) {
    return <ResurrectionCoreFallback />;
  }

  return (
    <div className="core-canvas" aria-label="Animated Repo Resurrection Core">
      <Canvas
        camera={{ position: [0, 0.1, 5.4], fov: 43 }}
        dpr={[1, 1.5]}
        fallback={<ResurrectionCoreFallback />}
        gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      >
        <Scene reduced={reduced} />
      </Canvas>
    </div>
  );
}
