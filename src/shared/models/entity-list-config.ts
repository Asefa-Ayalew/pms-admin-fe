import { Filter } from "./collection.model";

export type entityViewMode = "list" | "detail" | "always-list";

export interface EntityConfig<T = void> {
  key?: string;
  identity?: string;
  name?: string;
  rootUrl?: string;
  detailUrl?: string;
  filter?: Filter[][];
  primaryColumn?: Column<T>;
  visibleColumn: Column<T>[];
  detailColumn?: Column<T>[];

  enableAffix?: boolean;
  showFullScreen?: boolean;
  showClose?: boolean;
  hasActions?: boolean;
  showDetail?: boolean;
  hasDetail?: boolean;
  hasBackLink?: boolean;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  routing?(data: any): void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  newAction?(data: any): void;
  actions?: Actions[] | ((item: T) => Actions[]);
}

export interface Column<T> {
  name?: string;
  key: string | string[];
  isDate?: boolean;
  hide?: boolean;
  print?: boolean;
  isNumber?: boolean;
  isBoolean?: boolean;
  hideSort?: boolean;
  prefix?: Column<T>;
  suffix?: Column<T>;
  // style
  tdClass?: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  render?: (value: T) => any;
  className?: (data: T) => string;
}
export interface Actions {
  label: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  icon?: React.ComponentType<any>;
  size?: string;
  type?: "primary" | "danger";
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  class?: any;
  color?: string;
  key: string;
  divider?: boolean;
  isLoading?: boolean;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onClick?: (data?: any) => void;
}
