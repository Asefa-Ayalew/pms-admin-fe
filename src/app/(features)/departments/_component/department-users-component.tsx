"use client";
import { UserContactType } from "@/src/models/emergency-contact.model";
import EntityList from "@/src/shared/entity/entity-list";
import { CollectionQuery, Order } from "@/src/shared/models/collection.model";
import { EntityConfig } from "@/src/shared/models/entity-config.model";
import { Badge, Card, Divider, Modal } from "@mantine/core";
import { useParams } from "next/navigation";
import { JSX, useEffect, useState } from "react";

import { User } from "@/src/models/user.model";
import NewUserComponent from "../../user/_component/new-user-component";
import { useLazyGetUsersQuery } from "../../user/_store/user.query";
import { useLazyGetDepartmentQuery } from "../_store/department.query";

export default function DepartmentUsersComponent() {
  const [modals, setModals] = useState({
    new: false,
    edit: false,
    view: false,
    archive: false,
  });

  const defaultDepartmentUserValue: User = {
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
  const [selectedDepartmentUser, setSelectedDepartmentUser] = useState<User>(
    defaultDepartmentUserValue
  );

  const [getDepartment, department] = useLazyGetDepartmentQuery();
  const [getDepartmentUsers, departmentUsers] = useLazyGetUsersQuery();
  const [collection, setCollection] = useState<CollectionQuery>({
    skip: 0,
    top: 20,
    filter: [[{ field: "departmentId", value: params.id, operator: "=" }]],
    orderBy: [{ field: "createdAt", direction: "desc" }],
  });
  const [UserCollection] = useState<CollectionQuery>({
    skip: 0,
    top: 20,
    filter: [[{ field: "departmentId", value: params.id, operator: "=" }]],
    orderBy: [{ field: "createdAt", direction: "desc" }],
  });

  useEffect(() => {
    getDepartmentUsers(UserCollection);
  }, [UserCollection]);

  const _getContactTypeBadge = (contactType: UserContactType) => {
    const badgeColors: Record<UserContactType, string> = {
      [UserContactType.BAIL]: "orange",
      [UserContactType.EMERGENCY]: "red",
      [UserContactType.FAMILY]: "blue",
      [UserContactType.FRIEND]: "green",
      [UserContactType.OTHER]: "gray",
    };

    console.log("", selectedDepartmentUser, department);

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
    setSelectedDepartmentUser(contact ?? defaultDepartmentUserValue);
    setModals((prev) => ({
      ...prev,
      [type]: !prev[type],
    }));
  };

  const closeModal = (type: string) => {
    setModals((prev) => ({ ...prev, [type]: false }));
    setSelectedDepartmentUser(defaultDepartmentUserValue);
    getDepartment({
      id: `${params?.id}`,
      includes: ["users"],
    });
  };
  console.log("Department Users Component", departmentUsers?.data?.data);

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
    filter: [
      [
        {
          name: "With Archived",
          field: "withArchived",
          value: true,
        },
      ],
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
        showSelector={true}
        tableKey="users"
        title=""
        newButtonText="New"
        total={departmentUsers?.data?.count || 0}
        collectionQuery={collection}
        config={config}
        items={departmentUsers?.data?.data}
        itemsLoading={departmentUsers?.isLoading || departmentUsers?.isFetching}
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
        "Create User",
        "70%",
        <NewUserComponent editMode="new" onClose={() => closeModal("new")} />
      )}
    </Card>
  );
}
