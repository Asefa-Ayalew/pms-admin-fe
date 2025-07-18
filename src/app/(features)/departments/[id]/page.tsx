"use client"

import { Tabs, TabsPanel } from "@mantine/core";
import { IconEyeFilled, IconUserCircle } from "@tabler/icons-react";
import { useParams } from "next/navigation";
import DepartmentForm from "../_component/department-form.component-component";
import DepartmentUsersComponent from "../_component/department-users-component";

export default function DepartmentDetailPage() {
    const params = useParams();
    return (
        <>
            {params?.id === 'new' ? (
                <DepartmentForm editMode="new" />
            ) : (
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
                        <DepartmentForm editMode="detail" />
                    </TabsPanel>
                    <TabsPanel value="user">
                        <DepartmentUsersComponent
                        />
                    </TabsPanel>
                </Tabs>
            )}
        </>
    );
}