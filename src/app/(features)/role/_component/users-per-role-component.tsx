"use client";
import { UserContactType } from "@/src/models/emergency-contact.model";
import EntityList from "@/src/shared/entity/entity-list";
import { CollectionQuery, Order } from "@/src/shared/models/collection.model";
import { EntityConfig } from "@/src/shared/models/entity-config.model";
import { Badge, Card, Divider, Modal } from "@mantine/core";
import { useParams } from "next/navigation";
import { JSX, useEffect, useState } from "react";

import { User } from "@/src/models/user.model";
import { useLazyGetUsersByRoleQuery } from "../_store/role.query";
import ViewRoleUsersComponent from "./view-role-users-component";

export default function UsersPerRoleComponent() {
  const [modals, setModals] = useState({
    new: false,
    edit: false,
    view: false,
    archive: false,
  });

  const defaultUsersPerRoleValue: User = {
    firstName: "",
    middleName: "",
    lastName: "",
    phone: "",
    gender: "Male",
    departmentId: "",
    employeeNumber: "",
    isEmployee: true,
    startDate: new Date(),
    userRoles: [],
    address: {
      country: "",
      city: "",
      subcity: "",
      woreda: "",
      kebele: "",
    },
    email: "",
    dateOfBirth: new Date(),
    endDate: new Date(),
    password: "",
  };
  const params = useParams();
  const [selectedUser, setSelectedUser] = useState<User>(
    defaultUsersPerRoleValue
  );
  const [getRoleUsers, roleUsers] = useLazyGetUsersByRoleQuery();
  const [collection, setCollection] = useState<CollectionQuery>({
    skip: 0,
    top: 20,
    filter: [[{ field: "departmentId", value: params.id, operator: "=" }]],
    orderBy: [{ field: "createdAt", direction: "desc" }],
  });
  const [userCollection, setUserCollection] = useState<CollectionQuery>({
    id: `${params?.id}`,
    // orderBy: [{ field: "createdAt", direction: "desc" }],
  });

  useEffect(() => {
    getRoleUsers(userCollection);
  }, [userCollection, getRoleUsers, setUserCollection]);

  const _getContactTypeBadge = (contactType: UserContactType) => {
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

  const openModal = (type: keyof typeof modals, contact?: User) => {
    setSelectedUser(contact ?? defaultUsersPerRoleValue);
    setModals((prev) => ({
      ...prev,
      [type]: !prev[type],
    }));
  };

  const closeModal = (type: string) => {
    setModals((prev) => ({ ...prev, [type]: false }));
    setSelectedUser(defaultUsersPerRoleValue);
  };

  const users = roleUsers?.data;

  const config: EntityConfig<User> = {
    primaryColumn: {
      key: "name",
      name: "User Name",
      render: (data: User) => {
        const fullName = [data?.firstName, data?.middleName, data?.lastName]
          .filter((name) => name && name.trim() !== "")
          .join(" ");

        return fullName || "N/A";
      },
    },
    rootUrl: "/departments",
    identity: "id",
    showDetail: false,
    visibleColumn: [
      {
        key: "",
        name: "User Name",
        render: (data: User) =>
          `${data?.firstName ?? ""} ${data?.middleName ?? ""} ${
            data?.lastName ?? ""
          }`,
      },

      { name: "Email", key: "email" },
      { name: "Phone", key: "phone" },
      {
        key: "gender",
        name: "Gender",
        render: (value) => {
          return <span className="capitalize">{value?.gender}</span>;
        },
      },
      { key: "employeeNumber", name: "User Employee Number" },
      { key: "startDate", name: "Employment Date", isDate: true },
      { key: "tin", name: "TIN" },
      { name: "Registration Date", key: "createdAt", isDate: true },
    ],
    newAction: () => openModal("new"),
    actions: [
      { label: "Show More", icon: "IconEye", key: "showMore", type: "primary" },
    ],
  };

  const handleAction = (action: { key: string }, data?: User) => {
    switch (action.key) {
      case "showMore":
        openModal("view", data);
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
        tableKey="users"
        title=""
        newButtonText="New"
        total={users?.count || 0}
        collectionQuery={collection}
        config={config}
        items={users?.data}
        itemsLoading={users?.isLoading || users?.isFetching}
        showNewButton={false}
        showNewModal={false}
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
        "view",
        `Additional Informations of '${selectedUser?.firstName} ${selectedUser?.middleName} ${selectedUser?.lastName}'`,
        "50%",
        <ViewRoleUsersComponent
          editMode="view"
          onClose={() => closeModal("view")}
          data={selectedUser}
        />
      )}
    </Card>
  );
}
