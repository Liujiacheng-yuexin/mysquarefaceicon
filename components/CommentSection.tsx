"use client";

import Image from "next/image";
import { ArrowRight, Heart, ImagePlus, MessageCircle, Send, ShieldCheck, Sparkles, Star } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import type { FormEvent } from "react";
import type { LocaleCode, LocaleContent } from "@/lib/locales";

type PublicComment = {
  id: string;
  name: string;
  content: string;
  rating: number;
  likes: number;
  imageUrl?: string;
  createdAt: string;
};

type CommentSectionProps = {
  locale: LocaleCode;
  content: LocaleContent["comments"];
  limit?: number;
  showForm?: boolean;
  showGalleryLink?: boolean;
  showSort?: boolean;
};

const visitorIdKey = "msfi-comment-visitor-id";
const likedCommentsKey = "msfi-liked-comments";

function getVisitorId() {
  const existing = window.localStorage.getItem(visitorIdKey);
  if (existing) return existing;

  const next = crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}-${Math.random().toString(16).slice(2)}`;
  window.localStorage.setItem(visitorIdKey, next);
  return next;
}

function readLikedIds() {
  try {
    return new Set(JSON.parse(window.localStorage.getItem(likedCommentsKey) ?? "[]") as string[]);
  } catch {
    return new Set<string>();
  }
}

function writeLikedIds(ids: Set<string>) {
  window.localStorage.setItem(likedCommentsKey, JSON.stringify(Array.from(ids).slice(0, 500)));
}

export default function CommentSection({
  locale,
  content,
  limit,
  showForm = true,
  showGalleryLink = false,
  showSort = false
}: CommentSectionProps) {
  const [comments, setComments] = useState<PublicComment[]>([]);
  const [rating, setRating] = useState(5);
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [loadError, setLoadError] = useState(false);
  const [sort, setSort] = useState<"latest" | "liked">("latest");
  const [likedIds, setLikedIds] = useState<Set<string>>(new Set());
  const [selectedImageName, setSelectedImageName] = useState("");
  const [imagePreviewUrl, setImagePreviewUrl] = useState("");

  const stars = useMemo(() => [1, 2, 3, 4, 5], []);

  useEffect(() => {
    const params = new URLSearchParams({ locale, sort });
    if (limit) params.set("limit", String(limit));

    setLoadError(false);
    fetch(`/api/comments?${params.toString()}`)
      .then((response) => {
        if (!response.ok) throw new Error("Failed to load comments");
        return response.json() as Promise<{ comments: PublicComment[] }>;
      })
      .then((data) => setComments(data.comments))
      .catch(() => setLoadError(true));
  }, [limit, locale, sort]);

  useEffect(() => {
    setLikedIds(readLikedIds());
  }, []);

  useEffect(() => {
    return () => {
      if (imagePreviewUrl) URL.revokeObjectURL(imagePreviewUrl);
    };
  }, [imagePreviewUrl]);

  async function submitComment(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("submitting");

    const form = event.currentTarget;
    const formData = new FormData(form);
    formData.set("rating", String(rating));
    formData.set("locale", locale);

    const response = await fetch("/api/comments", {
      method: "POST",
      body: formData
    });

    if (!response.ok) {
      setStatus("error");
      return;
    }

    form.reset();
    if (imagePreviewUrl) URL.revokeObjectURL(imagePreviewUrl);
    setImagePreviewUrl("");
    setSelectedImageName("");
    setRating(5);
    setStatus("success");
  }

  function updateSelectedImage(file: File | undefined) {
    if (imagePreviewUrl) URL.revokeObjectURL(imagePreviewUrl);

    if (!file) {
      setImagePreviewUrl("");
      setSelectedImageName("");
      return;
    }

    setSelectedImageName(file.name);
    setImagePreviewUrl(URL.createObjectURL(file));
  }

  async function likeComment(commentId: string) {
    if (likedIds.has(commentId)) return;

    const response = await fetch(`/api/comments/${commentId}/like`, {
      method: "POST",
      headers: {
        "content-type": "application/json"
      },
      body: JSON.stringify({ visitorId: getVisitorId() })
    });

    if (!response.ok) return;

    const data = (await response.json()) as { likes: number; liked: boolean };
    setComments((current) =>
      current.map((comment) => (comment.id === commentId ? { ...comment, likes: data.likes } : comment))
    );

    if (data.liked) {
      const nextLikedIds = new Set(likedIds);
      nextLikedIds.add(commentId);
      setLikedIds(nextLikedIds);
      writeLikedIds(nextLikedIds);
    }
  }

  return (
    <div className={showForm ? "comments-layout" : "comments-layout comments-layout-single"}>
      {showForm && (
        <form className="comment-form" onSubmit={submitComment}>
          <div className="comment-form-hero">
            <span className="comment-form-icon" aria-hidden="true">
              <ImagePlus size={22} />
            </span>
            <div>
              <strong>Share your square face</strong>
              <p>{content.intro}</p>
            </div>
          </div>
          <div className="form-grid">
            <label>
              <span>{content.name}</span>
              <input name="name" required maxLength={80} />
            </label>
            <label>
              <span>{content.email}</span>
              <input name="email" required type="email" maxLength={160} />
            </label>
          </div>
          <label>
            <span>{content.comment}</span>
            <textarea name="content" required maxLength={2000} rows={5} />
          </label>
          <fieldset className="rating-field">
            <legend>
              {content.rating}
              <small>Choose how much you liked the game.</small>
            </legend>
            <div className="rating-row">
              {stars.map((star) => (
                <button
                  aria-label={`${star} star`}
                  className={star <= rating ? "star-button is-active" : "star-button"}
                  key={star}
                  onClick={() => setRating(star)}
                  type="button"
                >
                  <Star aria-hidden="true" fill="currentColor" size={18} />
                </button>
              ))}
            </div>
          </fieldset>
          <label className={selectedImageName ? "file-label has-file" : "file-label"}>
            <span
              className="upload-preview"
              style={imagePreviewUrl ? { backgroundImage: `url("${imagePreviewUrl}")` } : undefined}
              aria-hidden="true"
            >
              {!imagePreviewUrl && <ImagePlus size={22} />}
            </span>
            <span className="upload-copy">
              <strong>{selectedImageName || content.image}</strong>
              <small>JPG, PNG, WebP, or GIF. Maximum 2MB.</small>
            </span>
            <span className="upload-action">Choose image</span>
            <input
              name="image"
              type="file"
              accept="image/jpeg,image/png,image/webp,image/gif"
              onChange={(event) => updateSelectedImage(event.currentTarget.files?.[0])}
            />
          </label>
          <button className="tool-button primary" type="submit" disabled={status === "submitting"}>
            <Send aria-hidden="true" size={18} />
            {status === "submitting" ? "Submitting..." : content.submit}
          </button>
          {status === "success" && (
            <p className="form-message success">
              <ShieldCheck aria-hidden="true" size={17} />
              {content.pending}
            </p>
          )}
          {status === "error" && <p className="form-message error">{content.error}</p>}
        </form>
      )}

      <div className="comments-list" aria-live="polite">
        <div className="comments-list-header">
          <div className="comments-title-group">
            <span className="comments-title-icon" aria-hidden="true">
              <MessageCircle size={18} />
            </span>
            <div>
              <strong>{showForm ? "Community picks" : "Approved community creations"}</strong>
              <span>{showForm ? "A small set of reviewed comments from players." : "Sorted from reviewed public submissions."}</span>
            </div>
          </div>
          {showSort && (
            <div className="comment-sort" aria-label="Sort gallery comments">
              <button className={sort === "latest" ? "is-active" : ""} type="button" onClick={() => setSort("latest")}>
                Latest
              </button>
              <button className={sort === "liked" ? "is-active" : ""} type="button" onClick={() => setSort("liked")}>
                Most Liked
              </button>
            </div>
          )}
        </div>
        {loadError && <p className="form-message error">{content.loadError}</p>}
        {!loadError && comments.length === 0 && (
          <div className="empty-comments">
            <Sparkles aria-hidden="true" size={24} />
            <strong>No creations yet</strong>
            <p>{content.empty} Share the first screenshot after your comment is reviewed.</p>
          </div>
        )}
        {comments.map((comment) => (
          <article className="comment-card" key={comment.id}>
            {comment.imageUrl && (
              <Image
                className="comment-image"
                src={comment.imageUrl}
                alt={`Square face icon shared by ${comment.name}`}
                width={420}
                height={420}
                loading="lazy"
                unoptimized
              />
            )}
            <div className="comment-header">
              <span className="comment-avatar">{comment.name.slice(0, 1).toUpperCase()}</span>
              <div>
                <strong>{comment.name}</strong>
                <span aria-label={`Rating ${comment.rating} out of 5`}>
                  {stars.map((star) => (
                    <Star aria-hidden="true" fill="currentColor" key={star} size={13} />
                  )).slice(0, comment.rating)}
                </span>
              </div>
            </div>
            <p>{comment.content}</p>
            <div className="comment-actions">
              <button
                className={likedIds.has(comment.id) ? "like-button is-liked" : "like-button"}
                type="button"
                onClick={() => void likeComment(comment.id)}
                disabled={likedIds.has(comment.id)}
                aria-label={`Like comment from ${comment.name}`}
              >
                <Heart aria-hidden="true" fill="currentColor" size={17} />
                {comment.likes ?? 0}
              </button>
            </div>
          </article>
        ))}
        {showGalleryLink && (
          <a className="gallery-link-card" href="/gallery">
            View full gallery
            <ArrowRight aria-hidden="true" size={18} />
          </a>
        )}
      </div>
    </div>
  );
}
