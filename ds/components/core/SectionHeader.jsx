import React from "react";

/**
 * SectionHeader — eyebrow + display title (with optional italic accent word) + intro.
 * Centered or left aligned. Inverts on dark cocoa sections.
 */
export function SectionHeader({
  eyebrow,
  title,
  accent,
  accentPosition = "end",
  intro,
  align = "left",
  onDark = false,
  size = "lg",
  style = {},
  ...rest
}) {
  const titleSize = size === "xl" ? "var(--text-display-lg)" : size === "md" ? "var(--text-display-md)" : "var(--text-h1)";
  const ink = onDark ? "var(--cream)" : "var(--cocoa)";
  const muted = onDark ? "var(--cream-70)" : "var(--text-muted)";
  const accentEl = accent ? (
    <em key="a" style={{ fontStyle: "italic", fontWeight: 400, color: "var(--clay)" }}>
      {accent}
    </em>
  ) : null;

  return (
    <header
      style={{
        textAlign: align,
        maxWidth: align === "center" ? "var(--maxw-narrow)" : undefined,
        marginInline: align === "center" ? "auto" : undefined,
        ...style,
      }}
      {...rest}
    >
      {eyebrow && (
        <div
          className="sey-eyebrow"
          style={{
            color: muted,
            marginBottom: "16px",
            display: "flex",
            gap: "10px",
            alignItems: "center",
            justifyContent: align === "center" ? "center" : "flex-start",
          }}
        >
          {eyebrow}
        </div>
      )}
      {title && (
        <h2
          style={{
            fontSize: titleSize,
            lineHeight: "var(--lh-tight)",
            letterSpacing: "var(--ls-display)",
            color: ink,
            margin: 0,
          }}
        >
          {accentPosition === "start" && accentEl}
          {accentPosition === "start" ? " " : ""}
          {title}
          {accentPosition === "end" ? " " : ""}
          {accentPosition === "end" && accentEl}
        </h2>
      )}
      {intro && (
        <p
          style={{
            fontSize: "var(--text-lead)",
            color: muted,
            marginTop: "18px",
            marginBottom: 0,
            maxWidth: "56ch",
            marginInline: align === "center" ? "auto" : undefined,
            lineHeight: "var(--lh-normal)",
          }}
        >
          {intro}
        </p>
      )}
    </header>
  );
}
