"use client";
import { Room } from "@/src/models/room.model";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Box,
  Button,
  Flex,
  Group,
  NumberInput,
  TagsInput,
  Textarea,
  TextInput,
} from "@mantine/core";
import { IconDeviceFloppy } from "@tabler/icons-react";
import { useParams } from "next/navigation";
import { useEffect } from "react";
import {
  Controller,
  FieldErrors,
  SubmitHandler,
  useForm,
} from "react-hook-form";
import z from "zod";
import {
  useCreateRoomMutation,
  useLazyGetRoomQuery,
  useUpdateRoomMutation,
} from "../_store/room.query";

interface Props {
  editMode: "new" | "detail" | "view";
  onClose: () => void;
  onCreating?: (data: boolean) => void;
  data?: Room;
}

const roomSchema = z.object({
  description: z.string().optional(),
  roomNumber: z.string(),
  floorNumber: z.string(),
  type: z.string(),
  size: z.number(),
  amenities: z.array(z.string()).optional(),
});

// Infer TypeScript type
type FormSchema = z.infer<typeof roomSchema>;

// Default Values
const defaultValue: FormSchema = {
  description: "",
  floorNumber: "",
  roomNumber: "",
  type: "",
  size: 1,
  amenities: [],
};

export default function RoomForm(props: Props) {
  const { editMode } = props;
  const params = useParams();

  const [getRoom, room] = useLazyGetRoomQuery();
  const [createRoom, { isLoading: creating }] = useCreateRoomMutation();
  const [updateRoom, { isLoading: updating }] = useUpdateRoomMutation();
  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
  } = useForm<FormSchema>({
    resolver: zodResolver(roomSchema),
    mode: "all",
  });

  const onSubmit: SubmitHandler<Room> = async (data) => {
    if (editMode === "new") {
      try {
        const response = await createRoom({
          ...data,
          propertyId: String(params.id),
        }).unwrap();
        if (response) {
          props.onClose();
        }
      } catch (err) {
        console.log(err);
      }
    } else {
      try {
        const response = await updateRoom({
          ...data,
          id: `${params?.id}`,
        });
        if (response) {
          props.onClose();
        }
      } catch (err) {
        console.log(err);
      }
    }
  };

  const onError = (error: FieldErrors) => {
    console.log("Error", error);
  };

  useEffect(() => {
    if (editMode === "detail") {
      if (room?.data) {
        reset({ ...room.data });
      } else if (props.data) {
        reset({ ...props.data });
      } else {
        reset({ ...defaultValue });
      }
    }
  }, [props.data, room, editMode, reset, getRoom]);

  return (
    <Box>
      {props?.editMode !== "view" ? (
        <Box className="w-full p-4 flex-col space-y-4 buser">
          <form
            name="Room form"
            onSubmit={handleSubmit(onSubmit, onError)}
            autoComplete="off"
            className="w-full"
          >
            <Box className="flex w-full  justify-center">
              <Group mt="xl"></Group>
              <Box className="px-2 w-full mt-4 flex-col space-y-4">
                <Flex gap={8}>
                  <TextInput
                    label="Floor Number"
                    className="w-full"
                    required
                    placeholder="Floor Number"
                    {...register("floorNumber")}
                    error={errors?.floorNumber?.message}
                  />
                  <TextInput
                    label="Room Number"
                    className="w-full"
                    required
                    placeholder="Room Number"
                    {...register("roomNumber")}
                    error={errors?.roomNumber?.message}
                  />
                </Flex>
                <Flex gap={8}>
                  <Controller
                    name="size"
                    control={control}
                    render={({ field: { name, value, onChange } }) => (
                      <NumberInput
                        className="w-1/2"
                        name={name}
                        label="Size"
                        placeholder="Size"
                        value={value}
                        onChange={onChange}
                        error={errors?.size?.message}
                        allowNegative={false}
                        withAsterisk
                      />
                    )}
                  />
                  <TextInput
                    label="Type"
                    className="w-1/2"
                    required
                    placeholder="Type"
                    {...register("type")}
                    error={errors?.type?.message}
                  />
                </Flex>
                <Flex gap={8}>
                  <Textarea
                    label="Description"
                    className="w-1/2"
                    required
                    minRows={6}
                    placeholder="Description"
                    {...register("description")}
                    error={errors?.description?.message}
                  />
                  <TagsInput
                    label="Amenities"
                    className="w-1/2"
                    required
                    clearable
                    data={[]} // Provide predefined options if needed
                    placeholder="Add amenities"
                    {...register("amenities", { setValueAs: (v) => v || [] })}
                    value={watch("amenities")}
                    error={errors?.amenities?.message}
                    onChange={(values) => setValue("amenities", values)}
                  />
                </Flex>
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
                    // className="shadow-none bg-primary-500 rounded flex items-center"
                    bg={"primary.4"}
                    type="submit"
                    loading={editMode === "new" ? creating : updating}
                    leftSection={<IconDeviceFloppy />}
                  >
                    {editMode === "new" ? "Save" : "Update"}
                  </Button>
                </Box>
              </Box>
            </Box>
          </form>
        </Box>
      ) : (
        <Box className="w-full text-sm text-gray-900">
          <tr className="flex border-b border-gray-300 border-dashed">
            <td className="w-1/3 p-2 bg-gray-100 border-gray-300">
              {"Description"}
            </td>
            <td className="p-2">{props?.data?.description}</td>
          </tr>
          <tr className="flex border-b border-gray-300 border-dashed">
            <td className="w-1/3 p-2 bg-gray-100 border-gray-300">
              {"Floor Number"}
            </td>
            <td className="p-2">{props.data?.floorNumber}</td>
          </tr>
          <tr className="flex border-b border-gray-300 border-dashed">
            <td className="w-1/3 p-2 bg-gray-100 border-gray-300">
              {"Room Number"}
            </td>
            <td className="p-2">{props.data?.roomNumber}</td>
          </tr>
          <tr className="flex border-b border-gray-300 border-dashed">
            <td className="w-1/3 p-2 bg-gray-100 border-gray-300">
              {"Size"}
            </td>
            <td className="p-2">{props.data?.size}</td>
          </tr>
          <tr className="flex border-b border-gray-300 border-dashed">
            <td className="w-1/3 p-2 bg-gray-100 border-gray-300">
              {"Type"}
            </td>
            <td className="p-2">{props.data?.type}</td>
          </tr>
        </Box>
      )}
    </Box>
  );
}
