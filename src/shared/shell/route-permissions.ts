import {
  IconAdjustments,
  IconAlertHexagon,
  IconBuildingEstate,
  IconCalendar,
  IconCurrency,
  IconLock,
  IconMoneybag,
  IconReportMoney,
  IconSocial,
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
  "/vendor": {
    allowedRoles: ["SA"],
    restrictedRoles: ["OPSWR"],
    requiresAuth: true,
  },
  "/pro-forma": {
    allowedRoles: ["SA", "SL"],
    restrictedRoles: ["OPSWR"],
    requiresAuth: true,
  },
  // "/user": {
  //   allowedRoles: ["SA", "OM"],
  //   restrictedRoles: ["OPSWR"],
  //   requiresAuth: true,
  // },
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
      { label: "Tenants", path: "/tenants" },
      { label: "Room", path: "/room" },
    ],
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
  BANKACCOUNTS: {
    label: "Bank Accounts",
    icon: IconMoneybag,
    children: [
      { label: "Organizational", path: "/organization-bank-accounts" },
      { label: "Individual", path: "/bank-accounts" },
    ],
  },
} as const;
