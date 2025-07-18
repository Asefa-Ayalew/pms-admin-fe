import ClientOnly from "@/src/components/ClientOnly";
import UserTypeDetailComponent from "../../_component/user-detail-component";
import { Tabs } from "@mantine/core";
import { EyeIcon } from "lucide-react";
import { IconBuildingBank, IconUserShield } from "@tabler/icons-react";
import EmergencyContactsComponent from "../../_component/emergency-contact-component";
import UserBankAccountComponent from "../../_component/user-bank-account-component";

// const UserDetailComponent = dynamic(
//   () => import("@/src/app/(features)/user/_component/user-detail-component"),
//   { ssr: false }
// );

export default function UserDetailPage() {
  return (
    <ClientOnly>
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
          {/* nothing here yet */}
        </Tabs.Panel>
        <Tabs.Panel value="detail">
          <UserTypeDetailComponent />
        </Tabs.Panel>
        <Tabs.Panel value="bank">
          <UserBankAccountComponent />
        </Tabs.Panel>
      </Tabs>
    </ClientOnly>
  );
}
