import ClientOnly from "@/src/components/ClientOnly";
import UserTypeDetailComponent from "../../_component/user-detail-component";

// const UserDetailComponent = dynamic(
//   () => import("@/src/app/(features)/user/_component/user-detail-component"),
//   { ssr: false }
// );

export default function UserDetailPage() {
  return (
    <ClientOnly>
      <UserTypeDetailComponent />
      {/* <Tabs defaultValue="emergency" className="w-full">
                  <Tabs.List className="gap-8 my-2">
                    <Tabs.Tab leftSection={<IconUserShield size={15} />} value="emergency">
                      Contacts
                    </Tabs.Tab>
                    <Tabs.Tab leftSection={<EyeIcon size={15} />} value="detail">
                      Detail
                    </Tabs.Tab>
                    <Tabs.Tab leftSection={<IconBuildingBank size={15} />} value="bank">
                      Bank Account
                    </Tabs.Tab>
                  </Tabs.List>
                  <Tabs.Panel value="emergency">
                    <EmergencyContactsComponent />
                    
                  </Tabs.Panel>
                  <Tabs.Panel value="detail">
                    <UserTypeDetailComponent />
                  </Tabs.Panel>
                  <Tabs.Panel value="bank">
                    <UserBankAccountComponent />
                    
                  </Tabs.Panel>
                </Tabs> */}
    </ClientOnly>
  );
}
