"use client";

import countryJson from "@/src/shared/constants/country-json.json";
import { CollectionQuery } from "@/src/shared/models/collection.model";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Box,
  Button,
  LoadingOverlay,
  Modal,
  Select,
  Switch,
  TextInput,
} from "@mantine/core";
import {
  IconArrowBack,
  IconDeviceFloppy,
  IconTrash,
} from "@tabler/icons-react";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm, SubmitErrorHandler, SubmitHandler } from "react-hook-form";
import z from "zod";
import {
  useCreateFeedbackMutation,
  useDeleteFeedbackMutation,
  useLazyGetFeedbackQuery,
  useUpdateFeedbackMutation,
} from "../_store/feed-back.query";
import { User } from "@/src/models/user.model";
import { notifications } from "@mantine/notifications";
import { Feedback } from "@/src/models/feed-back.model";
import { feedBackSchema } from "@/src/schemas/feed-back-schema";

interface Props {
  editMode: "new" | "detail" | "view";
  onClose: () => void;
  onCreating?: (data: boolean) => void;
  data?: Feedback;
}

type FormSchema = z.infer<typeof feedBackSchema>;

const defaultValue: Feedback = {
  name: "",
  subject: "",
  email: "",
  phone: "",
  message: "",
};

const countryCodes = countryJson
  .map((country) => ({
    value: country.dial_code,
    label: `${country.name} (${country.dial_code})`,
  }))
  .filter(
    (value, index, self) =>
      index === self.findIndex((t) => t.value === value.value)
  );
export default function FeedbackFormComponent(props: Props) {
  const { editMode, onCreating } = props;
  const params = useParams();
  const navigate = useRouter();

  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [selectedFeedback, setSelectedFeedback] = useState<Feedback>();

  const [createFeedback, createResponse] = useCreateFeedbackMutation();
  const [updateFeedback, updateResponse] = useUpdateFeedbackMutation();
  const [deleteFeedback, deleteResponse] = useDeleteFeedbackMutation();

  const [countryCode, setCountryCode] = useState<string>("+251");

  const [collection] = useState<CollectionQuery>({
    skip: 0,
    top: 50,
    orderBy: [{ field: "createdAt", direction: "desc" }],
  });

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    reset,
    setValue,
  } = useForm<FormSchema>({
    resolver: zodResolver(feedBackSchema),
    mode: "all",
  });

  useEffect(() => {
    if (editMode === "detail") {
      if (props?.data) {
        reset({
          ...props.data,
        });
      } else {
        reset(defaultValue);
      }
    }
  }, [params?.id, editMode]);

  const onSubmit: SubmitHandler<Feedback> = async (data) => {
    if (editMode === "new") {
      try {
        const response = await createFeedback({
          ...data,
        }).unwrap();

        if (response) {
          notifications.show({
            title: "Success",
            message: "Feed Back created successfully",
            color: "green",
          });
          props.onClose();
        }
      } catch (err) {
        notifications.show({
          title: "Error",
          message: "Sorry Not created successfully" + err,
          color: "red",
        });
      }
    } else {
      try {
        const response = await updateFeedback({
          ...data,
          id: `${props?.data?.id}`,
        });
        console.log("response", response);

        if (response) {
          notifications.show({
            title: "Success",
            message: "Feed Back Updated successfully",
            color: "green",
          });
          props.onClose();
        }
      } catch (err) {
        notifications.show({
          title: "Error",
          message: "Sorry Feed Back not updated successfully" + err,
          color: "red",
        });
      }
    }
  };

  const onError: SubmitErrorHandler<FormSchema> = (errors) => {
    console.log("Form Errors", errors);
  };

  return (
    <div className="w-full flex-col space-y-4 buser">
      {editMode !== "view" ? (
        <div className="w-full flex relative p-2">
          <form
            name="Feed Back form"
            onSubmit={handleSubmit(onSubmit, onError)}
            autoComplete="off"
            className="w-full"
          >
            <div className="flex w-full justify-center">
              <div className="w-full flex-col space-y-4">
                {/* Name Input */}
                <TextInput
                  label="Name"
                  required
                  placeholder="Name"
                  {...register("name")}
                  error={errors?.name?.message}
                />
                <TextInput
                  label="Subject"
                  required
                  placeholder="Subject"
                  {...register("subject")}
                  error={errors?.subject?.message}
                />

                <TextInput
                  label="Email"
                  type="email"
                  className="w-full"
                  placeholder="Tenant Email"
                  {...register("email")}
                  error={errors?.email?.message}
                />

                <div className="flex space-x-4">
                  <Select
                    label="Country Code"
                    className="w-1/4"
                    data={countryCodes}
                    value={countryCode}
                    onChange={(value) => setCountryCode(value ?? "+251")}
                    searchable
                  />
                  <TextInput
                    label="Phone Number"
                    className="w-3/4"
                    placeholder="Phone Number"
                    {...register("phone")}
                    error={errors?.phone?.message}
                  />
                </div>

                <TextInput
                  label="Message"
                  type="message"
                  className="w-full"
                  placeholder="Message"
                  {...register("message")}
                  error={errors?.message?.message}
                />

                {/* Action Buttons */}
                <div className="w-full flex space-x-4 justify-end mt-4">
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
                        setSelectedFeedback(props?.data);
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
            title={`Delete Feed Back?`}
          >
            <p className="text-sm">
              Are you sure you want to delete this Feed Back? This action cannot
              be undone.
            </p>
            <div className="flex space-x-4 justify-end mt-4">
              <Button
                variant="outline"
                onClick={() => setOpenDeleteModal(false)}
                color="gray"
              >
                Cancel
              </Button>
            </div>
          </Modal>
        </div>
      ) : (
        <Box className="w-full text-sm text-gray-900">
          <tr className="flex border-b border-gray-300 border-dashed">
            <td className="w-1/3 p-2 bg-gray-100 border-gray-300">{"Name"}</td>
            <td className="p-2">{props?.data?.name}</td>
          </tr>
          <tr className="flex border-b border-gray-300 border-dashed">
            <td className="w-1/3 p-2 bg-gray-100 border-gray-300">
              {"Subject"}
            </td>
            <td className="p-2">{props.data?.subject}</td>
          </tr>
          <tr className="flex border-b border-gray-300 border-dashed">
            <td className="w-1/3 p-2 bg-gray-100 border-gray-300">{"Email"}</td>
            <td className="p-2">{props.data?.email}</td>
          </tr>
          <tr className="flex border-b border-gray-300 border-dashed">
            <td className="w-1/3 p-2 bg-gray-100 border-gray-300">
              {"Phone Number"}
            </td>
            <td className="p-2">{props.data?.phone}</td>
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
