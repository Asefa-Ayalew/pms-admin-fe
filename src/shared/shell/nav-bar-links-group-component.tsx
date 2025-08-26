"use client";
import {
  Box,
  Collapse,
  Group,
  rem,
  ThemeIcon,
  UnstyledButton,
} from "@mantine/core";
import { IconChevronRight } from "@tabler/icons-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { memo, useCallback, useEffect, useRef, useState } from "react";
import { cn } from "../utitlity/cn";
import classes from "./nav-bar-links-group.module.css";

export interface LinksGroupProps {
  icon: React.FC;
  label: string;
  link?: string;
  initiallyOpened?: boolean;
  links?: { label: string; link: string }[];
}

const isPathMatch = (currentPath: string, linkPath: string) => {
  // If paths are exactly the same, they match
  if (currentPath === linkPath) return true;

  if (currentPath.startsWith(linkPath)) {
    // Check if the next character after the linkPath is a "/" or nothing
    const nextChar = currentPath.charAt(linkPath.length);
    return nextChar === "" || nextChar === "/";
  }

  return false;
};

const NavLink = memo(
  ({
    href,
    label,
    className,
  }: {
    href: string;
    label: string;
    isActive: boolean;
    className: string;
  }) => (
    <Link href={href} className={className} prefetch={false}>
      {label}
    </Link>
  )
);

NavLink.displayName = "NavLink";

const LinksGroupBase = ({
  icon: Icon,
  label,
  link,
  initiallyOpened,
  links,
}: LinksGroupProps) => {
  const router = useRouter();
  const pathname = usePathname();
  const hasLinks = Array.isArray(links);
  const [opened, setOpened] = useState(initiallyOpened || false);
  const isFirstMount = useRef(true);

  const isCurrentPath = link === pathname;
  const hasActiveChild =
    hasLinks && links.some((link) => isPathMatch(pathname, link.link));

  // Set initial state and handle route changes
  useEffect(() => {
    if (isFirstMount.current) {
      setOpened(initiallyOpened || hasActiveChild);
      isFirstMount.current = false;
    } else if (hasActiveChild) {
      setOpened(true);
    }
  }, [hasActiveChild, initiallyOpened]);

  // Handle group toggle
  const handleClick = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();

      if (hasLinks) {
        setOpened((o) => !o);
      } else if (link && link !== pathname) {
        router.push(link);
      }
    },
    [hasLinks, link, pathname, router]
  );

  const items = (hasLinks ? links : []).map((link) => (
    <NavLink
      key={link.label}
      href={link.link}
      label={link.label}
      isActive={isPathMatch(pathname, link.link)}
      className={cn(
        classes.link,
        isPathMatch(pathname, link.link) && classes.linkActive
      )}
    />
  ));

  return (
    <div
      style={{
        position: "relative",
        transform: "translateZ(0)",
      }}
    >
      <UnstyledButton
        onClick={handleClick}
        className={cn(
          `font-medium flex w-full px-[var(--mantine-spacing-md)] py-[var(--mantine-spacing-xs)] text-[var(--mantine-color-text)] text-[var(--mantine-font-size-sm)] rounded-[var(--mantine-radius-md)] transition-colors duration-200 ease-out select-none transform-gpu`,
          (isCurrentPath || hasActiveChild) &&
            `bg-[var(--mantine-color-blue-light)] text-[var(--mantine-color-blue-light-color)] font-semibold`
        )}
        style={{
          fontWeight: 500,
          display: "block",
          width: "100%",
          padding: "var(--mantine-spacing-xs) var(--mantine-spacing-md)",
          color: "var(--mantine-color-text)",
          fontSize: "var(--mantine-font-size-sm)",
          borderRadius: "var(--mantine-radius-md)",
          transition: "background-color 200ms cubic-bezier(0.4, 0, 0.2, 1)",
          WebkitUserSelect: "none",
          userSelect: "none",
          transform: "translateZ(0)",
        }}
      >
        <Group justify="space-between" gap={"md"}>
          <Box style={{ display: "flex", alignItems: "center" }}>
            <ThemeIcon
              variant="light"
              size={30}
              color={isCurrentPath || hasActiveChild ? "blue" : "gray"}
            >
              <Box style={{ width: rem(18), height: rem(18) }}>
                <Icon />
              </Box>
            </ThemeIcon>
            <Box ml="md">{label} </Box>
          </Box>
          {hasLinks && (
            <IconChevronRight
              className={classes.chevron}
              stroke={1.5}
              style={{
                width: rem(16),
                height: rem(16),
                transform: opened ? `rotate(-90deg)` : "none",
              }}
            />
          )}
        </Group>
      </UnstyledButton>
      {hasLinks && (
        <Collapse in={opened}>
          <div className="flex-1 -mx-[calc(var(--mantine-spacing-md))]">
            {items}
          </div>
        </Collapse>
      )}
    </div>
  );
};

export const LinksGroup = memo(LinksGroupBase);

export const NavigationContainer = memo(
  ({ links }: { links: LinksGroupProps[] }) => {
    return (
      <nav
        style={{
          backgroundColor: `light-dark(var(--mantine-color-white), var(--mantine-color-dark-6))`,
          height: rem(800),
          width: rem(300),
          padding: "var(--mantine-spacing-md)",
          paddingBottom: 0,
          display: "flex",
          flexDirection: "column",
          borderRight: `1px solid light-dark(var(--mantine-color-gray-3), var(--mantine-color-dark-4))`,
        }}
      >
          <div
            style={{
              paddingTop: 0,
              paddingBottom: `var(--mantine-spacing-xl)`,
            }}
          >
            {links.map((item) => (
              <LinksGroup key={item.label} {...item} />
            ))}
          </div>
      </nav>
    );
  }
);

NavigationContainer.displayName = "NavigationContainer";
