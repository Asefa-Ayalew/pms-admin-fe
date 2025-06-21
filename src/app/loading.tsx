// src/app/loading.tsx
"use client";

import { AccessibleLoadingOverlay } from "@/src/shared/component/loading-overlay/accessible-loading-overlay";

export default function Loading() {
  return (
    <div className="h-screen flex flex-col items-center justify-center text-center">
      <AccessibleLoadingOverlay visible={true}>
        <div aria-hidden="true" className="h-screen w-full" />
      </AccessibleLoadingOverlay>
    </div>
  );
}
