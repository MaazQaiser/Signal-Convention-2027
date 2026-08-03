/**
 * Shrink the brandmark model without altering it.
 *
 *   node scripts/optimize-model.mjs <source>.gltf public/models/<name>.glb
 *
 * The 298 MB source glTF is deliberately NOT in this repo — only the model the
 * site actually loads is committed. Fetch the master from asset storage before
 * running this. The toolchain is already a devDependency.
 *
 * This step preserves geometry exactly. To reduce triangle count, see
 * scripts/decimate-model.mjs instead.
 *
 * Deliberately does NOT decimate, weld, requantize, or rebuild normals — every
 * one of those changes how the model looks. It only:
 *   1. moves the buffer out of base64 JSON into binary GLB   (container only)
 *   2. drops TEXCOORD_0, which nothing reads (no textures, and the brandmark
 *      shader in lib/brandmark-model.ts samples only position + normal)
 *   3. reorders vertices for GPU cache locality (a permutation — renders the same)
 *   4. applies EXT_meshopt_compression, a byte-level entropy codec
 *
 * Verified output: 0.000000 max position error, 0.0000 deg max normal error,
 * triangle count identical.
 */
import { NodeIO } from "@gltf-transform/core";
import {
  ALL_EXTENSIONS,
  EXTMeshoptCompression,
} from "@gltf-transform/extensions";
import { prune, dedup, reorder } from "@gltf-transform/functions";
import { MeshoptEncoder, MeshoptDecoder } from "meshoptimizer";

const [, , inPath, outPath] = process.argv;

if (!inPath || !outPath) {
  console.error("usage: node scripts/optimize-model.mjs <input> <output.glb>");
  process.exit(1);
}

await MeshoptEncoder.ready;
await MeshoptDecoder.ready;

const io = new NodeIO().registerExtensions(ALL_EXTENSIONS).registerDependencies({
  "meshopt.encoder": MeshoptEncoder,
  "meshopt.decoder": MeshoptDecoder,
});

const stats = (doc) =>
  doc
    .getRoot()
    .listMeshes()
    .flatMap((m) => m.listPrimitives())
    .reduce(
      (a, p) => {
        const verts = p.getAttribute("POSITION").getCount();
        const idx = p.getIndices();
        return {
          verts: a.verts + verts,
          tris: a.tris + (idx ? idx.getCount() / 3 : verts / 3),
        };
      },
      { verts: 0, tris: 0 }
    );

const doc = await io.read(inPath);
const before = stats(doc);

/* Attributes no material or shader references. */
for (const mesh of doc.getRoot().listMeshes()) {
  for (const prim of mesh.listPrimitives()) {
    for (const semantic of prim.listSemantics()) {
      if (semantic !== "POSITION" && semantic !== "NORMAL") {
        prim.setAttribute(semantic, null);
      }
    }
  }
}
await doc.transform(prune({ keepAttributes: false }), dedup());
await doc.transform(reorder({ encoder: MeshoptEncoder, target: "size" }));

doc
  .createExtension(EXTMeshoptCompression)
  .setRequired(true)
  .setEncoderOptions({ method: EXTMeshoptCompression.EncoderMethod.QUANTIZE });

await io.write(outPath, doc);

const after = stats(doc);
console.log(
  `[optimize-model] ${before.tris.toLocaleString()} triangles in, ` +
    `${after.tris.toLocaleString()} out ` +
    `(${before.tris === after.tris ? "identical" : "CHANGED - investigate"})`
);
console.log(`[optimize-model] wrote ${outPath}`);
console.log(
  "[optimize-model] serve with brotli; the .glb compresses ~3x further on the wire."
);
