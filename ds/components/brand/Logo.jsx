import React from "react";

/**
 * Logo — the sey.la | book wordmark, set in type (no logo file provided).
 * Family products can swap the "book" suffix.
 */
export function Logo({ product = "book", size = "md", color, mono = false, style = {}, ...rest }) {
  const sizes = {
    sm: "1.05rem",
    md: "1.3rem",
    lg: "1.9rem",
  };
  const fs = sizes[size] || sizes.md;
  const base = color || "var(--cocoa)";
  return (
    <span
      style={{
        fontFamily: "var(--font-display)",
        fontSize: fs,
        fontWeight: 600,
        letterSpacing: "-0.01em",
        color: base,
        display: "inline-flex",
        alignItems: "baseline",
        gap: "0.4em",
        lineHeight: 1,
        ...style,
      }}
      {...rest}
    >
      <span>
        sey<span style={{ color: mono ? base : "var(--clay)" }}>.</span>la
      </span>
      <span
        aria-hidden="true"
        style={{
          fontFamily: "var(--font-body)",
          fontWeight: 400,
          fontSize: "0.62em",
          color: mono ? base : "var(--cocoa-40)",
          transform: "translateY(-0.05em)",
        }}
      >
        |
      </span>
      <span
        style={{
          fontStyle: "italic",
          fontWeight: 500,
          color: mono ? base : "var(--clay)",
        }}
      >
        {product}
      </span>
    </span>
  );
}
