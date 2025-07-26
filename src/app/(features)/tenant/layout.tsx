"use client";

import { useParams } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";

import { Tenant } from "@/src/models/tenant.model";
import { CollectionQuery } from "@/src/shared/models/collection.model";
import {
  EntityConfig,
  entityViewMode,
} from "@/src/shared/models/entity-list-config";
import { useLazyGetTenantQuery, useLazyGetTenantsQuery } from "./_store/tenant.query";
import SharedEntity from "@/src/shared/entity-table/shared-table";

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
      routing: (data) => {
        return `detail/${data?.id}`
      }
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


  return (
    <SharedEntity
      title="Tenants"
      detailTitle={params.id !== 'new' ? (tenant?.name ?? 'Tenant Detail') : 'New Tenant'}
      config={config}
      detail={children}
      defaultPageSize={20}
      pageSizeOptions={[10, 20, 30, 50, 100]}
      items={tenants?.data || []}
      total={tenants?.count || 0}
      itemsLoading={isLoadingTenants}
      onPaginationChange={handlePaginationChange}
      onSearch={onSearch}
      onOrder={onOrder}
      onFilterChange={onFilter}
    />
  );
}
