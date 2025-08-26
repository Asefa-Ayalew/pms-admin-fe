"use client";

import { useParams, useSearchParams } from "next/navigation";
import React, { useCallback, useEffect, useMemo, useState } from "react";

import { Role } from "@/src/models/role.model";
import { CollectionQuery } from "@/src/shared/models/collection.model";
import {
  EntityConfig,
  entityViewMode,
} from "@/src/shared/models/entity-list-config";
import {
  useLazyGetArchivedRolesQuery,
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
  const searchParams = useSearchParams();
  const isArchived = searchParams.get("archived") === "true";
  const [viewMode, setViewMode] = useState<entityViewMode>("list");
  const [view, setView] = useState<"list" | "archived">("list");
  const [collectionQuery, setCollectionQuery] = useState<CollectionQuery>({
    skip: 0,
    top: 10,
    orderBy: [{ field: "createdAt", direction: "desc" }],
  });

  const [getRoles, { data: roles, isLoading: isLoadingRoles }] =
    useLazyGetRolesQuery();
  const [
    getArchivedRoles,
    { data: archivedRoles, isLoading: archivedRolesLoading },
  ] = useLazyGetArchivedRolesQuery();

  const [getRole, { data: role }] = useLazyGetRoleQuery();

  useEffect(() => {
    if (view === "list") {
      getRoles(collectionQuery);
    } else {
      getArchivedRoles(collectionQuery);
    }
  }, [collectionQuery, getArchivedRoles, getRoles, view]);

  useEffect(() => {
    getRole(String(params.id));
  }, [getRole, params.id]);

  useEffect(() => {
    setViewMode(params?.id !== undefined ? "detail" : "list");
  }, [params?.id]);

  useEffect(() => {
    if (isArchived) {
      setView("archived");
    } else {
      setView("list");
    }
  }, [isArchived]);

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
      title={view === "list" ? "Roles" : "Archived Roles"}
      detailTitle={
        params.id !== "new" ? (role?.name ?? "Role Detail") : "New Role"
      }
      config={config}
      detail={children}
      items={view === "list" ? roles?.data : archivedRoles?.data}
      total={view === "list" ? roles?.count : archivedRoles?.count}
      itemsLoading={view === "list" ? isLoadingRoles : archivedRolesLoading}
      collectionQuery={collectionQuery}
      view={view}
      viewMode={viewMode}
      showNewButton={view === "list"}
      onViewChange={setView}
      onPaginationChange={handlePaginationChange}
      onSearch={onSearch}
      onOrder={onOrder}
      onFilterChange={onFilter}
    />
  );
}
