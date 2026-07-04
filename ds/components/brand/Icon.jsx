import React from "react";

/**
 * Icon — the sey.la | book line-icon set.
 * 24×24, ~1.6 stroke, round caps/joins, no fill. No emoji, ever.
 */

const PATHS = {
  // Category icons
  hair: (
    <>
      <circle cx="7" cy="7" r="2.4" />
      <circle cx="7" cy="17" r="2.4" />
      <path d="M9 8.2 20 16M9 15.8 20 8" />
    </>
  ),
  nails: (
    <>
      <path d="M9 21h6M9 21c-.5-3 0-6 .4-8.5C9.9 8 10.6 4 12 4s2.1 4 2.6 8.5c.3 2.5.9 5.5.4 8.5" />
      <path d="M9.6 12.5h4.8" />
    </>
  ),
  spa: (
    <>
      <path d="M12 20c0-4 0-7-2.5-9.5" />
      <path d="M12 20c0-4 0-7 2.5-9.5" />
      <path d="M12 20c-3.5 0-6-1-7.5-3 2.5-1 5 0 7.5 3Z" />
      <path d="M12 20c3.5 0 6-1 7.5-3-2.5-1-5 0-7.5 3Z" />
      <path d="M12 11c-.8-2 0-4 0-4s.8 2 0 4Z" />
    </>
  ),
  barber: (
    <>
      <circle cx="6" cy="6" r="2.2" />
      <circle cx="6" cy="18" r="2.2" />
      <path d="M7.8 7.6 18 16.4M7.8 16.4 18 7.6" />
      <path d="M18 7.6v-2M18 16.4v2" />
    </>
  ),
  brows: (
    <>
      <path d="M3 12c3-4.5 15-4.5 18 0" />
      <path d="M4.5 15c2.5 3 12.5 3 15 0" />
      <circle cx="12" cy="14.5" r="1.4" />
    </>
  ),
  makeup: (
    <>
      <path d="M14.5 4.5 19.5 9.5 9 20 4 20 4 15Z" />
      <path d="M12.5 6.5 17.5 11.5" />
    </>
  ),
  fitness: (
    <>
      <path d="M4 9v6M20 9v6M4 12h16" />
      <rect x="2.5" y="8" width="2.2" height="8" rx="1" />
      <rect x="19.3" y="8" width="2.2" height="8" rx="1" />
    </>
  ),
  auto: (
    <>
      <path d="M4 16v-3l2-5h12l2 5v3" />
      <path d="M3 16h18" />
      <circle cx="7.5" cy="16.5" r="1.6" />
      <circle cx="16.5" cy="16.5" r="1.6" />
    </>
  ),
  skin: (
    <>
      <circle cx="12" cy="12.4" r="7.3" />
      <circle cx="9.4" cy="11" r="0.5" />
      <circle cx="14.6" cy="11" r="0.5" />
      <path d="M9.2 14.4c.8.9 1.7 1.3 2.8 1.3s2-.4 2.8-1.3" />
    </>
  ),
  waxing: (
    <>
      <rect x="4.3" y="8.6" width="12" height="7" rx="2.2" />
      <path d="M7.5 12h5.6" />
      <path d="M16.8 10.4c1.6-.6 2.7.4 2.7 1.6s-1.1 2.2-2.7 1.6" />
    </>
  ),
  tattoo: (
    <>
      <rect x="11.4" y="3.9" width="6.6" height="4.6" rx="1.6" transform="rotate(45 14.7 6.2)" />
      <path d="M12.4 8.3 6 14.7" />
      <path d="M6 14.7 4.4 19.6 9.4 18" />
    </>
  ),
  piercing: (
    <>
      <circle cx="10" cy="14" r="5" />
      <circle cx="14.8" cy="9.4" r="1.5" />
      <path d="M13.4 10.7 11.7 12.4" />
    </>
  ),
  trainer: (
    <>
      <path d="M4 10.5h8.5a3 3 0 0 1 0 6H8.5a4.5 4.5 0 0 1-4.5-4.5Z" />
      <path d="M12.5 10.5V7.5H16" />
      <circle cx="8" cy="13.3" r="1.3" />
    </>
  ),
  // UI icons
  search: (
    <>
      <circle cx="11" cy="11" r="6.5" />
      <path d="m20 20-4-4" />
    </>
  ),
  pin: (
    <>
      <path d="M12 21c4-4.5 7-7.7 7-11a7 7 0 1 0-14 0c0 3.3 3 6.5 7 11Z" />
      <circle cx="12" cy="10" r="2.4" />
    </>
  ),
  calendar: (
    <>
      <rect x="4" y="5" width="16" height="16" rx="2.5" />
      <path d="M4 9.5h16M8 3.5v3M16 3.5v3" />
    </>
  ),
  clock: (
    <>
      <circle cx="12" cy="12" r="8" />
      <path d="M12 7.5V12l3 2" />
    </>
  ),
  check: <path d="m5 12.5 4.5 4.5L19 7" />,
  shield: (
    <>
      <path d="M12 3 19 6v5c0 4.5-3 7.8-7 10-4-2.2-7-5.5-7-10V6Z" />
      <path d="m9 12 2 2 4-4" />
    </>
  ),
  heart: (
    <path d="M12 20C7 16.5 4 13.5 4 9.8 4 7.1 6 5.2 8.4 5.2c1.6 0 2.8.8 3.6 2 .8-1.2 2-2 3.6-2C18 5.2 20 7.1 20 9.8c0 3.7-3 6.7-8 10.2Z" />
  ),
  chevronDown: <path d="m6 9.5 6 6 6-6" />,
  chevronRight: <path d="m9.5 6 6 6-6 6" />,
  arrowRight: <path d="M4 12h15m0 0-6-6m6 6-6 6" />,
  menu: <path d="M4 7h16M4 12h16M4 17h16" />,
  close: <path d="M6 6 18 18M18 6 6 18" />,
  star: (
    <path d="M12 4.5l2.2 4.6 5 .7-3.6 3.5.9 5-4.5-2.4L7.4 18.3l.9-5L4.7 9.8l5-.7Z" />
  ),
  sparkle: (
    <path d="M12 4c.6 3.4 1.6 4.4 5 5-3.4.6-4.4 1.6-5 5-.6-3.4-1.6-4.4-5-5 3.4-.6 4.4-1.6 5-5Z" />
  ),
  lotus: (
    <>
      <path d="M12 19c-3.6 0-6.5-1.4-8-4 2-1.2 4.4-.7 6.2 1" />
      <path d="M12 19c3.6 0 6.5-1.4 8-4-2-1.2-4.4-.7-6.2 1" />
      <path d="M12 19c-1.8-1.5-3-3.5-3-5.7 0-2.6 1.4-4.8 3-6.3 1.6 1.5 3 3.7 3 6.3 0 2.2-1.2 4.2-3 5.7Z" />
    </>
  ),
};

export function Icon({ name, size = 24, stroke = 1.6, color = "currentColor", label, style = {}, ...rest }) {
  const path = PATHS[name];
  if (!path) return null;
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth={stroke}
      strokeLinecap="round"
      strokeLinejoin="round"
      role={label ? "img" : "presentation"}
      aria-label={label || undefined}
      aria-hidden={label ? undefined : true}
      style={{ display: "block", flex: "none", ...style }}
      {...rest}
    >
      {path}
    </svg>
  );
}

export const ICON_NAMES = Object.keys(PATHS);
