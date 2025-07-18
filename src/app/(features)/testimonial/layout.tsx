"use client";
import { useCallback, useEffect, useMemo, useState } from "react";
import type { CollectionQuery } from "@/src/shared/models/collection.model";
import SharedTable from "@/src/shared/table/shared-table";
import type { TableConfig } from "@/src/shared/models/table-config";
import { Modal, Divider } from "@mantine/core";
import { IconEye, IconPencil, IconTrash } from "@tabler/icons-react";
import ReasonForm from "./_component/reason-form.component";
import { Testimonial } from "@/src/models/testimonial.model";
import TestimonialForm from "./_component/testimonial-form.component";
import { useLazyGetTestimonialsQuery } from "./_store/testimonial.query";

const defaultTestimonial: Testimonial = {
  id: "",
  customerName: "",
  customerPosition: "",
  message: "",
  rating: 1,
};

const modalConfig = {
  new: {
    title: "New Feed Back",
    size: "60%",
    component: (onClose: () => void) => (
      <TestimonialForm editMode="new" onClose={onClose} />
    ),
  },
  edit: {
    title: "Edit Feed Back",
    size: "60%",
    component: (onClose: () => void, testimonial: Testimonial) => (
      <TestimonialForm editMode="detail" onClose={onClose} data={testimonial} />
    ),
  },
  view: {
    title: "View Feed Back",
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

  const [modals, setModals] = useState<
    Record<keyof typeof modalConfig, boolean>
  >({
    new: false,
    edit: false,
    view: false,
    archive: false,
  });

  const [selectedTestimonial, setSelectedTestimonial] =
    useState<Testimonial>(defaultTestimonial);
  const [getTestimonials, { data: testimonials, isLoading }] = useLazyGetTestimonialsQuery();

  useEffect(() => {
    getTestimonials(collectionQuery);
  }, [collectionQuery, getTestimonials]);

  const openModal = (type: keyof typeof modalConfig, testimonial?: Testimonial) => {
    setSelectedTestimonial(testimonial ?? defaultTestimonial);
    setModals((prev) => ({ ...prev, [type]: true }));
  };

  const closeModal = (type: keyof typeof modalConfig) => {
    setModals((prev) => ({ ...prev, [type]: false }));
    setSelectedTestimonial(defaultTestimonial);
  };

  const handleAction = (action: { key: string }, testimonial?: Testimonial) => {
    openModal(action.key as keyof typeof modalConfig, testimonial);
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
          {component(() => closeModal(key), selectedTestimonial)}
        </Modal>
      );
    });

  const config = useMemo<TableConfig<Testimonial>>(
    () => ({
      columns: [
        {
          key: "customerName",
          name: "Customer Name",
          render: (data: Testimonial) => `${data?.customerName ?? ""}`,
        },
        {
          key: "customerPosition",
          name: "Customer Position",
          render: (data: Testimonial) => `${data?.customerPosition ?? ""}`,
        },
        {
          key: "message",
          name: "Message",
          render: (data: Testimonial) => `${data?.message ?? ""}`,
        },
        {
          key: "rating",
          name: "Rating",
          render: (data: Testimonial) => `${data?.rating ?? ""}`,
        },
        {
          key: "message",
          name: "Message",
          render: (data: Testimonial) => `${data?.message ?? ""}`,
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
      items={testimonials?.data}
      total={testimonials?.data?.length}
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
