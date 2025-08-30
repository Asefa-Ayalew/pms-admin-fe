"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { Box, Button, Group, Textarea } from "@mantine/core";
import { IconArchive } from "@tabler/icons-react";
import { FieldErrors, SubmitHandler, useForm } from "react-hook-form";
import z from "zod";
import { notifications } from "@mantine/notifications";
import { useArchiveFAQMutation } from "../_store/faq.query";

interface Props {
  type?: "tenant";
  onClose: () => void;
  onCreating?: (data: boolean) => void;
  id?: string;
}

const reasonSchema = z.object({
  reason: z.string().optional(),
});

type FormSchema = z.infer<typeof reasonSchema>;

const defaultValue: FormSchema = {
  reason: "",
};
export default function ReasonForm(props: Props) {
  const [archiveFAQ, { isLoading: archivingFAQ }] =
    useArchiveFAQMutation();
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
      const response = await archiveFAQ({
        ...data,
        remark: data.reason || "",
        id: (props.id || "").toString(),
      }).unwrap();
      if (response) {
        props.onClose();
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
                loading={archivingFAQ}
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
