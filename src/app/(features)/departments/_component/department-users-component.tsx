"use client";
import { CollectionQuery } from "@/src/shared/models/collection.model";
import { EntityConfig } from "@/src/shared/models/entity-config.model";
import {
  ActionIcon,
  Button,
  Card,
  Divider,
  Menu,
  Modal,
  Table,
} from "@mantine/core";
import { useParams } from "next/navigation";
import { JSX, useEffect, useState } from "react";

import { User } from "@/src/models/user.model";
import NewUserComponent from "../../user/_component/new-user-component";
import { useLazyGetUsersQuery } from "../../user/_store/user.query";
import { useLazyGetDepartmentQuery } from "../_store/department.query";
import {
  IconDotsVertical,
  IconEdit,
  IconEye,
  IconInbox,
  IconPlus,
  IconTrash,
} from "@tabler/icons-react";

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
  console.log(selectedDepartmentUser);

  const [getDepartment, department] = useLazyGetDepartmentQuery();
  const [getDepartmentUsers, departmentUsers] = useLazyGetUsersQuery();
  console.log(department);
  // const [collection, setCollection] = useState<CollectionQuery>({
  //   skip: 0,
  //   top: 20,
  //   filter: [[{ field: "departmentId", value: params.id, operator: "=" }]],
  //   orderBy: [{ field: "createdAt", direction: "desc" }],
  // });
  const [UserCollection] = useState<CollectionQuery>({
    skip: 0,
    top: 20,
    filter: [[{ field: "departmentId", value: params.id, operator: "=" }]],
    orderBy: [{ field: "createdAt", direction: "desc" }],
  });

  useEffect(() => {
    getDepartmentUsers(UserCollection);
  }, [getDepartmentUsers, UserCollection]);

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
        key: "name",
        name: "Employee Name",
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
      { key: "employeeNumber", name: "Employee Number" },
      { key: "startDate", name: "Employment Date", isDate: true },
      { key: "tin", name: "TIN" },
      { name: "Created At", key: "createdAt", isDate: true },
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

      <Table className="mantine-table-optimized" striped highlightOnHover>
        <Table.Thead>
          <Table.Tr>
            {/* Primary Column */}
            <Table.Th
              style={{
                position: "sticky",
                left: 0,
                zIndex: 3,
                background: "white",
              }}
            >
              {config.primaryColumn.name}
            </Table.Th>

            {/* Dynamic Visible Columns (excluding primary) */}
            {config.visibleColumn
              .filter((col) => col.key !== config.primaryColumn.key)
              .map((col) => (
                <Table.Th
                  key={Array.isArray(col.key) ? col.key.join(",") : col.key}
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
                width: "20px",
              }}
            ></Table.Th>
          </Table.Tr>
        </Table.Thead>

        <Table.Tbody>
          {departmentUsers?.data?.data?.length === 0 ? (
            <Table.Tr>
              <Table.Td
                colSpan={config.visibleColumn.length + 2}
                className="text-center py-8 text-gray-500"
              >
                <div className="flex flex-col items-center">
                  <IconInbox size={40} />
                  <p className="mt-2">No users found</p>
                </div>
              </Table.Td>
            </Table.Tr>
          ) : (
            departmentUsers?.data?.data?.map((user) => (
              <Table.Tr key={String(user[config.identity as keyof User] ?? "")}>
                {/* Primary Column */}
                <Table.Td
                  style={{
                    position: "sticky",
                    left: 0,
                    zIndex: 2,
                    background: "white",
                  }}
                >
                  {config.primaryColumn.render
                    ? config.primaryColumn.render(user)
                    : null}
                </Table.Td>

                {/* Visible Columns */}
                {config.visibleColumn
                  .filter((col) => col.key !== config.primaryColumn.key)
                  .map((col) => (
                    <Table.Td
                      key={Array.isArray(col.key) ? col.key.join(",") : col.key}
                    >
                      {col.render
                        ? col.render(user)
                        : typeof col.key === "string"
                          ? user[col.key as keyof User]
                          : Array.isArray(col.key)
                            ? col.key
                                .map((k) => user[k as keyof User])
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
                  }}
                >
                  <Menu shadow="md" width={160} position="bottom-end" withArrow>
                    <Menu.Target>
                      <ActionIcon
                        variant="subtle"
                        size="sm"
                        aria-label="Actions"
                      >
                        <IconDotsVertical size={18} />
                      </ActionIcon>
                    </Menu.Target>
                    <Menu.Dropdown>
                      <Menu.Item
                        color="blue"
                        fw={600}
                        leftSection={<IconEye size={14} />}
                        onClick={() => handleAction({ key: "showMore" }, user)}
                      >
                        Show More
                      </Menu.Item>
                      <Menu.Item
                        color="green"
                        fw={600}
                        leftSection={<IconEdit size={14} />}
                        onClick={() => handleAction({ key: "edit" }, user)}
                      >
                        Edit
                      </Menu.Item>
                      <Menu.Item
                        color="red"
                        fw={600}
                        leftSection={<IconTrash size={14} />}
                        onClick={() => handleAction({ key: "delete" }, user)}
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
        "Create User",
        "70%",
        <NewUserComponent editMode="new" onClose={() => closeModal("new")} />
      )}
    </Card>
  );
}
