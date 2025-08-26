import { Avatar, Group, Text, Box, Paper } from '@mantine/core';
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function UserInfo({ user }: { user: any }) {
  const tenant = user?.currentTenant;

  return (
    <Paper
      shadow="md"
      radius="lg"
      p="md"
      className="mx-3 my-4 bg-gradient-to-br from-blue-50 to-white dark:from-gray-900 dark:to-gray-800 transition-all duration-300"
    >
      <Group wrap="nowrap" gap="md">
        <Avatar
          src="https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/avatars/avatar-2.png"
          size={72}
          radius="xl"
          className="shadow-md"
        />
        <Box>
          <Text fz="lg" fw={700} className="text-blue-900 dark:text-white">
            {user?.firstName ?? 'Tenant Name'}
          </Text>
          <Text fz="sm" c="dimmed">
            {tenant?.industry ?? 'Industry'}
          </Text>
        </Box>
      </Group>
    </Paper>
  );
}
