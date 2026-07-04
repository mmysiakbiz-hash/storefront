import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { Stub } from "../_stub";
import { Logo } from "@/ds/components/brand/Logo";
import { Icon } from "@/ds/components/brand/Icon";
import { Button } from "@/ds/components/core/Button";
import { updateProfile, addService, deleteService, signOut, saveLoyalty, saveHours, redeemReward, saveGoogle, cancelBookingSalon } from "./actions";

export const dynamic = "force-dynamic";

const card: React.CSSProperties = { background: "var(--surface)", border: "1px solid var(--line)", borderRadius: "var(--radius-lg)", padding: 24, marginBottom: 20 };
const h2: React.CSSProperties = { fontFamily: "var(--font-display)", fontWeight: 500, fontSize: "var(--text-lead)", margin: "0 0 16px" };
const label: React.CSSProperties = { display: "block", fontSize: "var(--text-xs)", fontWeight: 600, color: "var(--cocoa-60)", margin: "0 0 5px", textTransform: "uppercase", letterSpacing: ".06em" };
const field: React.CSSProperties = { width: "100%", padding: "11px 13px", fontSize: "var(--text-sm)", fontFamily: "var(--font-body)", color: "var(--cocoa)", background: "var(--shell)", border: "1px solid var(--line)", borderRadius: "var(--radius-md)", outline: "none" };
const DAYS: [number, string][] = [[1, "Mon"], [2, "Tue"], [3, "Wed"], [4, "Thu"], [5, "Fri"], [6, "Sat"], [0, "Sun"]];
function minToHHMM(m?: number) { if (m == null) return ""; return String(Math.floor(m / 60)).padStart(2, "0") + ":" + String(m % 60).padStart(2, "0"); }

export default async function PanelPage() {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
    return <Stub title="Studio panel" subtitle="Connect the app to its database to sign in and manage your studio." />;
  }

  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/account?next=/panel");
  const email = user.email!.toLowerCase();

  const admin = createAdminClient();
  await admin.from("studios").update({ owner_id: user.id }).is("owner_id", null).eq("owner_email", email);
  const { data: studios } = await admin.from("studios").select("*").or(`owner_id.eq.${user.id},owner_email.eq.${email}`).order("created_at");
  const list = (studios as any[]) || [];

  const maxw: React.CSSProperties = { maxWidth: 760, margin: "0 auto", padding: "0 var(--gutter)" };

  const Header = (
    <nav style={{ borderBottom: "1px solid var(--line)", background: "var(--shell)" }}>
      <div style={{ ...maxw, maxWidth: 900, display: "flex", alignItems: "center", height: 66 }}>
        <a href="/" style={{ textDecoration: "none" }}><Logo product="book" /></a>
        <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 14 }}>
          <span style={{ fontSize: "var(--text-sm)", color: "var(--cocoa-60)" }}>{email}</span>
          <form action={signOut}><button style={{ background: "none", border: "1px solid var(--line)", borderRadius: "var(--radius-pill)", padding: "7px 14px", fontSize: "var(--text-sm)", fontWeight: 600, color: "var(--cocoa-80)", cursor: "pointer", fontFamily: "var(--font-body)" }}>Sign out</button></form>
        </div>
      </div>
    </nav>
  );

  if (list.length === 0) {
    return (
      <>
        {Header}
        <main style={{ ...maxw, textAlign: "center", padding: "80px var(--gutter)" }}>
          <h1 style={{ fontFamily: "var(--font-display)", fontWeight: 400, fontSize: "var(--text-display-sm)", margin: "0 0 10px" }}>No studio yet</h1>
          <p style={{ color: "var(--cocoa-60)", marginBottom: 24 }}>We couldn’t find a studio for {email}. Create one and it’ll appear here.</p>
          <Button as="a" href="/studios/new">Add your studio</Button>
        </main>
      </>
    );
  }

  const studio = list[0];
  const [{ data: services }, { data: staff }, { data: clients }, { data: bookings }, { data: loyalty }] = await Promise.all([
    admin.from("services").select("id, name, duration_min, price_eur").eq("studio_id", studio.id).order("sort"),
    admin.from("staff").select("id, name, color").eq("studio_id", studio.id).eq("active", true),
    admin.from("clients").select("name, phone, staff_id").eq("studio_id", studio.id),
    admin.from("booking_times").select("id, starts_at, status, service_name, staff_name, staff_color, guest_name, guest_phone").eq("studio_id", studio.id).neq("status", "cancelled").gte("starts_at", new Date().toISOString()).order("starts_at").limit(40),
    admin.from("loyalty_programs").select("stamps_required, reward, active").eq("studio_id", studio.id).maybeSingle(),
  ]);
  const svc = (services as any[]) || [];
  const team = (staff as any[]) || [];
  const cli = (clients as any[]) || [];
  const bk = (bookings as any[]) || [];
  const loy = (loyalty as any) || null;

  // nagrody gotowe do wydania (gdy program aktywny)
  let rewardsReady: { email: string; name: string; available: number }[] = [];
  if (loy?.active) {
    const [{ data: allBk }, { data: reds }] = await Promise.all([
      admin.from("bookings").select("guest_email, guest_name").eq("studio_id", studio.id).neq("status", "cancelled"),
      admin.from("loyalty_redemptions").select("guest_email").eq("studio_id", studio.id),
    ]);
    const cnt: Record<string, { n: number; name: string }> = {};
    for (const b of (allBk as any[]) || []) { if (!b.guest_email) continue; const e = String(b.guest_email).toLowerCase(); const c = cnt[e] || { n: 0, name: b.guest_name || e }; c.n++; cnt[e] = c; }
    const red: Record<string, number> = {};
    for (const r of (reds as any[]) || []) { const e = String(r.guest_email).toLowerCase(); red[e] = (red[e] || 0) + 1; }
    for (const [e, c] of Object.entries(cnt)) { const avail = Math.floor(c.n / loy.stamps_required) - (red[e] || 0); if (avail > 0) rewardsReady.push({ email: e, name: c.name, available: avail }); }
  }
  const { data: hoursRows } = await admin.from("business_hours").select("day_of_week, open_min, close_min").eq("studio_id", studio.id);
  const hoursMap: Record<number, { open: number; close: number }> = {};
  for (const h of (hoursRows as any[]) || []) hoursMap[h.day_of_week] = { open: h.open_min, close: h.close_min };

  const isLive = studio.status === "verified";
  const trialEnds = studio.trial_ends_at ? new Date(studio.trial_ends_at) : null;
  const daysLeft = trialEnds ? Math.max(0, Math.ceil((trialEnds.getTime() - Date.now()) / 86400000)) : null;

  return (
    <>
      {Header}
      <main style={{ ...maxw, padding: "36px var(--gutter) 80px" }}>
        {/* overview */}
        <div style={{ ...card, display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 20, flexWrap: "wrap" }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
              <h1 style={{ fontFamily: "var(--font-display)", fontWeight: 400, fontSize: "var(--text-display-sm)", margin: 0 }}>{studio.name}</h1>
              <span style={{ fontSize: 11, fontWeight: 700, padding: "3px 10px", borderRadius: "var(--radius-pill)", background: isLive ? "rgba(111,130,101,.16)" : "rgba(178,146,95,.18)", color: isLive ? "var(--eucalyptus)" : "var(--brass)" }}>{isLive ? "Live" : "Pending review"}</span>
            </div>
            <div style={{ fontSize: "var(--text-sm)", color: "var(--cocoa-60)" }}>{studio.category} · {studio.island}</div>
            <a href={`/studio/${studio.slug}`} style={{ display: "inline-flex", gap: 6, alignItems: "center", marginTop: 12, color: "var(--clay)", fontWeight: 600, fontSize: "var(--text-sm)", textDecoration: "none" }}>
              <Icon name="arrowRight" size={15} /> {studio.slug}.book.sey.la
            </a>
          </div>
          <div style={{ textAlign: "right", fontSize: "var(--text-sm)" }}>
            {daysLeft !== null && daysLeft > 0
              ? <div style={{ color: "var(--eucalyptus)", fontWeight: 700 }}>Free trial · {daysLeft} days left</div>
              : <div style={{ color: "var(--cocoa-80)", fontWeight: 700 }}>{studio.plan === "active" ? "Active" : "Trial ended"}</div>}
            <div style={{ color: "var(--cocoa-40)", marginTop: 2 }}>then €{Math.max(1, team.length) * 25}/mo <span style={{ opacity: .7 }}>(€25 × {team.length || 1})</span></div>
          </div>
        </div>

        {/* upcoming bookings */}
        <div style={card}>
          <h2 style={h2}>Upcoming bookings <span style={{ color: "var(--cocoa-40)", fontWeight: 400 }}>· {bk.length}</span></h2>
          {bk.length === 0 ? <p style={{ fontSize: "var(--text-sm)", color: "var(--cocoa-40)" }}>No bookings yet — they’ll appear here the moment clients book.</p> :
            <div style={{ display: "grid" }}>
              {bk.map((b) => {
                const when = new Date(b.starts_at).toLocaleString("en-GB", { weekday: "short", day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" });
                return (
                  <div key={b.id} style={{ display: "flex", alignItems: "center", gap: 12, padding: "11px 0", borderBottom: "1px solid var(--line)" }}>
                    <span style={{ width: 9, height: 9, borderRadius: "50%", background: b.staff_color || "var(--clay)", flexShrink: 0 }} />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: "var(--text-sm)", fontWeight: 600 }}>{b.guest_name || "Guest"} · {b.service_name}</div>
                      <div style={{ fontSize: "var(--text-xs)", color: "var(--cocoa-60)" }}>{when} · {b.staff_name}{b.guest_phone ? ` · ${b.guest_phone}` : ""}</div>
                    </div>
                    <form action={cancelBookingSalon.bind(null, studio.id, b.id)}><button title="Cancel" style={{ background: "none", border: "none", color: "var(--cocoa-40)", cursor: "pointer", fontSize: "var(--text-xs)", fontWeight: 600, fontFamily: "var(--font-body)" }}>Cancel</button></form>
                  </div>
                );
              })}
            </div>}
        </div>

        {/* profile */}
        <div style={card}>
          <h2 style={h2}>Your page</h2>
          <form action={updateProfile.bind(null, studio.id)} style={{ display: "grid", gap: 14 }}>
            <div><label style={label}>Tagline</label><input style={field} name="tagline" defaultValue={studio.tagline || ""} placeholder="Island massage & natural beauty" /></div>
            <div><label style={label}>About</label><textarea style={{ ...field, minHeight: 80, resize: "vertical" }} name="bio" defaultValue={studio.bio || ""} /></div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              <div><label style={label}>WhatsApp</label><input style={field} name="whatsapp" defaultValue={studio.whatsapp || ""} placeholder="+248 …" /></div>
              <div><label style={label}>Address / area</label><input style={field} name="address" defaultValue={studio.address || ""} /></div>
            </div>
            <div><Button size="sm">Save changes</Button></div>
          </form>
        </div>

        {/* services */}
        <div style={card}>
          <h2 style={h2}>Services &amp; prices</h2>
          <div style={{ display: "grid", gap: 8, marginBottom: 16 }}>
            {svc.length === 0 && <p style={{ fontSize: "var(--text-sm)", color: "var(--cocoa-40)" }}>No services yet.</p>}
            {svc.map((s) => (
              <div key={s.id} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, padding: "10px 0", borderBottom: "1px solid var(--line)" }}>
                <div><b style={{ fontSize: "var(--text-sm)" }}>{s.name}</b> <span style={{ color: "var(--cocoa-60)", fontSize: "var(--text-xs)" }}>· {s.duration_min} min</span></div>
                <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                  <span style={{ fontFamily: "var(--font-display)", color: "var(--clay)" }}>€{s.price_eur}</span>
                  <form action={deleteService.bind(null, studio.id, s.id)}><button title="Remove" style={{ background: "none", border: "none", color: "var(--cocoa-40)", cursor: "pointer", fontSize: 18, lineHeight: 1 }}>×</button></form>
                </div>
              </div>
            ))}
          </div>
          <form action={addService.bind(null, studio.id)} style={{ display: "grid", gridTemplateColumns: "1fr 80px 80px auto", gap: 8, alignItems: "end" }}>
            <div><label style={label}>New service</label><input style={field} name="name" placeholder="Service name" /></div>
            <div><label style={label}>Min</label><input style={field} name="duration_min" defaultValue={60} inputMode="numeric" /></div>
            <div><label style={label}>€</label><input style={field} name="price_eur" defaultValue={0} inputMode="numeric" /></div>
            <Button size="sm">Add</Button>
          </form>
        </div>

        {/* loyalty card */}
        <div style={card}>
          <h2 style={h2}>Loyalty card</h2>
          <p style={{ fontSize: "var(--text-sm)", color: "var(--cocoa-60)", margin: "0 0 14px" }}>Reward clients who keep coming back — they collect a stamp each visit and complete the card for your reward.</p>
          <form action={saveLoyalty.bind(null, studio.id)} style={{ display: "grid", gap: 14 }}>
            <div style={{ display: "grid", gridTemplateColumns: "120px 1fr", gap: 12 }}>
              <div><label style={label}>Stamps</label><input style={field} name="stamps_required" defaultValue={loy?.stamps_required ?? 5} inputMode="numeric" /></div>
              <div><label style={label}>Reward</label><input style={field} name="reward" defaultValue={loy?.reward ?? ""} placeholder="Free haircut" /></div>
            </div>
            <label style={{ display: "flex", alignItems: "center", gap: 8, fontSize: "var(--text-sm)", color: "var(--cocoa-80)", cursor: "pointer" }}>
              <input type="checkbox" name="active" defaultChecked={!!loy?.active} /> Show this loyalty card on my page
            </label>
            <div><Button size="sm">Save loyalty card</Button></div>
          </form>
        </div>

        {/* loyalty rewards ready */}
        {loy?.active && (
          <div style={card}>
            <h2 style={h2}>Rewards to give <span style={{ color: "var(--cocoa-40)", fontWeight: 400 }}>· {rewardsReady.length}</span></h2>
            {rewardsReady.length === 0 ? <p style={{ fontSize: "var(--text-sm)", color: "var(--cocoa-40)" }}>No completed cards yet.</p> :
              <div style={{ display: "grid", gap: 2 }}>
                {rewardsReady.map((r) => (
                  <div key={r.email} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, padding: "10px 0", borderBottom: "1px solid var(--line)" }}>
                    <div><div style={{ fontSize: "var(--text-sm)", fontWeight: 600 }}>{r.name}</div><div style={{ fontSize: "var(--text-xs)", color: "var(--cocoa-60)" }}>{r.available} reward{r.available > 1 ? "s" : ""} ready · {loy.reward}</div></div>
                    <form action={redeemReward.bind(null, studio.id, r.email)}><button style={{ background: "var(--eucalyptus)", color: "#fff", border: "none", borderRadius: "var(--radius-pill)", padding: "7px 15px", fontSize: "var(--text-sm)", fontWeight: 600, cursor: "pointer", fontFamily: "var(--font-body)" }}>Mark given</button></form>
                  </div>
                ))}
              </div>}
          </div>
        )}

        {/* opening hours */}
        <div style={card}>
          <h2 style={h2}>Opening hours</h2>
          <p style={{ fontSize: "var(--text-sm)", color: "var(--cocoa-60)", margin: "0 0 14px" }}>Leave a day blank to mark it closed. These drive your bookable times.</p>
          <form action={saveHours.bind(null, studio.id)} style={{ display: "grid", gap: 8 }}>
            {DAYS.map(([d, name]) => (
              <div key={d} style={{ display: "grid", gridTemplateColumns: "60px 1fr 1fr", gap: 10, alignItems: "center" }}>
                <span style={{ fontSize: "var(--text-sm)", fontWeight: 600 }}>{name}</span>
                <input style={field} type="time" name={`d${d}_open`} defaultValue={minToHHMM(hoursMap[d]?.open)} />
                <input style={field} type="time" name={`d${d}_close`} defaultValue={minToHHMM(hoursMap[d]?.close)} />
              </div>
            ))}
            <div style={{ marginTop: 6 }}><Button size="sm">Save hours</Button></div>
          </form>
        </div>

        {/* google reviews import */}
        <div style={card}>
          <h2 style={h2}>Reviews from Google</h2>
          <p style={{ fontSize: "var(--text-sm)", color: "var(--cocoa-60)", margin: "0 0 14px" }}>No reviews here yet? Show your Google rating while book.sey.la reviews build up. Paste your Google Place ID to auto-pull (needs a Google API key), or enter the numbers by hand.</p>
          {studio.google_rating && <div style={{ fontSize: "var(--text-sm)", marginBottom: 12 }}>Currently showing: <b style={{ color: "var(--clay)" }}>★ {studio.google_rating}</b> ({studio.google_review_count || 0} on Google)</div>}
          <form action={saveGoogle.bind(null, studio.id)} style={{ display: "grid", gap: 12 }}>
            <div><label style={label}>Google Place ID (optional)</label><input style={field} name="google_place_id" defaultValue={studio.google_place_id || ""} placeholder="ChIJ..." /></div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              <div><label style={label}>Rating (manual)</label><input style={field} name="google_rating" defaultValue={studio.google_rating || ""} placeholder="4.8" inputMode="decimal" /></div>
              <div><label style={label}>Review count (manual)</label><input style={field} name="google_review_count" defaultValue={studio.google_review_count || ""} placeholder="212" inputMode="numeric" /></div>
            </div>
            <div><label style={label}>Google profile URL</label><input style={field} name="google_url" defaultValue={studio.google_url || ""} placeholder="https://maps.google.com/..." /></div>
            <div><Button size="sm">Save Google reviews</Button></div>
          </form>
        </div>

        {/* team + clients */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }} className="pnl-two">
          <div style={card}>
            <h2 style={h2}>Team</h2>
            {team.length === 0 ? <p style={{ fontSize: "var(--text-sm)", color: "var(--cocoa-40)" }}>No team yet.</p> :
              <div style={{ display: "grid", gap: 10 }}>
                {team.map((m) => (
                  <div key={m.id} style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <span style={{ width: 30, height: 30, borderRadius: "50%", background: m.color || "var(--clay)", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: 13 }}>{m.name.charAt(0).toUpperCase()}</span>
                    <span style={{ fontSize: "var(--text-sm)", fontWeight: 600 }}>{m.name}</span>
                  </div>
                ))}
              </div>}
          </div>
          <div style={card}>
            <h2 style={h2}>Clients <span style={{ color: "var(--cocoa-40)", fontWeight: 400 }}>· {cli.length}</span></h2>
            {cli.length === 0 ? <p style={{ fontSize: "var(--text-sm)", color: "var(--cocoa-40)" }}>No clients imported.</p> :
              <div style={{ display: "grid", gap: 6, maxHeight: 200, overflowY: "auto" }}>
                {cli.slice(0, 40).map((c, i) => (
                  <div key={i} style={{ fontSize: "var(--text-sm)", display: "flex", justifyContent: "space-between", gap: 10 }}>
                    <span>{c.name}</span><span style={{ color: "var(--cocoa-40)" }}>{c.phone}</span>
                  </div>
                ))}
              </div>}
          </div>
        </div>

        <p style={{ textAlign: "center", color: "var(--cocoa-40)", fontSize: "var(--text-sm)", marginTop: 24 }}>Calendar &amp; online bookings — coming in the next update.</p>
      </main>
      <style>{`@media (max-width:640px){ .pnl-two{grid-template-columns:1fr!important} }`}</style>
    </>
  );
}
