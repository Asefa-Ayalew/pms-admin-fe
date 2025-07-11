"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

import { Role } from "@/src/models/role.model";
import EntityList, { CustomToolbarAction, TableBehaviorConfig, TableStyleConfig } from "@/src/shared/entity/entity-list";
import { CollectionQuery } from "@/src/shared/models/collection.model";
import {
  EntityConfig,
  entityViewMode,
} from "@/src/shared/models/entity-config.model";
import { useParams } from "next/navigation";
import { useLazyGetUsersQuery } from "../user/_store/user.query";
import { useLazyGetRolesQuery } from "./_store/role.query";
import { IconAdjustments, IconDownload, IconRefreshDot, IconUserPlus } from "@tabler/icons-react";

export default function RoleListPage({
  children,
}: {
  children: React.ReactNode;
}) {
  const params = useParams();

  //Component states
  // const [selectedRole, setSelectedType] = useState<Role>();
  const [viewMode, setViewMode] = useState<entityViewMode>("list");
  const [collection, setCollection] = useState<CollectionQuery>({
    skip: 0,
    top: 20,
    orderBy: [{ field: "createdAt", direction: "desc" }],
  });
  const [userCollection, setUserCollection] = useState<CollectionQuery>({
    orderBy: [{ field: "createdAt", direction: "desc" }],
  });

  //Rtk hooks
  const [getRole, { data: role, isLoading, error }] = useLazyGetRolesQuery();
  const [getUsers, users] = useLazyGetUsersQuery();
  useEffect(() => {
    getRole(collection);
  }, [collection]);

  // useEffect(() => {
  //   setSelectedType(
  //     role?.data?.find((role: Role) => role?.id === `${params?.id}`)
  //   );
  // }, [params?.id, role?.data]);

 const behaviorConfig: TableBehaviorConfig = useMemo(
    () => ({
      enableColumnFilters: true,
      enableGlobalFilter: true,
      enableColumnResizing: true,
      enableFullScreenToggle: true,
      enableDensityToggle: true,
      enableColumnOrdering: true,
      enablePagination: true,
      enableMultiSort: true,
      enableMultiRowSelection: true,
      manualFiltering: true,
      manualPagination: true,
      manualSorting: true,
      paginationDisplayMode: "default",
      positionPagination: "bottom",
      positionActionsColumn: "last",
      enableHiding: true,
    }),
    []
  );
  const handlePaginationChange = useCallback(
     (pageIndex: number, pageSize: number) => {
       setCollection((prev) => ({
         ...prev,
         skip: pageIndex - 1,
         top: pageSize,
       }));
     },
     []
   );
   const onSearch = (search: string) => {
     setCollection((prev) => ({
       ...prev,
       skip: 0,
       search: search,
     }));
   };
 
   const onFilter = (filter: any[]) => {
     setCollection((prev) => ({
       ...prev,
       filter, 
     }));
   };
  
   const onOrder = (order: { field: string; direction: "desc" | "asc" }) => {
     setCollection((prev) => ({
       ...prev,
       orderBy: [order],
     }));
   }; //Rtk hooks
  const customActions: CustomToolbarAction[] = useMemo(
    () => [
      {
        key: "refresh",
        label: "Refresh Properties",
        icon: <IconRefreshDot size={18} />,
        color: "blue",
        onClick: () => getRole({ skip: 0, top: 20 }),
        tooltip: "Refresh user data",
        position: "top",
        order: 1,
      },
      {
        key: "add-role",
        label: "Add role",
        icon: <IconUserPlus size={18} />,
        color: "green",
        onClick: () => console.log("Add role clicked"),
        tooltip: "Add a new role",
        position: "top",
        order: 2,
      },
      {
        key: "export-user",
        label: "Export",
        icon: <IconDownload size={18} />,
        color: "cyan",
        onClick: () => console.log("Export clicked"),
        tooltip: "Export Role data",
        position: "bottom",
        variant: "subtle",
        order: 1,
      },
      {
        key: "settings",
        label: "Settings",
        icon: <IconAdjustments size={18} />,
        color: "gray",
        onClick: () => console.log("Settings clicked"),
        tooltip: "Table settings",
        position: "bottom",
        variant: "subtle",
        order: 2,
      },
    ],
    [getRole]
  );
  // const renderCustomLeftToolbar = useCallback(() => {
  //   return (
  //     <div className="flex items-center gap-2">
  //       <Button
  //         leftSection={<IconUserPlus size={16} />}
  //         size="sm"
  //         color="green"
  //       >
  //         Add New User
  //       </Button>

  //       <TextInput placeholder="Search roles..." size="sm" className="w-64" />
  //     </div>
  //   );
  // }, []);

  console.log(users, setUserCollection);
  useEffect(() => {
    getUsers(userCollection);
  }, [userCollection, getUsers]);

  useEffect(() => {
    if (params?.id !== undefined) {
      setViewMode("detail");
    } else {
      setViewMode("list");
    }
  }, [setViewMode, params]);

  const config = useMemo<EntityConfig<Role>>(
      () => ({
    primaryColumn: { key: "name", name: "Role Name" },
    rootUrl: "/role",
    identity: "id",
    visibleColumn: [
      { key: "name", name: "Role Name" },
      { key: "key", name: "Role Short Code" },
      { key: "description", name: "Role Description" },
      // {
      //   key: "users",
      //   name: "# of Users",
      //   render: (data: Role) =>
      //     users?.data?.data?.filter((user: User) => user?.userRoles?.filter((role: any) => role.roleId === data.id)).length ?? 0,
      // },
      { key: "createdAt", name: "Created At", isDate: true },
    ],
  }),
    []
  );

  const data = role?.data;
  const styleConfig: TableStyleConfig = useMemo(
      () => ({
        primaryColor: "blue",
        dangerColor: "red",
        fontSize: "xs",
        density: "xs",
        shadowLevel: "xs",
        borderColor: "border-gray-200",
        rowHoverColor: "var(--mantine-color-blue-50)",
      }),
      []
    );
  return (
    <div className="flex w-full">
      <EntityList
            title="roles"
            detailTitle="Role Detail"
            config={config}
            viewMode={viewMode}
            detail={children}
            defaultPageSize={20}
            pageSizeOptions={[10, 20, 30, 50, 100]}
            _showTotal={true}
            tableKey="roles"
            dataLoadMode="static"
            items={data || []}
            total={role?.count || 0}
            itemsLoading={isLoading}
            styleConfig={styleConfig}
            behaviorConfig={behaviorConfig}
            errorText={
              error ? "Failed to load roles. Please try again." : undefined
            }
            noDataText="No role found"
            customActions={customActions}
            onPaginationChange={handlePaginationChange}
            onSearch={onSearch}
            onOrder={onOrder}
            onFilterChange={onFilter}
          />
    </div>
  );
}
