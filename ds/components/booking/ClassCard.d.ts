import * as React from "react";

export interface ClassCardProps extends React.HTMLAttributes<HTMLElement> {
  /** Short day label, e.g. "Mon". */
  day?: string;
  /** Start time, e.g. "07:00". */
  time?: string;
  /** Class name. */
  name?: string;
  /** Instructor line, e.g. "with Aline". */
  instructor?: string;
  /** Duration label. */
  duration?: string;
  /** Level label, e.g. "All levels". */
  level?: string;
  /** Formatted price per spot. */
  price?: string;
  /** Spots remaining; 0 or less shows waitlist. */
  spotsLeft?: number;
  /** Total capacity. */
  capacity?: number;
  /** Join / waitlist click handler. */
  onJoin?: () => void;
}

/**
 * A group-class slot with live spots-left, a capacity bar, and a join/waitlist button.
 * Ideal for yoga and personal-training schedules where remaining spots drive urgency.
 * @startingPoint section="Booking" subtitle="Group class slot with spots left" viewport="520x150"
 */
export declare function ClassCard(props: ClassCardProps): JSX.Element;
