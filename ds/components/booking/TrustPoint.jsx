import React from "react";

/**
 * TrustPoint — a single reassurance point with a line icon and short copy.
 * Used in the 4-up trust row.
 */
export function TrustPoint({ icon, title, children, onDark = false, style = {}, ...rest }) {
  const ink = onDark ? "var(--cream)" : "var(--cocoa)";
  const muted = onDark ? "var(--cream-70)" : "var(--cocoa-60)";
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "12px", ...style }} {...rest}>
      <span
        style={{
          width: 46,
          height: 46,
          borderRadius: "14px",
          background: onDark ? "rgba(245,234,224,0.1)" : "var(--confirmed-soft)",
          display: "grid",
          placeItems: "center",
          color: onDark ? "var(--cream)" : "var(--eucalyptus)",
        }}
      >
        {icon}
      </span>
      <h3 style={{ margin: 0, color: ink, fontSize: "1.1rem", fontWeight: 600 }}>{title}</h3>
      <p style={{ margin: 0, color: muted, fontSize: "var(--text-sm)", lineHeight: "var(--lh-normal)" }}>
        {children}
      </p>
    </div>
  );
}
