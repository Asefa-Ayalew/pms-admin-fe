"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { Box, Button, Group, Textarea } from "@mantine/core";
import { IconArchive } from "@tabler/icons-react";
import { FieldErrors, SubmitHandler, useForm } from "react-hook-form";
import z from "zod";
import { useArchiveBankAccountMutation } from "../_store/bank-account.query";
import { useArchiveEmergencyContactMutation } from "../_store/emergency-contact.query";
import { notifications } from "@mantine/notifications";
import { useArchiveUserMutation } from "../_store/user.query";

interface Props {
  type?: "user" | "bank-account" | "user-contact";
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
export default function ReasonFormComponent(props: Props) {
  const [archiveUser] = useArchiveUserMutation();
  const [archiveUserContact, { isLoading: archivingUserContact }] =
    useArchiveEmergencyContactMutation();
  const [archiveBankAccount, { isLoading: archivingBankAccount }] =
    useArchiveBankAccountMutation();
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
    console.log("Data from Delete ", data);
    try {
      const response =
        props.type === "user"
          ? await archiveUser({
              reason: String(data?.reason),
              id: String(props.id),
            }).unwrap()
          : props?.type === "bank-account"
            ? await archiveBankAccount({
                ...data,
                id: props.id?.toString(),
              }).unwrap()
            : await archiveUserContact({
                ...data,
                id: props.id?.toString(),
              }).unwrap();
      console.log(response, "response");
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
                  props.type === "bank-account"
                    ? archivingBankAccount
                    : archivingUserContact
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
