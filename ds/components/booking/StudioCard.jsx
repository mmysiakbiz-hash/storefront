import React from "react";
import { Icon } from "../brand/Icon.jsx";

/**
 * StudioCard — a marketplace venue card (Fresha/Booksy style) with a warm-treated
 * photo, rating + review count, area, and bookable service rows with prices.
 */
export function StudioCard({
  name = "Kreol Spa",
  location = "Beau Vallon, Mahé",
  category = "Spa & massage",
  image,
  rating = 4.9,
  reviews = 128,
  priceFrom = "€45",
  services = [],
  badge,
  available = "Today",
  as = "a",
  style = {},
  ...rest
}) {
  const src = image
    ? (image.includes("?") ? image : image + "?auto=format&fit=crop&w=800&q=70")
    : null;
  const rows = services && services.length ? services.slice(0, 2) : null;
  const Tag = as;
  return (
    <Tag
      className="sey-studio-card"
      style={{
        display: "flex", flexDirection: "column",
        background: "var(--surface)", border: "1px solid var(--line)",
        borderRadius: "var(--radius-lg)", boxShadow: "var(--shadow-sm)",
        overflow: "hidden", color: "var(--cocoa)", textDecoration: "none",
        cursor: "pointer",
        transition: "transform var(--dur-med) var(--ease-soft), box-shadow var(--dur-med) var(--ease-soft)",
        ...style,
      }}
      {...rest}
    >
      <div style={{ position: "relative", aspectRatio: "3 / 2", overflow: "hidden", background: "var(--blush)" }}>
        {src ? (
          <img src={src} alt={name + " — " + category} loading="lazy"
            style={{ width: "100%", height: "100%", objectFit: "cover", filter: "var(--photo-filter)", display: "block" }} />
        ) : (
          <div style={{ position: "absolute", inset: 0, display: "grid", placeItems: "center", color: "var(--clay)" }}>
            <Icon name="spa" size={34} />
          </div>
        )}
        {badge && (
          <span style={{
            position: "absolute", top: 12, left: 12,
            fontSize: "var(--text-xs)", fontWeight: 700, letterSpacing: "0.02em",
            color: "var(--surface)", background: "var(--clay)",
            borderRadius: "var(--radius-pill)", padding: "5px 11px",
          }}>{badge}</span>
        )}
        <button type="button" aria-label={"Save " + name} onClick={(e) => e.preventDefault()}
          style={{
            position: "absolute", top: 10, right: 10, width: 38, height: 38,
            display: "grid", placeItems: "center", cursor: "pointer",
            borderRadius: "var(--radius-pill)", border: "none",
            background: "rgba(252,248,242,0.92)", color: "var(--clay)", backdropFilter: "blur(4px)",
          }}>
          <Icon name="heart" size={18} />
        </button>
      </div>

      <div style={{ padding: "15px 17px 17px", display: "flex", flexDirection: "column", flex: 1 }}>
        <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", gap: 10 }}>
          <h3 style={{ margin: 0, fontSize: "1.18rem", fontWeight: 600, lineHeight: 1.15 }}>{name}</h3>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 7, fontSize: "var(--text-sm)", flexWrap: "wrap" }}>
          <span style={{ display: "inline-flex", alignItems: "center", gap: 4, fontWeight: 700, color: "var(--cocoa)" }}>
            <Icon name="star" size={15} color="var(--brass)" /> {rating}
          </span>
          <span style={{ color: "var(--cocoa-60)" }}>({reviews})</span>
          <span style={{ color: "var(--cocoa-40)" }}>·</span>
          <span style={{ color: "var(--cocoa-60)" }}>{location}</span>
        </div>
        <div style={{ marginTop: 6, display: "inline-flex", alignItems: "center", gap: 6 }}>
          <span style={{
            fontSize: "var(--text-xs)", fontWeight: 600, color: "var(--eucalyptus)",
            background: "var(--confirmed-soft)", borderRadius: "var(--radius-pill)", padding: "3px 9px",
          }}>{category}</span>
          {available && (
            <span style={{ fontSize: "var(--text-xs)", color: "var(--cocoa-60)" }}>· Available {available.toLowerCase()}</span>
          )}
        </div>

        {rows ? (
          <div style={{ marginTop: 14, paddingTop: 12, borderTop: "1px solid var(--line)", display: "flex", flexDirection: "column", gap: 10 }}>
            {rows.map((s, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
                <div style={{ minWidth: 0 }}>
                  <div style={{ fontSize: "var(--text-sm)", fontWeight: 600, color: "var(--cocoa)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{s.name}</div>
                  {s.duration && <div style={{ fontSize: "var(--text-xs)", color: "var(--cocoa-60)" }}>{s.duration}</div>}
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 10, flex: "none" }}>
                  <span style={{ fontSize: "var(--text-sm)", fontWeight: 700 }}>{s.price}</span>
                  <span style={{ fontSize: "var(--text-xs)", fontWeight: 700, color: "var(--surface)", background: "var(--clay)", borderRadius: "var(--radius-pill)", padding: "6px 13px" }}>Book</span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div style={{ marginTop: "auto", paddingTop: 14, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <span style={{ fontSize: "var(--text-sm)", color: "var(--cocoa-60)" }}>from <b style={{ color: "var(--cocoa)" }}>{priceFrom}</b></span>
            <span style={{ display: "inline-flex", alignItems: "center", gap: 5, fontSize: "var(--text-sm)", fontWeight: 600, color: "var(--clay)" }}>
              Book <Icon name="arrowRight" size={16} color="var(--clay)" />
            </span>
          </div>
        )}
      </div>

      <style>{`
        .sey-studio-card:hover { transform: translateY(-4px); box-shadow: var(--shadow-lg); }
        .sey-studio-card:active { transform: translateY(-1px); }
      `}</style>
    </Tag>
  );
}
