'use client';

import ClientOnly from "@/src/components/ClientOnly";
import dynamic from "next/dynamic";

const RoleDetailComponent = dynamic(
  () => import("../_component/role-detail-component"),
  { ssr: false }
);

export default function RoleDetailPage() {
  return (
    <ClientOnly>
      <RoleDetailComponent />
    </ClientOnly>
  );
}
