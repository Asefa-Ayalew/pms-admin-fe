"use client";

import { useParams, useSearchParams } from "next/navigation";
import React, { useCallback, useEffect, useMemo, useState } from "react";

import { Department } from "@/src/models/department.model";
import { CollectionQuery } from "@/src/shared/models/collection.model";
import {
  EntityConfig,
  entityViewMode,
} from "@/src/shared/models/entity-list-config";
import {
  useLazyGetArchivedDepartmentsQuery,
  useLazyGetDepartmentQuery,
  useLazyGetDepartmentsQuery,
} from "./_store/department.query";
import EntityTable from "@/src/shared/table/entity-table";

export default function DepartmentListPage({
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

  const [
    getDepartments,
    { data: departments, isLoading: isLoadingDepartments },
  ] = useLazyGetDepartmentsQuery();
  const [
    getArchivedDepartments,
    { data: archivedDepartments, isLoading: archivedDepartmentsLoading },
  ] = useLazyGetArchivedDepartmentsQuery();

  const [getDepartment, { data: department }] = useLazyGetDepartmentQuery();

  useEffect(() => {
    if (view === "list") {
      getDepartments({ ...collectionQuery, includes: ["tenant"] });
    } else {
      getArchivedDepartments({ ...collectionQuery, includes: ["tenant"] });
    }
  }, [collectionQuery, getDepartments, getArchivedDepartments, view]);

  useEffect(() => {
    getDepartment({ id: String(params.id) });
  }, [getDepartment, params.id]);

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
          key: ["tenant", "name"],
          name: "Tenant",
          render: (data: Department) => `${data?.tenant?.name}`,
        },
        {
          key: "description",
          name: "Description",
          render: (data: Department) => (
            <div
              className="line-clamp-2"
              dangerouslySetInnerHTML={{ __html: data?.description ?? "" }}
            />
          ),
          tdClass: "w-1/4",
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
      title={view === "list" ? "Departments" : "Archived Departments"}
      detailTitle={
        params.id !== "new"
          ? (department?.name ?? "Department Detail")
          : "New Department"
      }
      config={config}
      detail={children}
      items={view === "list" ? departments?.data : archivedDepartments?.data}
      total={view === "list" ? departments?.count : archivedDepartments?.count}
      itemsLoading={
        view === "list" ? isLoadingDepartments : archivedDepartmentsLoading
      }
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
