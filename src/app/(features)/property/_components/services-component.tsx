"use client";

import { useParams } from "next/navigation";
import React, { useCallback, useEffect, useMemo, useState } from "react";

import { CollectionQuery } from "@/src/shared/models/collection.model";
import {
  EntityConfig,
  entityViewMode,
} from "@/src/shared/models/entity-list-config";

import { formatDate } from "@/src/shared/utils/date-utils";
import InnerTable from "@/src/shared/table/inner-table";
import { useLazyGetPropertyQuery } from "../_store/property.query";
import { PropertyService } from "@/src/models/property.model";

export default function ServicesComponent() {
  const params = useParams();

  const [viewMode, setViewMode] = useState<entityViewMode>("list");
  const [collectionQuery, setCollectionQuery] = useState<CollectionQuery>({
    skip: 0,
    top: 20,
    orderBy: [{ field: "createdAt", direction: "desc" }],
  });

 const [getProperty, {data: property, isLoading}] = useLazyGetPropertyQuery()

  useEffect(() => {
    getProperty({ id: String(params.id), includes: ["services", "services.service"] });
  }, [collectionQuery, getProperty, params.id]);

  useEffect(() => {
    setViewMode(params?.id !== undefined ? "detail" : "list");
  }, [params?.id]);

  const config = useMemo<EntityConfig<PropertyService>>(
    () => ({
      primaryColumn: {
        key: ["service", "name"],
        name: "Name",
        render: (data: PropertyService) => `${data?.service?.name ?? ""}`,
      },
      rootUrl: "/service",
      detailUrl: "detail",
      identity: "id",
      visibleColumn: [
        {
          key: "name",
          name: "Name",
          render: (data: PropertyService) => `${data?.service?.name ?? ""}`,
        },
        {
          key: "description",
          name: "Description",
          render: (data: PropertyService) => `${data?.service?.description ?? ""}`,
        },
        {
          key: "chargeAmount",
          name: "Charge Amount",
          render: (data: PropertyService) => `${data?.chargeAmount ?? ""}`,
        },
        {
          key: "availableFrom",
          name: "Available From",
          render: (data: PropertyService) => `${data?.availableFrom?? ""}`,
        },
        {
          key: "isPublic",
          name: "Is Public",
          render: (data: PropertyService) => `${data?.isPublic ? 'Yes' : 'No'}`,
          isBoolean: true,
        },
        {
          key: "isOptional",
          name: "Is Optional",
          render: (data: PropertyService) => `${data?.isPublic ? "Yes" : 'No'}`,
          isBoolean: true,
        },
        {
          key: "createdAt",
          name: "Created Date",
          render: (data: PropertyService) => `${formatDate(data?.createdAt) ?? ""}`,
          isDate: true,
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


  return (
    <InnerTable
      config={config}
      items={property?.services || []}
      total={property?.services?.length || 0}
      itemsLoading={isLoading}
      collectionQuery={collectionQuery}
      viewMode={viewMode}
      showArchivedList={false}
      showNewButton={false}
      onPaginationChange={handlePaginationChange}
      onSearch={onSearch}
      onOrder={onOrder}
      onFilterChange={onFilter}
    />
  );
}
