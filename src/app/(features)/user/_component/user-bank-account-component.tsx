"use client";

import { useParams } from "next/navigation";
import { JSX, useEffect, useState } from "react";

import { BankAccount, OwnerType } from "@/src/models/bank-account.model";
import EntityList from "@/src/shared/entity/entity-list";
import { CollectionQuery, Order } from "@/src/shared/models/collection.model";
import {
  EntityConfig,
  entityViewMode,
} from "@/src/shared/models/entity-config.model";
import { Badge, Card, Divider, Modal } from "@mantine/core";
import { useLazyGetBankAccountsQuery } from "../_store/bank-account.query";
import BankAccountForm from "./bank-account-form";
import ReasonFormComponent from "./reason-form.-component";

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

  const [check, setCheck] = useState(false);
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
      // {
      //     key: "ownerName",
      //     name: "Owner Name",
      //     render: (data: BankAccount) => `${data?.ownerName ?? ""}`,
      // },
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
        name: "Registration Date",
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
  const handleNewModal = () => {
    openModal("new");
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
      <EntityList
        parentStyle="w-full"
        viewMode="list"
        check={check}
        showArchived={false}
        showSelector={true}
        tableKey="bankAccounts"
        title=""
        newButtonText="New"
        total={bankAccounts?.data?.count || 0}
        collectionQuery={bankAccountCollection}
        config={config}
        showNewButton={false}
        showNewModal={true}
        items={bankAccounts?.data?.data}
        initialPage={1}
        defaultPageSize={20}
        pageSize={[20, 30, 50, 100]}
        onShowSelector={(e) => setCheck(e)}
        onPaginationChange={(skip: number, top: number) => {
          const after = (skip - 1) * top;
          setBankAccountCollection({
            ...bankAccountCollection,
            skip: after,
            top: top,
          });
        }}
        onSearch={(data: string) => {
          setBankAccountCollection({
            ...bankAccountCollection,
            search: data || "",
            searchFrom: data
              ? ["ownerName", "accountNumber", "bankName", "bankCode"]
              : [],
          });
        }}
        onFilterChange={(
          data: { field: string; value: string | number | boolean }[]
        ) => {
          if (bankAccountCollection?.filter || data.length > 0) {
            // setCollection({ ...collection, filter: data });
          }
        }}
        onOrder={(data: Order) =>
          setBankAccountCollection({
            ...bankAccountCollection,
            orderBy: [data],
          })
        }
        handleAction={handleAction}
        handleNewModal={handleNewModal}
      />
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
