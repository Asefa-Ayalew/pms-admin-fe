"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import {
  Box,
  Button,
  TextInput,
} from "@mantine/core";
import {
  IconDeviceFloppy,
} from "@tabler/icons-react";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Controller, FieldErrors, SubmitHandler, useForm } from "react-hook-form";

import { AppError } from "@/src/models/app-interfaces";
import { notifications } from "@mantine/notifications";
import { useCreateFAQMutation, useUpdateFAQMutation } from "../_store/faq.query";
import { faqDefaultValue, faqFormSchema, faqSchema } from "@/src/schemas/faq-schema";
import { FAQ } from "@/src/models/faq.model";
import CustomRichTextEditor from "@/src/shared/component/rich-text-editor/rich-text-editor";
import { CustomRichTextEditorType } from "@/src/models/rich-text-editor.model";

interface Props {
  editMode: "new" | "detail" | "view";
  onClose: () => void;
  onCreating?: (data: boolean) => void;
  data?: FAQ;
}


export default function FAQForm(props: Props) {
  const { editMode } = props;
  const params = useParams();

  const [createFAQ, { isLoading: creating }] = useCreateFAQMutation();
  const [updateFAQ, { isLoading: updating }] = useUpdateFAQMutation();
  const [editorContent, setEditorContent] = useState("");
  console.log(editorContent)


  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
    control
  } = useForm<faqFormSchema>({
    resolver: zodResolver(faqSchema),
    mode: "all",
  });

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

  const onSubmit: SubmitHandler<FAQ> = async (data) => {
    const requestData = {
      ...data,
    };
    if (editMode === "new") {
      try {
        const response = await createFAQ(requestData).unwrap();
        if (response) {
          props.onClose();
        }
      } catch (err) {
        notifications.show({
          title: "Error",
          message:
            (err as AppError)?.error?.data?.message || "Error, try again",
          color: "red",
        });
      }
    } else {
      try {
        const response = await updateFAQ({
          ...requestData,
          id: `${props.data?.id}`,
        }).unwrap();
        if (response) {
          props.onClose();
        }
      } catch (error) {
        console.log(error);
      }
    }
  };
  const onError = (error: FieldErrors) => {
    console.log("Error", error);
  };


  useEffect(() => {
    if (props.data) {
      reset(props.data)
    } else {
      reset(faqDefaultValue);
    }
  }, [reset, params?.id, props.data]);
 const ans = watch('answer');
  return (
    <>
      {props?.editMode !== "view" ? (
        <div className="w-full p-4 flex-col space-y-4">
          <div className="w-full flex justify-center relative">
            <form
              name="Tenant form"
              onSubmit={handleSubmit(onSubmit, onError)}
              autoComplete="off"
              className="w-full"
            >
              <div className="flex w-full justify-center">
                <div className="px-2 w-full flex-col space-y-4">
                  <TextInput
                    label="Question"
                    className="w-full"
                    placeholder="Trade Name"
                    {...register("question")}
                    error={errors?.question?.message}
                  />

                  <div className="lg:flex lg:space-x-4 sm:flex-row mt-4">
                    <Controller
                      name="answer"
                      control={control}
                      render={({ field }) => (
                        <CustomRichTextEditor
                          label="Answer"
                          {...field}
                          value={ans}
                          onChange={(value) => {
                            setEditorContent(value);
                            field.onChange(value);
                          }}
                          placeholder="Write something..."
                          config={config}
                          error={errors.answer?.message}
                        />
                      )}
                    />
                  </div>

                  <div className="w-full flex space-x-4 justify-end mt-4">
                    <Button
                      variant="default"
                      onClick={() => reset(faqDefaultValue)}
                    >
                      Reset
                    </Button>
                    <Button
                      variant="filled"
                      type="submit"
                      loading={
                        editMode === "new"
                          ? creating
                          : updating
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
        </div>
      ) : (
        <Box className="w-full text-sm text-gray-900">
          <tr className="flex border-b border-gray-300 border-dashed">
            <td className="w-1/3 p-2 bg-gray-100 border-gray-300">
              {"Question"}
            </td>
            <td className="p-2">{props.data?.question}</td>
          </tr>
          <tr className="flex border-b border-gray-300 border-dashed">
            <td className="w-1/3 p-2 bg-gray-100 border-gray-300">
              {"Answer"}
            </td>
            <td className="p-2">{props.data?.answer}</td>
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
    </>
  );
}
