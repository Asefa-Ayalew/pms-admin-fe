"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Box, Button, Modal, NumberInput, TextInput } from "@mantine/core";
import {
  IconArrowBack,
  IconDeviceFloppy,
  IconTrash,
} from "@tabler/icons-react";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  useForm,
  SubmitErrorHandler,
  SubmitHandler,
  Controller,
} from "react-hook-form";
import { notifications } from "@mantine/notifications";
import { Testimonial } from "@/src/models/testimonial.model";
import {
  testimonialDefaultValue,
  testimonialFormSchema,
} from "@/src/schemas/testimonial-schema";
import {
  useCreateTestimonialMutation,
  useDeleteTestimonialMutation,
  useUpdateTestimonialMutation,
} from "../_store/testimonial.query";
interface Props {
  editMode: "new" | "detail" | "view";
  onClose: () => void;
  onCreating?: (data: boolean) => void;
  data?: Testimonial;
}
export default function TestimonialForm(props: Props) {
  const { editMode } = props;
  const params = useParams();
  const navigate = useRouter();

  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [selectedTestimonial, setSelectedTestimonial] = useState<Testimonial>();

  const [createTestimonial, createResponse] = useCreateTestimonialMutation();
  const [updateTestimonial, updateResponse] = useUpdateTestimonialMutation();
  const [deleteTestimonial, deleteResponse] = useDeleteTestimonialMutation();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    control,
  } = useForm<testimonialFormSchema>({
    resolver: zodResolver(testimonialFormSchema),
    mode: "all",
  });

  useEffect(() => {
    if (editMode === "detail") {
      if (props?.data) {
        reset({
          ...props.data,
        });
      } else {
        reset(testimonialDefaultValue);
      }
    }
  }, [props.data, reset, params?.id, editMode]);

  const onSubmit: SubmitHandler<Testimonial> = async (data) => {
    console.log("data", data);

    if (editMode === "new") {
      try {
        const response = await createTestimonial({
          ...data,
        }).unwrap();

        if (response) {
          props.onClose();
        }
      } catch (err) {
        console.log(err);
      }
    } else {
      try {
        const response = await updateTestimonial({
          ...data,
          id: `${props?.data?.id}`,
        });
        console.log("response", response);

        if (response) {
          props.onClose();
        }
      } catch (err) {
        console.log(err);
      }
    }
  };

  // Delete Testimonial handler
  function handleDeleteTestimonial() {
    if (!selectedTestimonial?.id) return;

    deleteTestimonial(`${params?.id}`).then((response) => {
      if (response?.data) {
        setOpenDeleteModal(false);
        navigate.push("/testimonials");
      }
    });
  }

  const onError: SubmitErrorHandler<testimonialFormSchema> = (errors) => {
    console.log("Form Errors", errors);
  };

  return (
    <div className="w-full flex-col space-y-4 buser">
      {editMode !== "view" ? (
        <div className="w-full flex relative p-2">
          <form
            name="Testimonial form"
            onSubmit={handleSubmit(onSubmit, onError)}
            autoComplete="off"
            className="w-full"
          >
            <div className="flex w-full justify-center">
              <div className="w-full flex-col space-y-4">
                {/* Name Input */}
                <TextInput
                  label="Customer Name"
                  required
                  placeholder="Customer Name"
                  {...register("customerName")}
                  error={errors?.customerName?.message}
                />
                <TextInput
                  label="Customer Position"
                  required
                  placeholder="Customer Position"
                  {...register("customerPosition")}
                  error={errors?.customerPosition?.message}
                />

                <TextInput
                  label="Message"
                  type="text"
                  className="w-full"
                  placeholder="Tenant Message"
                  {...register("message")}
                  error={errors?.message?.message}
                />

                <Controller
                  name="rating"
                  control={control}
                  render={({ field: { name, value, onChange } }) => (
                    <NumberInput
                      name={name}
                      label="Rating"
                      placeholder="Rating"
                      value={value}
                      onChange={onChange}
                      error={errors?.rating?.message}
                      allowNegative={false}
                      withAsterisk
                    />
                  )}
                />

                {/* Action Buttons */}
                <div className="w-full flex space-x-4 justify-end mt-4">
                  <Button
                    variant="default"
                    className="bg-none"
                    onClick={() =>
                      reset({
                        ...testimonialDefaultValue,
                      })
                    }
                  >
                    Reset
                  </Button>

                  <Button
                    variant="filled"
                    bg={"primary.4"}
                    type="submit"
                    loading={
                      editMode === "new"
                        ? createResponse?.isLoading
                        : updateResponse?.isLoading
                    }
                    leftSection={<IconDeviceFloppy size={15} />}
                  >
                    {editMode === "new" ? "Save" : "Update"}
                  </Button>

                  {editMode === "detail" && (
                    <Button
                      type="button"
                      variant="filled"
                      color="red"
                      className="shadow-none bg-red-500 rounded flex items-center"
                      onClick={() => {
                        setOpenDeleteModal(true);
                        setSelectedTestimonial(props?.data);
                      }}
                      leftSection={
                        props?.data?.archivedAt ? (
                          <IconArrowBack size={15} />
                        ) : (
                          <IconTrash size={15} />
                        )
                      }
                    >
                      {props?.data?.archivedAt ? "Restore" : "Delete"}
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </form>

          <Modal
            opened={openDeleteModal}
            onClose={() => setOpenDeleteModal(false)}
            title={`Delete Testimonial?`}
          >
            <p className="text-sm">
              Are you sure you want to delete this Testimonial? This action
              cannot be undone.
            </p>
            <div className="flex space-x-4 justify-end mt-4">
              <Button
                variant="outline"
                onClick={() => setOpenDeleteModal(false)}
                color="gray"
              >
                Cancel
              </Button>
              <Button
                variant="filled"
                color="red"
                onClick={handleDeleteTestimonial}
                loading={deleteResponse?.isLoading}
              >
                Delete
              </Button>
            </div>
          </Modal>
        </div>
      ) : (
        <Box className="w-full text-sm text-gray-900">
          <tr className="flex border-b border-gray-300 border-dashed">
            <td className="w-1/3 p-2 bg-gray-100 border-gray-300">
              {"Customer Name"}
            </td>
            <td className="p-2">{props?.data?.customerName}</td>
          </tr>
          <tr className="flex border-b border-gray-300 border-dashed">
            <td className="w-1/3 p-2 bg-gray-100 border-gray-300">
              {"Customer Position"}
            </td>
            <td className="p-2">{props.data?.customerPosition}</td>
          </tr>
          <tr className="flex border-b border-gray-300 border-dashed">
            <td className="w-1/3 p-2 bg-gray-100 border-gray-300">
              {"Message"}
            </td>
            <td className="p-2">{props.data?.message}</td>
          </tr>
          <tr className="flex border-b border-gray-300 border-dashed">
            <td className="w-1/3 p-2 bg-gray-100 border-gray-300">
              {"Rating"}
            </td>
            <td className="p-2">{props.data?.rating}</td>
          </tr>
          <tr className="flex border-b border-gray-300 border-dashed">
            <td className="w-1/3 p-2 bg-gray-100 border-gray-300">
              {"Message"}
            </td>
            <td className="p-2">{props.data?.message}</td>
          </tr>
          <Box className="w-full flex space-x-4  justify-end mt-4">
            <Button
              variant="filled"
              bg={"primary.4"}
              type="button"
              onClick={() => props.onClose()}
            >
              Close
            </Button>
          </Box>
        </Box>
      )}
    </div>
  );
}
