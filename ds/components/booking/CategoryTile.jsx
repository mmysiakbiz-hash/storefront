import React from "react";
import { Icon } from "../brand/Icon.jsx";

/**
 * CategoryTile — a service category card with a line icon.
 * Lifts gently on hover. Used in the 8-category grid.
 */
export function CategoryTile({ icon, label, count, as = "a", style = {}, ...rest }) {
  const Tag = as;
  return (
    <Tag
      className="sey-cat-tile"
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "18px",
        padding: "22px",
        minHeight: "140px",
        justifyContent: "space-between",
        background: "var(--surface)",
        border: "1px solid var(--line)",
        borderRadius: "var(--radius-lg)",
        boxShadow: "var(--shadow-sm)",
        color: "var(--cocoa)",
        textDecoration: "none",
        cursor: "pointer",
        transition: "transform var(--dur-med) var(--ease-soft), box-shadow var(--dur-med) var(--ease-soft), border-color var(--dur-med) var(--ease-soft)",
        ...style,
      }}
      {...rest}
    >
      <span
        style={{
          width: 48,
          height: 48,
          borderRadius: "16px",
          background: "var(--blush)",
          display: "grid",
          placeItems: "center",
          color: "var(--clay)",
        }}
      >
        <Icon name={icon} size={26} />
      </span>
      <span>
        <span
          style={{
            display: "block",
            fontFamily: "var(--font-display)",
            fontWeight: 600,
            fontSize: "1.2rem",
            lineHeight: 1.15,
          }}
        >
          {label}
        </span>
        {count != null && (
          <span style={{ display: "block", fontSize: "var(--text-xs)", color: "var(--cocoa-60)", marginTop: 5 }}>
            {count} studios
          </span>
        )}
      </span>
      <style>{`
        .sey-cat-tile:hover { transform: translateY(-3px); box-shadow: var(--shadow-md); border-color: var(--line-strong); }
        .sey-cat-tile:active { transform: translateY(-1px); }
      `}</style>
    </Tag>
  );
}
