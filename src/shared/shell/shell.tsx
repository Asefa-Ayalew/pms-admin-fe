"use client";
import { ProtectedRoute } from "@/src/components/ProtectedRoute";
import { useUserInfo } from "@/src/hooks/useUserInfo";
import { UserProfile, UserRole } from "@/src/models/user-info.model";
import {
  AppShell,
  Avatar,
  Box,
  Burger,
  Button,
  Flex,
  Group,
  Menu,
  Skeleton,
  Text,
  Title,
  UnstyledButton,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { modals } from "@mantine/modals";
import { AnimatePresence, motion } from "framer-motion";
import {
  IconBuildingBank,
  IconChevronDown,
  IconChevronUp,
  IconCashBanknote,
  IconGauge,
  IconLogout,
  IconUserCog,
  IconX,
  IconArrowsMaximize,
  IconArrowsMinimize,
  IconChevronLeft,
} from "@tabler/icons-react";
import Image from "next/image";
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
import HelpCenter, { View } from "./components/help-center/help-center";

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
  activeRole: string;
  setUserMenuOpened: (opened: boolean) => void;
  onSwitchRole: (roleId: string) => void;
  onLogout: () => void;
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
      link: NAV_ITEMS.BANKACCOUNTS.path,
      icon: IconCashBanknote,
    },
    {
      label: NAV_ITEMS.UsersManagement.label,
      icon: NAV_ITEMS.UsersManagement.icon,
      links: NAV_ITEMS.UsersManagement.children.map((child) => ({
        label: child.label,
        link: child.path,
      })),
    },
    {
      label: NAV_ITEMS.INTERACTIONS.label,
      icon: NAV_ITEMS.INTERACTIONS.icon,
      links: NAV_ITEMS.INTERACTIONS.children.map((child) => ({
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
            console.log(_);
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
  const [open, setOpen] = useState(false);
  const [fullscreen, setFullScreen] = useState(false);
  const [viewStack, setViewStack] = useState<View[]>([{ type: "collections" }]);
  const goBack = () => setViewStack((prev) => prev.slice(0, -1));
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
  }, [getSignedUrl, bucketName, name]);

  useEffect(() => {
    if (viewStack.length > 1) {
      setFullScreen(true);
    } else if (viewStack.length === 1) {
      setFullScreen(false);
    }
  }, [viewStack, setFullScreen]);

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
      tenant?.name,
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
                    PMS ADMIN
                  </Title>
                </h2>
              </Group>
            </Box>
            {HeaderContent}
          </Group>
          <UserMenu
            user={user}
            userRoles={userRoles}
            activeRole={String(activeRole)}
            userMenuOpened={userMenuOpened}
            setUserMenuOpened={setUserMenuOpened}
            onSwitchRole={SwitchRole}
            onLogout={Logout}
          />
        </AppShell.Header>
        <Flex className="flex-row h-full">
          <AppShell.Navbar className="mt-6">
            <NavigationContainer links={navData} />
          </AppShell.Navbar>
          <AppShell.Main className="w-full mt-4 bg-neutral-100">
            {children}

            <div className="fixed bottom-4 right-4 z-50">
              <motion.div
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
              >
                <Button
                  onClick={() => setOpen(!open)}
                  className="flex items-center justify-center w-12 h-12 shadow-lg p-1 rounded-full"
                >
                  <motion.div
                    animate={{ rotate: open ? 180 : 0 }}
                    transition={{ duration: 0.5, ease: "easeInOut" }}
                  >
                    <IconChevronDown size={24} className="text-white" />
                  </motion.div>
                </Button>
              </motion.div>

              <AnimatePresence>
                {open && (
                  <>
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 0.4 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="fixed inset-1"
                      onClick={() => setOpen(false)}
                    />

                    <motion.div
                      initial={{ opacity: 0, y: 50, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 50, scale: 0.95 }}
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                      className={`fixed bottom-20 right-4 h-[calc(100vh-8.8rem)] bg-white shadow-2xl rounded-2xl flex flex-col overflow-hidden z-[9999] 
                              ${fullscreen ? "w-[36em]" : "w-[24rem]"}`}
                    >
                      <div className="flex items-center justify-between pt-4 px-4">
                        <div className="flex items-center">
                          {viewStack.length > 1 && (
                            <Button
                              variant="subtle"
                              onClick={goBack}
                              className="text-gray-700 hover:text-gray-900"
                              leftSection={<IconChevronLeft size={16} />}
                            ></Button>
                          )}
                          <h2 className="font-semibold text-lg">Help</h2>
                        </div>
                        <div className="flex -space-x-1">
                          <Button
                            variant="subtle"
                            onClick={() => setFullScreen(!fullscreen)}
                            className="text-gray-500 hover:text-gray-700"
                            leftSection={
                              fullscreen ? (
                                <IconArrowsMinimize size={16} />
                              ) : (
                                <IconArrowsMaximize size={16} />
                              )
                            }
                          />
                          <Button
                            variant="subtle"
                            onClick={() => setOpen(false)}
                            className="text-gray-500 hover:text-gray-700"
                            leftSection={<IconX size={16} />}
                          />
                        </div>
                      </div>

                      <HelpCenter
                        viewStack={viewStack}
                        setViewStack={setViewStack}
                      />
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>
          </AppShell.Main>
        </Flex>
        <InternetConnectionStatus />
      </AppShell>
    </ProtectedRoute>
  );
}

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
  activeRole,
  userMenuOpened,
  setUserMenuOpened,
  onLogout,
}: UserMenuProps) {
  console.log("activeRole", activeRole);

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
                src={
                  user?.profilePicture
                    ? user.profilePicture
                    : "https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/avatars/avatar-2.png"
                }
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
            {user?.currentTenant?.industry ?? "Industry"}
          </Text>

          <Menu.Item
            leftSection={
              <IconUserCog size={20} color="var(--mantine-color-green-6)" />
            }
            className="text-xs font-semibold bg-blue-500 border-blue-700 border-solid border-2 text-slate-50 shadow-md cursor-not-allowed"
          >
            {activeRole}
          </Menu.Item>
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
