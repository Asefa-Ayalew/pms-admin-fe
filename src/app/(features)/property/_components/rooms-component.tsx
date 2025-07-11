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
import { useEffect, useMemo, useState } from "react";
import {
  IconDotsVertical,
  IconEye,
  IconInbox,
  IconPencil,
  IconPlus,
  IconTrash,
} from "@tabler/icons-react";

import ReasonForm from "./reason-form-component";
import RoomForm from "./room-form-component";

import { useLazyGetRoomsQuery } from "../_store/room.query";
import { Room } from "@/src/models/room.model";
import { CollectionQuery } from "@/src/shared/models/collection.model";
import { formatDate } from "@/src/shared/utils/date-utils";

const defaultRoom: Room = {
  id: "",
  description: "",
  floorNumber: "",
  roomNumber: "",
  type: "",
  size: 1,
  amenities: [],
};

const modalConfig = {
  new: {
    title: "Create Room",
    size: "60%",
    component: (onClose: () => void) => (
      <RoomForm editMode="new" onClose={onClose} />
    ),
  },
  edit: {
    title: "Edit Room",
    size: "60%",
    component: (onClose: () => void, room: Room) => (
      <RoomForm editMode="detail" onClose={onClose} data={room} />
    ),
  },
  view: {
    title: "View Room",
    size: "60%",
    component: (onClose: () => void, room: Room) => (
      <RoomForm editMode="view" onClose={onClose} data={room} />
    ),
  },
  archive: {
    title: "Reason",
    size: "50%",
    component: (onClose: () => void, room: Room) => (
      <ReasonForm id={room?.id ?? ""} onClose={onClose} />
    ),
  },
};

export default function RoomsComponent() {
  const [modals, setModals] = useState<
    Record<keyof typeof modalConfig, boolean>
  >({
    new: false,
    edit: false,
    view: false,
    archive: false,
  });

  const [selectedRoom, setSelectedRoom] = useState<Room>(defaultRoom);
  const [getRooms, { data: rooms }] = useLazyGetRoomsQuery();

  const collection = useMemo<CollectionQuery>(
    () => ({
      skip: 0,
      top: 20,
      orderBy: [{ field: "createdAt", direction: "desc" }],
    }),
    []
  );

  useEffect(() => {
    getRooms(collection);
  }, [collection, getRooms]);

  const openModal = (type: keyof typeof modalConfig, room?: Room) => {
    setSelectedRoom(room ?? defaultRoom);
    setModals((prev) => ({ ...prev, [type]: true }));
  };

  const closeModal = (type: keyof typeof modalConfig) => {
    setModals((prev) => ({ ...prev, [type]: false }));
    setSelectedRoom(defaultRoom);
  };

  const handleAction = (action: string, room?: Room) => {
    openModal(action as keyof typeof modalConfig, room);
  };

  const renderModals = () =>
    (Object.keys(modalConfig) as (keyof typeof modalConfig)[]).map((key) => {
      const { title, size, component } = modalConfig[key];
      return (
        <Modal
          key={key}
          opened={modals[key]}
          onClose={() => closeModal(key)}
          title={title}
          centered
          size={size}
        >
          <Divider />
          {component(() => closeModal(key), selectedRoom)}
        </Modal>
      );
    });

  return (
    <Card shadow="sm" padding="sm">
      <Button
        onClick={() => openModal("new")}
        leftSection={<IconPlus size={16} />}
        styles={{
          root: {
            width: "5rem",
            transition: "background-color 0.2s ease",
            "&:hover": {
              backgroundColor: "#ffeaea",
            },
            marginBottom: "4px",
            marginLeft: "4px",
          },
        }}
      >
        New
      </Button>

      <Table>
        <Table.Thead>
          <Table.Tr>
            <Table.Th>Description</Table.Th>
            <Table.Th>Size</Table.Th>
            <Table.Th>Floor Number</Table.Th>
            <Table.Th>Room Number</Table.Th>
            <Table.Th>Floor Number</Table.Th>
            <Table.Th>Number of Bed Rooms</Table.Th>
            <Table.Th>Is Furnished?</Table.Th>
            <Table.Th>Is Public</Table.Th>
            <Table.Th style={{ width: "15%" }}>Created At</Table.Th>
            <Table.Th style={{ width: "20px" }}></Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          {rooms?.data?.length === 0 ? (
            <Table.Tr>
              <Table.Td colSpan={6} className="text-center py-8 text-gray-500">
                <div className="flex flex-col items-center">
                  <IconInbox size={40} />
                  <p className="mt-2">No rooms found</p>
                </div>
              </Table.Td>
            </Table.Tr>
          ) : (
            rooms?.data.map((room: Room) => (
              <Table.Tr key={room.id}>
                <Table.Td>{room?.description}</Table.Td>
                <Table.Td>{room.size}</Table.Td>
                <Table.Td>{room?.floorNumber}</Table.Td>
                <Table.Td>{room?.roomNumber}</Table.Td>
                <Table.Td>{room?.floorNumber}</Table.Td>
                <Table.Td>{room.numberOfBedRooms}</Table.Td>
                <Table.Td>{room?.isFurnished ? "Yes" : "No"}</Table.Td>
                <Table.Td>{room?.makePublic ? "Yes" : "No"}</Table.Td>
                <Table.Td>{formatDate(room.createdAt)}</Table.Td>
                <Table.Td>
                  <Menu shadow="md" width={160} position="bottom-end" withArrow>
                    <Menu.Target>
                      <ActionIcon variant="subtle" size="sm">
                        <IconDotsVertical size={18} />
                      </ActionIcon>
                    </Menu.Target>
                    <Menu.Dropdown>
                      <Menu.Item
                        leftSection={<IconEye size={14} />}
                        onClick={() => handleAction("view", room)}
                      >
                        View
                      </Menu.Item>
                    </Menu.Dropdown>
                  </Menu>
                </Table.Td>
              </Table.Tr>
            ))
          )}
        </Table.Tbody>
      </Table>

      {renderModals()}
    </Card>
  );
}
