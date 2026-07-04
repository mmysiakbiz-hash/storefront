export function Stub({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <main style={{ minHeight: "70vh", display: "grid", placeItems: "center", padding: "0 var(--gutter)" }}>
      <div style={{ textAlign: "center", maxWidth: 520 }}>
        <div className="sey-eyebrow" style={{ color: "var(--eucalyptus)", fontSize: "var(--text-eyebrow)", letterSpacing: "var(--ls-eyebrow)", textTransform: "uppercase", fontWeight: 600, marginBottom: 14 }}>
          book.sey.la
        </div>
        <h1 style={{ fontFamily: "var(--font-display)", fontWeight: 400, fontSize: "var(--text-display-md)", letterSpacing: "var(--ls-display)", margin: "0 0 12px" }}>
          {title}
        </h1>
        {subtitle && <p style={{ fontSize: "var(--text-lead)", color: "var(--cocoa-60)" }}>{subtitle}</p>}
        <p style={{ marginTop: 28 }}>
          <a href="/" style={{ color: "var(--clay)", fontWeight: 600, textDecoration: "none" }}>← Back to book.sey.la</a>
        </p>
      </div>
    </main>
  );
}
