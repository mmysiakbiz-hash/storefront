import React from "react";

/**
 * StepCard — a numbered step for "How it works". Designed for the dark cocoa band
 * (onDark default true) with cream text.
 */
export function StepCard({ step, title, children, icon, onDark = true, style = {}, ...rest }) {
  const ink = onDark ? "var(--cream)" : "var(--cocoa)";
  const muted = onDark ? "var(--cream-70)" : "var(--cocoa-60)";
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "16px", ...style }} {...rest}>
      <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
        <span
          style={{
            width: 44,
            height: 44,
            flex: "none",
            borderRadius: "var(--radius-pill)",
            border: `1.5px solid ${onDark ? "var(--cocoa-line)" : "var(--line-strong)"}`,
            display: "grid",
            placeItems: "center",
            fontFamily: "var(--font-display)",
            fontStyle: "italic",
            fontSize: "1.25rem",
            color: "var(--brass)",
          }}
        >
          {step}
        </span>
        {icon && <span style={{ color: onDark ? "var(--cream-70)" : "var(--clay)" }}>{icon}</span>}
      </div>
      <h3 style={{ margin: 0, color: ink, fontSize: "var(--text-h3)", fontWeight: 600 }}>{title}</h3>
      <p style={{ margin: 0, color: muted, fontSize: "var(--text-body)", lineHeight: "var(--lh-normal)" }}>
        {children}
      </p>
    </div>
  );
}
