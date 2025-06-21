"use client";

import { LoadingOverlay } from "@mantine/core";
import { useSession } from "next-auth/react";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Shell } from "./shell";

interface ProtectedShellProps {
  children: React.ReactNode;
}

// Define public routes that don't require authentication
const PUBLIC_ROUTES = ["/auth/signin", "/auth/signup", "/auth/forgot-password"];

export function ProtectedShell({ children }: ProtectedShellProps) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const pathname = usePathname();
  const [isRouteReady, setIsRouteReady] = useState(false);

  const isPublicRoute = PUBLIC_ROUTES.includes(pathname);

  useEffect(() => {
    if (status === "loading") return;

    if (!session && !isPublicRoute) {
      router.replace("/auth/signin");
      return;
    }

    setIsRouteReady(true);
  }, [session, status, router, isPublicRoute, pathname]);

  // Don't render anything until we're sure about the route
  if (!isRouteReady && status === "loading") {
    return <LoadingOverlay />;
  }

  // If it's a public route, render without the shell
  if (isPublicRoute) {
    return <>{children}</>;
  }

  // If not authenticated and not a public route, don't render anything
  if (!session && !isPublicRoute) {
    return null;
  }

  // If authenticated or public route, render with shell
  return <Shell>{children}</Shell>;
}
