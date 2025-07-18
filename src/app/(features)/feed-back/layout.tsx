"use client";
import { useCallback, useEffect, useMemo, useState } from "react";
import type { CollectionQuery } from "@/src/shared/models/collection.model";
import FeedBackForm from "./_component/feed-back-form.component";
import { useLazyGetFeedBacksQuery } from "./_store/feed-back.query";
import SharedTable from "@/src/shared/table/shared-table";
import type { TableConfig } from "@/src/shared/models/table-config";
import { Modal, Divider } from "@mantine/core";
import { IconEye, IconPencil, IconTrash } from "@tabler/icons-react";
import ReasonForm from "./_component/reason-form.component";
import { FeedBack } from "@/src/models/feed-back.model";

const defaultFeedBack: FeedBack = {
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
      <FeedBackForm editMode="new" onClose={onClose} />
    ),
  },
  edit: {
    title: "Edit Feed Back",
    size: "60%",
    component: (onClose: () => void, feedBack: FeedBack) => (
      <FeedBackForm editMode="detail" onClose={onClose} data={feedBack} />
    ),
  },
  view: {
    title: "View Feed Back",
    size: "60%",
    component: (onClose: () => void, feedBack: FeedBack) => (
      <FeedBackForm editMode="view" onClose={onClose} data={feedBack} />
    ),
  },
  archive: {
    title: "Reason",
    size: "50%",
    component: (onClose: () => void, feedBack: FeedBack) => (
      <ReasonForm id={feedBack?.id ?? ""} onClose={onClose} />
    ),
  },
};

export default function FeedBacksComponent() {
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

  const [selectedFeedBack, setSelectedFeedBack] =
    useState<FeedBack>(defaultFeedBack);
  const [getFeedBacks, { data: feedBacks, isLoading }] = useLazyGetFeedBacksQuery();

  useEffect(() => {
    getFeedBacks(collectionQuery);
  }, [collectionQuery, getFeedBacks]);

  const openModal = (type: keyof typeof modalConfig, feedBack?: FeedBack) => {
    setSelectedFeedBack(feedBack ?? defaultFeedBack);
    setModals((prev) => ({ ...prev, [type]: true }));
  };

  const closeModal = (type: keyof typeof modalConfig) => {
    setModals((prev) => ({ ...prev, [type]: false }));
    setSelectedFeedBack(defaultFeedBack);
  };

  const handleAction = (action: { key: string }, feedBack?: FeedBack) => {
    openModal(action.key as keyof typeof modalConfig, feedBack);
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
          {component(() => closeModal(key), selectedFeedBack)}
        </Modal>
      );
    });

  const config = useMemo<TableConfig<FeedBack>>(
    () => ({
      columns: [
        {
          key: "name",
          name: "Name",
          render: (data: FeedBack) => `${data?.name ?? ""}`,
        },
        {
          key: "subject",
          name: "Subject",
          render: (data: FeedBack) => `${data?.subject ?? ""}`,
        },
        {
          key: "email",
          name: "Email",
          render: (data: FeedBack) => `${data?.email ?? ""}`,
        },
        {
          key: "phone",
          name: "Phone Number",
          render: (data: FeedBack) => `${data?.phone ?? ""}`,
        },
        {
          key: "message",
          name: "Message",
          render: (data: FeedBack) => `${data?.message ?? ""}`,
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
      title={"Feed Backs"}
      config={config}
      items={feedBacks?.data}
      total={feedBacks?.data?.length}
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
