"use client";
import { usePathname, useRouter } from "next/navigation";
import { ReactNode, useEffect } from "react";
import { useUserInfo } from "../hooks/useUserInfo";
import { LoadingOverlay } from "@mantine/core";
import { RoleKey, useRoleGuard } from "../shared/auth/hooks/useRoleGuard";
import { PROTECTED_ROUTES } from "../shared/shell/route-permissions";

interface ProtectedRouteProps {
  children: ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { isAuthenticated, isLoading, activeRole, isPowerUser, canView } =
    useRoleGuard();
  const { hasRole } = useUserInfo();

  useEffect(() => {
    if (isLoading) return;

    const matchedRoute = Object.entries(PROTECTED_ROUTES).find(([route]) =>
      pathname.startsWith(route)
    );

    if (!matchedRoute) {
      return;
    }

    const [_, { allowedRoles, restrictedRoles, requiresAuth }] = matchedRoute;
    console.log(_)

    // Check authentication
    if (requiresAuth && !isAuthenticated) {
      router.push("/auth/signin");
      return;
    }

    // Super admin or power user bypass
    if (hasRole("SA") || isPowerUser) {
      return;
    }

    // Check restricted roles
    if (restrictedRoles?.includes(activeRole as RoleKey)) {
      router.push("/unauthorized");
      return;
    }

    // Check allowed roles
    if (!allowedRoles.includes(activeRole as RoleKey)) {
      router.push("/unauthorized");
      return;
    }
  }, [
    pathname,
    isAuthenticated,
    isLoading,
    activeRole,
    isPowerUser,
    canView,
    hasRole,
    router,
  ]);

  if (isLoading) {
    return <LoadingOverlay />;
  }

  return <>{children}</>;
}
