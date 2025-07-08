"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { Box, Button, Group, Textarea } from "@mantine/core";
import { IconArchive } from "@tabler/icons-react";
import { FieldErrors, SubmitHandler, useForm } from "react-hook-form";
import z from "zod";
import { useArchivePropertyMutation } from "../_store/property.query";
import { useArchiveRoomMutation } from "../_store/room.query";
import { notifications } from "@mantine/notifications";

interface Props {
  type?: "property";
  onClose: () => void;
  onCreating?: (data: boolean) => void;
  id?: string;
}

const reasonSchema = z.object({
  reason: z.string().optional(),
});

// Infer TypeScript type
type FormSchema = z.infer<typeof reasonSchema>;

// Default Values
const defaultValue: FormSchema = {
  reason: "",
};
export default function ReasonForm(props: Props) {
  const [archiveRoom, { isLoading: archivingRoom }] = useArchiveRoomMutation();
  const [archiveProperty, { isLoading: archivingProperty }] =
    useArchivePropertyMutation();
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormSchema>({
    resolver: zodResolver(reasonSchema),
    mode: "all",
  });

  const onSubmit: SubmitHandler<FormSchema> = async (data) => {
    try {
      const response =
        props?.type === "property"
          ? await archiveProperty({
              ...data,
              reason: data.reason || "",
              id: (props.id || "").toString(),
            }).unwrap()
          : await archiveRoom({
              ...data,
              remark: data.reason || "",
              id: props.id?.toString() || "",
            }).unwrap();
      if (response) {
        props.onClose();
        notifications.show({
          title: "Success",
          message: "Successfully archived",
          color: "green",
        });
      }
    } catch (err) {
      console.log(err);
    }
  };

  const onError = (error: FieldErrors) => {
    console.log("Error", error);
  };

  return (
    <Box
      className="w-full p-4 flex-col space-y-4 buser"
      onClick={(e) => e.stopPropagation()}
    >
      <form
        name="Room form"
        onSubmit={handleSubmit(onSubmit, onError)}
        autoComplete="off"
        className="w-full"
      >
        <Box className="flex w-full  justify-center">
          <Group mt="xl"></Group>
          <Box className="px-2 w-full mt-4 flex-col space-y-4">
            <Box>
              <Textarea
                required
                minRows={8}
                placeholder="Reason"
                {...register("reason")}
                error={errors?.reason?.message}
              />
            </Box>
            <Box className="w-full flex space-x-4  justify-end mt-4">
              <Button
                variant="default"
                className="bg-none"
                onClick={() => reset({ ...defaultValue })}
              >
                Reset
              </Button>
              <Button
                variant="filled"
                className="shadow-none bg-[#F59E0B] rounded flex items-center"
                bg={"primary.4"}
                type="submit"
                loading={
                  props.type === "property" ? archivingProperty : archivingRoom
                }
                leftSection={<IconArchive />}
              >
                {"Archive"}
              </Button>
            </Box>
          </Box>
        </Box>
      </form>
    </Box>
  );
}
