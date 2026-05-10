import { copyFile, stat } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const seedPath = join(root, "data", "db.seed.json");
const dbPath = join(root, "data", "db.json");
const force = process.argv.includes("--force");

try {
  await stat(dbPath);
  if (!force) {
    console.error("data/db.json вече съществува. За презапис: npm run seed:db -- --force");
    process.exit(1);
  }
} catch {
  /* липсва — копираме seed */
}

await copyFile(seedPath, dbPath);
console.log("OK:", dbPath);
