import * as React from "react";
import type { IconName } from "../brand/Icon";

export interface BookingCardProps extends React.HTMLAttributes<HTMLElement> {
  /** Service name. */
  service?: string;
  /** Studio + location line. */
  studio?: string;
  /** Date/time line. */
  when?: string;
  /** Formatted price (e.g. "€55"). */
  price?: string;
  /** Status pill text; pass "" to hide. Default "Confirmed". */
  status?: string;
  /** Leading line-icon. Default "spa". */
  icon?: IconName;
  /** Render the thumbnail as a reserved slot for a real studio photo. */
  imageSlot?: boolean;
  /** Apply the gentle float animation (as in the hero). */
  float?: boolean;
}

/**
 * A real booking summary — the reusable form of the card that peeks from the hero arch.
 * @startingPoint section="Booking" subtitle="Booking summary card" viewport="400x120"
 */
export declare function BookingCard(props: BookingCardProps): JSX.Element;
