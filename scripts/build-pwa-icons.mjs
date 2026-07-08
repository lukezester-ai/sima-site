import sharp from "sharp";
import { readFile } from "node:fs/promises";
import { mkdir } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const svgPath = join(root, "public", "assets", "geo-mark.svg");
const outDir = join(root, "public", "icons");
const theme = "#063d2a";

const svg = await readFile(svgPath);

/**
 * Квадратна икона: фон + знак по центъра.
 * @param {number} size страна в px
 * @param {number} markRatio дял от size за вътрешния рендер на знака (0–1)
 */
async function writeSquareIcon(size, markRatio, filePath) {
  const inner = Math.max(32, Math.round(size * markRatio));
  const markPng = await sharp(svg).resize(inner, inner, { fit: "contain" }).png().toBuffer();
  await sharp({
    create: { width: size, height: size, channels: 4, background: theme },
  })
    .composite([{ input: markPng, gravity: "center" }])
    .png({ compressionLevel: 9 })
    .toFile(filePath);
}

await mkdir(outDir, { recursive: true });

await writeSquareIcon(192, 0.62, join(outDir, "icon-192.png"));
await writeSquareIcon(512, 0.62, join(outDir, "icon-512.png"));
await writeSquareIcon(512, 0.48, join(outDir, "maskable-512.png"));
await writeSquareIcon(180, 0.62, join(outDir, "apple-touch-icon.png"));

console.log("PWA icons written to", outDir);
