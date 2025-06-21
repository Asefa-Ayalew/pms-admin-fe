import { useDisclosure } from "@mantine/hooks";
import {
  ReactElement,
  ReactNode,
  RefObject,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useDispatch } from "react-redux";
import { setUiState } from "../store/slice/entity-list/entity-list-slice";

import { CollectionQuery } from "../models/collection.model";
import { EntityConfig, entityViewMode } from "../models/entity-config.model";

import {
  ActionIcon,
  Box,
  Checkbox,
  Flex,
  Group,
  MantineColor,
  Pagination,
  Paper,
  Select,
  TextInput,
  Tooltip,
} from "@mantine/core";
import {
  IconChevronRight,
  IconEdit,
  IconFilter,
  IconPlus,
  IconRefresh,
  IconSearch,
  IconTrash,
} from "@tabler/icons-react";
import {
  MantineReactTable,
  MRT_TableOptions,
  useMantineReactTable,
  type MRT_ColumnDef,
  type MRT_Row,
} from "mantine-react-table";

import { EntityDetailView } from "./components/EntityDetailView";
import EntityListHeader from "./components/EntityListHeader";
import EntityPrintModal from "./components/EntityPrintModal";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEntityList } from "./hooks/useEntityList";
import { useExport } from "./hooks/useExport";

type FunctionType = (args: any) => void;

export type DataLoadMode = "static" | "rtk-query" | "custom";

export interface TableStyleConfig {
  headerBackgroundColor?: MantineColor;
  rowHoverColor?: string;
  borderRadius?: string;
  borderColor?: string;
  primaryColor?: MantineColor;
  secondaryColor?: MantineColor;
  dangerColor?: MantineColor;
  fontSize?: "xs" | "sm" | "md";
  density?: "xs" | "sm" | "md";
  shadowLevel?: "xs" | "sm" | "md" | "lg" | "xl";
}

export interface TableBehaviorConfig {
  enableColumnFilters?: boolean;
  enableGlobalFilter?: boolean;
  enableColumnResizing?: boolean;
  enableFullScreenToggle?: boolean;
  enableDensityToggle?: boolean;
  enableColumnOrdering?: boolean;
  enablePagination?: boolean;
  enableMultiSort?: boolean;
  enablePinning?: boolean;
  enableRowSelection?: boolean;
  enableMultiRowSelection?: boolean;
  manualFiltering?: boolean;
  manualPagination?: boolean;
  manualSorting?: boolean;
  paginationDisplayMode?: "default" | "pages";
  positionPagination?: "bottom" | "top" | "both";
  positionToolbarAlertBanner?: "bottom" | "top" | "none";
  positionActionsColumn?: "first" | "last";
  enableHiding?: boolean;
  showColumnToggleModal?: boolean;
}

export interface CustomToolbarAction {
  key: string;
  label: string;
  icon?: React.ReactNode;
  variant?:
    | "filled"
    | "outline"
    | "light"
    | "subtle"
    | "default"
    | "transparent"
    | "white";
  color?: MantineColor;
  onClick: () => void;
  visible?: boolean;
  disabled?: boolean;
  tooltip?: string;
  position?: "top" | "bottom";
  order?: number;
}

export interface DetailTableConfig {
  singleColumn?: boolean;
  showHeader?: boolean;
  density?: "xs" | "sm" | "md";
  enablePagination?: boolean;
  pageSize?: number;
  highlightSelected?: boolean;
  height?: string | number;
  borderless?: boolean;
  compactPagination?: boolean;
  paginationSize?: "xs" | "sm" | "md";
}

interface Props<T extends Record<string, any>> {
  config?: EntityConfig<T>;
  tableKey?: string;
  title: string | ReactElement<any>;

  detail?: ReactNode;
  detailWidth?: number | string;
  detailTitle?: string;

  dataLoadMode?: DataLoadMode;
  items?: T[];
  total?: number;
  selectedItem?: T;
  itemsLoading?: boolean;

  defaultPageSize?: number;
  initialPage?: number;
  pageSizeOptions?: number[];
  _showTotal?: boolean;

  viewMode?: entityViewMode;
  check?: boolean;
  showNewButton?: boolean;
  showNewModal?: boolean;
  newButtonText?: string;
  showExport?: boolean;
  showArchived?: boolean;
  showSelector?: boolean;
  parentStyle?: string;
  styleConfig?: TableStyleConfig;
  behaviorConfig?: TableBehaviorConfig;

  collectionQuery?: CollectionQuery;

  header?: string;
  loading?: boolean;
  noDataText?: string;
  errorText?: string;

  fetchData?: (query: CollectionQuery) => void;
  useQueryHook?: any;
  queryOptions?: any;

  onItemsSelected?: FunctionType;
  onShowArchived?: FunctionType;
  onShowSelector?: FunctionType;
  onViewAll?: FunctionType;
  onDetail?: FunctionType;
  onPaginationChange?: (skip: number, top: number) => void;
  onSearch?: FunctionType;
  onFilterChange?: FunctionType;
  onOrder?: (order: { field: string; direction: "asc" | "desc" }) => void;
  printModalChange?: FunctionType;
  exportExcelChange?: FunctionType;
  hasGenerateButton?: boolean;
  onGenerateButton?: FunctionType;
  handleAction?: (action: { key: string }, item: T) => void;
  handleNewModal?: () => void;
  hideToolbar?: boolean;
  onRefresh?: () => void;

  renderCustomTopToolbar?: () => ReactNode;
  renderCustomBottomToolbar?: () => ReactNode;
  renderNoDataComponent?: () => ReactNode;
  renderLoadingComponent?: () => ReactNode;
  renderErrorComponent?: (error: any) => ReactNode;

  customActions?: CustomToolbarAction[];
  topActions?: CustomToolbarAction[];
  bottomActions?: CustomToolbarAction[];
  showCustomActionsPosition?: "top" | "bottom" | "both";

  renderCustomLeftToolbar?: () => ReactNode;
  renderCustomRightToolbar?: () => ReactNode;

  detailTableConfig?: DetailTableConfig;
}

const CustomPagination = <
  TData extends Record<string, any> = Record<string, any>,
>({
  table,
  pageIndex,
  pageSize,
  total,
  pageSizeOptions,
  onPaginationChange,
  primaryColor = "blue",
  compactDisplay = false,
}: {
  table: {
    getState: () => {
      pagination: { pageIndex: number; pageSize: number };
      globalFilter: string;
    };
    setGlobalFilter: (value: string) => void;
    setShowColumnFilters: (show: boolean) => void;
    getPrePaginationRowModel: () => { rows: Array<any> };
  };
  pageIndex: number;
  pageSize: number;
  total: number;
  pageSizeOptions: number[];
  onPaginationChange: (pageIndex: number, pageSize: number) => void;
  primaryColor?: MantineColor;
  compactDisplay?: boolean;
}) => {
  const totalPages = Math.ceil(total / pageSize);

  return (
    <Flex justify="space-between" align="center" gap="md" className="px-2 py-2">
      <div className="text-sm text-gray-500">
        {total > 0
          ? `Showing ${(pageIndex - 1) * pageSize + 1}-${Math.min(pageIndex * pageSize, total)} of ${total}`
          : "No records"}
      </div>

      <Group>
        {!compactDisplay && (
          <Select
            size="xs"
            value={pageSize.toString()}
            data={pageSizeOptions.map((size) => ({
              value: size.toString(),
              label: size.toString(),
            }))}
            onChange={(value) =>
              onPaginationChange(1, parseInt(value || pageSize.toString()))
            }
            style={{ width: "80px" }}
          />
        )}

        <Pagination
          value={pageIndex}
          onChange={(page) => onPaginationChange(page, pageSize)}
          total={totalPages}
          color={primaryColor}
          withEdges
          size={compactDisplay ? "xs" : "sm"}
          boundaries={compactDisplay ? 1 : 2}
          siblings={compactDisplay ? 0 : 1}
        />
      </Group>
    </Flex>
  );
};

export default function EntityList<T extends Record<string, any>>(
  props: Props<T>
) {
  const {
    detailWidth = { list: "md:w-3/12", content: "md:w-9/12" },
    viewMode: externalViewMode,
    detail,
    items: externalItems = [],
    config,
    tableKey,
    title,

    dataLoadMode = "rtk-query",
    itemsLoading: externalLoading = false,
    total: externalTotal,
    _showTotal,

    onPaginationChange: externalPaginationChange,
    onSearch: externalSearch,
    onShowArchived,
    onShowSelector,
    onFilterChange: externalFilterChange,
    onOrder: externalOrder,
    onItemsSelected,
    onViewAll,
    onDetail: externalDetail,

    detailTitle,

    showNewButton = true,
    showNewModal = false,
    newButtonText = "New",
    showArchived = true,
    header,
    parentStyle,
    showExport,
    showSelector = false,
    collectionQuery: initialCollectionQuery,
    hasGenerateButton,
    onGenerateButton,
    handleAction: externalHandleAction,
    handleNewModal,
    initialPage = 1,
    defaultPageSize = 20,
    pageSizeOptions = [10, 20, 30, 50, 100],
    check: checkProp,
    hideToolbar = false,
    onRefresh: externalRefresh,

    styleConfig = {
      headerBackgroundColor: "blue",
      primaryColor: "blue",
      dangerColor: "red",
      fontSize: "sm",
      density: "xs",
      shadowLevel: "xs",
    },
    behaviorConfig = {
      enableColumnFilters: true,
      enableGlobalFilter: true,
      enableColumnResizing: true,
      enableFullScreenToggle: true,
      enableDensityToggle: true,
      enableColumnOrdering: true,
      enablePagination: true,
      manualFiltering: true,
      manualPagination: true,
      manualSorting: true,
      paginationDisplayMode: "default",
      positionPagination: "bottom",
      positionToolbarAlertBanner: "top",
      positionActionsColumn: "last",
      enableHiding: true,
    },

    noDataText = "No records found",
    errorText = "Error loading data",
    renderCustomTopToolbar,
    renderCustomBottomToolbar,
    renderNoDataComponent,
    renderLoadingComponent,
    renderErrorComponent,

    fetchData,
    useQueryHook,
    queryOptions,

    customActions,
    topActions,
    bottomActions,
    showCustomActionsPosition,

    renderCustomLeftToolbar,
    renderCustomRightToolbar,

    detailTableConfig = {
      singleColumn: true,
      showHeader: true,
      density: "xs",
      enablePagination: true,
      pageSize: 10,
      highlightSelected: true,
      height: "auto",
      borderless: false,
      compactPagination: true,
      paginationSize: "xs",
    },
  } = props;

  const router = useRouter();
  const params = useParams();
  const dispatch = useDispatch();

  const [viewMode, setViewMode] = useState<entityViewMode>(
    externalViewMode || "list"
  );
  const [collection, setCollection] = useState<CollectionQuery>({
    skip: (initialPage - 1) * defaultPageSize,
    top: defaultPageSize,
    orderBy: [{ field: "createdAt", direction: "desc" }],
    ...initialCollectionQuery,
  });

  const [error, setError] = useState<any>(null);

  const [tableDensity, setTableDensity] = useState<"xs" | "sm" | "md">(
    styleConfig.density || "xs"
  );

  useEffect(() => {
    if (styleConfig.density) {
      setTableDensity(styleConfig.density);
    }
  }, [styleConfig.density]);

  const sortedTopActions = useMemo(() => {
    const actions = [
      ...(topActions || []),
      ...(customActions?.filter((a) => !a.position || a.position === "top") ||
        []),
    ];

    return actions
      .filter((action) => action.visible !== false)
      .sort((a, b) => (a.order || 0) - (b.order || 0));
  }, [topActions, customActions]);

  const sortedBottomActions = useMemo(() => {
    const actions = [
      ...(bottomActions || []),
      ...(customActions?.filter((a) => a.position === "bottom") || []),
    ];

    return actions
      .filter((action) => action.visible !== false)
      .sort((a, b) => (a.order || 0) - (b.order || 0));
  }, [bottomActions, customActions]);

  const rtqQueryResult = useMemo(() => {
    if (dataLoadMode === "rtk-query") {
      if (useQueryHook) {
        return useQueryHook({
          ...queryOptions,
          ...(fetchData ? {} : { collection }),
        });
      } else if (fetchData) {
        return {
          data: { data: externalItems, count: externalTotal },
          isLoading: externalLoading,
          error: null,
        };
      }
    }

    return {
      data: { data: externalItems, count: externalItems.length },
      isLoading: externalLoading,
      error: null,
    };
  }, [
    dataLoadMode,
    useQueryHook,
    queryOptions,
    fetchData,
    collection,
    externalItems,
    externalTotal,
    externalLoading,
  ]);

  const items = rtqQueryResult?.data?.data || externalItems;
  const total =
    rtqQueryResult?.data?.count || externalTotal || items.length || 0;
  const itemsLoading = rtqQueryResult?.isLoading || externalLoading;
  const queryError = rtqQueryResult?.error;

  useEffect(() => {
    if (queryError) {
      setError(queryError);
    }
  }, [queryError]);

  const [opened, { open, close }] = useDisclosure(false);

  useEffect(() => {
    if (params?.id) {
      setViewMode("detail");
    } else if (externalViewMode !== undefined) {
      setViewMode(externalViewMode);
    } else {
      setViewMode("list");
    }
  }, [params?.id, externalViewMode]);

  useEffect(() => {
    if (dataLoadMode === "rtk-query" && fetchData) {
      fetchData(collection);
    }
  }, [collection, fetchData, dataLoadMode]);

  const handlePaginationChange = useCallback(
    (pageIndex: number, pageSize: number) => {
      if (externalPaginationChange) {
        externalPaginationChange(pageIndex, pageSize);
      } else {
        setCollection((prev) => ({
          ...prev,
          skip: pageIndex > 0 ? (pageIndex - 1) * pageSize : 0,
          top: pageSize,
        }));
      }
    },
    [externalPaginationChange]
  );

  const handleOrderChange = useCallback(
    (orderData: { field: string; direction: "asc" | "desc" }) => {
      if (externalOrder) {
        externalOrder(orderData);
      } else {
        setCollection((prev) => ({
          ...prev,
          orderBy: [orderData],
        }));
      }
    },
    [externalOrder]
  );

  const handleSearch = useCallback(
    (searchTerm: string) => {
      if (externalSearch) {
        externalSearch(searchTerm);
      } else if (config) {
        setCollection((prev: CollectionQuery) => ({
          ...prev,
          search: searchTerm,
          searchFrom: config.visibleColumn
            .map((col) => col.key)
            .filter((key) => key !== "id" && key !== "createdAt") as string[],
          skip: 0,
        }));
      }
    },
    [externalSearch, config]
  );

  const handleFilterChange = useCallback(
    (filters: any) => {
      if (externalFilterChange) {
        externalFilterChange(filters);
      } else {
        const formattedFilters = Array.isArray(filters) ? filters : [];

        setCollection((prev) => ({
          ...prev,
          filter: formattedFilters,
          skip: 0,
        }));
      }
    },
    [externalFilterChange]
  );

  const handleRefresh = useCallback(() => {
    if (externalRefresh) {
      externalRefresh();
    } else if (dataLoadMode === "rtk-query" && fetchData) {
      fetchData(collection);
    } else {
      setCollection((prev) => ({ ...prev }));
    }

    setError(null);
  }, [externalRefresh, fetchData, collection, dataLoadMode]);

  const handleAction = useCallback(
    (action: { key: string }, item: T) => {
      if (externalHandleAction) {
        externalHandleAction(action, item);
      } else if (config) {
        if (action.key === "edit") {
          const identity =
            typeof config.identity === "string"
              ? item[config.identity]
              : "id" in item
                ? item.id
                : "";
          router.push(`${config.rootUrl}/${identity}/edit`);
        } else if (action.key === "delete") {
          console.log("Delete item:", item);
        }
      }
    },
    [externalHandleAction, config, router]
  );

  const handleDetail = useCallback(
    (item: T) => {
      if (externalDetail) {
        externalDetail(item);
      } else if (config) {
        const identity =
          typeof config.identity === "string"
            ? item[config.identity]
            : "id" in item
              ? item.id
              : "";

        const detailPath = config.detailUrl
          ? `${config.rootUrl}/${config.detailUrl}/${identity}`
          : `${config.rootUrl}/${identity}`;

        router.push(detailPath);
      }
    },
    [externalDetail, config, router]
  );

  const handleShowArchived = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (onShowArchived) {
        onShowArchived(e);
      } else {
        setCollection((prev) => ({
          ...prev,
          withArchived: e.target.checked,
          skip: 0,
        }));
      }
    },
    [onShowArchived]
  );

  const handleViewAll = useCallback(
    (checked: boolean) => {
      if (onViewAll) {
        onViewAll(checked);
      }
      dispatch(setUiState(checked));
    },
    [onViewAll, dispatch]
  );

  const {
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
    setFullScreen,
    filterValue,
    setFilterValue,
    filterMenus,
    viewAll,
    handleResetFilters,
    navigate,
  } = useEntityList<T>({
    config,
    tableKey,
    collectionQuery: collection,
    items,
    total,
    initialPage,
    defaultPageSize,
    check: checkProp,
    onItemsSelected,
    onShowArchived: handleShowArchived,
    onShowSelector,
    onViewAll: handleViewAll,
    onPaginationChange: handlePaginationChange,
    onSearch: handleSearch,
    onFilterChange: handleFilterChange,
    onOrder: handleOrderChange,
  });

  const { exportToExcel, exportDropdown, pdfRef } = useExport<T>({
    title,
    setting,
    check,
    checkedItems,
    items,
  });

  const getIdentityValue = useCallback(
    (item: T): string | number => {
      if (!item) return "";
      const identity = setting?.identity || "id";

      if (typeof identity === "string") {
        return String(item[identity] || "");
      } else if (Array.isArray(identity)) {
        let result = item;
        for (const key of identity) {
          if (result && typeof result === "object" && key in result) {
            result = result[key];
          } else {
            return "";
          }
        }
        return String(result || "");
      }
      return "";
    },
    [setting?.identity]
  );

  const columns = useMemo<MRT_ColumnDef<T>[]>(() => {
    if (!setting?.visibleColumn) return [];

    return setting.visibleColumn
      .filter((col) => col.hide !== true)
      .map((col) => {
        const accessorKey = Array.isArray(col.key)
          ? col.key.join(".")
          : col.key;

        return {
          accessorKey,
          header: col.name || "",
          enableSorting: !col.hideSort,

          Cell: col.render ? ({ row }) => col.render!(row.original) : undefined,

          sortingFn: col.isDate ? "datetime" : undefined,

          enableColumnFilter: behaviorConfig.enableColumnFilters,
          enableResizing: behaviorConfig.enableColumnResizing,
          enableHiding: behaviorConfig.enableHiding,
        };
      });
  }, [setting?.visibleColumn, behaviorConfig]);

  const tableOptions = useMemo(
    () => ({
      columns,
      data: items,
      enableRowSelection: check,
      enableMultiRowSelection: behaviorConfig.enableMultiRowSelection !== false,
      enableColumnFilters: behaviorConfig.enableColumnFilters !== false,
      enableGlobalFilter: behaviorConfig.enableGlobalFilter !== false,
      enablePagination: behaviorConfig.enablePagination !== false,
      manualPagination: behaviorConfig.manualPagination !== false,
      manualSorting: behaviorConfig.manualSorting !== false,
      manualFiltering: behaviorConfig.manualFiltering !== false,
      rowCount: total,
      enableRowActions: setting?.hasActions || setting?.showDetail,
      positionActionsColumn: behaviorConfig.positionActionsColumn || "last",
      enableDensityToggle: behaviorConfig.enableDensityToggle !== false,
      enableFullScreenToggle: behaviorConfig.enableFullScreenToggle !== false,
      enableColumnResizing: behaviorConfig.enableColumnResizing !== false,
      enableGrouping: true,
      enableColumnOrdering: behaviorConfig.enableColumnOrdering !== false,
      enableColumnDragging: true,
      enableMultiSort: behaviorConfig.enableMultiSort,
      enablePinning: behaviorConfig.enablePinning,
      enableRowVirtualization: total > 100,
      layoutMode: "semantic" as const,
      enableStickyHeader: true,
      onRowSelectionChange: (updater: any) => {
        const newSelectedRows =
          typeof updater === "function"
            ? updater(table.getState().rowSelection || {})
            : updater;

        const selectedRowsData = Object.keys(newSelectedRows)
          .filter((key) => newSelectedRows[key])
          .map((key) => items[Number.parseInt(key)]);

        setCheckedItems(selectedRowsData);
        setAllChecked(
          selectedRowsData.length === items.length && items.length > 0
        );

        if (onItemsSelected) {
          onItemsSelected(selectedRowsData);
        }
      },

      ...(viewMode === "detail" && {
        enableTopToolbar: detailTableConfig.showHeader,
        enableBottomToolbar: detailTableConfig.enablePagination,
        enableColumnFilters: false,
        enableGlobalFilter: false,
        enableColumnResizing: false,
        enableFullScreenToggle: false,
        enableDensityToggle: false,
        enableColumnOrdering: false,
        enablePagination: detailTableConfig.enablePagination,
        enableColumnActions: false,
        mantinePaperProps: {
          withBorder: !detailTableConfig.borderless,
          shadow: "none",
          style: {
            height: detailTableConfig.height,
          },
        },
      }),

      renderPagination: () => {
        if (!behaviorConfig.enablePagination) return null;

        return (
          <CustomPagination
            table={table}
            pageIndex={pageIndex}
            pageSize={pageSize}
            total={total}
            pageSizeOptions={pageSizeOptions}
            onPaginationChange={handlePaginationChange}
            primaryColor={styleConfig.primaryColor}
            compactDisplay={viewMode === "detail"}
          />
        );
      },

      paginationDisplayMode: "custom" as any,
      positionPagination: behaviorConfig.positionPagination || "bottom",

      state: {
        pagination: {
          pageIndex: pageIndex - 1,
          pageSize:
            viewMode === "detail"
              ? detailTableConfig.pageSize || pageSize
              : pageSize,
        },
        sorting: order
          ? [
              {
                id: order.field,
                desc: order.direction === "desc",
              },
            ]
          : [],
        density:
          viewMode === "detail" ? detailTableConfig.density : tableDensity,
        isLoading: itemsLoading,
        columnVisibility:
          viewMode === "detail" &&
          detailTableConfig.singleColumn &&
          setting?.primaryColumn
            ? Object.fromEntries(
                setting.visibleColumn?.map((col) => [
                  Array.isArray(col.key) ? col.key.join(".") : col.key,
                  col.key === setting.primaryColumn.key,
                ]) || []
              )
            : {},
        rowSelection: allChecked
          ? Object.fromEntries(items.map((_: any, index: any) => [index, true]))
          : Object.fromEntries(
              checkedItems
                .map((item) => {
                  const index = items.findIndex(
                    (i: any) => getIdentityValue(i) === getIdentityValue(item)
                  );
                  return [index, index >= 0];
                })
                .filter(([index]) => index >= 0)
            ),
      },

      initialState: {
        pagination: {
          pageIndex: initialPage - 1,
          pageSize:
            viewMode === "detail"
              ? detailTableConfig.pageSize || defaultPageSize
              : defaultPageSize,
        },
        density:
          viewMode === "detail" ? detailTableConfig.density : tableDensity,
        columnVisibility:
          viewMode === "detail" &&
          detailTableConfig.singleColumn &&
          setting?.primaryColumn
            ? Object.fromEntries(
                setting.visibleColumn?.map((col) => [
                  Array.isArray(col.key) ? col.key.join(".") : col.key,
                  col.key === setting.primaryColumn.key,
                ]) || []
              )
            : {},
      },

      muiToolbarAlertBannerProps: error
        ? {
            color: "error",
            children: errorText || String(error),
          }
        : undefined,

      positionToolbarAlertBanner:
        behaviorConfig.positionToolbarAlertBanner || "top",

      renderTopToolbarCustomActions: () => {
        if (
          sortedTopActions.length === 0 &&
          !renderCustomLeftToolbar &&
          !renderCustomTopToolbar
        ) {
          return null;
        }

        if (renderCustomTopToolbar) {
          return renderCustomTopToolbar();
        }

        return (
          <Group gap="xs" ml="md" align="center" wrap="nowrap">
            {renderCustomLeftToolbar ? (
              renderCustomLeftToolbar()
            ) : (
              <Group gap="xs" wrap="nowrap">
                {sortedTopActions.map((action) => (
                  <Tooltip
                    key={action.key}
                    label={action.tooltip || action.label}
                    disabled={!action.tooltip}
                  >
                    <ActionIcon
                      color={action.color || styleConfig.primaryColor || "blue"}
                      variant={action.variant || "filled"}
                      onClick={action.onClick}
                      disabled={action.disabled}
                      aria-label={action.label}
                    >
                      {action.icon || null}
                    </ActionIcon>
                  </Tooltip>
                ))}

                <Tooltip label="Refresh data">
                  <ActionIcon
                    color={styleConfig.primaryColor || "blue"}
                    variant="filled"
                    onClick={handleRefresh}
                    loading={itemsLoading}
                    aria-label="Refresh data"
                  >
                    <IconRefresh size={18} />
                  </ActionIcon>
                </Tooltip>

                {showNewButton && (
                  <Tooltip label={`Create new ${newButtonText}`}>
                    <ActionIcon
                      color={styleConfig.primaryColor || "blue"}
                      variant="filled"
                      component={Link}
                      href={`${setting?.rootUrl}/new`}
                      aria-label={`Create new ${newButtonText}`}
                    >
                      <IconPlus size={18} />
                    </ActionIcon>
                  </Tooltip>
                )}
              </Group>
            )}
          </Group>
        );
      },

      renderBottomToolbarCustomActions: () => {
        if (viewMode === "detail") {
          return null;
        }

        if (
          sortedBottomActions.length === 0 &&
          !renderCustomRightToolbar &&
          !renderCustomBottomToolbar
        ) {
          return null;
        }

        if (renderCustomBottomToolbar) {
          return renderCustomBottomToolbar();
        }

        return (
          <Group gap="xs" mr="md" wrap="nowrap">
            {renderCustomRightToolbar ? (
              renderCustomRightToolbar()
            ) : (
              <Group gap="xs" wrap="nowrap">
                {sortedBottomActions.map((action) => (
                  <Tooltip
                    key={action.key}
                    label={action.tooltip || action.label}
                    disabled={!action.tooltip}
                  >
                    <ActionIcon
                      color={action.color || styleConfig.primaryColor || "blue"}
                      variant={action.variant || "filled"}
                      onClick={action.onClick}
                      disabled={action.disabled}
                      aria-label={action.label}
                    >
                      {action.icon || null}
                    </ActionIcon>
                  </Tooltip>
                ))}
              </Group>
            )}
          </Group>
        );
      },

      renderEmptyRowsFallback:
        renderNoDataComponent ||
        (() => (
          <div className="flex justify-center items-center p-4">
            <p className="text-gray-500">{noDataText}</p>
          </div>
        )),

      renderRowActionMenuItems: ({ row }: { row: MRT_Row<T> }) => {
        if (setting?.hasActions) {
          return setting.actions?.map((action) => ({
            key: action.key,
            label: action.label,
            icon:
              action.icon === "IconEdit" ? (
                <IconEdit size={16} />
              ) : action.icon === "IconTrash" ? (
                <IconTrash size={16} />
              ) : null,
            onClick: () => handleAction(action, row.original),
            color:
              action.type === "danger"
                ? styleConfig.dangerColor || "red"
                : undefined,
          }));
        }
        return [];
      },

      renderRowActions: ({ row }: { row: MRT_Row<T> }) => {
        if (setting?.hasActions) {
          return (
            <Group gap="xs" wrap="nowrap">
              {setting.actions?.map((action) => {
                const IconComponent =
                  action.icon === "IconEdit"
                    ? IconEdit
                    : action.icon === "IconTrash"
                      ? IconTrash
                      : null;

                return (
                  <ActionIcon
                    key={action.key}
                    size="sm"
                    variant="light"
                    color={
                      action.type === "danger"
                        ? styleConfig.dangerColor || "red"
                        : styleConfig.primaryColor || "blue"
                    }
                    onClick={() => handleAction(action, row.original)}
                    aria-label={action.label}
                  >
                    {IconComponent && <IconComponent size={16} />}
                  </ActionIcon>
                );
              })}

              {setting?.showDetail && (
                <ActionIcon
                  size="sm"
                  variant="light"
                  color={styleConfig.primaryColor || "blue"}
                  onClick={() => handleDetail(row.original)}
                  aria-label="View details"
                >
                  <IconChevronRight />
                </ActionIcon>
              )}
            </Group>
          );
        } else if (setting?.showDetail) {
          return (
            <ActionIcon
              size="sm"
              variant="light"
              color={styleConfig.primaryColor || "blue"}
              onClick={() => handleDetail(row.original)}
              aria-label="View details"
            >
              <IconChevronRight />
            </ActionIcon>
          );
        }

        return null;
      },

      onPaginationChange: (updater: any) => {
        const newPaginationState =
          typeof updater === "function"
            ? updater({ pageIndex: pageIndex - 1, pageSize })
            : updater;

        const newPageIndex = newPaginationState.pageIndex + 1;
        setPageIndex(newPageIndex);
        handlePaginationChange(newPageIndex, newPaginationState.pageSize);
      },

      onSortingChange: (updater: any) => {
        const newSorting =
          typeof updater === "function" ? updater([]) : updater;

        if (newSorting.length > 0) {
          const sortedColumn = newSorting[0];
          const newOrder = {
            field: sortedColumn.id,
            direction: sortedColumn.desc ? "desc" : ("asc" as "desc" | "asc"),
          };
          setOrder(newOrder);
          handleOrderChange(newOrder);
        }
      },

      onGlobalFilterChange: (value: string) => {
        handleSearch(value);
      },

      onColumnFiltersChange: (updater: any) => {
        const newFilters =
          typeof updater === "function" ? updater([]) : updater;

        if (newFilters && newFilters.length > 0) {
          const formattedFilters = newFilters.map((filter: any) => [
            {
              field: filter.id,
              name: filter.id,
              value: filter.value,
              operator: "LIKE",
            },
          ]);

          const newFilterValue = formattedFilters
            .flat()
            .map((f: any) => JSON.stringify(f));

          if (JSON.stringify(newFilterValue) !== JSON.stringify(filterValue)) {
            setFilterValue(newFilterValue);

            handleFilterChange(formattedFilters);
          }
        } else if (filterValue.length > 0) {
          setFilterValue([]);
          handleFilterChange([]);
        }
      },

      mantineTableBodyCellProps: ({ cell }: any) => ({
        onDoubleClick: setting?.showDetail
          ? () => {
              if (setting?.showDetail) {
                handleDetail(cell.row.original);
              }
            }
          : undefined,
        style: {
          cursor: setting?.showDetail ? "pointer" : "default",
        },
      }),

      onDensityChange: (newDensity: "xs" | "sm" | "md") => {
        setTableDensity(newDensity);
      },
    }),
    [
      columns,
      items,
      check,
      behaviorConfig,
      setting,
      total,
      styleConfig,
      error,
      errorText,
      pageIndex,
      pageSize,
      order,
      itemsLoading,
      initialPage,
      defaultPageSize,
      viewMode,
      handleRefresh,
      showNewButton,
      newButtonText,
      navigate,
      renderCustomTopToolbar,
      renderCustomBottomToolbar,
      renderNoDataComponent,
      noDataText,
      handleAction,
      handleDetail,
      handlePaginationChange,
      handleOrderChange,
      handleSearch,
      filterValue,
      setFilterValue,
      handleFilterChange,
      sortedTopActions,
      sortedBottomActions,
      renderCustomLeftToolbar,
      renderCustomRightToolbar,
      tableDensity,
      detailTableConfig,
      pageSizeOptions,
    ]
  );

  const table = useMantineReactTable(tableOptions as MRT_TableOptions<T>);

  const cssStyles = `
    <style>
      .mantine-table-optimized th,
      .mantine-table-optimized td {
        will-change: transform;
      }
      
      .mantine-table-optimized .mantine-Menu-dropdown {
        will-change: opacity, transform;
        transition: opacity 150ms ease, transform 150ms ease;
        transform-origin: top center;
      }
      
      .mantine-table-optimized .mantine-TableScrollContainer-root {
        contain: content;
      }
      
      /* Use hardware acceleration for animations */
      .mantine-table-optimized .mantine-ActionIcon-root {
        transform: translateZ(0);
        backface-visibility: hidden;
        perspective: 1000px;
      }
    </style>
  `;

  useEffect(() => {
    if (!document.getElementById("mantine-table-optimized-styles")) {
      const styleElement = document.createElement("div");
      styleElement.id = "mantine-table-optimized-styles";
      styleElement.innerHTML = cssStyles;
      document.head.appendChild(styleElement);

      return () => {
        const styleToRemove = document.getElementById(
          "mantine-table-optimized-styles"
        );
        if (styleToRemove) {
          document.head.removeChild(styleToRemove);
        }
      };
    }
  }, []);

  return (
    <div className={`h-full flex space-x-2 relative p-2 ${parentStyle}`}>
      <div
        className={`flex-col space-y-2 ${
          viewMode !== "detail"
            ? "w-full"
            : !fullScreen
              ? typeof detailWidth === "object" && "list" in detailWidth
                ? detailWidth.list
                : ""
              : "hidden"
        }`}
      >
        <Paper shadow={styleConfig.shadowLevel || "xs"} p="md" radius="md">
          <EntityListHeader
            title={title}
            showArchived={showArchived && viewMode !== "detail"}
            viewAll={viewAll}
            filterValueLength={filterValue.length}
            showExport={showExport !== false && viewMode !== "detail"}
            tableKey={tableKey}
            header={header}
            onResetFilters={handleResetFilters}
            onViewAll={handleViewAll}
            onShowArchived={handleShowArchived}
            exportDropdown={exportDropdown}
            primaryColor={styleConfig.primaryColor || "blue"}
          />
        </Paper>

        {!hideToolbar && (
          <Paper shadow={styleConfig.shadowLevel || "xs"} p="md" radius="md">
            <Flex justify="space-between" align="center">
              <Group>
                {showNewButton && (
                  <Box
                    component={Link}
                    href={`${setting?.rootUrl}/new`}
                    className={`bg-${styleConfig.primaryColor || "blue"}-500 hover:bg-${styleConfig.primaryColor || "blue"}-600 text-white py-2 px-4 rounded flex items-center space-x-2`}
                  >
                    <IconPlus size={16} />
                    <span>{newButtonText}</span>
                  </Box>
                )}

                {hasGenerateButton && checkedItems.length > 0 && (
                  <Box
                    component="button"
                    onClick={() => onGenerateButton?.(checkedItems)}
                    className={`bg-${styleConfig.primaryColor || "blue"}-500 hover:bg-${styleConfig.primaryColor || "blue"}-600 text-white py-2 px-4 rounded`}
                  >
                    Generate
                  </Box>
                )}
              </Group>

              <Group>
                <Box
                  className="relative"
                  style={{ width: viewMode === "detail" ? "100%" : "320px" }}
                >
                  <TextInput
                    type="text"
                    placeholder="Search here"
                    className="pl-10 w-full border-gray-300 rounded"
                    onChange={(e) => {
                      const value = e.target.value;

                      if (value !== table.getState().globalFilter) {
                        table.setGlobalFilter(value);
                      }
                    }}
                    defaultValue={table.getState().globalFilter || ""}
                    variant="filled"
                    size="sm"
                    rightSection={<IconSearch size={16} />}
                    rightSectionWidth={42}
                    styles={{
                      input: {
                        paddingRight: "42px",
                      },
                    }}
                    classNames={{
                      input: "pl-10",
                    }}
                  />
                </Box>

                {filterMenus && (
                  <ActionIcon
                    variant="filled"
                    color={styleConfig.primaryColor || "blue"}
                    onClick={() =>
                      table.setShowColumnFilters(
                        !table.getState().showColumnFilters
                      )
                    }
                    aria-label="Filter"
                  >
                    <IconFilter size={16} />
                  </ActionIcon>
                )}

                {showSelector && viewMode !== "detail" && (
                  <Checkbox
                    label="Select rows"
                    checked={check}
                    onChange={() => {
                      if (check) {
                        setAllChecked(!check);
                        setCheck(!check);
                      } else {
                        setCheck(!check);
                      }
                      onShowSelector?.(!check);
                    }}
                  />
                )}
              </Group>
            </Flex>
          </Paper>
        )}

        <Paper
          shadow={styleConfig.shadowLevel || "xs"}
          radius="md"
          className={`border ${styleConfig.borderColor || "border-gray-200"}`}
          style={{
            fontSize:
              styleConfig.fontSize === "xs"
                ? "0.75rem"
                : styleConfig.fontSize === "sm"
                  ? "0.875rem"
                  : "1rem",
          }}
        >
          <div className="mantine-table-optimized">
            <MantineReactTable table={table} />
          </div>
        </Paper>
      </div>

      {viewMode === "detail" && (
        <div
          className={`${
            fullScreen
              ? "w-full -px-4"
              : typeof detailWidth === "object" && "content" in detailWidth
                ? detailWidth.content
                : ""
          } flex-col space-y-2 px-2 h-full`}
        >
          <Paper
            shadow={styleConfig.shadowLevel || "xs"}
            p="md"
            radius="md"
            className="h-full flex flex-col"
          >
            <EntityDetailView
              detailTitle={detailTitle}
              title={title as string}
              rootUrl={setting?.rootUrl}
              detail={detail}
              fullScreen={fullScreen}
              setFullScreen={setFullScreen}
              primaryColor={styleConfig.primaryColor || "blue"}
            />
          </Paper>
        </div>
      )}

      <EntityPrintModal
        opened={opened}
        onClose={close}
        printItems={check ? checkedItems : items || []}
        setting={setting}
        pdfRef={pdfRef as RefObject<HTMLTableElement>}
      />
    </div>
  );
}
