"use client";


import { JSX, useEffect, useMemo, useState } from "react";

import { OrganizationBankAccount } from "@/src/models/organization-bank-account.model";
import { BankAccountType } from "@/src/shared/enum/app.enum";
import { CollectionQuery } from "@/src/shared/models/collection.model";
import {
  EntityConfig,
  entityViewMode,
} from "@/src/shared/models/entity-config.model";
// import { useLazyGetOrganizationBankAccountsQuery } from "./_store/organization-bank-account.query";
import {
  IconDotsVertical,
  IconEdit,
  IconEye,
  IconInbox,
  IconPlus,
  IconTrash,
} from "@tabler/icons-react";
import { ActionIcon, Button, Card, Divider, Menu, Modal, Table } from "@mantine/core";
import { useLazyGetOrganizationBankAccountsQuery } from "../_store/organization-bank-account.query";
import ReasonFormComponent from "../../user/_component/reason-form.-component";
import NewOrganizationBankAccountComponent from "./new-organization-bank-account-component";

const defaultBankAccountValue: OrganizationBankAccount = {
  accountNumber: "",
  bankName: "",
  bankCode: "",
  accountType: BankAccountType.SAVINGS,
  isActive: true,
};
interface Props {
    id?: string;
    editMode: "new" | "detail" | "view";
    accountId?: string;
    onClose?: () => void;
    data?: OrganizationBankAccount;
}

export default function MyOrganizationBankAccount(
  props: Props
) {

  // Component states
  const [selectedOrganizationBankAccount, setSelectedType] =
    useState<OrganizationBankAccount>();
    // const [selectedOrganizationBankAccount, setSelectedType] = useState<OrganizationBankAccount>();
  const [__, setViewMode] = useState<entityViewMode>("list");
  const [collection, _] = useState<CollectionQuery>({
    skip: 0,
    top: 20,
    orderBy: [{ field: "createdAt", direction: "desc" }],
  });
  const [modals, setModals] = useState({
    new: false,
    edit: false,
    view: false,
    archive: false,
  });

  // RTK hooks
  const [
    getOrganizationBankAccount,
    { data: organizationBankAccounts },
  ] = useLazyGetOrganizationBankAccountsQuery();

  const bankAccountTypeLabels: Record<BankAccountType, string> = {
    [BankAccountType.SAVINGS]: "Savings Account",
    [BankAccountType.CHECKING]: "Checking Account",
    [BankAccountType.BUSINESS]: "Business Account",
    [BankAccountType.JOINT]: "Joint Account",
  };

  useEffect(() => {
    getOrganizationBankAccount(collection);
  }, [collection, getOrganizationBankAccount]);

  useEffect(() => {
    setSelectedType(
      organizationBankAccounts?.data.find(
        (item) => item?.id === `${props?.id}`
      )
    );
  }, [props?.id, organizationBankAccounts?.data]);
  useEffect(() => {
    setSelectedType(
      organizationBankAccounts?.data?.find(
        (item: OrganizationBankAccount) => item?.id === `${props?.id}`
      )
    );
  }, [props?.id, organizationBankAccounts?.data]);
  useEffect(() => {
    setViewMode(props?.id !== undefined ? "detail" : "list");
  }, [props?.id]);

  const config = useMemo<EntityConfig<OrganizationBankAccount>>(
    () => ({
      primaryColumn: {
        key: "accountNumber",
        name: "Account Number",
        render: (data: OrganizationBankAccount) =>
          `${data?.accountNumber ?? ""}`,
      },
      rootUrl: "/my-organizations",
      identity: "id",
      visibleColumn: [
        {
          key: "accountNumber",
          name: "Account Number",
          render: (data: OrganizationBankAccount) =>
            `${data?.accountNumber ?? ""}`,
        },
        {
          key: "bankName",
          name: "Bank Name",
        },
        {
          key: "bankCode",
          name: "Bank Code",
        },
        {
          key: "accountType",
          name: "Account Type",
          render: (data: OrganizationBankAccount) =>
            bankAccountTypeLabels[data?.accountType as BankAccountType] ||
            "Unknown",
        },
        {
          key: "isActive",
          name: "Status",
          render: (data: OrganizationBankAccount) =>
            `${data?.isActive ? "Active" : "Inactive"}`,
        },
        {
          key: "createdAt",
          name: "Registration Date",
          isDate: true,
        },
      ],
      newAction: () => openModal("new"),
      actions: [
        {
          label: "Show More",
          icon: "IconEye",
          key: "showMore",
          type: "primary",
        },
        {
          label: "Edit",
          icon: "IconEdit",
          key: "edit",
          type: "primary",
          divider: true,
        },
        { label: "Delete", icon: "IconTrash", key: "delete", type: "danger" },
      ],
    }),
    []
  );
  const openModal = (
    type: keyof typeof modals,
    contact?: OrganizationBankAccount
  ) => {
    setSelectedType(contact ?? defaultBankAccountValue);
    setModals((prev) => ({
      ...prev,
      [type]: !prev[type],
    }));
  };

  const closeModal = (type: string) => {
    setModals((prev) => ({ ...prev, [type]: false }));
    setSelectedType(defaultBankAccountValue);
    getOrganizationBankAccount(collection);
  };
  const handleAction = (
    action: { key: string },
    data?: OrganizationBankAccount
  ) => {
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
 
  console.log("Selected Organization Bank Account:", selectedOrganizationBankAccount);
  console.log("Organization Bank Accounts:", organizationBankAccounts);
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
          {organizationBankAccounts?.data?.length === 0 ? (
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
            organizationBankAccounts?.data?.map((account: OrganizationBankAccount) => (
              <Table.Tr
                key={String(
                  account[config.identity as keyof OrganizationBankAccount] ?? ""
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
                        : typeof col.key === "string" && (col.key in account)
                          ? account[col.key as keyof OrganizationBankAccount]
                          : Array.isArray(col.key)
                            ? col.key
                                .filter((k) => k in account)
                                .map((k) => account[k as keyof OrganizationBankAccount])
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
        <NewOrganizationBankAccountComponent editMode="new" onClose={() => closeModal("new")} />
      )}
      {renderModal(
        "edit",
        "Edit Bank Account",
        "50%",
        <NewOrganizationBankAccountComponent
          editMode="detail"
          accountId={selectedOrganizationBankAccount?.id}
          onClose={() => closeModal("edit")}
          data={selectedOrganizationBankAccount}
        />
      )}
      {renderModal(
        "view",
        "View Bank Account",
        "50%",
        <NewOrganizationBankAccountComponent
          editMode="view"
          onClose={() => closeModal("view")}
          data={selectedOrganizationBankAccount}
        />
      )}
      {renderModal(
        "archive",
        "Reason",
        "50%",
        <ReasonFormComponent
          type="bank-account"
          id={selectedOrganizationBankAccount?.id ?? ""}
          onClose={() => closeModal("archive")}
        />
      )}
    </Card>
  );
}
