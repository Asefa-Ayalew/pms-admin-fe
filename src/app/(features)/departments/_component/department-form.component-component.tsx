"use client";

import { Department } from "@/src/models/department.model";
import { NewDepartmentSchema } from "@/src/schemas/new-department-schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Box, Button, LoadingOverlay, Modal, TextInput } from "@mantine/core";
import {
  IconArrowBack,
  IconDeviceFloppy,
  IconEdit,
  IconTrash,
  IconView360,
} from "@tabler/icons-react";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Controller, useForm, FieldErrors } from "react-hook-form";
import z from "zod";

import { CustomRichTextEditorType } from "@/src/models/rich-text-editor.model";
import CustomRichTextEditor from "@/src/shared/component/rich-text-editor/rich-text-editor";
import {
  useArchiveDepartmentMutation,
  useCreateDepartmentMutation,
  useDeleteDepartmentMutation,
  useLazyGetDepartmentQuery,
  useRestoreDepartmentMutation,
  useUpdateDepartmentMutation,
} from "../_store/department.query";
import dateFormat from "dateformat";
import DetailsPage from "@/src/shared/component/details-page/details-page.component";
interface Props {
  editMode: "new" | "detail";
  onCreating?: (data: Department) => void;
}

type FormSchema = z.infer<typeof NewDepartmentSchema>;

const defaultValue: Department = {
  name: "",
  description: "",
};

export default function DepartmentForm(props: Props) {
  const { editMode, onCreating } = props;
  const params = useParams();
  const navigate = useRouter();

  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [selectedDepartment, setSelectedDepartment] = useState<Department>();

  const [getDepartment, department] = useLazyGetDepartmentQuery();
  const [createDepartment, createResponse] = useCreateDepartmentMutation();
  const [updateDepartment, updateResponse] = useUpdateDepartmentMutation();
  const [archiveDepartment, archiveResponse] = useArchiveDepartmentMutation();
  const [restoreDepartment, restoreResponse] = useRestoreDepartmentMutation();
  const [deleteDepartment, deleteResponse] = useDeleteDepartmentMutation();
  const [editorContent, setEditorContent] = useState("");
  const [isEditMode, setIsEditMode] = useState(editMode === "new");

  console.log("unused", editorContent, archiveDepartment);
  const {
    register,
    control,
    handleSubmit,
    watch,
    formState: { errors },
    reset,
  } = useForm<FormSchema>({
    resolver: zodResolver(NewDepartmentSchema),
    mode: "all",
  });

  function onSubmit(data: Department) {
    if (editMode === "new") {
      console.log("Data", data);
      createDepartment({
        ...data,
      }).then((response) => {
        if (response?.data) {
          onCreating?.(response?.data);
          if (!onCreating) {
            navigate.push(`/departments/detail/${response?.data?.id}`);
          }
        }
      });
    } else {
      const updatedData = {
        ...data,
        id: `${params?.id}`,
      };

      updateDepartment(updatedData).then(async (response) => {
        if (response?.data) {
          navigate.push(`/departments/detail/${response?.data?.id}`);
        }
      });
    }
  }

  function handleDelete() {
    const response = selectedDepartment?.archivedAt
      ? restoreDepartment({ id: `${selectedDepartment?.id}` }).then(
        (response) => {
          if (response?.data) {
            setOpenDeleteModal(false);
          }
        }
      )
      : deleteDepartment(`${selectedDepartment?.id}`)
        .then((response) => {
          if (response?.data) {
            setOpenDeleteModal(false);
          }
        })
        .finally(() => {
          setOpenDeleteModal(false);
          navigate.push(`/department`);
        });
    console.log(response);
  }

  const onError = (errors: FieldErrors<FormSchema>) => {
    console.log("Validation Errors", errors);
  };

  const config: CustomRichTextEditorType = {
    hasBold: true,
    hasItalic: true,
    hasUnderline: true,
    hasColor: true,
    hasStrikethrough: true,
    hasClearFormatting: true,
    hasHighlight: true,
    hasHeaders: true,
    hasBulletList: true,
    hasOrderedList: true,
    hasBlockquote: true,
    hasSeparator: true,
    hasTextAlign: true,
    hasTextStyle: true,
    hasUndo: true,
    hasLink: true,
    hasTable: false,
    hasFontFamily: true,
    hasFontSize: true,
  };
  const data = [
    {
      key: "name",
      label: "Department Name",
      value: `${department?.data?.name ?? ""}`,
    },
    {
      key: "createdAt",
      label: "Registration Date",
      value: dateFormat(department?.data?.createdAt, "mmmm dd, yyyy"),
    },
  ];

  const profileData = {
    image: "",
    name: `${department?.data?.name ?? ""}`,
    type: "",
    address: "",
    phone: "",
    email: "",
    isVerified: false,
  };

  const deptConfig = {
    editUrl: `/departments/${params?.id}`,
    isProfile: false,
    title: `${department?.data?.name ?? ""}`,
    widthClass: "w-full",
  };
  const handleToggle = () => {
    setIsEditMode((prev) => !prev);
  };
  useEffect(() => {
    if (editMode === "detail") {
      getDepartment({
        id: `${params?.id}`,
      }).then((response) => {
        if (response?.data) {
          reset({
            ...response?.data,
            description: response?.data?.description || "",
          });
          setEditorContent(response?.data?.description || "");
        }
      });
    } else {
      reset({
        ...defaultValue,
      });
      setEditorContent("");
    }
  }, [params?.id, editMode]);
  const desc = watch("description");
  return (
    <div className="w-full p-4 flex-col space-y-4 buser">
      {editMode !== "new" && (
        <Box className="w-full flex justify-center relative">
          <Button
            leftSection={
              isEditMode ? <IconEdit size={12} /> : <IconView360 size={12} />
            }
            variant="filled"
            radius="md"
            className="w-max ml-auto flex items-center gap-0.5 bg-primary-500 text-white"
            onClick={handleToggle}
          >
            {!isEditMode ? "Edit" : "View"}
          </Button>
        </Box>
      )}
      {isEditMode ? (
        <>
          <div className="">
            <LoadingOverlay
              visible={department?.isLoading || department?.isFetching}
              zIndex={1000}
              overlayProps={{ radius: "sm", blur: 2 }}
            />
            <form
              name="Department form"
              onSubmit={handleSubmit(onSubmit, onError)}
              autoComplete="off"
              className="w-full"
            >
              <div className="flex w-full">
                <div className="px-2 mt-4 flex-col space-y-4 w-full">
                  <div className="flex space-x-4 sm:flex-row mt-4">
                    <TextInput
                      label="Department Name"
                      className="w-full"
                      required
                      placeholder="Department Name"
                      {...register("name")}
                      error={errors?.name?.message}
                    />
                  </div>
                  <div className="flex space-x-4 sm:flex-row mt-4 w-full">
                    <Controller
                      name="description"
                      control={control}
                      render={({ field }) => (
                        <CustomRichTextEditor
                          label="Department description"
                          {...field}
                          value={desc}
                          onChange={(value) => {
                            setEditorContent(value);
                            field.onChange(value);
                          }}
                          placeholder="Write something..."
                          config={config}
                          error={errors.description?.message}
                        />
                      )}
                    />
                  </div>

                  <div className="w-full flex space-x-4  justify-end mt-4">
                    <Button
                      variant="default"
                      className="bg-none"
                      onClick={() =>
                        reset({
                          ...defaultValue,
                        })
                      }
                    >
                      Reset
                    </Button>
                    {editMode === "detail" && (
                      <div>
                        <Button
                          type="button"
                          variant="filled"
                          color="red"
                          className={`shadow-none bg-red-500 rounded flex items-center`}
                          onClick={() => {
                            setOpenDeleteModal(true);
                            setSelectedDepartment(department?.data);
                          }}
                          loading={
                            archiveResponse?.isLoading ||
                            restoreResponse?.isLoading
                          }
                          leftSection={
                            department?.data?.archivedAt ? (
                              <IconArrowBack size={15} />
                            ) : (
                              <IconTrash size={15} />
                            )
                          }
                        >
                          {department?.data?.archivedAt ? "Restore" : "Delete"}
                        </Button>
                      </div>
                    )}
                    <Button
                      variant="filled"
                      // className="shadow-none bg-primary-500 rounded flex items-center"
                      bg={"primary.4"}
                      type="submit"
                      loading={
                        editMode === "new"
                          ? createResponse?.isLoading
                          : updateResponse?.isLoading
                      }
                      leftSection={<IconDeviceFloppy />}
                    >
                      {editMode === "new" ? "Save" : "Update"}
                    </Button>
                  </div>
                </div>
              </div>
            </form>
          </div>
        </>
      ) : (
        <DetailsPage
          dataSource={[{ title: "Basic Information", source: data }]}
          profileData={profileData}
          config={deptConfig}
          description={department?.data?.description ?? ""}
          isLoading={false}
          hideEdit={true}
        />
        // <UserDetailComponent />
      )}
      <Modal
        opened={openDeleteModal}
        onClose={() => {
          setOpenDeleteModal(false);
        }}
        size={"40%"}
        title={"Delete Department"}
        centered
      >
        {/* Modal content */}
        <h2 className="">
          Are you sure You want to delete{" "}
          <span className="underline text-xl">{selectedDepartment?.name} </span>
        </h2>
        <div className="flex my-4">
          <Button
            variant="default"
            className="bg-none mx-2"
            onClick={() => {
              setOpenDeleteModal(false);
            }}
          >
            Cancel
          </Button>

          <Button
            type="button"
            variant="filled"
            color="red"
            className={`bg-red-500 text-white shadow-none rounded flex items-center  mx-2`}
            onClick={() => {
              handleDelete();
            }}
            loading={archiveResponse?.isLoading || deleteResponse?.isLoading}
            leftSection={
              selectedDepartment?.archivedAt ? (
                <IconArrowBack size={15} />
              ) : (
                <IconTrash size={15} />
              )
            }
          >
            {selectedDepartment?.archivedAt ? "Restore" : "Delete"}
          </Button>
        </div>
      </Modal>
    </div>
  );
}
