import { RootState } from "@/src/store/store";
import { Checkbox } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { notifications } from "@mantine/notifications";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { CollectionQuery } from "../../models/collection.model";
import { EntityConfig } from "../../models/entity-config.model";
import {
  removeEntityListCollection,
  setEntityListCollection,
  setUiState,
} from "../../store/slice/entity-list/entity-list-slice";
import { useFilter } from "./useFilter";

interface UseEntityListProps<T> {
  config?: EntityConfig<T>;
  tableKey?: string;
  collectionQuery: CollectionQuery;
  items?: T[];
  total: number;
  pageSize?: number;
  initialPage?: number;
  defaultPageSize?: number;
  check?: boolean;
  onItemsSelected?: (items: T[]) => void;
  onShowArchived?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onShowSelector?: (checked: boolean) => void;
  onViewAll?: (checked: boolean) => void;
  onPaginationChange: (skip: number, top: number) => void;
  onSearch?: (value: string) => void;
  onFilterChange: (filters: any) => void;
  onOrder?: (order: { field: string; direction: "asc" | "desc" }) => void;
}

export const useEntityList = <T extends Record<string, any>>({
  config,
  tableKey,
  collectionQuery,
  items,
  // total,
  // pageSize: pageSizeProp,
  initialPage,
  defaultPageSize = 20,
  check: checkProp = false,
  onItemsSelected,
  // onShowArchived,
  onShowSelector,
  // onViewAll,
  // onPaginationChange,
  onSearch,
  onFilterChange,
  onOrder,
}: UseEntityListProps<T>) => {
  const params = useParams();
  const navigate = useRouter();
  const dispatch = useDispatch();
  const searchParams = useSearchParams();

  const [opened, { open, close }] = useDisclosure(false);

  const [printItems, setPrintItems] = useState<T[]>([]);
  const [checkedItems, setCheckedItems] = useState<T[]>([]);
  const [allChecked, setAllChecked] = useState<boolean>(false);

  const [fullScreen, setFullScreen] = useState<boolean>(true);
  const [check, setCheck] = useState<boolean>(checkProp);

  const [pageIndex, setPageIndex] = useState<number>(initialPage ?? 1);
  const [pageSize, setPageSize] = useState<number>(defaultPageSize);

  const defaultValue = useMemo<EntityConfig<T>>(
    () => ({
      rootUrl: "",
      detailUrl: "detail",
      identity: "id",
      name: "",
      visibleColumn: [],
      primaryColumn: { name: "Name", key: "name" },
      showFullScreen: true,
      showClose: true,
      hasActions: false,
      showDetail: true,
      actions: [],
    }),
    []
  );

  const [setting, setSetting] = useState<EntityConfig<T>>(defaultValue);

  const [order, setOrder] = useState<{
    field: string;
    direction: "asc" | "desc";
  }>({
    field: "",
    direction: "asc",
  });

  const collectionState = useSelector(
    (state: RootState) => state?.entityListReducer?.collections
  );

  const collection = useMemo(() => {
    return tableKey
      ? collectionState.filter((item) => item?.key === tableKey)
      : [];
  }, [collectionState, tableKey]);

  const viewAll = useSelector(
    (state: RootState) => state.entityListReducer.viewAll
  );

  const handleFilterChange = useCallback(
    (filters: any) => {
      onFilterChange?.(filters);
    },
    [onFilterChange]
  );

  const { filterValue, setFilterValue, resetFilters } = useFilter(
    [],
    handleFilterChange
  );

  const [filterMenus, setFilterMenus] = useState<any>();

  useEffect(() => {
    if (collection && collection.length > 0 && searchParams?.size === 0) {
      const collectionData = collection[0]?.collection;
      if (!collectionData) return;

      const filters: string[] = [];
      if (collectionData.filter) {
        collectionData.filter.forEach((item) => {
          item?.forEach((filter) => {
            filters.push(JSON.stringify(filter));
          });
        });

        if (filters.length > 0) {
          setFilterValue(filters);
        }
      }

      if (collectionData.orderBy && collectionData.orderBy.length > 0) {
        const orderData = collectionData.orderBy[0];
        const direction = orderData.direction;

        if (direction === "asc" || direction === "desc") {
          setOrder({
            field: orderData.field,
            direction,
          });

          if (onOrder) {
            onOrder({
              field: orderData.field,
              direction,
            });
          }
        }
      }

      if (collectionData.search && onSearch) {
        onSearch(collectionData.search);
      }
    }
  }, []);

  useEffect(() => {
    if (
      tableKey &&
      (collectionQuery?.skip !== 0 ||
        collectionQuery?.top !== defaultPageSize ||
        collectionQuery?.search ||
        (collectionQuery?.filter && collectionQuery?.filter?.length > 0) ||
        (collectionQuery?.orderBy && collectionQuery?.orderBy?.length > 0))
    ) {
      dispatch(
        setEntityListCollection({ key: tableKey, collection: collectionQuery })
      );
    }
  }, [collectionQuery, tableKey, dispatch, defaultPageSize]);

  useEffect(() => {
    if (config) {
      setSetting(() => ({
        ...defaultValue,
        ...config,
      }));
    }

    if (config?.filter && config?.filter?.length > 0) {
      const filterTemp: any[] = [];
      config.filter.forEach((item, idx) => {
        item.forEach((filter, index) => {
          filterTemp.push({
            key: filter.field + index,
            label: (
              <Checkbox value={JSON.stringify(filter)} label={filter?.name} />
            ),
          });
        });

        if (config.filter && config.filter.length !== idx + 1) {
          filterTemp.push({
            type: "divider",
          });
        }
      });

      setFilterMenus({ items: filterTemp });
    }
  }, [config, defaultValue]);
  useEffect(() => {
    setCheck(checkProp);
  }, [checkProp]);

  useEffect(() => {
    if (onShowSelector) {
      onShowSelector(check);
    }
  }, [check, onShowSelector]);

  const updateCheckedItems = useCallback(() => {
    if (allChecked && items && items.length > 0) {
      setCheckedItems(items);
      if (onItemsSelected) {
        onItemsSelected(items);
      }
    } else if (!allChecked && checkedItems.length === items?.length) {
      setCheckedItems([]);
      if (onItemsSelected) {
        onItemsSelected([]);
      }
    }
  }, [allChecked, items, onItemsSelected, checkedItems.length]);

  useEffect(() => {
    updateCheckedItems();
  }, [updateCheckedItems]);

  useEffect(() => {
    if (opened) {
      if (check && checkedItems.length === 0) {
        notifications.show({
          title: "Warning",
          message: "Please select items to export",
        });
      } else if (check) {
        setPrintItems(checkedItems);
      } else {
        setPrintItems(items || []);
      }
    }
  }, [opened, check, checkedItems, items]);

  const handleResetFilters = useCallback(() => {
    resetFilters();
    if (onSearch) onSearch("");
    if (onOrder) onOrder({ field: "", direction: "asc" });
    if (tableKey) dispatch(removeEntityListCollection(tableKey));
    dispatch(setUiState(false));
  }, [dispatch, onOrder, onSearch, resetFilters, tableKey]);

  return {
    setting,
    check,
    setCheck,
    checkedItems,
    setCheckedItems,
    allChecked,
    setAllChecked,
    pageIndex,
    setPageIndex,
    pageSize,
    setPageSize,
    order,
    setOrder,
    fullScreen,
    setFullScreen: useCallback((fs: boolean) => setFullScreen(fs), []),
    printItems,

    opened,
    open,
    close,

    filterValue,
    setFilterValue,
    filterMenus,

    viewAll,

    handleResetFilters,

    navigate,
    params,
  };
};
