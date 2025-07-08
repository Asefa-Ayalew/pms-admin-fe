"use client";

import { useState } from "react";
import {
  Stack,
  Text,
  Textarea,
  Group,
  Card,
  Image,
  CloseButton,
  Button,
  rem,
} from "@mantine/core";
import { Dropzone } from "@mantine/dropzone";
import { Gallery } from "@/src/models/property.model";
import { useAddGalleryMutation } from "../_store/property.query";
import { useParams } from "next/navigation";
import { notifications } from "@mantine/notifications";

interface Props {
  editMode: "new" | "detail" | "view";
  onClose: () => void;
  onCreating?: (data: boolean) => void;
  data?: Gallery;
}
export default function GalleryForm(props: Props) {
  const params = useParams();
  const [addGallery, { isLoading: creating }] = useAddGalleryMutation();
  const [files, setFiles] = useState<File[]>([]);
  const [description, setDescription] = useState("");

  const handleDrop = (newFiles: File[]) => {
    setFiles((prev) => [...prev, ...newFiles]);
  };

  const removeImage = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    const formData = new FormData();
    files.forEach((file) => {
      formData.append("gallery", file);
    });
    formData.append("description", description);
    formData.append("propertyId", String(params.id));

    try {
      const response = await addGallery(formData).unwrap();

      if (response) {
        props.onClose();
        notifications.show({
          title: "Success",
          message: "Successfully Uploaded",
          color: "green",
        });
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Stack gap={"lg"} className="w-full m-2" mx="auto" p="md">
      <Textarea
        label="Gallery Description"
        placeholder="Enter a short description"
        autosize
        minRows={3}
        value={description}
        onChange={(e) => setDescription(e.currentTarget.value)}
      />

      <Dropzone
        onDrop={handleDrop}
        accept={["image/*", "application/pdf"]}
        multiple
        radius="md"
        p="xl"
      >
        <Text ta="center" c="dimmed">
          Drag & drop images here, or click to browse
        </Text>
      </Dropzone>

      <Group wrap="wrap" gap="md">
        {files.map((file, index) => (
          <Card
            key={index}
            radius="md"
            withBorder
            shadow="sm"
            pos="relative"
            w={rem(120)}
            h={rem(120)}
            p={0}
          >
            <Image
              src={URL.createObjectURL(file)}
              alt={`preview-${index}`}
              w="100%"
              h="100%"
              fit="cover"
              radius="md"
            />
            <CloseButton
              onClick={() => removeImage(index)}
              pos="absolute"
              top={5}
              right={5}
              size="sm"
              color="red"
              title="Remove image"
            />
          </Card>
        ))}
      </Group>

      <Button
        onClick={handleSubmit}
        disabled={!description || files.length === 0}
        loading={creating}
      >
        Submit Gallery
      </Button>
    </Stack>
  );
}
