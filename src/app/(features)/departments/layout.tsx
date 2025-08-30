"use client";
import { useCallback, useEffect, useMemo, useState } from "react";
import type { CollectionQuery } from "@/src/shared/models/collection.model";
import type { Actions } from "@/src/shared/models/table-config";
import { Modal, Divider } from "@mantine/core";
import { IconEye, IconPencil, IconTrash } from "@tabler/icons-react";
import { Department } from "@/src/models/department.model";
import DepartmentForm from "./_component/department-form.component";
import {
  useDeleteDepartmentMutation,
  useLazyGetArchivedDepartmentsQuery,
  useLazyGetDepartmentsQuery,
  useRestoreDepartmentMutation,
} from "./_store/department.query";
import { modals } from "@mantine/modals";
import EntityTable from "@/src/shared/table/entity-table";
import { EntityConfig } from "@/src/shared/models/entity-list-config";
import ReasonForm from "./_component/reason-form.component";

const defaultDepartment: Department = {
  id: "",
  name: "",
  description: "",
  code: "",
};

const modalConfig = {
  new: {
    title: "New Department",
    size: "60%",
    component: (onClose: () => void) => (
      <DepartmentForm editMode="new" onClose={onClose} />
    ),
  },
  edit: {
    title: "Edit Department",
    size: "60%",
    component: (onClose: () => void, department: Department) => (
      <DepartmentForm editMode="detail" onClose={onClose} data={department} />
    ),
  },
  view: {
    title: "View Department",
    size: "60%",
    component: (onClose: () => void, department: Department) => (
      <DepartmentForm editMode="view" onClose={onClose} data={department} />
    ),
  },
  archive: {
    title: "Reason",
    size: "50%",
    component: (onClose: () => void, department: Department) => (
      <ReasonForm id={department?.id ?? ""} onClose={onClose} />
    ),
  },
};

export default function DepartmentsComponent() {
  const [collectionQuery, setCollectionQuery] = useState<CollectionQuery>({
    skip: 0,
    top: 10,
    orderBy: [{ field: "createdAt", direction: "desc" }],
    search: "",
  });

  const [modal, setModals] = useState<
    Record<keyof typeof modalConfig, boolean>
  >({
    new: false,
    edit: false,
    view: false,
    archive: false,
  });

  const [selectedDepartment, setSelectedDepartment] =
    useState<Department>(defaultDepartment);
  const [view, setView] = useState<"list" | "archived">("list");

  const [getDepartments, { data: departments, isLoading }] =
    useLazyGetDepartmentsQuery();
  const [
    getArchivedDepartments,
    { data: archivedDepartments, isLoading: archivedDepartmentsLoading },
  ] = useLazyGetArchivedDepartmentsQuery();

  const [restoreDepartment] = useRestoreDepartmentMutation();
  const [deleteDepartment] = useDeleteDepartmentMutation();

  useEffect(() => {
    if (view === "list") {
      getDepartments({ ...collectionQuery, includes: ["tenant"] });
    }
  }, [collectionQuery, getDepartments, view]);

  useEffect(() => {
    if (view === "archived") {
      getArchivedDepartments(collectionQuery);
    }
  }, [collectionQuery, getArchivedDepartments, view]);

  const openModal = (
    type: keyof typeof modalConfig,
    department?: Department
  ) => {
    setSelectedDepartment(department ?? defaultDepartment);
    setModals((prev) => ({ ...prev, [type]: true }));
  };

  const closeModal = (type: keyof typeof modalConfig) => {
    setModals((prev) => ({ ...prev, [type]: false }));
    setSelectedDepartment(defaultDepartment);
  };

  const handleAction = (action: { key: string }, department?: Department) => {
    openModal(action.key as keyof typeof modalConfig, department);

    if (action.key === "delete" && department?.id) {
      handleDelete(department);
    } else if (action.key === "restore") {
      restoreDepartment(String(department?.id));
    }
  };

  const handleDelete = (department: Department) => {
    modals.openConfirmModal({
      title: (
        <span className="text-lg font-semibold text-gray-800">
          Confirm Deletion
        </span>
      ),
      centered: true,
      children: (
        <div className="space-y-2 text-sm text-gray-700">
          <p>
            Are you sure you want to delete this{" "}
            <span className="text-red-600 font-medium">Department</span>? This
            action
            <strong> cannot </strong> be undone.
          </p>
          <p>
            <strong className="text-gray-800">Name:</strong>{" "}
            <span className="text-gray-700">{department?.name}</span>
          </p>
        </div>
      ),
      labels: {
        confirm: "Delete",
        cancel: "Cancel",
      },
      confirmProps: {
        color: "red",
        variant: "filled",
      },
      onConfirm: () => {
        deleteDepartment(String(department?.id));
      },
    });
  };

  const handlePaginationChange = useCallback(
    (pageIndex: number, pageSize: number) => {
      setCollectionQuery((prev) => ({
        ...prev,
        skip: pageIndex,
        top: pageSize,
      }));
    },
    []
  );

  const onSearch = (search: string) => {
    setCollectionQuery((prev) => ({
      ...prev,
      skip: 0,
      search: search,
    }));
  };

  const onOrder = (order: { field: string; direction: "desc" | "asc" }) => {
    setCollectionQuery((prev) => ({
      ...prev,
      orderBy: [order],
    }));
  };

  const renderModals = () =>
    (Object.keys(modalConfig) as (keyof typeof modalConfig)[]).map((key) => {
      const { title, size, component } = modalConfig[key];

      return (
        <Modal
          key={key}
          opened={modal[key]}
          onClose={() => closeModal(key)}
          title={title}
          centered
          size={size}
        >
          <Divider />
          {component(() => closeModal(key), selectedDepartment)}
        </Modal>
      );
    });

  const config = useMemo<EntityConfig<Department>>(() => {
    const listActions: Actions[] = [
      { label: "Edit", key: "edit", icon: IconPencil, size: "16" },
      {
        label: "Archive",
        key: "archive",
        icon: IconTrash,
        size: "16",
        type: "danger",
      },
    ];

    const archivedActions: Actions[] = [
      { label: "Restore", key: "restore", icon: IconPencil, size: "16" },
      {
        label: "Delete",
        key: "delete",
        icon: IconTrash,
        size: "16",
        type: "danger",
      },
    ];

    return {
      visibleColumn: [
        {
          key: "name",
          name: "Department Name",
          render: (data: Department) => `${data?.name ?? ""}`,
        },

        {
          key: ["tenant", "name"],
          name: "Tenant",
          render: (data: Department) => `${data?.tenant?.name}`,
        },
        {
          key: "description",
          name: "Description",
          render: (data: Department) => (
            <div
              className="line-clamp-2"
              dangerouslySetInnerHTML={{ __html: data?.description ?? "" }}
            />
          ),
          tdClass: "w-1/4",
        },
        {
          key: "createdAt",
          name: "Created At",
          isDate: true,
        },
      ],

      actions: [
        { label: "Show More", key: "view", icon: IconEye, size: "16" },
        ...(view === "list" ? listActions : archivedActions),
      ],
      showDetail: false
    };
  }, [view]);

  return (
    <EntityTable
      title={view === "list" ? "Departments" : "Archived Departments"}
      config={config}
      items={view === "list" ? departments?.data : archivedDepartments?.data}
      total={view === "list" ? departments?.total : archivedDepartments?.total}
      itemsLoading={view === "list" ? isLoading : archivedDepartmentsLoading}
      collectionQuery={collectionQuery}
      view={view}
      showNewButton={view === "list"}
      onViewChange={setView}
      onPaginationChange={handlePaginationChange}
      onSearch={onSearch}
      onOrder={onOrder}
      renderModals={renderModals}
      handleAction={handleAction}
    />
  );
}
