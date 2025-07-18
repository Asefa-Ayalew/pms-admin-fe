"use client";

import DetailsPage from "@/src/shared/component/details-page/details-page.component";
import EmptyIcon from "@/src/shared/icons/empty-icon";
import { LoadingOverlay } from "@mantine/core";
import { useParams } from "next/navigation";
import { useEffect } from "react";
import { useLazyGetUserQuery } from "../../user/_store/user.query";
import {
  useLazyGetFeedBackQuery,
} from "../_store/feed-back.query";

export default function FeedBackDetailComponent() {
  const params = useParams();

  const [getUser, user] = useLazyGetUserQuery();
  const [getFeedBack, feedBack] = useLazyGetFeedBackQuery();

  useEffect(() => {
    getFeedBack({
      id: `${feedBack?.data?.tenantId}`,
    });
  }, [feedBack?.data?.tenantId, getFeedBack]);

  const data = [
    {
      key: "name",
      label: "Name",
      value: `${feedBack?.data?.name ?? ""}`,
    },
    {
      key: "subject",
      label: "Subject",
      value: `${feedBack?.data?.subject ?? ""}`,
    },
    {
      key: "email",
      label: "Email",
      value: `${feedBack?.data?.email ?? ""}`,
    },
    {
      key: "phone",
      label: "Phone Number",
      value: `${feedBack?.data?.phone ?? ""}`,
    },
    {
      key: "message",
      label: "Message",
      value: `${feedBack?.data?.message ?? ""}`,
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
    editUrl: `/feed-backs//${params?.id}`,
    isProfile: false,
    title: `${feedBack?.data?.name ?? ""}`,
    widthClass: "w-full",
  };

  useEffect(() => {
    getFeedBack({
      id: `${params?.id}`,
    });
  }, [params?.id]);

  return (
    <div className="w-full flex-col space-y-4 buser">
      {feedBack?.isLoading || feedBack?.isFetching ? (
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
          isLoading={feedBack?.isLoading || feedBack?.isFetching}
        />
      )}
    </div>
  );
}
