"use client";

import DetailsPage from "@/src/shared/component/details-page/details-page.component";
import EmptyIcon from "@/src/shared/icons/empty-icon";
import { LoadingOverlay } from "@mantine/core";
import { useParams } from "next/navigation";
import { useEffect } from "react";
import { useLazyGetUserQuery } from "../../user/_store/user.query";
import { useLazyGetPropertyQuery } from "../_store/property.query";

export default function PropertyDetailComponent() {
  const params = useParams();

  const [getUser, user] = useLazyGetUserQuery();
  const [getProperty, { data: property, isLoading, isFetching }] =
    useLazyGetPropertyQuery();

  const data = [
    { key: "description", label: "Description", value: property?.description },
    {
      key: "address?.country",
      label: "Country",
      value: property?.address.country,
    },
    { key: "address?.city", label: "city", value: property?.address.city },
    {
      key: "address?.subcity",
      label: "Subcity",
      value: property?.address.subcity,
    },
    {
      key: "address?.woreda",
      label: "Woreda",
      value: property?.address.woreda,
    },
    {
      key: "address?.kebele",
      label: "Kebele",
      value: property?.address.kebele,
    },
    { key: "size", label: "Size", value: property?.size },
    {
      key: "numberOfRooms",
      label: "Number of Rooms",
      value: property?.numberOfRooms,
    },
    { key: "amenties", label: "amenties", value: property?.amenities },
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
    editUrl: `/property/${params?.id}`,
    isProfile: false,
    title: property?.description ?? "",
    widthClass: "w-full",
  };

  useEffect(() => {
    getUser({
      id: `${params?.id}`,
    });
    // getRole(`${params?.id}`);
  }, [params?.id]);
  useEffect(() => {
    getProperty({
      id: `${params?.id}`,
    });
  }, [params?.id]);

  return (
    <div className="w-full flex-col space-y-4 buser">
      {isLoading || isFetching ? (
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
          isLoading={isLoading || isFetching}
        />
      )}
    </div>
  );
}
