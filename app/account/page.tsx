import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { Logo } from "@/ds/components/brand/Logo";
import { Icon } from "@/ds/components/brand/Icon";
import LoginForm from "./LoginForm";
import ReferBusiness from "./ReferBusiness";
import ReviewForm from "./ReviewForm";
import VisitActions from "./VisitActions";
import { signOut } from "../panel/actions";

export const dynamic = "force-dynamic";
export const metadata = { title: "My account · sey.la | book" };

const maxw: React.CSSProperties = { maxWidth: 640, margin: "0 auto", padding: "0 var(--gutter)" };
const card: React.CSSProperties = { background: "var(--surface)", border: "1px solid var(--line)", borderRadius: "var(--radius-lg)", padding: 20, marginBottom: 16 };
const h2: React.CSSProperties = { fontFamily: "var(--font-display)", fontWeight: 500, fontSize: "var(--text-lead)", margin: "0 0 14px" };

const SOON: { icon: any; title: string; desc: string }[] = [
  { icon: "sparkle", title: "Gift cards", desc: "Send a treatment to someone you love — any studio, any amount." },
  { icon: "star", title: "Booksy-style platform club", desc: "Earn points across every studio on book.sey.la (separate from each salon\u2019s own stamp card)." },
  { icon: "heart", title: "Family & friends", desc: "Add a partner, child — even a pet — and book visits for them." },
];

export default async function AccountPage() {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) return <LoginForm />;

  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return <LoginForm />;
  const email = user.email!.toLowerCase();

  const admin = createAdminClient();
  const { data: bookings } = await admin
    .from("booking_times")
    .select("id, studio_id, staff_id, service_id, duration_min, starts_at, status, service_name, staff_name, staff_color, studio_name, studio_slug")
    .eq("guest_email", email).neq("status", "cancelled").order("starts_at", { ascending: false }).limit(50);
  const all = (bookings as any[]) || [];
  const now = Date.now();
  const upcoming = all.filter((b) => new Date(b.starts_at).getTime() >= now).reverse();
  const past = all.filter((b) => new Date(b.starts_at).getTime() < now);

  // Loyalty (salon stamp cards) — progress per studio from this client's visits
  const counts: Record<string, { count: number; name: string }> = {};
  for (const b of all) { if (!b.studio_id) continue; const c = counts[b.studio_id] || { count: 0, name: b.studio_name }; c.count++; counts[b.studio_id] = c; }
  const studioIds = Object.keys(counts);
  let loyalty: any[] = [];
  if (studioIds.length) {
    const { data: lp } = await admin.from("loyalty_programs").select("studio_id, stamps_required, reward, active").in("studio_id", studioIds).eq("active", true);
    loyalty = (lp as any[]) || [];
  }

  const { data: myReviews } = await admin.from("reviews").select("booking_id").eq("guest_email", email);
  const reviewedSet = new Set(((myReviews as any[]) || []).map((r) => r.booking_id));

  const Visit = ({ b }: { b: any }) => {
    const when = new Date(b.starts_at).toLocaleString("en-GB", { weekday: "short", day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" });
    return (
      <a href={`/studio/${b.studio_slug}`} style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 0", borderBottom: "1px solid var(--line)", textDecoration: "none", color: "inherit" }}>
        <span style={{ width: 9, height: 9, borderRadius: "50%", background: b.staff_color || "var(--clay)", flexShrink: 0 }} />
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: "var(--text-sm)", fontWeight: 600 }}>{b.service_name} · {b.studio_name}</div>
          <div style={{ fontSize: "var(--text-xs)", color: "var(--cocoa-60)" }}>{when}{b.staff_name ? ` · ${b.staff_name}` : ""}</div>
        </div>
      </a>
    );
  };

  return (
    <>
      <nav style={{ borderBottom: "1px solid var(--line)", background: "var(--shell)" }}>
        <div style={{ ...maxw, maxWidth: 760, display: "flex", alignItems: "center", height: 66 }}>
          <a href="/" style={{ textDecoration: "none" }}><Logo product="book" /></a>
          <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 12 }}>
            <span style={{ fontSize: "var(--text-sm)", color: "var(--cocoa-60)" }}>{email}</span>
            <form action={signOut}><button style={{ background: "none", border: "1px solid var(--line)", borderRadius: "var(--radius-pill)", padding: "7px 14px", fontSize: "var(--text-sm)", fontWeight: 600, color: "var(--cocoa-80)", cursor: "pointer", fontFamily: "var(--font-body)" }}>Sign out</button></form>
          </div>
        </div>
      </nav>

      <main style={{ ...maxw, padding: "34px var(--gutter) 80px" }}>
        <h1 style={{ fontFamily: "var(--font-display)", fontWeight: 400, fontSize: "var(--text-display-sm)", margin: "0 0 22px" }}>My visits</h1>

        <div style={card}>
          <h2 style={h2}>Upcoming</h2>
          {upcoming.length === 0 ? (
            <div style={{ fontSize: "var(--text-sm)", color: "var(--cocoa-50)" }}>No upcoming visits. <a href="/search" style={{ color: "var(--clay)", fontWeight: 600, textDecoration: "none" }}>Find a studio →</a></div>
          ) : upcoming.map((b) => {
            const when = new Date(b.starts_at).toLocaleString("en-GB", { weekday: "short", day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" });
            return (
              <div key={b.id} style={{ padding: "12px 0", borderBottom: "1px solid var(--line)" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <span style={{ width: 9, height: 9, borderRadius: "50%", background: b.staff_color || "var(--clay)", flexShrink: 0 }} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: "var(--text-sm)", fontWeight: 600 }}>{b.service_name} · <a href={`/studio/${b.studio_slug}`} style={{ color: "inherit", textDecoration: "none" }}>{b.studio_name}</a></div>
                    <div style={{ fontSize: "var(--text-xs)", color: "var(--cocoa-60)" }}>{when}{b.staff_name ? ` · ${b.staff_name}` : ""}</div>
                  </div>
                </div>
                <div style={{ marginLeft: 21, marginTop: 8 }}>
                  <VisitActions bookingId={b.id} studioId={b.studio_id} staffId={b.staff_id} duration={b.duration_min || 60} />
                </div>
              </div>
            );
          })}
        </div>

        {past.length > 0 && (
          <div style={card}>
            <h2 style={h2}>Past</h2>
            {past.slice(0, 10).map((b) => {
              const when = new Date(b.starts_at).toLocaleString("en-GB", { weekday: "short", day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" });
              const reviewed = reviewedSet.has(b.id);
              return (
                <div key={b.id} style={{ padding: "12px 0", borderBottom: "1px solid var(--line)" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <span style={{ width: 9, height: 9, borderRadius: "50%", background: b.staff_color || "var(--clay)", flexShrink: 0 }} />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: "var(--text-sm)", fontWeight: 600 }}>{b.service_name} · <a href={`/studio/${b.studio_slug}`} style={{ color: "inherit", textDecoration: "none" }}>{b.studio_name}</a></div>
                      <div style={{ fontSize: "var(--text-xs)", color: "var(--cocoa-60)" }}>{when}{b.staff_name ? ` · ${b.staff_name}` : ""}</div>
                    </div>
                  </div>
                  <div style={{ marginLeft: 21, marginTop: 6 }}>
                    {reviewed ? <div style={{ fontSize: "var(--text-xs)", color: "var(--eucalyptus)", fontWeight: 600 }}>★ Reviewed</div> : <ReviewForm bookingId={b.id} />}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        <div style={{ marginBottom: 16 }}><ReferBusiness /></div>

        {loyalty.length > 0 && (
          <div style={card}>
            <h2 style={h2}>Your loyalty cards</h2>
            {loyalty.map((lp) => {
              const c = counts[lp.studio_id];
              const earned = Math.floor(c.count / lp.stamps_required);
              const rem = c.count % lp.stamps_required;
              const filled = earned > 0 && rem === 0 ? lp.stamps_required : rem;
              return (
                <div key={lp.studio_id} style={{ padding: "12px 0", borderBottom: "1px solid var(--line)" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: "var(--text-sm)", fontWeight: 600 }}>
                    <span>{c.name}</span><span style={{ color: "var(--clay)" }}>{filled}/{lp.stamps_required}</span>
                  </div>
                  <div style={{ fontSize: "var(--text-xs)", color: "var(--cocoa-60)", margin: "2px 0 8px" }}>{lp.reward}{earned > 0 ? ` · ${earned} reward${earned > 1 ? "s" : ""} earned` : ""}</div>
                  <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                    {Array.from({ length: lp.stamps_required }).map((_, i) => (
                      <span key={i} style={{ width: 18, height: 18, borderRadius: "50%", background: i < filled ? "var(--clay)" : "transparent", border: "1.5px " + (i < filled ? "solid var(--clay)" : "dashed var(--cocoa-40)") }} />
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {SOON.map((f) => (
          <div key={f.title} style={{ ...card, display: "flex", alignItems: "center", gap: 14, marginBottom: 12 }}>
            <span style={{ width: 40, height: 40, borderRadius: "50%", background: "var(--blush)", color: "var(--clay)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}><Icon name={f.icon} size={20} /></span>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 600, fontSize: "var(--text-sm)" }}>{f.title}</div>
              <div style={{ fontSize: "var(--text-xs)", color: "var(--cocoa-60)" }}>{f.desc}</div>
            </div>
            <span style={{ fontSize: 11, fontWeight: 700, color: "var(--brass)", background: "rgba(178,146,95,.15)", padding: "3px 10px", borderRadius: "var(--radius-pill)", flexShrink: 0 }}>Soon</span>
          </div>
        ))}
      </main>
    </>
  );
}
