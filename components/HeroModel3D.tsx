"use client";

import { Suspense, useLayoutEffect, useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Billboard, Environment, useGLTF } from "@react-three/drei";
import * as THREE from "three";

import {
  getHeroScrollPhases,
} from "@/lib/hero-scroll-phases";

type HeroModel3DProps = {
  pointer: { x: number; y: number };
  scrollProgress: number;
  reduceMotion: boolean | null;
};

type ModelProps = HeroModel3DProps;

const MODEL_SCALE = 7.2;
const MODEL_SCALE_END = 3.2;
const MODEL_SCALE_CENTER = 5.6;
const MODEL_ANCHOR: [number, number, number] = [1.95, -1.28, 0];
const MODEL_ANCHOR_END: [number, number, number] = [-1.82, 0.92, 0];
const MODEL_ANCHOR_CENTER: [number, number, number] = [0, 0.02, 0];
const BASE_TILT = { x: 0.12, y: -0.58 };
const CLOCK_SPEED = 0.05;
const POINTER_TILT = 0.22;
const POINTER_SPIN = 0.55;

const ORANGE = new THREE.Color("#ff7900");
const BLUE = new THREE.Color("#0055ff");
const WARM_CORE = new THREE.Color("#fff0cc");

function disposeMaterial(material: THREE.Material | THREE.Material[]) {
  if (Array.isArray(material)) {
    material.forEach((entry) => entry.dispose());
  } else {
    material.dispose();
  }
}

function getGeometryBounds(meshes: THREE.Mesh[]) {
  const box = new THREE.Box3();

  for (const mesh of meshes) {
    if (!mesh.geometry.boundingBox) {
      mesh.geometry.computeBoundingBox();
    }
    if (mesh.geometry.boundingBox) {
      box.union(mesh.geometry.boundingBox);
    }
  }

  return box;
}

function getBurstHub(meshes: THREE.Mesh[]) {
  return getGeometryBounds(meshes).getCenter(new THREE.Vector3());
}

function getBurstMaxDist(box: THREE.Box3, hub: THREE.Vector3) {
  const corners = [
    new THREE.Vector3(box.min.x, box.min.y, hub.z),
    new THREE.Vector3(box.max.x, box.min.y, hub.z),
    new THREE.Vector3(box.min.x, box.max.y, hub.z),
    new THREE.Vector3(box.max.x, box.max.y, hub.z),
  ];

  let maxDist = 0;
  for (const corner of corners) {
    maxDist = Math.max(
      maxDist,
      Math.hypot(corner.x - hub.x, corner.y - hub.y)
    );
  }

  return maxDist;
}

function getBurstMinDist(meshes: THREE.Mesh[], hub: THREE.Vector3) {
  let minDist = Infinity;

  for (const mesh of meshes) {
    const position = mesh.geometry.getAttribute("position");
    if (!position) continue;

    const step = Math.max(1, Math.floor(position.count / 25000));

    for (let i = 0; i < position.count; i += step) {
      const x = position.getX(i);
      const y = position.getY(i);
      minDist = Math.min(minDist, Math.hypot(x - hub.x, y - hub.y));
    }
  }

  return Number.isFinite(minDist) ? minDist : 0;
}


const BRANDMARK_VERTEX_SHADER = /* glsl */ `
varying vec3 vLocalPos;
varying vec3 vNormal;
varying vec3 vViewDir;

void main() {
  vLocalPos = position;
  vNormal = normalize(normalMatrix * normal);
  vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
  vViewDir = normalize(-mvPosition.xyz);
  gl_Position = projectionMatrix * mvPosition;
}
`;

const BRANDMARK_FRAGMENT_SHADER = /* glsl */ `
uniform vec2 uHub;
uniform float uMinDist;
uniform float uMaxDist;
uniform vec3 uOrange;
uniform vec3 uBlue;
uniform vec3 uCore;
uniform vec3 uLightDir;
uniform float uTime;

varying vec3 vLocalPos;
varying vec3 vNormal;
varying vec3 vViewDir;

float brandmarkT(vec3 pos) {
  float dist = distance(pos.xy, uHub);
  float span = max(uMaxDist - uMinDist, 0.0001);
  return clamp((dist - uMinDist) / span, 0.0, 1.0);
}

vec3 brandmarkColor(vec3 pos) {
  float t = brandmarkT(pos);
  vec3 bridgeBlue = vec3(0.0, 0.55, 1.0);

  if (t < 0.1) {
    return mix(uCore, uOrange, smoothstep(0.0, 0.1, t));
  }
  if (t < 0.42) {
    return uOrange;
  }
  if (t < 0.52) {
    return mix(uOrange, bridgeBlue, smoothstep(0.42, 0.52, t));
  }
  if (t < 0.58) {
    return mix(bridgeBlue, uBlue, smoothstep(0.52, 0.58, t));
  }
  return uBlue;
}

void main() {
  vec3 base = brandmarkColor(vLocalPos);
  float t = brandmarkT(vLocalPos);
  vec3 N = normalize(vNormal);
  vec3 V = normalize(vViewDir);
  vec3 L = normalize(uLightDir);

  float ndotl = max(dot(N, L), 0.0);
  float fresnel = pow(1.0 - max(dot(N, V), 0.0), 2.8);
  vec3 R = reflect(-L, N);
  float spec = pow(max(dot(R, V), 0.0), 48.0);
  float clearcoat = pow(max(dot(reflect(-V, N), V), 0.0), 12.0);

  vec3 tint = mix(uOrange, uBlue, t);
  vec3 body = base * (0.42 + ndotl * 0.28);
  vec3 rim = tint * fresnel * 0.95;
  vec3 highlight = vec3(1.0, 0.98, 0.94) * spec * 0.85;
  vec3 coat = vec3(0.92, 0.96, 1.0) * clearcoat * 0.35;
  vec3 innerGlow = uCore * (1.0 - t) * 0.18;

  vec3 color = body + rim + highlight + coat + innerGlow;
  color += uBlue * fresnel * t * 0.24;
  float pulse = 0.5 + 0.5 * sin(uTime * 1.6 + t * 8.0);
  float alpha = 0.58 + fresnel * 0.28 + spec * 0.12 + pulse * 0.04;

  gl_FragColor = vec4(color, clamp(alpha, 0.52, 0.94));
}
`;

function createBrandmarkMaterial(
  hub: THREE.Vector3,
  minDist: number,
  maxDist: number,
  index: number
) {
  return new THREE.ShaderMaterial({
    uniforms: {
      uHub: { value: new THREE.Vector2(hub.x, hub.y) },
      uMinDist: { value: minDist },
      uMaxDist: { value: maxDist },
      uOrange: { value: ORANGE.clone() },
      uBlue: { value: BLUE.clone() },
      uCore: { value: WARM_CORE.clone() },
      uLightDir: { value: new THREE.Vector3(0.4, 0.85, 0.55).normalize() },
      uTime: { value: 0 },
    },
    vertexShader: BRANDMARK_VERTEX_SHADER,
    fragmentShader: BRANDMARK_FRAGMENT_SHADER,
    transparent: true,
    depthWrite: false,
    blending: THREE.NormalBlending,
    toneMapped: true,
    side: THREE.DoubleSide,
    polygonOffset: true,
    polygonOffsetFactor: index === 0 ? 2 : -2,
    polygonOffsetUnits: index === 0 ? 4 : -4,
  });
}

function setupModelColors(model: THREE.Object3D) {
  const meshes: THREE.Mesh[] = [];
  model.traverse((child) => {
    if ((child as THREE.Mesh).isMesh) {
      meshes.push(child as THREE.Mesh);
    }
  });

  const box = getGeometryBounds(meshes);
  const hub = getBurstHub(meshes);
  const maxDist = getBurstMaxDist(box, hub);
  const minDist = getBurstMinDist(meshes, hub);

  meshes.forEach((mesh, index) => {
    if (mesh.material) {
      disposeMaterial(mesh.material);
    }

    mesh.geometry.deleteAttribute("color");
    mesh.material = createBrandmarkMaterial(hub, minDist, maxDist, index);
    mesh.renderOrder = index + 1;
    mesh.position.z = index * 0.012;
  });

  return meshes;
}

const GLOW_STRENGTH = 0.25;

const GLOW_VERTEX = /* glsl */ `
varying vec2 vUv;

void main() {
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

const GLOW_FRAGMENT = /* glsl */ `
uniform float uTime;
uniform float uIntensity;
varying vec2 vUv;

void main() {
  vec2 p = (vUv - 0.5) * 2.0;
  float dist = length(p);
  float pulse = 0.96 + 0.04 * sin(uTime * 1.0);

  // Circular feather — kills sharp square plane edges
  float edgeFade = 1.0 - smoothstep(0.68, 1.0, dist);
  if (edgeFade < 0.001) discard;

  float d2 = dist * dist;
  float core = exp(-d2 * 5.5);
  float inner = exp(-d2 * 2.2);
  float mid = exp(-d2 * 0.95);
  float outer = exp(-d2 * 0.35);

  vec3 hot = vec3(1.0, 0.96, 0.88);
  vec3 orange = vec3(1.0, 0.56, 0.12);
  vec3 amber = vec3(1.0, 0.4, 0.04);
  vec3 skyBlue = vec3(0.28, 0.68, 1.0);
  vec3 deepBlue = vec3(0.08, 0.45, 1.0);
  vec3 outerGlow = mix(skyBlue, deepBlue, 0.35);

  vec3 color =
    hot * core * 0.95 +
    orange * inner * 0.78 +
    amber * mid * 0.48 +
    outerGlow * outer * 0.46;

  color *= pulse * uIntensity * edgeFade;

  float alpha =
    (core * 0.62 + inner * 0.42 + mid * 0.28 + outer * 0.24) *
    pulse *
    uIntensity *
    edgeFade;

  gl_FragColor = vec4(color, clamp(alpha, 0.0, 0.98));
}
`;

function createGlowMaterial(intensity: number) {
  return new THREE.ShaderMaterial({
    uniforms: {
      uTime: { value: 0 },
      uIntensity: { value: intensity },
    },
    vertexShader: GLOW_VERTEX,
    fragmentShader: GLOW_FRAGMENT,
    transparent: true,
    depthWrite: false,
    depthTest: true,
    blending: THREE.AdditiveBlending,
    toneMapped: false,
    side: THREE.DoubleSide,
  });
}

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
  anchor,
}: {
  reduceMotion: boolean | null;
  anchor: [number, number, number];
}) {
  const glowMat = useMemo(() => createGlowMaterial(1.65 * GLOW_STRENGTH), []);

  useFrame(({ clock }) => {
    glowMat.uniforms.uTime.value = reduceMotion ? 0 : clock.elapsedTime;
  });

  return (
    <group position={[anchor[0], anchor[1], anchor[2] - 0.72]}>
      <Billboard follow lockX={false} lockY={false} lockZ={false}>
        <mesh renderOrder={-20} material={glowMat}>
          <planeGeometry args={[9.5, 9.5]} />
        </mesh>
      </Billboard>
    </group>
  );
}

function HeroModel({ pointer, scrollProgress, reduceMotion }: ModelProps) {
  const groupRef = useRef<THREE.Group>(null);
  const spinRef = useRef<THREE.Group>(null);
  const clockAngle = useRef(0);
  const smoothPointer = useRef({ x: 0, y: 0 });
  const glassMeshesRef = useRef<THREE.Mesh[]>([]);
  const baseMaxDim = useRef(1);
  const { scene } = useGLTF("/models/modal.gltf");
  const model = useMemo(() => scene.clone(true), [scene]);
  const modelScroll = Math.min(1, scrollProgress);
  const phases = getHeroScrollPhases(modelScroll);

  useLayoutEffect(() => {
    glassMeshesRef.current = setupModelColors(model);
  }, [model]);

  useLayoutEffect(() => {
    model.scale.setScalar(1);
    model.position.set(0, 0, 0);
    model.rotation.set(0, 0, 0);
    const box = new THREE.Box3().setFromObject(model);
    const size = box.getSize(new THREE.Vector3());
    baseMaxDim.current = Math.max(size.x, size.y, size.z) || 1;
  }, [model]);

  useFrame((state, delta) => {
    const spin = spinRef.current;
    const root = groupRef.current;
    if (!spin || !root) return;

    const elapsed = state.clock.elapsedTime;
    for (const mesh of glassMeshesRef.current) {
      const material = mesh.material as THREE.ShaderMaterial;
      if (material.uniforms.uTime) {
        material.uniforms.uTime.value = elapsed;
      }
    }

    const cornerT = easePhase(phases.modelToCorner);
    const centerT = easePhase(phases.modelToCenter);

    let anchor: [number, number, number];
    let targetScale: number;

    if (centerT > 0) {
      anchor = lerpAnchor(MODEL_ANCHOR_END, MODEL_ANCHOR_CENTER, centerT);
      targetScale = THREE.MathUtils.lerp(
        MODEL_SCALE_END,
        MODEL_SCALE_CENTER,
        centerT
      );
    } else {
      anchor = lerpAnchor(MODEL_ANCHOR, MODEL_ANCHOR_END, cornerT);
      targetScale = THREE.MathUtils.lerp(MODEL_SCALE, MODEL_SCALE_END, cornerT);
    }

    model.scale.setScalar(targetScale / baseMaxDim.current);
    model.position.set(0, 0, 0);
    const box = new THREE.Box3().setFromObject(model);
    const center = box.getCenter(new THREE.Vector3());
    model.position.set(
      anchor[0] - center.x,
      anchor[1] - center.y,
      anchor[2] - center.z
    );

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

    const motionBlend = Math.max(cornerT, centerT);
    const settled = cornerT >= 0.98 || centerT > 0.08;
    const pointerWeight = settled ? 0.14 : 1 - motionBlend * 0.85;
    const { x, y } = smoothPointer.current;

    if (settled) {
      root.position.y = Math.sin(elapsed * 1.15) * 0.1;
      root.position.x = Math.cos(elapsed * 0.9) * 0.05;
      root.position.z = 0;
    } else {
      root.position.set(0, 0, 0);
    }

    if (reduceMotion) {
      clockAngle.current -= delta * CLOCK_SPEED;
      spin.rotation.z = clockAngle.current;
      return;
    }

    clockAngle.current -= delta * CLOCK_SPEED;
    spin.rotation.x = THREE.MathUtils.lerp(
      spin.rotation.x,
      y * POINTER_TILT * pointerWeight,
      0.1
    );
    spin.rotation.y = THREE.MathUtils.lerp(
      spin.rotation.y,
      x * POINTER_TILT * pointerWeight,
      0.1
    );
    spin.rotation.z =
      clockAngle.current +
      modelScroll * Math.PI * 0.2 +
      x * POINTER_SPIN * pointerWeight;
  });

  const cornerT = easePhase(phases.modelToCorner);
  const centerT = easePhase(phases.modelToCenter);
  const currentGlowAnchor =
    centerT > 0
      ? lerpAnchor(MODEL_ANCHOR_END, MODEL_ANCHOR_CENTER, centerT)
      : lerpAnchor(MODEL_ANCHOR, MODEL_ANCHOR_END, cornerT);

  return (
    <group ref={groupRef}>
      <group rotation={[BASE_TILT.x, BASE_TILT.y, 0]}>
        <group ref={spinRef}>
          <LogoBackgroundGlow
            reduceMotion={reduceMotion}
            anchor={currentGlowAnchor}
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
