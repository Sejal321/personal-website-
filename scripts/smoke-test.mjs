import { readFile } from "node:fs/promises";
import { join } from "node:path";

const requiredFiles = [
  "index.html", "main.css", "main.js",
  "assets/cover-photo.jpg",
  "assets/chapter-opening.svg",
  "assets/chapter-momentum.svg",
  "assets/chapter-proof.svg",
  "assets/chapter-buildlog.svg",
  "assets/chapter-beyond.svg"
];

const projectRoot = process.cwd();

const checks = [
  { file: "index.html", includes: ["CATALYST", "cover-photo.jpg", "Table of Contents", "Vantage AI", "data-goto"] },
  { file: "main.js", includes: ["flipForward", "flipBackward", "rotateY", "goToPage"] },
  { file: "main.css", includes: ["8.5/11", "rotateY(-180deg)", "perspective"] }
];

async function run() {
  for (const file of requiredFiles) {
    await readFile(join(projectRoot, file), "utf8");
  }
  for (const check of checks) {
    const content = await readFile(join(projectRoot, check.file), "utf8");
    for (const expected of check.includes) {
      if (!content.includes(expected)) {
        throw new Error(`Missing "${expected}" in ${check.file}`);
      }
    }
  }
  console.log("Smoke test passed: CATALYST magazine with page-flip is valid.");
}

run().catch((e) => { console.error(e.message); process.exit(1); });
