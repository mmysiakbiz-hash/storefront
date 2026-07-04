import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { isPlatformAdmin } from "@/lib/admin";
import { Stub } from "../_stub";
import { Logo } from "@/ds/components/brand/Logo";
import { setStudioStatus } from "./actions";

export const dynamic = "force-dynamic";

const card: React.CSSProperties = { background: "var(--surface)", border: "1px solid var(--line)", borderRadius: "var(--radius-lg)", padding: 20 };
const maxw: React.CSSProperties = { maxWidth: 960, margin: "0 auto", padding: "0 var(--gutter)" };

export default async function AdminPage() {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) return <Stub title="Admin" subtitle="Connect the app to its database to manage the platform." />;

  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/account?next=/admin");
  const ok = await isPlatformAdmin(user.id, user.email);
  if (!ok) return <Stub title="Not authorized" subtitle="This area is for platform admins only." />;

  const admin = createAdminClient();
  const [{ data: studios }, { data: staffRows }, { count: bookingCount }] = await Promise.all([
    admin.from("studios").select("id, name, slug, category, island, status, created_at, owner_email").order("created_at", { ascending: false }),
    admin.from("staff").select("studio_id").eq("active", true),
    admin.from("bookings").select("id", { count: "exact", head: true }),
  ]);
  const list = (studios as any[]) || [];
  const staffCount: Record<string, number> = {};
  for (const s of (staffRows as any[]) || []) staffCount[s.studio_id] = (staffCount[s.studio_id] || 0) + 1;

  const verified = list.filter((s) => s.status === "verified");
  const pending = list.filter((s) => s.status === "pending");
  const potentialMrr = verified.reduce((sum, s) => sum + Math.max(1, staffCount[s.id] || 1) * 25, 0);

  const Stat = ({ n, l }: { n: React.ReactNode; l: string }) => (
    <div style={card}><div style={{ fontFamily: "var(--font-display)", fontSize: 30, color: "var(--cocoa)" }}>{n}</div><div style={{ fontSize: "var(--text-sm)", color: "var(--cocoa-60)" }}>{l}</div></div>
  );

  return (
    <>
      <nav style={{ borderBottom: "1px solid var(--line)", background: "var(--shell)" }}>
        <div style={{ ...maxw, display: "flex", alignItems: "center", height: 66 }}>
          <a href="/" style={{ textDecoration: "none" }}><Logo product="book" /></a>
          <span style={{ marginLeft: 12, fontSize: "var(--text-sm)", fontWeight: 700, color: "var(--clay)" }}>· admin</span>
          <span style={{ marginLeft: "auto", fontSize: "var(--text-sm)", color: "var(--cocoa-60)" }}>{user.email}</span>
        </div>
      </nav>

      <main style={{ ...maxw, padding: "36px var(--gutter) 80px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 14, marginBottom: 28 }} className="adm-stats">
          <Stat n={list.length} l="Studios" />
          <Stat n={pending.length} l="Pending review" />
          <Stat n={bookingCount ?? 0} l="Bookings" />
          <Stat n={`€${potentialMrr}`} l="Potential MRR" />
        </div>

        <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 500, fontSize: "var(--text-lead)", margin: "0 0 14px" }}>Studios</h2>
        <div style={{ ...card, padding: 0, overflow: "hidden" }}>
          {list.length === 0 && <p style={{ padding: 20, color: "var(--cocoa-40)", fontSize: "var(--text-sm)" }}>No studios yet.</p>}
          {list.map((s) => (
            <div key={s.id} style={{ display: "flex", alignItems: "center", gap: 14, padding: "14px 18px", borderBottom: "1px solid var(--line)", flexWrap: "wrap" }}>
              <div style={{ flex: 1, minWidth: 180 }}>
                <a href={`/studio/${s.slug}`} style={{ fontWeight: 600, color: "var(--cocoa)", textDecoration: "none" }}>{s.name}</a>
                <div style={{ fontSize: "var(--text-xs)", color: "var(--cocoa-60)" }}>{s.category} · {s.island} · {staffCount[s.id] || 0} team · {s.owner_email || "—"}</div>
              </div>
              <span style={{ fontSize: 11, fontWeight: 700, padding: "3px 10px", borderRadius: "var(--radius-pill)",
                background: s.status === "verified" ? "rgba(111,130,101,.16)" : s.status === "pending" ? "rgba(178,146,95,.18)" : "rgba(168,80,63,.14)",
                color: s.status === "verified" ? "var(--eucalyptus)" : s.status === "pending" ? "var(--brass)" : "var(--clay)" }}>{s.status}</span>
              <div style={{ display: "flex", gap: 8 }}>
                {s.status !== "verified" && <form action={setStudioStatus.bind(null, s.id, "verified")}><button style={btn("var(--eucalyptus)")}>Verify</button></form>}
                {s.status === "verified" && <form action={setStudioStatus.bind(null, s.id, "suspended")}><button style={btn("var(--clay)")}>Suspend</button></form>}
              </div>
            </div>
          ))}
        </div>
      </main>
      <style>{`@media (max-width:640px){ .adm-stats{grid-template-columns:1fr 1fr!important} }`}</style>
    </>
  );
}

function btn(color: string): React.CSSProperties {
  return { background: "transparent", border: "1px solid " + color, color, borderRadius: "var(--radius-pill)", padding: "6px 14px", fontSize: "var(--text-sm)", fontWeight: 600, cursor: "pointer", fontFamily: "var(--font-body)" };
}
