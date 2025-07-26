"use client";
import { useCallback, useEffect, useMemo, useState } from "react";
import type { FAQ } from "@/src/models/faq.model";
import type { CollectionQuery } from "@/src/shared/models/collection.model";
import SharedTable from "@/src/shared/table/shared-table";
import type { Actions, TableConfig } from "@/src/shared/models/table-config";
import { Modal, Divider } from "@mantine/core";
import { IconEye, IconPencil, IconTrash } from "@tabler/icons-react";
import ReasonForm from "./_component/reason-form.component";
import { useDeleteFAQMutation, useLazyGetArchivedFAQsQuery, useLazyGetFAQsQuery, useRestoreFAQMutation } from "./_store/faq.query";
import FAQForm from "./_component/faq-form.component";
import { modals } from '@mantine/modals';

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

  const [modal, setModals] = useState<
    Record<keyof typeof modalConfig, boolean>
  >({
    new: false,
    edit: false,
    view: false,
    archive: false,
  });

  const [selectedTenant, setSelectedTenant] = useState<FAQ>(defaultTenant);
  const [view, setView] = useState<"list" | "archived">("list");

  const [getFAQs, { data: FAQs, isLoading }] = useLazyGetFAQsQuery();
  const [getArchivedFAQs, { data: archivedFAQs, isLoading: archivedFAQsLoading }] = useLazyGetArchivedFAQsQuery()
  const [restoreFAQ] = useRestoreFAQMutation();
  const [deleteFAQ] = useDeleteFAQMutation();

  useEffect(() => {
    if (view === 'list') {
      getFAQs(collectionQuery);
    }
  }, [collectionQuery, getFAQs, view]);

  useEffect(() => {
    if (view === 'archived') {
      getArchivedFAQs(collectionQuery)
    }
  }, [collectionQuery, getArchivedFAQs, view])

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

    if (action.key === 'delete' && FAQ?.id) {
      handleDelete(FAQ);
    } else if (action.key === 'restore') {
      restoreFAQ(String(FAQ?.id));
    }
  };

  const handleDelete = (FAQ: FAQ) => {
    modals.openConfirmModal({
      title: (
        <span className="text-lg font-semibold text-gray-800">
          Confirm Deletion
        </span>
      ),
      centered: true,
      children: (
        <div className="space-y-2 text-sm text-gray-700">
          <p>
            Are you sure you want to delete this <span className="text-red-600 font-medium">document type</span>? This action
            <strong> cannot </strong> be undone.
          </p>
          <p>
            <strong className="text-gray-800">Question:</strong>{' '}
            <span className="text-gray-700">{FAQ?.question}</span>
          </p>
        </div>
      ),
      labels: {
        confirm: 'Delete',
        cancel: 'Cancel',
      },
      confirmProps: {
        color: 'red',
        variant: 'filled',
      },
      onConfirm: () => {
        deleteFAQ(String(FAQ?.id));
      },
    });
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
          opened={modal[key]}
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

  const listActions: Actions[] = [
    {
      label: "Edit",
      key: "edit",
      icon: IconPencil,
      size: "16",
    },
    {
      label: "Archive",
      key: "archive",
      icon: IconTrash,
      size: "16",
      type: "danger",
    },
  ];

  const archivedActions: Actions[] = [
    {
      label: "Restore",
      key: "restore",
      icon: IconPencil,
      size: "16",
    },
    {
      label: "Delete",
      key: "delete",
      icon: IconTrash,
      size: "16",
      type: "danger",
    },
  ];

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
        {
          label: "Show More",
          key: "view",
          icon: IconEye,
          size: "16",
        },
        ...(view === "list" ? listActions : archivedActions),
      ],
    }),
    [view]
  );
  return (
    <SharedTable
      title={view === 'list' ? "FAQs" : 'Archived FAQs'}
      config={config}
      items={view === 'list' ? FAQs?.data : archivedFAQs?.data}
      total={view === 'list' ? FAQs?.total : archivedFAQs?.total}
      itemsLoading={view === 'list' ? isLoading : archivedFAQsLoading}
      collectionQuery={collectionQuery}
      view={view}
      showNewButton={view === 'list'}
      onViewChange={setView}
      onPaginationChange={handlePaginationChange}
      onSearch={onSearch}
      onOrder={onOrder}
      renderModals={renderModals}
      handleAction={handleAction}
    />
  );
}
