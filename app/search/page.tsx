import { Logo } from "@/ds/components/brand/Logo";
import { Icon } from "@/ds/components/brand/Icon";
import { Button } from "@/ds/components/core/Button";
import { createAdminClient } from "@/lib/supabase/admin";

export const dynamic = "force-dynamic";
export const metadata = { title: "Find a studio · sey.la | book" };

const CATEGORIES = ["Hair", "Barber", "Nails", "Beauty", "Massage", "Spa & Wellness", "Brows & Lashes", "Makeup", "Fitness", "Auto"];
const ISLANDS = ["Mahé", "Praslin", "La Digue"];

type Row = { slug: string; name: string; tagline: string | null; category: string | null; island: string | null; photos: string[] | null };

export default async function SearchPage({ searchParams }: { searchParams: { cat?: string; island?: string; q?: string } }) {
  const { cat, island, q } = searchParams;
  let studios: Row[] = [];
  let priceBySlug: Record<string, number> = {};

  try {
    const supabase = createAdminClient();
    let query = supabase.from("studios").select("id, slug, name, tagline, category, island, photos").eq("status", "verified").order("created_at", { ascending: false }).limit(60);
    if (cat) query = query.eq("category", cat);
    if (island) query = query.eq("island", island);
    if (q) query = query.or(`name.ilike.%${q}%,tagline.ilike.%${q}%`);
    const { data } = await query;
    studios = (data as any) || [];
    const ids = (data as any || []).map((s: any) => s.id);
    if (ids.length) {
      const { data: svc } = await supabase.from("services").select("studio_id, price_eur").in("studio_id", ids).eq("active", true);
      const byId: Record<string, number> = {};
      for (const s of (svc as any) || []) {
        const cur = byId[s.studio_id];
        if (cur === undefined || s.price_eur < cur) byId[s.studio_id] = s.price_eur;
      }
      for (const s of studios as any) if (byId[s.id] !== undefined) priceBySlug[s.slug] = byId[s.id];
    }
  } catch { /* brak env → pusta lista */ }

  const mk = (patch: Record<string, string | undefined>) => {
    const merged: Record<string, string | undefined> = { cat, island, q, ...patch };
    const p = new URLSearchParams();
    for (const [k, v] of Object.entries(merged)) if (v) p.set(k, v);
    const s = p.toString();
    return "/search" + (s ? "?" + s : "");
  };

  const chip = (activeVal: string | undefined, val: string | null, labelTxt: string, key: "cat" | "island") => {
    const active = activeVal === val || (val === null && !activeVal);
    return (
      <a key={labelTxt} href={mk({ [key]: val ?? undefined })}
         style={{ padding: "8px 15px", borderRadius: "var(--radius-pill)", fontSize: "var(--text-sm)", fontWeight: 600, textDecoration: "none", whiteSpace: "nowrap",
                  background: active ? "var(--clay)" : "var(--surface)", color: active ? "#fff" : "var(--cocoa-80)", border: "1px solid " + (active ? "var(--clay)" : "var(--line)") }}>{labelTxt}</a>
    );
  };

  const maxw: React.CSSProperties = { maxWidth: "var(--maxw)", margin: "0 auto", padding: "0 var(--gutter)" };

  return (
    <>
      <nav style={{ position: "sticky", top: 0, zIndex: 60, background: "rgba(245,234,224,.9)", backdropFilter: "blur(10px)", borderBottom: "1px solid var(--line)" }}>
        <div style={{ ...maxw, display: "flex", alignItems: "center", height: 68 }}>
          <a href="/" style={{ textDecoration: "none" }}><Logo product="book" /></a>
          <div style={{ marginLeft: "auto" }}><Button as="a" href="/account" size="sm" variant="secondary">Log in</Button></div>
        </div>
      </nav>

      <header style={{ ...maxw, paddingTop: 40, paddingBottom: 8 }}>
        <h1 style={{ fontFamily: "var(--font-display)", fontWeight: 400, fontSize: "var(--text-display-md)", letterSpacing: "var(--ls-display)", margin: "0 0 20px" }}>
          Find your <em style={{ fontStyle: "italic", color: "var(--clay)" }}>studio</em>
        </h1>
        <form action="/search" method="get" style={{ display: "flex", gap: 8, maxWidth: 520, marginBottom: 20 }}>
          {cat && <input type="hidden" name="cat" value={cat} />}
          {island && <input type="hidden" name="island" value={island} />}
          <input name="q" defaultValue={q || ""} placeholder="Search a studio or treatment…" style={{ flex: 1, padding: "12px 16px", fontSize: "var(--text-body)", fontFamily: "var(--font-body)", border: "1px solid var(--line)", borderRadius: "var(--radius-md)", background: "var(--surface)", color: "var(--cocoa)", outline: "none" }} />
          <Button size="md">Search</Button>
        </form>
        <div style={{ display: "flex", gap: 8, overflowX: "auto", paddingBottom: 10 }}>
          {chip(cat, null, "All", "cat")}
          {CATEGORIES.map((c) => chip(cat, c, c, "cat"))}
        </div>
        <div style={{ display: "flex", gap: 8, overflowX: "auto", paddingBottom: 6 }}>
          {chip(island, null, "All islands", "island")}
          {ISLANDS.map((c) => chip(island, c, c, "island"))}
        </div>
      </header>

      <main style={{ ...maxw, padding: "24px var(--gutter) 80px" }}>
        {studios.length === 0 ? (
          <div style={{ textAlign: "center", padding: "60px 0", color: "var(--cocoa-60)" }}>
            <div style={{ fontSize: 38, marginBottom: 10 }}>🌴</div>
            <p style={{ fontSize: "var(--text-lead)", marginBottom: 6 }}>No studios here yet.</p>
            <p style={{ fontSize: "var(--text-sm)", marginBottom: 20 }}>{cat || island || q ? "Try removing a filter." : "Be the first studio on the island."}</p>
            <Button as="a" href="/studios/new">Add your studio</Button>
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(260px,1fr))", gap: 20 }}>
            {studios.map((s) => {
              const cover = s.photos && s.photos[0];
              const price = priceBySlug[s.slug];
              return (
                <a key={s.slug} href={`/studio/${s.slug}`} className="sc-card" style={{ textDecoration: "none", color: "inherit", background: "var(--surface)", border: "1px solid var(--line)", borderRadius: "var(--radius-lg)", overflow: "hidden", display: "block" }}>
                  <div style={{ aspectRatio: "4/3", position: "relative", background: cover ? undefined : "linear-gradient(150deg, var(--clay), #7a4636 60%, var(--cocoa))" }}>
                    {cover && <img src={cover} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />}
                    <span style={{ position: "absolute", top: 10, left: 10, background: "rgba(252,248,242,.92)", color: "var(--eucalyptus)", fontSize: 11, fontWeight: 700, padding: "4px 9px", borderRadius: "var(--radius-pill)" }}>New</span>
                  </div>
                  <div style={{ padding: "16px 18px 18px" }}>
                    <div style={{ fontFamily: "var(--font-display)", fontWeight: 500, fontSize: "var(--text-lead)", marginBottom: 2 }}>{s.name}</div>
                    <div style={{ fontSize: "var(--text-sm)", color: "var(--cocoa-60)", display: "flex", alignItems: "center", gap: 6 }}>
                      {s.category}{s.island ? <><span>·</span><span style={{ display: "inline-flex", alignItems: "center", gap: 3 }}><Icon name="pin" size={12} /> {s.island}</span></> : null}
                    </div>
                    {price !== undefined && <div style={{ marginTop: 10, fontSize: "var(--text-sm)", color: "var(--cocoa-80)" }}>from <b style={{ color: "var(--clay)" }}>€{price}</b></div>}
                  </div>
                </a>
              );
            })}
          </div>
        )}
      </main>

      <style>{`.sc-card{transition:transform .16s, box-shadow .16s} .sc-card:hover{transform:translateY(-3px);box-shadow:0 16px 36px rgba(59,42,37,.10)}`}</style>
    </>
  );
}
