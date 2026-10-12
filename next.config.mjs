import { readFileSync } from "node:fs";

const ruffleRuntimeManifest = JSON.parse(
  readFileSync(new URL("./data/ruffle-runtime-manifest.json", import.meta.url), "utf8")
);

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async headers() {
    return [{
      source: "/games/friend-block-test",
      headers: [{ key: "Referrer-Policy", value: "no-referrer" }]
    }, {
      source: "/games/friend-block-test/:path+",
      headers: [{ key: "Cache-Control", value: "public, max-age=0, no-transform" }, { key: "Referrer-Policy", value: "no-referrer" }]
    }, ...ruffleRuntimeManifest.files.map((file) => ({
      source: `${ruffleRuntimeManifest.publicBasePath}${file.path}`,
      headers: [
        { key: "Content-Type", value: file.contentType },
        { key: "Cache-Control", value: file.cacheControl }
      ]
    }))];
  }
};

export default nextConfig;
