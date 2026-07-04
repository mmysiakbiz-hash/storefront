import React from "react";
import { Icon } from "./Icon.jsx";

/**
 * ArchMirror — the signature hero element. A tall salon-mirror arch filled with
 * a candlelight gradient, a line-drawn frangipani, a rising brass "scent wisp",
 * and a realistic booking card peeking from the bottom.
 * This is the one loud moment — use once, in the hero.
 */
export function ArchMirror({
  service = "Coconut & Frangipani massage",
  studio = "Kreol Spa, Beau Vallon",
  when = "Tomorrow · 14:30",
  price = "€55",
  status = "Confirmed",
  image = "https://images.unsplash.com/photo-1519823551278-64ac92734fb1?auto=format&fit=crop&w=200&q=70",
  showCard = true,
  style = {},
  ...rest
}) {
  return (
    <div
      style={{
        position: "relative",
        width: "min(100%, 380px)",
        margin: "0 auto",
        paddingBottom: showCard ? "56px" : 0,
        ...style,
      }}
      {...rest}
    >
      {/* The arch */}
      <div
        style={{
          position: "relative",
          aspectRatio: "3 / 4.3",
          borderRadius: "190px 190px 26px 26px",
          background: "var(--grad-candle)",
          boxShadow: "var(--shadow-lg), inset 0 2px 14px rgba(255,240,214,0.5)",
          overflow: "hidden",
          isolation: "isolate",
        }}
      >
        {/* inner glow bloom */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "radial-gradient(60% 45% at 50% 78%, rgba(255,244,222,0.7), rgba(255,244,222,0) 70%)",
            mixBlendMode: "screen",
            pointerEvents: "none",
          }}
        />
        {/* thin arch frame line (brass, very sparing) */}
        <div
          style={{
            position: "absolute",
            inset: "12px",
            borderRadius: "180px 180px 18px 18px",
            border: "1px solid rgba(178,146,95,0.55)",
            pointerEvents: "none",
          }}
        />

        {/* Scent wisp — brass line rising from the flower */}
        <svg
          viewBox="0 0 40 200"
          preserveAspectRatio="none"
          aria-hidden="true"
          style={{
            position: "absolute",
            left: "50%",
            top: "8%",
            transform: "translateX(-50%)",
            width: "48px",
            height: "52%",
            overflow: "visible",
          }}
        >
          <path
            className="sey-wisp"
            d="M20 200 C 6 168, 34 150, 20 118 C 8 92, 32 74, 20 44 C 12 24, 24 12, 20 0"
            fill="none"
            stroke="rgba(178,146,95,0.7)"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeDasharray="7 10"
          />
        </svg>

        {/* Frangipani line flower (bespoke brand illustration) */}
        <svg
          viewBox="0 0 120 120"
          aria-hidden="true"
          style={{
            position: "absolute",
            left: "50%",
            bottom: "16%",
            transform: "translateX(-50%)",
            width: "58%",
            opacity: 0.92,
          }}
        >
          <g
            fill="none"
            stroke="rgba(59,42,37,0.55)"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            {[0, 72, 144, 216, 288].map((deg) => (
              <g key={deg} transform={`rotate(${deg} 60 60)`}>
                <path d="M60 60 C 44 52, 40 26, 55 10 C 62 4, 70 8, 70 20 C 70 38, 66 52, 60 60Z" />
              </g>
            ))}
            <circle cx="60" cy="60" r="6" stroke="rgba(178,146,95,0.85)" />
          </g>
        </svg>
      </div>

      {/* Booking card peeking from the bottom of the arch */}
      {showCard && (
        <div
          className="sey-arch-card"
          style={{
            position: "absolute",
            left: "50%",
            bottom: 0,
            transform: "translateX(-50%)",
            width: "min(96%, 340px)",
            background: "var(--surface)",
            borderRadius: "var(--radius-lg)",
            boxShadow: "var(--shadow-float)",
            padding: "16px 18px",
            display: "flex",
            alignItems: "center",
            gap: "14px",
          }}
        >
          <div
            style={{
              width: 46,
              height: 46,
              flex: "none",
              borderRadius: "14px",
              background: "var(--blush)",
              overflow: "hidden",
              display: "grid",
              placeItems: "center",
              color: "var(--clay)",
            }}
          >
            {image ? (
              <img src={image} alt="" style={{ width: "100%", height: "100%", objectFit: "cover", filter: "var(--photo-filter)" }} />
            ) : (
              <Icon name="spa" size={24} />
            )}
          </div>
          <div style={{ minWidth: 0, flex: 1 }}>
            <div
              style={{
                fontFamily: "var(--font-display)",
                fontWeight: 600,
                fontSize: "1rem",
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
                gap: "8px",
                marginTop: 8,
                fontSize: "var(--text-xs)",
                color: "var(--cocoa-80)",
              }}
            >
              <span style={{ display: "inline-flex", alignItems: "center", gap: 4 }}>
                <Icon name="clock" size={14} color="var(--cocoa-60)" /> {when}
              </span>
              <span style={{ fontWeight: 600 }}>{price}</span>
            </div>
          </div>
          <span
            style={{
              flex: "none",
              alignSelf: "flex-start",
              display: "inline-flex",
              alignItems: "center",
              gap: 4,
              fontSize: "var(--text-xs)",
              fontWeight: 600,
              color: "var(--eucalyptus)",
              background: "var(--confirmed-soft)",
              borderRadius: "var(--radius-pill)",
              padding: "4px 9px",
            }}
          >
            <Icon name="check" size={13} color="var(--eucalyptus)" /> {status}
          </span>
        </div>
      )}

      <style>{`
        @keyframes seyWispRise { to { stroke-dashoffset: -34; } }
        @keyframes seyArchFloat { 0%,100% { transform: translateX(-50%) translateY(0); } 50% { transform: translateX(-50%) translateY(-8px); } }
        .sey-wisp { animation: seyWispRise 4.5s linear infinite; }
        .sey-arch-card { animation: seyArchFloat var(--dur-float, 6s) var(--ease-soft, ease-in-out) infinite; }
        @media (prefers-reduced-motion: reduce) {
          .sey-wisp, .sey-arch-card { animation: none; }
        }
      `}</style>
    </div>
  );
}
