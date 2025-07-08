"use client";

import { Tabs } from "@mantine/core";
import ServicesComponent from "../../_component/services-component";
import { IconInfoCircle, IconPhoto, IconSettings } from "@tabler/icons-react";
import RoomPreview from "../../_component/room-preview-component";

export default function RoomDetailPage() {
  return (
    <Tabs defaultValue="detail" className="w-full">
      <Tabs.List className="gap-8 my-2">
        <Tabs.Tab value="detail" leftSection={<IconInfoCircle size={16} />}>Detail</Tabs.Tab>
        <Tabs.Tab value="services" leftSection={<IconSettings size={16}/>}>Services</Tabs.Tab>
      </Tabs.List>
      <Tabs.Panel value="detail">
        <RoomPreview />
      </Tabs.Panel>

      <Tabs.Panel value="services">
        <ServicesComponent />
      </Tabs.Panel>
    </Tabs>
  );
}
