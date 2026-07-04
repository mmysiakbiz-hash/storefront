import * as React from "react";

export interface ArchMirrorProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Service name shown on the peeking booking card. */
  service?: string;
  /** Studio + location line. */
  studio?: string;
  /** Date/time line. */
  when?: string;
  /** Price string (already formatted, e.g. "€55"). */
  price?: string;
  /** Status pill text. Default "Confirmed". */
  status?: string;
  /** Show the peeking booking card. Default true. */
  showCard?: boolean;
}

/**
 * The signature hero element: a candlelit salon-mirror arch with a line-drawn
 * frangipani, a rising brass scent wisp, and a peeking booking card.
 * Use exactly once, in the hero.
 * @startingPoint section="Brand" subtitle="Signature candlelit hero arch" viewport="420x620"
 */
export declare function ArchMirror(props: ArchMirrorProps): JSX.Element;
