import { Tabs, TabsPanel } from "@mantine/core";
import { IconEyeFilled, IconUserCircle } from "@tabler/icons-react";
import DepartmentUsersComponent from "../../_component/department-users-component";
import DepartmentDetailComponent from "../../_component/department-detail-component";

export default function DepartmentDetailPage() {
    return (
        <Tabs defaultValue="details" className="w-full">
            <Tabs.List className="gap-8 my-2">
                <Tabs.Tab leftSection={<IconEyeFilled size={15} />} value="details">
                    Detail
                </Tabs.Tab>
                <Tabs.Tab leftSection={<IconUserCircle size={15} />} value="user">
                    Users
                </Tabs.Tab>
            </Tabs.List>
            <TabsPanel value="details">
                <DepartmentDetailComponent />
            </TabsPanel>
            <TabsPanel value="user">
                <DepartmentUsersComponent
                />
            </TabsPanel>
        </Tabs>);
}