"use client";

import { useState } from "react";
import { Button } from "@/ds/components/core/Button";
import { insertReview } from "./review-actions";

export default function ReviewForm({ bookingId }: { bookingId: string }) {
  const [open, setOpen] = useState(false);
  const [rating, setRating] = useState(0);
  const [text, setText] = useState("");
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  if (done) return <div style={{ fontSize: "var(--text-xs)", color: "var(--eucalyptus)", fontWeight: 600, padding: "4px 0 10px" }}>Thanks for your review 🌺</div>;

  if (!open) return <button onClick={() => setOpen(true)} style={{ background: "none", border: "none", color: "var(--clay)", fontWeight: 600, fontSize: "var(--text-xs)", cursor: "pointer", fontFamily: "var(--font-body)", padding: "0 0 10px" }}>Leave a review →</button>;

  async function submit() {
    if (!rating) { setErr("Pick a star rating."); return; }
    setBusy(true); setErr(null);
    const res = await insertReview(bookingId, rating, text);
    setBusy(false);
    if (res.ok) setDone(true); else setErr(res.error || "Couldn't submit.");
  }

  return (
    <div style={{ padding: "4px 0 12px", display: "grid", gap: 8 }}>
      <div style={{ display: "flex", gap: 4 }}>
        {[1, 2, 3, 4, 5].map((n) => (
          <button key={n} onClick={() => setRating(n)} aria-label={`${n} stars`} style={{ background: "none", border: "none", cursor: "pointer", fontSize: 22, lineHeight: 1, color: n <= rating ? "var(--brass)" : "var(--cocoa-40)", padding: 0 }}>★</button>
        ))}
      </div>
      <textarea value={text} onChange={(e) => setText(e.target.value)} placeholder="How was it? (optional)" style={{ width: "100%", minHeight: 60, padding: "10px 12px", fontSize: "var(--text-sm)", fontFamily: "var(--font-body)", border: "1px solid var(--line)", borderRadius: "var(--radius-md)", background: "var(--surface)", color: "var(--cocoa)", outline: "none", resize: "vertical" }} />
      {err && <div style={{ color: "var(--clay)", fontSize: "var(--text-xs)" }}>{err}</div>}
      <div><Button size="sm" onClick={submit} disabled={busy}>{busy ? "Sending…" : "Submit review"}</Button></div>
    </div>
  );
}
