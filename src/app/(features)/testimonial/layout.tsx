"use client";
import { useCallback, useEffect, useMemo, useState } from "react";
import type { CollectionQuery } from "@/src/shared/models/collection.model";
import type { Actions } from "@/src/shared/models/table-config";
import { Modal, Divider } from "@mantine/core";
import { IconEye, IconPencil, IconTrash } from "@tabler/icons-react";
import ReasonForm from "./_component/reason-form.component";
import { Testimonial } from "@/src/models/testimonial.model";
import TestimonialForm from "./_component/testimonial-form.component";
import {
  useDeleteTestimonialMutation,
  useLazyGetArchivedTestimonialsQuery,
  useLazyGetTestimonialsQuery,
  useRestoreTestimonialMutation,
} from "./_store/testimonial.query";
import { modals } from "@mantine/modals";
import EntityTable from "@/src/shared/table/entity-table";
import { EntityConfig } from "@/src/shared/models/entity-list-config";

const defaultTestimonial: Testimonial = {
  id: "",
  customerName: "",
  customerPosition: "",
  message: "",
  rating: 1,
};

const modalConfig = {
  new: {
    title: "New Testimonial",
    size: "60%",
    component: (onClose: () => void) => (
      <TestimonialForm editMode="new" onClose={onClose} />
    ),
  },
  edit: {
    title: "Edit Testimonial",
    size: "60%",
    component: (onClose: () => void, testimonial: Testimonial) => (
      <TestimonialForm editMode="detail" onClose={onClose} data={testimonial} />
    ),
  },
  view: {
    title: "View Testimonial",
    size: "60%",
    component: (onClose: () => void, testimonial: Testimonial) => (
      <TestimonialForm editMode="view" onClose={onClose} data={testimonial} />
    ),
  },
  archive: {
    title: "Reason",
    size: "50%",
    component: (onClose: () => void, testimonial: Testimonial) => (
      <ReasonForm id={testimonial?.id ?? ""} onClose={onClose} />
    ),
  },
};

export default function TestimonialsComponent() {
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

  const [selectedTestimonial, setSelectedTestimonial] =
    useState<Testimonial>(defaultTestimonial);
  const [view, setView] = useState<"list" | "archived">("list");

  const [getTestimonials, { data: testimonials, isLoading }] =
    useLazyGetTestimonialsQuery();
  const [
    getArchivedTestimonials,
    { data: archivedTestimonials, isLoading: archivedTestimonialsLoading },
  ] = useLazyGetArchivedTestimonialsQuery();

  const [restoreTestimonial] = useRestoreTestimonialMutation();
  const [deleteTestimonial] = useDeleteTestimonialMutation();

  useEffect(() => {
    if (view === "list") {
      getTestimonials(collectionQuery);
    }
  }, [collectionQuery, getTestimonials, view]);

  useEffect(() => {
    if (view === "archived") {
      getArchivedTestimonials(collectionQuery);
    }
  }, [collectionQuery, getArchivedTestimonials, view]);

  const openModal = (
    type: keyof typeof modalConfig,
    testimonial?: Testimonial
  ) => {
    setSelectedTestimonial(testimonial ?? defaultTestimonial);
    setModals((prev) => ({ ...prev, [type]: true }));
  };

  const closeModal = (type: keyof typeof modalConfig) => {
    setModals((prev) => ({ ...prev, [type]: false }));
    setSelectedTestimonial(defaultTestimonial);
  };

  const handleAction = (action: { key: string }, testimonial?: Testimonial) => {
    openModal(action.key as keyof typeof modalConfig, testimonial);

    if (action.key === "delete" && testimonial?.id) {
      handleDelete(testimonial);
    } else if (action.key === "restore") {
      restoreTestimonial(String(testimonial?.id));
    }
  };

  const handleDelete = (testimonial: Testimonial) => {
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
            Are you sure you want to delete this{" "}
            <span className="text-red-600 font-medium">document type</span>?
            This action
            <strong> cannot </strong> be undone.
          </p>
          <p>
            <strong className="text-gray-800">Message:</strong>{" "}
            <span className="text-gray-700">{testimonial?.message}</span>
          </p>
        </div>
      ),
      labels: {
        confirm: "Delete",
        cancel: "Cancel",
      },
      confirmProps: {
        color: "red",
        variant: "filled",
      },
      onConfirm: () => {
        deleteTestimonial(String(testimonial?.id));
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
          {component(() => closeModal(key), selectedTestimonial)}
        </Modal>
      );
    });

const config = useMemo<EntityConfig<Testimonial>>(() => {
  const listActions: Actions[] = [
    { label: "Edit", key: "edit", icon: IconPencil, size: "16" },
    { label: "Archive", key: "archive", icon: IconTrash, size: "16", type: "danger" },
  ];

  const archivedActions: Actions[] = [
    { label: "Restore", key: "restore", icon: IconPencil, size: "16" },
    { label: "Delete", key: "delete", icon: IconTrash, size: "16", type: "danger" },
  ];

  return {
    visibleColumn: [
      { key: "customerName", name: "Customer Name", render: (d) => d?.customerName ?? "" },
      { key: "customerPosition", name: "Customer Position", render: (d) => d?.customerPosition ?? "" },
      { key: "message", name: "Message", render: (d) => d?.message ?? "" },
      { key: "rating", name: "Rating", render: (d) => d?.rating ?? "" },
    ],
    actions: [
      { label: "Show More", key: "view", icon: IconEye, size: "16" },
      ...(view === "list" ? listActions : archivedActions),
    ],
  };
}, [view]); 


  return (
    <EntityTable
      title={view === "list" ? "Testimonials" : "Archived Testimonials"}
      config={config}
      items={view === "list" ? testimonials?.data : archivedTestimonials?.data}
      total={
        view === "list" ? testimonials?.total : archivedTestimonials?.total
      }
      itemsLoading={view === "list" ? isLoading : archivedTestimonialsLoading}
      collectionQuery={collectionQuery}
      view={view}
      showNewButton={view === "list"}
      onViewChange={setView}
      onPaginationChange={handlePaginationChange}
      onSearch={onSearch}
      onOrder={onOrder}
      renderModals={renderModals}
      handleAction={handleAction}
    />
  );
}
