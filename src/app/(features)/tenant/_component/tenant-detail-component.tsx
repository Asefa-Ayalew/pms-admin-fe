"use client";

import DetailsPage from "@/src/shared/component/details-page/details-page.component";
import EmptyIcon from "@/src/shared/icons/empty-icon";
import { LoadingOverlay } from "@mantine/core";
import { useParams } from "next/navigation";
import { useEffect } from "react";
import { useLazyGetUserQuery } from "../../user/_store/user.query";
import { useLazyGetTenantQuery } from "../_store/tenant.query";

export default function TenantDetailComponent() {
  const params = useParams();

  const [getUser, user] = useLazyGetUserQuery();
  const [getTenant, tenant] = useLazyGetTenantQuery();

  const data = [
    {
      key: "name",
      label: "Name",
      value: tenant?.data?.name ?? "N/A",
    },
    {
      key: "tradeName",
      label: "Trade Name",
      value: tenant?.data?.tradeName ?? "N/A",
    },
    {
      key: "tin",
      label: "Taxpayer ID Number",
      value: tenant?.data?.tin ?? "N/A",
    },
    {
      key: "phoneNumber",
      label: "Phone Number",
      value:
        [
          tenant?.data?.phoneNumber,
          ...(tenant?.data?.secondaryPhoneNumbers || []),
        ]
          .filter(Boolean)
          .join(", ") || "N/A",
    },
    {
      key: "email",
      label: "Email Address",
      value:
        [tenant?.data?.email, ...(tenant?.data?.secondaryEmails || [])]
          .filter(Boolean)
          .join(", ") || "N/A",
    },
    {
      key: "industry",
      label: "Industry",
      value: tenant?.data?.industry ?? "N/A",
    },
    {
      key: "createdAt",
      label: "Registered On",
      value: tenant?.data?.createdAt
        ? new Date(tenant.data.createdAt).toLocaleString()
        : "N/A",
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
    editUrl: `/tenants/${params?.id}`,
    isProfile: false,
    title: `${tenant?.data?.name ?? ""}`,
    widthClass: "w-full",
  };

  useEffect(() => {
    getTenant({
      id: `${params?.id}`,
    });
    getUser({});
  }, [params?.id, getTenant, getUser]);

  return (
    <div className="w-full flex-col space-y-4 buser border border-gray-200">
      {tenant?.isLoading || tenant?.isFetching ? (
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
          isLoading={tenant.isLoading || tenant.isFetching}
        />
      )}
    </div>
  );
}
