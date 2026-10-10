import assert from "node:assert/strict";

const originalStart = "        return runWithCloudflareRequestContext(request, env, ctx, async () => {";
const protectedStart = "        const response = await runWithCloudflareRequestContext(request, env, ctx, async () => {";
const originalEnd = "        });\n    },\n};\n";
const protectedEnd = `        });
        // Discord banner privacy: prevent Cloudflare's automatic analytics injection.
        // https://developers.cloudflare.com/web-analytics/get-started/
        let privateBanner = false;
        try { privateBanner = /^\\/discord-banner-size\\/?$/.test(decodeURIComponent(new URL(request.url).pathname)); } catch {}
        if (!privateBanner) return response;
        const headers = new Headers(response.headers);
        const cacheControl = headers.get("Cache-Control");
        if (!/(?:^|,)\\s*no-transform\\s*(?:,|$)/i.test(cacheControl || "")) {
            headers.set("Cache-Control", cacheControl ? cacheControl + ", no-transform" : "no-transform");
        }
        // Preserve the response stream, status and existing caching policy.
        return new Response(response.body, { status: response.status, statusText: response.statusText, headers });
    },
};
`;

// The installed OpenNext entry is generated on every platform build. Fail the
// build if its structure changes, rather than silently omitting the privacy rule.
export function protectBannerWorker(value) {
  const source = value.replace(/\r\n/g, "\n");
  if (source.includes(protectedStart)) {
    assert.equal(source.split(protectedStart).length - 1, 1);
    assert.equal(source.split(protectedEnd).length - 1, 1, "Banner Worker policy is incomplete");
    return source;
  }
  assert.equal(source.split(originalStart).length - 1, 1, "OpenNext fetch entry changed; review banner privacy policy");
  assert.equal(source.split(originalEnd).length - 1, 1, "OpenNext fetch ending changed; review banner privacy policy");
  return source.replace(originalStart, protectedStart).replace(originalEnd, protectedEnd);
}
