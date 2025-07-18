"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

import { User } from "@/src/models/user.model";
import EntityList, {
  CustomToolbarAction,
  TableBehaviorConfig,
  TableStyleConfig,
} from "@/src/shared/entity/entity-list";
import { CollectionQuery } from "@/src/shared/models/collection.model";
import {
  EntityConfig,
  entityViewMode,
} from "@/src/shared/models/entity-config.model";
import { useParams } from "next/navigation";
import { useLazyGetUserQuery, useLazyGetUsersQuery } from "./_store/user.query";
import {
  IconAdjustments,
  IconDownload,
  IconRefreshDot,
  IconUserPlus,
} from "@tabler/icons-react";

export default function UserListPage({
  children,
}: {
  children: React.ReactNode;
}) {
  const params = useParams();
  const [viewMode, setViewMode] = useState<entityViewMode>("list");
  const [collection, setCollection] = useState<CollectionQuery>({
    skip: 0,
    top: 20,
    orderBy: [{ field: "createdAt", direction: "desc" }],
  });

  const [getUsers, { data: users, isLoading, error }] = useLazyGetUsersQuery();
  const [getUser, { data: user}] = useLazyGetUserQuery();

 
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
      paginationDisplayMode: "pages",
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
  };  //Rtk hooks
  const customActions: CustomToolbarAction[] = useMemo(
    () => [
      {
        key: "refresh",
        label: "Refresh Properties",
        icon: <IconRefreshDot size={18} />,
        color: "blue",
        onClick: () => getUsers({ skip: 0, top: 20 }),
        tooltip: "Refresh user data",
        position: "top",
        order: 1,
      },
      {
        key: "add-user",
        label: "Add user",
        icon: <IconUserPlus size={18} />,
        color: "green",
        onClick: () => console.log("Add user clicked"),
        tooltip: "Add a new user",
        position: "top",
        order: 2,
      },
      {
        key: "export-user",
        label: "Export",
        icon: <IconDownload size={18} />,
        color: "cyan",
        onClick: () => console.log("Export clicked"),
        tooltip: "Export user data",
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
    [getUsers]
  );


  useEffect(() => {
    getUsers(collection);
  }, [collection]);


  useEffect(() => {
    if (params?.id !== undefined) {
      getUser({id: String(params.id)})
      setViewMode("detail");
    } else {
      setViewMode("list");
    }
  }, [setViewMode, params, getUser]);

  const config = useMemo<EntityConfig<User>>(
    () => ({
      primaryColumn: {
        key: "fullName",
        name: "Full Name",
        render: (data: User) =>
          `${data?.firstName ?? ""} ${data?.middleName ?? ""} ${
            data?.lastName ?? ""
          }`,
      },
      rootUrl: "/user",
      identity: "id",
      visibleColumn: [
        {
          key: "fullName",
          isPrimary: true,
          name: "Full Name",
          
          render: (data: User) =>
            `${data?.firstName ?? ""} ${data?.middleName ?? ""} ${
              data?.lastName ?? ""
            }`,
        },
        {
          key: "gender",
          name: "Gender",
          render: (value) => {
            return <span className="capitalize">{value?.gender}</span>;
          },
        },
        { key: "employeeNumber", name: "Employee No" },
        { key: "phone", name: "Phone Number" },
        { key: "startDate", name: "Employment Date", isDate: true },
        { key: "tin", name: "TIN" },
        {
          key: "createdAt",
          name: "Created At",
          isDate: true,
        },
      ],
    }),
    []
  );

  const styleConfig: TableStyleConfig = useMemo(
    () => ({
      primaryColor: "blue",
      dangerColor: "red",
      fontSize: "sm",
      density: "xs",
      shadowLevel: "xs",
      borderColor: "border-gray-200",
      rowHoverColor: "var(--mantine-color-blue-50)",
    }),
    []
  );
  return (
    <EntityList
      title="users"
      detailTitle={(params?.id !== 'new' && user ) ? user?.firstName : 'New User'}
      config={config}
      viewMode={viewMode}
      detail={children}
      defaultPageSize={20}
      pageSizeOptions={[10, 20, 30, 50, 100]}
      _showTotal={true}
      tableKey="users"
      dataLoadMode="static"
      items={users?.data || []}
      total={users?.count || 0}
      itemsLoading={isLoading}
      styleConfig={styleConfig}
      behaviorConfig={behaviorConfig}
      errorText={
        error ? "Failed to load users. Please try again." : undefined
      }
      noDataText="No user found"
      customActions={customActions}
      onPaginationChange={handlePaginationChange}
      onSearch={onSearch}
      onOrder={onOrder}
      onFilterChange={onFilter}
    />
  );
}
