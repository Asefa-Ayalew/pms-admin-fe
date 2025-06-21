"use client";

import DetailsPage from "@/src/shared/component/details-page/details-page.component";
import EmptyIcon from "@/src/shared/icons/empty-icon";
import { LoadingOverlay, Tabs, TabsPanel } from "@mantine/core";
import { IconEyeFilled, IconUserCircle } from "@tabler/icons-react";
import dateFormat from "dateformat";
import { useParams } from "next/navigation";
import { useEffect } from "react";
import { useLazyGetDepartmentQuery } from "../_store/department.query";
import DepartmentUsersComponent from "./department-users-component";

export default function DepartmentDetailComponent() {
  const params = useParams();

  const [getDepartment, department] = useLazyGetDepartmentQuery();
  let description = department?.data?.description ?? "";

  if (description.length > 40) {
    description = description.substring(0, 40) + " ...more";
  }
  const data = [
    {
      key: "name",
      label: "Department Name",
      value: `${department?.data?.name ?? ""}`,
    },
    {
      key: "createdAt",
      label: "Registration Date",
      value: dateFormat(department?.data?.createdAt, "mmmm dd, yyyy"),
    },
  ];

  const profileData = {
    image: "",
    name: "",
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
    <Tabs defaultValue="details" className="w-full">
      <Tabs.List className="gap-8 my-2">
        <Tabs.Tab leftSection={<IconEyeFilled size={15} />} value="details">
          Detail
        </Tabs.Tab>
        <Tabs.Tab leftSection={<IconUserCircle size={15} />} value="user">
          Users
        </Tabs.Tab>
      </Tabs.List>
      <TabsPanel value="details">
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
      </TabsPanel>
      <TabsPanel value="user">
        <DepartmentUsersComponent />
      </TabsPanel>
    </Tabs>
  );
}
