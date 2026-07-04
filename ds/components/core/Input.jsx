import React from "react";

/**
 * Input — warm text field with optional leading icon. Pill or soft-rect.
 */
export function Input({ iconLeft, shape = "rect", style = {}, containerStyle = {}, ...rest }) {
  const radius = shape === "pill" ? "var(--radius-pill)" : "var(--radius-md)";
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: "10px",
        background: "var(--surface)",
        border: "1.5px solid var(--border)",
        borderRadius: radius,
        padding: iconLeft ? "0 16px 0 16px" : "0 16px",
        transition: "border-color var(--dur-fast) var(--ease-soft), box-shadow var(--dur-fast) var(--ease-soft)",
        ...containerStyle,
      }}
      className="sey-input"
    >
      {iconLeft && <span style={{ color: "var(--cocoa-40)", flex: "none" }}>{iconLeft}</span>}
      <input
        style={{
          flex: 1,
          minWidth: 0,
          appearance: "none",
          border: "none",
          outline: "none",
          background: "transparent",
          font: "inherit",
          fontFamily: "var(--font-body)",
          fontSize: "var(--text-body)",
          color: "var(--cocoa)",
          padding: "13px 0",
          ...style,
        }}
        {...rest}
      />
      <style>{`
        .sey-input:focus-within { border-color: var(--eucalyptus); box-shadow: var(--shadow-focus); }
        .sey-input input::placeholder { color: var(--cocoa-40); }
      `}</style>
    </div>
  );
}
