"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

import { CollectionQuery } from "@/src/shared/models/collection.model";
import { entityViewMode } from "@/src/shared/models/entity-config.model";
import { useLazyGetMyOrganizationQuery } from "./_store/my-organization.query";
import { Card, Tabs, TabsPanel } from "@mantine/core";
import { IconCashBanknote, IconEyeFilled } from "@tabler/icons-react";
import { useLazyGetUserInfoQuery } from "../user/_store/user.query";
import NewTenantComponent from "./_component/new-tenant-component";
import MyOrganizationBankAccount from "./_component/my-organization-bank-account";

export default function MyOrganizationListPage() {
  const params = useParams();

  // Component states
  const [__, setViewMode] = useState<entityViewMode>("list");
  const [collection, _] = useState<CollectionQuery>({
    skip: 0,
    top: 20,
    orderBy: [{ field: "createdAt", direction: "desc" }],
  });

  // RTK hooks
   const [getUser, user] = useLazyGetUserInfoQuery();
  const [getMyOrganization, myOrganization] = useLazyGetMyOrganizationQuery();
 

  useEffect(() => {
    getUser();
  }, [getUser]);
  console.log("user", user);
  const myId = user?.data?.tenantId;
  console.log("myId", myId);
  useEffect(() => {
    getMyOrganization({id: user?.data?.tenantId});
  }, [collection, getMyOrganization]);

  

  useEffect(() => {
    setViewMode(params?.id !== undefined ? "detail" : "list");
  }, [params?.id]);
  console.log("myOrganization", myOrganization?.data);
  return (
    <Card>
      <Tabs defaultValue="details" className="w-full">
            <Tabs.List className="gap-8 my-2">
              <Tabs.Tab leftSection={<IconEyeFilled size={15} />} value="details">
                My Organization
              </Tabs.Tab>
              <Tabs.Tab leftSection={<IconCashBanknote size={15} />} value="account">
                My Bank Account
              </Tabs.Tab>
            </Tabs.List>
            <TabsPanel value="details">
             <NewTenantComponent id={myId} editMode="detail" />
              
            </TabsPanel>
            <TabsPanel value="account">
              <MyOrganizationBankAccount
                id={myId}
                editMode="detail"
              />
              {/* <DepartmentUsersComponent /> */}
              {/* user list here */}
            </TabsPanel>
          </Tabs>
    </Card>
  );
}
