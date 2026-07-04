import * as React from "react";

export interface LogoProps extends React.HTMLAttributes<HTMLSpanElement> {
  /** Family product suffix after the divider. Default "book". */
  product?: "book" | "tour" | "bazar" | "moto" | "villa" | "lokal" | string;
  /** Size preset. Default "md". */
  size?: "sm" | "md" | "lg";
  /** Override the base ink color (e.g. cream on cocoa sections). */
  color?: string;
  /** Single-color rendering (drops the clay accent) — for tight/dark contexts. */
  mono?: boolean;
}

/** The sey.la | book wordmark, set in Fraunces (no logo file provided). */
export declare function Logo(props: LogoProps): JSX.Element;
