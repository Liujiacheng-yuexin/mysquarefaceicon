import { existsSync, rmSync } from "node:fs";
import { spawnSync } from "node:child_process";
import { basename, dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const scriptsDirectory = dirname(fileURLToPath(import.meta.url));
const projectRoot = resolve(scriptsDirectory, "..");
const outputDirectory = resolve(projectRoot, ".canonical-host-check");
const tscCli = resolve(projectRoot, "node_modules/typescript/bin/tsc");
let exitCode = 0;

if (dirname(outputDirectory) !== projectRoot || basename(outputDirectory) !== ".canonical-host-check") {
  throw new Error(`Refusing to manage unexpected validation directory: ${outputDirectory}`);
}

function removeOutputDirectory() {
  if (existsSync(outputDirectory)) rmSync(outputDirectory, { recursive: true, force: true });
}

try {
  removeOutputDirectory();

  const compile = spawnSync(process.execPath, [tscCli, "-p", "tsconfig.canonical-host-check.json"], {
    cwd: projectRoot,
    stdio: "inherit"
  });
  if (compile.error) throw compile.error;
  exitCode = compile.status ?? 1;

  if (exitCode === 0) {
    const validate = spawnSync(
      process.execPath,
      [resolve(outputDirectory, "scripts/validate-canonical-host.js")],
      { cwd: projectRoot, stdio: "inherit" }
    );
    if (validate.error) throw validate.error;
    exitCode = validate.status ?? 1;
  }
} finally {
  removeOutputDirectory();
}

process.exitCode = exitCode;
