"use client";

import { theme } from "@/src/shared/theme/mantine";
import { MantineProvider, MantineThemeOverride } from "@mantine/core";

export default function RootStyleRegistry({
  children,
}: {
  children: React.ReactNode;
}) {
  const baseTheme: Partial<MantineThemeOverride> = theme;

  return (
    <MantineProvider withGlobalClasses withStaticClasses theme={baseTheme}>
      {children}
    </MantineProvider>
  );
}
