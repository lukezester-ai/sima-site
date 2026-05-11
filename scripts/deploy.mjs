#!/usr/bin/env node
/**
 * Качва текущия main на двете GitHub repo-та:
 *   - origin = roxsonltd-droid/SIMA-site (запазваме пълната git история)
 *   - vercel = lukezester-ai/sima-site (репото, което Vercel наблюдава)
 *
 * Тъй като двете repo-та имат различни „Initial commit“-и, за `vercel` правим
 * чист sync commit върху `vercel/main` (без force push, без destructive
 * операции). Това гарантира, че Vercel винаги вижда fast-forward push и
 * стартира auto-deploy.
 *
 * Употреба: `npm run deploy`  (след като си направил local commit на main).
 */
import { execSync } from "node:child_process";
import { mkdtempSync, writeFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

function sh(cmd, opts = {}) {
  const out = execSync(cmd, { stdio: opts.silent ? "pipe" : "inherit", encoding: "utf-8" });
  return out ? out.trim() : "";
}
const shOut = (cmd) => execSync(cmd, { stdio: "pipe", encoding: "utf-8" }).trim();

function step(n, total, title) {
  console.log(`\n[${n}/${total}] ${title}`);
}

function ensureClean() {
  const branch = shOut("git rev-parse --abbrev-ref HEAD");
  if (branch !== "main") {
    console.error(`! Не си на main (текущо: ${branch}). Превключи и пробвай отново.`);
    process.exit(1);
  }
  const dirty = shOut("git status --porcelain");
  if (dirty) {
    console.error("! Работното дърво има некомитнати промени. Commit или stash първо.");
    process.exit(1);
  }
}

function ensureRemoteExists(name, expected) {
  try {
    const url = shOut(`git remote get-url ${name}`);
    if (!url.includes(expected)) {
      console.warn(`! Remote ${name} сочи към ${url} (очаквах ${expected}).`);
    }
  } catch {
    console.error(`! Липсва git remote "${name}". Очаквам:`);
    console.error(`    git remote add ${name} https://github.com/${expected}.git`);
    process.exit(1);
  }
}

ensureRemoteExists("origin", "roxsonltd-droid/SIMA-site");
ensureRemoteExists("vercel", "lukezester-ai/sima-site");
ensureClean();

step(1, 4, "Push към origin (roxsonltd-droid/SIMA-site)...");
sh("git push origin main");

step(2, 4, "Fetch на vercel/main (lukezester-ai/sima-site)...");
sh("git fetch vercel main");

step(3, 4, "Подготовка на sync commit върху vercel/main...");
const ourHead = shOut("git rev-parse HEAD");
const ourMsg = shOut(`git log -1 --pretty=%B ${ourHead}`);

sh("git checkout -B __vercel_sync vercel/main", { silent: true });
sh(`git checkout ${ourHead} -- .`, { silent: true });

const treeChanged = shOut("git status --porcelain").length > 0;
if (treeChanged) {
  const tmp = mkdtempSync(join(tmpdir(), "sima-deploy-"));
  const msgFile = join(tmp, "msg.txt");
  writeFileSync(msgFile, ourMsg, "utf-8");
  sh(`git commit -F "${msgFile}"`, { silent: true });
  rmSync(tmp, { recursive: true, force: true });

  step(4, 4, "Push към vercel (lukezester-ai/sima-site)...");
  sh("git push vercel HEAD:main");
} else {
  step(4, 4, "vercel/main вече е до date — няма какво да push-вам.");
}

sh("git checkout main", { silent: true });
sh("git branch -D __vercel_sync", { silent: true });

console.log("\n  Готово. Vercel ще започне deploy автоматично:");
console.log("  https://vercel.com/agrinexus-projects/sima-site/deployments");
