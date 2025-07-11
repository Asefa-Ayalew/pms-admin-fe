"use client";

import { MyOrganization } from "@/src/models/my-organization.model";
import { NewMyOrganizationSchema } from "@/src/schemas/new-my-organization-schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Button, Modal, LoadingOverlay, TextInput } from "@mantine/core";
import z from "zod";
import { IconArrowBack, IconDeviceFloppy, IconTrash } from "@tabler/icons-react";

import {
  useArchiveMyOrganizationMutation,
  useCreateMyOrganizationMutation,
  useDeleteMyOrganizationMutation,
  useLazyGetMyOrganizationQuery,
  useRestoreMyOrganizationMutation,
  useUpdateMyOrganizationMutation,
} from "../_store/my-organization.query";

interface Props {
  editMode: "new" | "detail";
  onCreating?: (data: any) => void;
  id?: string;
}



type FormSchema = z.infer<typeof NewMyOrganizationSchema>;

const defaultValue: MyOrganization = {
  name: "",
};

export default function NewMyOrganizationComponent(props: Props) {
  const { editMode, onCreating } = props;
  const params = useParams();
  const navigate = useRouter();
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [selectedMyOrganization, setSelectedMyOrganization] = useState<MyOrganization>();
  
  const [getMyOrganization, myOrganization] = useLazyGetMyOrganizationQuery();
  const [createMyOrganization, createResponse] = useCreateMyOrganizationMutation();
  const [updateMyOrganization, updateResponse] = useUpdateMyOrganizationMutation();
  const [_, archiveResponse] = useArchiveMyOrganizationMutation();
  const [restoreMyOrganization, restoreResponse] = useRestoreMyOrganizationMutation();
  const [deleteMyOrganization, deleteResponse] = useDeleteMyOrganizationMutation();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormSchema>({
    resolver: zodResolver(NewMyOrganizationSchema),
    mode: "all",
  });

  function onSubmit(data: MyOrganization) {
    if (editMode === "new") {
      createMyOrganization({
        ...data,
      }).then((response: any) => {
        if (response?.data) {
          onCreating?.(false);
          if (!onCreating) {
            navigate.push(`/my-organizations/detail/${response?.data?.id}`);
          }
        }
      });
    } else {
        const updatedData = {
            ...data,
            id: `${params?.id}`,
        };

      updateMyOrganization(updatedData).then(async (response: any) => {
        if (response?.data) {
            // do some logics here
          navigate.push(`/my-organizations/detail/${response?.data?.id}`);
        }
      });
    }
  }

  function handleDelete() {
    selectedMyOrganization?.archivedAt
      ? restoreMyOrganization({ id: `${selectedMyOrganization?.id}` }).then((response: any) => {
        if (response?.data) {
          setOpenDeleteModal(false);
        }
      })
      : deleteMyOrganization(`${selectedMyOrganization?.id}`)
        .then((response: any) => {
          if (response?.data) {
            setOpenDeleteModal(false);
          }
        })
        .finally(() => {
          setOpenDeleteModal(false);
          navigate.push(`/my-organization`);
        });
  }

  const onError = (error: any) => {
    console.log("Error", error);
  };

  useEffect(() => {
    if (editMode === "detail") {
      getMyOrganization({
        id: `${params?.id}`,
      }).then((response: any) => {
        if (response?.data) {
          reset({
            ...response?.data,
          });
        }
      });
    } else {
      reset({
        ...defaultValue,
      });
    }
  }, [params?.id, editMode]);

  return (
    <div className="w-full p-4 flex-col space-y-4 buser">
      <div className="flex items-center justify-center">
        <h3 className="text-2xl font-semibold">
          {editMode === "new"
            ? "New MyOrganization" : ""}
        </h3>
      </div>
    <div className="w-full flex justify-center relative">
        <LoadingOverlay
          visible={
            myOrganization?.isLoading ||
            myOrganization?.isFetching 
          }
          zIndex={1000}
          overlayProps={ { radius: "sm", blur: 2 } }
        />
        <form
          name="MyOrganization form"
          onSubmit={handleSubmit(onSubmit, onError)}
          autoComplete="off"
          className="w-full"
        >
          <div className="flex w-full  justify-center">
            <div className="px-2 w-3/4 mt-4 flex-col space-y-4">
              <div className="lg:flex lg:space-x-4 sm:flex-row mt-4">
                <TextInput
                  label="MyOrganization Name"
                  className="w-full"
                  required
                  placeholder="MyOrganization Name"
                  {...register("name")}
                  error={errors?.name?.message}
                />
              </div>
              

              <div className="w-full flex space-x-4  justify-end mt-4">
                <Button
                  variant="default"
                  className="bg-none"
                  onClick={() =>
                    reset({
                      ...defaultValue
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
                        setSelectedMyOrganization(myOrganization?.data);
                      } }
                      loading={
                        archiveResponse?.isLoading || restoreResponse?.isLoading
                      }
                      leftSection={
                        myOrganization?.data?.archivedAt ? (
                          <IconArrowBack size={15} />
                        ) : (
                          <IconTrash size={15} />
                        )
                      }
                    >
                      { myOrganization?.data?.archivedAt ? "Restore" : "Delete" }
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
      <Modal
        opened={openDeleteModal}
        onClose={() => {
          setOpenDeleteModal(false);
        } }
        size={"40%"}
        title={"Delete MyOrganization"}
        centered
      >
        {/* Modal content */}
        <h2 className="">
          Are you sure You want to delete{" "}
          <span className="underline text-xl">{selectedMyOrganization?.name} </span>
        </h2>
        <div className="flex my-4">
          <Button
            variant="default"
            className="bg-none mx-2"
            onClick={() => {
              setOpenDeleteModal(false);
            } }
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
            } }
            loading={archiveResponse?.isLoading || deleteResponse?.isLoading}
            leftSection={
              selectedMyOrganization?.archivedAt ? (
                <IconArrowBack size={15} />
              ) : (
                <IconTrash size={15} />
              )
            }
          >
            {selectedMyOrganization?.archivedAt ? "Restore" : "Delete"}
          </Button>
        </div>
      </Modal>
    </div>
  );
}
