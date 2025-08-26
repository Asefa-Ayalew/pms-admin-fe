"use client";

import DetailsPage from "@/src/shared/component/details-page/details-page.component";
import EmptyIcon from "@/src/shared/icons/empty-icon";
import { LoadingOverlay } from "@mantine/core";
import dateFormat from "dateformat";
import { useParams } from "next/navigation";
import { useEffect } from "react";
import { useLazyGetTenantQuery } from "../_store/tenant.query";

export default function TenantDetailComponent() {
  const params = useParams();

  const [getTenant, tenant] = useLazyGetTenantQuery();
  let description = tenant?.data?.description ?? "";

  if (description.length > 40) {
    description = description.substring(0, 40) + " ...more";
  }

  console.log("Tenant Data", tenant?.data?.description);
  const data = [
    {
      key: "name",
      label: "Tenant Name",
      value: `${tenant?.data?.name ?? ""}`,
    },
    {
      key: "shortCode",
      label: "Short Code",
      value: `${tenant?.data?.shortCode ?? ""}`
    },
    {
      key: "description",
      label: "Description",
      value: `${tenant?.data?.description ?? ""}`
    },
    {
      key: "email",
      label: "Email",
      value: `${tenant?.data?.email ?? ""}`
    },
      {
      key: "secondaryEmails",
      label: "Secondary Emails",
      value: `${tenant?.data?.secondaryEmails ?? ""}`
    },
    {
      key: "phoneNumber",
      label: "Phone Number",
      value: `${tenant?.data?.phoneNumber ?? ""}`
    },
      {
      key: "secondaryPhoneNumbers",
      label: "Secondary Phone Numbers",
      value: `${tenant?.data?.secondaryPhoneNumbers ?? ""}`
    },
    {
      key: "industry",
      label: "Industry",
      value: `${tenant?.data?.industry ?? ""}`
    },
    {
      key: "tin",
      label: "Tin No",
      value: `${tenant?.data?.tin ?? ""}`
    },
    {
      key: "traderName",
      label: "Trader Name",
      value: `${tenant?.data?.tradeName ?? ""}`
    },
  
    {
      key: "createdAt",
      label: "Created At",
      value: dateFormat(tenant?.data?.createdAt, "mmmm dd, yyyy"),
    },
  ];

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
  }, [getTenant, params?.id]);

   return (
    <div className="w-full flex-col space-y-4 buser">
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
          config={config}
          description={tenant?.data?.description ?? ""}
          isLoading={tenant.isLoading || tenant.isFetching}
          hideEdit={true}
        />
      )}
    </div>
  );
}
