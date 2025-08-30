"use client";

import { useParams } from "next/navigation";
import React, { useCallback, useEffect, useMemo, useState } from "react";

import { Role } from "@/src/models/role.model";
import { CollectionQuery } from "@/src/shared/models/collection.model";
import {
  EntityConfig,
  entityViewMode,
} from "@/src/shared/models/entity-list-config";
import {
  useLazyGetRoleQuery,
  useLazyGetRolesQuery,
} from "./_store/role.query";
import EntityTable from "@/src/shared/table/entity-table";

export default function RoleListPage({
  children,
}: {
  children: React.ReactNode;
}) {
  const params = useParams();
  const [viewMode, setViewMode] = useState<entityViewMode>("list");
  const [collectionQuery, setCollectionQuery] = useState<CollectionQuery>({
    skip: 0,
    top: 10,
    orderBy: [{ field: "createdAt", direction: "desc" }],
  });

  const [getRoles, { data: roles, isLoading: isLoadingRoles }] =
    useLazyGetRolesQuery();

  const [getRole, { data: role }] = useLazyGetRoleQuery();

  useEffect(() => {
      getRoles(collectionQuery);
  }, [collectionQuery, getRoles]);

  useEffect(() => {
    getRole(String(params.id));
  }, [getRole, params.id]);

  useEffect(() => {
    setViewMode(params?.id !== undefined ? "detail" : "list");
  }, [params?.id]);

  useEffect(() => {
   getRole(String(params.id))
  }, [getRole, params.id]);

  const config = useMemo<EntityConfig<Role>>(
    () => ({
      primaryColumn: { key: "name", name: "Role Name" },
      rootUrl: "/role",
      identity: "id",
      visibleColumn: [
        { key: "name", name: "Role Name" },
        { key: "key", name: "Role Short Code" },
        { key: "description", name: "Role Description" },
        { key: "createdAt", name: "Created At", isDate: true },
      ],
      showDetail: true,
    }),
    []
  );

  const handlePaginationChange = useCallback((skip: number, top: number) => {
    setCollectionQuery((prev) => ({
      ...prev,
      skip,
      top,
    }));
  }, []);

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
      title={"Roles"}
      detailTitle={role?.name}
      config={config}
      detail={children}
      items={roles?.data}
      total={roles?.count}
      itemsLoading={isLoadingRoles}
      collectionQuery={collectionQuery}
      viewMode={viewMode}
      showNewButton={false}
      showArchivedList={false}
      onPaginationChange={handlePaginationChange}
      onSearch={onSearch}
      onOrder={onOrder}
      onFilterChange={onFilter}
    />
  );
}
