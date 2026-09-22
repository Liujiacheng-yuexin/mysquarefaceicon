import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readdirSync, readFileSync, statSync } from "node:fs";
import { basename, dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

export const projectRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
export const manifestPath = resolve(projectRoot, "data/ruffle-runtime-manifest.json");
export const manifest = JSON.parse(readFileSync(manifestPath, "utf8"));

export const runtimeFileNames = manifest.files.map((file) => file.path);
export const runtimeFileNameSet = new Set(runtimeFileNames);

export function sha256File(file) {
  return createHash("sha256").update(readFileSync(file)).digest("hex");
}

export function validateManifest(value = manifest) {
  assert.equal(value.schemaVersion, 1, "unsupported Ruffle manifest schema");
  assert.equal(value.packageName, "@ruffle-rs/ruffle", "unexpected Ruffle package name");
  assert.match(value.version, /^0\.2\.0-nightly\.\d{4}\.\d+\.\d+$/, "Ruffle version must be an exact nightly");
  assert.equal(value.license, "(MIT OR Apache-2.0)", "unexpected installed Ruffle license declaration");
  assert.equal(value.sourceDirectory, "node_modules/@ruffle-rs/ruffle", "Ruffle source must be the installed package");
  assert.equal(value.publicBasePath, "/ruffle/", "Ruffle public path must be same-origin /ruffle/");
  assert.equal(value.entryFile, "ruffle.js", "unexpected Ruffle entry file");
  assert.equal(value.files.length, 5, "Ruffle manifest must contain the five deployed runtime files");
  assert.equal(new Set(runtimeFileNames).size, runtimeFileNames.length, "duplicate Ruffle manifest file");
  assert.ok(runtimeFileNameSet.has(value.entryFile), "Ruffle entry file is not allowlisted");

  for (const file of value.files) {
    assert.equal(file.path, basename(file.path), `nested Ruffle path is not allowed: ${file.path}`);
    assert.match(file.sha256, /^[a-f0-9]{64}$/, `invalid SHA-256 for ${file.path}`);
    assert.ok(Number.isSafeInteger(file.bytes) && file.bytes > 0, `invalid byte length for ${file.path}`);
    if (file.path.endsWith(".wasm")) {
      assert.equal(file.contentType, "application/wasm", `wrong WASM MIME for ${file.path}`);
    } else {
      assert.equal(file.contentType, "application/javascript; charset=utf-8", `wrong JS MIME for ${file.path}`);
    }
    assert.equal(
      file.cacheControl,
      file.path === value.entryFile
        ? "public, max-age=0, must-revalidate"
        : "public, max-age=31536000, immutable",
      `wrong cache policy for ${file.path}`
    );
  }
}

function assertFileMatches(file, expected, label) {
  const stat = statSync(file);
  assert.equal(stat.isFile(), true, `${label} is not a file`);
  assert.equal(stat.size, expected.bytes, `${label} byte length drifted`);
  assert.equal(sha256File(file), expected.sha256, `${label} SHA-256 drifted`);
}

export function assertPackageContract() {
  validateManifest();
  const packageJson = JSON.parse(readFileSync(resolve(projectRoot, "package.json"), "utf8"));
  const packageLock = JSON.parse(readFileSync(resolve(projectRoot, "package-lock.json"), "utf8"));
  const installedJson = JSON.parse(readFileSync(resolve(projectRoot, manifest.sourceDirectory, "package.json"), "utf8"));

  assert.equal(packageJson.dependencies?.[manifest.packageName], manifest.version, "package.json must pin the exact Ruffle version");
  assert.equal(packageLock.packages?.[""]?.dependencies?.[manifest.packageName], manifest.version, "package-lock root Ruffle spec drifted");
  assert.equal(packageLock.packages?.[`node_modules/${manifest.packageName}`]?.version, manifest.version, "package-lock installed Ruffle version drifted");
  assert.equal(installedJson.name, manifest.packageName, "installed Ruffle package name drifted");
  assert.equal(installedJson.version, manifest.version, "installed Ruffle package version drifted");
  assert.equal(installedJson.license, manifest.license, "installed Ruffle license declaration drifted");

  const packageDirectory = resolve(projectRoot, manifest.sourceDirectory);
  const packageRuntimeFiles = readdirSync(packageDirectory)
    .filter((file) => (file.endsWith(".js") && !file.endsWith(".js.map")) || file.endsWith(".wasm"))
    .sort();
  assert.deepEqual(packageRuntimeFiles, [...runtimeFileNames].sort(), "installed Ruffle runtime file set drifted");
  for (const file of manifest.files) {
    assertFileMatches(resolve(packageDirectory, file.path), file, `installed ${file.path}`);
  }
}

export function assertPublicContract() {
  const publicDirectory = resolve(projectRoot, `public${manifest.publicBasePath}`);
  const publicFiles = readdirSync(publicDirectory).sort();
  assert.deepEqual(publicFiles, [...runtimeFileNames].sort(), "public/ruffle must contain exactly the allowlisted runtime files");
  for (const file of manifest.files) {
    assertFileMatches(resolve(publicDirectory, file.path), file, `public ${file.path}`);
  }
}

export function assertRuntimeContract() {
  assertPackageContract();
  assertPublicContract();
}
