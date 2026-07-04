import React from "react";

/**
 * Button — the clay CTA and its quieter siblings.
 * Variants: primary (clay), secondary (outline), ghost, dark (on cocoa).
 */
export function Button({
  children,
  variant = "primary",
  size = "md",
  as = "button",
  iconLeft,
  iconRight,
  full = false,
  style = {},
  ...rest
}) {
  const sizes = {
    sm: { padding: "8px 16px", fontSize: "var(--text-sm)", radius: "var(--radius-pill)" },
    md: { padding: "12px 22px", fontSize: "var(--text-body)", radius: "var(--radius-pill)" },
    lg: { padding: "16px 30px", fontSize: "1.125rem", radius: "var(--radius-pill)" },
  };
  const s = sizes[size] || sizes.md;

  const variants = {
    primary: { background: "var(--clay)", color: "var(--surface)", border: "1px solid transparent" },
    secondary: { background: "transparent", color: "var(--cocoa)", border: "1.5px solid var(--border-strong)" },
    ghost: { background: "transparent", color: "var(--cocoa)", border: "1px solid transparent" },
    dark: { background: "var(--surface)", color: "var(--cocoa)", border: "1px solid transparent" },
  };
  const v = variants[variant] || variants.primary;

  const Tag = as;
  return (
    <Tag
      className={`sey-btn sey-btn--${variant}`}
      style={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        gap: "0.55em",
        width: full ? "100%" : undefined,
        fontFamily: "var(--font-body)",
        fontWeight: 600,
        letterSpacing: "0.005em",
        lineHeight: 1,
        cursor: "pointer",
        textDecoration: "none",
        whiteSpace: "nowrap",
        padding: s.padding,
        fontSize: s.fontSize,
        borderRadius: s.radius,
        transition: "background var(--dur-fast) var(--ease-soft), transform var(--dur-fast) var(--ease-soft), box-shadow var(--dur-fast) var(--ease-soft), border-color var(--dur-fast) var(--ease-soft)",
        ...v,
        ...style,
      }}
      {...rest}
    >
      {iconLeft}
      {children}
      {iconRight}
      <style>{`
        .sey-btn { -webkit-tap-highlight-color: transparent; }
        .sey-btn--primary:hover { background: var(--clay-hover); }
        .sey-btn--primary:active { transform: translateY(1px); }
        .sey-btn--secondary:hover { border-color: var(--clay); color: var(--clay); }
        .sey-btn--secondary:active { transform: translateY(1px); }
        .sey-btn--ghost:hover { background: rgba(59,42,37,0.06); }
        .sey-btn--dark:hover { background: #fff; }
        .sey-btn--dark:active { transform: translateY(1px); }
      `}</style>
    </Tag>
  );
}
