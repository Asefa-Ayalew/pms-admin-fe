"use client";

import { Image, Card, Group, Text, Button } from "@mantine/core";
import { Gallery } from "@/src/models/property.model";

interface Props {
  data?: Gallery;
  onClose: () => void;
}

export default function PropertyGalleryPreview({ data, onClose }: Props) {
  if (!data?.photo?.type || !data?.photo?.url) {
    return (
      <Card shadow="sm" radius="md" p="lg" withBorder>
        <Text>No file to preview.</Text>
        <Group justify="flex-end" mt="md">
          <Button variant="light" onClick={onClose}>
            Close
          </Button>
        </Group>
      </Card>
    );
  }

  return (
    <Card shadow="sm" radius="md" p="lg" withBorder>
      {data.photo.type.startsWith("image") && (
        <Image src={data.photo.url} alt="Preview" radius="md" />
      )}

      {data.photo.type === "application/pdf" && (
        <iframe
          src={data.photo.url}
          title="PDF Preview"
          style={{ width: "100%", height: "600px", border: "none" }}
        />
      )}

      {!data.photo.type.startsWith("image") &&
        data.photo.type !== "application/pdf" && (
          <Text>Preview not supported for this file type.</Text>
        )}

      <Group justify="flex-end" mt="md">
        <Button variant="light" onClick={onClose}>
          Close
        </Button>
      </Group>
    </Card>
  );
}
