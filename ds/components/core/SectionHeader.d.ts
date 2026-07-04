import * as React from "react";

export interface SectionHeaderProps extends React.HTMLAttributes<HTMLElement> {
  /** Small uppercase kicker above the title. */
  eyebrow?: React.ReactNode;
  /** Main display title. */
  title?: React.ReactNode;
  /** One word rendered in Fraunces italic clay accent. */
  accent?: string;
  /** Where the accent word sits relative to the title. Default "end". */
  accentPosition?: "start" | "end";
  /** Supporting intro paragraph. */
  intro?: React.ReactNode;
  /** Text alignment. Default "left". */
  align?: "left" | "center";
  /** Invert colors for dark cocoa sections. */
  onDark?: boolean;
  /** Title scale. Default "lg". */
  size?: "md" | "lg" | "xl";
}

/** Eyebrow + display title (with optional italic accent word) + intro block. */
export declare function SectionHeader(props: SectionHeaderProps): JSX.Element;
