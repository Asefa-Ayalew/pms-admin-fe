"use client";
import {
  ActionIcon,
  Button,
  Card,
  Divider,
  Menu,
  Modal,
  Table,
} from "@mantine/core";
import { useEffect, useMemo, useState } from "react";
import {
  IconDotsVertical,
  IconEye,
  IconInbox,
  IconPencil,
  IconPlus,
  IconTrash,
} from "@tabler/icons-react";


import { CollectionQuery } from "@/src/shared/models/collection.model";
import { formatDate } from "@/src/shared/utils/date-utils";
import { Contact } from "@/src/models/tenant.model";
import ContactForm from "./contact-form-component";
import ReasonForm from "./reason-form.component";
import { useParams } from "next/navigation";
import { useLazyGetTenantQuery } from "../_store/tenant.query";

const defaultContact: Contact = {
  id: "",
  name: "",
  note: "",
  gender: "",
  email: "",
  phoneNumber: "",
  industry:"",
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
  archive: {
    title: "Reason",
    size: "50%",
    component: (onClose: () => void, contact: Contact) => (
      <ReasonForm id={contact?.id ?? ""} onClose={onClose} />
    ),
  },
};

export default function ContactsComponent() {
  const params = useParams();
  const [modals, setModals] = useState<
    Record<keyof typeof modalConfig, boolean>
  >({
    new: false,
    edit: false,
    view: false,
    archive: false,
  });

  const [getTenant, {data: tenant}] = useLazyGetTenantQuery();
  const [selectedContact, setSelectedContact] = useState<Contact>(defaultContact);

  useEffect(()=>{
    getTenant({id: String(params.id), includes: ['contacts']})
  }, [getTenant, params.id])
  const collection = useMemo<CollectionQuery>(
    () => ({
      skip: 0,
      top: 20,
      orderBy: [{ field: "createdAt", direction: "desc" }],
    }),
    []
  );

  const openModal = (type: keyof typeof modalConfig, contact?: Contact) => {
    setSelectedContact(contact ?? defaultContact);
    setModals((prev) => ({ ...prev, [type]: true }));
  };

  const closeModal = (type: keyof typeof modalConfig) => {
    setModals((prev) => ({ ...prev, [type]: false }));
    setSelectedContact(defaultContact);
  };

  const handleAction = (action: string, contact?: Contact) => {
    openModal(action as keyof typeof modalConfig, contact);
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
          {component(() => closeModal(key), selectedContact)}
        </Modal>
      );
    });

  return (
    <Card shadow="sm" padding="sm">
      <Button
        onClick={() => openModal("new")}
        leftSection={<IconPlus size={16} />}
        styles={{
          root: {
            width: "5rem",
            transition: "background-color 0.2s ease",
            "&:hover": {
              backgroundColor: "#ffeaea",
            },
            marginBottom: "4px",
            marginLeft: "4px",
          },
        }}
      >
        New
      </Button>

      <Table>
        <Table.Thead>
          <Table.Tr>
            <Table.Th>Name</Table.Th>
            <Table.Th>Short Code</Table.Th>
            <Table.Th>Tin</Table.Th>
            <Table.Th>Email</Table.Th>
            <Table.Th>Phone Number</Table.Th>
            <Table.Th>Industry</Table.Th>
            <Table.Th>Created At</Table.Th>
            <Table.Th style={{ width: "15%" }}>Created At</Table.Th>
            <Table.Th style={{ width: "20px" }}></Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          {tenant?.contacts?.length === 0 ? (
            <Table.Tr>
              <Table.Td colSpan={6} className="text-center py-8 text-gray-500">
                <div className="flex flex-col items-center">
                  <IconInbox size={40} />
                  <p className="mt-2">No contacts found</p>
                </div>
              </Table.Td>
            </Table.Tr>
          ) : (
            tenant?.contacts?.map((contact: Contact) => (
              <Table.Tr key={contact.id}>
                <Table.Td>{contact?.name}</Table.Td>
                <Table.Td>{contact.note}</Table.Td>
                <Table.Td>{contact?.gender}</Table.Td>
                <Table.Td>{contact?.email}</Table.Td>
                <Table.Td>{contact?.phoneNumber}</Table.Td>
                <Table.Td>{contact?.industry}</Table.Td>
                <Table.Td>{formatDate(contact.createdAt)}</Table.Td>
                <Table.Td>
                  <Menu shadow="md" width={160} position="bottom-end" withArrow>
                    <Menu.Target>
                      <ActionIcon variant="subtle" size="sm">
                        <IconDotsVertical size={18} />
                      </ActionIcon>
                    </Menu.Target>
                   <Menu.Dropdown>
                      <Menu.Item
                        leftSection={<IconEye size={14} />}
                        onClick={() => handleAction("view", contact)}
                      >
                        View
                      </Menu.Item>
                      <Menu.Item
                        leftSection={<IconPencil size={14} />}
                        onClick={() => handleAction("edit", contact)}
                      >
                        Edit
                      </Menu.Item>
                      <Menu.Item
                        leftSection={<IconTrash size={14} />}
                        color="red"
                        onClick={() => handleAction("archive", contact)}
                      >
                        Delete
                      </Menu.Item>
                    </Menu.Dropdown>
                  </Menu>
                </Table.Td>
              </Table.Tr>
            ))
          )}
        </Table.Tbody>
      </Table>

      {renderModals()}
    </Card>
  );
}
