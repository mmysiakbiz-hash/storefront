import * as React from "react";

export interface StepCardProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Step number/label (e.g. "01"). Rendered in italic brass. */
  step: React.ReactNode;
  /** Step title. */
  title: React.ReactNode;
  /** Optional line icon. */
  icon?: React.ReactNode;
  /** Styled for the dark cocoa band. Default true. */
  onDark?: boolean;
}

/** A numbered step for the "How it works" cocoa band (Find / Pick / Show up). */
export declare function StepCard(props: StepCardProps): JSX.Element;
