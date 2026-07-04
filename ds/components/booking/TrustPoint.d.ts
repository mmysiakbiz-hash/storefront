import * as React from "react";

export interface TrustPointProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Line icon element (eucalyptus by default). */
  icon?: React.ReactNode;
  /** Short title. */
  title?: React.ReactNode;
  /** Invert colors for dark sections. */
  onDark?: boolean;
}

/** A single reassurance point (verified · free · real-time · cancel free) for the trust row. */
export declare function TrustPoint(props: TrustPointProps): JSX.Element;
