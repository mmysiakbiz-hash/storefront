import "./venue.css";
import { Stub } from "../../_stub";
import { createAdminClient } from "@/lib/supabase/admin";
import { Icon } from "@/ds/components/brand/Icon";
import { Button } from "@/ds/components/core/Button";
import BookingWidget from "./BookingWidget";

export const dynamic = "force-dynamic";

type Studio = {
  name: string; tagline: string | null; bio: string | null; island: string | null;
  address: string | null; whatsapp: string | null; category: string | null;
  photos: string[] | null; status: string;
  google_rating: number | null; google_review_count: number | null; google_url: string | null; google_reviews: any;
};
type Service = { id: string; name: string; duration_min: number; price_eur: number };
type Staff = { id: string; name: string; color: string | null };

export async function generateMetadata({ params }: { params: { slug: string } }) {
  return { title: `${params.slug} · sey.la | book`, robots: { index: false } };
}

export default async function StudioPage({ params }: { params: { slug: string } }) {
  const { slug } = params;
  let studio: Studio | null = null;
  let services: Service[] = [];
  let staff: Staff[] = [];
  let loyalty: { stamps_required: number; reward: string } | null = null;
  let reviews: { guest_name: string | null; rating: number; text: string | null }[] = [];

  try {
    const supabase = createAdminClient();
    const { data } = await supabase
      .from("studios")
      .select("name, tagline, bio, island, address, whatsapp, category, photos, status, id, google_rating, google_review_count, google_url, google_reviews")
      .eq("slug", slug)
      .maybeSingle();
    if (data) {
      studio = data as any;
      const { data: svc } = await supabase.from("services").select("id, name, duration_min, price_eur").eq("studio_id", (data as any).id).eq("active", true).order("sort");
      services = (svc as any) || [];
      const { data: stf } = await supabase.from("staff").select("id, name, color").eq("studio_id", (data as any).id).eq("active", true);
      staff = (stf as any) || [];
      const { data: loy } = await supabase.from("loyalty_programs").select("stamps_required, reward, active").eq("studio_id", (data as any).id).eq("active", true).maybeSingle();
      loyalty = loy ? { stamps_required: (loy as any).stamps_required, reward: (loy as any).reward } : null;
      const { data: rv } = await supabase.from("reviews").select("guest_name, rating, text").eq("studio_id", (data as any).id).order("created_at", { ascending: false }).limit(8);
      reviews = (rv as any) || [];
    }
  } catch { /* baza nieskonfigurowana → placeholder */ }

  if (!studio) return <Stub title="Studio coming soon" subtitle={`"${slug}" isn't live yet on book.sey.la.`} />;

  const studioId = (studio as any).id as string;
  const bookable = services.length > 0 && staff.length > 0;
  const revCount = reviews.length;
  const avg = revCount ? Math.round((reviews.reduce((a, r) => a + r.rating, 0) / revCount) * 10) / 10 : 0;
  const gReviews: any[] = Array.isArray(studio.google_reviews) ? studio.google_reviews : [];
  const photos = studio.photos || [];
  const cover = photos[0] || null;
  const gallery = photos.slice(1);
  const wa = studio.whatsapp ? `https://wa.me/${studio.whatsapp.replace(/[^0-9]/g, "")}` : null;
  const bookHref = bookable ? "#book" : (wa || "#visit");
  const words = studio.name.trim().split(" ");
  const last = words.length > 1 ? words.pop() : null;
  const head = words.join(" ");

  return (
    <>
      {/* TOPBAR */}
      <header className="vn-topbar">
        <div className="sey-container vn-topbar-inner">
          <a className="vn-brand" href="#top">
            <span className="vn-brand-mark">{head || studio.name}</span>
            {last && <span className="vn-brand-word">{last}</span>}
          </a>
          <nav className="vn-nav" aria-label="Sections">
            {services.length > 0 && <a href="#services">Services</a>}
            {staff.length > 0 && <a href="#team">Team</a>}
            {gallery.length > 0 && <a href="#gallery">Gallery</a>}
            <a href="#visit">Visit</a>
          </nav>
          <div className="vn-topbar-cta">
            {studio.address && <span className="vn-call"><Icon name="pin" size={16} color="var(--clay)" /> {studio.island || studio.address}</span>}
            <Button size="sm" as="a" href={bookHref}>Book now</Button>
          </div>
        </div>
      </header>

      {/* HERO */}
      <section className="vn-hero" id="top">
        <div className="vn-hero-media" aria-hidden="true">
          {cover
            ? <img src={cover} alt="" />
            : <div style={{ position: "absolute", inset: 0, background: "linear-gradient(150deg, var(--clay) 0%, #7a4636 55%, var(--cocoa) 100%)" }} />}
          <div className="vn-hero-scrim" />
        </div>
        <div className="sey-container vn-hero-inner">
          <div className="vn-hero-eyebrow">{studio.category}{studio.island ? ` · ${studio.island}` : ""}</div>
          <h1 className="vn-hero-title">{head} {last && <em className="sey-accent-italic">{last}</em>}</h1>
          {studio.tagline && <p className="vn-hero-lead">{studio.tagline}</p>}
          <div className="vn-hero-meta">
            {avg > 0 && <span className="vn-meta-pill"><Icon name="star" size={15} color="var(--brass)" /> <b>{avg}</b> · {revCount} review{revCount > 1 ? "s" : ""}</span>}
            {studio.google_rating ? <span className="vn-meta-pill"><Icon name="star" size={15} color="var(--brass)" /> <b>{studio.google_rating}</b> on Google{studio.google_review_count ? ` · ${studio.google_review_count}` : ""}</span> : null}
            <span className="vn-meta-pill"><Icon name="heart" size={14} color="var(--clay)" /> Free to book</span>
            {avg === 0 && !studio.google_rating && <span className="vn-meta-pill vn-open"><span className="vn-dot" /> New on book.sey.la</span>}
          </div>
          <div className="vn-hero-actions">
            <Button size="lg" as="a" href={bookHref}>{wa ? "Book on WhatsApp" : "Book a treatment"}</Button>
            <Button size="lg" variant="secondary" as="a" href="#visit">Find us</Button>
          </div>
        </div>
      </section>

      {/* SERVICES */}
      {services.length > 0 && (
        <section className="vn-section" id="services">
          <div className="sey-container">
            <div className="vn-sec-head"><div><div className="sey-eyebrow vn-eyebrow">The menu</div><h2 className="vn-sec-title">Services &amp; <em className="sey-accent-italic">prices</em></h2></div></div>
            <ul className="vn-menu">
              {services.map((s, i) => (
                <li key={i} className="vn-srv">
                  <div>
                    <div className="vn-srv-top"><b>{s.name}</b></div>
                    <span className="vn-srv-dur"><Icon name="clock" size={13} /> {s.duration_min} min</span>
                  </div>
                  <div className="vn-srv-end">
                    <span className="vn-srv-price">€{s.price_eur}</span>
                    <Button size="sm" as="a" href={bookHref}>Book</Button>
                  </div>
                </li>
              ))}
            </ul>
            {loyalty && (
              <div style={{ marginTop: 26, background: "var(--blush)", border: "1px solid var(--line)", borderRadius: "var(--radius-lg)", padding: "18px 20px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
                  <Icon name="sparkle" size={18} color="var(--clay)" />
                  <span style={{ fontWeight: 600, fontSize: "var(--text-sm)" }}>Loyalty card · {loyalty.reward}</span>
                </div>
                <div style={{ display: "flex", gap: 7, flexWrap: "wrap", marginBottom: 8 }}>
                  {Array.from({ length: loyalty.stamps_required }).map((_, i) => (
                    <span key={i} style={{ width: 22, height: 22, borderRadius: "50%", border: "1.5px dashed var(--clay)", opacity: .6 }} />
                  ))}
                </div>
                <div style={{ fontSize: "var(--text-xs)", color: "var(--cocoa-60)" }}>Collect {loyalty.stamps_required} stamps — one per visit — and it's yours. Sign in when you book to track your stamps.</div>
              </div>
            )}
            <div id="book" style={{ marginTop: 30, paddingTop: 26, borderTop: "1px solid var(--line)" }}>
              <h3 style={{ fontFamily: "var(--font-display)", fontWeight: 500, fontSize: "var(--text-lead)", margin: "0 0 18px" }}>Book online</h3>
              <BookingWidget studioId={studioId} studioName={studio.name} services={services} staff={staff} />
            </div>
          </div>
        </section>
      )}

      {/* SHOWCASE: about + team + gallery */}
      {(studio.bio || staff.length > 0 || gallery.length > 0) && (
        <section className="vn-section vn-alt">
          <div className="sey-container">
            {studio.bio && (
              <div style={{ maxWidth: "60ch" }}>
                <div className="sey-eyebrow vn-eyebrow">About</div>
                <p style={{ fontSize: "var(--text-lead)", color: "var(--cocoa-80)", lineHeight: "var(--lh-relaxed)" }}>{studio.bio}</p>
              </div>
            )}

            {staff.length > 0 && (
              <div id="team" style={{ marginTop: studio.bio ? 48 : 0 }}>
                <h2 className="vn-sec-title">Our <em className="sey-accent-italic">team</em></h2>
                <div className="vn-team">
                  {staff.map((m, i) => (
                    <figure className="vn-member" key={i}>
                      <div style={{ width: 64, height: 64, borderRadius: "50%", background: m.color || "var(--clay)", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "var(--font-display)", fontSize: 26, marginBottom: 12 }}>{m.name.trim().charAt(0).toUpperCase()}</div>
                      <span className="vn-member-name">{m.name}</span>
                      <span className="vn-member-role">{studio.category}</span>
                    </figure>
                  ))}
                </div>
              </div>
            )}

            {gallery.length > 0 && (
              <div id="gallery" style={{ marginTop: 48 }}>
                <h2 className="vn-sec-title">The <em className="sey-accent-italic">space</em></h2>
                <div className="vn-gallery">
                  {gallery.map((p, i) => (
                    <figure className={`vn-gcell vn-gcell--${i}`} key={i}><img src={p} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} /></figure>
                  ))}
                </div>
              </div>
            )}
          </div>
        </section>
      )}

      {(reviews.length > 0 || gReviews.length > 0) && (
        <section className="vn-section vn-alt" id="reviews">
          <div className="sey-container">
            <h2 className="vn-sec-title">What guests <em className="sey-accent-italic">say</em></h2>
            <div style={{ display: "grid", gap: 16, marginTop: 24, maxWidth: 720 }}>
              {reviews.map((r, i) => (
                <div key={i} style={{ paddingBottom: 16, borderBottom: "1px solid var(--line)" }}>
                  <div style={{ letterSpacing: 2 }}><span style={{ color: "var(--brass)" }}>{"\u2605".repeat(r.rating)}</span><span style={{ color: "rgba(59,42,37,.2)" }}>{"\u2605".repeat(5 - r.rating)}</span></div>
                  {r.text && <p style={{ margin: "6px 0 4px", color: "var(--cocoa-80)" }}>{r.text}</p>}
                  <div style={{ fontSize: "var(--text-xs)", color: "var(--cocoa-60)" }}>{r.guest_name || "Guest"}</div>
                </div>
              ))}
              {gReviews.length > 0 && (
                <>
                  <div style={{ fontSize: "var(--text-xs)", color: "var(--cocoa-60)", marginTop: 6 }}>From Google</div>
                  {gReviews.map((r, i) => (
                    <div key={"g" + i} style={{ paddingBottom: 16, borderBottom: "1px solid var(--line)" }}>
                      <div style={{ color: "var(--brass)", letterSpacing: 2 }}>{"\u2605".repeat(r.rating || 0)}</div>
                      {r.text && <p style={{ margin: "6px 0 4px", color: "var(--cocoa-80)" }}>{r.text}</p>}
                      <div style={{ fontSize: "var(--text-xs)", color: "var(--cocoa-60)" }}>{r.author} · Google</div>
                    </div>
                  ))}
                  {studio.google_url && <a href={studio.google_url} style={{ fontSize: "var(--text-xs)", color: "var(--clay)", fontWeight: 600, textDecoration: "none" }}>See all on Google →</a>}
                </>
              )}
            </div>
          </div>
        </section>
      )}

      {/* VISIT */}
      <section className="vn-section" id="visit">
        <div className="sey-container vn-visit">
          <div className="vn-visit-info">
            <div className="sey-eyebrow vn-eyebrow">Visit</div>
            <h2 className="vn-sec-title">Come <em className="sey-accent-italic">say hi</em></h2>
            {studio.address && <p className="vn-address" style={{ fontSize: "var(--text-lead)", color: "var(--cocoa-80)", margin: "8px 0 24px" }}>{studio.address}</p>}
            {wa && <Button size="lg" as="a" href={wa}>Book on WhatsApp</Button>}
          </div>
          <div className="vn-map">
            <div className="vn-map-pin"><Icon name="pin" size={20} color="#fff" /></div>
            <span className="vn-map-label">{studio.island || "Seychelles"}</span>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="vn-footer">
        <div className="sey-container vn-footer-inner">
          <a className="vn-brand vn-brand--foot" href="#top"><span className="vn-brand-mark" style={{ color: "var(--cream)" }}>{head || studio.name}</span>{last && <span className="vn-brand-word">{last}</span>}</a>
          <span className="vn-powered">Powered by <b>sey.la&nbsp;|&nbsp;book</b></span>
        </div>
      </footer>
    </>
  );
}
