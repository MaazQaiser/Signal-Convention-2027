"use client";

import {
  Suspense,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Billboard, Environment, useGLTF } from "@react-three/drei";
import { useReducedMotion } from "framer-motion";
import * as THREE from "three";
import {
  fitBrandmarkModel,
  setupBrandmarkColors,
  tickBrandmarkTime,
} from "@/lib/brandmark-model";
import {
  createGlowMaterial,
  GLOW_STRENGTH,
} from "@/lib/brandmark-glow";

const MODEL_PATH = "/models/modal.gltf";
/** Cancel the ~45° Y rotation baked into the GLTF hierarchy */
const FRONT_YAW = -Math.PI / 4;
/** Glow sits behind the mark — not inside the pointer-tilt group */
const GLOW_ANCHOR: [number, number, number] = [0, 0.2, -1.9];
const POINTER_TILT = 0.2;
const POINTER_SHIFT = 0.32;

function LogoBackgroundGlow({
  reduceMotion,
  intensity = 1,
}: {
  reduceMotion: boolean | null;
  intensity?: number;
}) {
  const glowMat = useMemo(() => {
    const mat = createGlowMaterial(1.55 * GLOW_STRENGTH);
    // Draw as a backdrop; don’t contest depth with translucent logo meshes
    mat.depthTest = false;
    return mat;
  }, []);

  useFrame(({ clock }) => {
    glowMat.uniforms.uTime.value = reduceMotion ? 0 : clock.elapsedTime;
    glowMat.uniforms.uIntensity.value = 1.55 * GLOW_STRENGTH * intensity;
  });

  return (
    <group position={GLOW_ANCHOR}>
      <Billboard follow lockX={false} lockY={false} lockZ={false}>
        <mesh renderOrder={-40} material={glowMat} scale={1.08}>
          <planeGeometry args={[10, 10]} />
        </mesh>
      </Billboard>
    </group>
  );
}

function ClosingMark({
  pointer,
  reduceMotion,
}: {
  pointer: { x: number; y: number };
  reduceMotion: boolean | null;
}) {
  const rootRef = useRef<THREE.Group>(null);
  const meshesRef = useRef<THREE.Mesh[]>([]);
  const smoothPointer = useRef({ x: 0, y: 0 });
  const { scene } = useGLTF(MODEL_PATH);
  const model = useMemo(() => scene.clone(true), [scene]);

  useLayoutEffect(() => {
    const meshes = setupBrandmarkColors(model);
    meshesRef.current = meshes;

    model.rotation.set(0, FRONT_YAW, 0);
    // Fill the square canvas — CSS translateY creates the half-sun
    fitBrandmarkModel(model, 3.15, 0);
    model.rotation.set(0, FRONT_YAW, 0);

    for (const mesh of meshes) {
      const mats = Array.isArray(mesh.material)
        ? mesh.material
        : [mesh.material];
      for (const mat of mats) {
        mat.clippingPlanes = [];
        mat.clipShadows = false;
        mat.needsUpdate = true;
      }
    }
  }, [model]);

  useFrame((state) => {
    tickBrandmarkTime(meshesRef.current, state.clock.elapsedTime);
    const root = rootRef.current;
    if (!root) return;

    const targetX = reduceMotion ? 0 : pointer.x;
    const targetY = reduceMotion ? 0 : pointer.y;

    smoothPointer.current.x = THREE.MathUtils.lerp(
      smoothPointer.current.x,
      targetX,
      0.085
    );
    smoothPointer.current.y = THREE.MathUtils.lerp(
      smoothPointer.current.y,
      targetY,
      0.085
    );

    const { x, y } = smoothPointer.current;

    root.rotation.x = THREE.MathUtils.lerp(
      root.rotation.x,
      y * POINTER_TILT,
      0.12
    );
    root.rotation.y = THREE.MathUtils.lerp(
      root.rotation.y,
      x * POINTER_TILT,
      0.12
    );
    root.rotation.z = THREE.MathUtils.lerp(
      root.rotation.z,
      x * POINTER_TILT * 0.35,
      0.1
    );
    root.position.x = THREE.MathUtils.lerp(
      root.position.x,
      x * POINTER_SHIFT,
      0.1
    );
    root.position.y = THREE.MathUtils.lerp(
      root.position.y,
      -y * POINTER_SHIFT * 0.45,
      0.1
    );
    root.position.z = 0;
  });

  return (
    <>
      <LogoBackgroundGlow reduceMotion={reduceMotion} intensity={0.4} />
      <group ref={rootRef}>
        <primitive object={model} />
      </group>
    </>
  );
}

function CameraRig() {
  useFrame((state) => {
    state.camera.position.set(0, 0.05, 10.6);
    state.camera.lookAt(0, 0, 0);
    state.camera.up.set(0, 1, 0);
    state.camera.updateProjectionMatrix();
  });
  return null;
}

function ClosingScene({
  pointer,
  reduceMotion,
}: {
  pointer: { x: number; y: number };
  reduceMotion: boolean | null;
}) {
  return (
    <>
      <CameraRig />
      <Environment preset="city" environmentIntensity={0.22} />
      <ambientLight intensity={0.34} color="#f4f7ff" />
      <directionalLight position={[0, 2.5, 6]} intensity={0.85} color="#ffffff" />
      <directionalLight
        position={[-2.5, 1.5, 4]}
        intensity={0.28}
        color="#66a8ff"
      />
      <spotLight
        position={[0, 3, 5]}
        angle={0.55}
        penumbra={0.95}
        intensity={1.35}
        color="#ffd0a0"
      />
      <spotLight
        position={[2, 1.2, 4]}
        angle={0.45}
        penumbra={1}
        intensity={0.65}
        color="#3388ff"
      />
      <ClosingMark pointer={pointer} reduceMotion={reduceMotion} />
    </>
  );
}

export default function ClosingModel() {
  const reduceMotion = useReducedMotion();
  const wrapRef = useRef<HTMLDivElement>(null);
  const [pointer, setPointer] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const closing = wrapRef.current?.closest(".closing");
    if (!closing || reduceMotion) return;

    const onMove = (event: PointerEvent) => {
      const rect = closing.getBoundingClientRect();
      const inside =
        event.clientX >= rect.left &&
        event.clientX <= rect.right &&
        event.clientY >= rect.top &&
        event.clientY <= rect.bottom;

      if (!inside) {
        setPointer((prev) =>
          prev.x === 0 && prev.y === 0 ? prev : { x: 0, y: 0 }
        );
        return;
      }

      setPointer({
        x: ((event.clientX - rect.left) / rect.width) * 2 - 1,
        y: ((event.clientY - rect.top) / rect.height) * 2 - 1,
      });
    };

    const onLeave = () => setPointer({ x: 0, y: 0 });

    window.addEventListener("pointermove", onMove, { passive: true });
    closing.addEventListener("pointerleave", onLeave);
    return () => {
      window.removeEventListener("pointermove", onMove);
      closing.removeEventListener("pointerleave", onLeave);
    };
  }, [reduceMotion]);

  return (
    <div ref={wrapRef} className="closing-model" aria-hidden="true">
      <Canvas
        className="closing-model-canvas"
        camera={{ position: [0, 0.05, 10.6], fov: 34 }}
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
          gl.localClippingEnabled = false;
          gl.toneMapping = THREE.ACESFilmicToneMapping;
          gl.toneMappingExposure = 1.18;
          scene.background = null;
        }}
      >
        <Suspense fallback={null}>
          <ClosingScene pointer={pointer} reduceMotion={reduceMotion} />
        </Suspense>
      </Canvas>
    </div>
  );
}

useGLTF.preload(MODEL_PATH);
