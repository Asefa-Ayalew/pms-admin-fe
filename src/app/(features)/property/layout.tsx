"use client";

import { useParams, usePathname } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";

import {
  useLazyGetPropertiesQuery,
  useLazyGetPropertyQuery,
} from "./_store/property.query";
import {
  EntityConfig,
  entityViewMode,
} from "@/src/shared/models/entity-config.model";
import { Property } from "@/src/models/property.model";
import { formatDate } from "@/src/shared/utils/date-utils";
import EntityList, {
  CustomToolbarAction,
  TableBehaviorConfig,
  TableStyleConfig,
} from "@/src/shared/entity/entity-list";
import { CollectionQuery } from "@/src/shared/models/collection.model";
import { IconRefreshDot, IconUserPlus } from "@tabler/icons-react";

export default function PropertyListPage({
  children,
}: {
  children: React.ReactNode;
}) {
  const params = useParams();
  const pathname = usePathname();
  const [collectionQuery, setCollectionQuery] = useState<CollectionQuery>({
    skip: 0,
    top: 20,
    orderBy: [{ field: "createdAt", direction: "desc" }],
  });

  const [getProperties, { data: propertyData, isLoading, error }] =
    useLazyGetPropertiesQuery();

  const [getProperty, { data: selectedProperty }] = useLazyGetPropertyQuery();

  useEffect(() => {
    getProperties(collectionQuery);
  }, [getProperties, collectionQuery]);

  useEffect(() => {
    if (params?.id) {
      getProperty({ id: String(params.id) });
    }
  }, [params?.id, getProperty]);

  const config = useMemo<EntityConfig<Property>>(
    () => ({
      primaryColumn: {
        key: "description",
        name: "Description",
        render: (data: Property) => `${data?.description ?? ""}`,
      },
      rootUrl: "/property",
      detailUrl: "detail",
      identity: "id",
      visibleColumn: [
        {
          key: "description",
          name: "Description",
          render: (data: Property) => {
            const words = data?.description?.split(" ") ?? [];
            return words.length > 3
              ? `${words.slice(0, 3).join(" ")}...`
              : (data?.description ?? "");
          },
        },
        {
          key: "size",
          name: "Size",
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

  const isNewRoute = pathname.endsWith("/new");

  const viewMode: entityViewMode =
    isNewRoute || params?.id !== undefined ? "detail" : "list";
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
      enableColumnFilters: true,
      enableGlobalFilter: true,
      enableColumnResizing: true,
      enableFullScreenToggle: true,
      enableDensityToggle: true,
      enableColumnOrdering: true,
      enablePagination: true,
      enableMultiSort: true,
      enableMultiRowSelection: true,
      manualFiltering: true,
      manualPagination: true,
      manualSorting: true,
      paginationDisplayMode: "default",
      positionPagination: "bottom",
      positionActionsColumn: "last",
      enableHiding: true,
    }),
    []
  );

  return (
    <EntityList
      title="Properties"
      detailTitle={selectedProperty?.description}
      config={config}
      viewMode={viewMode}
      detail={children}
      defaultPageSize={20}
      pageSizeOptions={[10, 20, 30, 50, 100]}
      _showTotal={true}
      tableKey="properties"
      dataLoadMode="static"
      items={propertyData?.data || []}
      total={propertyData?.count || 0}
      itemsLoading={isLoading}
      styleConfig={styleConfig}
      behaviorConfig={behaviorConfig}
      showNewButton={false}
      errorText={
        error ? "Failed to load properties. Please try again." : undefined
      }
      noDataText="No properties found"
      onPaginationChange={handlePaginationChange}
      onSearch={onSearch}
      onOrder={onOrder}
      onFilterChange={onFilter}
    />
  );
}
