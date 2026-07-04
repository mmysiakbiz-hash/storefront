"use client";

import { Logo } from "@/ds/components/brand/Logo";
import { FamilySwitcher } from "@/ds/components/brand/FamilySwitcher";
import { Icon } from "@/ds/components/brand/Icon";
import { ArchMirror } from "@/ds/components/brand/ArchMirror";
import { SearchBar } from "@/ds/components/booking/SearchBar";
import { CategoryTile } from "@/ds/components/booking/CategoryTile";
import { StepCard } from "@/ds/components/booking/StepCard";
import { TrustPoint } from "@/ds/components/booking/TrustPoint";
import { SectionHeader } from "@/ds/components/core/SectionHeader";
import { Button } from "@/ds/components/core/Button";

const maxw: React.CSSProperties = { maxWidth: "var(--maxw)", margin: "0 auto", padding: "0 var(--gutter)" };

const FAMILY_URL: Record<string, string> = {
  tour: "https://sey.la", book: "https://book.sey.la", bazar: "https://bazar.sey.la",
  moto: "https://moto.sey.la", villa: "https://villa.sey.la", lokal: "https://lokal.sey.la",
};

const CATS = [
  ["hair", "Hair", "Cuts, colour, styling"],
  ["nails", "Nails", "Mani, pedi, gel"],
  ["spa", "Spa & Massage", "Relax, deep tissue"],
  ["barber", "Barber", "Cuts, beard, shave"],
  ["brows", "Brows & Lashes", "Lift, tint, extensions"],
  ["makeup", "Makeup", "Bridal, party, lessons"],
  ["fitness", "Fitness & Yoga", "Training, classes"],
  ["auto", "Auto", "Mechanic, detailing"],
] as const;

export default function Landing() {
  return (
    <>
      {/* NAV */}
      <nav style={{ position: "sticky", top: 0, zIndex: 60, background: "rgba(245,234,224,.82)", backdropFilter: "blur(10px)", borderBottom: "1px solid var(--line)" }}>
        <div style={{ ...maxw, display: "flex", alignItems: "center", height: 72 }}>
          <FamilySwitcher active="book" onSelect={(p: string) => { window.location.href = FAMILY_URL[p] || "/"; }} />
          <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 8 }}>
            <a href="/studios" style={{ fontSize: "var(--text-sm)", fontWeight: 500, color: "var(--cocoa-80)", textDecoration: "none", padding: "9px 14px", borderRadius: 10 }}>For studios</a>
            <Button as="a" href="/account" size="sm">Log in</Button>
          </div>
        </div>
      </nav>

      {/* HERO */}
      <section style={{ padding: "clamp(3rem,7vw,5.5rem) 0" }}>
        <div style={{ ...maxw, display: "grid", gridTemplateColumns: "1.05fr .95fr", gap: 56, alignItems: "center" }} className="lp-hero-grid">
          <div>
            <div className="sey-eyebrow" style={{ display: "inline-flex", alignItems: "center", gap: 9, color: "var(--eucalyptus)", fontSize: "var(--text-eyebrow)", letterSpacing: "var(--ls-eyebrow)", textTransform: "uppercase", fontWeight: 600, marginBottom: 22 }}>
              Mahé · Praslin · La Digue
            </div>
            <h1 style={{ fontFamily: "var(--font-display)", fontWeight: 400, fontSize: "var(--text-display-lg)", lineHeight: "var(--lh-tight)", letterSpacing: "var(--ls-display)", margin: "0 0 20px" }}>
              Book your island{" "}
              <em style={{ fontStyle: "italic", color: "var(--clay)" }}>ritual.</em>
            </h1>
            <p style={{ fontSize: "var(--text-lead)", color: "var(--cocoa-80)", lineHeight: "var(--lh-relaxed)", maxWidth: 480, margin: "0 0 28px" }}>
              Hair, nails, massage, spa, barber and brows — with the best local studios across the Seychelles. Real-time slots, instant confirmation, and it’s free for you.
            </p>
            <div style={{ maxWidth: 560 }}>
              <SearchBar withDate cta="Search" onSubmit={() => { window.location.href = "/search"; }} />
            </div>
            <p style={{ fontSize: "var(--text-sm)", color: "var(--cocoa-60)", marginTop: 18 }}>
              Or <a href="/account" style={{ color: "var(--clay)", fontWeight: 600, textDecoration: "none" }}>create a free account</a> to track every visit.
            </p>
          </div>
          <div style={{ display: "flex", justifyContent: "center" }}>
            <ArchMirror
              service="Coconut & Frangipani Massage"
              studio="Kreol Spa · Beau Vallon"
              when="Tomorrow · 14:30 · 60 min"
              price="€55"
              status="Confirmed"
            />
          </div>
        </div>
      </section>

      {/* CATEGORIES */}
      <section style={{ padding: "var(--section-y) 0" }}>
        <div style={maxw}>
          <SectionHeader align="center" eyebrow="What you can book" title="Every kind of" accent="care" intro="Real local studios — each one checked in person. No aggregators, no resellers." />
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 16, maxWidth: 960, margin: "48px auto 0" }} className="lp-cat-grid">
            {CATS.map(([icon, label]) => (
              <CategoryTile key={icon} as="a" href={`/search?cat=${icon}`} icon={icon} label={label} />
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS — dark cocoa band */}
      <section style={{ background: "var(--cocoa)", padding: "var(--section-y) 0" }}>
        <div style={maxw}>
          <SectionHeader align="center" onDark title="Booked in three calm" accent="steps" intro="No phone tag, no “we’ll get back to you.”" />
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 44, maxWidth: 940, margin: "48px auto 0" }} className="lp-steps">
            <StepCard step="i" title="Find a studio" icon={<Icon name="search" color="var(--brass)" />}>
              Search by service, area or name. Browse photos, prices and real reviews — then pick the one that feels right.
            </StepCard>
            <StepCard step="ii" title="Pick a slot" icon={<Icon name="calendar" color="var(--brass)" />}>
              See live availability for the next 60 days. Choose any open slot and book it in under a minute.
            </StepCard>
            <StepCard step="iii" title="Show up" icon={<Icon name="check" color="var(--brass)" />}>
              You both get a confirmation. Pay the studio directly when you arrive — book takes nothing from you.
            </StepCard>
          </div>
        </div>
      </section>

      {/* TRUST */}
      <section style={{ padding: "var(--section-y) 0" }}>
        <div style={maxw}>
          <SectionHeader align="center" eyebrow="Why the islands trust us" title="Care you can" accent="count on" />
          <div style={{ display: "grid", gridTemplateColumns: "repeat(2,1fr)", gap: "8px 44px", maxWidth: 860, margin: "48px auto 0" }} className="lp-trust">
            <TrustPoint icon={<Icon name="check" color="var(--eucalyptus)" />} title="Real local studios only">Every salon and spa is verified in person. No tour resellers, no foreign aggregators.</TrustPoint>
            <TrustPoint icon={<Icon name="heart" color="var(--eucalyptus)" />} title="Always free for clients">You never pay book a cent. Pay the studio directly — same price as walking in.</TrustPoint>
            <TrustPoint icon={<Icon name="clock" color="var(--eucalyptus)" />} title="Real-time calendars">The slots you see are slots you can take. Confirmation in seconds, not tomorrow.</TrustPoint>
            <TrustPoint icon={<Icon name="shield" color="var(--eucalyptus)" />} title="Cancel up to 12h before">Island plans change. Reschedule or cancel from your dashboard, no questions asked.</TrustPoint>
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section style={{ textAlign: "center", padding: "var(--section-y) 0", background: "linear-gradient(180deg, var(--shell), var(--blush))" }}>
        <div style={maxw}>
          <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 400, fontSize: "var(--text-display-md)", letterSpacing: "var(--ls-display)", margin: "0 0 14px" }}>
            Your island is <em style={{ fontStyle: "italic", color: "var(--clay)" }}>waiting.</em>
          </h2>
          <p style={{ fontSize: "var(--text-lead)", color: "var(--cocoa-80)", margin: "0 0 30px" }}>Find a studio, pick a time, and let the islands take care of the rest.</p>
          <div style={{ display: "inline-flex", gap: 12, flexWrap: "wrap", justifyContent: "center" }}>
            <Button as="a" href="/search" size="lg">Browse studios</Button>
            <Button as="a" href="/account" variant="secondary" size="lg">Create free account</Button>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{ borderTop: "1px solid var(--line)", padding: "40px 0", background: "var(--shell)" }}>
        <div style={{ ...maxw, display: "flex", justifyContent: "space-between", alignItems: "center", gap: 16, flexWrap: "wrap" }}>
          <Logo product="book" />
          <span style={{ fontSize: "var(--text-xs)", color: "var(--cocoa-40)" }}>© 2026 Nexora Consulting LLC · Made for the Seychelles</span>
        </div>
      </footer>

      <style>{`
        @media (max-width: 920px){ .lp-hero-grid{grid-template-columns:1fr!important;gap:24px!important} .lp-cat-grid{grid-template-columns:repeat(3,1fr)!important} }
        @media (max-width: 720px){ .lp-cat-grid{grid-template-columns:repeat(2,1fr)!important} .lp-steps{grid-template-columns:1fr!important} .lp-trust{grid-template-columns:1fr!important} }
      `}</style>
    </>
  );
}
