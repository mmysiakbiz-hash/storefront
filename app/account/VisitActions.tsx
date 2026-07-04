"use client";

import { useState } from "react";
import { cancelBooking, rescheduleBooking, getAvailabilityFor } from "./booking-lifecycle";

function nextDays(n: number) {
  const out: { key: string; label: string }[] = [];
  for (let i = 0; i < n; i++) { const d = new Date(); d.setDate(d.getDate() + i); out.push({ key: d.toISOString().slice(0, 10), label: i === 0 ? "Today" : i === 1 ? "Tmrw" : d.toLocaleDateString("en-GB", { day: "numeric", month: "short" }) }); }
  return out;
}
const chip = (a: boolean): React.CSSProperties => ({ padding: "6px 11px", borderRadius: "var(--radius-pill)", fontSize: "var(--text-xs)", fontWeight: 600, cursor: "pointer", whiteSpace: "nowrap", border: "1px solid " + (a ? "var(--clay)" : "var(--line)"), background: a ? "var(--clay)" : "var(--surface)", color: a ? "#fff" : "var(--cocoa-80)" });

export default function VisitActions({ bookingId, studioId, staffId, duration }: { bookingId: string; studioId: string; staffId: string; duration: number }) {
  const [mode, setMode] = useState<"idle" | "resch">("idle");
  const [date, setDate] = useState<string>("");
  const [slots, setSlots] = useState<string[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState<"" | "cancelled" | "moved">("");
  const [err, setErr] = useState<string | null>(null);

  if (done === "cancelled") return <div style={{ fontSize: "var(--text-xs)", color: "var(--cocoa-50)" }}>Cancelled.</div>;
  if (done === "moved") return <div style={{ fontSize: "var(--text-xs)", color: "var(--eucalyptus)", fontWeight: 600 }}>Rescheduled ✓</div>;

  async function doCancel() {
    if (!confirm("Cancel this appointment?")) return;
    setBusy(true); setErr(null);
    const r = await cancelBooking(bookingId); setBusy(false);
    if (r.ok) setDone("cancelled"); else setErr(r.error || "Couldn't cancel.");
  }
  async function loadSlots(d: string) { setDate(d); setLoading(true); setSlots(null); setSlots(await getAvailabilityFor(studioId, staffId, d, duration)); setLoading(false); }
  async function move(time: string) {
    setBusy(true); setErr(null);
    const r = await rescheduleBooking(bookingId, date, time); setBusy(false);
    if (r.ok) setDone("moved"); else { setErr(r.error || "Couldn't reschedule."); if (date) loadSlots(date); }
  }

  return (
    <div style={{ display: "grid", gap: 8 }}>
      <div style={{ display: "flex", gap: 14 }}>
        <button onClick={() => setMode(mode === "resch" ? "idle" : "resch")} style={{ background: "none", border: "none", color: "var(--clay)", fontWeight: 600, fontSize: "var(--text-xs)", cursor: "pointer", fontFamily: "var(--font-body)", padding: 0 }}>{mode === "resch" ? "Close" : "Reschedule"}</button>
        <button onClick={doCancel} disabled={busy} style={{ background: "none", border: "none", color: "var(--cocoa-60)", fontWeight: 600, fontSize: "var(--text-xs)", cursor: "pointer", fontFamily: "var(--font-body)", padding: 0 }}>Cancel</button>
      </div>
      {mode === "resch" && (
        <div style={{ display: "grid", gap: 8 }}>
          <div style={{ display: "flex", gap: 6, overflowX: "auto" }}>{nextDays(14).map((d) => <button key={d.key} style={chip(date === d.key)} onClick={() => loadSlots(d.key)}>{d.label}</button>)}</div>
          {loading && <div style={{ fontSize: "var(--text-xs)", color: "var(--cocoa-50)" }}>Checking…</div>}
          {slots && slots.length === 0 && <div style={{ fontSize: "var(--text-xs)", color: "var(--cocoa-50)" }}>No free times that day.</div>}
          {slots && slots.length > 0 && <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>{slots.map((t) => <button key={t} disabled={busy} style={chip(false)} onClick={() => move(t)}>{t}</button>)}</div>}
        </div>
      )}
      {err && <div style={{ fontSize: "var(--text-xs)", color: "var(--clay)" }}>{err}</div>}
    </div>
  );
}
