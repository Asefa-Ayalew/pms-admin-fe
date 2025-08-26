import { Filter } from "./collection.model";

export interface TableConfig<T = void> {
  title?: string;
  filter?: Filter[][];
  columns: Column<T>[];
  detailColumn?: Column<T>[];

  hasActions?: boolean;
  actions?: Actions[];
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
  class?: string;
  key: string;
  divider?: boolean;
}
