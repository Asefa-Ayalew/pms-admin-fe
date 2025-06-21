"use client";

import { useUserInfo } from "@/src/hooks/useUserInfo";
import { Loader } from "@mantine/core";
import { useRouter } from "next/navigation";
import { ReactNode } from "react";
import type { RoleKey } from "../hooks/useRoleGuard";
import { useRoleGuard } from "../hooks/useRoleGuard";
import { notifications } from "@mantine/notifications";

interface RoleGuardProps {
  children: ReactNode;
  roles: RoleKey[];
  fallback?: ReactNode;
  showDeniedMessage?: boolean;
  loadingFallback?: ReactNode;
  redirectPath?: string;
  requireVerifiedOrg?: boolean;
  orgTypes?: Array<
    "isShipper" | "isTransporter" | "isAssociation" | "isBrokerage"
  >;
}

export const RoleGuard = ({
  children,
  roles,
  fallback = null,
  showDeniedMessage = true,
  loadingFallback = <Loader size="sm" />,
  redirectPath = "/unauthorized",
  requireVerifiedOrg = false,
  orgTypes,
}: RoleGuardProps) => {
  const { checkAccess, showAccessDenied, isLoading, isAuthenticated } =
    useRoleGuard();
  const { user, organization } = useUserInfo();
  const router = useRouter();

  if (isLoading) {
    return loadingFallback;
  }

  if (!isAuthenticated || !user) {
    router.push("/auth/signin");
    return null;
  }

  // Check organization verification if required
  if (requireVerifiedOrg && !organization?.isVerified) {
    if (showDeniedMessage) {
      notifications.show({
        title: "Access Denied",
        color: "red",
        message:
          "Your organization needs to be verified to access this resource",
        autoClose: 3000,
      });
    }
    router.push("/organization/verify");
    return fallback;
  }

  // Check organization type if specified
  if (orgTypes?.length) {
    const hasValidOrgType = orgTypes.some((type) => organization?.[type]);
    if (!hasValidOrgType) {
      if (showDeniedMessage) {
        notifications.show({
          title: "Access Denied",
          color: "red",
          message:
            "Your organization type does not have access to this resource",
          autoClose: 3000,
        });
      }
      router.push(redirectPath);
      return fallback;
    }
  }

  const hasAccess = checkAccess(roles);

  if (!hasAccess) {
    if (showDeniedMessage) {
      showAccessDenied();
    }
    router.push(redirectPath);
    return fallback;
  }

  return <>{children}</>;
};

interface WithRoleGuardProps {
  [key: string]: unknown;
}

interface WithRoleGuardOptions {
  redirectPath?: string;
  LoadingComponent?: React.ComponentType;
  showDeniedMessage?: boolean;
  requireVerifiedOrg?: boolean;
  orgTypes?: Array<
    "isShipper" | "isTransporter" | "isAssociation" | "isBrokerage"
  >;
}

export const withRoleGuard = <P extends WithRoleGuardProps>(
  WrappedComponent: React.ComponentType<P>,
  roles: RoleKey[],
  options?: WithRoleGuardOptions
) => {
  const {
    redirectPath = "/unauthorized",
    LoadingComponent = () => <Loader size="sm" />,
    showDeniedMessage = true,
    requireVerifiedOrg = false,
    orgTypes,
  } = options ?? {};

  return function WithRoleGuardComponent(props: P) {
    const { checkAccess, isAuthenticated, isLoading, showAccessDenied } =
      useRoleGuard();
    const { user, organization } = useUserInfo();
    const router = useRouter();

    if (isLoading) {
      return <LoadingComponent />;
    }

    if (!isAuthenticated || !user) {
      router.push("/auth/signin");
      return null;
    }

    // Check organization verification if required
    if (requireVerifiedOrg && !organization?.isVerified) {
      if (showDeniedMessage) {
        notifications.show({
          title: "Access Denied",
          color: "red",
          message:
            "Your organization needs to be verified to access this resource",
          autoClose: 3000,
        });
      }
      router.push("/organization/verify");
      return null;
    }

    // Check organization type if specified
    if (orgTypes?.length) {
      const hasValidOrgType = orgTypes.some((type) => organization?.[type]);
      if (!hasValidOrgType) {
        if (showDeniedMessage) {
          notifications.show({
            title: "Access Denied",
            color: "red",
            message:
              "Your organization type does not have access to this resource",
            autoClose: 3000,
          });
        }
        router.push(redirectPath);
        return null;
      }
    }

    if (!checkAccess(roles)) {
      if (showDeniedMessage) {
        showAccessDenied();
      }
      router.push(redirectPath);
      return null;
    }

    return <WrappedComponent {...props} />;
  };
};
