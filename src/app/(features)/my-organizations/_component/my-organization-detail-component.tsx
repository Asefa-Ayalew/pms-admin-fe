"use client";

import DetailsPage from "@/src/shared/component/details-page/details-page.component";
import EmptyIcon from "@/src/shared/icons/empty-icon";
import { LoadingOverlay } from "@mantine/core";
import { useParams } from "next/navigation";
import { useEffect } from "react";
import { useLazyGetMyOrganizationQuery } from "../_store/my-organization.query";

export default function MyOrganizationDetailComponent() {
    const params = useParams();

    const [getMyOrganization, myOrganization] = useLazyGetMyOrganizationQuery();

    const data = [
        {
            key: "name",
            label: "Name",
            value: `${ myOrganization?.data?.name ?? ""}`,
        },
    ];

    const profileData = {
        image: "",
        name: ``,
        type: "",
        address: "",
        phone: "",
        email: "",
        isVerified: false,
    };

    const config = {
        editUrl: `/my-organizations/${params?.id}`,
        isProfile: false,
        title: `${ myOrganization?.data?.name ?? ""}`,
        widthClass: "w-full",
    };

    useEffect(() => {
      getMyOrganization({
            id: `${params?.id}`,
        });
    }, [params?.id]);

    return (
        <div className="w-full flex-col space-y-4 buser">
            { myOrganization?.isLoading || myOrganization?.isFetching ? (
                <div className="relative flex items-center justify-center">
                    <LoadingOverlay visible={true} zIndex={1000} overlayProps={ {radius: 'sm', blur: 2} } />
                    <EmptyIcon />
                </div>
            ) : (
                <DetailsPage
                    dataSource={[{ title: "Basic Information", source: data }]}
                    profileData={profileData}
                    config={config}
                    isLoading={ myOrganization.isLoading || myOrganization.isFetching }
                />
            )}
        </div>
    );
}
