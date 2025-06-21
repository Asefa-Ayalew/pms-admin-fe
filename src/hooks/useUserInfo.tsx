import { useGetUserInfoQuery } from "@/src/app/(features)/user/_store/user.query";
import {
  ActiveRole,
  Organization,
  UserProfile,
  UserRole,
} from "@/src/models/user-info.model";
import { decodeJwt } from "jose";
import { useSession } from "next-auth/react";
import { useMemo } from "react";

interface UseUserInfoReturn {
  user: UserProfile | null;
  isLoading: boolean;
  error: unknown;
  organization: Organization | null;
  userRoles: UserRole[];
  activeRole: ActiveRole | null;
  isAdmin: boolean;
  isPowerUser: boolean;
  hasRole: (roleKey: string) => boolean;
}

interface JwtPayload {
  activeRole: ActiveRole;
  [key: string]: unknown;
}

export function useUserInfo(): UseUserInfoReturn {
  const { data: userData, isLoading, error } = useGetUserInfoQuery();

  const { data: session } = useSession();
  const decrypt = session?.accessToken
    ? (decodeJwt(session.accessToken) as JwtPayload)
    : null;

  const userInfo = useMemo(() => {
    if (!userData) return null;
    return userData as unknown as UserProfile;
  }, [userData]);

  const organization = useMemo(() => {
    return userInfo?.organization ?? null;
  }, [userInfo]);

  const userRoles = useMemo(() => {
    return userInfo?.userRoles ?? [];
  }, [userInfo]);

  const activeRole = useMemo(() => {
    return decrypt?.activeRole ?? null;
  }, [decrypt]);

  const isAdmin = useMemo(() => {
    return userRoles.some((role) => role.role.key === "SA");
  }, [userRoles]);

  const isPowerUser = useMemo(() => {
    return userInfo?.isPowerUser ?? false;
  }, [userInfo]);

  const hasRole = useMemo(() => {
    return (roleKey: string) => {
      return userRoles.some((role) => role.role.key === roleKey);
    };
  }, [userRoles]);

  return {
    user: userInfo,
    isLoading,
    error,
    organization,
    userRoles,
    activeRole,
    isAdmin,
    isPowerUser,
    hasRole,
  };
}
