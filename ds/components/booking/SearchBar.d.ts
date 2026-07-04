import * as React from "react";

export interface SearchBarProps extends React.FormHTMLAttributes<HTMLFormElement> {
  /** Placeholder for the treatment/studio field. */
  treatmentPlaceholder?: string;
  /** Placeholder for the location field. */
  locationPlaceholder?: string;
  /** Placeholder for the date field (shown when withDate). */
  datePlaceholder?: string;
  /** Show a date field in the bar. Default false. */
  withDate?: boolean;
  /** CTA button label. Default "See open slots". */
  cta?: string;
  /** Submit handler (default is prevented for you). */
  onSubmit?: (e: React.FormEvent) => void;
}

/**
 * The hero booking search: treatment + location + CTA in one warm pill bar.
 * @startingPoint section="Booking" subtitle="Hero treatment + location search" viewport="700x120"
 */
export declare function SearchBar(props: SearchBarProps): JSX.Element;
