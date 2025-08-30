"use client";
import { useCallback, useEffect, useMemo, useState } from "react";
import type { CollectionQuery } from "@/src/shared/models/collection.model";
import InnerTable from "@/src/shared/table/inner-table";
import { Modal, Divider } from "@mantine/core";
import { IconEye, IconPencil, IconTrash } from "@tabler/icons-react";
import ContactForm from "./contact-form-component";
import {
  useLazyGetTenantQuery,
} from "../_store/tenant.query";
import { modals } from "@mantine/modals";
import { EntityConfig } from "@/src/shared/models/entity-list-config";
import { useDeleteContactMutation } from "../_store/contact.query";
import { Contact } from "@/src/models/tenant.model";
import { useParams } from "next/navigation";

const defaultContact: Contact = {
  id: "",
  name: "",
  email: "",
  secondaryEmails: [],
  phoneNumber: "",
  secondaryPhoneNumbers: [],
  address: undefined,
  gender: "",
  note: "",
  industry: "",
  responsibility: ""
};

const modalConfig = {
  new: {
    title: "Create Contact",
    size: "60%",
    component: (onClose: () => void) => (
      <ContactForm editMode="new" onClose={onClose} />
    ),
  },
  edit: {
    title: "Edit Contact",
    size: "60%",
    component: (onClose: () => void, contact: Contact) => (
      <ContactForm editMode="detail" onClose={onClose} data={contact} />
    ),
  },
  view: {
    title: "View Contact",
    size: "60%",
    component: (onClose: () => void, contact: Contact) => (
      <ContactForm editMode="view" onClose={onClose} data={contact} />
    ),
  },
};

export default function ContactsComponent() {
  const params = useParams();
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
  });

  const [selectedContact, setSelectedContact] =
    useState<Contact>(defaultContact);

  const [getTenant, { data: tenant, isLoading }] = useLazyGetTenantQuery();

  const [deleteContact] = useDeleteContactMutation();

  useEffect(() => {
    getTenant({ id: String(params.id), includes: ["contacts"] });
  }, [getTenant, params.id]);

  const openModal = (type: keyof typeof modalConfig, contact?: Contact) => {
    setSelectedContact(contact ?? defaultContact);
    setModals((prev) => ({ ...prev, [type]: true }));
  };

  const closeModal = (type: keyof typeof modalConfig) => {
    setModals((prev) => ({ ...prev, [type]: false }));
    setSelectedContact(defaultContact);
  };

  const handleAction = (action: { key: string }, contact?: Contact) => {
    openModal(action.key as keyof typeof modalConfig, contact);

    if (action.key === "delete" && contact?.id) {
      handleDelete(contact);
    }
  };

  const handleDelete = (contact: Contact) => {
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
            <strong className="text-gray-800">Charge Code:</strong>{" "}
            <span className="text-gray-700">{contact?.name}</span>
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
        deleteContact({id: String(contact?.id), tenantId: String(params.id)});
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

// eslint-disable-next-line @typescript-eslint/no-explicit-any
  const onFilter = (filter: any[]) => {
    console.log("filter", filter);
    setCollectionQuery((prev) => ({
      ...prev,
      filter,
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
          {component(() => closeModal(key), selectedContact)}
        </Modal>
      );
    });

  const config = useMemo<EntityConfig<Contact>>(
    () => ({
      visibleColumn: [
        {
          key: "name",
          name: "Name",
          render: (data: Contact) => `${data?.name ?? ""}`,
        },
        {
          key: "email",
          name: "Email",
          render: (data: Contact) => `${data?.email}`,
        },
        {
          key: "phoneNumber",
          name: "Phone Number",
          render: (data: Contact) => `${data?.phoneNumber ?? ""}`,
        },
        {
          key: "gender",
          name: "Gender",
          render: (data: Contact) => `${data?.gender ?? ""}`,
        },
        {
          key: "address?.country",
          name: "Country",
          render: (data: Contact) => `${data?.address?.country ?? ""}`,
        },
        {
          key: "address?.city",
          name: "City",
          render: (data: Contact) => `${data?.address?.city ?? ""}`,
        },
      ],
      actions: [
        {
          label: "Show More",
          key: "view",
          icon: IconEye,
          size: "16",
        },
        {
          label: "Edit",
          key: "edit",
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
      ],
    }),
    []
  );

  return (
    <InnerTable
      title={"Contacts"}
      config={config}
      items={tenant?.contacts}
      total={tenant?.contacts?.length}
      itemsLoading={isLoading}
      collectionQuery={collectionQuery}
      onPaginationChange={handlePaginationChange}
      showArchivedList={false}
      onSearch={onSearch}
      onOrder={onOrder}
      onFilterChange={onFilter}
      renderModals={renderModals}
      handleAction={handleAction}
    />
  );
}
