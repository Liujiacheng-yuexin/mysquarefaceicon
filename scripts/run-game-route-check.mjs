import { existsSync, rmSync } from "node:fs";
import { spawnSync } from "node:child_process";
import { basename, dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const scriptsDirectory = dirname(fileURLToPath(import.meta.url));
const projectRoot = resolve(scriptsDirectory, "..");
const outputDirectory = resolve(projectRoot, ".game-route-check");
const tscCli = resolve(projectRoot, "node_modules/typescript/bin/tsc");
let exitCode = 0;

if (dirname(outputDirectory) !== projectRoot || basename(outputDirectory) !== ".game-route-check") {
  throw new Error(`Refusing to manage unexpected validation directory: ${outputDirectory}`);
}

function removeOutputDirectory() {
  if (existsSync(outputDirectory)) rmSync(outputDirectory, { recursive: true, force: true });
}

function runTsc(config) {
  const result = spawnSync(process.execPath, [tscCli, "-p", config], {
    cwd: projectRoot,
    stdio: "inherit"
  });
  if (result.error) throw result.error;
  return result.status ?? 1;
}

try {
  removeOutputDirectory();
  exitCode = runTsc("tsconfig.routes.json");
  if (exitCode === 0) exitCode = runTsc("tsconfig.game-route-check.json");

  if (exitCode === 0) {
    const validate = spawnSync(process.execPath, [resolve(outputDirectory, "scripts/validate-game-routes.js")], {
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
