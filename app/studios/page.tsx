import { Logo } from "@/ds/components/brand/Logo";
import { Icon } from "@/ds/components/brand/Icon";
import { Button } from "@/ds/components/core/Button";
import { SectionHeader } from "@/ds/components/core/SectionHeader";
import { StepCard } from "@/ds/components/booking/StepCard";
import { BookingCard } from "@/ds/components/booking/BookingCard";

export const metadata = {
  title: "Grow your studio · sey.la | book",
  description: "Get your own studio page on book.sey.la. Answer a few questions — we build the page for you. Free for 3 months.",
};

const maxw: React.CSSProperties = { maxWidth: "var(--maxw)", margin: "0 auto", padding: "0 var(--gutter)" };

const VALUES: [string, string, string][] = [
  ["sparkle", "Your own page — done for you", "You answer a few questions; we generate a polished page. Every studio looks great — no design, no effort."],
  ["heart", "Bring your regulars", "Add your existing client list in seconds. Your book, your customers — always private to you."],
  ["shield", "Free to start", "Three months free, no setup fee, no card up front. Your page goes live the moment you finish."],
  ["pin", "One link to share", "Get nazwa.book.sey.la — drop it in your Instagram bio or send it on WhatsApp. It’s your whole shopfront."],
];

export default function StudiosPage() {
  return (
    <>
      {/* NAV */}
      <nav style={{ position: "sticky", top: 0, zIndex: 60, background: "rgba(245,234,224,.82)", backdropFilter: "blur(10px)", borderBottom: "1px solid var(--line)" }}>
        <div style={{ ...maxw, display: "flex", alignItems: "center", height: 72 }}>
          <a href="/" style={{ textDecoration: "none" }}><Logo product="book" /></a>
          <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 8 }}>
            <a href="/" style={{ fontSize: "var(--text-sm)", fontWeight: 500, color: "var(--cocoa-80)", textDecoration: "none", padding: "9px 14px" }}>For clients</a>
            <Button as="a" href="/studios/new" size="sm">Add your studio</Button>
          </div>
        </div>
      </nav>

      {/* HERO */}
      <section style={{ padding: "clamp(3rem,7vw,5.5rem) 0" }}>
        <div style={{ ...maxw, display: "grid", gridTemplateColumns: "1.05fr .95fr", gap: 56, alignItems: "center" }} className="st-hero">
          <div>
            <div className="sey-eyebrow" style={{ color: "var(--eucalyptus)", fontSize: "var(--text-eyebrow)", letterSpacing: "var(--ls-eyebrow)", textTransform: "uppercase", fontWeight: 600, marginBottom: 22 }}>
              For Seychelles studios
            </div>
            <h1 style={{ fontFamily: "var(--font-display)", fontWeight: 400, fontSize: "var(--text-display-lg)", lineHeight: "var(--lh-tight)", letterSpacing: "var(--ls-display)", margin: "0 0 20px" }}>
              Your studio, beautifully online — <em style={{ fontStyle: "italic", color: "var(--clay)" }}>without lifting a finger.</em>
            </h1>
            <p style={{ fontSize: "var(--text-lead)", color: "var(--cocoa-80)", lineHeight: "var(--lh-relaxed)", maxWidth: 480, margin: "0 0 30px" }}>
              No website to build, no photos to arrange. Answer a few simple questions and we turn them into a polished page tourists can find and book — the same quality for every studio on the island.
            </p>
            <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
              <Button as="a" href="/studios/new" size="lg">Add your studio — free</Button>
              <Button as="a" href="/studio/kreol-spa" variant="secondary" size="lg">See an example</Button>
            </div>
            <p style={{ fontSize: "var(--text-sm)", color: "var(--cocoa-60)", marginTop: 18 }}>3 months free · no card needed · live in minutes</p>
          </div>
          <div style={{ display: "flex", justifyContent: "center" }}>
            <BookingCard />
          </div>
        </div>
      </section>

      {/* VALUES */}
      <section style={{ padding: "var(--section-y) 0" }}>
        <div style={maxw}>
          <SectionHeader align="center" eyebrow="Why studios join" title="Everything set up" accent="for you" />
          <div style={{ display: "grid", gridTemplateColumns: "repeat(2,1fr)", gap: 20, maxWidth: 900, margin: "48px auto 0" }} className="st-values">
            {VALUES.map(([icon, title, body]) => (
              <div key={title} style={{ display: "flex", gap: 16, padding: 24, background: "var(--surface)", border: "1px solid var(--line)", borderRadius: "var(--radius-lg)" }}>
                <span style={{ flexShrink: 0, width: 44, height: 44, borderRadius: "50%", background: "var(--blush)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--clay)" }}><Icon name={icon as any} size={22} /></span>
                <div>
                  <div style={{ fontFamily: "var(--font-display)", fontWeight: 500, fontSize: "var(--text-lead)", marginBottom: 4 }}>{title}</div>
                  <div style={{ fontSize: "var(--text-sm)", color: "var(--cocoa-70)", lineHeight: "var(--lh-relaxed)" }}>{body}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* GO LIVE — dark band */}
      <section style={{ background: "var(--cocoa)", padding: "var(--section-y) 0" }}>
        <div style={maxw}>
          <SectionHeader align="center" onDark title="Live in three" accent="answers" intro="No tech, no design. If you can fill in a form, you can be online today." />
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 44, maxWidth: 940, margin: "48px auto 0" }} className="st-steps">
            <StepCard step="i" title="Answer a few questions" icon={<Icon name="sparkle" color="var(--brass)" />}>
              Your services, prices, a few photos, and your client list — typed in or pasted straight from Excel.
            </StepCard>
            <StepCard step="ii" title="We build your page" icon={<Icon name="heart" color="var(--brass)" />}>
              Instantly. Your answers become a beautiful, consistent studio page — no waiting, no designer.
            </StepCard>
            <StepCard step="iii" title="Share your link" icon={<Icon name="arrowRight" color="var(--brass)" />}>
              Get nazwa.book.sey.la and start sending it to clients. Online bookings switch on soon after.
            </StepCard>
          </div>
        </div>
      </section>

      {/* PRICING */}
      <section style={{ padding: "var(--section-y) 0" }}>
        <div style={{ ...maxw, maxWidth: 620, textAlign: "center" }}>
          <SectionHeader align="center" eyebrow="Simple pricing" title="Free to start," accent="fair after" />
          <div style={{ marginTop: 40, background: "var(--surface)", border: "1px solid var(--line)", borderRadius: "var(--radius-xl)", padding: "40px 32px" }}>
            <div style={{ fontFamily: "var(--font-display)", fontSize: "var(--text-display-md)", color: "var(--cocoa)" }}>
              3 months free
            </div>
            <div style={{ color: "var(--cocoa-60)", margin: "6px 0 26px" }}>then <b style={{ color: "var(--cocoa)" }}>€25 per team member / month</b></div>
            <div style={{ display: "grid", gap: 12, textAlign: "left", maxWidth: 380, margin: "0 auto" }}>
              {[
                "Your own page + shareable link",
                "Your client list, kept private",
                "Real-time calendar (rolling out)",
                "Just €25 per team member each month — scales only as your team grows",
                "20% on the first booking from a brand-new client we bring you — never on the regulars you imported",
              ].map((t) => (
                <div key={t} style={{ display: "flex", gap: 10, alignItems: "flex-start", fontSize: "var(--text-sm)", color: "var(--cocoa-80)" }}>
                  <span style={{ color: "var(--eucalyptus)", flexShrink: 0, marginTop: 2 }}><Icon name="check" size={18} /></span>{t}
                </div>
              ))}
            </div>
            <div style={{ marginTop: 30 }}><Button as="a" href="/studios/new" size="lg" full>Add your studio</Button></div>
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
        @media (max-width: 920px){ .st-hero{grid-template-columns:1fr!important;gap:28px!important} .st-values{grid-template-columns:1fr!important} .st-steps{grid-template-columns:1fr!important} }
      `}</style>
    </>
  );
}
