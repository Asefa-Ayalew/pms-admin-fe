"use client";
import { Tabs } from "@mantine/core";
import PropertyTypeDetailComponent from "../../_components/property-detail-component";
import PropertyGalleryComponent from "../../_components/property-gallery.component";
import ServicesComponent from "../../_components/services-component";
import { IconInfoCircle, IconPhoto, IconSettings } from "@tabler/icons-react";

export default function PropertyDetailPage() {
  return (
    <Tabs defaultValue="detail" className="w-full">
      <Tabs.List className="gap-8 my-2">
        <Tabs.Tab value="detail" leftSection={<IconInfoCircle size={16} />}>Detail</Tabs.Tab>
        <Tabs.Tab value="services" leftSection={<IconSettings size={16} />}>Services</Tabs.Tab>
        <Tabs.Tab value="gallery" leftSection={<IconPhoto size={16} />}>Gallery</Tabs.Tab>
      </Tabs.List>

      <Tabs.Panel value="detail">
        <PropertyTypeDetailComponent />
      </Tabs.Panel>

      <Tabs.Panel value="services">
        <ServicesComponent />
      </Tabs.Panel>
      <Tabs.Panel value="gallery">
        <PropertyGalleryComponent />
      </Tabs.Panel>
    </Tabs>
  );
}
