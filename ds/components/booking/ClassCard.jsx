import React from "react";
import { Icon } from "../brand/Icon.jsx";

/**
 * ClassCard — a group-class slot for schedules (yoga, movement, personal training).
 * Shows day/time, instructor, and live spots-left with a capacity bar; the Join
 * button shifts to "Almost full" near capacity and "Join waitlist" when full.
 */
export function ClassCard({
  day = "Mon",
  time = "07:00",
  name = "Sunrise beach yoga",
  instructor = "with Aline",
  duration = "60 min",
  level = "All levels",
  price = "€18",
  spotsLeft = 4,
  capacity = 12,
  onJoin,
  style = {},
  ...rest
}) {
  const full = spotsLeft <= 0;
  const almost = !full && spotsLeft <= 2;
  const taken = Math.max(0, capacity - spotsLeft);
  const pct = capacity > 0 ? Math.min(100, Math.round((taken / capacity) * 100)) : 0;
  const barColor = full ? "var(--clay)" : almost ? "var(--brass)" : "var(--eucalyptus)";
  const spotLabel = full ? "Full" : spotsLeft + " of " + capacity + " spots left";

  return (
    <article
      style={{
        display: "flex", alignItems: "stretch", gap: 0,
        background: "var(--surface)", border: "1px solid var(--line)",
        borderRadius: "var(--radius-lg)", boxShadow: "var(--shadow-sm)",
        overflow: "hidden", ...style,
      }}
      {...rest}
    >
      <div style={{
        flex: "none", width: 84, display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center", gap: 2,
        background: "var(--blush)", color: "var(--cocoa)", padding: "14px 8px",
      }}>
        <span style={{ fontSize: "var(--text-xs)", fontWeight: 600, letterSpacing: "0.06em", textTransform: "uppercase", color: "var(--cocoa-60)" }}>{day}</span>
        <span style={{ fontFamily: "var(--font-display)", fontSize: "1.5rem", fontWeight: 600, lineHeight: 1 }}>{time}</span>
      </div>

      <div style={{ flex: 1, minWidth: 0, padding: "16px 18px", display: "flex", flexDirection: "column", gap: 8 }}>
        <div>
          <h3 style={{ margin: 0, fontSize: "1.15rem", fontWeight: 600, color: "var(--cocoa)", lineHeight: 1.2 }}>{name}</h3>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 12, marginTop: 4, fontSize: "var(--text-sm)", color: "var(--cocoa-60)" }}>
            <span>{instructor}</span>
            <span style={{ display: "inline-flex", alignItems: "center", gap: 5 }}><Icon name="clock" size={13} color="var(--cocoa-40)" /> {duration}</span>
            <span>{level}</span>
          </div>
        </div>

        <div style={{ marginTop: "auto" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10, marginBottom: 6 }}>
            <span style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: "var(--text-sm)", fontWeight: 600, color: full ? "var(--clay)" : almost ? "var(--brass-ink, var(--brass))" : "var(--eucalyptus)" }}>
              <Icon name={full ? "close" : "check"} size={14} color={barColor} /> {spotLabel}
            </span>
            <span style={{ fontFamily: "var(--font-display)", fontSize: "1.15rem", fontWeight: 600, color: "var(--cocoa)" }}>{price}</span>
          </div>
          <div style={{ height: 5, borderRadius: 999, background: "var(--line)", overflow: "hidden" }}>
            <div style={{ width: pct + "%", height: "100%", background: barColor, borderRadius: 999, transition: "width var(--dur-med) var(--ease-soft)" }}></div>
          </div>
        </div>
      </div>

      <div style={{ flex: "none", display: "flex", alignItems: "center", padding: "0 18px 0 6px" }}>
        <button
          onClick={onJoin}
          className={"sey-classjoin" + (full ? " is-full" : "")}
          style={{
            fontFamily: "var(--font-body)", fontWeight: 600, fontSize: "var(--text-sm)",
            whiteSpace: "nowrap", cursor: "pointer", borderRadius: "var(--radius-pill)",
            padding: "10px 18px", transition: "background var(--dur-fast) var(--ease-soft), border-color var(--dur-fast) var(--ease-soft)",
            color: full ? "var(--cocoa)" : "var(--surface)",
            background: full ? "transparent" : "var(--clay)",
            border: full ? "1.5px solid var(--border-strong)" : "1px solid transparent",
          }}
        >
          {full ? "Join waitlist" : almost ? "Almost full · Join" : "Join class"}
          <style>{`
            .sey-classjoin:not(.is-full):hover { background: var(--clay-hover); }
            .sey-classjoin.is-full:hover { border-color: var(--clay); color: var(--clay); }
            .sey-classjoin:active { transform: translateY(1px); }
          `}</style>
        </button>
      </div>
    </article>
  );
}
