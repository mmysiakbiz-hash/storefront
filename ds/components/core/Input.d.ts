import * as React from "react";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  /** Leading icon element. */
  iconLeft?: React.ReactNode;
  /** Corner style. Default "rect" (soft radius); "pill" for search fields. */
  shape?: "rect" | "pill";
  /** Style overrides for the outer container. */
  containerStyle?: React.CSSProperties;
}

/** Warm text field with eucalyptus focus ring and optional leading icon. */
export declare function Input(props: InputProps): JSX.Element;
