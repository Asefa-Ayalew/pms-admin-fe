import {
  Button,
  Checkbox,
  Loader,
  Menu,
  Pagination,
  Select,
} from "@mantine/core";
import * as TablerIcons from "@tabler/icons-react";
import {
  Icon,
  IconCaretDownFilled,
  IconCaretUpFilled,
  IconCheck,
  IconChevronRight,
  IconDotsVertical,
  IconMinus,
} from "@tabler/icons-react";
import { useParams, useRouter } from "next/navigation";
import React, { useState } from "react";
import { EntityConfig } from "../../../shared/models/entity-config.model";

interface PaginationOptions {
  pageIndex: number;
  pageSize: number;
}

interface EntityListTableProps<T> {
  items?: T[];
  total?: number;
  viewMode?: "detail" | "list";
  setting?: EntityConfig<T>;
  pageIndex?: number;
  pageSize?: number;
  check?: boolean;
  checkedItems?: T[];
  order?: {
    field?: string;
    direction?: "asc" | "desc";
  };
  itemsLoading?: boolean;

  setCheckedItems?: (items: T[]) => void;
  onDetail?: (item: T) => void;
  onPaginationChange?: (pagination: PaginationOptions) => void;
  onOrder?: (order: { field: string; direction: "asc" | "desc" }) => void;
  handleAction?: (action: { key: string }, item: T) => void;
  showTotal?: boolean;
}

export const EntityListTable = <T extends Record<string, any>>({
  items = [],
  total = 0,
  viewMode = "list",
  setting,
  pageIndex = 1,
  pageSize = 10,
  check = false,
  checkedItems = [],
  order = { field: "", direction: "asc" },
  itemsLoading = false,

  setCheckedItems = () => {},
  onDetail = () => {},
  onPaginationChange = () => {},
  onOrder = () => {},
  handleAction,
  showTotal,
}: EntityListTableProps<T>) => {
  const params = useParams();
  const navigate = useRouter();
  const [allChecked, setAllChecked] = useState<boolean>(false);

  const getIdentityValue = (item: T) => {
    if ("id" in item) return String(item.id);
    if ("_id" in item) return String(item._id);
    return "";
  };

  const getPrimaryColumnValue = (item: T) => {
    if (setting?.primaryColumn?.["key"]) {
      const key = setting?.primaryColumn?.["key"];
      return !Array.isArray(key) ? item[key] : childeView(item, key);
    }
    return getIdentityValue(item);
  };

  const childeView = (item: T, keys: string[]) => {
    if (!keys?.length) return "";
    let value = item;
    for (const key of keys) {
      if (value && typeof value === "object" && key in value) {
        value = value[key];
      } else {
        return "";
      }
    }
    return value;
  };

  const dateFormat = (date: string, format: string) => {
    const d = new Date(date);
    const month = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];
    const day = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const year = d.getFullYear();
    const monthIndex = d.getMonth();
    const monthName = month[monthIndex];
    const dayIndex = d.getDay();
    const dayName = day[dayIndex];
    const date2 = d.getDate();
    const hour = d.getHours();
    const min = d.getMinutes();
    const sec = d.getSeconds();

    let formattedDate = format.replace("mm", monthName);
    formattedDate = formattedDate.replace("m", monthName.substring(0, 3));
    formattedDate = formattedDate.replace("yyyy", year.toString());
    formattedDate = formattedDate.replace("yy", year.toString().substring(2));
    formattedDate = formattedDate.replace("dd", dayName);
    formattedDate = formattedDate.replace("d", dayName.substring(0, 3));
    formattedDate = formattedDate.replace("D", date2.toString());
    formattedDate = formattedDate.replace(
      "dS",
      date2 + (date2 > 3 ? "th" : ["st", "nd", "rd"][date2 - 1] || "th")
    );
    formattedDate = formattedDate.replace(
      "H",
      hour > 12 ? (hour - 12).toString() : hour.toString()
    );
    formattedDate = formattedDate.replace("M", min.toString().padStart(2, "0"));
    formattedDate = formattedDate.replace("S", sec.toString().padStart(2, "0"));
    formattedDate = formattedDate.replace("A", hour >= 12 ? "PM" : "AM");
    return formattedDate;
  };

  const handleRowClick = (item: T) => {
    if (setting?.showDetail) {
      onDetail(item);

      const itemId = getIdentityValue(item);
      const detailPath = setting.detailUrl
        ? `${setting.rootUrl}/${setting.detailUrl}/${itemId}`
        : `${setting.rootUrl}/detail/${itemId}`;
      navigate.push(detailPath);
    }
  };

  return (
    <div className="px-2 bg-white border border-gray-200 rounded overflow-x-auto relative">
      {itemsLoading && (
        <div className="w-full h-40 flex items-center justify-center">
          <Loader />
        </div>
      )}

      {!itemsLoading && (
        <table className="w-full text-sm mt-2 text-left border border-gray-200 rounded">
          <thead className="text-sm text-gray-900 capitalize bg-gray-100 rounded">
            <tr>
              {check && (
                <th
                  scope="col"
                  className={
                    viewMode !== "detail"
                      ? "py-3 px-2"
                      : "py-2 px-2 bg-primary-500 text-white"
                  }
                >
                  <Checkbox
                    onChange={() => {
                      setAllChecked(!allChecked);
                      if (!allChecked) {
                        setCheckedItems(items);
                      } else {
                        setCheckedItems([]);
                      }
                    }}
                    checked={allChecked}
                    className="cursor-pointer"
                  />
                </th>
              )}

              {viewMode === "detail" ? (
                <th scope="col" className="py-3 bg-primary-500 text-white px-2">
                  <div className="flex space-x-2 items-center">
                    <div className="flex items-center text-xs">
                      {setting?.primaryColumn?.["name"]}
                    </div>
                  </div>
                </th>
              ) : (
                setting?.visibleColumn?.map(
                  (item) =>
                    item?.hide !== true && (
                      <th
                        key={item?.name}
                        scope="col"
                        className="py-3 text-sm px-2 items-center text-gray-700"
                      >
                        <div className="flex items-center space-x-2 h-full">
                          <div className="flex items-center text-xs font-semibold">
                            {item?.name}
                          </div>
                          {!item.hideSort && (
                            <div
                              className="flex-col"
                              role="button"
                              tabIndex={0}
                              onClick={() => {
                                const newDirection =
                                  order.direction === "asc" ? "desc" : "asc";
                                const field = !Array.isArray(item.key)
                                  ? `${item.key}`
                                  : item.key && item.key?.join(".");

                                onOrder?.({
                                  field,
                                  direction: newDirection,
                                });
                              }}
                              onKeyDown={(e) => {
                                if (e.key === "Enter" || e.key === " ") {
                                  const newDirection =
                                    order.direction === "asc" ? "desc" : "asc";
                                  const field = !Array.isArray(item.key)
                                    ? `${item.key}`
                                    : item.key && item.key?.join(".");

                                  onOrder?.({
                                    field,
                                    direction: newDirection,
                                  });
                                }
                              }}
                            >
                              <IconCaretUpFilled
                                size={10}
                                className={` fill-current cursor-pointer ${
                                  order.field === item.key &&
                                  order.direction === "asc" &&
                                  "text-blue-500"
                                }`}
                              />

                              <IconCaretDownFilled
                                size={10}
                                className={`fill-current cursor-pointer ${
                                  order.field === item.key &&
                                  order.direction === "desc" &&
                                  "text-blue-500"
                                }`}
                              />
                            </div>
                          )}
                        </div>
                      </th>
                    )
                )
              )}

              {viewMode === "detail" && (
                <th
                  scope="col"
                  className="py-3 bg-primary-500 text-white px-2 w-1/12"
                >
                  <span className="sr-only">Actions</span>
                </th>
              )}
            </tr>
          </thead>
          <tbody className="relative text-xs text-gray-700 border border-gray-200">
            {items.map((item, idx) => {
              const itemId = getIdentityValue(item);

              return (
                <tr
                  key={idx}
                  onDoubleClick={() => handleRowClick(item)}
                  className={`group hover:cursor-pointer ${
                    checkedItems.some(
                      (checkedItem) => getIdentityValue(checkedItem) === itemId
                    ) && "bg-secondary"
                  } ${
                    viewMode === "detail"
                      ? params?.id === String(itemId)
                        ? "bg-primary-500 border border-gray-200 text-white hover:bg-primary-500"
                        : `${
                            checkedItems.some(
                              (checkedItem) =>
                                getIdentityValue(checkedItem) === itemId
                            )
                              ? "bg-secondary text-white"
                              : "bg-white"
                          }`
                      : ""
                  } border border-gray-200 hover:bg-primary-50`}
                >
                  {check && (
                    <td
                      className={`${
                        viewMode === "detail" &&
                        "group-hover:bg-primary-500 group-hover:text-white font-medium whitespace-nowrap"
                      } py-2 px-2`}
                    >
                      <Checkbox
                        value={JSON.stringify(item)}
                        checked={checkedItems.some(
                          (checkedItem) =>
                            getIdentityValue(checkedItem) === itemId
                        )}
                        onChange={(event) => {
                          const parsed = JSON.parse(event.target.value);
                          const parsedId = getIdentityValue(parsed);

                          const itemExists = checkedItems.some(
                            (checkedItem) =>
                              getIdentityValue(checkedItem) === parsedId
                          );

                          if (itemExists) {
                            setCheckedItems(
                              checkedItems.filter(
                                (checkedItem) =>
                                  getIdentityValue(checkedItem) !== parsedId
                              )
                            );
                          } else {
                            setCheckedItems([...checkedItems, parsed]);
                          }
                        }}
                        className="cursor-pointer"
                      />
                    </td>
                  )}

                  {viewMode === "detail" ? (
                    <>
                      <th
                        className={`py-2 ${
                          params?.id === String(itemId)
                            ? "bg-primary-500 text-white"
                            : ""
                        } cursor-pointer group-hover:bg-primary-500 group-hover:text-white w-full px-2 font-medium whitespace-nowrap`}
                      >
                        {getPrimaryColumnValue(item)}
                      </th>
                      <td className="py-2 px-2 w-1/12 text-center">
                        <IconChevronRight
                          size={16}
                          className="group-hover:visible invisible"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleRowClick(item);
                          }}
                        />
                      </td>
                    </>
                  ) : (
                    setting?.visibleColumn?.map(
                      (col, index) =>
                        col.hide !== true && (
                          <td key={index} className="py-2 px-2">
                            {col.render
                              ? col.render(item)
                              : (() => {
                                  const key = col.key;
                                  const value = !Array.isArray(key)
                                    ? item[key]
                                    : childeView(item, key);

                                  if (typeof value === "boolean") {
                                    return value ? (
                                      <IconCheck size={20} />
                                    ) : (
                                      <IconMinus size={20} />
                                    );
                                  }

                                  if (col.isDate && value) {
                                    return dateFormat(value, "mmm dS, yyyy");
                                  }

                                  return value ?? "";
                                })()}
                          </td>
                        )
                    )
                  )}

                  {viewMode !== "detail" && setting?.showDetail && (
                    <td
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRowClick(item);
                      }}
                      className="py-2 px-2 cursor-pointer"
                    >
                      <IconChevronRight className="group-hover:visible invisible" />
                    </td>
                  )}

                  {viewMode !== "detail" &&
                    !setting?.showDetail &&
                    setting?.hasActions && (
                      <Menu shadow="md" width={200}>
                        <Menu.Target>
                          <Button variant="subtle" size="xs" px={6}>
                            <IconDotsVertical size={16} />
                          </Button>
                        </Menu.Target>

                        <Menu.Dropdown>
                          {Array.isArray(setting?.actions) &&
                            setting.actions.map((action) => {
                              const IconComponent = TablerIcons[
                                action.icon as keyof typeof TablerIcons
                              ] as Icon;

                              return (
                                <React.Fragment key={action.key}>
                                  <Menu.Item
                                    leftSection={
                                      IconComponent ? (
                                        <IconComponent size={16} />
                                      ) : null
                                    }
                                    color={
                                      action.type === "danger"
                                        ? "red"
                                        : undefined
                                    }
                                    onClick={() =>
                                      handleAction && handleAction(action, item)
                                    }
                                  >
                                    {action.label}
                                  </Menu.Item>

                                  {action.divider && <Menu.Divider />}
                                </React.Fragment>
                              );
                            })}
                        </Menu.Dropdown>
                      </Menu>
                    )}
                </tr>
              );
            })}
          </tbody>
        </table>
      )}

      {total > 0 && (
        <div className="flex justify-between px-2 py-2 items-center">
          {showTotal && (
            <div className="text-xs">
              Total Records:{" "}
              <span className="text-primary-500 font-medium">{total}</span>
            </div>
          )}
          <div className="flex items-center space-x-2">
            {(viewMode !== "detail" || total > pageSize) && (
              <>
                <Pagination
                  total={Math.ceil(total / pageSize)}
                  value={pageIndex}
                  onChange={(page) => {
                    onPaginationChange({
                      pageIndex: page,
                      pageSize,
                    });
                  }}
                  size="sm"
                  className={viewMode === "detail" ? "ml-auto" : ""}
                />
                {viewMode !== "detail" && (
                  <Select
                    size="xs"
                    data={[
                      { value: "10", label: "10" },
                      { value: "20", label: "20" },
                      { value: "30", label: "30" },
                      { value: "40", label: "40" },
                      { value: "50", label: "50" },
                    ]}
                    onChange={(value: string | null) => {
                      if (value !== null) {
                        onPaginationChange({
                          pageIndex: 1,
                          pageSize: parseInt(value),
                        });
                      }
                    }}
                    value={pageSize.toString()}
                  />
                )}
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
