"use client";
import { Tabs } from "@mantine/core";
import PropertyTypeDetailComponent from "../../_components/property-detail-component";
import PropertyGalleryComponent from "../../_components/property-gallery.component";
import ServicesComponent from "../../_components/services-component";
import { IconDoor, IconInfoCircle, IconPhoto, IconSettings } from "@tabler/icons-react";
import RoomsComponent from "../../_components/rooms-component";
import { useParams, useSearchParams } from "next/navigation";

export default function PropertyDetailPage() {
  const params = useParams();
   const searchParams = useSearchParams();
  const archived = searchParams.get("archived") === "true";
  return (
    <Tabs defaultValue="detail" className="w-full">
      <Tabs.List className="gap-8 my-2">
        <Tabs.Tab value="detail" leftSection={<IconInfoCircle size={16} />}>Detail</Tabs.Tab>
        <Tabs.Tab value="rooms" leftSection={<IconDoor size={16} />}>Rooms</Tabs.Tab>
        <Tabs.Tab value="services" leftSection={<IconSettings size={16} />}>Services</Tabs.Tab>
        <Tabs.Tab value="gallery" leftSection={<IconPhoto size={16} />}>Gallery</Tabs.Tab>
      </Tabs.List>

      <Tabs.Panel value="detail">
        <PropertyTypeDetailComponent />
      </Tabs.Panel>

      <Tabs.Panel value="services">
        <ServicesComponent />
      </Tabs.Panel>
      <Tabs.Panel value="rooms">
        <RoomsComponent />
      </Tabs.Panel>
      <Tabs.Panel value="gallery">
        <PropertyGalleryComponent />
      </Tabs.Panel>
    </Tabs>
  );
}
