"use client";

import { Tabs, TabsPanel } from "@mantine/core";
import { IconEyeFilled, IconUserCircle } from "@tabler/icons-react";
import ContactsComponent from "../../_component/contacts-component";
import TenantDetailComponent from "../../_component/tenant-detail-component";

export default function TenantDetailPage() {
  return (
    <Tabs defaultValue="details" className="w-full">
      <Tabs.List className="gap-8 my-2">
        <Tabs.Tab leftSection={<IconEyeFilled size={15} />} value="details">
          Detail
        </Tabs.Tab>
        <Tabs.Tab leftSection={<IconUserCircle size={15} />} value="contacts">
          Contacts
        </Tabs.Tab>
      </Tabs.List>
      <TabsPanel value="details">
        <TenantDetailComponent />
      </TabsPanel>
      <TabsPanel value="contacts">
        <ContactsComponent />
      </TabsPanel>
    </Tabs>
  );
}
