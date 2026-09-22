import { existsSync, rmSync } from "node:fs";
import { basename, dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { spawnSync } from "node:child_process";

const scriptsDirectory = dirname(fileURLToPath(import.meta.url));
const projectRoot = resolve(scriptsDirectory, "..");
const outputDirectory = resolve(projectRoot, ".game-image-check");
const tscCli = resolve(projectRoot, "node_modules/typescript/bin/tsc");
let exitCode = 0;

if (dirname(outputDirectory) !== projectRoot || basename(outputDirectory) !== ".game-image-check") {
  throw new Error(`Refusing to manage unexpected validation directory: ${outputDirectory}`);
}

function removeOutputDirectory() {
  if (existsSync(outputDirectory)) rmSync(outputDirectory, { recursive: true, force: true });
}

try {
  removeOutputDirectory();
  const compile = spawnSync(process.execPath, [tscCli, "-p", "tsconfig.game-images.json"], {
    cwd: projectRoot,
    stdio: "inherit"
  });
  if (compile.error) throw compile.error;
  if (compile.status !== 0) {
    exitCode = compile.status ?? 1;
  } else {
    const validate = spawnSync(process.execPath, [resolve(outputDirectory, "scripts/validate-game-images.js")], {
      cwd: projectRoot,
      stdio: "inherit"
    });
    if (validate.error) throw validate.error;
    exitCode = validate.status ?? 1;
  }
} finally {
  removeOutputDirectory();
}

process.exitCode = exitCode;
