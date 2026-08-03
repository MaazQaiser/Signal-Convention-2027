/**
 * Decimate the brandmark, preserving its flat-shaded look.
 *
 * The source is non-indexed (3 unique verts per triangle) with per-face
 * normals — that is what gives the glass its faceted specular sheen. A naive
 * simplify() welds and averages normals, turning it smooth-shaded, which
 * lib/brandmark-model.ts explicitly warns destroys the look.
 *
 * So: weld (to get indices simplify needs) -> simplify -> unweld -> recompute
 * per-face normals -> re-apply meshopt.
 */
import { NodeIO } from "@gltf-transform/core";
import { ALL_EXTENSIONS, EXTMeshoptCompression } from "@gltf-transform/extensions";
import { weld, unweld, simplify, normals, prune, dedup } from "@gltf-transform/functions";
import { MeshoptDecoder, MeshoptEncoder, MeshoptSimplifier } from "meshoptimizer";
import fs from "fs";

const [, , inPath, outPath, ratioArg, errorArg] = process.argv;
const ratio = Number(ratioArg);
const error = Number(errorArg ?? 0.001);

await MeshoptDecoder.ready;
await MeshoptEncoder.ready;
await MeshoptSimplifier.ready;

const io = new NodeIO()
  .registerExtensions(ALL_EXTENSIONS)
  .registerDependencies({
    "meshopt.decoder": MeshoptDecoder,
    "meshopt.encoder": MeshoptEncoder,
  });

const stats = (doc) =>
  doc.getRoot().listMeshes().flatMap((m) => m.listPrimitives()).reduce(
    (a, p) => {
      const v = p.getAttribute("POSITION").getCount();
      const i = p.getIndices();
      return { verts: a.verts + v, tris: a.tris + (i ? i.getCount() / 3 : v / 3) };
    },
    { verts: 0, tris: 0 }
  );

const doc = await io.read(inPath);
const before = stats(doc);

/*
 * Drop NORMAL *before* welding. weld() compares every attribute, so with
 * unique per-face normals nothing merges and the mesh stays a disconnected
 * triangle soup — meshopt then has no shared edges to collapse and returns
 * the model unchanged (measured: 2,443,672 -> 2,443,634 triangles). Welding
 * on POSITION alone builds real topology. Normals are recomputed below
 * anyway, so discarding them here costs nothing.
 */
for (const mesh of doc.getRoot().listMeshes()) {
  for (const prim of mesh.listPrimitives()) {
    prim.setAttribute("NORMAL", null);
  }
}

await doc.transform(
  weld(),
  simplify({ simplifier: MeshoptSimplifier, ratio, error, lockBorder: false }),
  /* Back to one vertex per triangle corner, then per-face normals: restores
     the faceted flat shading the shader relies on. */
  unweld(),
  normals({ overwrite: true }),
  prune({ keepAttributes: false }),
  dedup()
);

const after = stats(doc);

doc
  .createExtension(EXTMeshoptCompression)
  .setRequired(true)
  .setEncoderOptions({ method: EXTMeshoptCompression.EncoderMethod.QUANTIZE });

await io.write(outPath, doc);
const bytes = fs.statSync(outPath).size;

console.log(
  JSON.stringify({
    ratio,
    error,
    trisBefore: before.tris,
    trisAfter: after.tris,
    keptPct: +((after.tris / before.tris) * 100).toFixed(1),
    vertsAfter: after.verts,
    bytes,
    mb: +(bytes / 1048576).toFixed(1),
  })
);
