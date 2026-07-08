import sharp from "sharp";
import { readFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const svgPath = join(root, "public", "assets", "geo-logo.svg");
const pngPath = join(root, "public", "assets", "geo-logo.png");

const svg = await readFile(svgPath);
await sharp(svg).resize({ width: 900 }).png({ compressionLevel: 9 }).toFile(pngPath);
console.log("Wrote", pngPath);
