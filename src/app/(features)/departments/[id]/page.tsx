"use client";

import { useParams } from "next/navigation";
import NewDepartmentTypeComponent from "../_component/new-department-component";
import { Tabs, TabsPanel } from "@mantine/core";
import { IconEyeFilled, IconUserCircle } from "@tabler/icons-react";
import DepartmentUsersComponent from "../_component/department-users-component";

export default function NewDepartmentTypePage() {
  const params = useParams();
  const id = params?.id;

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
        {id === "new" ? (
          <NewDepartmentTypeComponent editMode="new" />
        ) : (
          <NewDepartmentTypeComponent editMode="detail" />
        )}
      </TabsPanel>
      <TabsPanel value="user">
        <DepartmentUsersComponent />
        {/* user list here */}
      </TabsPanel>
    </Tabs>
  );
}
