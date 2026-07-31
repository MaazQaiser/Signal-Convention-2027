import * as THREE from "three";

export const GLOW_STRENGTH = 0.25;

export const GLOW_VERTEX = /* glsl */ `
varying vec2 vUv;

void main() {
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

export const GLOW_FRAGMENT = /* glsl */ `
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

export function createGlowMaterial(intensity: number) {
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
