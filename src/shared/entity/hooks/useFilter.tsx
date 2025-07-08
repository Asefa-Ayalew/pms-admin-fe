import { useCallback, useEffect, useRef, useState } from "react";

// interface Filter {
//   field: string;
//   name: string;
//   value?: string | number | boolean;
//   operator?: string;
// }

// type FilterValue = string[];

export const useFilter = (
  initialValues: string[] = [],
  onFilterChange?: (filters: any) => void
) => {
  const [filterValue, setFilterValue] = useState<string[]>(initialValues);

  const isInitialMount = useRef(true);

  const prevFilterValueRef = useRef<string[]>([]);

  const resetFilters = useCallback(() => {
    setFilterValue([]);
    if (onFilterChange) {
      onFilterChange([]);
    }
  }, [onFilterChange]);

  const processFilters = useCallback(
    (filters: string[]) => {
      if (!onFilterChange) return;

      if (
        JSON.stringify(filters) === JSON.stringify(prevFilterValueRef.current)
      ) {
        return;
      }

      prevFilterValueRef.current = [...filters];

      try {
        const parsedFilters = filters.map((filter) => {
          try {
            return JSON.parse(filter);
          } catch (e) {
            console.error("Error parsing filter", e);
            return {};
          }
        });

        const filtersByField: Record<string, any[]> = {};
        parsedFilters.forEach((filter) => {
          if (filter.field) {
            if (!filtersByField[filter.field]) {
              filtersByField[filter.field] = [];
            }
            filtersByField[filter.field].push(filter);
          }
        });

        const finalFilters = Object.values(filtersByField).map(
          (fieldFilters) => [fieldFilters]
        );

        onFilterChange(finalFilters);
      } catch (error) {
        console.error("Error processing filters:", error);
      }
    },
    [onFilterChange]
  );

  const handleSetFilterValue = useCallback((newFilters: string[]) => {
    setFilterValue(newFilters);
  }, []);

  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }

    if (filterValue.length > 0 || prevFilterValueRef.current.length > 0) {
      processFilters(filterValue);
    }
  }, [filterValue, processFilters]);

  return {
    filterValue,
    setFilterValue: handleSetFilterValue,
    resetFilters,
  };
};
