"use client";
import {
  ActionIcon,
  Button,
  Card,
  Divider,
  Menu,
  Modal,
  Table,
} from "@mantine/core";
import { JSX, useEffect, useState } from "react";
import ReasonForm from "./reason-form-component";
import {
  IconDotsVertical,
  IconInbox,
  IconPencil,
  IconPlus,
  IconTrash,
} from "@tabler/icons-react";
import { galleryDefaultValue } from "@/src/schemas/property-schema";
import { useParams } from "next/navigation";
import { useLazyGetPropertyQuery } from "../_store/property.query";
import { Gallery } from "@/src/models/property.model";
import GalleryForm from "./gallery-form.component";


export default function PropertyGalleryComponent() {
    const params = useParams();
  const [modals, setModals] = useState({
    new: false,
    edit: false,
    view: false,
    archive: false,
  });

  const [selectedGallery, setSelectedGallery] = useState<Gallery>(galleryDefaultValue);

  const [getProperty, { data: property }] = useLazyGetPropertyQuery();

  useEffect(() => {
    getProperty({id: String(params.id), includes:['galleries']});
  }, [params, getProperty]);

  const openModal = (type: keyof typeof modals, gallery?: Gallery) => {
    setSelectedGallery(gallery ?? galleryDefaultValue);
    setModals((prev) => ({
      ...prev,
      [type]: !prev[type],
    }));
  };

  const closeModal = (type: string) => {
    setModals((prev) => ({ ...prev, [type]: false }));
    setSelectedGallery(galleryDefaultValue);
  };

  const handleAction = (action: { key: string }, data?: Gallery) => {
    switch (action.key) {
      case "showMore":
        openModal("view", data);
        break;
      case "edit":
        openModal("edit", data);
        break;
      case "delete":
        openModal("archive", data);
        break;
      default:
        console.warn("Unknown action:", action);
    }
  };

  const renderModal = (
    type: keyof typeof modals,
    title: string,
    size: string,
    content: JSX.Element
  ) => (
    <Modal
      opened={modals[type]}
      onClose={() => closeModal(type)}
      title={title}
      centered
      size={size}
    >
      <Divider />
      {content}
    </Modal>
  );

  return (
    <Card shadow="sm" padding="sm">

      <Table>
        <Table.Thead>
          <Table.Tr>
            <Table.Th>Description</Table.Th>
            <Table.Th style={{ width: "20px" }}></Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          {property?.galleries?.length === 0 ? (
            <Table.Tr>
              <Table.Td colSpan={6} className="text-center py-8 text-gray-500">
                <div className="flex flex-col items-center">
                  <IconInbox size={40} />
                  <p className="mt-2">No galleries found</p>
                </div>
              </Table.Td>
            </Table.Tr>
          ) : (
            property?.galleries?.map((gallery: Gallery) => (
              <Table.Tr key={gallery.propertyId}>
                <Table.Td>{gallery.description}</Table.Td>
                <Table.Td>
                  <Menu shadow="md" width={160} position="bottom-end" withArrow>
                    <Menu.Target>
                      <ActionIcon
                        variant="subtle"
                        size="sm"
                        aria-label="Actions"
                      >
                        <IconDotsVertical size={18} />
                      </ActionIcon>
                    </Menu.Target>

                    <Menu.Dropdown>
                      <Menu.Item
                        leftSection={<IconPencil size={14} />}
                        onClick={() => handleAction({ key: "edit" }, gallery)}
                      >
                        Edit
                      </Menu.Item>
                      <Menu.Item
                        leftSection={<IconTrash size={14} />}
                        color="red"
                        onClick={() => handleAction({ key: "delete" }, gallery)}
                      >
                        Delete
                      </Menu.Item>
                    </Menu.Dropdown>
                  </Menu>
                </Table.Td>
              </Table.Tr>
            ))
          )}
        </Table.Tbody>
      </Table>

      {renderModal(
        "view",
        "View Gallery",
        "50%",
        <GalleryForm
          editMode="view"
          onClose={() => closeModal("view")}
          data={selectedGallery}
        />
      )}
    </Card>
  );
}
