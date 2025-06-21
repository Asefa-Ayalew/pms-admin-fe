export interface CollectionQuery {
  id?: string;
  search?: string;
  searchFrom?: string[];
  skip?: number;
  top?: number;
  index?: number;
  orderBy?: Order[];
  groupBy?: string[];
  filter?: Filter[][];
  select?: string[];
  count?: boolean;
  withArchived?: boolean;
  includes?: string[];
  distinct?: string[];
}

export interface DetailQuery {
  filter?: Filter[][];
  select?: string[];
}
export interface Order {
  field: string;
  direction?: "asc" | "desc";
}

export interface Filter {
  field: string;
  value?: any;
  operator?: string;
  name?: string;
}
export interface Collection<T> {
  [x: string]: any;
  count: number;
  data: T[];
}

export interface CollectionResult<T> {
  total: number;
  collectionQuery?: CollectionQuery;
  items: T[];
  isLoading: boolean;
  error?: any;
}
