"use client";

import { useParams, useSearchParams } from "next/navigation";
import React, { useCallback, useEffect, useMemo, useState } from "react";

import { User } from "@/src/models/user.model";
import { CollectionQuery } from "@/src/shared/models/collection.model";
import {
  EntityConfig,
  entityViewMode,
} from "@/src/shared/models/entity-list-config";
import {
  useLazyGetArchivedUsersQuery,
  useLazyGetUserQuery,
  useLazyGetUsersQuery,
} from "./_store/user.query";
import EntityTable from "@/src/shared/table/entity-table";

export default function UserListPage({
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

  const [getUsers, { data: users, isLoading: isLoadingUsers }] =
    useLazyGetUsersQuery();
  const [
    getArchivedUsers,
    { data: archivedUsers, isLoading: archivedUsersLoading },
  ] = useLazyGetArchivedUsersQuery();

  const [getUser, { data: user }] = useLazyGetUserQuery();

  useEffect(() => {
    if (view === "list") {
      getUsers(collectionQuery);
    } else {
      getArchivedUsers(collectionQuery);
    }
  }, [collectionQuery, getUsers, getArchivedUsers, view]);

  useEffect(() => {
    getUser({ id: String(params.id) });
  }, [getUser, params.id]);

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
      title={view === "list" ? "Users" : "Archived Users"}
      detailTitle={
        params.id !== "new"
          ? user
            ? `${user.firstName ?? ""} ${user.middleName ?? ""} ${user.lastName ?? ""}`.trim() ||
              "User Detail"
            : "User Detail"
          : "New User"
      }
      config={config}
      detail={children}
      items={view === "list" ? users?.data : archivedUsers?.data}
      total={view === "list" ? users?.count : archivedUsers?.count}
      itemsLoading={view === "list" ? isLoadingUsers : archivedUsersLoading}
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
