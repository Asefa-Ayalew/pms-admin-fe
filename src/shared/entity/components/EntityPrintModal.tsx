import { Button, Group, Modal, Paper, Table } from "@mantine/core";
import { IconCheck, IconDots, IconPrinter } from "@tabler/icons-react";
import dateFormat from "dateformat";
import React from "react";
import { EntityConfig } from "../../models/entity-config.model";

interface EntityPrintModalProps<T> {
  opened: boolean;
  onClose: () => void;
  printItems: T[];
  setting?: EntityConfig<T>;
  pdfRef: React.RefObject<HTMLTableElement>;
}

const EntityPrintModal = <T extends Record<string, any>>({
  opened,
  onClose,
  printItems,
  setting,
  pdfRef,
}: EntityPrintModalProps<T>) => {
  const getNestedValue = (
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

  const formatCellValue = (
    value: any,
    isDate: boolean | undefined,
    render?: (data: T) => any
  ) => {
    if (value === undefined || value === null) return "";

    if (typeof value === "boolean") {
      return value ? <IconCheck size={18} /> : <IconDots size={18} />;
    }

    if (isDate && value) {
      return dateFormat(value, "mmm dS, yyyy");
    }

    return String(value);
  };

  const handlePrint = () => {
    const printWindow = window.open("", "_blank");
    if (!printWindow) return;

    const printContent = document.createElement("div");
    if (pdfRef.current) {
      printContent.innerHTML = `
        <html>
          <head>
            <title>Print</title>
            <style>
              body { font-family: Arial, sans-serif; margin: 20px; }
              table { border-collapse: collapse; width: 100%; }
              th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
              th { background-color: #f2f2f2; }
              h1 { text-align: center; color: #333; }
            </style>
          </head>
          <body>
            <h1>${setting?.name || "Print Data"}</h1>
            ${pdfRef.current.outerHTML}
          </body>
        </html>
      `;
      printWindow.document.open();
      printWindow.document.write(printContent.innerHTML);
      printWindow.document.close();
      setTimeout(() => {
        printWindow.print();
      }, 500);
    }
  };

  return (
    <Modal
      title="Print Preview"
      centered
      opened={opened}
      onClose={onClose}
      size="xl"
    >
      <Paper p="md" withBorder>
        <Table ref={pdfRef} striped highlightOnHover>
          <Table.Thead>
            <Table.Tr>
              {setting?.visibleColumn
                ?.filter((col) => col.print !== false)
                .map((col) => (
                  <Table.Th
                    key={Array.isArray(col.key) ? col.key.join(".") : col.key}
                  >
                    {col.name}
                  </Table.Th>
                ))}
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {printItems?.map((item, idx) => (
              <Table.Tr key={idx}>
                {setting?.visibleColumn
                  ?.filter((col) => col.print !== false)
                  .map((col, colIdx) => (
                    <Table.Td key={colIdx}>
                      {col.render
                        ? col.render(item)
                        : formatCellValue(
                            Array.isArray(col.key)
                              ? getNestedValue(item, col.key)
                              : item[col.key],
                            col.isDate
                          )}
                    </Table.Td>
                  ))}
              </Table.Tr>
            ))}
          </Table.Tbody>
        </Table>
      </Paper>

      <Group gap="md" justify="flex-end" mt="lg">
        <Button variant="outline" onClick={onClose}>
          Close
        </Button>
        <Button onClick={handlePrint} leftSection={<IconPrinter size={16} />}>
          Print
        </Button>
      </Group>
    </Modal>
  );
};

export default EntityPrintModal;
