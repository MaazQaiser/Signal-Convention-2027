"use client";

import { Suspense, useLayoutEffect, useMemo, useRef } from "react";
import type { RefObject } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Billboard, Environment, useGLTF } from "@react-three/drei";
import * as THREE from "three";

import {
  getHeroScrollPhases,
} from "@/lib/hero-scroll-phases";
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

const MODEL_SCALE = 7.2;
const MODEL_SCALE_END = 3.2;
const MODEL_SCALE_CENTER = 5.8;
/** Large enough that the warm core fills the frame on zoom */
const MODEL_SCALE_ZOOM = 28;
const MODEL_ANCHOR: [number, number, number] = [1.95, -1.28, 0];
/** Idle wander targets — right edge + bottom-center of the hero frame */
const MODEL_DRIFT_RIGHT: [number, number, number] = [2.72, -0.72, 0];
const MODEL_DRIFT_BOTTOM: [number, number, number] = [0.2, -1.92, 0];
const MODEL_ANCHOR_END: [number, number, number] = [-1.82, 0.92, 0];
const MODEL_ANCHOR_CENTER: [number, number, number] = [0, 0.02, 0];
const CAMERA_Z_START = 5.4;
const CAMERA_Z_ZOOM = 2.35;
const CAMERA_FOV_START = 40;
const CAMERA_FOV_ZOOM = 26;
const BASE_TILT = { x: 0.12, y: -0.58 };
const POINTER_TILT = 0.18;
/** Idle sway stays near the upright fan pose — never a full Z spin */
const IDLE_SWAY = { x: 0.06, y: 0.08, z: 0.05 };
const IDLE_SPEED = { x: 0.55, y: 0.42, z: 0.35 };
const DRIFT_SPEED = { right: 0.26, bottom: 0.18 };

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
  anchorRef,
  intensity = 1,
}: {
  reduceMotion: boolean | null;
  anchorRef: RefObject<[number, number, number]>;
  intensity?: number;
}) {
  const groupRef = useRef<THREE.Group>(null);
  const glowMat = useMemo(() => createGlowMaterial(1.65 * GLOW_STRENGTH), []);

  useFrame(({ clock }) => {
    glowMat.uniforms.uTime.value = reduceMotion ? 0 : clock.elapsedTime;
    glowMat.uniforms.uIntensity.value = 1.65 * GLOW_STRENGTH * intensity;
    const group = groupRef.current;
    const anchor = anchorRef.current;
    if (group && anchor) {
      group.position.set(anchor[0], anchor[1], anchor[2] - 0.72);
    }
  });

  return (
    <group ref={groupRef}>
      <Billboard follow lockX={false} lockY={false} lockZ={false}>
        <mesh renderOrder={-20} material={glowMat} scale={0.85 + intensity * 0.4}>
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
  const liveAnchorRef = useRef<[number, number, number]>(MODEL_ANCHOR);
  const smoothPointer = useRef({ x: 0, y: 0 });
  const glassMeshesRef = useRef<THREE.Mesh[]>([]);
  const baseMaxDim = useRef(1);
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
  }, [model]);

  useFrame((state) => {
    const spin = spinRef.current;
    const root = groupRef.current;
    const tilt = tiltRef.current;
    if (!spin || !root || !tilt) return;

    /* Model is preloaded under the cover — stay fully visible, no intro pop */
    root.scale.setScalar(1);
    root.visible = true;

    const elapsed = state.clock.elapsedTime;
    tickBrandmarkTime(glassMeshesRef.current, elapsed);

    const cornerT = easePhase(phases.modelToCorner);
    const centerT = easePhase(phases.modelToCenter);
    const zoomT = easePhase(phases.modelZoom);
    /* Turn face-on as we center / dive */
    const faceT = easePhase(Math.max(centerT, zoomT));

    tilt.rotation.x = THREE.MathUtils.lerp(BASE_TILT.x, 0, faceT);
    tilt.rotation.y = THREE.MathUtils.lerp(BASE_TILT.y, 0, faceT);

    let anchor: [number, number, number];
    let targetScale: number;

    if (zoomT > 0) {
      anchor = MODEL_ANCHOR_CENTER;
      targetScale = THREE.MathUtils.lerp(
        MODEL_SCALE_CENTER,
        MODEL_SCALE_ZOOM,
        zoomT
      );
    } else if (centerT > 0) {
      anchor = lerpAnchor(MODEL_ANCHOR_END, MODEL_ANCHOR_CENTER, centerT);
      targetScale = THREE.MathUtils.lerp(
        MODEL_SCALE_END,
        MODEL_SCALE_CENTER,
        centerT
      );
    } else {
      /* Wander between home, right edge, and bottom-center before scroll takes over */
      const driftWeight = reduceMotion ? 0 : 1 - cornerT;
      const rightMix =
        (Math.sin(elapsed * DRIFT_SPEED.right) * 0.5 + 0.5) * driftWeight;
      const bottomMix =
        (Math.sin(elapsed * DRIFT_SPEED.bottom + 1.35) * 0.5 + 0.5) *
        driftWeight;
      let drifted = lerpAnchor(MODEL_ANCHOR, MODEL_DRIFT_RIGHT, rightMix * 0.85);
      drifted = lerpAnchor(drifted, MODEL_DRIFT_BOTTOM, bottomMix * 0.9);
      anchor = lerpAnchor(drifted, MODEL_ANCHOR_END, cornerT);
      targetScale = THREE.MathUtils.lerp(MODEL_SCALE, MODEL_SCALE_END, cornerT);
    }

    liveAnchorRef.current = anchor;

    model.scale.setScalar(targetScale / baseMaxDim.current);
    model.position.set(0, 0, 0);
    const box = new THREE.Box3().setFromObject(model);
    const center = box.getCenter(new THREE.Vector3());
    model.position.set(
      anchor[0] - center.x,
      anchor[1] - center.y,
      anchor[2] - center.z
    );

    /* Pull camera into the bright core while zooming */
    const cam = state.camera;
    if (cam instanceof THREE.PerspectiveCamera) {
      const camT = Math.max(centerT * 0.35, zoomT);
      cam.position.z = THREE.MathUtils.lerp(CAMERA_Z_START, CAMERA_Z_ZOOM, camT);
      cam.position.x = THREE.MathUtils.lerp(-0.55, 0, camT);
      cam.position.y = THREE.MathUtils.lerp(0.12, 0, camT);
      cam.fov = THREE.MathUtils.lerp(CAMERA_FOV_START, CAMERA_FOV_ZOOM, camT);
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

    const motionBlend = Math.max(cornerT, centerT, zoomT);
    const pointerWeight =
      faceT > 0.2 ? 0 : motionBlend > 0.98 ? 0.14 : 1 - motionBlend * 0.85;
    const motionAmount = (1 - faceT) * (reduceMotion ? 0 : 1);
    const { x, y } = smoothPointer.current;

    /* Soft float — always on in the hero pose, fades out on dive */
    root.position.y = Math.sin(elapsed * 1.15) * 0.1 * motionAmount;
    root.position.x = Math.cos(elapsed * 0.9) * 0.05 * motionAmount;
    root.position.z = 0;

    if (reduceMotion) {
      spin.rotation.set(0, 0, 0);
      return;
    }

    const idleX = Math.sin(elapsed * IDLE_SPEED.x) * IDLE_SWAY.x * motionAmount;
    const idleY = Math.cos(elapsed * IDLE_SPEED.y) * IDLE_SWAY.y * motionAmount;
    const idleZ = Math.sin(elapsed * IDLE_SPEED.z) * IDLE_SWAY.z * motionAmount;

    const targetSpinX = idleX + y * POINTER_TILT * pointerWeight;
    const targetSpinY = idleY + x * POINTER_TILT * pointerWeight;
    const targetSpinZ = idleZ;

    spin.rotation.x = THREE.MathUtils.lerp(spin.rotation.x, targetSpinX, 0.12);
    spin.rotation.y = THREE.MathUtils.lerp(spin.rotation.y, targetSpinY, 0.12);
    spin.rotation.z = THREE.MathUtils.lerp(spin.rotation.z, targetSpinZ, 0.12);
  });

  const zoomT = easePhase(phases.modelZoom);
  const glowIntensity = 1 + zoomT * 2.8;

  return (
    <group ref={groupRef}>
      <group ref={tiltRef} rotation={[BASE_TILT.x, BASE_TILT.y, 0]}>
        <group ref={spinRef}>
          <LogoBackgroundGlow
            reduceMotion={reduceMotion}
            anchorRef={liveAnchorRef}
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
      camera={{ position: [-0.55, 0.12, 5.4], fov: 40 }}
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
