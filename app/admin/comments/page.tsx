import type { Metadata } from "next";
import AdminComments from "@/components/AdminComments";

export const metadata: Metadata = {
  title: "Comment Moderation",
  description: "Moderate pending comments for My Square Face Icon.",
  robots: {
    index: false,
    follow: false
  }
};

export default function AdminCommentsPage() {
  return (
    <main className="legal-page admin-page">
      <a className="back-link" href="/">Back to Square Face Generator</a>
      <h1>Comment Moderation</h1>
      <p>Approve, reject, or delete submitted user comments. This page requires the configured admin password.</p>
      <AdminComments />
    </main>
  );
}
