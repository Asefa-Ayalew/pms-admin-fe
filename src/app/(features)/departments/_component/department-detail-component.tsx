"use client";

import DetailsPage from "@/src/shared/component/details-page/details-page.component";
import EmptyIcon from "@/src/shared/icons/empty-icon";
import { LoadingOverlay } from "@mantine/core";
import dateFormat from "dateformat";
import { useParams } from "next/navigation";
import { useEffect } from "react";
import { useLazyGetDepartmentQuery } from "../_store/department.query";

export default function DepartmentDetailComponent() {
  const params = useParams();

  const [getDepartment, department] = useLazyGetDepartmentQuery();
  let description = department?.data?.description ?? "";

  if (description.length > 40) {
    description = description.substring(0, 40) + " ...more";
  }

  console.log("Department Data", department?.data?.description);
  const data = [
    {
      key: "name",
      label: "Department Name",
      value: `${department?.data?.name ?? ""}`,
    },
    {
      key: "createdAt",
      label: "Created At",
      value: dateFormat(department?.data?.createdAt, "mmmm dd, yyyy"),
    },
  ];

  const profileData = {
    image: "",
    name: `${department?.data?.name ?? ""}`,
    type: "",
    address: "",
    phone: "",
    email: "",
    isVerified: false,
  };

  const config = {
    editUrl: `/departments/${params?.id}`,
    isProfile: false,
    title: `${department?.data?.name ?? ""}`,
    widthClass: "w-full",
  };

  useEffect(() => {
    getDepartment({
      id: `${params?.id}`,
      includes: ["users"],
    });
  }, [params?.id]);
  const users = department?.data?.user;
  console.log("Users", users);
  return (
    <div className="w-full flex-col space-y-4 buser">
      {department?.isLoading || department?.isFetching ? (
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
          description={department?.data?.description ?? ""}
          isLoading={department.isLoading || department.isFetching}
        />
      )}
    </div>
  );
}
