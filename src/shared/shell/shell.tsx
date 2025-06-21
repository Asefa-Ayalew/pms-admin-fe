"use client";
import styles from './shell.module.css';
import { ProtectedRoute } from "@/src/components/ProtectedRoute";
import { useUserInfo } from "@/src/hooks/useUserInfo";
import {
  ActiveRole,
  UserProfile,
  UserRole,
} from "@/src/models/user-info.model";
import {
  AppShell,
  Avatar,
  Box,
  Burger,
  Flex,
  Group,
  ScrollArea,
  Skeleton,
  Text,
  Title,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import {
  IconBuildingBank,
  IconBuildingHospital,
  IconGauge,
  IconHome,
  IconMenu2,
} from "@tabler/icons-react";
import Image from "next/image";
import { ReactNode, useEffect, useMemo, useState } from "react";
import { RoleKey, useRoleGuard } from "../auth/hooks/useRoleGuard";
import { useLazyGetSignedUrlQuery } from "../utils/signedUrl/file.query";
import { LinksGroup } from "./nav-bar-links-group";
import { NAV_ITEMS, PROTECTED_ROUTES } from "./route-permissions";
import { Notifications } from "@mantine/notifications";
import { UserInfo } from "./user-info";
import { useSession } from "next-auth/react";

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
  const bucketName = user?.organization?.logo?.bucketName;
  const name = user?.organization?.logo?.name;
  const [getSignedUrl, { isLoading: isLoadingGetSignedUrl, data: signedUrl }] =
    useLazyGetSignedUrlQuery();

  const { protectRoutesFromRoles } = useRoleGuard();
  const {data: userInfo} = useSession();
  console.log('userInfo', userInfo);

  const navData = useMemo(
    () => generateNavData(protectRoutesFromRoles),
    [protectRoutesFromRoles]
  );
 const links = navData.map((item) => (
    <LinksGroup {...item} key={item.label} />
  ));
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
        <Text className="text-lg font-semibold text-primary-500 uppercase">
          {'user?.tenant?.name'}
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
      <Notifications />
      <AppShell
        header={{ height: "48px" }}
        layout="alt"
        navbar={{
          width: 250,
          breakpoint: "sm",
          collapsed: {
            mobile: !mobileOpened,
            desktop: !desktopOpened,
          },
        }}
        padding="md"
      >
        <AppShell.Header
          style={{
            height: "48px",
            alignItems: "center",
          }}
        >
          {HeaderContent}
        </AppShell.Header>
        <AppShell.Navbar className={styles.side}>
          <AppShell.Section>
            <Box className={styles.header}>
              <Box className="flex-grow">
                <Box
                  style={{
                    height: "60px",
                    backgroundColor: "#0b2752",
                    alignItems: "center",
                    color: "white",
                  }}
                  className="dark:bg-gray-900"
                >
                  <Group align="center" gap={0} h="100%" className="mx-4">
                 <IconBuildingBank size={20}/>
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
                      <Title fw={500} fz="md">PMS ADMIN</Title>
                    </h2>
                  </Group>
                </Box>
                <Burger
                  color="black"
                  hiddenFrom="sm"
                  onClick={toggleMobile}
                  opened={mobileOpened}
                  size="sm"
                />
              </Box>
            </Box>
            <UserInfo user={userInfo} />
          </AppShell.Section>
          <AppShell.Section component={ScrollArea} grow>
            {links}
          </AppShell.Section>
        </AppShell.Navbar>
        <AppShell.Main>{children}</AppShell.Main>
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

