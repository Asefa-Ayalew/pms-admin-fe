"use client";

import { Center, Paper, Text } from "@mantine/core";
import { IconUsers } from "@tabler/icons-react";

export default function TenantPage() {
  return (
    <Center h="80vh">
      <Paper shadow="md" p="xl" radius="md" withBorder>
        <Center mb="md">
          <IconUsers size={64} opacity={0.5} />
        </Center>
        <Text ta="center" size="lg" fw={500}>
          Select a tenant to view details
        </Text>
        <Text ta="center" size="sm" c="dimmed">
          Click on any tenant to view or edit
        </Text>
      </Paper>
    </Center>
  );
}
