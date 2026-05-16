"use client";

import Image from "next/image";
import { ImagePlus, Send, Star } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import type { FormEvent } from "react";
import type { LocaleCode, LocaleContent } from "@/lib/locales";

type PublicComment = {
  id: string;
  name: string;
  content: string;
  rating: number;
  imageUrl?: string;
  createdAt: string;
};

type CommentSectionProps = {
  locale: LocaleCode;
  content: LocaleContent["comments"];
};

export default function CommentSection({ locale, content }: CommentSectionProps) {
  const [comments, setComments] = useState<PublicComment[]>([]);
  const [rating, setRating] = useState(5);
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [loadError, setLoadError] = useState(false);

  const stars = useMemo(() => [1, 2, 3, 4, 5], []);

  useEffect(() => {
    fetch(`/api/comments?locale=${locale}`)
      .then((response) => {
        if (!response.ok) throw new Error("Failed to load comments");
        return response.json() as Promise<{ comments: PublicComment[] }>;
      })
      .then((data) => setComments(data.comments))
      .catch(() => setLoadError(true));
  }, [locale]);

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
    setRating(5);
    setStatus("success");
  }

  return (
    <div className="comments-layout">
      <form className="comment-form" onSubmit={submitComment}>
        <p>{content.intro}</p>
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
          <legend>{content.rating}</legend>
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
        <label className="file-label">
          <ImagePlus aria-hidden="true" size={18} />
          <span>{content.image}</span>
          <input name="image" type="file" accept="image/jpeg,image/png,image/webp,image/gif" />
        </label>
        <p className="form-help">JPG, PNG, WebP, or GIF. Maximum 2MB.</p>
        <button className="tool-button primary" type="submit" disabled={status === "submitting"}>
          <Send aria-hidden="true" size={18} />
          {content.submit}
        </button>
        {status === "success" && <p className="form-message success">{content.pending}</p>}
        {status === "error" && <p className="form-message error">{content.error}</p>}
      </form>

      <div className="comments-list" aria-live="polite">
        {loadError && <p className="form-message error">{content.loadError}</p>}
        {!loadError && comments.length === 0 && <p className="empty-comments">{content.empty}</p>}
        {comments.map((comment) => (
          <article className="comment-card" key={comment.id}>
            <div className="comment-header">
              <span className="comment-avatar">{comment.name.slice(0, 1).toUpperCase()}</span>
              <div>
                <strong>{comment.name}</strong>
                <span>{`Rating ${comment.rating}/5`}</span>
              </div>
            </div>
            <p>{comment.content}</p>
            {comment.imageUrl && (
              <Image
                src={comment.imageUrl}
                alt={`Square face icon shared by ${comment.name}`}
                width={220}
                height={220}
                loading="lazy"
                unoptimized
              />
            )}
          </article>
        ))}
      </div>
    </div>
  );
}
