"use client";

import { useParams } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";

import { OrganizationBankAccount } from "@/src/models/organization-bank-account.model";
import EntityList, { CustomToolbarAction, TableBehaviorConfig, TableStyleConfig } from "@/src/shared/entity/entity-list";
import { BankAccountType } from "@/src/shared/enum/app.enum";
import { CollectionQuery } from "@/src/shared/models/collection.model";
import {
  EntityConfig,
  entityViewMode,
} from "@/src/shared/models/entity-config.model";
import { useLazyGetOrganizationBankAccountsQuery } from "./_store/organization-bank-account.query";
import { IconAdjustments, IconDownload, IconRefreshDot, IconUserPlus } from "@tabler/icons-react";

export default function OrganizationBankAccountListPage({
  children,
}: {
  children: React.ReactNode;
}) {
  const params = useParams();

  // Component states
  // const [check, setCheck] = useState(false);
  // const [selectedOrganizationBankAccount, setSelectedType] =
  //   useState<OrganizationBankAccount>();
  const [viewMode, setViewMode] = useState<entityViewMode>("list");
  const [collection, setCollection] = useState<CollectionQuery>({
    skip: 0,
    top: 20,
    orderBy: [{ field: "createdAt", direction: "desc" }],
  });

  // RTK hooks
  const [getOrganizationBankAccount, { data: organizationBankAccounts, isLoading, error }] =
    useLazyGetOrganizationBankAccountsQuery();

  const bankAccountTypeLabels: Record<BankAccountType, string> = {
    [BankAccountType.SAVINGS]: "Savings Account",
    [BankAccountType.CHECKING]: "Checking Account",
    [BankAccountType.BUSINESS]: "Business Account",
    [BankAccountType.JOINT]: "Joint Account",
  };

  useEffect(() => {
    getOrganizationBankAccount(collection);
  }, [collection, getOrganizationBankAccount]);

  // useEffect(() => {
  //   setSelectedType(
  //     organizationBankAccounts?.data.find(
  //       (item) => item?.id === `${params?.id}`
  //     )
  //   );
  // }, [params?.id, organizationBankAccounts?.data]);

  useEffect(() => {
    setViewMode(params?.id !== undefined ? "detail" : "list");
  }, [params?.id]);

  const config = useMemo<EntityConfig<OrganizationBankAccount>>(() => ({
    primaryColumn: {
      key: "accountNumber",
      name: "Account Number",
      render: (data: OrganizationBankAccount) => `${data?.accountNumber ?? ""}`,
    },
    rootUrl: "/organization-bank-accounts",
    identity: "id",
    visibleColumn: [
      {
        key: "accountNumber",
        name: "Account Number",
        render: (data: OrganizationBankAccount) =>
          `${data?.accountNumber ?? ""}`,
      },
      {
        key: "bankName",
        name: "Bank Name",
      },
      {
        key: "bankCode",
        name: "Bank Code",
      },
      {
        key: "accountType",
        name: "Account Type",
        render: (data: OrganizationBankAccount) =>
          bankAccountTypeLabels[data?.accountType as BankAccountType] ||
          "Unknown",
      },
      {
        key: "isActive",
        name: "Status",
        render: (data: OrganizationBankAccount) =>
          `${data?.isActive ? "Active" : "Inactive"}`,
      },
      {
        key: "createdAt",
        name: "Created At",
        isDate: true,
      },
    ],
  }), []);

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
            setCollection((prev) => ({
              ...prev,
              skip: pageIndex - 1,
              top: pageSize,
            }));
          },
          []
        );
        const onSearch = (search: string) => {
          setCollection((prev) => ({
            ...prev,
            skip: 0,
            search: search,
          }));
        };
      
        const onFilter = (filter: any[]) => {
          setCollection((prev) => ({
            ...prev,
            filter, 
          }));
        };
       
        const onOrder = (order: { field: string; direction: "desc" | "asc" }) => {
          setCollection((prev) => ({
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
            onClick: () => getOrganizationBankAccount({ skip: 0, top: 20 }),
            tooltip: "Refresh Bank ACC data",
            position: "top",
            order: 1,
          },
          {
            key: "add-account",
            label: "Add User Bank Account",
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
        [getOrganizationBankAccount]
      );
      // const renderCustomLeftToolbar = useCallback(() => {
      //   return (
      //     <div className="flex items-center gap-2">
      //       <Button
      //         leftSection={<IconUserPlus size={16} />}
      //         size="sm"
      //         color="green"
      //       >
      //         New
      //       </Button>
  
      //       <TextInput placeholder="Search bank accounts..." size="sm" className="w-64" />
      //     </div>
      //   );
      // }, []);
    

  return (
    <div className="flex w-full">
      <EntityList
                  title="users"
                  detailTitle="Detail"
                  config={config}
                  viewMode={viewMode}
                  detail={children}
                  defaultPageSize={20}
                  pageSizeOptions={[10, 20, 30, 50, 100]}
                  _showTotal={true}
                  tableKey="users"
                  dataLoadMode="static"
                  items={organizationBankAccounts?.data || []}
                  total={organizationBankAccounts?.count || 0}
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
