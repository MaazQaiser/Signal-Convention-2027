"use client";

import { Suspense, useLayoutEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Environment, useGLTF } from "@react-three/drei";
import {
  motion,
  useInView,
  useReducedMotion,
} from "framer-motion";
import * as THREE from "three";
import {
  fitBrandmarkModel,
  setupBrandmarkColors,
  tickBrandmarkTime,
} from "@/lib/brandmark-model";
import { EASE_SOFT } from "./Reveal";

const MODEL_PATH = "/models/modal.gltf";
const BASE_TILT = { x: 0, y: 0 };

function ClosingMark({
  hover,
  pointer,
  reduceMotion,
}: {
  hover: boolean;
  pointer: { x: number; y: number };
  reduceMotion: boolean | null;
}) {
  const rootRef = useRef<THREE.Group>(null);
  const smooth = useRef({ x: 0, y: 0 });
  const meshesRef = useRef<THREE.Mesh[]>([]);
  const { scene } = useGLTF(MODEL_PATH);
  const model = useMemo(() => scene.clone(true), [scene]);

  /** Upper half only — sunrise sitting on the horizon */
  const clipPlanes = useMemo(
    () => [new THREE.Plane(new THREE.Vector3(0, 1, 0), 0)],
    []
  );

  useLayoutEffect(() => {
    const meshes = setupBrandmarkColors(model);
    meshesRef.current = meshes;
    fitBrandmarkModel(model, 5.2, 0);

    for (const mesh of meshes) {
      const mats = Array.isArray(mesh.material)
        ? mesh.material
        : [mesh.material];
      for (const mat of mats) {
        mat.clippingPlanes = clipPlanes;
        mat.clipShadows = true;
        mat.needsUpdate = true;
      }
    }
  }, [model, clipPlanes]);

  useFrame((state) => {
    tickBrandmarkTime(meshesRef.current, state.clock.elapsedTime);

    const root = rootRef.current;
    if (!root) return;

    const targetX = reduceMotion || !hover ? 0 : pointer.y * 0.08;
    const targetY = reduceMotion || !hover ? 0 : pointer.x * 0.18;

    smooth.current.x = THREE.MathUtils.lerp(smooth.current.x, targetX, 0.1);
    smooth.current.y = THREE.MathUtils.lerp(smooth.current.y, targetY, 0.1);

    root.rotation.x = BASE_TILT.x + smooth.current.x;
    root.rotation.y = BASE_TILT.y + smooth.current.y;
    root.rotation.z = 0;
    root.position.set(0, 0, 0);
  });

  return (
    <group ref={rootRef}>
      <primitive object={model} />
    </group>
  );
}

function CameraRig() {
  useFrame((state) => {
    // Pull back and frame the full upper half, centered, with breathing room
    state.camera.position.set(0, 1.55, 7.2);
    state.camera.lookAt(0, 1.55, 0);
    state.camera.updateProjectionMatrix();
  });
  return null;
}

function ClosingScene({
  hover,
  pointer,
  reduceMotion,
}: {
  hover: boolean;
  pointer: { x: number; y: number };
  reduceMotion: boolean | null;
}) {
  return (
    <>
      <CameraRig />
      <Environment preset="city" environmentIntensity={0.22} />
      <ambientLight intensity={0.28} color="#f4f7ff" />
      <directionalLight position={[4, 6, 5]} intensity={0.65} color="#ffffff" />
      <directionalLight position={[-3, 2, 4]} intensity={0.25} color="#66a8ff" />
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
      <ClosingMark
        hover={hover}
        pointer={pointer}
        reduceMotion={reduceMotion}
      />
    </>
  );
}

export default function ClosingModel() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const inView = useInView(wrapRef, { once: true, amount: 0.15 });
  const reduceMotion = useReducedMotion();
  const [hover, setHover] = useState(false);
  const [pointer, setPointer] = useState({ x: 0, y: 0 });

  return (
    <motion.div
      ref={wrapRef}
      className="closing-model"
      aria-hidden="true"
      initial={reduceMotion ? false : { opacity: 0, y: 80 }}
      animate={
        inView || reduceMotion
          ? { opacity: 1, y: 0 }
          : { opacity: 0, y: 80 }
      }
      transition={{ duration: 1.2, ease: EASE_SOFT }}
      onPointerEnter={() => setHover(true)}
      onPointerLeave={() => {
        setHover(false);
        setPointer({ x: 0, y: 0 });
      }}
      onPointerMove={(event) => {
        const el = event.currentTarget;
        const rect = el.getBoundingClientRect();
        const x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
        const y = ((event.clientY - rect.top) / rect.height) * 2 - 1;
        setPointer({ x, y });
      }}
    >
      <Canvas
        className="closing-model-canvas"
        camera={{ position: [0, 1.55, 7.2], fov: 30 }}
        dpr={[1, 1.6]}
        gl={{
          alpha: true,
          antialias: true,
          powerPreference: "high-performance",
          premultipliedAlpha: false,
          logarithmicDepthBuffer: true,
        }}
        onCreated={({ gl, scene }) => {
          gl.setClearColor(0x000000, 0);
          gl.localClippingEnabled = true;
          gl.toneMapping = THREE.ACESFilmicToneMapping;
          gl.toneMappingExposure = 1.22;
          scene.background = null;
        }}
      >
        <Suspense fallback={null}>
          <ClosingScene
            hover={hover}
            pointer={pointer}
            reduceMotion={reduceMotion}
          />
        </Suspense>
      </Canvas>
    </motion.div>
  );
}

useGLTF.preload(MODEL_PATH);
