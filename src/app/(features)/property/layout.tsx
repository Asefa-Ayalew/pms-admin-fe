"use client";

import { useParams, useSearchParams } from "next/navigation";
import React, { useCallback, useEffect, useMemo, useState } from "react";

import { Property } from "@/src/models/property.model";
import { CollectionQuery } from "@/src/shared/models/collection.model";
import {
  EntityConfig,
  entityViewMode,
} from "@/src/shared/models/entity-list-config";
import {
  useLazyGetArchivedPropertiesQuery,
  useLazyGetPropertyQuery,
  useLazyGetPropertiesQuery,
} from "./_store/property.query";
import { formatDate } from "@/src/shared/utils/date-utils";
import clsx from "clsx";
import EntityTable from "@/src/shared/table/entity-table";

export default function PropertyListPage({
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
    getProperties,
    { data: properties, isLoading: isLoadingProperties },
  ] = useLazyGetPropertiesQuery();
  const [
    getArchivedProperties,
    { data: archivedProperties, isLoading: archivedPropertiesLoading },
  ] = useLazyGetArchivedPropertiesQuery();

  const [getProperty, { data: property }] = useLazyGetPropertyQuery();

  useEffect(() => {
    if (view === "list") {
      getProperties(collectionQuery);
    } else {
      getArchivedProperties(collectionQuery);
    }
  }, [collectionQuery, getArchivedProperties, getProperties, view]);

  useEffect(() => {
    getProperty({ id: String(params.id) });
  }, [getProperty, params.id]);

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

  const config = useMemo<EntityConfig<Property>>(
    () => ({
      primaryColumn: {
        key: "name",
        name: "Name",
        render: (data: Property) => `${data?.name ?? ""}`,
      },
      rootUrl: "/property",
      detailUrl: "detail",
      identity: "id",
      visibleColumn: [
        {
          key: "name",
          name: "Name",
          render: (data: Property) => `${data?.name ?? ""}`,
        },
        {
          key: "city",
          name: "City",
          render: (data: Property) => `${data?.address?.city ?? ""}`,
        },
        {
          key: "size",
          name: "Size",
          isNumber: true,
          render: (data: Property) => `${data?.size ?? ""}`,
        },
        {
          key: "isFurnished",
          name: "Is Furnished",
          render: (data: Property) => `${data?.isFurnished ? "Yes" : "No"}`,
        },
        {
          key: "numberOfRooms",
          name: "Number of Rooms",
          render: (data: Property) => `${data?.numberOfRooms ?? ""}`,
        },
        {
          key: "amenities",
          name: "Amenities",
          render: (data: Property) => (
            <div className="flex flex-wrap gap-2">
              {data?.amenities?.map((amenity, index) => (
                <React.Fragment key={`amenity-${index}`}>
                  <span
                    className={clsx(
                      "inline-block px-2 py-0.5 rounded-full text-xs font-medium mb-1",
                      {
                        "bg-blue-100 text-blue-800": index % 4 === 0,
                        "bg-green-100 text-green-800": index % 4 === 1,
                        "bg-yellow-100 text-yellow-800": index % 4 === 2,
                        "bg-purple-100 text-purple-800": index % 4 === 3,
                      }
                    )}
                  >
                    {amenity}
                  </span>
                  {(index + 1) % 4 === 0 && <div className="w-full" />}
                </React.Fragment>
              ))}
            </div>
          ),
        },
        {
          key: "createdAt",
          name: "Created At",
          render: (data: Property) => formatDate(data?.createdAt),
        },
      ],
      showDetail: true,
      hasActions: false,
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
      title={view === "list" ? "Properties" : "Archived Properties"}
      detailTitle={
        params.id !== "new"
          ? (property?.name ?? "Property Detail")
          : "New Property"
      }
      config={config}
      detail={children}
      items={view === "list" ? properties?.data : archivedProperties?.data}
      total={
        view === "list"
          ? properties?.count
          : archivedProperties?.count
      }
      itemsLoading={
        view === "list" ? isLoadingProperties : archivedPropertiesLoading
      }
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
