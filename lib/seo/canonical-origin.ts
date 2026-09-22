export const CANONICAL_ORIGIN = "https://mysquarefaceicon.com";

const PRODUCTION_HOSTS = new Set([
  "mysquarefaceicon.com",
  "www.mysquarefaceicon.com"
]);

export type CanonicalOriginRequest = {
  requestUrl: string;
  host?: string | null;
  cfVisitor?: string | null;
  forwardedProto?: string | null;
};

type RequestAuthority = {
  hostname: string;
  port: string;
};

function normalizeAuthority(value: string | null | undefined): RequestAuthority | null {
  if (!value) return null;

  try {
    const authority = new URL(`http://${value.split(",", 1)[0]?.trim()}`);
    return {
      hostname: authority.hostname.toLowerCase().replace(/\.$/, ""),
      port: authority.port
    };
  } catch {
    return null;
  }
}

function getProductionAuthority(requestUrl: URL, host: string | null | undefined) {
  const urlAuthority = {
    hostname: requestUrl.hostname.toLowerCase().replace(/\.$/, ""),
    port: requestUrl.port
  };
  if (PRODUCTION_HOSTS.has(urlAuthority.hostname)) return urlAuthority;

  const headerAuthority = normalizeAuthority(host);
  return headerAuthority && PRODUCTION_HOSTS.has(headerAuthority.hostname)
    ? headerAuthority
    : null;
}

function normalizeScheme(value: unknown): "http" | "https" | null {
  if (typeof value !== "string") return null;
  const scheme = value.split(",", 1)[0]?.trim().toLowerCase();
  return scheme === "http" || scheme === "https" ? scheme : null;
}

function getVisitorScheme({ requestUrl, cfVisitor, forwardedProto }: CanonicalOriginRequest) {
  if (cfVisitor) {
    try {
      const visitor = JSON.parse(cfVisitor) as { scheme?: unknown };
      const scheme = normalizeScheme(visitor.scheme);
      if (scheme) return scheme;
    } catch {
      // Ignore malformed proxy metadata and continue with the next trusted signal.
    }
  }

  const forwardedScheme = normalizeScheme(forwardedProto);
  if (forwardedScheme) return forwardedScheme;

  return normalizeScheme(new URL(requestUrl).protocol.replace(/:$/, "")) ?? "https";
}

export function getCanonicalRedirectUrl(input: CanonicalOriginRequest): URL | null {
  const requestUrl = new URL(input.requestUrl);
  const authority = getProductionAuthority(requestUrl, input.host);

  if (!authority) return null;

  const scheme = getVisitorScheme(input);
  const isCanonical =
    scheme === "https" &&
    authority.hostname === "mysquarefaceicon.com" &&
    authority.port === "";

  if (isCanonical) return null;

  const redirectUrl = new URL(requestUrl.href);
  redirectUrl.protocol = "https:";
  redirectUrl.hostname = "mysquarefaceicon.com";
  redirectUrl.port = "";
  return redirectUrl;
}
