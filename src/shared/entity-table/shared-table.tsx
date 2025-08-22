"use client";

import {
  Card,
  Title,
  Button,
  TextInput,
  ActionIcon,
  Select,
  Pagination,
  Table,
  Menu,
  Loader,
  Divider,
  Collapse,
  Checkbox,
  Tooltip,
  Paper,
} from "@mantine/core";
import {
  IconPlus,
  IconSearch,
  IconInbox,
  IconDotsVertical,
  IconChevronDown,
  IconChevronUp,
  IconChevronRight,
  IconFilter,
  IconList,
  IconArchive,
} from "@tabler/icons-react";
import React, {
  type ReactElement,
  ReactNode,
  useCallback,
  useEffect,
  useState,
} from "react";
import type { CollectionQuery, Filter } from "../models/collection.model";
import {
  Column,
  EntityConfig,
  entityViewMode,
} from "../models/entity-list-config";
import { useParams, useRouter } from "next/navigation";
import clsx from "clsx";
import { HeaderComponent } from "./components/header.component";

type FunctionType = (args: any) => void;

interface Props<T> {
  config: EntityConfig<T>;
  title?: string | ReactElement;
  detailTitle?: string | ReactElement;
  detail?: ReactNode;
  items?: T[];
  total?: number;
  itemsLoading?: boolean;
  collectionQuery?: CollectionQuery;

  defaultPageSize?: number;
  pageSizeOptions?: number[];
  viewMode?: entityViewMode;
  view?: "list" | "archived";
  onViewChange: (view: "list" | "archived") => void;

  onPaginationChange?: (skip: number, top: number) => void;
  onSearch?: FunctionType;
  onFilterChange?: (filters: Filter[][]) => void;
  onOrder?: (order: { field: string; direction: "asc" | "desc" }) => void;
  handleAction?: (action: { key: string }, item?: T) => void;
  showNewButton?: boolean;
  renderModals?: () => React.ReactNode;
  renderExpandedContent?: (item: T) => React.ReactNode;
}

export default function SharedEntity<T extends { id?: string | number }>(
  props: Props<T>
) {
  const {
    config,
    title,
    detailTitle,
    detail,
    items = [],
    total = 0,
    itemsLoading = false,
    collectionQuery = { top: 10, skip: 0 },
    defaultPageSize = 20,
    pageSizeOptions = [10, 20, 30, 50, 100],
    viewMode: externalViewMode,
    view = "list",
    onViewChange,
    onPaginationChange,
    onSearch,
    onFilterChange,
    onOrder,
    handleAction,
    showNewButton = true,
    renderModals,
    renderExpandedContent,
  } = props;

  const params = useParams();
  const router = useRouter();
  const [expandedRow, setExpandedRow] = useState<string | number | undefined>(
    undefined
  );
  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);
  const [viewMode, setViewMode] = useState<entityViewMode>(
    externalViewMode || "list"
  );
  const [fullScreen, setFullScreen] = useState<boolean>(false);

  const pageSize = collectionQuery?.top || defaultPageSize;
  const currentPage = Math.floor((collectionQuery?.skip || 0) / pageSize) + 1;

  const availableFilters = config?.filter?.flat() || [];

  const handlePaginationChange = (page: number) => {
    const skip = (page - 1) * pageSize;
    onPaginationChange?.(skip, pageSize);
  };

  const handlePageSizeChange = (value: string | null) => {
    const newSize = Number(value || defaultPageSize);
    onPaginationChange?.(0, newSize);
  };

  const debouncedSearch = useCallback(
    (searchTerm: string) => {
      const timeoutId = setTimeout(() => onSearch?.(searchTerm), 1000);
      return () => clearTimeout(timeoutId);
    },
    [onSearch]
  );

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.currentTarget.value;
    debouncedSearch(value);
  };

  const handleSorting = (field: string) => {
    const currentOrder = collectionQuery?.orderBy?.find(
      (o) => o.field === field
    );
    const newDirection = currentOrder?.direction === "asc" ? "desc" : "asc";
    onOrder?.({ field, direction: newDirection });
  };

  const getSortDirection = (field: string): "asc" | "desc" | undefined => {
    return collectionQuery?.orderBy?.find((o) => o.field === field)?.direction;
  };

  const handleRowClick = (item: T) => {
    if (item.id && renderExpandedContent) {
      setExpandedRow((prev) => (prev === item.id ? undefined : item.id));
    }
  };

  const handleFilterChange = (filterField: string, checked: boolean) => {
    let newSelectedFilters: string[];

    if (checked) {
      newSelectedFilters = [...selectedFilters, filterField];
    } else {
      newSelectedFilters = selectedFilters.filter((f) => f !== filterField);
    }

    setSelectedFilters(newSelectedFilters);

    const activeFilterObjects = availableFilters.filter((f) =>
      newSelectedFilters.includes(f.value)
    );

    const groupedFilters: Filter[][] = [];
    activeFilterObjects.forEach((filter) => {
      const existingGroup = groupedFilters.find((group) =>
        group.some((f) => f.value === filter.value)
      );
      if (existingGroup) {
        existingGroup.push(filter);
      } else {
        groupedFilters.push([filter]);
      }
    });

    onFilterChange?.(groupedFilters);
  };

  const handleDetail = useCallback(
    (item: T) => {
      const identity =
        typeof config.identity === "string"
          ? (item as Record<string, any>)[config.identity]
          : "id" in item
            ? item.id
            : "";

      const detailPath = config.detailUrl
        ? `${config.rootUrl}/${config.detailUrl}/${identity}`
        : `${config.rootUrl}/${identity}`;

      router.push(detailPath);
    },
    [config, router]
  );

  useEffect(() => {
    if (params?.id) {
      setViewMode("detail");
    } else if (externalViewMode !== undefined) {
      setViewMode(externalViewMode);
    } else {
      setViewMode("list");
    }
  }, [params?.id, externalViewMode]);

  return (
    <div className="flex space-x-4">
      <div className={viewMode === "detail" ? "w-1/3" : "w-full"}>
        <Card shadow="sm" padding="sm" className="mb-2 text-gray-900">
          <Title order={3}>{title || config?.name}</Title>
        </Card>
        <div>
          <Card shadow="sm" padding="sm" className="w-full">
            <div
              className={`flex items-center mb-4 ${
                showNewButton ? "justify-between" : "justify-end"
              }`}
            >
              {" "}
              {showNewButton && (
                <Button
                  leftSection={<IconPlus size={16} />}
                  onClick={() => {
                    if (viewMode === "list") {
                      router.push(`${config?.rootUrl}/new`);
                    } else {
                      handleAction?.({ key: "new" });
                    }
                  }}
                  className="mr-8"
                >
                  New
                </Button>
              )}
              <div className="flex items-center gap-2">
                <TextInput
                  placeholder="Search..."
                  leftSection={<IconSearch size={16} />}
                  onChange={handleSearchChange}
                  defaultValue={collectionQuery?.search || ""}
                  style={{ width: viewMode === "detail" ? 200 : 500 }}
                />

                {availableFilters.length > 0 && (
                  <Menu shadow="md" width={200} position="bottom-end">
                    <Menu.Target>
                      <Button
                        variant="default"
                        leftSection={<IconFilter size={16} />}
                      >
                        Filter
                      </Button>
                    </Menu.Target>
                    <Menu.Dropdown>
                      <div className="p-2">
                        {availableFilters.map((filter, index) => {
                          return (
                            <div key={index} className="py-1">
                              <Checkbox
                                label={filter.name || filter.value}
                                checked={selectedFilters.includes(filter.value)}
                                onChange={(e) =>
                                  handleFilterChange(
                                    filter.value,
                                    e.currentTarget.checked
                                  )
                                }
                                size="sm"
                                className="cursor-pointer"
                              />
                            </div>
                          );
                        })}
                      </div>
                    </Menu.Dropdown>
                  </Menu>
                )}
                <div className="flex gap-2">
                  <Tooltip label="Show List" withArrow position="bottom">
                    <ActionIcon
                      variant="light"
                      size="lg"
                      onClick={() => onViewChange("list")}
                      className={`transition-colors rounded-md ${
                        view === "list"
                          ? "bg-blue-600 text-white"
                          : "bg-gray-100 text-gray-500 hover:bg-blue-100 hover:text-blue-600"
                      }`}
                    >
                      <IconList size={20} />
                    </ActionIcon>
                  </Tooltip>

                  <Tooltip label="Show Archived" withArrow position="bottom">
                    <ActionIcon
                      variant="light"
                      size="lg"
                      onClick={() => onViewChange("archived")}
                      className={`transition-colors rounded-md ${
                        view === "archived"
                          ? "bg-blue-600 text-white"
                          : "bg-gray-100 text-gray-500 hover:bg-blue-100 hover:text-blue-600"
                      }`}
                    >
                      <IconArchive size={20} />
                    </ActionIcon>
                  </Tooltip>
                </div>
              </div>
            </div>

            <Table highlightOnHover>
              <Table.Thead>
                <Table.Tr>
                  {renderExpandedContent && (
                    <Table.Th style={{ width: 40 }} className="bg-gray-200" />
                  )}
                  {viewMode === "detail" ? (
                    <Table.Th
                      style={{
                        cursor: config.primaryColumn?.hideSort
                          ? "default"
                          : "pointer",
                      }}
                      onClick={() => {
                        if (!config.primaryColumn?.hideSort)
                          handleSorting(config.primaryColumn.key as string);
                      }}
                      className="bg-gray-200"
                    >
                      <div className="flex items-center space-x-2 text-gray-900">
                        <span>{config.primaryColumn?.name}</span>
                        {!config.primaryColumn?.hideSort && (
                          <div className="flex flex-col leading-none ml-1 -space-y-1 font-bold">
                            <IconChevronUp
                              size={14}
                              color={
                                getSortDirection(
                                  config.primaryColumn.key as string
                                ) === "asc"
                                  ? "#1f2937"
                                  : "#9ca3af"
                              }
                            />
                            <IconChevronDown
                              size={14}
                              color={
                                getSortDirection(
                                  config.primaryColumn.key as string
                                ) === "desc"
                                  ? "#1f2937"
                                  : "#9ca3af"
                              }
                            />
                          </div>
                        )}
                      </div>
                    </Table.Th>
                  ) : (
                    <>
                      {config.visibleColumn.map((col, idx) => (
                        <Table.Th
                          key={idx}
                          style={{
                            cursor: col.hideSort ? "default" : "pointer",
                          }}
                          onClick={() => {
                            if (!col.hideSort) handleSorting(col.key as string);
                          }}
                          className="bg-gray-200"
                        >
                          <div className="flex items-center space-x-2 text-gray-900">
                            <span>{col.name}</span>
                            {!col.hideSort && (
                              <div className="flex flex-col leading-none ml-1 -space-y-1 font-bold">
                                <IconChevronUp
                                  size={14}
                                  color={
                                    getSortDirection(col.key as string) ===
                                    "asc"
                                      ? "#1f2937"
                                      : "#9ca3af"
                                  }
                                />
                                <IconChevronDown
                                  size={14}
                                  color={
                                    getSortDirection(col.key as string) ===
                                    "desc"
                                      ? "#1f2937"
                                      : "#9ca3af"
                                  }
                                />
                              </div>
                            )}
                          </div>
                        </Table.Th>
                      ))}
                    </>
                  )}
                  {(config.hasActions ||
                    config.actions ||
                    config?.showDetail) && (
                    <Table.Th style={{ width: 50 }} className="bg-gray-200" />
                  )}
                </Table.Tr>
              </Table.Thead>

              <Table.Tbody>
                {itemsLoading ? (
                  <Table.Tr>
                    <Table.Td
                      colSpan={
                        config.visibleColumn.length +
                        (renderExpandedContent ? 1 : 0) +
                        (config.hasActions || config.actions ? 1 : 0)
                      }
                      className="text-center py-8"
                    >
                      <Loader />
                    </Table.Td>
                  </Table.Tr>
                ) : items.length === 0 ? (
                  <Table.Tr>
                    <Table.Td
                      colSpan={
                        config.visibleColumn.length +
                        (renderExpandedContent ? 1 : 0) +
                        (config.hasActions || config.actions ? 1 : 0)
                      }
                      className="text-center py-8 text-gray-500"
                    >
                      <div className="flex flex-col items-center">
                        <IconInbox size={40} />
                        <p className="mt-2">No data found</p>
                      </div>
                    </Table.Td>
                  </Table.Tr>
                ) : (
                  items.map((item, idx) => (
                    <React.Fragment key={idx}>
                      <Table.Tr
                        style={{
                          cursor: renderExpandedContent ? "pointer" : "default",
                        }}
                        onDoubleClick={() => handleRowClick(item)}
                        className="group"
                      >
                        {renderExpandedContent && (
                          <Table.Td>
                            <ActionIcon
                              variant="subtle"
                              onClick={() => handleRowClick(item)}
                              aria-label={
                                expandedRow === item.id
                                  ? "Collapse row"
                                  : "Expand row"
                              }
                            >
                              {expandedRow === item.id ? (
                                <IconChevronDown size={16} />
                              ) : (
                                <IconChevronRight size={16} />
                              )}
                            </ActionIcon>
                          </Table.Td>
                        )}
                        {viewMode === "detail" ? (
                          <Table.Td
                            className={`${config.primaryColumn?.tdClass ?? ""} ${
                              params.id === item?.id
                                ? "bg-blue-600 text-white"
                                : ""
                            }`}
                          >
                            {config.primaryColumn?.render
                              ? config.primaryColumn.render(item)
                              : renderCell(item, config.primaryColumn)}
                          </Table.Td>
                        ) : (
                          <>
                            {config.visibleColumn.map((col, colIdx) => (
                              <Table.Td key={colIdx} className={col.tdClass}>
                                {col.render
                                  ? col.render(item)
                                  : renderCell(item, col)}
                              </Table.Td>
                            ))}
                          </>
                        )}
                        {(config.hasActions || config?.actions) && (
                          <Table.Td className="w-[5%]">
                            <div className="invisible group-hover:visible flex justify-center">
                              <Menu
                                shadow="md"
                                width={160}
                                position="bottom-end"
                                withArrow
                              >
                                <Menu.Target>
                                  <ActionIcon variant="subtle" size="sm">
                                    <IconDotsVertical size={16} />
                                  </ActionIcon>
                                </Menu.Target>
                                <Menu.Dropdown>
                                  {config.actions?.map((action, index) => (
                                    <React.Fragment key={index}>
                                      <Menu.Item
                                        color={
                                          action.type === "danger"
                                            ? "red"
                                            : undefined
                                        }
                                        onClick={() =>
                                          handleAction?.(
                                            { key: action.key },
                                            item
                                          )
                                        }
                                        leftSection={
                                          action.icon &&
                                          React.createElement(action.icon, {
                                            size: action?.size ?? 16,
                                          })
                                        }
                                      >
                                        {action.label}
                                      </Menu.Item>
                                      {action.divider && <Divider />}
                                    </React.Fragment>
                                  ))}
                                </Menu.Dropdown>
                              </Menu>
                            </div>
                          </Table.Td>
                        )}

                        {config.showDetail && (
                          <Table.Td
                            className={`${config.primaryColumn?.tdClass ?? ""} ${
                              params.id === item?.id
                                ? "bg-blue-600 text-white w-[5%]"
                                : "w-[5%]"
                            }`}
                          >
                            {" "}
                            <Button
                              onClick={() => handleDetail(item)}
                              className="invisible group-hover:visible p-0"
                              variant="subtle"
                              size="compact-xs"
                              leftSection={
                                <IconChevronRight
                                  size={16}
                                  color={
                                    params.id === item?.id ? "white" : "#111827"
                                  }
                                />
                              }
                            >
                              {params.id === item?.id}
                            </Button>
                          </Table.Td>
                        )}
                      </Table.Tr>
                      {renderExpandedContent && (
                        <Table.Tr>
                          <Table.Td
                            colSpan={
                              config.visibleColumn.length +
                              1 +
                              (config.hasActions || config.actions ? 1 : 0)
                            }
                            style={{
                              padding: 0,
                              border:
                                expandedRow === item.id ? undefined : "none",
                            }}
                          >
                            <Collapse in={expandedRow === item.id}>
                              <div className="p-4 bg-gray-50">
                                {renderExpandedContent(item)}
                              </div>
                            </Collapse>
                          </Table.Td>
                        </Table.Tr>
                      )}
                    </React.Fragment>
                  ))
                )}
              </Table.Tbody>
            </Table>
            <div className="flex justify-between items-center px-4 py-2">
              <div className="flex items-center text-sm text-gray-600 space-x-1">
                {total > 0 && viewMode === "list" && (
                  <>
                    <span className="text-gray-500">Showing</span>
                    <span className="font-semibold text-blue-600">
                      {(currentPage - 1) * pageSize + 1}
                    </span>
                    <span className="text-gray-500">to</span>
                    <span className="font-semibold text-blue-600">
                      {Math.min(currentPage * pageSize, total)}
                    </span>
                    <span className="text-gray-500">of</span>
                    <span className="font-semibold text-blue-600">{total}</span>
                    <span className="text-gray-500">{title}</span>
                  </>
                )}
              </div>

              <div className="flex items-center space-x-3">
                <Select
                  data={pageSizeOptions.map((s) => s.toString())}
                  value={collectionQuery.top?.toString()}
                  onChange={handlePageSizeChange}
                  size="xs"
                  style={{ width: 60 }}
                />
                <Pagination
                  total={Math.ceil((total ?? 1) / pageSize)}
                  value={currentPage}
                  onChange={handlePaginationChange}
                />
              </div>
            </div>

            {renderModals?.()}
          </Card>
        </div>
      </div>

      {viewMode === "detail" && (
        <div className="w-full flex flex-col space-y-4">
          <Paper
            shadow={"xs"}
            p="md"
            radius="md"
            className="h-full flex flex-col"
          >
            <HeaderComponent
              detailTitle={detailTitle}
              title={title as string}
              rootUrl={config?.rootUrl}
              detail={detail}
              fullScreen={fullScreen}
              setFullScreen={setFullScreen}
              primaryColor={"blue"}
            />
          </Paper>
        </div>
      )}
    </div>
  );
}

function renderCell<T>(item: T, column: Column<T>): any {
  if (Array.isArray(column.key)) {
    return column.key.reduce((acc, key) => acc?.[key], item as any);
  } else {
    const value = (item as any)?.[column.key];
    if (column.isDate) {
      return value ? new Date(value).toLocaleDateString() : "";
    }
    if (column.isBoolean) {
      return value ? "Yes" : "No";
    }
    return value;
  }
}
