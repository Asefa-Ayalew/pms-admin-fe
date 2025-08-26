"use client";

import DetailsPage from "@/src/shared/component/details-page/details-page.component";
import EmptyIcon from "@/src/shared/icons/empty-icon";
import { LoadingOverlay } from "@mantine/core";
import { useParams } from "next/navigation";
import { useEffect } from "react";
import { useLazyGetTestimonialQuery } from "../_store/testimonial.query";

export default function TestimonialDetailComponent() {
  const params = useParams();

  const [getTestimonial, testimonial] = useLazyGetTestimonialQuery();

  useEffect(() => {
    getTestimonial({
      id: `${testimonial?.data?.id}`,
    });
  }, [testimonial?.data?.id, getTestimonial]);

  const data = [
    {
      key: "customerName",
      label: "Customer Name",
      value: `${testimonial?.data?.customerName ?? ""}`,
    },
    {
      key: "customerPosition",
      label: "Customer Position",
      value: `${testimonial?.data?.customerPosition ?? ""}`,
    },
    {
      key: "message",
      label: "Message",
      value: `${testimonial?.data?.message ?? ""}`,
    },
    {
      key: "rating",
      label: "Rating",
      value: `${testimonial?.data?.rating ?? ""}`,
    },
  ];

  const config = {
    editUrl: `/testimonials//${params?.id}`,
    isProfile: false,
    title: `${testimonial?.data?.customerName ?? ""}`,
    widthClass: "w-full",
  };

  useEffect(() => {
    getTestimonial({
      id: `${params?.id}`,
    });
  }, [getTestimonial, params?.id]);

  return (
    <div className="w-full flex-col space-y-4 buser">
      {testimonial?.isLoading || testimonial?.isFetching ? (
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
          isLoading={testimonial?.isLoading || testimonial?.isFetching}
        />
      )}
    </div>
  );
}
