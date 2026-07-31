import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const MODEL_PATH = path.join(__dirname, "..", "public", "models", "modal.gltf");
const MIN_MODEL_BYTES = 10 * 1024 * 1024;
const REPO = "MaazQaiser/Signal-Convention-2027";
const BRANCH = "main";
const MODEL_GIT_PATH = "public/models/modal.gltf";

function isLfsPointer(filePath) {
  if (!fs.existsSync(filePath)) return true;
  const stat = fs.statSync(filePath);
  if (stat.size >= MIN_MODEL_BYTES) return false;
  const head = fs.readFileSync(filePath, "utf8", { start: 0, end: 120 });
  return head.startsWith("version https://git-lfs.github.com/spec/v1");
}

async function downloadFromGitHubLfs() {
  const pointerRes = await fetch(
    `https://raw.githubusercontent.com/${REPO}/${BRANCH}/${MODEL_GIT_PATH}`
  );

  if (!pointerRes.ok) {
    throw new Error(`Failed to read LFS pointer (${pointerRes.status})`);
  }

  const pointer = await pointerRes.text();
  const oid = pointer.match(/oid sha256:([a-f0-9]+)/)?.[1];
  const size = Number(pointer.match(/size (\d+)/)?.[1] ?? 0);

  if (!oid || !size) {
    throw new Error("Invalid Git LFS pointer for modal.gltf");
  }

  const batchRes = await fetch(
    `https://github.com/${REPO}.git/info/lfs/objects/batch`,
    {
      method: "POST",
      headers: {
        Accept: "application/vnd.git-lfs+json",
        "Content-Type": "application/vnd.git-lfs+json",
      },
      body: JSON.stringify({
        operation: "download",
        transfers: ["basic"],
        objects: [{ oid, size }],
      }),
    }
  );

  if (!batchRes.ok) {
    throw new Error(`Git LFS batch request failed (${batchRes.status})`);
  }

  const batch = await batchRes.json();
  const downloadUrl = batch?.objects?.[0]?.actions?.download?.href;

  if (!downloadUrl) {
    throw new Error("Git LFS batch response did not include a download URL");
  }

  const fileRes = await fetch(downloadUrl, {
    headers: batch.objects[0].actions.download.header ?? {},
  });

  if (!fileRes.ok) {
    throw new Error(`Model download failed (${fileRes.status})`);
  }

  const bytes = Buffer.from(await fileRes.arrayBuffer());
  fs.mkdirSync(path.dirname(MODEL_PATH), { recursive: true });
  fs.writeFileSync(MODEL_PATH, bytes);
}

async function main() {
  if (!isLfsPointer(MODEL_PATH)) {
    console.log("[ensure-model] 3D model already present.");
    return;
  }

  console.log("[ensure-model] Fetching modal.gltf from GitHub LFS...");
  await downloadFromGitHubLfs();

  const sizeMb = (fs.statSync(MODEL_PATH).size / (1024 * 1024)).toFixed(1);
  console.log(`[ensure-model] Saved modal.gltf (${sizeMb} MB).`);
}

main().catch((error) => {
  console.error("[ensure-model]", error.message);
  process.exit(1);
});
