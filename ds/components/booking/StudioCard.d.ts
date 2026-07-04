import * as React from "react";

export interface StudioCardProps extends React.HTMLAttributes<HTMLElement> {
  /** Studio name. */
  name?: string;
  /** Location line (area, island). */
  location?: string;
  /** Primary category label. */
  category?: string;
  /** Full image URL (e.g. an Unsplash direct link); auto-sized & cropped. */
  image?: string;
  /** Star rating. */
  rating?: number;
  /** Number of reviews shown next to the rating. */
  reviews?: number;
  /** Formatted "from" price (used when no service rows). */
  priceFrom?: string;
  /** Bookable service rows (up to 2 shown): name, optional duration, price. */
  services?: { name: string; duration?: string; price: string }[];
  /** Optional corner badge (e.g. "New", "-20%"). */
  badge?: string;
  /** Availability text; pass "" to hide. Default "Today". */
  available?: string;
  /** Element to render as. Default "a". */
  as?: any;
}

/**
 * A verified-studio listing card with a warm-treated real photo, rating, and price.
 * @startingPoint section="Booking" subtitle="Studio listing card with photo" viewport="360x400"
 */
export declare function StudioCard(props: StudioCardProps): JSX.Element;
