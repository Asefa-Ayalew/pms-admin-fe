"use client";
import { useCallback, useEffect, useMemo, useState } from "react";
import type { CollectionQuery } from "@/src/shared/models/collection.model";
import FeedbackForm from "./_component/feed-back-form.component";
import { useDeleteFeedbackMutation, useLazyGetArchivedFeedbacksQuery, useLazyGetFeedbacksQuery, useRestoreFeedbackMutation } from "./_store/feed-back.query";
import SharedTable from "@/src/shared/table/shared-table";
import type { Actions, TableConfig } from "@/src/shared/models/table-config";
import { Modal, Divider } from "@mantine/core";
import { IconEye, IconPencil, IconTrash } from "@tabler/icons-react";
import ReasonForm from "./_component/reason-form.component";
import { Feedback } from "@/src/models/feed-back.model";
import { modals } from '@mantine/modals';

const defaultFeedback: Feedback = {
  id: "",
  name: "",
  subject: "",
  email: "",
  phone: "",
  message: "",
};

const modalConfig = {
  new: {
    title: "New Feed Back",
    size: "60%",
    component: (onClose: () => void) => (
      <FeedbackForm editMode="new" onClose={onClose} />
    ),
  },
  edit: {
    title: "Edit Feed Back",
    size: "60%",
    component: (onClose: () => void, feedBack: Feedback) => (
      <FeedbackForm editMode="detail" onClose={onClose} data={feedBack} />
    ),
  },
  view: {
    title: "View Feed Back",
    size: "60%",
    component: (onClose: () => void, feedBack: Feedback) => (
      <FeedbackForm editMode="view" onClose={onClose} data={feedBack} />
    ),
  },
  archive: {
    title: "Reason",
    size: "50%",
    component: (onClose: () => void, feedBack: Feedback) => (
      <ReasonForm id={feedBack?.id ?? ""} onClose={onClose} />
    ),
  },
};

export default function FeedbacksComponent() {
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

  const [selectedFeedback, setSelectedFeedback] =
    useState<Feedback>(defaultFeedback);
  const [view, setView] = useState<"list" | "archived">("list");

  const [getFeedbacks, { data: feedbacks, isLoading }] = useLazyGetFeedbacksQuery();
  const [getArchivedFeedbacks, { data: archivedFeedbacks, isLoading: archivedFeedbacksLoading }] = useLazyGetArchivedFeedbacksQuery()
  const [restoreFeedback] = useRestoreFeedbackMutation();
  const [deleteFeedback] = useDeleteFeedbackMutation();

  useEffect(() => {
    if (view === 'list') {
      getFeedbacks(collectionQuery);
    }
  }, [collectionQuery, getFeedbacks, view]);

  useEffect(() => {
    if (view === 'archived') {
      getArchivedFeedbacks(collectionQuery)
    }
  }, [collectionQuery, getArchivedFeedbacks, view])
  useEffect(() => {
    getFeedbacks(collectionQuery);
  }, [collectionQuery, getFeedbacks]);

  const openModal = (type: keyof typeof modalConfig, feedBack?: Feedback) => {
    setSelectedFeedback(feedBack ?? defaultFeedback);
    setModals((prev) => ({ ...prev, [type]: true }));
  };

  const closeModal = (type: keyof typeof modalConfig) => {
    setModals((prev) => ({ ...prev, [type]: false }));
    setSelectedFeedback(defaultFeedback);
  };

     const handleAction = (action: { key: string }, feedback?: Feedback) => {
      openModal(action.key as keyof typeof modalConfig, feedback);

      if (action.key === 'delete' && feedback?.id) {
        handleDelete(feedback);
      } else if (action.key === 'restore') {
        restoreFeedback(String(feedback?.id));
      }
    };

    const handleDelete = (feedback: Feedback) => {
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
              <strong className="text-gray-800">Name:</strong>{' '}
              <span className="text-gray-700">{feedback?.name}</span>
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
          deleteFeedback(String(feedback?.id));
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
          {component(() => closeModal(key), selectedFeedback)}
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

  const config = useMemo<TableConfig<Feedback>>(
    () => ({
      columns: [
        {
          key: "name",
          name: "Name",
          render: (data: Feedback) => `${data?.name ?? ""}`,
        },
        {
          key: "subject",
          name: "Subject",
          render: (data: Feedback) => `${data?.subject ?? ""}`,
        },
        {
          key: "email",
          name: "Email",
          render: (data: Feedback) => `${data?.email ?? ""}`,
        },
        {
          key: "phone",
          name: "Phone Number",
          render: (data: Feedback) => `${data?.phone ?? ""}`,
        },
        {
          key: "message",
          name: "Message",
          render: (data: Feedback) => `${data?.message ?? ""}`,
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
      title={view === 'list' ? "Feedbacks" : 'Archived Feedbacks'}
      config={config}
      items={view === 'list' ? feedbacks?.data : archivedFeedbacks?.data}
      total={view === 'list' ? feedbacks?.total : archivedFeedbacks?.total}
      itemsLoading={view === 'list' ? isLoading : archivedFeedbacksLoading}
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
