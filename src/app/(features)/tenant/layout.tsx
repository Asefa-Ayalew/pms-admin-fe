"use client";
import { useCallback, useEffect, useMemo, useState } from "react";
import type { Tenant } from "@/src/models/tenant.model";
import type { CollectionQuery } from "@/src/shared/models/collection.model";
import TenantForm from "./_component/tenant-form.component";
import { useLazyGetTenantsQuery } from "./_store/tenant.query";
import SharedTable from "@/src/shared/table/shared-table";
import type { TableConfig } from "@/src/shared/models/table-config";
import { Modal, Divider } from "@mantine/core";
import { IconEye, IconPencil, IconTrash } from "@tabler/icons-react";
import ReasonForm from "./_component/reason-form.component";

const defaultTenant: Tenant = {
  id: "",
  name: "",
  description: "",
  shortCode: "",
  tradeName: "",
  email:"",
  industry:"",
  phoneNumber: "",
  tin:""
};

const modalConfig = {
  new: {
    title: "New Tenant",
    size: "60%",
    component: (onClose: () => void) => (
      <TenantForm editMode="new" onClose={onClose} />
    ),
  },
  edit: {
    title: "Edit Tenant",
    size: "60%",
    component: (onClose: () => void, tenant: Tenant) => (
      <TenantForm editMode="detail" onClose={onClose} data={tenant} />
    ),
  },
  view: {
    title: "View Tenant",
    size: "60%",
    component: (onClose: () => void, tenant: Tenant) => (
      <TenantForm editMode="view" onClose={onClose} data={tenant} />
    ),
  },
  archive: {
    title: "Reason",
    size: "50%",
    component: (onClose: () => void, tenant: Tenant) => (
      <ReasonForm id={tenant?.id ?? ""} onClose={onClose} />
    ),
  },
};

export default function TenantsComponent() {
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

  const [selectedTenant, setSelectedTenant] =
    useState<Tenant>(defaultTenant);
  const [getTenants, { data: tenants, isLoading }] = useLazyGetTenantsQuery();

  useEffect(() => {
    getTenants(collectionQuery);
  }, [collectionQuery, getTenants]);

  const openModal = (type: keyof typeof modalConfig, tenant?: Tenant) => {
    setSelectedTenant(tenant ?? defaultTenant);
    setModals((prev) => ({ ...prev, [type]: true }));
  };

  const closeModal = (type: keyof typeof modalConfig) => {
    setModals((prev) => ({ ...prev, [type]: false }));
    setSelectedTenant(defaultTenant);
  };

  const handleAction = (action: { key: string }, tenant?: Tenant) => {
    openModal(action.key as keyof typeof modalConfig, tenant);
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
          {component(() => closeModal(key), selectedTenant)}
        </Modal>
      );
    });

  const config = useMemo<TableConfig<Tenant>>(
    () => ({
        columns: [
        {
          key: "name",
          name: "Tenant Name",
          render: (data: Tenant) => `${data?.name ?? ""}`,
        },
        {
          key: "shortCode",
          name: "Short Code",
          render: (data: Tenant) => `${data?.shortCode ?? ""}`,
        },
        {
          key: "tradeName",
          name: "Trade Name",
          render: (data: Tenant) => `${data?.tradeName ?? ""}`,
        },
        {
          key: "tin",
          name: "TIN",
          render: (data: Tenant) => `${data?.tin ?? ""}`,
        },
        {
          key: "industry",
          name: "Industry",
          render: (data: Tenant) => `${data?.industry ?? ""}`,
        },
        {
          key: "phoneNumber",
          name: "Phone Number(s)",
          render: (data: Tenant) =>
            [data?.phoneNumber, ...(data?.secondaryPhoneNumbers || [])]
              .filter(Boolean)
              .join(", ") || "N/A",
        },
        {
          key: "email",
          name: "Email Address(es)",
          render: (data: Tenant) =>
            [data?.email, ...(data?.secondaryEmails || [])]
              .filter(Boolean)
              .join(", ") || "N/A",
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
      title={"Tenants"}
      config={config}
      items={tenants?.data}
      total={tenants?.data?.length}
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
