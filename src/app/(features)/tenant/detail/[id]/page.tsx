import { Tabs, TabsPanel } from "@mantine/core";
import { IconEyeFilled, IconUserCircle } from "@tabler/icons-react";
import TenantDetailComponent from "../../_component/tenant-detail-component";
import ContactsComponent from "../../_component/contacts-component";

export default function DepartmentDetailPage() {
    return (
        <Tabs defaultValue="details" className="w-full">
            <Tabs.List className="gap-8 my-2">
                <Tabs.Tab leftSection={<IconEyeFilled size={15} />} value="details">
                    Detail
                </Tabs.Tab>
                <Tabs.Tab leftSection={<IconUserCircle size={15} />} value="user">
                    Contacts
                </Tabs.Tab>
            </Tabs.List>
            <TabsPanel value="details">
                <TenantDetailComponent />
            </TabsPanel>
            <TabsPanel value="user">
                <ContactsComponent />
            </TabsPanel>
        </Tabs>);
}