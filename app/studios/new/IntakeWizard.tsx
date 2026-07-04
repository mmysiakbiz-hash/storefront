"use client";

import { useState } from "react";
import { Button } from "@/ds/components/core/Button";
import { createClient } from "@/lib/supabase/client";
import { submitIntake, type IntakeData, type ServiceRow, type ClientRow, type StaffRow } from "./actions";

const CATEGORIES = ["Hair", "Barber", "Nails", "Beauty", "Massage", "Spa & Wellness", "Brows & Lashes", "Makeup", "Fitness", "Auto"];
const ISLANDS = ["Mahé", "Praslin", "La Digue"];
const STEPS = ["Basics", "Team", "Services", "Photos", "Clients", "Review"];

const wrap: React.CSSProperties = { maxWidth: 680, margin: "0 auto", padding: "0 var(--gutter)" };
const label: React.CSSProperties = { display: "block", fontSize: "var(--text-sm)", fontWeight: 600, color: "var(--cocoa-80)", margin: "0 0 6px" };
const field: React.CSSProperties = { width: "100%", padding: "12px 14px", fontSize: "var(--text-body)", fontFamily: "var(--font-body)", color: "var(--cocoa)", background: "var(--surface)", border: "1px solid var(--line)", borderRadius: "var(--radius-md)", outline: "none" };
const q: React.CSSProperties = { fontFamily: "var(--font-display)", fontWeight: 400, fontSize: "var(--text-display-sm)", letterSpacing: "var(--ls-display)", margin: "0 0 6px" };
const hint: React.CSSProperties = { fontSize: "var(--text-sm)", color: "var(--cocoa-60)", margin: "0 0 24px" };
const rowBtn: React.CSSProperties = { marginTop: 12, background: "none", border: "none", color: "var(--clay)", fontWeight: 600, cursor: "pointer", fontFamily: "var(--font-body)" };
const del: React.CSSProperties = { ...field, cursor: "pointer", padding: 0, color: "var(--cocoa-40)" };

function parsePaste(text: string): string[][] {
  return text.split(/\r?\n/).map((l) => l.trim()).filter(Boolean)
    .map((l) => l.split(/\t|,|\s{2,}/).map((c) => c.trim()));
}

export default function IntakeWizard() {
  const [step, setStep] = useState(0);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [doneSlug, setDoneSlug] = useState<string | null>(null);
  const [copied, setCopied] = useState("");
  const [agree, setAgree] = useState(false);

  const [name, setName] = useState("");
  const [ownerEmail, setOwnerEmail] = useState("");
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [island, setIsland] = useState(ISLANDS[0]);
  const [address, setAddress] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [tagline, setTagline] = useState("");
  const [bio, setBio] = useState("");
  const [staff, setStaff] = useState<StaffRow[]>([{ name: "" }]);
  const [services, setServices] = useState<ServiceRow[]>([{ name: "", duration_min: 60, price_eur: 0 }]);
  const [clients, setClients] = useState<ClientRow[]>([{ name: "", phone: "", email: "" }]);
  const [photoFiles, setPhotoFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);

  const setStf = (i: number, v: string) => setStaff((p) => p.map((r, j) => (j === i ? { name: v } : r)));
  const setSvc = (i: number, k: keyof ServiceRow, v: string) =>
    setServices((p) => p.map((r, j) => (j === i ? { ...r, [k]: k === "name" || k === "category" ? v : Number(v) } : r)));
  const setCli = (i: number, k: keyof ClientRow, v: string) =>
    setClients((p) => p.map((r, j) => (j === i ? { ...r, [k]: v } : r)));

  const pasteStaff = (t: string) => { const r = parsePaste(t).map((c) => ({ name: c[0] || "" })); if (r.length) setStaff(r); };
  const pasteServices = (t: string) => { const r = parsePaste(t).map((c) => ({ name: c[0] || "", duration_min: Number(c[1]) || 60, price_eur: Number(String(c[2]).replace(/[^0-9.]/g, "")) || 0 })); if (r.length) setServices(r); };
  const pasteClients = (t: string) => { const r = parsePaste(t).map((c) => ({ name: c[0] || "", phone: c[1] || "", email: c[2] || "", staff: c[3] || "" })); if (r.length) setClients(r); };

  function onPhotos(files: FileList | null) {
    if (!files) return;
    const arr = Array.from(files).slice(0, 8);
    setPhotoFiles(arr);
    setPreviews(arr.map((f) => URL.createObjectURL(f)));
  }

  async function submit() {
    setBusy(true); setErr(null);
    let photos: string[] = [];
    try {
      if (photoFiles.length) {
        const supabase = createClient();
        for (const f of photoFiles) {
          const path = `${crypto.randomUUID()}-${f.name.replace(/[^a-zA-Z0-9.]/g, "_")}`;
          const { error } = await supabase.storage.from("studio-photos").upload(path, f);
          if (!error) photos.push(supabase.storage.from("studio-photos").getPublicUrl(path).data.publicUrl);
        }
      }
    } catch { /* zdjęcia opcjonalne */ }

    const payload: IntakeData = { name, owner_email: ownerEmail, category, island, address, whatsapp, tagline, bio, photos, staff, services, clients };
    const res = await submitIntake(payload);
    setBusy(false);
    if (res.ok && res.slug) setDoneSlug(res.slug);
    else setErr(res.error || "Coś poszło nie tak.");
  }

  if (doneSlug) {
    const url = `https://${doneSlug}.book.sey.la`;
    const msg = `Hi! You can now book your appointments with me online — pick a time here: ${url} 🌺`;
    const copy = (text: string, tag: string) => { navigator.clipboard?.writeText(text).then(() => { setCopied(tag); setTimeout(() => setCopied(""), 1600); }); };
    return (
      <div style={{ ...wrap, textAlign: "center", padding: "64px var(--gutter)" }}>
        <div style={{ fontSize: 44, marginBottom: 8 }}>🌺</div>
        <h1 style={q}>Your page is live.</h1>
        <p style={hint}>Auto-generated from your answers — same polished look as every studio.</p>
        <p style={{ margin: "0 0 8px" }}>
          <a href={`/studio/${doneSlug}`} style={{ color: "var(--clay)", fontWeight: 700, fontSize: "var(--text-lead)", textDecoration: "none" }}>{doneSlug}.book.sey.la →</a>
        </p>
        <div style={{ marginTop: 28, textAlign: "left", background: "var(--surface)", border: "1px solid var(--line)", borderRadius: "var(--radius-lg)", padding: 22 }}>
          <div style={{ fontFamily: "var(--font-display)", fontWeight: 500, fontSize: "var(--text-lead)", marginBottom: 4 }}>Tell your clients</div>
          <p style={{ fontSize: "var(--text-sm)", color: "var(--cocoa-60)", margin: "0 0 12px" }}>Send this to your regulars so they can start booking online today.</p>
          <textarea readOnly value={msg} style={{ ...field, minHeight: 74, resize: "none", marginBottom: 12 }} />
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            <Button as="a" href={`https://wa.me/?text=${encodeURIComponent(msg)}`}>Share on WhatsApp</Button>
            <button onClick={() => copy(msg, "msg")} style={{ ...field, width: "auto", cursor: "pointer", fontWeight: 600, color: "var(--cocoa-80)" }}>{copied === "msg" ? "Copied ✓" : "Copy message"}</button>
            <button onClick={() => copy(url, "url")} style={{ ...field, width: "auto", cursor: "pointer", fontWeight: 600, color: "var(--cocoa-80)" }}>{copied === "url" ? "Copied ✓" : "Copy link"}</button>
          </div>
        </div>
        <p style={{ marginTop: 22 }}><a href={`/studio/${doneSlug}`} style={{ color: "var(--clay)", fontWeight: 600, textDecoration: "none" }}>View my page →</a></p>
      </div>
    );
  }

  const cur = STEPS[step];
  const isLast = step === STEPS.length - 1;
  const blockNext = cur === "Basics" && name.trim().length < 2;

  return (
    <div style={{ padding: "40px 0 80px" }}>
      <div style={{ ...wrap, display: "flex", gap: 6, marginBottom: 40 }}>
        {STEPS.map((s, i) => (
          <div key={s} style={{ flex: 1 }}>
            <div style={{ height: 4, borderRadius: 4, background: i <= step ? "var(--clay)" : "var(--line)" }} />
            <div style={{ fontSize: 11, marginTop: 6, color: i === step ? "var(--clay)" : "var(--cocoa-40)", fontWeight: i === step ? 700 : 500 }}>{s}</div>
          </div>
        ))}
      </div>

      <div style={wrap}>
        {cur === "Basics" && (
          <>
            <h1 style={q}>Let’s build your page.</h1>
            <p style={hint}>Answer a few questions — we turn them into a beautiful studio page. No design needed.</p>
            <div style={{ display: "grid", gap: 18 }}>
              <div><label style={label}>Studio name</label><input style={field} value={name} onChange={(e) => setName(e.target.value)} placeholder="Kreol Spa" /></div>
              <div><label style={label}>Your email <span style={{color:"var(--cocoa-40)",fontWeight:400}}>— to manage this page later</span></label><input style={field} type="email" value={ownerEmail} onChange={(e) => setOwnerEmail(e.target.value)} placeholder="you@studio.com" /></div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
                <div><label style={label}>Category</label><select style={field} value={category} onChange={(e) => setCategory(e.target.value)}>{CATEGORIES.map((c) => <option key={c}>{c}</option>)}</select></div>
                <div><label style={label}>Island</label><select style={field} value={island} onChange={(e) => setIsland(e.target.value)}>{ISLANDS.map((c) => <option key={c}>{c}</option>)}</select></div>
              </div>
              <div><label style={label}>Address / area</label><input style={field} value={address} onChange={(e) => setAddress(e.target.value)} placeholder="Beau Vallon, Mahé" /></div>
              <div><label style={label}>WhatsApp number</label><input style={field} value={whatsapp} onChange={(e) => setWhatsapp(e.target.value)} placeholder="+248 ..." /></div>
              <div><label style={label}>One-line tagline</label><input style={field} value={tagline} onChange={(e) => setTagline(e.target.value)} placeholder="Island massage & natural beauty" /></div>
              <div><label style={label}>About your studio</label><textarea style={{ ...field, minHeight: 90, resize: "vertical" }} value={bio} onChange={(e) => setBio(e.target.value)} placeholder="A few warm sentences about your place..." /></div>
            </div>
          </>
        )}

        {cur === "Team" && (
          <>
            <h1 style={q}>Who’s on your team?</h1>
            <p style={hint}>Add everyone who takes appointments — each person gets their own calendar. Solo? Just add yourself. Paste from Excel if it’s a long list.</p>
            <textarea style={{ ...field, minHeight: 56, marginBottom: 16, fontFamily: "monospace", fontSize: 13 }} placeholder={"Paste names, one per line…\nValérie\nSandra"} onChange={(e) => pasteStaff(e.target.value)} />
            <div style={{ display: "grid", gap: 8 }}>
              {staff.map((s, i) => (
                <div key={i} style={{ display: "grid", gridTemplateColumns: "1fr 32px", gap: 8 }}>
                  <input style={field} value={s.name} onChange={(e) => setStf(i, e.target.value)} placeholder="Team member name" />
                  <button onClick={() => setStaff((p) => p.filter((_, j) => j !== i))} style={del}>×</button>
                </div>
              ))}
            </div>
            <button onClick={() => setStaff((p) => [...p, { name: "" }])} style={rowBtn}>+ Add team member</button>
          </>
        )}

        {cur === "Services" && (
          <>
            <h1 style={q}>Your services & prices.</h1>
            <p style={hint}>Type each service, its length and price. Or paste straight from Excel (name · minutes · price).</p>
            <textarea style={{ ...field, minHeight: 64, marginBottom: 16, fontFamily: "monospace", fontSize: 13 }} placeholder={"Paste from Excel here…\nSwedish massage\t60\t55"} onChange={(e) => pasteServices(e.target.value)} />
            <div style={{ display: "grid", gap: 8 }}>
              {services.map((s, i) => (
                <div key={i} style={{ display: "grid", gridTemplateColumns: "1fr 80px 80px 32px", gap: 8 }}>
                  <input style={field} value={s.name} onChange={(e) => setSvc(i, "name", e.target.value)} placeholder="Service name" />
                  <input style={field} value={s.duration_min} onChange={(e) => setSvc(i, "duration_min", e.target.value)} placeholder="min" inputMode="numeric" />
                  <input style={field} value={s.price_eur} onChange={(e) => setSvc(i, "price_eur", e.target.value)} placeholder="€" inputMode="numeric" />
                  <button onClick={() => setServices((p) => p.filter((_, j) => j !== i))} style={del}>×</button>
                </div>
              ))}
            </div>
            <button onClick={() => setServices((p) => [...p, { name: "", duration_min: 60, price_eur: 0 }])} style={rowBtn}>+ Add service</button>
          </>
        )}

        {cur === "Photos" && (
          <>
            <h1 style={q}>Show your space.</h1>
            <p style={hint}>Add up to 8 photos — treatments, interior, results. These become your gallery.</p>
            <label style={{ ...field, display: "block", textAlign: "center", padding: "28px", cursor: "pointer", borderStyle: "dashed" }}>
              <input type="file" accept="image/*" multiple onChange={(e) => onPhotos(e.target.files)} style={{ display: "none" }} />
              <span style={{ color: "var(--clay)", fontWeight: 600 }}>Choose photos</span>
              <div style={{ fontSize: 12, color: "var(--cocoa-40)", marginTop: 4 }}>JPG / PNG · up to 8</div>
            </label>
            {previews.length > 0 && (
              <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 8, marginTop: 16 }}>
                {previews.map((p, i) => <img key={i} src={p} alt="" style={{ width: "100%", aspectRatio: "1", objectFit: "cover", borderRadius: "var(--radius-md)" }} />)}
              </div>
            )}
          </>
        )}

        {cur === "Clients" && (() => {
          const team = staff.map((s) => s.name.trim()).filter(Boolean);
          return (
          <>
            <h1 style={q}>Bring your clients.</h1>
            <p style={hint}>Each team member can pull in their own regulars — assign who serves whom. Type them or paste from Excel (name · phone · email · served by). Private to you.</p>
            <textarea style={{ ...field, minHeight: 64, marginBottom: 16, fontFamily: "monospace", fontSize: 13 }} placeholder={"Paste from Excel here…\nMarie Payet\t+248 251 0000\tmarie@…\tValérie"} onChange={(e) => pasteClients(e.target.value)} />
            <div style={{ display: "grid", gap: 8 }}>
              {clients.map((c, i) => (
                <div key={i} style={{ display: "grid", gridTemplateColumns: team.length ? "1.2fr 1fr 1fr 1fr 32px" : "1.3fr 1fr 1fr 32px", gap: 8 }}>
                  <input style={field} value={c.name} onChange={(e) => setCli(i, "name", e.target.value)} placeholder="Name" />
                  <input style={field} value={c.phone} onChange={(e) => setCli(i, "phone", e.target.value)} placeholder="Phone" />
                  <input style={field} value={c.email} onChange={(e) => setCli(i, "email", e.target.value)} placeholder="Email" />
                  {team.length > 0 && (
                    <select style={field} value={c.staff || ""} onChange={(e) => setCli(i, "staff", e.target.value)}>
                      <option value="">Served by…</option>
                      {team.map((t) => <option key={t} value={t}>{t}</option>)}
                    </select>
                  )}
                  <button onClick={() => setClients((p) => p.filter((_, j) => j !== i))} style={del}>×</button>
                </div>
              ))}
            </div>
            <button onClick={() => setClients((p) => [...p, { name: "", phone: "", email: "", staff: "" }])} style={rowBtn}>+ Add client</button>
          </>
          );
        })()}

        {cur === "Review" && (
          <>
            <h1 style={q}>Ready to go live?</h1>
            <p style={hint}>We’ll generate your page instantly. You can refine it anytime.</p>
            <div style={{ background: "var(--surface)", border: "1px solid var(--line)", borderRadius: "var(--radius-lg)", padding: 22, display: "grid", gap: 10, fontSize: "var(--text-sm)" }}>
              <div><b>{name || "—"}</b> · {category} · {island}</div>
              <div style={{ color: "var(--cocoa-60)" }}>{tagline}</div>
              <div>{staff.filter((s) => s.name.trim()).length} team · {services.filter((s) => s.name.trim()).length} services · {previews.length} photos · {clients.filter((c) => c.name.trim()).length} clients</div>
            </div>
            <label style={{ display: "flex", gap: 8, alignItems: "flex-start", fontSize: "var(--text-xs)", color: "var(--cocoa-60)", lineHeight: 1.5, marginTop: 16 }}>
              <input type="checkbox" checked={agree} onChange={(e) => setAgree(e.target.checked)} style={{ marginTop: 2 }} />
              <span>I confirm my studio details are accurate and that I have the right to add any client contacts I entered, in line with the <a href="/terms" target="_blank" style={{ color: "var(--clay)" }}>Terms</a> and <a href="/privacy" target="_blank" style={{ color: "var(--clay)" }}>Privacy Policy</a>.</span>
            </label>
            {err && <p style={{ color: "var(--clay)", marginTop: 14, fontSize: "var(--text-sm)" }}>⚠ {err}</p>}
          </>
        )}

        <div style={{ display: "flex", justifyContent: "space-between", marginTop: 36 }}>
          <button onClick={() => setStep((s) => Math.max(0, s - 1))} disabled={step === 0} style={{ background: "none", border: "none", color: step === 0 ? "var(--cocoa-40)" : "var(--cocoa-80)", fontWeight: 600, cursor: step === 0 ? "default" : "pointer", fontFamily: "var(--font-body)" }}>← Back</button>
          {!isLast ? (
            <Button onClick={() => !blockNext && setStep((s) => s + 1)}>Continue</Button>
          ) : (
            <Button onClick={submit} disabled={busy || !agree}>{busy ? "Publishing…" : "Publish my page"}</Button>
          )}
        </div>
      </div>
    </div>
  );
}
