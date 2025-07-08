"use client";

import DetailsPage from "@/src/shared/component/details-page/details-page.component";
import EmptyIcon from "@/src/shared/icons/empty-icon";
import { LoadingOverlay } from "@mantine/core";
import { useParams } from "next/navigation";
import { useEffect } from "react";
import { useLazyGetUserQuery } from "../../user/_store/user.query";
import { useLazyGetRoomQuery } from "../_store/room.query";
import { isNumber } from "@tiptap/core";
import { formatDate } from "@/src/shared/utils/date-utils";

export default function RoomDetailComponent() {
  const params = useParams();

  const [getUser, user] = useLazyGetUserQuery();
  const [getRoom, { data: room, isLoading, isFetching }] =
    useLazyGetRoomQuery();

  const data = [
    { key: "description", label: "Description", value: room?.description },
    {
      key: "size",
      label: "Size",
      value: room?.size,
    },
    { key: "Is Furnished", label: "Is Furnished", value: room?.isFurnished ? 'Yes' :'No' },
    {
      key: "Number Of Rooms",
      label: "noOfRooms",
      value: room?.numberOfBedRooms,
      isNumber: true
    },
    {
      key: "createdAt",
      label: "Created At",
      value: formatDate(room?.createdAt),
      isDate: true
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
    editUrl: `/room/${params?.id}`,
    isProfile: false,
    title: room?.description ?? "",
    widthClass: "w-full",
  };

  useEffect(() => {
    getRoom({
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
          config={config}
          isLoading={isLoading || isFetching}
        />
      )}
    </div>
  );
}
