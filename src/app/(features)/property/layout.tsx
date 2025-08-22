"use client";

import { useParams, usePathname } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";

import {
  useLazyGetArchivedPropertiesQuery,
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
  TableBehaviorConfig,
  TableStyleConfig,
} from "@/src/shared/entity/entity-list";
import { CollectionQuery } from "@/src/shared/models/collection.model";

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
  const [view, setView] = useState<"list" | "archived">("list");

  const [getProperties, { data: properties, isLoading, error }] =
    useLazyGetPropertiesQuery();

  const [getProperty, { data: selectedProperty }] = useLazyGetPropertyQuery();
  const [
    getArchivedProperties,
    { data: archivedProperties, isLoading: archivedPropertiesLoading },
  ] = useLazyGetArchivedPropertiesQuery();

  useEffect(() => {
    if (view === "list") {
      getProperties(collectionQuery);
    }
  }, [collectionQuery, getProperties, view]);

  useEffect(() => {
    if (view === "archived") {
      getArchivedProperties(collectionQuery);
    }
  }, [collectionQuery, getArchivedProperties, view]);

  useEffect(() => {
    if (params?.id) {
      getProperty({ id: String(params.id) });
    }
  }, [params?.id, getProperty]);

  const config = useMemo<EntityConfig<Property>>(
    () => ({
      primaryColumn: {
        key: "size",
        name: "Size",
        render: (data: Property) => `${data?.size ?? ""}`,
      },
      rootUrl: "/property",
      detailUrl: "detail",
      identity: "id",
      visibleColumn: [
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
  const onRefresh = useCallback(() => {
    if (view === "list") {
      getProperties(collectionQuery);
    } else {
      getArchivedProperties(collectionQuery);
    }
  }, [collectionQuery, getProperties, getArchivedProperties, view]);

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

  const total = view === "list" ? properties?.total : archivedProperties?.total;
  const items = view === "list" ? properties?.data : archivedProperties?.data;
  const itemsLoading = view === "list" ? isLoading : archivedPropertiesLoading;

  return (
    <EntityList
      title={view === "list" ? "Properties" : "Archived Properties"}
      items={items ?? []}
      total={total ?? 0}
      itemsLoading={itemsLoading ?? false}
      detailTitle={selectedProperty?.description}
      config={config}
      view={view}
      viewMode={viewMode}
      detail={children}
      defaultPageSize={20}
      pageSizeOptions={[10, 20, 30, 50, 100]}
      _showTotal={true}
      tableKey="properties"
      dataLoadMode="static"
      showNewButton={false}
      onViewChange={setView}
      styleConfig={styleConfig}
      behaviorConfig={behaviorConfig}
      errorText={
        error ? "Failed to load properties. Please try again." : undefined
      }
      noDataText="No properties found"
      onPaginationChange={handlePaginationChange}
      onSearch={onSearch}
      onOrder={onOrder}
      onFilterChange={onFilter}
      onRefresh={onRefresh}
    />
  );
}
