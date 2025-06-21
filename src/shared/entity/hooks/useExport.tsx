import { notifications } from "@mantine/notifications";
import { IconFileExcel, IconPdf } from "@tabler/icons-react";
import dateFormat from "dateformat";
import * as FileSaver from "file-saver";
import { useRef } from "react";
import * as XLSX from "xlsx";
import { EntityConfig } from "../../models/entity-config.model";

interface UseExportProps<T> {
  title: string | React.ReactNode;
  setting?: EntityConfig<T>;
  check: boolean;
  checkedItems: T[];
  items?: T[];
}

interface ExportDropdownItem {
  key: string;
  onClick: () => void;
  label: React.ReactNode;
}

export const useExport = <T extends Record<string, any>>({
  title,
  setting,
  check,
  checkedItems,
  items,
}: UseExportProps<T>) => {
  const pdfRef = useRef<HTMLTableElement>(null);

  const childeView = (
    item: T,
    keys: string[]
  ): string | number | boolean | null | Date | undefined => {
    let current: unknown = item;

    for (const key of keys) {
      if (typeof current === "object" && current !== null && key in current) {
        current = (current as Record<string, unknown>)[key];
      } else {
        return undefined;
      }
    }

    if (
      typeof current === "string" ||
      typeof current === "number" ||
      typeof current === "boolean" ||
      current === null ||
      current instanceof Date
    ) {
      return current;
    }

    return undefined;
  };

  const exportToExcel = async () => {
    const fileType =
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset-UTF-8;";
    const fileExtension = ".xlsx";

    if (check && checkedItems.length === 0) {
      notifications.show({
        title: "Warning",
        message: "Please select items to export",
      });
      return null;
    }

    const exportItems = check ? checkedItems : items;
    const exportData = exportItems?.map((item) => {
      const data: Record<string, string | number | boolean | null> = {};

      setting?.visibleColumn.forEach((col) => {
        if (col?.print !== false && col?.hide !== true) {
          const keyName = `${col.key}`;

          if (!Array.isArray(col.key)) {
            const val = item[col.key];

            if (col?.isDate) {
              data[keyName] =
                val instanceof Date ||
                typeof val === "string" ||
                typeof val === "number"
                  ? dateFormat(val, "mmm dS, yyyy")
                  : "";
            } else {
              data[keyName] =
                typeof val === "string" ||
                typeof val === "number" ||
                typeof val === "boolean" ||
                val === null
                  ? val
                  : "";
            }
          } else {
            const childVal = childeView(item, col.key);

            if (col?.isDate) {
              data[keyName] =
                childVal instanceof Date ||
                typeof childVal === "string" ||
                typeof childVal === "number"
                  ? dateFormat(childVal, "mmm dS, yyyy")
                  : "";
            } else {
              data[keyName] =
                typeof childVal === "string" ||
                typeof childVal === "number" ||
                typeof childVal === "boolean" ||
                childVal === null
                  ? childVal
                  : "";
            }
          }
        }
      });

      return data;
    });

    if (exportData) {
      const ws = XLSX.utils.json_to_sheet(exportData);
      const wb = { Sheets: { data: ws }, SheetNames: ["data"] };
      const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
      const data = new Blob([excelBuffer], { type: fileType });
      FileSaver.saveAs(
        data,
        typeof title === "string"
          ? title + fileExtension
          : "export" + fileExtension
      );
    }
  };

  const exportDropdown: ExportDropdownItem[] = [
    {
      key: "pdf",
      onClick: () => {
        if (check && checkedItems.length === 0) {
          notifications.show({
            title: "Warning",
            message: "Please select items to export",
          });
        }
      },
      label: (
        <div className="flex space-x-2 w-16 justify-center">
          <IconPdf />
        </div>
      ),
    },
    {
      key: "excel",
      onClick: exportToExcel,
      label: (
        <div className="flex space-x-2 w-16 justify-center">
          <IconFileExcel />
        </div>
      ),
    },
  ];

  return {
    exportToExcel,
    exportDropdown,
    pdfRef,
  };
};
