"use client";
import {
  EmergencyContact,
  UserContactType,
} from "@/src/models/emergency-contact.model";
import EntityList from "@/src/shared/entity/entity-list";
import { CollectionQuery, Order } from "@/src/shared/models/collection.model";
import { EntityConfig } from "@/src/shared/models/entity-config.model";
import { Badge, Card, Divider, Modal } from "@mantine/core";
import { useParams } from "next/navigation";
import { JSX, useEffect, useState } from "react";
import {
  useDeleteEmergencyContactMutation,
  useLazyGetUserQuery,
} from "../_store/emergency-contact.query";
import EmergencyContactForm from "./emergency-contact-form";
import ReasonFormComponent from "./reason-form.-component";
import { notifications } from "@mantine/notifications";

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
  const [deleteEmergencyContact, { isLoading: deleting }] =
    useDeleteEmergencyContactMutation();
  const [getUser, user] = useLazyGetUserQuery();

  const [collection, setCollection] = useState<CollectionQuery>({
    skip: 0,
    top: 20,
    filter: [[{ field: "userId", value: params.id, operator: "=" }]],
    orderBy: [{ field: "createdAt", direction: "desc" }],
  });
  useEffect(() => {
    getUser({
      id: `${params?.id}`,
      includes: ["userRoles", "userRoles.role", "userContacts"],
    });
  }, [params?.id]);

  console.log(deleting);
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
      { name: "First Name", key: "firstName" },
      { name: "Middle Name", key: "middleName" },
      { name: "Last Name", key: "lastName" },
      { name: "Email", key: "email" },
      { name: "Phone", key: "phone" },
      {
        name: "Contact Type",
        key: "contactType",
        render: (data: EmergencyContact) =>
          getContactTypeBadge(data?.contactType as UserContactType),
      },
      { name: "Registration Date", key: "createdAt", isDate: true },
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
  const handleNewModal = () => {
    openModal("new");
  };
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
      <EntityList
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
      />

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
