import * as React from "react";
import type { IconName } from "../brand/Icon";

export interface CategoryTileProps extends React.HTMLAttributes<HTMLElement> {
  /** Line-icon name for the category. */
  icon: IconName;
  /** Category label (sentence case). */
  label: string;
  /** Optional studio count shown under the label. */
  count?: number;
  /** Element to render as. Default "a". */
  as?: any;
  /** When rendered as an anchor (as="a"). */
  href?: string;
  target?: string;
  rel?: string;
}

/**
 * A service-category card with a line icon; used in the 8-category grid.
 * @startingPoint section="Booking" subtitle="Service category tile" viewport="240x160"
 */
export declare function CategoryTile(props: CategoryTileProps): JSX.Element;
