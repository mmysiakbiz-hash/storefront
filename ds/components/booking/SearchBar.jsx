import React from "react";
import { Icon } from "../brand/Icon.jsx";
import { Button } from "../core/Button.jsx";

/**
 * SearchBar — the hero booking search. Treatment + location + CTA in one warm bar.
 * Collapses to stacked fields on mobile.
 */
export function SearchBar({
  treatmentPlaceholder = "Treatment or studio",
  locationPlaceholder = "Anywhere on Mahé",
  datePlaceholder = "Any date",
  withDate = false,
  cta = "See open slots",
  onSubmit,
  style = {},
  ...rest
}) {
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit && onSubmit(e);
      }}
      className="sey-searchbar"
      style={{
        display: "flex",
        alignItems: "stretch",
        gap: "8px",
        background: "var(--surface)",
        borderRadius: "var(--radius-pill)",
        boxShadow: "var(--shadow-md)",
        border: "1px solid var(--line)",
        padding: "8px",
        ...style,
      }}
      {...rest}
    >
      <label className="sey-search-field">
        <Icon name="search" size={19} color="var(--cocoa-40)" />
        <input type="text" placeholder={treatmentPlaceholder} aria-label="Treatment or studio" />
      </label>
      <span className="sey-search-divider" aria-hidden="true" />
      <label className="sey-search-field">
        <Icon name="pin" size={19} color="var(--cocoa-40)" />
        <input type="text" placeholder={locationPlaceholder} aria-label="Location" />
      </label>
      {withDate && <span className="sey-search-divider" aria-hidden="true" />}
      {withDate && (
        <label className="sey-search-field sey-search-field--sm">
          <Icon name="calendar" size={19} color="var(--cocoa-40)" />
          <input type="text" placeholder={datePlaceholder} aria-label="Date" />
        </label>
      )}
      <Button type="submit" size="md" style={{ flex: "none" }}>
        {cta}
      </Button>

      <style>{`
        .sey-search-field {
          flex: 1; min-width: 0;
          display: flex; align-items: center; gap: 10px;
          padding: 6px 18px;
          border-radius: var(--radius-pill);
          transition: background var(--dur-fast) var(--ease-soft);
        }
        .sey-search-field:focus-within { background: var(--blush); }
        .sey-search-field--sm { flex: 0.7; }
        .sey-search-field input {
          flex: 1; min-width: 0;
          border: none; outline: none; background: transparent;
          font-family: var(--font-body); font-size: var(--text-body);
          color: var(--cocoa); padding: 8px 0;
        }
        .sey-search-field input::placeholder { color: var(--cocoa-40); }
        .sey-search-divider { width: 1px; background: var(--line); margin: 8px 0; flex: none; }
        @media (max-width: 640px) {
          .sey-searchbar { flex-direction: column; border-radius: var(--radius-lg); padding: 10px; }
          .sey-search-field { border: 1px solid var(--line); }
          .sey-search-divider { display: none; }
          .sey-searchbar > button { width: 100%; }
        }
      `}</style>
    </form>
  );
}
