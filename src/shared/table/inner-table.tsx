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
  useState,
} from "react";
import type { CollectionQuery, Filter } from "../models/collection.model";
import {
  Column,
  EntityConfig,
  entityViewMode,
} from "../models/entity-list-config";
import { useRouter } from "next/navigation";

type FunctionType<T = unknown> = (args: T) => void;

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
  showArchivedList?: boolean;
  view?: "list" | "archived";
  onViewChange?: (view: "list" | "archived") => void;

  onPaginationChange?: (skip: number, top: number) => void;
  onSearch?: FunctionType;
  onFilterChange?: (filters: Filter[][]) => void;
  onOrder?: (order: { field: string; direction: "asc" | "desc" }) => void;
  onSelectItem?: (item: T) => void;
  handleAction?: (action: { key: string }, item?: T) => void;
  showNewButton?: boolean;
  renderModals?: () => React.ReactNode;
  renderExpandedContent?: (item: T) => React.ReactNode;
  headerContents?: {
    help?: ReactElement;
    activity?: ReactElement;
  };
}

export default function InnerTable<T extends { id?: string | number }>(
  props: Props<T>
) {
  const {
    config,
    title,
    items = [],
    total = 0,
    itemsLoading = false,
    collectionQuery = { top: 10, skip: 0 },
    defaultPageSize = 20,
    pageSizeOptions = [1, 2, 3, 10, 20, 30, 50, 100],
    view = "list",
    onViewChange,
    onPaginationChange,
    onSearch,
    onFilterChange,
    onOrder,
    onSelectItem,
    handleAction,
    showNewButton = true,
    showArchivedList = true,
    renderModals,
    renderExpandedContent,
  } = props;

  const router = useRouter();
  const [expandedRow, setExpandedRow] = useState<string | number | undefined>(
    undefined
  );
  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);

  const availableFilters = config?.filter?.flat() || [];

  const pageSize = collectionQuery?.top || defaultPageSize;
  const currentPage = Math.floor((collectionQuery?.skip || 0) / pageSize) + 1;

  const handlePaginationChange = (page: number) => {
    const skip = (page - 1) * pageSize;
    const top = pageSize;
    onPaginationChange?.(skip, top);
  };

  const handlePageSizeChange = (value: string | null) => {
    const newSize = Number(value || defaultPageSize);
    const skip = (currentPage - 1) * newSize;
    const top = currentPage * newSize;
    onPaginationChange?.(skip, top);
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
    if (item?.id && renderExpandedContent) {
      setExpandedRow((prev) => (prev === item?.id ? undefined : item?.id));
    }
  };

  const handleFilterChange = (filterField: string, checked: boolean) => {
    let newSelectedFilters: string[];

    if (checked) {
      newSelectedFilters = [...selectedFilters, filterField];
    } else {
      newSelectedFilters = selectedFilters?.filter((f) => f !== filterField);
    }

    setSelectedFilters(newSelectedFilters);

    const activeFilterObjects = availableFilters?.filter((f) =>
      newSelectedFilters?.includes(f?.value)
    );

    const groupedFilters: Filter[][] = [];
    activeFilterObjects?.forEach((filter) => {
      const existingGroup = groupedFilters?.find((group) =>
        group?.some((f) => f?.value === filter?.value)
      );
      if (existingGroup) {
        existingGroup.push(filter);
      } else {
        groupedFilters.push([filter]);
      }
    });

    onFilterChange?.(groupedFilters);
  };

  const handleClick = (item: T) => {
    onSelectItem?.(item);
  };

  return (
    <div className="flex space-x-4">
      <div className="w-full">
        {title && (
          <Card shadow="sm" padding="sm" className="mb-2 text-gray-900">
            <Title order={4}>{title || config?.name}</Title>
          </Card>
        )}
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
                    if (config.showDetail) {
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
                  className="w-full"
                />

                {availableFilters?.length > 0 && (
                  <Menu shadow="md" width={200} position="bottom-end">
                    <Menu.Target>
                      <Button
                        variant="default"
                        leftSection={<IconFilter size={16} />}
                        className="px-4 cursor-pointer"
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
                                label={filter?.name || filter.value}
                                checked={selectedFilters?.includes(
                                  filter.value
                                )}
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
                {showArchivedList && (
                  <div className="flex gap-2">
                    <Tooltip label="Show List" withArrow position="bottom">
                      <ActionIcon
                        variant="light"
                        size="lg"
                        onClick={() => onViewChange?.("list")}
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
                        onClick={() => onViewChange?.("archived")}
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
                )}
              </div>
            </div>

            <Table highlightOnHover>
              <Table.Thead>
                <Table.Tr>
                  {renderExpandedContent && (
                    <Table.Th style={{ width: 40 }} className="bg-gray-200" />
                  )}

                  <>
                    {config?.visibleColumn?.map((col, idx) => (
                      <Table.Th
                        key={idx}
                        style={{
                          cursor: col.hideSort ? "default" : "pointer",
                        }}
                        onClick={() => {
                          if (!col?.hideSort) handleSorting(col?.key as string);
                        }}
                        className="bg-gray-200"
                      >
                        <div className="flex items-center space-x-2 text-gray-900">
                          <span>{col?.name}</span>
                          {!col?.hideSort && (
                            <div className="flex flex-col leading-none ml-1 -space-y-1 font-bold">
                              <IconChevronUp
                                size={14}
                                color={
                                  getSortDirection(col?.key as string) === "asc"
                                    ? "#1f2937"
                                    : "#9ca3af"
                                }
                              />
                              <IconChevronDown
                                size={14}
                                color={
                                  getSortDirection(col?.key as string) ===
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
                  {(config?.hasActions ||
                    config?.actions ||
                    config?.showDetail) && (
                    <Table.Th className="bg-gray-200 w-[5%]" />
                  )}
                </Table.Tr>
              </Table.Thead>

              <Table.Tbody>
                {itemsLoading ? (
                  <Table.Tr>
                    <Table.Td
                      colSpan={
                        config?.visibleColumn?.length +
                        (renderExpandedContent ? 1 : 0) +
                        (config?.hasActions || config?.actions ? 1 : 0)
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
                        config?.visibleColumn?.length +
                        (renderExpandedContent ? 1 : 0) +
                        (config?.hasActions || config?.actions ? 1 : 0)
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
                  items?.map((item, idx) => (
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
                                expandedRow === item?.id
                                  ? "Collapse row"
                                  : "Expand row"
                              }
                            >
                              {expandedRow === item?.id ? (
                                <IconChevronDown size={16} />
                              ) : (
                                <IconChevronRight size={16} />
                              )}
                            </ActionIcon>
                          </Table.Td>
                        )}
                        {config?.visibleColumn?.map((col, colIdx) => (
                          <Table.Td key={colIdx} className={col?.tdClass}>
                            {col?.render
                              ? col?.render(item)
                              : renderCell(item, col)}
                          </Table.Td>
                        ))}
                        {(config?.hasActions || config?.actions) && (
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
                                    <IconDotsVertical
                                      size={16}
                                      onClick={() => handleClick(item)}
                                    />
                                  </ActionIcon>
                                </Menu.Target>
                                <Menu.Dropdown>
                                  {(typeof config?.actions === "function"
                                    ? config.actions(item)
                                    : (config?.actions ?? [])
                                  ).map((action, index) => (
                                    <React.Fragment key={index}>
                                      <Menu.Item
                                        color={
                                          action?.type === "danger"
                                            ? "red"
                                            : undefined
                                        }
                                        onClick={() =>
                                          handleAction?.(
                                            { key: action?.key },
                                            item
                                          )
                                        }
                                        leftSection={
                                          action?.icon &&
                                          React.createElement(action.icon, {
                                            size: action?.size ?? 16,
                                          })
                                        }
                                      >
                                        {action?.label}
                                      </Menu.Item>
                                      {action?.divider && <Divider />}
                                    </React.Fragment>
                                  ))}
                                </Menu.Dropdown>
                              </Menu>
                            </div>
                          </Table.Td>
                        )}
                      </Table.Tr>
                      {renderExpandedContent && (
                        <Table.Tr>
                          <Table.Td
                            colSpan={
                              config?.visibleColumn?.length +
                              1 +
                              (config?.hasActions || config?.actions ? 1 : 0)
                            }
                            style={{
                              padding: 0,
                              border:
                                expandedRow === item?.id ? undefined : "none",
                            }}
                          >
                            <Collapse in={expandedRow === item?.id}>
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
                {total > 0 && (
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
                <Pagination
                  total={Math.ceil((total ?? 0) / pageSize)}
                  value={currentPage}
                  onChange={handlePaginationChange}
                  size="sm"
                  withEdges
                  withControls
                />
                <Select
                  data={pageSizeOptions.map((s) => s.toString())}
                  value={pageSize.toString()}
                  onChange={handlePageSizeChange}
                  size="xs"
                  style={{ width: 70 }}
                />
              </div>
            </div>

            {renderModals?.()}
          </Card>
        </div>
      </div>
    </div>
  );
}
/* eslint-disable @typescript-eslint/no-explicit-any */
function renderCell<T>(item: T, column: Column<T>): any {
  if (Array.isArray(column?.key)) {
    return column?.key.reduce((acc, key) => acc?.[key], item as any);
  } else {
    const value = (item as any)?.[column?.key];
    if (column?.isDate) {
      return value ? new Date(value).toLocaleDateString() : "";
    }
    if (column?.isBoolean) {
      return value ? "Yes" : "No";
    }
    if (column?.isNumber) {
      return Number(value);
    }
    return value;
  }
  /* eslint-disable @typescript-eslint/no-explicit-any */
}
