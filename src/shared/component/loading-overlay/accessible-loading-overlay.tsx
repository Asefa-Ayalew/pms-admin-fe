"use client";

import { LoadingOverlay } from "@mantine/core";
import { useEffect, useRef } from "react";

interface AccessibleLoadingOverlayProps {
  visible: boolean;
  zIndex?: number;
  blur?: number;
  children: React.ReactNode;
}

export function AccessibleLoadingOverlay({
  visible,
  zIndex = 1000,
  blur = 2,
  children,
}: AccessibleLoadingOverlayProps) {
  const overlayRef = useRef<HTMLDivElement>(null);
  const previousFocus = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (visible) {
      // Store the currently focused element
      previousFocus.current = document.activeElement as HTMLElement;

      // Move focus to the overlay container
      overlayRef.current?.focus();

      // Prevent background content from receiving focus
      const mainContent = document.getElementById("main-content");
      mainContent?.setAttribute("aria-hidden", "true");

      return () => {
        // Restore focus when overlay is removed
        previousFocus.current?.focus();
        mainContent?.removeAttribute("aria-hidden");
      };
    }
  }, [visible]);

  return (
    <div
      ref={overlayRef}
      tabIndex={-1}
      role="region"
      aria-label="Loading content"
      aria-busy="true"
      style={{ position: "relative", display: visible ? "block" : "none" }}
    >
      <LoadingOverlay
        visible={visible}
        zIndex={zIndex}
        overlayProps={{
          radius: "sm",
          blur: blur,
        }}
      />
      {children}
    </div>
  );
}
