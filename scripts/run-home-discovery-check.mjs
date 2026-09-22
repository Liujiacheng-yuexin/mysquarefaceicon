import { existsSync, rmSync } from "node:fs";
import { spawnSync } from "node:child_process";
import { basename, dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const scriptsDirectory = dirname(fileURLToPath(import.meta.url));
const projectRoot = resolve(scriptsDirectory, "..");
const outputDirectory = resolve(projectRoot, ".home-discovery-check");
const tscCli = resolve(projectRoot, "node_modules/typescript/bin/tsc");
let exitCode = 0;

if (dirname(outputDirectory) !== projectRoot || basename(outputDirectory) !== ".home-discovery-check") {
  throw new Error(`Refusing to manage unexpected validation directory: ${outputDirectory}`);
}

function removeOutputDirectory() {
  if (existsSync(outputDirectory)) rmSync(outputDirectory, { recursive: true, force: true });
}

function run(command, args, timeout) {
  const result = spawnSync(command, args, {
    cwd: projectRoot,
    stdio: "inherit",
    timeout
  });
  if (result.error) throw result.error;
  if (result.signal) throw new Error(`${args.join(" ")} stopped with signal ${result.signal}.`);
  return result.status ?? 1;
}

try {
  removeOutputDirectory();
  exitCode = run(process.execPath, [tscCli, "-p", "tsconfig.home-discovery-check.json"], 60_000);
  if (exitCode === 0) {
    exitCode = run(
      process.execPath,
      [resolve(outputDirectory, "scripts/validate-home-discovery.js")],
      30_000
    );
  }
} finally {
  removeOutputDirectory();
}

process.exitCode = exitCode;
