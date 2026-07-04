import * as React from "react";

export type IconName =
  | "hair" | "nails" | "spa" | "barber" | "brows" | "makeup" | "fitness" | "auto"
  | "search" | "pin" | "calendar" | "clock" | "check" | "shield" | "heart"
  | "chevronDown" | "chevronRight" | "arrowRight" | "menu" | "close"
  | "star" | "sparkle" | "lotus";

export interface IconProps extends React.SVGProps<SVGSVGElement> {
  /** Which line icon to render. */
  name: IconName;
  /** Square size in px. Default 24. */
  size?: number;
  /** Stroke width. Default 1.6 (brand spec). */
  stroke?: number;
  /** Stroke color. Default currentColor. */
  color?: string;
  /** Accessible label; when set the icon is exposed to AT, otherwise hidden. */
  label?: string;
}

/** The sey.la | book line-icon set — 24×24, 1.6 stroke, no fill, no emoji. */
export declare function Icon(props: IconProps): JSX.Element | null;
export declare const ICON_NAMES: IconName[];
