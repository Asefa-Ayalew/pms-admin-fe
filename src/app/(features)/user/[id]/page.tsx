"use client";
import ClientOnly from "@/src/components/ClientOnly";
import dynamic from "next/dynamic";

// Use dynamic import with no SSR to avoid invalid hook calls
const NewUserTypeComponent = dynamic(
  () => import("../_component/new-user-component"),
  { ssr: false }
);

export default function NewUserTypePage({
  params,
}: {
  params: { id: string };
}) {
  return (
    <ClientOnly>
      <NewUserTypeComponent editMode={params.id === "new" ? "new" : "detail"} />
    </ClientOnly>
  );
}
