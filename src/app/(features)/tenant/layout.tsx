"use client";

import { useParams } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";

import { Tenant } from "@/src/models/tenant.model";
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
import { useLazyGetTenantQuery, useLazyGetTenantsQuery } from "./_store/tenant.query";
import {
  IconAdjustments,
  IconDownload,
  IconRefreshDot,
  IconUserPlus,
} from "@tabler/icons-react";

export default function TenantListPage({
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
    getTenants,
    { data: tenants, isLoading: isLoadingTenants, error },
  ] = useLazyGetTenantsQuery();

  const [getTenant, { data: tenant }] = useLazyGetTenantQuery()

  useEffect(() => {
    getTenants(collectionQuery);
  }, [collectionQuery, getTenants]);

  useEffect(() => {
    getTenant({ id: String(params.id) })
  }, [getTenants, params.id])

  useEffect(() => {
    setViewMode(params?.id !== undefined ? "detail" : "list");
  }, [params?.id]);

  const config = useMemo<EntityConfig<Tenant>>(
    () => ({
      primaryColumn: {
        key: "name",
        name: "Tenant Name",
        render: (data: Tenant) => `${data?.name ?? ""}`,
      },
      rootUrl: "/tenant",
      identity: "id",
      visibleColumn: [
        {
          key: "name",
          name: "Tenant Name",
          render: (data: Tenant) => `${data?.name ?? ""}`,
        },
        {
          key: "description",
          name: "Description",
          render: (data: Tenant) => `${data?.description ?? ""}`,
        },
        {
          key: "shortCode",
          name: "Short Code",
          render: (data: Tenant) => `${data?.shortCode ?? ""}`,
        },
        {
          key: "tin",
          name: "Tin Number",
          render: (data: Tenant) => `${data?.tin ?? ""}`,
        },
        {
          key: "email",
          name: "Email",
          render: (data: Tenant) => `${data?.email ?? ""}`,
        },
        {
          key: "phoneNumber",
          name: "Phone Number",
          render: (data: Tenant) => `${data?.phoneNumber ?? ""}`,
        },
        {
          key: "createdAt",
          name: "Created At",
          isDate: true,
        },
      ],
      routing: (data) => {
        return `detail/${data?.id}`
      }
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
        label: "Refresh Tenants",
        icon: <IconRefreshDot size={18} />,
        color: "blue",
        onClick: () => getTenants({ skip: 0, top: 20 }),
        tooltip: "Refresh tenant data",
        position: "top",
        order: 1,
      },
      {
        key: "add-tenant",
        label: "Add tenant",
        icon: <IconUserPlus size={18} />,
        color: "green",
        onClick: () => console.log("Add tenant clicked"),
        tooltip: "Add a new tenant",
        position: "top",
        order: 2,
      },
      {
        key: "export-tenant",
        label: "Export",
        icon: <IconDownload size={18} />,
        color: "cyan",
        onClick: () => console.log("Export clicked"),
        tooltip: "Export tenant data",
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
    [getTenants]
  );


  return (
    <div className="flex w-full">
      <EntityList
        title="Tenants"
        detailTitle={params.id !== 'new' ? (tenant?.name ?? 'Tenant Detail') : 'New Tenant'}
        config={config}
        viewMode={viewMode}
        detail={children}
        defaultPageSize={20}
        pageSizeOptions={[10, 20, 30, 50, 100]}
        _showTotal={true}
        tableKey="tenant"
        dataLoadMode="static"
        items={tenants?.data || []}
        total={tenants?.count || 0}
        itemsLoading={isLoadingTenants}
        styleConfig={styleConfig}
        behaviorConfig={behaviorConfig}
        errorText={
          error ? "Failed to load tenants. Please try again." : undefined
        }
        noDataText="No tenants found"
        customActions={customActions}
        onPaginationChange={handlePaginationChange}
        onSearch={onSearch}
        onOrder={onOrder}
        onFilterChange={onFilter}
      />
    </div>
  );
}
