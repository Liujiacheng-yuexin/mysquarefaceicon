#!/usr/bin/env node
import { copyFileSync, mkdirSync } from "node:fs";
import { resolve } from "node:path";
import {
  assertPackageContract,
  assertPublicContract,
  manifest,
  projectRoot,
  sha256File
} from "./ruffle-runtime-lib.mjs";

try {
  assertPackageContract();
  const sourceDirectory = resolve(projectRoot, manifest.sourceDirectory);
  const publicDirectory = resolve(projectRoot, `public${manifest.publicBasePath}`);
  mkdirSync(publicDirectory, { recursive: true });

  let copied = 0;
  for (const file of manifest.files) {
    const source = resolve(sourceDirectory, file.path);
    const target = resolve(publicDirectory, file.path);
    let matches = false;
    try {
      matches = sha256File(target) === file.sha256;
    } catch {
      matches = false;
    }
    if (!matches) {
      copyFileSync(source, target);
      copied += 1;
    }
  }

  assertPublicContract();
  console.log(`RUFFLE-001 sync passed: ${manifest.version}; ${manifest.files.length} allowlisted files; ${copied} copied; no network used.`);
} catch (error) {
  console.error(`RUFFLE-001 sync failed: ${error instanceof Error ? error.message : error}`);
  process.exitCode = 1;
}
