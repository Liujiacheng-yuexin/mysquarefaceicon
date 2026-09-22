import { NextRequest } from "next/server";
import { middleware } from "../middleware";

const errors: string[] = [];

function expect(condition: unknown, message: string) {
  if (!condition) errors.push(message);
}

function checkRedirect(
  requestUrl: string,
  expectedLocation: string,
  init?: ConstructorParameters<typeof NextRequest>[1]
) {
  const response = middleware(new NextRequest(requestUrl, init));
  expect(response.status === 308, `${requestUrl} must return 308; received ${response.status}.`);
  expect(
    response.headers.get("location") === expectedLocation,
    `${requestUrl} must redirect to ${expectedLocation}; received ${response.headers.get("location") ?? "no location"}.`
  );
}

function checkPassThrough(
  requestUrl: string,
  init?: ConstructorParameters<typeof NextRequest>[1]
) {
  const response = middleware(new NextRequest(requestUrl, init));
  expect(response.status === 200, `${requestUrl} must pass through; received ${response.status}.`);
  expect(response.headers.get("location") === null, `${requestUrl} must not set a redirect location.`);
  expect(response.headers.get("x-middleware-next") === "1", `${requestUrl} must return NextResponse.next().`);
}

checkPassThrough("https://mysquarefaceicon.com/");
checkRedirect("http://mysquarefaceicon.com/", "https://mysquarefaceicon.com/");
checkRedirect("https://www.mysquarefaceicon.com/", "https://mysquarefaceicon.com/");
checkRedirect("http://www.mysquarefaceicon.com/", "https://mysquarefaceicon.com/");
checkRedirect(
  "http://www.mysquarefaceicon.com/oval-face-icon-generator?ref=op11&mode=full",
  "https://mysquarefaceicon.com/oval-face-icon-generator?ref=op11&mode=full"
);
checkRedirect(
  "https://mysquarefaceicon.com:8443/pixel-art-avatar-icon-generator",
  "https://mysquarefaceicon.com/pixel-art-avatar-icon-generator"
);
checkRedirect(
  "https://mysquarefaceicon.com/gallery?source=cloudflare",
  "https://mysquarefaceicon.com/gallery?source=cloudflare",
  { headers: { "cf-visitor": JSON.stringify({ scheme: "http" }) } }
);
checkRedirect(
  "https://mysquarefaceicon.com/gallery?source=proxy",
  "https://mysquarefaceicon.com/gallery?source=proxy",
  { headers: { "cf-visitor": "invalid", "x-forwarded-proto": "http, https" } }
);
checkRedirect(
  "http://www.mysquarefaceicon.com/api/comments",
  "https://mysquarefaceicon.com/api/comments",
  { method: "POST" }
);
checkRedirect(
  "http://127.0.0.1:3100/oval-face-icon-generator?ref=rewritten-host",
  "https://mysquarefaceicon.com/oval-face-icon-generator?ref=rewritten-host",
  { headers: { host: "www.mysquarefaceicon.com", "x-forwarded-proto": "https" } }
);
checkPassThrough("http://127.0.0.1:3100/", {
  headers: { host: "mysquarefaceicon.com", "x-forwarded-proto": "https" }
});

checkPassThrough("http://localhost:3000/");
checkPassThrough("http://127.0.0.1:3000/oval-face-icon-generator?ref=local");
checkPassThrough("https://preview.mysquarefaceicon.pages.dev/");
checkPassThrough("https://example.com/");
checkPassThrough("https://mysquarefaceicon.com/", {
  headers: { "cf-visitor": "invalid", "x-forwarded-proto": "invalid" }
});

if (errors.length > 0) {
  console.error("OP-11 canonical-host validation failed:");
  for (const error of errors) console.error(`- ${error}`);
  process.exitCode = 1;
} else {
  console.log("OP-11 canonical-host validation passed");
  console.log("- HTTP apex, HTTP www, and HTTPS www normalize to the HTTPS apex with status 308");
  console.log("- paths, queries, and method-preserving redirect semantics are retained");
  console.log("- HTTPS apex, localhost, preview, and unrelated hosts pass through without redirects");
}
