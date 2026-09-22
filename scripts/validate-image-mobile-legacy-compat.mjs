import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { beforeImageMobileSource } from "./image-mobile-legacy-compat.mjs";

const fixture = JSON.parse(readFileSync(new URL("./fixtures/image-mobile-legacy-delta.json", import.meta.url), "utf8"));
const sha = value => createHash("sha256").update(value).digest("hex");
let rejected = 0;
for (const [file, contract] of Object.entries(fixture.files)) {
  const source = readFileSync(file, "utf8").replace(/\r\n/g, "\n");
  const original = beforeImageMobileSource(file, source);
  assert.equal(sha(original), contract.beforeSha256, file);
  assert.equal(beforeImageMobileSource(file, original), original, file + " idempotence");
  assert.equal(beforeImageMobileSource(file, source.replace(/\n/g, "\r\n")), original, file + " CRLF");
  for (const changed of [source + "\n// unrelated edit\n", source.replace(contract.edits[0].after, contract.edits[0].after + " /* drift */")]) {
    assert.throws(() => beforeImageMobileSource(file, changed), file + " must reject unrelated changes");
    rejected++;
  }
}
console.log(`Legacy compatibility passed: ${Object.keys(fixture.files).length} exact inverses; ${rejected} drift fixtures rejected; old goldens unchanged.`);
