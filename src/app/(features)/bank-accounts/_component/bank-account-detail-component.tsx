"use client";

import DetailsPage from "@/src/shared/component/details-page/details-page.component";
import EmptyIcon from "@/src/shared/icons/empty-icon";
import { LoadingOverlay } from "@mantine/core";
import { useParams } from "next/navigation";
import { useEffect } from "react";
import { useLazyGetUserQuery } from "../../user/_store/user.query";
import {
  useLazyGetBankAccountQuery,
  useLazyGetTenantQuery,
} from "../_store/bank-account.query";

export default function BankAccountDetailComponent() {
  const params = useParams();

  const [getUser, user] = useLazyGetUserQuery();
  const [getBankAccount, bankAccount] = useLazyGetBankAccountQuery();
  const [getTenant, tenant] = useLazyGetTenantQuery();

  useEffect(() => {
    getTenant({
      id: `${bankAccount?.data?.tenantId}`,
    });
    getUser({});
  }, [bankAccount?.data?.tenantId, getTenant, getBankAccount]);

  const data = [
    {
      key: "ownerName",
      label: "Owner Name",
      value: `${bankAccount?.data?.ownerName ?? ""}`,
    },
    {
      key: "accountNumber",
      label: "Account Number",
      value: `${bankAccount?.data?.accountNumber ?? ""}`,
    },
    {
      key: "tenant",
      label: "Tenant Name",
      value: `${tenant?.data?.name ?? ""}`,
    },
    {
      key: "bankName",
      label: "Bank Name",
      value: `${bankAccount?.data?.bankName ?? ""}`,
    },
    {
      key: "bankCode",
      label: "Bank Code",
      value: `${bankAccount?.data?.bankCode ?? ""}`,
    },
    {
      key: "ownerType",
      label: "Owner Type",
      value: `${bankAccount?.data?.ownerType ?? ""}`,
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
    editUrl: `/bank-accounts//${params?.id}`,
    isProfile: false,
    title: `${bankAccount?.data?.ownerName ?? ""}`,
    widthClass: "w-full",
  };

  useEffect(() => {
    getBankAccount({
      id: `${params?.id}`,
    });
  }, [params?.id]);

  return (
    <div className="w-full flex-col space-y-4 buser">
      {bankAccount?.isLoading || bankAccount?.isFetching ? (
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
          isLoading={bankAccount?.isLoading || bankAccount?.isFetching}
        />
      )}
    </div>
  );
}
