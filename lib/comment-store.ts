import type { LocaleCode } from "./locales";

export type CommentStatus = "pending" | "approved" | "rejected";

export type StoredComment = {
  id: string;
  locale: LocaleCode;
  name: string;
  email: string;
  content: string;
  rating: number;
  status: CommentStatus;
  imageKey?: string;
  imageType?: string;
  imageUrl?: string;
  createdAt: string;
  updatedAt: string;
  audit: Array<{
    action: string;
    at: string;
  }>;
};

type KVLike = {
  get: (key: string, type?: "json" | "text") => Promise<unknown>;
  put: (key: string, value: string, options?: Record<string, unknown>) => Promise<void>;
  delete: (key: string) => Promise<void>;
};

type R2Like = {
  get: (key: string) => Promise<{
    body: ReadableStream | null;
    httpMetadata?: { contentType?: string };
  } | null>;
  put: (key: string, value: ArrayBuffer, options?: { httpMetadata?: { contentType?: string } }) => Promise<void>;
  delete: (key: string) => Promise<void>;
};

type CloudflareEnv = {
  COMMENTS_KV?: KVLike;
  COMMENT_IMAGES_R2?: R2Like;
  ADMIN_PASSWORD?: string;
};

type StoreContext = {
  kv?: KVLike;
  r2?: R2Like;
  adminPassword?: string;
};

const INDEX_KEY = "comments:index";
const COMMENT_PREFIX = "comment:";
const MAX_IMAGE_SIZE = 2 * 1024 * 1024;
const allowedImageTypes = new Set(["image/jpeg", "image/png", "image/webp", "image/gif"]);

const localStore = globalThis as typeof globalThis & {
  __MSFI_COMMENTS__?: {
    index: string[];
    comments: Map<string, StoredComment>;
    images: Map<string, { bytes: ArrayBuffer; contentType: string }>;
  };
};

function getLocalStore() {
  localStore.__MSFI_COMMENTS__ ??= {
    index: [],
    comments: new Map(),
    images: new Map()
  };
  return localStore.__MSFI_COMMENTS__;
}

async function getStoreContext(): Promise<StoreContext> {
  if (process.env.MSFI_USE_CLOUDFLARE_BINDINGS !== "true") {
    return {
      adminPassword: process.env.ADMIN_PASSWORD
    };
  }

  try {
    const { getCloudflareContext } = await import("@opennextjs/cloudflare");
    const context = await getCloudflareContext({ async: true });
    const env = context.env as CloudflareEnv;
    return {
      kv: env.COMMENTS_KV,
      r2: env.COMMENT_IMAGES_R2,
      adminPassword: env.ADMIN_PASSWORD
    };
  } catch {
    return {
      adminPassword: process.env.ADMIN_PASSWORD
    };
  }
}

function publicComment(comment: StoredComment) {
  return {
    id: comment.id,
    name: comment.name,
    content: comment.content,
    rating: comment.rating,
    imageUrl: comment.imageUrl,
    createdAt: comment.createdAt
  };
}

function commentKey(id: string) {
  return `${COMMENT_PREFIX}${id}`;
}

async function readIndex(kv?: KVLike) {
  if (!kv) return getLocalStore().index;

  const value = await kv.get(INDEX_KEY, "json");
  return Array.isArray(value) ? (value as string[]) : [];
}

async function writeIndex(index: string[], kv?: KVLike) {
  if (!kv) {
    getLocalStore().index = index;
    return;
  }

  await kv.put(INDEX_KEY, JSON.stringify(index));
}

async function readComment(id: string, kv?: KVLike) {
  if (!kv) return getLocalStore().comments.get(id) ?? null;

  const value = await kv.get(commentKey(id), "json");
  return value ? (value as StoredComment) : null;
}

async function writeComment(comment: StoredComment, kv?: KVLike) {
  if (!kv) {
    getLocalStore().comments.set(comment.id, comment);
    return;
  }

  await kv.put(commentKey(comment.id), JSON.stringify(comment));
}

export function validateImage(file: File) {
  if (!file || file.size === 0) return null;
  if (file.size > MAX_IMAGE_SIZE) {
    throw new Error("Image must be 2MB or smaller.");
  }
  if (!allowedImageTypes.has(file.type)) {
    throw new Error("Image type is not allowed.");
  }
  return file;
}

function safeFileName(name: string) {
  return name.toLowerCase().replace(/[^a-z0-9._-]+/g, "-").replace(/^-+|-+$/g, "") || "upload";
}

export async function createComment(input: {
  locale: LocaleCode;
  name: string;
  email: string;
  content: string;
  rating: number;
  image?: File | null;
}) {
  const context = await getStoreContext();
  const id = crypto.randomUUID();
  const now = new Date().toISOString();
  let imageKey: string | undefined;
  let imageType: string | undefined;
  let imageUrl: string | undefined;

  if (input.image) {
    const file = validateImage(input.image);
    if (file) {
      imageType = file.type;
      imageKey = `comments/${id}/${safeFileName(file.name)}`;
      const bytes = await file.arrayBuffer();
      if (context.r2) {
        await context.r2.put(imageKey, bytes, {
          httpMetadata: { contentType: imageType }
        });
      } else {
        getLocalStore().images.set(imageKey, { bytes, contentType: imageType });
      }
      imageUrl = `/api/comment-images/${imageKey}`;
    }
  }

  const comment: StoredComment = {
    id,
    locale: input.locale,
    name: input.name,
    email: input.email,
    content: input.content,
    rating: input.rating,
    status: "pending",
    imageKey,
    imageType,
    imageUrl,
    createdAt: now,
    updatedAt: now,
    audit: [{ action: "submitted", at: now }]
  };

  await writeComment(comment, context.kv);
  const index = await readIndex(context.kv);
  await writeIndex([id, ...index.filter((existing) => existing !== id)].slice(0, 500), context.kv);

  return comment;
}

export async function listPublicComments(locale?: LocaleCode) {
  const context = await getStoreContext();
  const index = await readIndex(context.kv);
  const comments = await Promise.all(index.map((id) => readComment(id, context.kv)));
  return comments
    .filter((comment): comment is StoredComment => Boolean(comment))
    .filter((comment) => comment.status === "approved")
    .filter((comment) => !locale || comment.locale === locale)
    .slice(0, 50)
    .map(publicComment);
}

export async function listAdminComments(password: string | null) {
  const context = await getStoreContext();
  assertAdmin(password, context.adminPassword);
  const index = await readIndex(context.kv);
  const comments = await Promise.all(index.map((id) => readComment(id, context.kv)));
  return comments.filter((comment): comment is StoredComment => Boolean(comment));
}

export async function updateCommentStatus(id: string, status: CommentStatus, password: string | null) {
  const context = await getStoreContext();
  assertAdmin(password, context.adminPassword);
  const comment = await readComment(id, context.kv);
  if (!comment) throw new Error("Comment not found.");

  const now = new Date().toISOString();
  const updated = {
    ...comment,
    status,
    updatedAt: now,
    audit: [...comment.audit, { action: status, at: now }]
  };
  await writeComment(updated, context.kv);
  return updated;
}

export async function deleteComment(id: string, password: string | null) {
  const context = await getStoreContext();
  assertAdmin(password, context.adminPassword);
  const comment = await readComment(id, context.kv);

  if (comment?.imageKey) {
    if (context.r2) await context.r2.delete(comment.imageKey);
    else getLocalStore().images.delete(comment.imageKey);
  }

  if (context.kv) await context.kv.delete(commentKey(id));
  else getLocalStore().comments.delete(id);

  const index = await readIndex(context.kv);
  await writeIndex(index.filter((existing) => existing !== id), context.kv);
}

export async function getCommentImage(key: string) {
  const context = await getStoreContext();
  if (context.r2) {
    const object = await context.r2.get(key);
    if (!object?.body) return null;
    return {
      body: object.body,
      contentType: object.httpMetadata?.contentType ?? "application/octet-stream"
    };
  }

  const image = getLocalStore().images.get(key);
  if (!image) return null;
  return {
    body: image.bytes,
    contentType: image.contentType
  };
}

function assertAdmin(password: string | null, configuredPassword?: string) {
  if (!configuredPassword) {
    throw new Error("Admin password is not configured.");
  }
  if (!password || password !== configuredPassword) {
    throw new Error("Unauthorized.");
  }
}

export function getAdminPasswordFromRequest(request: Request) {
  return request.headers.get("x-admin-password");
}
