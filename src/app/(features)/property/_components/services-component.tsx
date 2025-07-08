"use client";
import {
  ActionIcon,
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
} from "@tabler/icons-react";

import { PropertyService } from "@/src/models/property.model";
import { formatDate } from "@/src/shared/utils/date-utils";
import { useLazyGetPropertyQuery } from "../_store/property.query";
import { serviceDefaultValue } from "@/src/schemas/property-schema";
import { useParams } from "next/navigation";
import { CollectionQuery } from "@/src/shared/models/collection.model";
import ServicePreview from "./service-preview-component";

const modalConfig = {
  view: {
    title: "View Service",
    size: "60%",
    component: (onClose: () => void, service:PropertyService) => (
      <ServicePreview onClose={onClose} data={service} />
    ),
  },
};

export default function ServicesComponent() {
  const params = useParams();
    const collection = useMemo<CollectionQuery>(
    () => ({
      skip: 0,
      top: 20,
      orderBy: [{ field: "createdAt", direction: "desc" }],
    }),
    []
  );
  const [modals, setModals] = useState<
    Record<keyof typeof modalConfig, boolean>
  >({
    view: false,
  });
  const [selectedService, setSelectedService] =
    useState<PropertyService>(serviceDefaultValue);
  const [getProperty, { data: selectedProperty }] = useLazyGetPropertyQuery();
  const services = selectedProperty?.services;

  useEffect(() => {
    getProperty({ id: String(params.id), includes: ["services", "services.service"] });
  }, [collection, getProperty]);

  const openModal = (type: keyof typeof modalConfig, service?:PropertyService) => {
    setSelectedService(service ?? serviceDefaultValue);
    setModals((prev) => ({ ...prev, [type]: true }));
  };

  const closeModal = (type: keyof typeof modalConfig) => {
    setModals((prev) => ({ ...prev, [type]: false }));
    setSelectedService(serviceDefaultValue);
  };

  const handleAction = (action: string, service?:PropertyService) => {
    openModal(action as keyof typeof modalConfig, service);
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
          {component(() => closeModal(key), selectedService)}
        </Modal>
      );
    });

  return (
    <Card shadow="sm" padding="md">
      <Table>
        <Table.Thead>
          <Table.Tr>
            <Table.Th>Name</Table.Th>
            <Table.Th>Charge Amount</Table.Th>
            <Table.Th>Available From</Table.Th>
            <Table.Th>Is Optional?</Table.Th>
            <Table.Th>Is Public?</Table.Th>
            <Table.Th style={{ width: "15%" }}>Created At</Table.Th>
            <Table.Th style={{ width: "20px" }}></Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          {services?.length === 0 ? (
            <Table.Tr>
              <Table.Td colSpan={6} className="text-center py-8 text-gray-500">
                <div className="flex flex-col items-center">
                  <IconInbox size={40} />
                  <p className="mt-2">No services found</p>
                </div>
              </Table.Td>
            </Table.Tr>
          ) : (
            services?.map((service:PropertyService) => (
              <Table.Tr key={service.id}>
                <Table.Td>{service?.service?.name}</Table.Td>
                <Table.Td>{service.chargeAmount}</Table.Td>
                <Table.Td>{formatDate(service.availableFrom)}</Table.Td>
                <Table.Td>{service.isOptional ? "Yes" : "No"}</Table.Td>
                <Table.Td>{service.isPublic ? "Yes" : "No"}</Table.Td>
                <Table.Td>{formatDate(service.createdAt)}</Table.Td>
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
                        onClick={() => handleAction("view", service)}
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
