"use client";
import { useCallback, useEffect, useMemo, useState } from "react";
import { OwnerType, type BankAccount } from "@/src/models/bank-account.model";
import type { CollectionQuery } from "@/src/shared/models/collection.model";
import BankAccountForm from "./_component/bank-account-form.component";
import { useLazyGetBankAccountsQuery } from "./_store/bank-account.query";
import SharedTable from "@/src/shared/table/shared-table";
import type { TableConfig } from "@/src/shared/models/table-config";
import { Modal, Divider } from "@mantine/core";
import { IconEye, IconPencil, IconTrash } from "@tabler/icons-react";
import ReasonForm from "./_component/reason-form.component";

const defaultBankAccount: BankAccount = {
  id: "",
  bankName: "",
  bankCode: "",
  accountNumber: "",
  ownerName: "",
  ownerType: OwnerType?.INDIVIDUAL,
  isPreferred: false,
  remark: "",
};

const modalConfig = {
  new: {
    title: "New Bank Account",
    size: "60%",
    component: (onClose: () => void) => (
      <BankAccountForm editMode="new" onClose={onClose} />
    ),
  },
  edit: {
    title: "Edit Bank Account",
    size: "60%",
    component: (onClose: () => void, bankAccount: BankAccount) => (
      <BankAccountForm editMode="detail" onClose={onClose} data={bankAccount} />
    ),
  },
  view: {
    title: "View Bank Account",
    size: "60%",
    component: (onClose: () => void, bankAccount: BankAccount) => (
      <BankAccountForm editMode="view" onClose={onClose} data={bankAccount} />
    ),
  },
  archive: {
    title: "Reason",
    size: "50%",
    component: (onClose: () => void, bankAccount: BankAccount) => (
      <ReasonForm id={bankAccount?.id ?? ""} onClose={onClose} />
    ),
  },
};

export default function BankAccountsComponent() {
  const [collectionQuery, setCollectionQuery] = useState<CollectionQuery>({
    skip: 0,
    top: 10,
    orderBy: [{ field: "createdAt", direction: "desc" }],
    search: "",
  });

  const [modals, setModals] = useState<
    Record<keyof typeof modalConfig, boolean>
  >({
    new: false,
    edit: false,
    view: false,
    archive: false,
  });

  const [selectedBankAccount, setSelectedBankAccount] =
    useState<BankAccount>(defaultBankAccount);
  const [getBankAccounts, { data: bankAccounts, isLoading }] = useLazyGetBankAccountsQuery();

  useEffect(() => {
    getBankAccounts(collectionQuery);
  }, [collectionQuery, getBankAccounts]);

  const openModal = (type: keyof typeof modalConfig, bankAccount?: BankAccount) => {
    setSelectedBankAccount(bankAccount ?? defaultBankAccount);
    setModals((prev) => ({ ...prev, [type]: true }));
  };

  const closeModal = (type: keyof typeof modalConfig) => {
    setModals((prev) => ({ ...prev, [type]: false }));
    setSelectedBankAccount(defaultBankAccount);
  };

  const handleAction = (action: { key: string }, bankAccount?: BankAccount) => {
    openModal(action.key as keyof typeof modalConfig, bankAccount);
  };

  const handlePaginationChange = useCallback(
    (pageIndex: number, pageSize: number) => {
      setCollectionQuery((prev) => ({
        ...prev,
        skip: pageIndex,
        top: pageSize,
      }));
    },
    []
  );

  const onSearch = (search: string) => {
    setCollectionQuery((prev) => ({
      ...prev,
      skip: 0,
      search: search,
    }));
  };

  const onOrder = (order: { field: string; direction: "desc" | "asc" }) => {
    setCollectionQuery((prev) => ({
      ...prev,
      orderBy: [order],
    }));
  };

  const renderModals = () =>
    (Object.keys(modalConfig) as (keyof typeof modalConfig)[]).map((key) => {
      const { title, size, component } = modalConfig[key];

      return (
        <Modal
          key={key}
          opened={modals[key]}
          onClose={() => closeModal(key)}
          title={title}
          centered
          size={size}
        >
          <Divider />
          {component(() => closeModal(key), selectedBankAccount)}
        </Modal>
      );
    });

  const config = useMemo<TableConfig<BankAccount>>(
    () => ({
        columns: [
        {
          key: "name",
          name: "Bank Name",
          render: (data: BankAccount) => `${data?.bankName ?? ""}`,
        },
        {
          key: "accountNumber",
          name: "Account Number",
          render: (data: BankAccount) => `${data?.accountNumber ?? ""}`,
        },
        {
          key: "bankCode",
          name: "Bank Code",
          render: (data: BankAccount) => `${data?.bankCode ?? ""}`,
        },
        {
          key: "ownerName",
          name: "Owner Name",
          render: (data: BankAccount) => `${data?.ownerName ?? ""}`,
        },
        {
          key: "ownerType",
          name: "Owner Type",
          render: (data: BankAccount) => `${data?.ownerType ?? ""}`,
        },
        {
          key: "isPreferred",
          name: "Is Preferred?",
          render: (data: BankAccount) => `${data?.isPreferred ?? ""}`,
        },
        {
          key: "remark",
          name: "Remark",
          render: (data: BankAccount) => `${data?.remark ?? ""}`,
        },
      ],
      actions: [
        { label: "Show More", icon: IconEye, size: "16", key: "view" },
        {
          label: "Edit",
          key: "edit",
          icon: IconPencil,
          size: "16",
          divider: true,
        },
        {
          label: "Delete",
          key: "archive",
          icon: IconTrash,
          size: "16",
          type: "danger",
        },
      ],
    }),
    []
  );

  return (
    <SharedTable
      title={"Bank Accounts"}
      config={config}
      items={bankAccounts?.data}
      total={bankAccounts?.data?.length}
      itemsLoading={isLoading}
      collectionQuery={collectionQuery}
      onPaginationChange={handlePaginationChange}
      onSearch={onSearch}
      onOrder={onOrder}
      renderModals={renderModals}
      handleAction={handleAction}
    />
  );
}
