"use client";

import { useParams } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";

import { Tenant } from "@/src/models/tenant.model";
import { CollectionQuery } from "@/src/shared/models/collection.model";
import {
  EntityConfig,
  entityViewMode,
} from "@/src/shared/models/entity-list-config";
import {
  useLazyGetArchivedTenantsQuery,
  useLazyGetTenantQuery,
  useLazyGetTenantsQuery,
} from "./_store/tenant.query";
import EntityTable from "@/src/shared/table/entity-table";

export default function TenantListPage({
  children,
}: {
  children: React.ReactNode;
}) {
  const params = useParams();

  const [viewMode, setViewMode] = useState<entityViewMode>("list");
  const [view, setView] = useState<"list" | "archived">("list");
  const [collectionQuery, setCollectionQuery] = useState<CollectionQuery>({
    skip: 0,
    top: 20,
    orderBy: [{ field: "createdAt", direction: "desc" }],
  });

  const [getTenants, { data: tenants, isLoading: isLoadingTenants }] =
    useLazyGetTenantsQuery();
  const [
    getArchivedTenants,
    { data: archivedTenants, isLoading: archivedTenantsLoading },
  ] = useLazyGetArchivedTenantsQuery();

  const [getTenant, { data: tenant }] = useLazyGetTenantQuery();

  useEffect(() => {
    if (view === "list") {
      getTenants(collectionQuery);
    } else {
      getArchivedTenants(collectionQuery);
    }
  }, [collectionQuery, getTenants, getArchivedTenants, view]);

  useEffect(() => {
    getTenant({ id: String(params.id) });
  }, [getTenant, params.id]);

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
      showDetail: true,
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

// eslint-disable-next-line @typescript-eslint/no-explicit-any
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

  return (
    <EntityTable
      title={view === "list" ? "Tenants" : "Archived Tenants"}
      detailTitle={
        params.id !== "new" ? (tenant?.name ?? "Tenant Detail") : "New Tenant"
      }
      config={config}
      detail={children}
      items={view === "list" ? tenants?.data : archivedTenants?.data}
      total={view === "list" ? tenants?.data?.length : archivedTenants?.data?.length}
      itemsLoading={view === "list" ? isLoadingTenants : archivedTenantsLoading}
      collectionQuery={collectionQuery}
      view={view}
      viewMode={viewMode}
      showNewButton={false}
      onViewChange={setView}
      onPaginationChange={handlePaginationChange}
      onSearch={onSearch}
      onOrder={onOrder}
      onFilterChange={onFilter}
    />
  );
}
