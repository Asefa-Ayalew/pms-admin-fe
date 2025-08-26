"use client";

import { useParams } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";

import { CollectionQuery } from "@/src/shared/models/collection.model";
import {
  EntityConfig,
  entityViewMode,
} from "@/src/shared/models/entity-list-config";
import {
  useLazyGetArchivedRolesQuery,
  useLazyGetRolesQuery,
} from "../../role/_store/role.query";
import EntityTable from "@/src/shared/table/entity-table";
import { Role } from "@/src/models/role.model";

export default function RoleListPage({
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
  const [getRoles, { data: roles, isLoading: rolesLoading }] =
    useLazyGetRolesQuery();

  const [
    getArchivedRoles,
    { data: archivedRoles, isLoading: archivedRolesLoading },
  ] = useLazyGetArchivedRolesQuery();

  useEffect(() => {
    if (view === "list") {
      getRoles(collectionQuery);
    } else {
      getArchivedRoles(collectionQuery);
    }
  }, [collectionQuery, getRoles, getArchivedRoles, view]);

  useEffect(() => {
    setViewMode(params?.id !== undefined ? "detail" : "list");
  }, [params?.id]);


  const config = useMemo<EntityConfig<Role>>(
    () => ({
      primaryColumn: {
        key: "name",
        name: "Role Name",
        render: (data: Role) => `${data?.name ?? ""}`,
      },
      rootUrl: "/roles",
      identity: "id",
      visibleColumn: [
        { name: "Name", key: "name" },
        { name: "Description", key: "description" },
        { name: "Key", key: "key" },
        { name: "Created On", key: "createdAt", isDate: true },
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
      title={view === "list" ? "Roles" : "Archived Roles"}
      detailTitle={
        params.id !== "new" ? (roles?.name ?? "Role Detail") : "New Role"
      }
      config={config}
      detail={children}
      items={view === "list" ? roles?.data : archivedRoles?.data}
      total={
        view === "list" ? roles?.data?.length : archivedRoles?.data?.length
      }
      itemsLoading={view === "list" ? rolesLoading : archivedRolesLoading}
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
