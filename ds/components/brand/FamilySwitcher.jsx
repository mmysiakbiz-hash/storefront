import React from "react";

const FAMILY = ["tour", "book", "bazar", "moto", "villa", "lokal"];

/**
 * FamilySwitcher — pill switcher across the sey.la family of products.
 * Current product is highlighted in clay.
 */
export function FamilySwitcher({ active = "book", products = FAMILY, onSelect, style = {}, ...rest }) {
  return (
    <nav
      aria-label="sey.la family"
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "2px",
        padding: "4px",
        borderRadius: "var(--radius-pill)",
        background: "rgba(59,42,37,0.05)",
        border: "1px solid var(--line)",
        ...style,
      }}
      {...rest}
    >
      {products.map((p) => {
        const on = p === active;
        return (
          <button
            key={p}
            type="button"
            aria-current={on ? "page" : undefined}
            onClick={onSelect ? () => onSelect(p) : undefined}
            style={{
              appearance: "none",
              border: "none",
              cursor: "pointer",
              font: "inherit",
              fontFamily: "var(--font-body)",
              fontSize: "var(--text-sm)",
              fontWeight: on ? 600 : 500,
              letterSpacing: "0.01em",
              padding: "6px 14px",
              borderRadius: "var(--radius-pill)",
              color: on ? "var(--surface)" : "var(--cocoa-60)",
              background: on ? "var(--clay)" : "transparent",
              transition: "background var(--dur-fast) var(--ease-soft), color var(--dur-fast) var(--ease-soft)",
            }}
          >
            {p}
          </button>
        );
      })}
    </nav>
  );
}
