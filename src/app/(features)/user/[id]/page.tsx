"use client";
import dynamic from "next/dynamic";
import { useParams } from "next/navigation";
import EmergencyContactsComponent from "../_component/emergency-contact-component";
import { Tabs } from "@mantine/core";
import { IconBuildingBank, IconUserShield } from "@tabler/icons-react";
import { EyeIcon } from "lucide-react";
import UserBankAccountComponent from "../_component/user-bank-account-component";

const NewUserTypeComponent = dynamic(
  () => import("../_component/new-user-component"),
  { ssr: false }
);


export default function NewUserTypePage() {
  const params = useParams();
  return (
    <>
      {params?.id === "new" ? (
        <NewUserTypeComponent editMode="new" />
      ) : (
        <Tabs defaultValue="detail" className="w-full">
          <Tabs.List className="gap-8 my-2">
            <Tabs.Tab leftSection={<EyeIcon size={15} />} value="detail">
              {"User Details"}
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
          </Tabs.Panel>
          <Tabs.Panel value="detail">
            <NewUserTypeComponent editMode="detail" />
          </Tabs.Panel>
          <Tabs.Panel value="bank">
            <UserBankAccountComponent />
          </Tabs.Panel>
        </Tabs>
      )}
    </>
  );
}
