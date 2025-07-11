"use client";
import ClientOnly from "@/src/components/ClientOnly";
import dynamic from "next/dynamic";
import { useParams } from "next/navigation";
import EmergencyContactsComponent from "../_component/emergency-contact-component";
import { Tabs } from "@mantine/core";
import { IconBuildingBank, IconUserShield } from "@tabler/icons-react";
import { EyeIcon } from "lucide-react";
import UserBankAccountComponent from "../_component/user-bank-account-component";

// Use dynamic import with no SSR to avoid invalid hook calls
const NewUserTypeComponent = dynamic(
  () => import("../_component/new-user-component"),
  { ssr: false }
);
// const UserDetailComponent = dynamic(
//   () => import("../_component/user-detail-component"),
//   { ssr: false }
// );

export default function NewUserTypePage() {
  const params = useParams();
  return (
    <ClientOnly>
      {/* <UserDetailComponent /> */}
      <Tabs defaultValue="detail" className="w-full">
        <Tabs.List className="gap-8 my-2">
          <Tabs.Tab leftSection={<EyeIcon size={15} />} value="detail">
            {params?.id === "new" ? "New User" : "User Details"}
          </Tabs.Tab>
          <Tabs.Tab
            leftSection={<IconUserShield size={15} />}
            value="emergency"
          >
            Contacts
          </Tabs.Tab>
          
          <Tabs.Tab leftSection={<IconBuildingBank size={15} />} value="bank">
            Bank Account
          </Tabs.Tab>
        </Tabs.List>
        <Tabs.Panel value="emergency">
          <EmergencyContactsComponent />
          {/* nothing here yet */}
        </Tabs.Panel>
        <Tabs.Panel value="detail">
          {params?.id === "new" ? (
            <NewUserTypeComponent editMode="new" />
          ) : (
            <NewUserTypeComponent editMode="detail" />
            // <UserDetailComponent />
          )}
        </Tabs.Panel>
        <Tabs.Panel value="bank">
          <UserBankAccountComponent />
          {/* nothing here yet */}
        </Tabs.Panel>
      </Tabs>
    </ClientOnly>
  );
}
