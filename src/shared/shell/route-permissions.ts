import {
  IconAdjustments,
  IconBuildingBank,
  IconBuildingEstate,
  IconCalendar,
  IconCurrency,
  IconMoneybag,
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
   INTERACTIONS: {
    label: "Interactions",
    icon: IconSocial,
    children: [
      {
        label: "FAQs",
        icon: IconMoneybag,
        path: "/faq",
      },
      {
        label: "Feed Backs",
        icon: IconCalendar,
        path: "/feed-back",
      },
      {
        label: "Testimonials",
        icon: IconCurrency,
        path: "/testimonial",
      },
    ],
  },
} as const;
