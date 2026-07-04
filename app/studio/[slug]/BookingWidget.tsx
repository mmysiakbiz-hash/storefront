"use client";

import { useState } from "react";
import { Button } from "@/ds/components/core/Button";
import { getAvailability, bookSlot } from "./booking-actions";

type Svc = { id: string; name: string; duration_min: number; price_eur: number };
type Stf = { id: string; name: string; color: string | null };

const field: React.CSSProperties = { width: "100%", padding: "12px 14px", fontSize: "var(--text-body)", fontFamily: "var(--font-body)", color: "var(--cocoa)", background: "var(--surface)", border: "1px solid var(--line)", borderRadius: "var(--radius-md)", outline: "none" };
const pill = (active: boolean): React.CSSProperties => ({ padding: "9px 15px", borderRadius: "var(--radius-pill)", fontSize: "var(--text-sm)", fontWeight: 600, cursor: "pointer", border: "1px solid " + (active ? "var(--clay)" : "var(--line)"), background: active ? "var(--clay)" : "var(--surface)", color: active ? "#fff" : "var(--cocoa-80)", whiteSpace: "nowrap" });

function nextDays(n: number) {
  const out: { key: string; label: string }[] = [];
  for (let i = 0; i < n; i++) {
    const d = new Date(); d.setDate(d.getDate() + i);
    const key = d.toISOString().slice(0, 10);
    const label = i === 0 ? "Today" : i === 1 ? "Tomorrow" : d.toLocaleDateString("en-GB", { weekday: "short", day: "numeric", month: "short" });
    out.push({ key, label });
  }
  return out;
}

export default function BookingWidget({ studioId, studioName, services, staff }: { studioId: string; studioName: string; services: Svc[]; staff: Stf[] }) {
  const [svc, setSvc] = useState<Svc | null>(services[0] || null);
  const [stf, setStf] = useState<Stf | null>(staff[0] || null);
  const [date, setDate] = useState<string>(nextDays(1)[0].key);
  const [slots, setSlots] = useState<string[] | null>(null);
  const [slot, setSlot] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState(""); const [email, setEmail] = useState(""); const [phone, setPhone] = useState("");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [done, setDone] = useState(false);
  const [agree, setAgree] = useState(false);

  if (!services.length || !staff.length) {
    return <p style={{ color: "var(--cocoa-60)", fontSize: "var(--text-sm)" }}>Online booking is being set up for this studio.</p>;
  }

  async function loadSlots(s = svc, p = stf, d = date) {
    if (!s || !p) return;
    setLoading(true); setSlot(null); setSlots(null);
    const res = await getAvailability(studioId, p.id, d, s.duration_min);
    setSlots(res); setLoading(false);
  }

  async function confirm() {
    if (!svc || !stf || !slot) return;
    setBusy(true); setErr(null);
    const res = await bookSlot({ studioId, serviceId: svc.id, staffId: stf.id, dateStr: date, time: slot, durationMin: svc.duration_min, priceEur: svc.price_eur, name, email, phone, studioName, serviceName: svc.name, staffName: stf.name });
    setBusy(false);
    if (res.ok) setDone(true);
    else { setErr(res.error || "Couldn't book."); loadSlots(); }
  }

  if (done) {
    return (
      <div style={{ textAlign: "center", padding: "20px 0" }}>
        <div style={{ fontSize: 40 }}>🌺</div>
        <h3 style={{ fontFamily: "var(--font-display)", fontWeight: 500, fontSize: "var(--text-display-sm)", margin: "6px 0" }}>You're booked!</h3>
        <p style={{ color: "var(--cocoa-70)" }}>{svc?.name} with {stf?.name} · {date} at {slot}</p>
        <p style={{ color: "var(--cocoa-50)", fontSize: "var(--text-sm)", marginTop: 6 }}>A confirmation is on its way to your email.</p>
      </div>
    );
  }

  return (
    <div style={{ display: "grid", gap: 20 }}>
      <div>
        <div style={lbl}>Service</div>
        <div style={row}>{services.map((s) => <button key={s.id} style={pill(svc?.id === s.id)} onClick={() => { setSvc(s); setSlots(null); setSlot(null); }}>{s.name} · €{s.price_eur}</button>)}</div>
      </div>
      <div>
        <div style={lbl}>With</div>
        <div style={row}>{staff.map((p) => <button key={p.id} style={pill(stf?.id === p.id)} onClick={() => { setStf(p); setSlots(null); setSlot(null); }}>{p.name}</button>)}</div>
      </div>
      <div>
        <div style={lbl}>Date</div>
        <div style={{ ...row, overflowX: "auto" }}>{nextDays(14).map((d) => <button key={d.key} style={pill(date === d.key)} onClick={() => { setDate(d.key); setSlots(null); setSlot(null); }}>{d.label}</button>)}</div>
      </div>

      {slots === null ? (
        <Button onClick={() => loadSlots()} disabled={loading}>{loading ? "Checking…" : "See available times"}</Button>
      ) : slots.length === 0 ? (
        <p style={{ color: "var(--cocoa-60)", fontSize: "var(--text-sm)" }}>No free times that day — try another date or team member.</p>
      ) : (
        <div>
          <div style={lbl}>Pick a time</div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(76px,1fr))", gap: 8 }}>
            {slots.map((t) => <button key={t} style={pill(slot === t)} onClick={() => setSlot(t)}>{t}</button>)}
          </div>
        </div>
      )}

      {slot && (
        <div style={{ display: "grid", gap: 10, borderTop: "1px solid var(--line)", paddingTop: 18 }}>
          <div style={lbl}>Your details</div>
          <input style={field} value={name} onChange={(e) => setName(e.target.value)} placeholder="Full name" />
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
            <input style={field} value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" type="email" />
            <input style={field} value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="Phone / WhatsApp" />
          </div>
          <label style={{ display: "flex", gap: 8, alignItems: "flex-start", fontSize: "var(--text-xs)", color: "var(--cocoa-60)", lineHeight: 1.5 }}>
            <input type="checkbox" checked={agree} onChange={(e) => setAgree(e.target.checked)} style={{ marginTop: 2 }} />
            <span>I agree to the <a href="/terms" target="_blank" style={{ color: "var(--clay)" }}>Terms</a> and <a href="/privacy" target="_blank" style={{ color: "var(--clay)" }}>Privacy Policy</a>, and that my details are shared with the studio to manage my booking.</span>
          </label>
          {err && <p style={{ color: "var(--clay)", fontSize: "var(--text-sm)" }}>⚠ {err}</p>}
          <Button onClick={confirm} disabled={busy || !name.trim() || !agree} full>{busy ? "Booking…" : `Confirm · ${svc?.name} at ${slot}`}</Button>
        </div>
      )}
    </div>
  );
}

const lbl: React.CSSProperties = { fontSize: "var(--text-xs)", fontWeight: 700, textTransform: "uppercase", letterSpacing: ".07em", color: "var(--cocoa-60)", marginBottom: 8 };
const row: React.CSSProperties = { display: "flex", gap: 8, flexWrap: "wrap" };
