"use client";

import { UserRole } from "@/src/models/role.model";
import EntityList from "@/src/shared/entity/entity-list";
import { CollectionQuery, Order } from "@/src/shared/models/collection.model";
import { EntityConfig } from "@/src/shared/models/entity-config.model";
import { Card, Divider, Modal } from "@mantine/core";
import { useParams } from "next/navigation";
import { JSX, useEffect, useState } from "react";
import { useLazyGetRolesQuery } from "../../role/_store/role.query";
import { useLazyGetUserQuery } from "../_store/emergency-contact.query";

export interface MappedUserRoles {
  userId: any;
  roleId: any;
  name: string;
  description: string;
  key: string;
}
export default function UserRolesComponent() {
  const [modals, setModals] = useState({
    new: false,
    edit: false,
    view: false,
    archive: false,
  });

  const params = useParams();

  const [getUser, user] = useLazyGetUserQuery();
  const [getRoles, roles] = useLazyGetRolesQuery();

  const [collection, setCollection] = useState<CollectionQuery>({
    skip: 0,
    top: 20,
    filter: [[{ field: "userId", value: params.id, operator: "=" }]],
    orderBy: [{ field: "createdAt", direction: "desc" }],
  });
  const [roleCollection, setUserCollection] = useState<CollectionQuery>({
    orderBy: [{ field: "createdAt", direction: "desc" }],
  });
  useEffect(() => {
    getUser({
      id: `${params?.id}`,
      includes: ["userRoles", "userContacts"],
    });
  }, [params?.id]);
  useEffect(() => {
    getRoles(roleCollection);
  }, [roleCollection]);
  const userRoles: MappedUserRoles[] = user?.data?.userRoles || [];
  const mappedUserRoles: MappedUserRoles[] = Array.isArray(userRoles)
    ? (userRoles
        .map((userRole) => {
          const role = roles?.data?.data.find((r) => r.id === userRole.roleId);
          return role
            ? {
                userId: userRole.userId,
                roleId: userRole.roleId,
                name: role.name,
                description: role.description,
                key: role.key,
              }
            : [];
        })
        .filter(Boolean) as MappedUserRoles[])
    : [];
  console.log("This is the roles", roles, setUserCollection);

  const config: EntityConfig<MappedUserRoles> = {
    primaryColumn: {
      key: "name",
      name: "Role Name",
      render: (data: MappedUserRoles) => `${data?.name ?? ""}`,
    },
    rootUrl: "/user",
    identity: "id",
    showDetail: false,
    visibleColumn: [
      { name: "Name", key: "name" },
      { name: "Description", key: "description" },
      { name: "Key", key: "key" },
      { name: "Created On", key: "createdAt", isDate: true },
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
  const onSearch = (data: string) => {
    setCollection((prev) => ({
      ...prev,
      search: data || "",
    }));
  };

  const openModal = (type: keyof typeof modals, role?: UserRole) => {
    console.log(role);
    setModals((prev) => ({
      ...prev,
      [type]: !prev[type],
    }));
  };

  const closeModal = (type: string) => {
    setModals((prev) => ({ ...prev, [type]: false }));
  };
  const handleAction = (action: { key: string }, data?: UserRole) => {
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

  console.log(renderModal, onSearch);
  return (
    <Card shadow="sm" padding="sm">
      <EntityList
        viewMode="list"
        parentStyle="w-full"
        showArchived={false}
        showSelector={true}
        tableKey="roles"
        title=""
        newButtonText="Assign New Role"
        total={mappedUserRoles?.length}
        collectionQuery={collection}
        config={config}
        items={mappedUserRoles}
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
            searchFrom: data ? ["name"] : [],
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
    </Card>
  );
}
