"use client";
import { ProtectedRoute } from "@/src/components/ProtectedRoute";
import { useUserInfo } from "@/src/hooks/useUserInfo";
import {
  ActiveRole,
  UserProfile,
  UserRole,
} from "@/src/models/user-info.model";
import {
  Accordion,
  AppShell,
  Avatar,
  Box,
  Burger,
  Flex,
  Group,
  Menu,
  ScrollArea,
  Skeleton,
  Text,
  Title,
  UnstyledButton,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { modals } from "@mantine/modals";
import {
  IconBuildingBank,
  IconChevronDown,
  IconChevronUp,
  IconCircleCheckFilled,
  IconCashBanknote,
  IconGauge,
  IconLogout,
  IconSettings,
  IconUserCog,
} from "@tabler/icons-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { ReactNode, useEffect, useMemo, useState } from "react";
import { RoleKey, useRoleGuard } from "../auth/hooks/useRoleGuard";
import InternetConnectionStatus from "../component/internet-connection-status/internet-connection-status";
import LogoutModal from "../component/logout-modal";
import SwitchRoleModal from "../component/switch-role-modal";
import { useLazyGetSignedUrlQuery } from "../utils/signedUrl/file.query";
import { cn } from "../utitlity/cn";
import { NavigationContainer } from "./nav-bar-links-group-component";
import classes from "./navbar.module.css";
import { NAV_ITEMS, PROTECTED_ROUTES } from "./route-permissions";

interface NavItem {
  label: string;
  icon: React.FC;
  link?: string;
  links?: Array<{ label: string; link: string }>;
}

interface OrganizationLogoProps {
  organization: UserProfile["organization"] | null;
  isLoading: boolean;
  signedUrl: string | null;
}

interface UserMenuProps {
  user: UserProfile | null;
  userRoles: UserRole[];
  userMenuOpened: boolean;
  activeRole: ActiveRole | null;
  setUserMenuOpened: (opened: boolean) => void;
  onSwitchRole: (roleId: string) => void;
  onLogout: () => void;
}

interface RoleSwitcherProps {
  userRoles: UserRole[];
  activeRole: ActiveRole | null;
  onSwitchRole: (roleId: string) => void;
}

const generateNavData = (
  protectRoutesFromRoles: (roles: RoleKey[]) => boolean
): NavItem[] => {
  const navItems = [
    {
      label: NAV_ITEMS.DASHBOARD.label,
      icon: IconGauge,
      link: NAV_ITEMS.DASHBOARD.path,
    },
    {
      label: NAV_ITEMS.PROPERTIES.label,
      icon: NAV_ITEMS.PROPERTIES.icon,
      links: NAV_ITEMS.PROPERTIES.children.map((child) => ({
        label: child.label,
        link: child.path,
      })),
    },
    {
      label: NAV_ITEMS.BANKACCOUNTS.label,
      icon: NAV_ITEMS.BANKACCOUNTS.icon,
      links: NAV_ITEMS.BANKACCOUNTS.children.map((child) => ({
        label: child.label,
        link: child.path,
      })),
    },
    {
      label: NAV_ITEMS.UsersManagement.label,
      icon: NAV_ITEMS.UsersManagement.icon,
      links: NAV_ITEMS.UsersManagement.children.map((child) => ({
        label: child.label,
        link: child.path,
      })),
    },
  ].filter(Boolean) as NavItem[];

  return navItems
    .map((item) => {
      if (!item.icon) return null;
      if (item.links) {
        return {
          ...item,
          links: item.links.filter((link) => {
            const route = Object.entries(PROTECTED_ROUTES).find(([route]) =>
              link.link.startsWith(route)
            );
            if (!route) return true;
            const [_, { restrictedRoles }] = route;
            return protectRoutesFromRoles((restrictedRoles as RoleKey[]) || []);
          }),
        };
      }
      return item;
    })
    .filter(
      (item): item is NavItem =>
        !!item && (!item.links || item.links.length > 0)
    );
};

export function Shell({ children }: { children: ReactNode }) {
  const [mobileOpened, { toggle: toggleMobile }] = useDisclosure();
  const [desktopOpened, { toggle: toggleDesktop }] = useDisclosure(true);
  const { user, userRoles, activeRole } = useUserInfo();
  const tenant = user?.currentTenant;

  const [userMenuOpened, setUserMenuOpened] = useState(false);
  const bucketName = user?.organization?.logo?.bucketName;
  const name = user?.organization?.logo?.name;
  const [getSignedUrl, { isLoading: isLoadingGetSignedUrl, data: signedUrl }] =
    useLazyGetSignedUrlQuery();

  const { protectRoutesFromRoles } = useRoleGuard();

  const navData = useMemo(
    () => generateNavData(protectRoutesFromRoles),
    [protectRoutesFromRoles]
  );

  useEffect(() => {
    if (bucketName && name) {
      getSignedUrl({ bucketName, name }).then((res) => {
        console.log(res);
      });
    }
  }, [bucketName, name]);

  // Memoize the header content
  const HeaderContent = useMemo(
    () => (
      <Group h="100%" px="md">
        <Burger
          opened={mobileOpened}
          onClick={toggleMobile}
          hiddenFrom="sm"
          size="sm"
          color="blue"
        />
        <Burger
          opened={desktopOpened}
          onClick={toggleDesktop}
          visibleFrom="sm"
          size="sm"
          color="blue"
        />
        <OrganizationLogo
          organization={user?.organization || null}
          isLoading={isLoadingGetSignedUrl}
          signedUrl={signedUrl?.link || null}
        />
        <Text className="text-lg font-bold text-gray-900 uppercase">
          {tenant?.name}
        </Text>
      </Group>
    ),
    [
      mobileOpened,
      desktopOpened,
      toggleMobile,
      toggleDesktop,
      user?.organization,
      isLoadingGetSignedUrl,
      signedUrl,
    ]
  );

  return (
    <ProtectedRoute>
      <AppShell
        header={{ height: "40px" }}
        navbar={{
          width: 300,
          breakpoint: "sm",
          collapsed: { mobile: !mobileOpened, desktop: !desktopOpened },
        }}
        padding="xs"
      >
        <AppShell.Header
          className="flex justify-between"
          style={{ height: "60px" }}
        >
          <Group gap={2}>
            <Box
              style={{
                height: "60px",
                backgroundColor: "#0b2752",
                alignItems: "center",
                color: "white",
                width: "300px",
              }}
              className="dark:bg-gray-900"
            >
              <Group align="center" gap={0} h="100%" className="mx-4">
                <IconBuildingBank size={20} />
                <h2
                  style={{
                    paddingLeft: "20px",
                    paddingBottom: "20px",
                    paddingTop: "20px",
                    fontFamily: "sans-serif",
                    fontWeight: "bold",
                    height: "60px",
                  }}
                >
                  <Title fw={500} fz="md" order={3}>
                    PMS TENANT
                  </Title>
                </h2>
              </Group>
            </Box>
            {HeaderContent}
          </Group>
          <UserMenu
            user={user}
            userRoles={userRoles}
            activeRole={activeRole}
            userMenuOpened={userMenuOpened}
            setUserMenuOpened={setUserMenuOpened}
            onSwitchRole={SwitchRole}
            onLogout={Logout}
          />
        </AppShell.Header>
        <Flex className="flex-row h-full">
          <AppShell.Navbar className="mt-6">
            {/* <UserInfo user={user} /> */}
            <NavigationContainer links={navData} />
          </AppShell.Navbar>
          <AppShell.Main className="w-full mt-4 bg-neutral-100">
            {children}
          </AppShell.Main>
        </Flex>
        <InternetConnectionStatus />
      </AppShell>
    </ProtectedRoute>
  );
}

// Extract components
function OrganizationLogo({
  organization,
  isLoading,
  signedUrl,
}: OrganizationLogoProps) {
  if (!organization) return null;

  if (isLoading) {
    return (
      <Flex align="center" gap="xs">
        <Skeleton className="w-12 h-12 rounded-full" />
        <Skeleton className="w-40 h-4" />
      </Flex>
    );
  }

  return (
    <Flex align="center" gap="xs">
      {signedUrl ? (
        <Flex align="center" gap="xs">
          <Avatar
            variant="filled"
            radius="50%"
            pos="relative"
            className="w-12 h-12 border-4 border-primary-500"
          >
            <Image
              alt="Logo"
              src={signedUrl}
              fill
              className="object-cover"
              priority
              quality={100}
              placeholder="blur"
              blurDataURL={signedUrl}
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          </Avatar>
          <Text className="text-lg font-semibold text-primary-500 uppercase">
            {organization.name}
          </Text>
        </Flex>
      ) : (
        <Text className="text-lg font-semibold">{organization.name}</Text>
      )}
    </Flex>
  );
}

function UserMenu({
  user,
  userRoles,
  activeRole,
  userMenuOpened,
  setUserMenuOpened,
  onSwitchRole,
  onLogout,
}: UserMenuProps) {
  const router = useRouter();

  return (
    <div className="px-5 flex items-center space-x-4 text-gray-500">
      <Menu
        width={260}
        position="bottom-end"
        transitionProps={{ transition: "pop-top-right" }}
        onClose={() => setUserMenuOpened(false)}
        onOpen={() => setUserMenuOpened(true)}
        withinPortal
      >
        <Menu.Target>
          <UnstyledButton
            className={cn(
              classes.user,
              `hover:bg-blue-200 hover:shadow-lg bg-blue-100 shadow-sm transition-all duration-300 rounded-md px-2 py-1`
            )}
          >
            <Group gap={7}>
              <Avatar
                src={user?.profilePicture ? user.profilePicture : "https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/avatars/avatar-2.png"}
                alt={user?.firstName}
                radius="xl"
                size={40}
              />
              <Text fw={500} size="sm" lh={1} mr={3}>
                {user?.firstName}
              </Text>
              
              {userMenuOpened ? (
                <IconChevronUp size={12} stroke={1.5} />
              ) : (
                <IconChevronDown size={12} stroke={1.5} />
              )}
            </Group>
          </UnstyledButton>
        </Menu.Target>
        <Menu.Dropdown>
          <Text fz="sm" c="dimmed">
                          {user?.currentTenant?.industry ?? 'Industry'}
                        </Text>
          {userRoles.length > 1 ? (
            <RoleSwitcher
              activeRole={activeRole}
              onSwitchRole={onSwitchRole}
              userRoles={userRoles}
            />
          ) : (
            <Menu.Item
              leftSection={
                <IconUserCog size={20} color="var(--mantine-color-green-6)" />
              }
              className="text-xs font-semibold bg-blue-500 border-blue-700 border-solid border-2 text-slate-50 shadow-md cursor-not-allowed"
            >
              {activeRole?.name}
            </Menu.Item>
          )}
          {activeRole?.key === "SA" && (
            <Menu.Item
              leftSection={<IconSettings size={16} stroke={1.5} />}
              className="text-xs font-semibold"
              onClick={() => {
                router.push("/settings");
              }}
            >
              Account settings
            </Menu.Item>
          )}
          <Menu.Item
            color="red"
            leftSection={<IconLogout size={16} stroke={1.5} />}
            onClick={onLogout}
          >
            Logout
          </Menu.Item>
        </Menu.Dropdown>
      </Menu>
    </div>
  );
}

function RoleSwitcher({
  onSwitchRole,
  userRoles,
  activeRole,
}: RoleSwitcherProps) {
  return (
    <Accordion variant="default">
      <Accordion.Item value="roles">
        <Accordion.Control
          icon={<IconUserCog size={20} color="var(--mantine-color-green-6)" />}
        >
          Switch Role
        </Accordion.Control>
        <Accordion.Panel>
          <ScrollArea className="h-[50svh]">
            {userRoles?.map((role: UserRole) => (
              <Menu.Item
                key={role.role.id}
                onClick={() => onSwitchRole(role.role.id)}
                className={cn(
                  "text-xs font-semibold hover:bg-blue-200 hover:border-blue-200 hover:shadow-lg bg-blue-50 border-2 border-blue-100 border-solid transition-all duration-300 rounded-md px-4 py-1.5 mb-1",
                  role.role.id === activeRole?.id
                    ? "bg-blue-500 border-blue-700 border-solid border-2 text-slate-50 shadow-md cursor-not-allowed"
                    : ""
                )}
                disabled={role.role.id === activeRole?.id}
                rightSection={
                  role.role.id === activeRole?.id ? (
                    <IconCircleCheckFilled size={20} stroke={3} color="white" />
                  ) : null
                }
              >
                {role.role.roleName}
              </Menu.Item>
            ))}
          </ScrollArea>
        </Accordion.Panel>
      </Accordion.Item>
    </Accordion>
  );
}

const Logout = async () => {
  modals.openConfirmModal({
    title: null,
    withCloseButton: false,
    children: <LogoutModal />,
    portalProps: {
      target: document.body,
    },
    padding: 0,
    cancelProps: { display: "none" },
    confirmProps: {
      disabled: true,
      display: "none",
    },
    closeOnConfirm: false,
    closeOnCancel: false,
  });
};

const SwitchRole = async (roleId: string) => {
  modals.openConfirmModal({
    title: null,
    withCloseButton: false,
    children: <SwitchRoleModal roleId={roleId} />,
    portalProps: {
      target: document.body,
    },
    padding: 0,
    cancelProps: { display: "none" },
    confirmProps: {
      disabled: true,
      display: "none",
    },
    closeOnConfirm: false,
    closeOnCancel: false,
  });
};
