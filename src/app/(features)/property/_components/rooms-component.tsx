"use client";

import { useParams } from "next/navigation";
import React, { useCallback, useEffect, useMemo, useState } from "react";

import { Room } from "@/src/models/room.model";
import { CollectionQuery } from "@/src/shared/models/collection.model";
import {
  EntityConfig,
  entityViewMode,
} from "@/src/shared/models/entity-list-config";

import { formatDate } from "@/src/shared/utils/date-utils";
import clsx from "clsx";
import {
  useLazyGetArchivedRoomsQuery,
  useLazyGetRoomsQuery,
} from "../_store/room.query";
import InnerTable from "@/src/shared/table/inner-table";

export default function RoomsComponent() {
  const params = useParams();

  const [viewMode, setViewMode] = useState<entityViewMode>("list");
  const [view, setView] = useState<"list" | "archived">("list");
  const [collectionQuery, setCollectionQuery] = useState<CollectionQuery>({
    skip: 0,
    top: 20,
    orderBy: [{ field: "createdAt", direction: "desc" }],
    filter :[[{field: 'propertyId', value: params.id, operator: '='}]]
  });

  const [getRooms, { data: rooms, isLoading: isLoadingRooms }] =
    useLazyGetRoomsQuery();
  const [
    getArchivedRooms,
    { data: archivedRooms, isLoading: archivedRoomsLoading },
  ] = useLazyGetArchivedRoomsQuery();

  useEffect(() => {
    if (view === "list") {
      getRooms(collectionQuery);
    } else {
      getArchivedRooms(collectionQuery);
    }
  }, [collectionQuery, getRooms,getArchivedRooms, view]);

  useEffect(() => {
    setViewMode(params?.id !== undefined ? "detail" : "list");
  }, [params?.id]);

  const config = useMemo<EntityConfig<Room>>(
    () => ({
      primaryColumn: {
        key: "description",
        name: "Description",
        render: (data: Room) => `${data?.description ?? ""}`,
      },
      rootUrl: "/room",
      detailUrl: "detail",
      identity: "id",
      visibleColumn: [
        {
          key: "description",
          name: "Description",
          render: (data: Room) => `${data?.description ?? ""}`,
        },
        {
          key: "size",
          name: "Size",
          render: (data: Room) => `${data?.size ?? ""}`,
        },
        {
          key: "isFurnished",
          name: "Is Furnished",
          render: (data: Room) => `${data?.isFurnished ? "Yes" : "No"}`,
        },
        {
          key: "makePublic",
          name: "Make Public",
          render: (data: Room) => `${data?.makePublic ? "Yes" : "No"}`,
        },
        {
          key: "numberOfBedRooms",
          name: "No of Bed Rooms",
          render: (data: Room) => `${data?.numberOfBedRooms ?? ""}`,
        },
        {
          key: "amenities",
          name: "Amenities",
          render: (data: Room) => (
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
          render: (data: Room) => formatDate(data?.createdAt),
        },
      ],
      showDetail: false,
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

  console.log("view", view);

  return (
    <InnerTable
      config={config}
      items={view === "list" ? rooms?.data : archivedRooms?.data}
      total={view === "list" ? rooms?.count : archivedRooms?.count}
      itemsLoading={view === "list" ? isLoadingRooms : archivedRoomsLoading}
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
