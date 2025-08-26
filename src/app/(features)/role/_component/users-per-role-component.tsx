"use client";
import { CollectionQuery } from "@/src/shared/models/collection.model";
import { EntityConfig } from "@/src/shared/models/entity-config.model";
import { ActionIcon, Card, Divider, Menu, Modal, Table } from "@mantine/core";
import { JSX, useCallback, useEffect, useMemo, useState } from "react";

import { User } from "@/src/models/user.model";
import { useLazyGetUsersByRoleQuery } from "../_store/role.query";
import ViewRoleUsersComponent from "./view-role-users-component";
import { IconDotsVertical, IconEye, IconInbox } from "@tabler/icons-react";

export default function UsersPerRoleComponent() {
  const [modals, setModals] = useState({
    new: false,
    edit: false,
    view: false,
    archive: false,
  });

  const defaultUsersPerRoleValue = useMemo<User>(
    () => ({
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
    }),
    []
  );
  const [selectedUser, setSelectedUser] = useState<User>(
    defaultUsersPerRoleValue
  );
  const [getRoleUsers, { data: roleUsers }] = useLazyGetUsersByRoleQuery();

  const openModal = useCallback(
    (type: keyof typeof modals, contact?: User) => {
      setSelectedUser(contact ?? defaultUsersPerRoleValue);
      setModals((prev) => ({
        ...prev,
        [type]: !prev[type],
      }));
    },
    [defaultUsersPerRoleValue]
  );

  const closeModal = (type: string) => {
    setModals((prev) => ({ ...prev, [type]: false }));
    setSelectedUser(defaultUsersPerRoleValue);
  };

  const users = roleUsers?.data;

  const config = useMemo<EntityConfig<User>>(
    () => ({
      primaryColumn: {
        key: "name",
        name: "Full Name",
        render: (data: User) => {
          const fullName = [data?.firstName, data?.middleName, data?.lastName]
            .filter((name) => name && name.trim() !== "")
            .join(" ");
          return fullName || "N/A";
        },
      },
      rootUrl: "/role",
      identity: "id",
      showDetail: false,
      visibleColumn: [
        {
          key: "name",
          name: "Full Name",
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
      newAction: () => openModal("new"),
      actions: [
        {
          label: "Show More",
          icon: "IconEye",
          key: "showMore",
          type: "primary",
        },
      ],
    }),
    [openModal]
  );

  useEffect(() => {
    const collection: CollectionQuery = {
      top: 10,
      skip: 0,
      orderBy: [{ field: "timestamp", direction: "desc" }],
    };

    getRoleUsers(collection);
  }, [getRoleUsers]);

  const handleAction = (action: { key: string }, data?: User) => {
    switch (action.key) {
      case "showMore":
        openModal("view", data);
        break;
      default:
        console.warn("Unknown action:", action);
    }
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
      <Table className="mantine-table-optimized" striped highlightOnHover>
        <Table.Thead>
          <Table.Tr>
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

            {config.visibleColumn
              .filter((col) => col.key !== config.primaryColumn.key)
              .map((col) => (
                <Table.Th
                  key={Array.isArray(col.key) ? col.key.join(",") : col.key}
                >
                  {col.name}
                </Table.Th>
              ))}

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
          {users?.length === 0 ? (
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
            users?.map((user) => (
              <Table.Tr key={user[config.identity as keyof User]}>
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
                        leftSection={<IconEye size={14} />}
                        onClick={() => handleAction({ key: "showMore" }, user)}
                      >
                        Show More
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
