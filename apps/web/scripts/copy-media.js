const fs = require("fs");
const path = require("path");

function findMonorepoRoot() {
  let current = process.cwd();
  while (true) {
    if (
      fs.existsSync(path.join(current, "media")) &&
      (fs.existsSync(path.join(current, "courses")) || fs.existsSync(path.join(current, "README.md")))
    ) {
      return current;
    }
    const parent = path.dirname(current);
    if (parent === current) {
      return process.cwd();
    }
    current = parent;
  }
}

function copyDirRecursive(src, dest) {
  if (!fs.existsSync(src)) return;
  if (!fs.existsSync(dest)) {
    fs.mkdirSync(dest, { recursive: true });
  }

  const entries = fs.readdirSync(src, { withFileTypes: true });
  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);

    if (entry.isDirectory()) {
      copyDirRecursive(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

const root = findMonorepoRoot();
const sourceMedia = path.join(root, "media");
const destMedia = path.join(__dirname, "..", "public", "media");

console.log(`Copying media from ${sourceMedia} to ${destMedia}...`);
if (fs.existsSync(sourceMedia)) {
  copyDirRecursive(sourceMedia, destMedia);
  console.log("Media successfully copied to public/media!");
} else {
  console.log("Source media folder not found at root, checking if public/media already exists...");
  if (fs.existsSync(destMedia)) {
    console.log("public/media already populated.");
  }
}

