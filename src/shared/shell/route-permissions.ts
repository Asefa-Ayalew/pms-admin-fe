import {
  IconAdjustments,
  IconBuildingBank,
  IconBuildingEstate,
  IconUser,
} from "@tabler/icons-react";
import { RoleKey } from "../auth/hooks/useRoleGuard";
export type RouteConfig = {
  allowedRoles: RoleKey[];
  restrictedRoles?: RoleKey[];
  requiresAuth?: boolean;
};

export type RoutePermissions = {
  [key: string]: RouteConfig;
};

export const PROTECTED_ROUTES: RoutePermissions = {
  "/my-organization": {
    allowedRoles: ["SA", "OM"],
    restrictedRoles: ["OPSWR"],
    requiresAuth: true,
  },

  "/analytics": {
    allowedRoles: ["SA", "OM", "FI"],
    restrictedRoles: ["OPSWR"],
    requiresAuth: true,
  },
  "/payment-collection": {
    allowedRoles: ["SA", "OM", "FI"],
    restrictedRoles: ["OPSWR"],
    requiresAuth: true,
  },
} as const;

export const NAV_ITEMS = {
  DASHBOARD: { label: "Dashboard", path: "/" },
  PROPERTIES: {
    label: "Properties",
    icon: IconBuildingEstate,
    children: [
      { label: "Tenants", path: "/tenant" },
      { label: "Properties", path: "/property" },
    ],
  },
  BANKACCOUNTS: {
    label: "Bank Accounts",
    path: "/bank-accounts",
    icon: IconBuildingBank,
  },
  UsersManagement: {
    label: "Users",
    icon: IconUser,
    children: [
      { label: "Users", path: "/user" },
      { label: "Roles", path: "/role" },
      { label: "Departments", path: "/departments" },
    ],
  },
  SETTINGS: {
    label: "Settings",
    icon: IconAdjustments,
    children: [{ label: "My Organization", path: "/my-organizations" }],
  },
} as const;
