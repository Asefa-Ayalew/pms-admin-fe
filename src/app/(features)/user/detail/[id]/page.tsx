"use client"
import ClientOnly from "@/src/components/ClientOnly";
import dynamic from "next/dynamic";

const UserDetailComponent = dynamic(
  () => import("@/src/app/(features)/user/_component/user-detail-component"),
  { ssr: false }
);

export default function UserDetailPage({ params }: { params: { id: string } }) {
  return (
    <ClientOnly>
      <UserDetailComponent />
    </ClientOnly>
  );
}
