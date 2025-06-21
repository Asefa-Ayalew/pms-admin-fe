import {
  Button,
  Checkbox,
  Flex,
  Group,
  MantineColor,
  Menu,
  Title,
} from "@mantine/core";
import { IconFileExport, IconTrash } from "@tabler/icons-react";
import React from "react";

interface EntityListHeaderProps {
  title: React.ReactNode;
  showArchived?: boolean;
  viewAll?: boolean;
  filterValueLength: number;
  showExport?: boolean;
  tableKey?: string;
  header?: React.ReactNode;
  primaryColor?: MantineColor;
  secondaryColor?: MantineColor;
  className?: string;
  onResetFilters: () => void;
  onViewAll?: (value: boolean) => void;
  onShowArchived?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  exportDropdown: Array<{
    key: string;
    label: React.ReactNode;
    onClick: () => void;
  }>;
}

const EntityListHeader: React.FC<EntityListHeaderProps> = ({
  title,
  showArchived = true,
  viewAll,
  filterValueLength,
  showExport = true,
  tableKey = "",
  header,
  primaryColor = "blue",
  secondaryColor,
  className = "",
  onResetFilters,
  onViewAll,
  onShowArchived,
  exportDropdown,
}) => {
  return (
    <Flex justify="space-between" align="center" className={className}>
      <Title order={3} size="h4" fw={600} className="text-gray-800 w-[82%]">
        {title}
      </Title>

      <Group gap="xs">
        {filterValueLength > 0 && (
          <Button
            variant="subtle"
            color={primaryColor}
            size="xs"
            onClick={onResetFilters}
            leftSection={<IconTrash size={14} />}
          >
            Reset Filters
          </Button>
        )}

        {tableKey === "dispatches" && (
          <Checkbox
            label="View all"
            checked={viewAll}
            onChange={(e) => onViewAll?.(e?.currentTarget?.checked)}
            color={primaryColor}
            className="cursor-pointer"
          />
        )}

        {showArchived && (
          <Checkbox
            label="Show Archived"
            onChange={(e) => onShowArchived?.(e)}
            color={primaryColor}
            className="cursor-pointer"
          />
        )}

        {header}

        {showExport && exportDropdown.length > 0 && (
          <Menu withinPortal>
            <Menu.Target>
              <Button
                variant="filled"
                color={primaryColor}
                size="sm"
                leftSection={<IconFileExport size={16} />}
              >
                Export
              </Button>
            </Menu.Target>
            <Menu.Dropdown>
              {exportDropdown.map((item, index) => (
                <Menu.Item key={index} onClick={item.onClick}>
                  {item.label || item.key}
                </Menu.Item>
              ))}
            </Menu.Dropdown>
          </Menu>
        )}
      </Group>
    </Flex>
  );
};

export default EntityListHeader;
