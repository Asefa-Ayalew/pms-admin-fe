"use client";

import { useParams } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";

import { Department } from "@/src/models/department.model";
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
import { useGetDepartmentQuery, useLazyGetDepartmentQuery, useLazyGetDepartmentsQuery } from "./_store/department.query";
import {
  IconAdjustments,
  IconDownload,
  IconRefreshDot,
  IconUserPlus,
} from "@tabler/icons-react";

export default function DepartmentListPage({
  children,
}: {
  children: React.ReactNode;
}) {
  const params = useParams();

  const [viewMode, setViewMode] = useState<entityViewMode>("list");
  const [collectionQuery, setCollectionQuery] = useState<CollectionQuery>({
    skip: 0,
    top: 20,
    orderBy: [{ field: "createdAt", direction: "desc" }],
  });

  const [
    getDepartments,
    { data: departments, isLoading: isLoadingDepartments, error },
  ] = useLazyGetDepartmentsQuery();

  const [ getDepartment, {data: department}] = useLazyGetDepartmentQuery()

  useEffect(() => {
    getDepartments(collectionQuery);
  }, [collectionQuery, getDepartments]);

  useEffect(() => {
    getDepartment({id: String(params.id)})
  }, [getDepartments, params.id])

  useEffect(() => {
    setViewMode(params?.id !== undefined ? "detail" : "list");
  }, [params?.id]);

  const config = useMemo<EntityConfig<Department>>(
    () => ({
      primaryColumn: {
        key: "name",
        name: "Department Name",
        render: (data: Department) => `${data?.name ?? ""}`,
      },
      rootUrl: "/departments",
      identity: "id",
      visibleColumn: [
        {
          key: "name",
          name: "Department Name",
          render: (data: Department) => `${data?.name ?? ""}`,
        },
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
      setCollectionQuery((prev) => ({
        ...prev,
        skip: pageIndex - 1,
        top: pageSize,
      }));
    },
    []
  );
  const onSearch = (search: string) => {
    setCollectionQuery((prev) => ({
      ...prev,
      skip: 0,
      search: search,
    }));
  };

  const onFilter = (filter: any[]) => {
    setCollectionQuery((prev) => ({
      ...prev,
      filter,
    }));
  };

  const onOrder = (order: { field: string; direction: "desc" | "asc" }) => {
    setCollectionQuery((prev) => ({
      ...prev,
      orderBy: [order],
    }));
  };
  const customActions: CustomToolbarAction[] = useMemo(
    () => [
      {
        key: "refresh",
        label: "Refresh Departments",
        icon: <IconRefreshDot size={18} />,
        color: "blue",
        onClick: () => getDepartments({ skip: 0, top: 20 }),
        tooltip: "Refresh department data",
        position: "top",
        order: 1,
      },
      {
        key: "add-department",
        label: "Add department",
        icon: <IconUserPlus size={18} />,
        color: "green",
        onClick: () => console.log("Add department clicked"),
        tooltip: "Add a new department",
        position: "top",
        order: 2,
      },
      {
        key: "export-department",
        label: "Export",
        icon: <IconDownload size={18} />,
        color: "cyan",
        onClick: () => console.log("Export clicked"),
        tooltip: "Export department data",
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
    [getDepartments]
  );


  return (
    <div className="flex w-full">
      <EntityList
        title="Departments"
        detailTitle={params.id !== 'new'  ? (department?.name ?? 'Department Detail') : 'New Department'}
        config={config}
        viewMode={viewMode}
        detail={children}
        defaultPageSize={20}
        pageSizeOptions={[10, 20, 30, 50, 100]}
        _showTotal={true}
        tableKey="departments"
        dataLoadMode="static"
        items={departments?.data || []}
        total={departments?.count || 0}
        itemsLoading={isLoadingDepartments}
        styleConfig={styleConfig}
        behaviorConfig={behaviorConfig}
        errorText={
          error ? "Failed to load departments. Please try again." : undefined
        }
        noDataText="No departments found"
        customActions={customActions}
        onPaginationChange={handlePaginationChange}
        onSearch={onSearch}
        onOrder={onOrder}
        onFilterChange={onFilter}
      />
    </div>
  );
}
