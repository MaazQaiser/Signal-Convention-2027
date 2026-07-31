import { NodeIO } from "@gltf-transform/core";
import { ALL_EXTENSIONS } from "@gltf-transform/extensions";
import { MeshoptDecoder } from "meshoptimizer";

// Decode a candidate and measure worst-case deviation from the source model,
// in world units and as a fraction of the model's size.
const [, , refPath, candPath] = process.argv;

await MeshoptDecoder.ready;
const io = new NodeIO()
  .registerExtensions(ALL_EXTENSIONS)
  .registerDependencies({ "meshopt.decoder": MeshoptDecoder });

/** Flatten every primitive to world-space triangle corners, in draw order. */
function worldPoints(doc) {
  const out = [];
  for (const scene of doc.getRoot().listScenes()) {
    scene.traverse((node) => {
      const mesh = node.getMesh();
      if (!mesh) return;
      const m = node.getWorldMatrix();
      for (const prim of mesh.listPrimitives()) {
        const pos = prim.getAttribute("POSITION").getArray();
        const nrm = prim.getAttribute("NORMAL")?.getArray();
        const idx = prim.getIndices()?.getArray();
        const n = pos.length / 3;
        const seq = idx ? Array.from(idx) : Array.from({ length: n }, (_, i) => i);
        for (const i of seq) {
          const x = pos[i * 3], y = pos[i * 3 + 1], z = pos[i * 3 + 2];
          out.push([
            m[0] * x + m[4] * y + m[8] * z + m[12],
            m[1] * x + m[5] * y + m[9] * z + m[13],
            m[2] * x + m[6] * y + m[10] * z + m[14],
            nrm ? nrm[i * 3] : 0,
            nrm ? nrm[i * 3 + 1] : 0,
            nrm ? nrm[i * 3 + 2] : 0,
          ]);
        }
      }
    });
  }
  return out;
}

const A = worldPoints(await io.read(refPath));
const B = worldPoints(await io.read(candPath));

if (A.length !== B.length) {
  console.log(JSON.stringify({ error: "corner count differs", ref: A.length, cand: B.length }));
  process.exit(1);
}

// Model extent, for expressing error as a relative figure.
let lo = [Infinity, Infinity, Infinity], hi = [-Infinity, -Infinity, -Infinity];
for (const p of A) for (let k = 0; k < 3; k++) { lo[k] = Math.min(lo[k], p[k]); hi[k] = Math.max(hi[k], p[k]); }
const extent = Math.max(hi[0] - lo[0], hi[1] - lo[1], hi[2] - lo[2]);

let maxPos = 0, maxNrmDeg = 0;
for (let i = 0; i < A.length; i++) {
  const a = A[i], b = B[i];
  maxPos = Math.max(maxPos, Math.hypot(a[0] - b[0], a[1] - b[1], a[2] - b[2]));
  const dot = a[3] * b[3] + a[4] * b[4] + a[5] * b[5];
  const la = Math.hypot(a[3], a[4], a[5]), lb = Math.hypot(b[3], b[4], b[5]);
  if (la > 0 && lb > 0) {
    maxNrmDeg = Math.max(maxNrmDeg, (Math.acos(Math.min(1, Math.max(-1, dot / (la * lb)))) * 180) / Math.PI);
  }
}

console.log(
  JSON.stringify(
    {
      corners: A.length,
      modelExtent: +extent.toFixed(2),
      maxPositionError: +maxPos.toFixed(6),
      maxPositionErrorRelative: (maxPos / extent).toExponential(2),
      maxNormalErrorDegrees: +maxNrmDeg.toFixed(4),
    },
    null,
    2
  )
);
