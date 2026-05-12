import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const targets = [
  join(process.cwd(), ".open-next", "worker.js"),
  join(process.cwd(), ".open-next", "server-functions", "default", "handler.mjs")
];

const replacements = [
  {
    pattern: /process\.chdir\(\s*__dirname\s*\);?/g,
    replacement: "try { if (__dirname) process.chdir(__dirname); } catch {};"
  },
  {
    pattern: /process\.chdir\(\s*["']{2}\s*\);?/g,
    replacement: "try { /* Cloudflare Workers has no filesystem cwd to enter. */ } catch {};"
  }
];

let total = 0;

for (const target of targets) {
  if (!existsSync(target)) continue;

  const source = readFileSync(target, "utf8");
  let patched = source;
  let fileCount = 0;

  for (const { pattern, replacement } of replacements) {
    patched = patched.replace(pattern, () => {
      fileCount += 1;
      total += 1;
      return replacement;
    });
  }

  if (fileCount > 0) {
    writeFileSync(target, patched);
    console.log(`Patched ${fileCount} OpenNext chdir call(s) in ${target}`);
  }
}

if (total === 0) {
  console.log("No OpenNext chdir calls needed patching.");
}
