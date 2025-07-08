"use client";

import { useParams, usePathname } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";

import {
  EntityConfig,
  entityViewMode,
} from "@/src/shared/models/entity-config.model";
import { Room } from "@/src/models/room.model";
import { formatDate } from "@/src/shared/utils/date-utils";
import EntityList, {
  TableBehaviorConfig,
  TableStyleConfig,
} from "@/src/shared/entity/entity-list";
import { useLazyGetRoomQuery, useLazyGetRoomsQuery } from "./_store/room.query";
import { CollectionQuery } from "@/src/shared/models/collection.model";

export default function RoomsList({ children }: { children: React.ReactNode }) {
  const params = useParams();
  const pathname = usePathname();
  const [collectionQuery, setCollectionQuery] = useState<CollectionQuery>({
    skip: 0,
    top: 20,
    orderBy: [{ field: "createdAt", direction: "desc" }],
  });
  const [getRooms, { data: roomData, isLoading, error }] =
    useLazyGetRoomsQuery();
  const [getRoom, { data: room }] = useLazyGetRoomQuery();

  useEffect(() => {
    getRooms({
      ...collectionQuery,
    });
  }, [getRooms, collectionQuery]);

  useEffect(() => {
    if (params?.id) {
      getRoom({ id: String(params.id) });
    }
  }, [getRoom, params?.id]);

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
          render: (data: Room) => `${data?.isFurnished ?? ""}`,
        },
        {
          key: "numberOfRooms",
          name: "Number of Rooms",
          render: (data: Room) => `${data?.numberOfBedRooms ?? ""}`,
        },
        {
          key: "createdAt",
          name: "Created At",
          render: (data: Room) => formatDate(data?.createdAt),
        },
      ],
      showDetail: true,
      hasActions: false,
    }),
    []
  );

  const isNewRoute = pathname.endsWith("/new");

  const viewMode: entityViewMode =
    isNewRoute || params?.id !== undefined ? "detail" : "list";
  const styleConfig: TableStyleConfig = useMemo(
    () => ({
      primaryColor: "blue",
      dangerColor: "red",
      fontSize: "sm",
      density: "xs",
      shadowLevel: "xs",
      borderColor: "border-gray-200",
      rowHoverColor: "var(--mantine-color-blue-50)",
    }),
    []
  );

  const behaviorConfig: TableBehaviorConfig = useMemo(
    () => ({
      enableColumnFilters: false,
      enableGlobalFilter: false,
      enableColumnResizing: false,
      enableFullScreenToggle: false,
      enableDensityToggle: false,
      enableColumnOrdering: false,
      enablePagination: true,
      enableMultiSort: false,
      enableMultiRowSelection: true,
      manualFiltering: false,
      manualPagination: true,
      manualSorting: true,
      paginationDisplayMode: "default",
      positionPagination: "bottom",
      positionActionsColumn: "last",
      enableHiding: false,
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
    <EntityList
      title="Rooms"
      detailTitle={isNewRoute ? "New Room" : room?.description}
      config={config}
      viewMode={viewMode}
      detail={children}
      defaultPageSize={20}
      pageSizeOptions={[10, 20, 30, 50, 100]}
      _showTotal={true}
      tableKey="rooms"
      dataLoadMode="static"
      items={roomData?.data || []}
      total={roomData?.count || 0}
      itemsLoading={isLoading}
      styleConfig={styleConfig}
      behaviorConfig={behaviorConfig}
      errorText={error ? "Failed to load rooms. Please try again." : undefined}
      noDataText="No rooms found"
      onPaginationChange={handlePaginationChange}
      onSearch={onSearch}
      onOrder={onOrder}
      onFilterChange={onFilter}
    />
  );
}
