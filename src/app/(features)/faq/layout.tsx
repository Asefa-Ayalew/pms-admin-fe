"use client";
import { useCallback, useEffect, useMemo, useState } from "react";
import type { FAQ } from "@/src/models/faq.model";
import type { CollectionQuery } from "@/src/shared/models/collection.model";
import SharedTable from "@/src/shared/table/shared-table";
import type { TableConfig } from "@/src/shared/models/table-config";
import { Modal, Divider } from "@mantine/core";
import { IconEye, IconPencil, IconTrash } from "@tabler/icons-react";
import ReasonForm from "./_component/reason-form.component";
import { useLazyGetFAQsQuery } from "./_store/faq.query";
import FAQForm from "./_component/faq-orm.component";

const defaultTenant: FAQ = {
  id: "",
  tenantId: "",
  tenantName: "",
  question: "",
  answer: "",
};

const modalConfig = {
  new: {
    title: "New FAQ",
    size: "60%",
    component: (onClose: () => void) => (
      <FAQForm editMode="new" onClose={onClose} />
    ),
  },
  edit: {
    title: "Edit FAQ",
    size: "60%",
    component: (onClose: () => void, FAQ: FAQ) => (
      <FAQForm editMode="detail" onClose={onClose} data={FAQ} />
    ),
  },
  view: {
    title: "View FAQ",
    size: "60%",
    component: (onClose: () => void, FAQ: FAQ) => (
      <FAQForm editMode="view" onClose={onClose} data={FAQ} />
    ),
  },
  archive: {
    title: "Reason",
    size: "50%",
    component: (onClose: () => void, FAQ: FAQ) => (
      <ReasonForm id={FAQ?.id ?? ""} onClose={onClose} />
    ),
  },
};

export default function FAQsComponent() {
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

  const [selectedTenant, setSelectedTenant] = useState<FAQ>(defaultTenant);
  const [getTenants, { data: FAQs, isLoading }] = useLazyGetFAQsQuery();

  useEffect(() => {
    getTenants(collectionQuery);
  }, [collectionQuery, getTenants]);

  const openModal = (type: keyof typeof modalConfig, FAQ?: FAQ) => {
    setSelectedTenant(FAQ ?? defaultTenant);
    setModals((prev) => ({ ...prev, [type]: true }));
  };

  const closeModal = (type: keyof typeof modalConfig) => {
    setModals((prev) => ({ ...prev, [type]: false }));
    setSelectedTenant(defaultTenant);
  };

  const handleAction = (action: { key: string }, FAQ?: FAQ) => {
    openModal(action.key as keyof typeof modalConfig, FAQ);
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

  const config = useMemo<TableConfig<FAQ>>(
    () => ({
      columns: [
        {
          key: "question",
          name: "Question",
          render: (data: FAQ) => `${data?.question ?? ""}`,
        },
        {
          key: "answer",
          name: "Answer",
          render: (data: FAQ) => `${data?.answer ?? ""}`,
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
      title={"FAQs"}
      config={config}
      items={FAQs?.data}
      total={FAQs?.data?.length}
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
