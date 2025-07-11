"use client";

import React from "react";
import DetailsPage from "@/src/shared/component/details-page/details-page.component";
import EmptyIcon from "@/src/shared/icons/empty-icon";
import { CollectionQuery } from "@/src/shared/models/collection.model";
import { LoadingOverlay } from "@mantine/core";
import dayjs from "dayjs";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useLazyGetRolesQuery } from "../../role/_store/role.query";
import { useLazyGetUserQuery } from "../_store/user.query";

export default function UserDetailComponent() {
  const params =  useParams() // React.use(useParams());

  const [getUser, user] = useLazyGetUserQuery();
  const [getRoles, roles] = useLazyGetRolesQuery();
  const [collection, setCollection] = useState<CollectionQuery>({});

  useEffect(() => {
    getRoles(collection);
  }, [collection]);
  useEffect(() => {
    if (params?.id) {
      getUser({
        id: `${params.id}`,
        includes: ["userRoles", "userRoles.role", "userContacts"],
      });
    }
  }, [params?.id, getUser]);

  
  const data = [
    {
      key: "name",
      label: "Name",
      value: `${user?.data?.firstName ?? ""} ${user?.data?.middleName ?? ""} ${user?.data?.lastName ?? ""}`,
    },
    {
      key: "employeeNumber",
      label: "Employee Number",
      value: user?.data?.employeeNumber ?? "",
    },
    {
      key: "phone",
      label: "Phone",
      value: user?.data?.phone ?? "",
    },
    {
      key: "email",
      label: "Email",
      value: user?.data?.email ?? "",
    },
    {
      key: "startDate",
      label: "Employment Date",
      value: user?.data?.startDate
        ? dayjs(user?.data?.startDate).format("DD-MMM-YYYY")
        : "",
    },
    {
      key: "tin",
      label: "TIN",
      value: user?.data?.tin ?? "",
    },
    {
      key: "address",
      label: "Address",
      value: "",
      children: [
        {
          key: "country",
          label: "Country",
          value: user?.data?.address?.country ?? "",
        },
        {
          key: "city",
          label: "City",
          value: user?.data?.address?.city ?? "",
        },
        {
          key: "subcity",
          label: "Subcity",
          value: user?.data?.address?.subcity ?? "",
        },
        {
          key: "woreda",
          label: "Woreda",
          value: user?.data?.address?.woreda ?? "",
        },
        {
          key: "kebele",
          label: "Kebele",
          value: user?.data?.address?.kebele ?? "",
        },
        {
          key: "Trial",
          label: "Trial",
          value: "",
          children: [
            {
              key: "name",
              label: "Name",
              value:  "absent",
            },
            {
              key: "code",
              label: "Code",
              value: "trial",
            },
          ],
        },
      ],
    },
    {
      key: "roles",
      label: "Roles",
      value: user?.data?.userRoles
        ? user?.data?.userRoles
            .map((userRole) => userRole?.name?.toUpperCase())
            .filter(Boolean)
        : [],
    },
  ];

  console.log(roles, setCollection);
  const profileData = {
    image: "",
    name: `${user?.data?.firstName ?? ""} ${user?.data?.middleName ?? ""} ${
      user?.data?.lastName ?? ""
    }`,
    type: "",
    address: "",
    phone: "",
    email: "",
    isVerified: false,
  };
  const config = {
    editUrl: `/user/${params?.id}`,
    isProfile: false,
    title: `${user?.data?.firstName ?? ""} ${user?.data?.middleName ?? ""} ${
      user?.data?.lastName ?? ""
    }`,
    widthClass: "w-full",
  };

  return (
    // <Tabs defaultValue="emergency" className="w-full">
    //   <Tabs.List className="gap-8 my-2">
    //     <Tabs.Tab leftSection={<IconUserShield size={15} />} value="emergency">
    //       Contacts
    //     </Tabs.Tab>
    //     <Tabs.Tab leftSection={<EyeIcon size={15} />} value="detail">
    //       Detail
    //     </Tabs.Tab>
    //     <Tabs.Tab leftSection={<IconBuildingBank size={15} />} value="bank">
    //       Bank Account
    //     </Tabs.Tab>
    //   </Tabs.List>
    //   <Tabs.Panel value="emergency">
    //     <EmergencyContactsComponent />
    //     {/* nothing here yet */}
    //   </Tabs.Panel>
    //   <Tabs.Panel value="detail">
        <div className="w-full flex-col space-y-4 buser">
          {user?.isLoading || user?.isFetching ? (
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
              isLoading={user.isLoading || user.isFetching}
            />
          )}
        </div>
    //   </Tabs.Panel>
    //   <Tabs.Panel value="bank">
    //     <UserBankAccountComponent />
    //     {/* nothing here yet */}
    //   </Tabs.Panel>
    // </Tabs>
  );
}
