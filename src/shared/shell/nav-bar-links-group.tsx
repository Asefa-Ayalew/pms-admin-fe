'use client';
import {
  Box,
  Collapse,
  Group,
  ThemeIcon,
  UnstyledButton,
  rem,
} from '@mantine/core';
import { IconChevronRight } from '@tabler/icons-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import styles from './nav-bar-links-group.module.css';

interface LinksGroupProps {
  key: string;
  icon: React.FC<any>;
  label: string;
  link?: string;
  external?: boolean;
  initiallyOpened?: boolean;
  links?: { label: string; link?: string }[];
}

export function LinksGroup({
  icon: Icon,
  label,
  link,
  external,
  initiallyOpened,
  links,
}: LinksGroupProps): React.ReactElement {
  const hasLinks = Array.isArray(links);
  const pathname = usePathname();
  const [opened, setOpened] = useState(initiallyOpened || false);
  const items = (hasLinks ? links : []).map((l) => (
    <Link
      className={`${styles.link} ${
        pathname.startsWith(l.link ?? '#') ? styles.active : ''
      }`}
      href={l.link ?? ''}
      key={l.label}
    >
      {l.label}
    </Link>
  ));

  return (
    <>
      {link ? (
        <UnstyledButton<'a' | typeof Link>
          className={`${styles.control} ${
            pathname.startsWith(link) ? styles.active : ''
          }`}
          component={external ? 'a' : Link}
          href={link}
        >
          <Group gap={0} justify="space-between">
            <Box style={{ display: 'flex', alignItems: 'center' }}>
              <ThemeIcon size={30} variant="light"  c="black">
                <Icon style={{ width: rem(18), height: rem(18) }} />
              </ThemeIcon>
              <Box ml="md">{label}</Box>
            </Box>
            {hasLinks ? (
              <IconChevronRight
                className={styles.chevron}
                stroke={1.5}
                style={{
                  width: rem(16),
                  height: rem(16),
                  transform: opened ? 'rotate(-90deg)' : 'none',
                }}
              />
            ) : null}
          </Group>
        </UnstyledButton>
      ) : (
        <UnstyledButton
          className={`${styles.control} ${
            pathname.startsWith(link ?? '#') ? styles.active : ''
          }`}
          onClick={() => {
            setOpened((o) => !o);
          }}
        >
          <Group gap={0} justify="space-between">
            <Box style={{ display: 'flex', alignItems: 'center' }}>
              <ThemeIcon size={30} variant="light" c="black">
                <Icon style={{ width: rem(18), height: rem(18) }} />
              </ThemeIcon>
              <Box ml="md">{label}</Box>
            </Box>
            {hasLinks ? (
              <IconChevronRight
                className={styles.chevron}
                stroke={1.5}
                style={{
                  width: rem(16),
                  height: rem(16),
                  transform: opened ? 'rotate(-90deg)' : 'none',
                }}
              />
            ) : null}
          </Group>
        </UnstyledButton>
      )}
      {hasLinks ? <Collapse in={opened}>{items}</Collapse> : null}
    </>
  );
}
