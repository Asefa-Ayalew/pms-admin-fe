"use client";

import DetailsPage from "@/src/shared/component/details-page/details-page.component";
import { BankAccountType } from "@/src/shared/enum/app.enum";
import EmptyIcon from "@/src/shared/icons/empty-icon";
import { LoadingOverlay } from "@mantine/core";
import dateFormat from "dateformat";
import { useParams } from "next/navigation";
import { useEffect } from "react";
import { useLazyGetUserQuery } from "../../user/_store/user.query";
import { useLazyGetOrganizationBankAccountQuery } from "../_store/organization-bank-account.query";

export default function OrganizationBankAccountDetailComponent() {
  const params = useParams();

  const [getUser, user] = useLazyGetUserQuery();
  const [getOrganizationBankAccount, organizationBankAccount] =
    useLazyGetOrganizationBankAccountQuery();
  const getAccountTypeLabel = (type?: BankAccountType): string => {
    const typeMap = {
      [BankAccountType.SAVINGS]: "Savings Account",
      [BankAccountType.CHECKING]: "Checking Account",
      [BankAccountType.BUSINESS]: "Business Account",
      [BankAccountType.JOINT]: "Joint Account",
    };
    return type ? typeMap[type] || "Unknown" : "";
  };

  const data = [
    {
      key: "accountNumber",
      label: "Account Number",
      value: `${organizationBankAccount?.data?.accountNumber ?? ""}`,
    },
    {
      key: "bankName",
      label: "Bank Name",
      value: `${organizationBankAccount?.data?.bankName ?? ""}`,
    },
    {
      key: "bankCode",
      label: "Bank Code",
      value: `${organizationBankAccount?.data?.bankCode ?? ""}`,
    },
    {
      key: "accountType",
      label: "Account Type",
      value:
        getAccountTypeLabel(organizationBankAccount?.data?.accountType) ?? "",
    },
    {
      key: "isActive",
      label: "Status",
      value: `${organizationBankAccount?.data?.isActive ? "Active" : "Inactive"}`,
    },
    {
      key: "createdAt",
      label: "Created At",
      value: dateFormat(
        organizationBankAccount?.data?.createdAt,
        "mmmm dd, yyyy"
      ),
    },
  ];

  const profileData = {
    image: "",
    name: `${user?.data?.firstName ?? ""} ${user?.data?.middleName ?? ""} ${user?.data?.lastName ?? ""}`,
    type: "",
    address: "",
    phone: "",
    email: "",
    isVerified: false,
  };

  const config = {
    editUrl: `/organization-bank-accounts/${params?.id}`,
    isProfile: false,
    title: `${organizationBankAccount?.data?.accountNumber ?? ""}`,
    widthClass: "w-full",
  };

  useEffect(() => {
    getOrganizationBankAccount({
      id: `${params?.id}`,
    });
  }, [params?.id, getUser]);

  return (
    <div className="w-full flex-col space-y-4 buser">
      {organizationBankAccount?.isLoading ||
      organizationBankAccount?.isFetching ? (
        <div className="relative flex items-center justify-center">
          <LoadingOverlay
            visible={true}
            zIndex={1000}
            overlayProps={{ radius: "sm", blur: 2 }}
          />
          <EmptyIcon />
        </div>
      ) : (
        <DetailsPage
          dataSource={[{ title: "Basic Information", source: data }]}
          profileData={profileData}
          config={config}
          isLoading={
            organizationBankAccount.isLoading ||
            organizationBankAccount.isFetching
          }
        />
      )}
    </div>
  );
}
