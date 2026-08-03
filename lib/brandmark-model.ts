import * as THREE from "three";

/**
 * Brandmark used by hero + closing canvases.
 *
 * 244,354 triangles / 8.6MB, decimated from the 2,443,672-triangle original
 * via scripts/decimate-model.mjs. The filename encodes the triangle count on
 * purpose: /models/* carries a 30-day Cache-Control (see next.config.mjs), so
 * replacing an asset in place would strand returning visitors on the old copy.
 * Rename when you regenerate.
 *
 * Fidelity was measured, not eyeballed: rendered against the original through
 * this exact shader at a fixed camera and frozen uTime, the deviation is
 * 1.1/255 mean over lit pixels with an identical silhouette (4506 vs 4506 lit
 * pixels on a 256^2 grid). For scale, the site's JPEG derivatives measure
 * 1.4-3.0 against their masters.
 */
export const BRANDMARK_MODEL_PATH = "/models/brandmark-244k.glb";

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

/**
 * Do not "optimise" NORMAL out of the asset.
 *
 * The model is entirely flat-shaded — every stored vertex normal matches its
 * triangle's geometric face normal, with no sign flips. That makes the
 * attribute look redundant, since cross(dFdx(viewPos), dFdy(viewPos))
 * reconstructs the same vector and would roughly halve the file.
 *
 * It does not work here. A same-camera, same-uTime render diff measured a mean
 * channel delta of 35/255 with 98% of lit pixels off by more than 8/255: the
 * glass loses its specular sheen and goes visibly flat. That was measured at
 * the original 2.4M triangles, where most were sub-pixel and the 2x2
 * derivative quads straddled several of them; at the current 244k it is less
 * extreme but the same failure mode.
 *
 * The flat shading is also why decimation needs care: welding on POSITION+
 * NORMAL finds nothing to merge, and welding on POSITION alone then averaging
 * normals turns the model smooth-shaded. scripts/decimate-model.mjs restores
 * per-face normals afterwards for exactly this reason.
 */
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
  float fresnel = pow(1.0 - max(dot(N, V), 0.0), 2.4);
  vec3 R = reflect(-L, N);
  float spec = pow(max(dot(R, V), 0.0), 96.0);
  float specWide = pow(max(dot(R, V), 0.0), 24.0);
  float clearcoat = pow(max(dot(reflect(-V, N), V), 0.0), 18.0);

  vec3 tint = mix(uOrange, uBlue, t);
  vec3 body = base * (0.38 + ndotl * 0.32);
  vec3 rim = tint * fresnel * 1.15;
  vec3 highlight = vec3(1.0, 0.99, 0.96) * (spec * 1.35 + specWide * 0.35);
  vec3 coat = vec3(0.95, 0.97, 1.0) * clearcoat * 0.55;
  vec3 innerGlow = uCore * (1.0 - t) * 0.22;

  vec3 color = body + rim + highlight + coat + innerGlow;
  color += uBlue * fresnel * t * 0.28;
  float pulse = 0.5 + 0.5 * sin(uTime * 1.6 + t * 8.0);
  float alpha = 0.62 + fresnel * 0.3 + spec * 0.14 + pulse * 0.04;

  gl_FragColor = vec4(color, clamp(alpha, 0.55, 0.96));
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

/** Apply the hero brandmark orange→blue glass materials to a cloned GLTF scene. */
export function setupBrandmarkColors(model: THREE.Object3D) {
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
    mesh.castShadow = false;
    mesh.receiveShadow = false;
  });

  return meshes;
}

export function tickBrandmarkTime(meshes: THREE.Mesh[], time: number) {
  for (const mesh of meshes) {
    const material = mesh.material as THREE.ShaderMaterial;
    if (material.uniforms?.uTime) {
      material.uniforms.uTime.value = time;
    }
  }
}

export function fitBrandmarkModel(
  model: THREE.Object3D,
  targetSize = 3.6,
  yOffset = -0.2
) {
  model.scale.setScalar(1);
  model.position.set(0, 0, 0);
  const box = new THREE.Box3().setFromObject(model);
  const size = box.getSize(new THREE.Vector3());
  const maxDim = Math.max(size.x, size.y, size.z) || 1;
  model.scale.setScalar(targetSize / maxDim);
  const centered = new THREE.Box3().setFromObject(model);
  const center = centered.getCenter(new THREE.Vector3());
  model.position.set(-center.x, -center.y + yOffset, -center.z);
}
