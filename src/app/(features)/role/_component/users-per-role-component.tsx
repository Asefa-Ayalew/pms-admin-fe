"use client";

import { useParams } from "next/navigation";
import React, { useCallback, useEffect, useMemo, useState } from "react";

import { CollectionQuery } from "@/src/shared/models/collection.model";
import {
  EntityConfig,
  entityViewMode,
} from "@/src/shared/models/entity-list-config";

import { useLazyGetUsersByRoleQuery } from "../_store/role.query";
import InnerTable from "@/src/shared/table/inner-table";
import { User } from "@/src/models/user.model";
import { IconEdit, IconEye, IconTrash } from "@tabler/icons-react";

export default function UsersPerRoleComponent() {
  const params = useParams();

  const [viewMode, setViewMode] = useState<entityViewMode>("list");
  const [collectionQuery, setCollectionQuery] = useState<CollectionQuery>({
    skip: 0,
    top: 20,
    orderBy: [{ field: "createdAt", direction: "desc" }],
  });

  const [getUsersByRole, { data: users, isLoading: usersLoading }] =
    useLazyGetUsersByRoleQuery();

  useEffect(() => {
    getUsersByRole({ ...collectionQuery, id: String(params.id) });
  }, [params.id, collectionQuery, getUsersByRole]);

  useEffect(() => {
    setViewMode(params?.id !== undefined ? "detail" : "list");
  }, [params?.id]);

  const config = useMemo<EntityConfig<User>>(
    () => ({
      primaryColumn: {
        key: "MiddleName",
        name: "Middle Name",
        render: (data: User) => `${data?.middleName ?? ""}`,
      },
      rootUrl: "/user",
      detailUrl: "detail",
      identity: "id",
      visibleColumn: [
        {
          key: "name",
          name: "Full Name",
          render: (data: User) =>
            `${data?.firstName ?? ""} ${data?.middleName ?? ""} ${
              data?.lastName ?? ""
            }`,
        },

        { name: "Email", key: "email" },
        { name: "Phone", key: "phone" },
        {
          key: "gender",
          name: "Gender",
          render: (value) => {
            return <span className="capitalize">{value?.gender}</span>;
          },
        },
        { key: "employeeNumber", name: "Employee Number" },
        { key: "startDate", name: "Employment Date", isDate: true },
        { key: "tin", name: "TIN" },
        { name: "Created At", key: "createdAt", isDate: true },
      ],
      actions: [
        { label: "Show More", key: "view", icon: IconEye, size: "16" },
        { label: "Edit", key: "edit", icon: IconEdit, size: "16" },
        { label: "Delete", key: "delete", icon: IconTrash, size: "16", type: "danger" },
      ],
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
    <InnerTable
      config={config}
      items={users?.data}
      total={users?.count}
      itemsLoading={usersLoading}
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
