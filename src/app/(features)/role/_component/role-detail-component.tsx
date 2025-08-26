"use client";

import DetailsPage from "@/src/shared/component/details-page/details-page.component";
import { useParams } from "next/navigation";
import { useEffect } from "react";
import { useLazyGetRoleQuery } from "../_store/role.query";

import EmptyIcon from "@/src/shared/icons/empty-icon";
import { LoadingOverlay, Tabs } from "@mantine/core";
import UsersPerRoleComponent from "./users-per-role-component";

export default function RoleDetailComponent() {
  const params = useParams();

  const [getRole, role] = useLazyGetRoleQuery();

  const data =
    [
      {
        key: "1",
        label: "Name",
        value: role?.data?.name ?? "",
      },

      {
        key: "5",
        label: "Key",
        value: role?.data?.key ?? "",
      },
      {
        key: "6",
        label: "Description",
        value: role?.data?.description ?? "",
      },
    ];

  const profileData = {
    image: "",
    name: `${role?.data?.name}:''}`,
    type: "",
    address: "",
    phone: "",
    email: "",
    isVerified: false,
  };
  const config = {
    editUrl: `/roles/${params?.id}`,
    isProfile: false,
    title: `${role?.data?.name}`,
    widthClass: "w-full",
    hideEditButton: true,
  };

  useEffect(() => {
    getRole(`${params?.id}`);
  }, [getRole, params?.id]);
  return (
    <div className="w-full flex-col space-y-4 border border-gray-200">
      <Tabs defaultValue="detail">
        <Tabs.List>
          <Tabs.Tab value="detail">Basic Detail</Tabs.Tab>
          <Tabs.Tab value="user">Assigned Users</Tabs.Tab>
        </Tabs.List>

        <Tabs.Panel value="detail">
          {role?.isLoading || role?.isFetching ? (
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
              isLoading={role.isLoading || role.isFetching}
            />
          )}
        </Tabs.Panel>
        <Tabs.Panel value="user">
          <UsersPerRoleComponent />
          {/* nothing */}
        </Tabs.Panel>
      </Tabs>
    </div>
  );
}
