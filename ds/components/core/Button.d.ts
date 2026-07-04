import * as React from "react";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** Visual style. Default "primary" (clay CTA). */
  variant?: "primary" | "secondary" | "ghost" | "dark";
  /** Size preset. Default "md". */
  size?: "sm" | "md" | "lg";
  /** Render as another element (e.g. "a"). Default "button". */
  as?: any;
  /** Icon element before the label. */
  iconLeft?: React.ReactNode;
  /** Icon element after the label. */
  iconRight?: React.ReactNode;
  /** Full-width button. */
  full?: boolean;
  /** When rendered as an anchor (as="a"). */
  href?: string;
  target?: string;
  rel?: string;
}

/**
 * The clay CTA and quieter siblings. Sentence case labels only.
 * @startingPoint section="Core" subtitle="Clay CTA + variants" viewport="700x120"
 */
export declare function Button(props: ButtonProps): JSX.Element;
