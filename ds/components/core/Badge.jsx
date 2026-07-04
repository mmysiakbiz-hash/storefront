import React from "react";

/**
 * Badge — small status/label pill. Tones: neutral, brand, botanical, brass, confirmed.
 */
export function Badge({ children, tone = "neutral", iconLeft, style = {}, ...rest }) {
  const tones = {
    neutral: { bg: "rgba(59,42,37,0.06)", fg: "var(--cocoa-80)" },
    brand: { bg: "var(--blush)", fg: "var(--clay)" },
    botanical: { bg: "var(--confirmed-soft)", fg: "var(--eucalyptus)" },
    brass: { bg: "rgba(178,146,95,0.16)", fg: "#8a6f42" },
    confirmed: { bg: "var(--confirmed-soft)", fg: "var(--eucalyptus)" },
    dark: { bg: "rgba(245,234,224,0.14)", fg: "var(--cream)" },
  };
  const t = tones[tone] || tones.neutral;
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "5px",
        fontFamily: "var(--font-body)",
        fontSize: "var(--text-xs)",
        fontWeight: 600,
        letterSpacing: "0.01em",
        lineHeight: 1,
        padding: "5px 11px",
        borderRadius: "var(--radius-pill)",
        background: t.bg,
        color: t.fg,
        ...style,
      }}
      {...rest}
    >
      {iconLeft}
      {children}
    </span>
  );
}
