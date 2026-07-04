import { Logo } from "@/ds/components/brand/Logo";

const maxw: React.CSSProperties = { maxWidth: 720, margin: "0 auto", padding: "0 var(--gutter)" };

export function Legal({ title, updated, children }: { title: string; updated?: string; children: React.ReactNode }) {
  return (
    <>
      <nav style={{ borderBottom: "1px solid var(--line)", background: "var(--shell)" }}>
        <div style={{ ...maxw, maxWidth: 1140, display: "flex", alignItems: "center", height: 66 }}>
          <a href="/" style={{ textDecoration: "none" }}><Logo product="book" /></a>
        </div>
      </nav>
      <main style={{ ...maxw, padding: "48px var(--gutter) 90px" }}>
        <h1 style={{ fontFamily: "var(--font-display)", fontWeight: 400, fontSize: "var(--text-display-md)", letterSpacing: "var(--ls-display)", margin: "0 0 8px" }}>{title}</h1>
        {updated && <p style={{ fontSize: "var(--text-sm)", color: "var(--cocoa-50)", margin: "0 0 28px" }}>Last updated {updated}</p>}
        <div style={{ fontSize: "var(--text-body)", lineHeight: "var(--lh-relaxed)", color: "var(--cocoa-80)" }}>{children}</div>
        <p style={{ marginTop: 40, fontSize: "var(--text-xs)", color: "var(--cocoa-40)" }}>Nexora Consulting LLC · Sharjah Media City, UAE · hello@sey.la</p>
      </main>
    </>
  );
}
export const H = ({ children }: { children: React.ReactNode }) => <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 500, fontSize: "var(--text-lead)", margin: "28px 0 10px", color: "var(--cocoa)" }}>{children}</h2>;
export const P = ({ children }: { children: React.ReactNode }) => <p style={{ margin: "0 0 12px" }}>{children}</p>;
