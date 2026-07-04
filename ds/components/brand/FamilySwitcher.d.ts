import * as React from "react";

export interface FamilySwitcherProps extends React.HTMLAttributes<HTMLElement> {
  /** Currently active product. Default "book". */
  active?: string;
  /** Product list. Default the full sey.la family. */
  products?: string[];
  /** Called with the product key when a pill is clicked. */
  onSelect?: (product: string) => void;
}

/** Pill switcher across the sey.la family (tour · book · bazar · moto · villa · lokal). */
export declare function FamilySwitcher(props: FamilySwitcherProps): JSX.Element;
