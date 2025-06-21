import {
  Button,
  Checkbox,
  Divider,
  Menu,
  TextInput,
  Tooltip,
} from "@mantine/core";
import { IconFilter, IconPlus } from "@tabler/icons-react";
import { debounce } from "lodash-es";
import Link from "next/link";
import React from "react";

type FilterItem =
  | {
      key: string;
      label: React.ReactNode;
      type?: string;
    }
  | {
      type: "divider";
      key?: string;
      label?: React.ReactNode;
    };

interface EntityListToolbarProps {
  rootUrl?: string;
  viewMode: "list" | "detail";
  showNewButton?: boolean;
  showNewModal?: boolean;
  newButtonText?: string;
  hasGenerateButton?: boolean;
  showSelector?: boolean;
  filterMenus?: { items: FilterItem[] };
  check: boolean;
  filterValue: string[];
  checkedItems: any[];
  onSearch?: (value: string) => void;
  onFilterChange: (filterValue: string[]) => void;
  onShowSelector?: (value: boolean) => void;
  onGenerateButton?: (checkedItems: any[]) => void;
  handleNewModal?: () => void;
}

const EntityListToolbar: React.FC<EntityListToolbarProps> = ({
  rootUrl,
  viewMode,
  showNewButton = true,
  showNewModal = false,
  newButtonText = "New",
  hasGenerateButton,
  showSelector = true,
  filterMenus,
  check,
  filterValue,
  checkedItems,
  onSearch,
  onFilterChange,
  onShowSelector,
  onGenerateButton,
  handleNewModal,
}) => {
  return (
    <div
      className={`border border-gray-200 bg-white rounded p-2 py-6 w-full ${
        viewMode !== "detail"
          ? "h-10 flex items-center justify-between"
          : "flex-col space-y-2"
      }`}
    >
      {showNewButton && !showNewModal ? (
        <div
          className={`h-full flex items-center ${
            !showNewButton ? "invisible" : "visible"
          }`}
        >
          <Link href={`${rootUrl}/new`}>
            <Button bg={"primary.4"} leftSection={<IconPlus />}>
              <span>{newButtonText ?? "New"}</span>
            </Button>
          </Link>
        </div>
      ) : (
        <div
          className={`h-full flex items-center ${
            showNewModal === false ? "invisible" : "visible"
          }`}
        >
          <div>
            <Button
              bg={"primary.4"}
              leftSection={<IconPlus />}
              onClick={handleNewModal}
            >
              <span>{newButtonText ?? "New"}</span>
            </Button>
          </div>
        </div>
      )}

      {hasGenerateButton && checkedItems.length > 0 && (
        <div className="flex space-x-2">
          <Button
            onClick={() => onGenerateButton && onGenerateButton(checkedItems)}
          >
            Generate
          </Button>
        </div>
      )}

      <div className="flex space-x-2 justify-end">
        <TextInput
          placeholder="Search here"
          className={`${viewMode !== "detail" ? "w-80" : "w-full"}`}
          onKeyUp={debounce((event) => {
            onSearch?.(event.target.value);
          }, 1000)}
        />

        {filterMenus && (
          <>
            <Checkbox.Group
              value={filterValue}
              onChange={(data) => {
                onFilterChange(data);
              }}
            >
              <Menu>
                <Menu.Target>
                  <Button
                    variant="filled"
                    className={`shadow-none flex items-center dark:border-none dark:text-white`}
                    bg={"primary.4"}
                  >
                    <span>
                      <IconFilter />
                    </span>
                    <span
                      className={`${
                        viewMode === "detail" && "hidden"
                      } dark:text-white`}
                    >
                      Filter
                    </span>
                  </Button>
                </Menu.Target>
                <Menu.Dropdown>
                  {filterMenus.items.map((menu, index) =>
                    menu.type === "divider" ? (
                      <Menu.Item key={menu.key || `divider-${index}`}>
                        <Divider size={"xs"} />
                      </Menu.Item>
                    ) : (
                      <Menu.Item key={menu.key || index}>
                        {menu.label}
                      </Menu.Item>
                    )
                  )}
                </Menu.Dropdown>
              </Menu>
            </Checkbox.Group>
          </>
        )}

        {showSelector && (
          <Tooltip label="Selector">
            <Checkbox
              className={`w-8 h-8 border flex pt-1 justify-center rounded ${
                check && "bg-blue-900"
              }`}
              checked={check}
              onChange={() => {
                onShowSelector?.(!check);
              }}
            />
          </Tooltip>
        )}
      </div>
    </div>
  );
};

export default EntityListToolbar;
