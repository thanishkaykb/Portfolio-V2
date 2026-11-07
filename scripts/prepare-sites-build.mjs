#!/usr/bin/env node
/**
 * Assembles the Sites upload folder: the Vite build as static assets, the
 * Worker (which adds the live /api/github endpoint) and the deploy manifest.
 *
 * Usage: npm run build && node scripts/prepare-sites-build.mjs
 */

import { cpSync, existsSync, mkdirSync, rmSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const out = join(root, "freebuff-sites-build");
const assets = join(out, "assets");

if (!existsSync(join(root, "dist", "index.html"))) {
  console.error("dist/ is missing. Run `npm run build` first.");
  process.exit(1);
}

rmSync(assets, { recursive: true, force: true });
mkdirSync(assets, { recursive: true });
cpSync(join(root, "dist"), assets, { recursive: true });
cpSync(join(root, "sites", "worker.js"), join(out, "worker.js"));

writeFileSync(
  join(out, "manifest.json"),
  JSON.stringify(
    {
      entrypoint: "worker.js",
      compatibilityDate: "2026-10-01",
      compatibilityFlags: [],
      modules: [{ name: "worker.js", type: "esm", path: "worker.js" }],
      assetsDirectory: "assets",
      spa: true,
    },
    null,
    2,
  ) + "\n",
);

console.log("freebuff-sites-build is ready: assets, worker.js and manifest.json");
