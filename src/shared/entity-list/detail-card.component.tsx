import type React from "react"
import { Card, Tabs, Badge, Text, Group, Stack, Title } from "@mantine/core"

interface DetailCardProps<T> {
  item: T
  title?: string
  description?: string
  sections?: {
    id: string
    label: string
    content: React.ReactNode
  }[]
}

export default function DetailCard<T>({
  item,
  title = "Item Details",
  description,
  sections = [],
}: DetailCardProps<T>) {
  return (
    <Card shadow="xs" padding="md" radius="md">
      <Group justify="space-between" mb="md">
        <div>
          <Title order={4}>{title}</Title>
          {description && (
            <Text color="dimmed" size="sm">
              {description}
            </Text>
          )}
        </div>
      </Group>

      {sections.length > 0 ? (
        <Tabs defaultValue={sections[0].id}>
          <Tabs.List>
            {sections.map((section) => (
              <Tabs.Tab key={section.id} value={section.id}>
                {section.label}
              </Tabs.Tab>
            ))}
          </Tabs.List>

          {sections.map((section) => (
            <Tabs.Panel key={section.id} value={section.id} pt="md">
              {section.content}
            </Tabs.Panel>
          ))}
        </Tabs>
      ) : (
        <Stack gap="xs">
          {Object.entries(item as any)
            .filter(([key]) => key !== "id")
            .map(([key, value]) => (
              <Group key={key} justify="space-between">
                <Text size="sm" color="dimmed" style={{ textTransform: "capitalize" }}>
                  {key.replace(/([A-Z])/g, " $1").trim()}
                </Text>
                <Text>{value !== null && value !== undefined ? String(value) : "-"}</Text>
              </Group>
            ))}
        </Stack>
      )}
    </Card>
  )
}
