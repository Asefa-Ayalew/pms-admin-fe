"use client";

import { useParams } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";

import { BankAccount, OwnerType } from "@/src/models/bank-account.model";
import EntityList, {
  CustomToolbarAction,
  TableBehaviorConfig,
  TableStyleConfig,
} from "@/src/shared/entity/entity-list";
import { CollectionQuery } from "@/src/shared/models/collection.model";
import {
  EntityConfig,
  entityViewMode,
} from "@/src/shared/models/entity-config.model";
import {
  useLazyGetBankAccountsQuery,
  useLazyGetTenantQuery,
} from "./_store/bank-account.query";
import {
  IconAdjustments,
  IconDownload,
  IconRefreshDot,
  IconUserPlus,
} from "@tabler/icons-react";

export default function BankAccountListPage({
  children,
}: {
  children: React.ReactNode;
}) {
  const params = useParams();

  // Component states
  const [getTenant, tenant] = useLazyGetTenantQuery();
  const [tenantMap, setTenantMap] = useState<Record<string, string>>({});
  const [viewMode, setViewMode] = useState<entityViewMode>("list");
  const [collectionQuery, setCollectionQuery] = useState<CollectionQuery>({
    skip: 0,
    top: 20,
    orderBy: [{ field: "createdAt", direction: "desc" }],
  });

  // RTK hooks
  const [getBankAccount, { data: bankAccounts, isLoading, error }] =
    useLazyGetBankAccountsQuery();

  console.log("Tenane", tenant);
  useEffect(() => {
    getBankAccount(collectionQuery);
  }, [collectionQuery, getBankAccount]);


  useEffect(() => {
    setViewMode(params?.id !== undefined ? "detail" : "list");
  }, [params?.id]);

  // Fetch tenant names by tenantId
  useEffect(() => {
    if (bankAccounts?.data && bankAccounts?.data?.length > 0) {
      const tenantIds = Array.from(
        new Set(bankAccounts.data.map((account) => account.tenantId))
      );

      tenantIds.forEach(async (tenantId) => {
        if (tenantId && !tenantMap[tenantId]) {
          const tenantResponse = await getTenant({ id: tenantId }).unwrap();
          setTenantMap((prev) => ({
            ...prev,
            [tenantId]: tenantResponse.name,
          }));
        }
      });
    }
  }, [bankAccounts?.data, getTenant]);

  // Entity configuration with tenant name
  const config = useMemo<EntityConfig<BankAccount>>(
    () => ({
      primaryColumn: {
        key: "ownerName",
        name: "Owner Name",
        render: (data: BankAccount) => `${data?.ownerName ?? ""}`,
      },
      rootUrl: "/bank-accounts",
      identity: "id",
      visibleColumn: [
        {
          key: "ownerName",
          name: "Owner Name",
          render: (data: BankAccount) => `${data?.ownerName ?? ""}`,
        },
        {
          key: "accountNumber",
          name: "Account Number",
        },
        {
          key: "bankCode",
          name: "Bank Code",
        },
        {
          key: "bankName",
          name: "Bank Name",
        },
        {
          key: "ownerType",
          name: "Owner Type",
          render: (data: BankAccount) => {
            const ownerTypeLabels: Record<OwnerType, string> = {
              [OwnerType.INDIVIDUAL]: "Individual",
              [OwnerType.GOVERNMENTAL]: "Governmental",
              [OwnerType.COMPANY]: "Company",
              [OwnerType.ORGANIZATION]: "Organization",
            };
            return ownerTypeLabels[data?.ownerType as OwnerType] ?? "Unknown";
          },
        },
        {
          key: "createdAt",
          name: "Created At",
          isDate: true,
        },
      ],
    }),
    []
  );
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
  //Rtk hooks
  const customActions: CustomToolbarAction[] = useMemo(
    () => [
      {
        key: "refresh",
        label: "Refresh Account List",
        icon: <IconRefreshDot size={18} />,
        color: "blue",
        onClick: () => getBankAccount({ skip: 0, top: 20 }),
        tooltip: "Refresh Bank ACC data",
        position: "top",
        order: 1,
      },
      {
        key: "add-account",
        label: "Add User Banck Account",
        icon: <IconUserPlus size={18} />,
        color: "green",
        onClick: () => console.log("Add bank acc clicked"),
        tooltip: "Add a bank acc",
        position: "top",
        order: 2,
      },
      {
        key: "export-acc",
        label: "Export",
        icon: <IconDownload size={18} />,
        color: "cyan",
        onClick: () => console.log("Export clicked"),
        tooltip: "Export acc data",
        position: "bottom",
        variant: "subtle",
        order: 1,
      },
      {
        key: "settings",
        label: "Settings",
        icon: <IconAdjustments size={18} />,
        color: "gray",
        onClick: () => console.log("Settings clicked"),
        tooltip: "Table settings",
        position: "bottom",
        variant: "subtle",
        order: 2,
      },
    ],
    [getBankAccount]
  );
  // const renderCustomLeftToolbar = useCallback(() => {
  //   return (
  //     <div className="flex items-center gap-2">
  //       <Button
  //         leftSection={<IconUserPlus size={16} />}
  //         size="sm"
  //         color="green"
  //       >
  //         Add New Bank Account
  //       </Button>

  //       <TextInput
  //         placeholder="Search bank accounts..."
  //         size="sm"
  //         className="w-64"
  //       />
  //     </div>
  //   );
  // }, []);

  return (
    <div className="flex w-full">
      <EntityList
        title="Bank Accounts"
        detailTitle="Detail"
        config={config}
        viewMode={viewMode}
        detail={children}
        defaultPageSize={20}
        pageSizeOptions={[10, 20, 30, 50, 100]}
        _showTotal={true}
        tableKey="users"
        dataLoadMode="static"
        items={bankAccounts?.data || []}
        total={bankAccounts?.count || 0}
        itemsLoading={isLoading}
        styleConfig={styleConfig}
        behaviorConfig={behaviorConfig}
        errorText={
          error ? "Failed to load bank accounts. Please try again." : undefined
        }
        noDataText="No bank account found"
        customActions={customActions}
        onPaginationChange={handlePaginationChange}
        onSearch={onSearch}
        onOrder={onOrder}
        onFilterChange={onFilter}
      />
    </div>
  );
}
