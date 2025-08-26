"use client";
import {
  EmergencyContact,
  UserContactType,
} from "@/src/models/emergency-contact.model";
import { EntityConfig } from "@/src/shared/models/entity-config.model";
import {
  ActionIcon,
  Badge,
  Button,
  Card,
  Divider,
  Menu,
  Modal,
  Table,
} from "@mantine/core";
import { useParams } from "next/navigation";
import { JSX, useEffect, useState } from "react";
import {
  useDeleteEmergencyContactMutation,
  useLazyGetUserQuery,
} from "../_store/emergency-contact.query";
import EmergencyContactForm from "./emergency-contact-form";
import ReasonFormComponent from "./reason-form.-component";
import { notifications } from "@mantine/notifications";
import {
  IconDotsVertical,
  IconEdit,
  IconEye,
  IconInbox,
  IconPlus,
  IconTrash,
} from "@tabler/icons-react";

export default function EmergencyContactsComponent() {
  const [modals, setModals] = useState({
    new: false,
    edit: false,
    view: false,
    archive: false,
  });

  const defaultEmergencyContactValue = {
    firstName: "",
    middleName: "",
    lastName: "",
    phone: "",
    email: "",
    userId: "",
    contactType: UserContactType.EMERGENCY,
    address: {
      country: "",
      city: "",
      subcity: "",
      woreda: "",
      kebele: "",
    },
  };
  const params = useParams();
  const [selectedEmergencyContact, setSelectedEmergencyContact] =
    useState<EmergencyContact>(defaultEmergencyContactValue);
  const [deleteEmergencyContact] =
    useDeleteEmergencyContactMutation();
  const [getUser, user] = useLazyGetUserQuery();

  useEffect(() => {
    getUser({
      id: `${params?.id}`,
      includes: ["userRoles", "userRoles.role", "userContacts"],
    });
  }, [getUser, params?.id]);

 
  const getContactTypeBadge = (contactType: UserContactType) => {
    const badgeColors: Record<UserContactType, string> = {
      [UserContactType.BAIL]: "orange",
      [UserContactType.EMERGENCY]: "red",
      [UserContactType.FAMILY]: "blue",
      [UserContactType.FRIEND]: "green",
      [UserContactType.OTHER]: "gray",
    };

    return (
      <Badge
        color={badgeColors[contactType] || "gray"}
        size="lg"
        radius="lg"
        variant="light"
      >
        {contactType.toUpperCase()}
      </Badge>
    );
  };

  const openModal = (type: keyof typeof modals, contact?: EmergencyContact) => {
    setSelectedEmergencyContact(contact ?? defaultEmergencyContactValue);
    setModals((prev) => ({
      ...prev,
      [type]: !prev[type],
    }));
  };

  const closeModal = (type: string) => {
    setModals((prev) => ({ ...prev, [type]: false }));
    setSelectedEmergencyContact(defaultEmergencyContactValue);
    getUser({
      id: `${params?.id}`,
      includes: ["userRoles", "userRoles.role", "userContacts"],
    });
  };

  const contacts = user?.data?.userContacts;

  const config: EntityConfig<EmergencyContact> = {
    primaryColumn: {
      key: "name",
      name: "Contact Name",
      render: (data: EmergencyContact) => {
        const fullName = [data?.firstName, data?.middleName, data?.lastName]
          .filter((name) => name && name.trim() !== "")
          .join(" ");

        return fullName || "N/A";
      },
    },
    rootUrl: "/user",
    identity: "id",
    showDetail: false,
    visibleColumn: [
      { name: "Email", key: "email" },
      { name: "Phone", key: "phone" },
      {
        name: "Contact Type",
        key: "contactType",
        render: (data: EmergencyContact) =>
          getContactTypeBadge(data?.contactType as UserContactType),
      },
      { name: "Created At", key: "createdAt", isDate: true },
    ],
    newAction: () => openModal("new"),
    actions: [
      { label: "Show More", icon: "IconEye", key: "showMore", type: "primary" },
      {
        label: "Edit",
        icon: "IconEdit",
        key: "edit",
        type: "primary",
        divider: true,
      },
      { label: "Delete", icon: "IconTrash", key: "delete", type: "danger" },
    ],
  };

  const onDelete = async (id: string) => {
    try {
      await deleteEmergencyContact(id).unwrap();
      notifications.show({
        title: "Success",
        message: "Successfully Deleted",
        color: "green",
      });
    } catch {
      notifications.show({
        title: "Error",
        message: "Not Successfully Deleted",
        color: "red",
      });
    }
  };
  console.log(onDelete);
  const handleAction = (action: { key: string }, data?: EmergencyContact) => {
    switch (action.key) {
      case "showMore":
        openModal("view", data);
        break;
      case "edit":
        openModal("edit", data);
        break;
      case "delete":
        openModal("archive", data);
        break;
      default:
        console.warn("Unknown action:", action);
    }
  };
  // const handleNewModal = () => {
  //   openModal("new");
  // };
  const renderModal = (
    type: keyof typeof modals,
    title: string,
    size: string,
    content: JSX.Element
  ) => (
    <Modal
      opened={modals[type]}
      onClose={() => closeModal(type)}
      title={title}
      centered
      size={size}
    >
      <Divider />
      {content}
    </Modal>
  );

  return (
    <Card shadow="sm" padding="sm">
      {/* <EntityList
        viewMode="list"
        parentStyle="w-full"
        showArchived={false}
        showSelector={false}
        tableKey="contacts"
        title=""
        newButtonText="New"
        total={contacts?.length || 0}
        collectionQuery={collection}
        config={config}
        items={contacts}
        showNewButton={false}
        showNewModal={true}
        initialPage={1}
        defaultPageSize={collection.top}
        pageSize={[20, 30, 50, 100]}
        onPaginationChange={(skip: number, top: number) => {
          const after = (skip - 1) * top;
          setCollection({ ...collection, skip: after, top: top });
        }}
        onSearch={(data: string) => {
          setCollection({
            ...collection,
            search: data || "",
            searchFrom: data ? ["firstName", "middleName", "lastName"] : [],
          });
        }}
        onFilterChange={(
          data: { field: string; value: string | number | boolean }[]
        ) => {
          if (data.length > 0) {
            setCollection({ ...collection, withArchived: true });
          } else {
            setCollection({ ...collection, withArchived: false });
          }
        }}
        onOrder={(data: Order) =>
          setCollection({ ...collection, orderBy: [data] })
        }
        handleAction={handleAction}
        handleNewModal={handleNewModal}
      /> */}
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
      <Table
  className="mantine-table-optimized border rounded-lg shadow-sm"
  striped
  highlightOnHover
  withColumnBorders
>
  <Table.Thead className="bg-gray-50 text-gray-700 text-sm font-semibold">
    <Table.Tr>
      {/* Primary Column */}
      <Table.Th
        style={{
          position: "sticky",
          left: 0,
          zIndex: 3,
          background: "white",
          boxShadow: "2px 0 4px rgba(0, 0, 0, 0.05)",
        }}
      >
        {config.primaryColumn.name}
      </Table.Th>

      {/* Dynamic Visible Columns */}
      {config.visibleColumn
        .filter((col) => col.key !== config.primaryColumn.key)
        .map((col) => (
          <Table.Th
            key={Array.isArray(col.key) ? col.key.join(",") : col.key}
            className="whitespace-nowrap px-4 py-2"
          >
            {col.name}
          </Table.Th>
        ))}

      {/* Actions */}
      <Table.Th
        style={{
          position: "sticky",
          right: 0,
          zIndex: 3,
          background: "white",
          width: "40px",
          boxShadow: "-2px 0 4px rgba(0, 0, 0, 0.05)",
        }}
      />
    </Table.Tr>
  </Table.Thead>

  <Table.Tbody>
    {contacts?.length === 0 ? (
      <Table.Tr>
        <Table.Td
          colSpan={config.visibleColumn.length + 2}
          className="text-center py-12 text-gray-500"
        >
          <div className="flex flex-col items-center">
            <IconInbox size={40} className="mb-2 text-gray-400" />
            <p className="text-sm">No users found</p>
          </div>
        </Table.Td>
      </Table.Tr>
    ) : (
      contacts?.map((contact) => (
        <Table.Tr
          key={String(contact[config.identity as keyof EmergencyContact] ?? "")}
          className="hover:bg-gray-50 transition-colors"
        >
          {/* Primary Column */}
          <Table.Td
            style={{
              position: "sticky",
              left: 0,
              zIndex: 2,
              background: "white",
              boxShadow: "2px 0 4px rgba(0, 0, 0, 0.03)",
            }}
            className="font-medium text-gray-800"
          >
            {config.primaryColumn.render
              ? config.primaryColumn.render(contact)
              : null}
          </Table.Td>

          {/* Dynamic Visible Columns */}
          {config.visibleColumn
            .filter((col) => col.key !== config.primaryColumn.key)
            .map((col) => (
              <Table.Td
                key={Array.isArray(col.key) ? col.key.join(",") : col.key}
                className="text-sm text-gray-700 px-4 py-2"
              >
                {col.render
                  ? col.render(contact)
                  : typeof col.key === "string"
                    ? contact[col.key as keyof EmergencyContact]
                    : Array.isArray(col.key)
                      ? col.key
                          .map((k) => contact[k as keyof EmergencyContact])
                          .join(" ")
                      : null}
              </Table.Td>
            ))}

          {/* Actions */}
          <Table.Td
            style={{
              position: "sticky",
              right: 0,
              zIndex: 2,
              background: "white",
              boxShadow: "-2px 0 4px rgba(0, 0, 0, 0.03)",
            }}
          >
            <Menu shadow="md" width={160} position="bottom-end" withArrow>
              <Menu.Target>
                <ActionIcon
                  variant="light"
                  size="sm"
                  aria-label="Actions"
                  className="text-gray-600 hover:text-black"
                >
                  <IconDotsVertical size={18} />
                </ActionIcon>
              </Menu.Target>
              <Menu.Dropdown>
                <Menu.Item
                  leftSection={<IconEye size={14} />}
                  onClick={() => handleAction({ key: "showMore" }, contact)}
                >
                  Show More
                </Menu.Item>
                <Menu.Item
                  leftSection={<IconEdit size={14} color="green" />}
                  onClick={() => handleAction({ key: "edit" }, contact)}
                >
                  Edit
                </Menu.Item>
                <Menu.Item
                  leftSection={<IconTrash size={14} color="red" />}
                  onClick={() => handleAction({ key: "delete" }, contact)}
                  className="text-red-600"
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


      {renderModal(
        "new",
        "Create Emergency Contact",
        "50%",
        <EmergencyContactForm
          editMode="new"
          onClose={() => closeModal("new")}
        />
      )}
      {renderModal(
        "edit",
        "Edit Emergency Contact",
        "50%",
        <EmergencyContactForm
          editMode="detail"
          contactId={selectedEmergencyContact?.id}
          onClose={() => closeModal("edit")}
          data={selectedEmergencyContact}
        />
      )}
      {renderModal(
        "view",
        "View Emergency Contact",
        "50%",
        <EmergencyContactForm
          editMode="view"
          onClose={() => closeModal("view")}
          data={selectedEmergencyContact}
        />
      )}
      {renderModal(
        "archive",
        "Reason",
        "50%",
        <ReasonFormComponent
          type="user-contact"
          id={selectedEmergencyContact?.id ?? ""}
          onClose={() => closeModal("archive")}
        />
      )}
    </Card>
  );
}
