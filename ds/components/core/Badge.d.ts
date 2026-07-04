import * as React from "react";

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  /** Color tone. Default "neutral". */
  tone?: "neutral" | "brand" | "botanical" | "brass" | "confirmed" | "dark";
  /** Icon element before the label. */
  iconLeft?: React.ReactNode;
}

/** Small status/label pill in warm brand tones. */
export declare function Badge(props: BadgeProps): JSX.Element;
