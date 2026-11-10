#!/usr/bin/env node
/**
 * copy-media.js
 * Copies root-level media/ folder → apps/web/public/media/
 * Run before `next build` or `next dev` so static files are served correctly on Vercel.
 */
const fs = require("fs");
const path = require("path");

const src = path.join(__dirname, "..", "media");
const dest = path.join(__dirname, "..", "apps", "web", "public", "media");

function copyDir(from, to) {
  if (!fs.existsSync(from)) return;
  fs.mkdirSync(to, { recursive: true });
  for (const entry of fs.readdirSync(from, { withFileTypes: true })) {
    const srcPath = path.join(from, entry.name);
    const destPath = path.join(to, entry.name);
    if (entry.isDirectory()) {
      copyDir(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

copyDir(src, dest);
console.log(`[copy-media] Copied ${src} → ${dest}`);

