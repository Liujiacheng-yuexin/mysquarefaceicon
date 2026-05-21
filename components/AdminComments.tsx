"use client";

import Image from "next/image";
import { Check, RefreshCw, Trash2, X } from "lucide-react";
import { useEffect, useState } from "react";

type AdminComment = {
  id: string;
  locale: string;
  name: string;
  email: string;
  content: string;
  rating: number;
  likes?: number;
  status: "pending" | "approved" | "rejected";
  imageKey?: string;
  imageUrl?: string;
  createdAt: string;
};

function AdminCommentImage({ imageKey, name, password }: { imageKey: string; name: string; password: string }) {
  const [src, setSrc] = useState<string | null>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    let active = true;
    let objectUrl: string | null = null;

    async function loadImage() {
      setFailed(false);
      setSrc(null);

      const response = await fetch(`/api/admin/comment-images/${imageKey}`, {
        headers: {
          "x-admin-password": password
        }
      });

      if (!response.ok) {
        setFailed(true);
        return;
      }

      const blob = await response.blob();
      objectUrl = URL.createObjectURL(blob);
      if (active) setSrc(objectUrl);
    }

    void loadImage();

    return () => {
      active = false;
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    };
  }, [imageKey, password]);

  if (failed) {
    return <p className="form-message error">Could not load uploaded image for review.</p>;
  }

  if (!src) {
    return <p className="form-message">Loading uploaded image...</p>;
  }

  return (
    <Image
      src={src}
      alt={`Upload from ${name}`}
      width={220}
      height={220}
      loading="lazy"
      unoptimized
    />
  );
}

export default function AdminComments() {
  const [password, setPassword] = useState("");
  const [comments, setComments] = useState<AdminComment[]>([]);
  const [message, setMessage] = useState("Enter the admin password to load pending comments.");

  async function loadComments() {
    const response = await fetch("/api/admin/comments", {
      headers: {
        "x-admin-password": password
      }
    });
    const data = (await response.json()) as { comments?: AdminComment[]; error?: string };
    if (!response.ok || !data.comments) {
      setMessage(data.error ?? "Failed to load comments.");
      return;
    }
    setComments(data.comments);
    setMessage(`${data.comments.length} comment(s) loaded.`);
  }

  async function updateStatus(id: string, status: AdminComment["status"]) {
    const response = await fetch(`/api/admin/comments/${id}`, {
      method: "PATCH",
      headers: {
        "content-type": "application/json",
        "x-admin-password": password
      },
      body: JSON.stringify({ status })
    });
    if (!response.ok) {
      setMessage("Failed to update comment.");
      return;
    }
    await loadComments();
  }

  async function removeComment(id: string) {
    const response = await fetch(`/api/admin/comments/${id}`, {
      method: "DELETE",
      headers: {
        "x-admin-password": password
      }
    });
    if (!response.ok) {
      setMessage("Failed to delete comment.");
      return;
    }
    await loadComments();
  }

  return (
    <div className="admin-panel">
      <div className="admin-login">
        <label>
          <span>Admin password</span>
          <input type="password" value={password} onChange={(event) => setPassword(event.target.value)} />
        </label>
        <button className="tool-button primary" type="button" onClick={loadComments}>
          <RefreshCw aria-hidden="true" size={18} />
          Load comments
        </button>
      </div>
      <p className="form-message">{message}</p>
      <div className="admin-comment-list">
        {comments.map((comment) => (
          <article className="admin-comment" key={comment.id}>
            <div>
              <strong>{comment.name}</strong>
              <span>{comment.email}</span>
              <span>
                {comment.locale} / {comment.status} / Rating {comment.rating}/5 / Likes {comment.likes ?? 0}
              </span>
            </div>
            <p>{comment.content}</p>
            {comment.imageKey && <AdminCommentImage imageKey={comment.imageKey} name={comment.name} password={password} />}
            <div className="admin-actions">
              <button className="tool-button secondary" type="button" onClick={() => updateStatus(comment.id, "approved")}>
                <Check aria-hidden="true" size={18} />
                Approve
              </button>
              <button className="tool-button secondary" type="button" onClick={() => updateStatus(comment.id, "rejected")}>
                <X aria-hidden="true" size={18} />
                Reject
              </button>
              <button className="tool-button secondary" type="button" onClick={() => removeComment(comment.id)}>
                <Trash2 aria-hidden="true" size={18} />
                Delete
              </button>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
