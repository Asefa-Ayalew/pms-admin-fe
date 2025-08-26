import { useUserInfo } from "@/src/hooks/useUserInfo";
import type { UserProfile } from "@/src/models/user-info.model";
import { notifications } from "@mantine/notifications";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useMemo } from "react";

export type RoleKey =
  | "ACNT"
  | "OPS"
  | "OPSWR"
  | "OPA"
  | "ICMT"
  | "IVCM"
  | "RO"
  | "SL"
  | "FI"
  | "FLTM"
  | "OTA"
  | "OM"
  | "SA"
  | "Admin";

interface UseRoleGuardReturn {
  hasAccess: boolean;
  isAuthenticated: boolean;
  isLoading: boolean;
  isInitialized: boolean;
  checkAccess: (requiredRoles: RoleKey[]) => boolean;
  protectRoutesFromRoles: (restrictedRoles: RoleKey[]) => boolean;
  showAccessDenied: () => void;
  currentUserRoles: RoleKey[];
  canView: (roles: RoleKey[]) => boolean;
  activeRole: string | null;
  isPowerUser: boolean;
  notAllowed: (roles: RoleKey[]) => boolean;
}

declare module "next-auth" {
  interface User {
    profile: UserProfile;
  }
  interface Session {
    user: User;
  }
}

export const useRoleGuard = (): UseRoleGuardReturn => {
  const { data: session, status } = useSession();
  const { user, activeRole, isPowerUser, userRoles, isLoading } = useUserInfo();
  const router = useRouter();

  const showAccessDenied = () => {
    notifications.show({
      title: "Access Denied",
      color: "red",
      message: "You do not have permission to access this resource",
      autoClose: 3000,
    });
  };

  const currentUserRoles = useMemo((): RoleKey[] => {
    return userRoles.map((role) => role.role.key as RoleKey);
  }, [userRoles]);

  const checkAccess = useMemo(
    () =>
      (requiredRoles: RoleKey[]): boolean => {
        if (status === "loading" || isLoading) return false;

        if (!session) {
          router.push("/auth/signin");
          return false;
        }

        if (activeRole === "SA" || isPowerUser) return true;

        const hasRequiredRole = requiredRoles.some(
          (role) => activeRole === role
        );
        if (!hasRequiredRole) {
          router.push("/unauthorized");
          return false;
        }

        return true;
      },
    [
      status,
      isLoading,
      session,
      isPowerUser,
      activeRole,
      router,
    ]
  );

  const protectRoutesFromRoles = useMemo(
    () =>
      (restrictedRoles: RoleKey[]): boolean => {
        if (status === "loading" || isLoading) return false;

        if (!session || !user || !userRoles.length) return false;

        return !restrictedRoles.some((role) => activeRole === role);
      },
    [status, isLoading, session, user, userRoles, activeRole]
  );

  const canView = useMemo(
    () => (roles: RoleKey[]) => {
      if (activeRole === "SA" || isPowerUser) return true;
      return roles.some((role) => activeRole === role);
    },
    [activeRole, isPowerUser]
  );

  const notAllowed = useMemo(
    () => (roles: RoleKey[]) => {
      if (roles.some((role) => activeRole === role)) {
        return false;
      }
      return true;
    },
    [activeRole]
  );

  return {
    hasAccess: status === "authenticated" && userRoles.length > 0,
    checkAccess,
    protectRoutesFromRoles,
    showAccessDenied,
    canView,
    notAllowed,
    currentUserRoles,
    isAuthenticated: status === "authenticated",
    isLoading: status === "loading" || isLoading,
    isInitialized: status !== "loading" && !isLoading,
    activeRole: activeRole ?? null,
    isPowerUser,
  };
};
