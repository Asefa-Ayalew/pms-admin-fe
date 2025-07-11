"use client";

import { useParams } from "next/navigation";
import { JSX, useEffect, useState } from "react";

import { BankAccount, OwnerType } from "@/src/models/bank-account.model";
import { CollectionQuery } from "@/src/shared/models/collection.model";
import {
  EntityConfig,
  entityViewMode,
} from "@/src/shared/models/entity-config.model";
import {
  ActionIcon,
  Badge,
  Button,
  Card,
  Divider,
  Menu,
  Modal,
  Table,
} from "@mantine/core";
import { useLazyGetBankAccountsQuery } from "../_store/bank-account.query";
import BankAccountForm from "./bank-account-form";
import ReasonFormComponent from "./reason-form.-component";
import {
  IconDotsVertical,
  IconEdit,
  IconEye,
  IconInbox,
  IconPlus,
  IconTrash,
} from "@tabler/icons-react";

const defaultBankAccountValue: BankAccount = {
  accountNumber: "",
  bankName: "",
  bankCode: "",
  ownerName: "",
  ownerId: "",
  isPreferred: true,
  ownerType: OwnerType.INDIVIDUAL,
};

export default function UserBankAccountComponent() {
  const params = useParams();
  // Component states

  const [selectedBankAccount, setSelectedType] = useState<BankAccount>();
  const [viewMode, setViewMode] = useState<entityViewMode>("list");

  // RTK hooks
  const [getBankAccount, bankAccounts] = useLazyGetBankAccountsQuery();
  const [bankAccountCollection, setBankAccountCollection] =
    useState<CollectionQuery>({
      filter: [[{ field: "ownerId", value: params.id, operator: "=" }]],
      orderBy: [{ field: "createdAt", direction: "desc" }],
    });
  const [modals, setModals] = useState({
    new: false,
    edit: false,
    view: false,
    archive: false,
  });
  useEffect(() => {
    getBankAccount(bankAccountCollection);
  }, [bankAccountCollection, getBankAccount, setBankAccountCollection]);

  useEffect(() => {
    setSelectedType(
      bankAccounts?.data?.data?.find(
        (item: BankAccount) => item?.id === `${params?.id}`
      )
    );
  }, [params?.id, bankAccounts?.data?.data]);

  useEffect(() => {
    setViewMode(params?.id !== undefined ? "detail" : "list");
  }, [params?.id]);

  const config: EntityConfig<BankAccount> = {
    primaryColumn: {
      key: "ownerName",
      name: "Owner Name",
      render: (data: BankAccount) => `${data?.ownerName ?? ""}`,
    },
    rootUrl: "/user",
    identity: "id",
    showDetail: false,
    visibleColumn: [
      {
        key: "accountNumber",
        name: "Account Number",
      },
      {
        key: "bankCode",
        name: "Bank Code",
      },
      {
        key: "bankName",
        name: "Bank Name",
      },
      {
        key: "ownerType",
        name: "Owner Type",
        render: (data: BankAccount) => {
          const ownerTypeLabels: Record<
            OwnerType,
            { label: string; color: string }
          > = {
            [OwnerType.INDIVIDUAL]: { label: "Individual", color: "blue" },
            [OwnerType.GOVERNMENTAL]: { label: "Governmental", color: "red" },
            [OwnerType.COMPANY]: { label: "Company", color: "green" },
            [OwnerType.ORGANIZATION]: {
              label: "Organization",
              color: "violet",
            },
          };

          const ownerType = data?.ownerType as OwnerType;
          const { label, color } = ownerTypeLabels[ownerType] ?? {
            label: "Unknown",
            color: "gray",
          };

          return (
            <Badge color={color} variant="light">
              {label}
            </Badge>
          );
        },
      },
      {
        key: "createdAt",
        name: "Created At",
        isDate: true,
      },
    ],
    newAction: () => openModal("new"),
    actions: [
      { label: "Show More", icon: "IconEye", key: "showMore", type: "primary" },
      {
        label: "Edit",
        icon: "IconEdit",
        key: "edit",
        type: "primary",
        divider: true,
      },
      { label: "Delete", icon: "IconTrash", key: "delete", type: "danger" },
    ],
  };

  const openModal = (type: keyof typeof modals, contact?: BankAccount) => {
    setSelectedType(contact ?? defaultBankAccountValue);
    setModals((prev) => ({
      ...prev,
      [type]: !prev[type],
    }));
  };

  const closeModal = (type: string) => {
    setModals((prev) => ({ ...prev, [type]: false }));
    setSelectedType(defaultBankAccountValue);
    getBankAccount(bankAccountCollection);
  };
  const handleAction = (action: { key: string }, data?: BankAccount) => {
    switch (action.key) {
      case "showMore":
        openModal("view", data);
        break;
      case "edit":
        openModal("edit", data);
        break;
      case "delete":
        openModal("archive", data);
        break;
      default:
        console.warn("Unknown action:", action);
    }
  };

  const renderModal = (
    type: keyof typeof modals,
    title: string,
    size: string,
    content: JSX.Element
  ) => (
    <Modal
      opened={modals[type]}
      onClose={() => closeModal(type)}
      title={title}
      centered
      size={size}
    >
      <Divider />
      {content}
    </Modal>
  );
  console.log(viewMode);
  return (
    <Card className="flex w-full">
      <Button
        onClick={() => openModal("new")}
        leftSection={<IconPlus size={16} />}
        styles={{
          root: {
            width: "5rem",
            transition: "background-color 0.2s ease",
            "&:hover": {
              backgroundColor: "#ffeaea",
            },
            marginBottom: "4px",
            marginLeft: "4px",
          },
        }}
      >
        New
      </Button>
      <Table className="mantine-table-optimized" striped highlightOnHover>
        <Table.Thead>
          <Table.Tr>
            {/* Primary Column */}
            <Table.Th
              style={{
                position: "sticky",
                left: 0,
                zIndex: 3,
                background: "white",
              }}
            >
              {config.primaryColumn.name}
            </Table.Th>

            {/* Dynamic Visible Columns (excluding primary) */}
            {config.visibleColumn
              .filter((col) => col.key !== config.primaryColumn.key)
              .map((col) => (
                <Table.Th
                  key={Array.isArray(col.key) ? col.key.join(",") : col.key}
                >
                  {col.name}
                </Table.Th>
              ))}

            {/* Actions */}
            <Table.Th
              style={{
                position: "sticky",
                right: 0,
                zIndex: 3,
                background: "white",
                width: "20px",
              }}
            ></Table.Th>
          </Table.Tr>
        </Table.Thead>

        <Table.Tbody>
          {bankAccounts?.data?.data?.length === 0 ? (
            <Table.Tr>
              <Table.Td
                colSpan={config.visibleColumn.length + 2}
                className="text-center py-8 text-gray-500"
              >
                <div className="flex flex-col items-center">
                  <IconInbox size={40} />
                  <p className="mt-2">No users found</p>
                </div>
              </Table.Td>
            </Table.Tr>
          ) : (
            bankAccounts?.data?.data?.map((account: BankAccount) => (
              <Table.Tr
                key={String(
                  account[config.identity as keyof BankAccount] ?? ""
                )}
              >
                {/* Primary Column */}
                <Table.Td
                  style={{
                    position: "sticky",
                    left: 0,
                    zIndex: 2,
                    background: "white",
                  }}
                >
                  {config.primaryColumn.render
                    ? config.primaryColumn.render(account)
                    : null}
                </Table.Td>

                {/* Visible Columns */}
                {config.visibleColumn
                  .filter((col) => col.key !== config.primaryColumn.key)
                  .map((col) => (
                    <Table.Td
                      key={Array.isArray(col.key) ? col.key.join(",") : col.key}
                    >
                      {col.render
                        ? col.render(account)
                        : typeof col.key === "string"
                          ? account[col.key as keyof BankAccount]
                          : Array.isArray(col.key)
                            ? col.key
                                .map((k) => account[k as keyof BankAccount])
                                .join(" ")
                            : null}
                    </Table.Td>
                  ))}

                {/* Actions */}
                <Table.Td
                  style={{
                    position: "sticky",
                    right: 0,
                    zIndex: 2,
                    background: "white",
                  }}
                >
                  <Menu shadow="md" width={160} position="bottom-end" withArrow>
                    <Menu.Target>
                      <ActionIcon
                        variant="subtle"
                        size="sm"
                        aria-label="Actions"
                      >
                        <IconDotsVertical size={18} />
                      </ActionIcon>
                    </Menu.Target>
                    <Menu.Dropdown>
                      <Menu.Item
                        color="blue"
                        fw={600}
                        leftSection={<IconEye size={14} />}
                        onClick={() =>
                          handleAction({ key: "showMore" }, account)
                        }
                      >
                        Show More
                      </Menu.Item>
                      <Menu.Item
                        color="green"
                        fw={600}
                        leftSection={<IconEdit size={14} />}
                        onClick={() => handleAction({ key: "edit" }, account)}
                      >
                        Edit
                      </Menu.Item>
                      <Menu.Item
                        color="red"
                        fw={600}
                        leftSection={<IconTrash size={14} />}
                        onClick={() => handleAction({ key: "delete" }, account)}
                      >
                        Delete
                      </Menu.Item>
                    </Menu.Dropdown>
                  </Menu>
                </Table.Td>
              </Table.Tr>
            ))
          )}
        </Table.Tbody>
      </Table>

      {renderModal(
        "new",
        "Create Bank Account",
        "50%",
        <BankAccountForm editMode="new" onClose={() => closeModal("new")} />
      )}
      {renderModal(
        "edit",
        "Edit Bank Account",
        "50%",
        <BankAccountForm
          editMode="detail"
          accountId={selectedBankAccount?.id}
          onClose={() => closeModal("edit")}
          data={selectedBankAccount}
        />
      )}
      {renderModal(
        "view",
        "View Bank Account",
        "50%",
        <BankAccountForm
          editMode="view"
          onClose={() => closeModal("view")}
          data={selectedBankAccount}
        />
      )}
      {renderModal(
        "archive",
        "Reason",
        "50%",
        <ReasonFormComponent
          type="bank-account"
          id={selectedBankAccount?.id ?? ""}
          onClose={() => closeModal("archive")}
        />
      )}
    </Card>
  );
}
