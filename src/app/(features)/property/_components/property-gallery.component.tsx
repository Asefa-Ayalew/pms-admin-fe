"use client";
import { Divider, Modal } from "@mantine/core";
import { useCallback, useEffect, useMemo, useState } from "react";
import { IconEye } from "@tabler/icons-react";
import { galleryDefaultValue } from "@/src/schemas/property-schema";
import { useParams } from "next/navigation";
import {
  useLazyGetPropertyQuery,
} from "../_store/property.query";
import { Gallery } from "@/src/models/property.model";
import { CollectionQuery } from "@/src/shared/models/collection.model";
import PropertyGalleryForm from "./gallery-form.component";
import { EntityConfig } from "@/src/shared/models/entity-list-config";
import InnerTable from "@/src/shared/table/inner-table";

const defaultGallery: Gallery = {
  propertyId: "",
  description: "",
  isActive: false,
};
const modalConfig = {
  preview: {
    title: "Preview Gallery",
    size: "60%",
    component: (onClose: () => void, gallery: Gallery) => (
      <PropertyGalleryForm
        onClose={onClose}
        data={gallery}
      />
    ),
  },
};

export default function PropertyGalleryComponent() {
  const params = useParams();
  const [modal, setModals] = useState({
    new: false,
    edit: false,
    preview: false,
  });

  const [getProperty, { data: property }] = useLazyGetPropertyQuery();

  const [selectedGallery, setSelectedGallery] =
    useState<Gallery>(galleryDefaultValue);

  const [collection, setCollection] = useState<CollectionQuery>({
    skip: 0,
    top: 20,
    orderBy: [{ field: "createdAt", direction: "desc" }],
  });

  useEffect(() => {
    getProperty({ id: String(params.id), includes: ["galleries"] });
  }, [params, getProperty]);

  const config = useMemo<EntityConfig<Gallery>>(
    () => ({
      visibleColumn: [
        {
          key: "originalName",
          name: "FileName",
          render: (data: Gallery) => `${data?.photo?.originalName ?? ""}`,
        },
        {
          key: "description",
          name: "Description",
          render: (data: Gallery) => `${data?.description ?? ""}`,
        },
        {
          key: "isActive",
          name: "Is Active",
          render: (data: Gallery) => `${data?.isActive ?? ""}`,
        },
        {
          key: "createdAt",
          name: "Created At",
          isDate: true,
        },
      ],
      actions: [
        { label: "Preview", icon: IconEye, size: "16", key: "preview" }
      ],
    }),
    []
  );

  const closeModal = (type: keyof typeof modalConfig) => {
    setModals((prev) => ({ ...prev, [type]: false }));
    setSelectedGallery(defaultGallery);
  };

  const handlePaginationChange = useCallback(
    (pageIndex: number, pageSize: number) => {
      setCollection((prev) => ({
        ...prev,
        skip: pageIndex - 1,
        top: pageSize,
      }));
    },
    []
  );
  const onSearch = (search: string) => {
    setCollection((prev) => ({
      ...prev,
      skip: 0,
      search: search,
    }));
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const onFilter = (filter: any[]) => {
    setCollection((prev) => ({
      ...prev,
      filter,
    }));
  };

  const onOrder = (order: { field: string; direction: "desc" | "asc" }) => {
    setCollection((prev) => ({
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
          {component(() => closeModal(key), selectedGallery)}
        </Modal>
      );
    });
  return (
    <InnerTable
      config={config}
      items={property?.galleries || []}
      total={property?.galleries?.length || 0}
      collectionQuery={collection}
      showArchivedList={false}
      showNewButton={false}
      onPaginationChange={handlePaginationChange}
      onSearch={onSearch}
      onOrder={onOrder}
      onFilterChange={onFilter}
      renderModals={renderModals}
    />
  );
}
