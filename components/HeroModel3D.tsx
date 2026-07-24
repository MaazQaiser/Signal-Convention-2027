"use client";

import { Suspense, useLayoutEffect, useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Billboard, Environment, useGLTF } from "@react-three/drei";
import * as THREE from "three";

import { getHeroScrollPhases } from "@/lib/hero-scroll-phases";
import {
  setupBrandmarkColors,
  tickBrandmarkTime,
} from "@/lib/brandmark-model";
import {
  createGlowMaterial,
  GLOW_STRENGTH,
} from "@/lib/brandmark-glow";

type HeroModel3DProps = {
  pointer: { x: number; y: number };
  scrollProgress: number;
  reduceMotion: boolean | null;
};

type ModelProps = HeroModel3DProps;

/** Idle hero — do not change this pose */
const MODEL_SCALE = 9.9;
const MODEL_ANCHOR: [number, number, number] = [1.65, -1.6, 0];
const BASE_TILT = { x: 0.1, y: -0.42, z: 0 };

/** After hero — left top corner */
const MODEL_ANCHOR_LEFT_TOP: [number, number, number] = [-1.55, 0.95, 0];

/** Then smaller, then zoom */
const MODEL_SCALE_SMALL = 4.2;
const MODEL_SCALE_ZOOM = 32;

const CAMERA_Z_START = 5.4;
const CAMERA_Z_ZOOM = 1.85;
const CAMERA_FOV_START = 40;
const CAMERA_FOV_ZOOM = 22;
const CAMERA_X_START = -0.12;
const POINTER_TILT = 0.18;
/** Slow clockwise spin — ~90s per turn */
const CLOCK_SPIN_Z = (-Math.PI * 2) / 90;

function easePhase(t: number) {
  const x = Math.min(1, Math.max(0, t));
  return x * x * (3 - 2 * x);
}

function lerpAnchor(
  start: [number, number, number],
  end: [number, number, number],
  t: number
): [number, number, number] {
  return [
    THREE.MathUtils.lerp(start[0], end[0], t),
    THREE.MathUtils.lerp(start[1], end[1], t),
    THREE.MathUtils.lerp(start[2], end[2], t),
  ];
}

function LogoBackgroundGlow({
  reduceMotion,
  intensity = 1,
}: {
  reduceMotion: boolean | null;
  intensity?: number;
}) {
  const groupRef = useRef<THREE.Group>(null);
  const glowMat = useMemo(() => createGlowMaterial(1.65 * GLOW_STRENGTH), []);

  useFrame(({ clock }) => {
    glowMat.uniforms.uTime.value = reduceMotion ? 0 : clock.elapsedTime;
    glowMat.uniforms.uIntensity.value = 1.65 * GLOW_STRENGTH * intensity;
    const group = groupRef.current;
    if (group) group.position.set(0, 0, -0.72);
  });

  return (
    <group ref={groupRef}>
      <Billboard follow lockX={false} lockY={false} lockZ={false}>
        <mesh
          renderOrder={-20}
          material={glowMat}
          scale={0.85 + intensity * 0.4}
        >
          <planeGeometry args={[9.5, 9.5]} />
        </mesh>
      </Billboard>
    </group>
  );
}

function HeroModel({ pointer, scrollProgress, reduceMotion }: ModelProps) {
  const groupRef = useRef<THREE.Group>(null);
  const tiltRef = useRef<THREE.Group>(null);
  const spinRef = useRef<THREE.Group>(null);
  const smoothPointer = useRef({ x: 0, y: 0 });
  const frozenSpinZ = useRef(0);
  const glassMeshesRef = useRef<THREE.Mesh[]>([]);
  const baseMaxDim = useRef(1);
  const localCenter = useRef(new THREE.Vector3());
  const { scene } = useGLTF("/models/modal.gltf");
  const model = useMemo(() => scene.clone(true), [scene]);
  const modelScroll = Math.min(1, scrollProgress);
  const phases = getHeroScrollPhases(modelScroll);

  useLayoutEffect(() => {
    glassMeshesRef.current = setupBrandmarkColors(model);
  }, [model]);

  useLayoutEffect(() => {
    model.scale.setScalar(1);
    model.position.set(0, 0, 0);
    model.rotation.set(0, 0, 0);
    const box = new THREE.Box3().setFromObject(model);
    const size = box.getSize(new THREE.Vector3());
    baseMaxDim.current = Math.max(size.x, size.y, size.z) || 1;
    box.getCenter(localCenter.current);
  }, [model]);

  useFrame((state) => {
    const spin = spinRef.current;
    const root = groupRef.current;
    const tilt = tiltRef.current;
    if (!spin || !root || !tilt) return;

    root.scale.setScalar(1);
    root.visible = true;

    const elapsed = state.clock.elapsedTime;
    tickBrandmarkTime(glassMeshesRef.current, elapsed);

    /*
     * Sequence (strict order):
     * 1) Hero idle — fixed right pose (untouched)
     * 2) After hero — move to left top corner
     * 3) Then — get smaller
     * 4) Then — zoom in
     */
    const moveT = easePhase(phases.modelToCorner);
    const shrinkT = easePhase(phases.modelToCenter);
    const zoomT = easePhase(phases.modelZoom);

    tilt.rotation.x = BASE_TILT.x;
    tilt.rotation.y = BASE_TILT.y;
    tilt.rotation.z = 0;

    const anchor = lerpAnchor(MODEL_ANCHOR, MODEL_ANCHOR_LEFT_TOP, moveT);

    let targetScale = MODEL_SCALE;
    if (zoomT > 0) {
      targetScale = THREE.MathUtils.lerp(MODEL_SCALE_SMALL, MODEL_SCALE_ZOOM, zoomT);
    } else if (shrinkT > 0) {
      targetScale = THREE.MathUtils.lerp(MODEL_SCALE, MODEL_SCALE_SMALL, shrinkT);
    }

    root.position.set(anchor[0], anchor[1], anchor[2]);

    const scale = targetScale / baseMaxDim.current;
    model.scale.setScalar(scale);
    model.position.set(
      -localCenter.current.x * scale,
      -localCenter.current.y * scale,
      -localCenter.current.z * scale
    );

    const cam = state.camera;
    if (cam instanceof THREE.PerspectiveCamera) {
      cam.position.z = THREE.MathUtils.lerp(CAMERA_Z_START, CAMERA_Z_ZOOM, zoomT);
      cam.position.x = THREE.MathUtils.lerp(
        CAMERA_X_START,
        anchor[0] * 0.1,
        zoomT
      );
      cam.position.y = THREE.MathUtils.lerp(0.12, anchor[1] * 0.08, zoomT);
      cam.fov = THREE.MathUtils.lerp(CAMERA_FOV_START, CAMERA_FOV_ZOOM, zoomT);
      cam.updateProjectionMatrix();
    }

    smoothPointer.current.x = THREE.MathUtils.lerp(
      smoothPointer.current.x,
      pointer.x,
      0.09
    );
    smoothPointer.current.y = THREE.MathUtils.lerp(
      smoothPointer.current.y,
      pointer.y,
      0.09
    );

    const pointerWeight =
      zoomT > 0.05 ? 0 : moveT > 0.9 ? 0.2 : 1 - moveT * 0.5;
    const { x, y } = smoothPointer.current;

    if (reduceMotion) {
      spin.rotation.set(0, 0, 0);
      return;
    }

    spin.rotation.x = THREE.MathUtils.lerp(
      spin.rotation.x,
      y * POINTER_TILT * pointerWeight,
      0.12
    );
    spin.rotation.y = THREE.MathUtils.lerp(
      spin.rotation.y,
      x * POINTER_TILT * pointerWeight,
      0.12
    );

    /* Spin through hero + move + shrink; freeze once zoom starts */
    if (zoomT < 0.02) {
      frozenSpinZ.current = elapsed * CLOCK_SPIN_Z;
      spin.rotation.z = frozenSpinZ.current;
    } else {
      spin.rotation.z = frozenSpinZ.current;
    }
  });

  const glowIntensity = 1 + easePhase(phases.modelZoom) * 2.8;

  return (
    <group ref={groupRef}>
      <group ref={spinRef}>
        <group ref={tiltRef} rotation={[BASE_TILT.x, BASE_TILT.y, 0]}>
          <LogoBackgroundGlow
            reduceMotion={reduceMotion}
            intensity={glowIntensity}
          />
          <primitive object={model} />
        </group>
      </group>
    </group>
  );
}

function Scene(props: ModelProps) {
  return (
    <>
      <Environment preset="city" environmentIntensity={0.22} />
      <ambientLight intensity={0.28} color="#f4f7ff" />
      <directionalLight
        position={[4, 6, 5]}
        intensity={0.65}
        color="#ffffff"
      />
      <directionalLight
        position={[-3, 2, 4]}
        intensity={0.25}
        color="#66a8ff"
      />
      <spotLight
        position={[3.2, 2.4, 4]}
        angle={0.42}
        penumbra={0.9}
        intensity={1.6}
        color="#ffd0a0"
      />
      <spotLight
        position={[2.8, -1.6, 3.5]}
        angle={0.5}
        penumbra={1}
        intensity={0.9}
        color="#3388ff"
      />
      <HeroModel {...props} />
    </>
  );
}

useGLTF.preload("/models/modal.gltf");

export default function HeroModel3D({
  pointer,
  scrollProgress,
  reduceMotion,
}: HeroModel3DProps) {
  return (
    <Canvas
      className="hero-model-canvas"
      camera={{ position: [-0.12, 0.12, 5.4], fov: 40 }}
      dpr={[1, 1.75]}
      gl={{
        alpha: true,
        antialias: true,
        powerPreference: "high-performance",
        premultipliedAlpha: false,
        logarithmicDepthBuffer: true,
      }}
      onCreated={({ gl, scene }) => {
        gl.setClearColor(0x000000, 0);
        gl.toneMapping = THREE.ACESFilmicToneMapping;
        gl.toneMappingExposure = 1.18;
        scene.background = null;
      }}
    >
      <Suspense fallback={null}>
        <Scene
          pointer={pointer}
          scrollProgress={scrollProgress}
          reduceMotion={reduceMotion}
        />
      </Suspense>
    </Canvas>
  );
}
