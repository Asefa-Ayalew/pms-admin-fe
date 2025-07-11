"use client";
import { UserContactType } from "@/src/models/emergency-contact.model";
import { CollectionQuery } from "@/src/shared/models/collection.model";
import {
  EntityConfig,
} from "@/src/shared/models/entity-config.model";
import {
  ActionIcon,
  Badge,
  Card,
  Divider,
  Menu,
  Modal,
  Table,
} from "@mantine/core";
import { useParams } from "next/navigation";
import { JSX, useEffect, useMemo, useState } from "react";

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
  const [getRoleUsers, { data: roleUsers }] =
    useLazyGetUsersByRoleQuery();
  // const [collection, setCollection] = useState<CollectionQuery>({
  //   skip: 0,
  //   top: 20,
  //   filter: [[{ field: "departmentId", value: params.id, operator: "=" }]],
  //   orderBy: [{ field: "createdAt", direction: "desc" }],
  // });
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
    []
  );

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
  // const styleConfig: TableStyleConfig = useMemo(
  //   () => ({
  //     primaryColor: "blue",
  //     dangerColor: "red",
  //     fontSize: "sm",
  //     density: "xs",
  //     shadowLevel: "xs",
  //     borderColor: "border-gray-200",
  //     rowHoverColor: "var(--mantine-color-blue-50)",
  //   }),
  //   []
  // );
  // const handlePaginationChange = useCallback(
  //   (pageIndex: number, pageSize: number) => {
  //     getRoleUsers({ skip: (pageIndex - 1) * pageSize, top: pageSize });
  //   },
  //   [getRoleUsers]
  // );
  // const behaviorConfig: TableBehaviorConfig = useMemo(
  //   () => ({
  //     enableColumnFilters: true,
  //     enableGlobalFilter: true,
  //     enableColumnResizing: true,
  //     enableFullScreenToggle: true,
  //     enableDensityToggle: true,
  //     enableColumnOrdering: true,
  //     enablePagination: true,
  //     enableMultiSort: true,
  //     enableMultiRowSelection: true,
  //     manualFiltering: true,
  //     manualPagination: true,
  //     manualSorting: true,
  //     paginationDisplayMode: "default",
  //     positionPagination: "bottom",
  //     positionActionsColumn: "last",
  //     enableHiding: true,
  //   }),
  //   []
  // );
  return (
    <Card shadow="sm" padding="sm">
      {/* <EntityList
            title="users"
            detailTitle="User Detail"
            config={config}
            viewMode={viewMode}
            // detail={children}
            defaultPageSize={20}
            pageSizeOptions={[10, 20, 30, 50, 100]}
            _showTotal={true}
            tableKey="users"
            dataLoadMode="static"
            items={roleUsers?.data || []}
            total={roleUsers?.count || 0}
            itemsLoading={isLoading}
            styleConfig={styleConfig}
            behaviorConfig={behaviorConfig}
            errorText={
              error ? "Failed to load users. Please try again." : undefined
            }
            noDataText="No user found"
            customActions={[]}
            onPaginationChange={handlePaginationChange}
          /> */}
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
