"use client"

import { Tabs, TabsPanel } from "@mantine/core";
import { IconEyeFilled, IconUserCircle } from "@tabler/icons-react";
import { useParams } from "next/navigation";
import TenantForm from "../_component/tenant-form.component";
import ContactsComponent from "../_component/contacts-component";

export default function DepartmentDetailPage() {
    const params = useParams();
    return (
        <>
            {params?.id === 'new' ? (
                <TenantForm editMode="new" />
            ) : (
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
                        <TenantForm editMode="detail" />
                    </TabsPanel>
                    <TabsPanel value="contacts">
                        <ContactsComponent />
                    </TabsPanel>
                </Tabs>
            )}
        </>
    );
}