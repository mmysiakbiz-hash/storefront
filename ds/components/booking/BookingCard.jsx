import React from "react";
import { Icon } from "../brand/Icon.jsx";
import { Badge } from "../core/Badge.jsx";

/**
 * BookingCard — a real booking summary. Standalone version of the card that
 * peeks from the hero arch; reusable in listings, confirmations, "my bookings".
 */
export function BookingCard({
  service = "Coconut & Frangipani massage",
  studio = "Kreol Spa, Beau Vallon",
  when = "Tomorrow · 14:30",
  price = "€55",
  status = "Confirmed",
  icon = "spa",
  imageSlot = false,
  float = false,
  style = {},
  ...rest
}) {
  return (
    <article
      className={float ? "sey-booking-card sey-booking-card--float" : "sey-booking-card"}
      style={{
        display: "flex",
        alignItems: "center",
        gap: "14px",
        width: "100%",
        maxWidth: "360px",
        background: "var(--surface)",
        borderRadius: "var(--radius-lg)",
        boxShadow: "var(--shadow-md)",
        border: "1px solid var(--line)",
        padding: "16px 18px",
        ...style,
      }}
      {...rest}
    >
      {imageSlot ? (
        <div
          aria-label="Studio photo"
          style={{
            width: 52,
            height: 52,
            flex: "none",
            borderRadius: "14px",
            background: "var(--blush)",
            display: "grid",
            placeItems: "center",
            color: "var(--cocoa-40)",
            fontSize: "var(--text-xs)",
            textAlign: "center",
            overflow: "hidden",
          }}
        >
          {/* Reserved for a real studio photo */}
          <Icon name={icon} size={22} color="var(--clay)" />
        </div>
      ) : (
        <div
          style={{
            width: 52,
            height: 52,
            flex: "none",
            borderRadius: "14px",
            background: "var(--blush)",
            display: "grid",
            placeItems: "center",
            color: "var(--clay)",
          }}
        >
          <Icon name={icon} size={24} />
        </div>
      )}

      <div style={{ minWidth: 0, flex: 1 }}>
        <div
          style={{
            fontFamily: "var(--font-display)",
            fontWeight: 600,
            fontSize: "1.05rem",
            color: "var(--cocoa)",
            lineHeight: 1.2,
          }}
        >
          {service}
        </div>
        <div
          style={{
            fontSize: "var(--text-xs)",
            color: "var(--cocoa-60)",
            marginTop: 3,
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          {studio}
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            marginTop: 9,
            fontSize: "var(--text-xs)",
            color: "var(--cocoa-80)",
          }}
        >
          <span style={{ display: "inline-flex", alignItems: "center", gap: 4 }}>
            <Icon name="clock" size={14} color="var(--cocoa-60)" /> {when}
          </span>
          <span style={{ fontWeight: 700 }}>{price}</span>
        </div>
      </div>

      {status && (
        <div style={{ alignSelf: "flex-start", flex: "none" }}>
          <Badge tone="confirmed" iconLeft={<Icon name="check" size={13} color="var(--eucalyptus)" />}>
            {status}
          </Badge>
        </div>
      )}

      <style>{`
        @keyframes seyBookingFloat { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-7px); } }
        .sey-booking-card--float { animation: seyBookingFloat var(--dur-float,6s) var(--ease-soft) infinite; box-shadow: var(--shadow-float); }
        @media (prefers-reduced-motion: reduce) { .sey-booking-card--float { animation: none; } }
      `}</style>
    </article>
  );
}
