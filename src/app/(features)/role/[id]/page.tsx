'use client';
// import RoleDetailComponent from "../_component/role-detail-component";
import ClientOnly from "@/src/components/ClientOnly";
import dynamic from "next/dynamic";

// Use dynamic import with no SSR to avoid invalid hook calls
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
