"use client";

import { Department } from "@/src/models/department.model";
import { NewDepartmentSchema } from "@/src/schemas/new-department-schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Box, Button, LoadingOverlay, TextInput } from "@mantine/core";
import { IconDeviceFloppy } from "@tabler/icons-react";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Controller, useForm, FieldErrors } from "react-hook-form";
import z from "zod";

import { CustomRichTextEditorType } from "@/src/models/rich-text-editor.model";
import CustomRichTextEditor from "@/src/shared/component/rich-text-editor/rich-text-editor";
import {
  useCreateDepartmentMutation,
  useLazyGetDepartmentQuery,
  useUpdateDepartmentMutation,
} from "../_store/department.query";
interface Props {
  editMode: "new" | "detail" | "view";
  onClose: () => void;
  data?: Department;
}

type FormSchema = z.infer<typeof NewDepartmentSchema>;

const defaultValue: Department = {
  name: "",
  description: "",
};

export default function DepartmentForm(props: Props) {
  const { editMode } = props;
  const params = useParams();

  const [getDepartment, department] = useLazyGetDepartmentQuery();
  const [createDepartment, createResponse] = useCreateDepartmentMutation();
  const [updateDepartment, updateResponse] = useUpdateDepartmentMutation();
  const [editorContent, setEditorContent] = useState("");
  console.log(editorContent)

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
    console.log("params", params);
    if (editMode === "new") {
      console.log("Data", data);
      createDepartment({
        ...data,
      }).then(async (response) => {
        if (response?.data) {
          props.onClose();
        }
      });
    } else {
      const updatedData = {
        ...data,
        id: `${props.data?.id}`,
      };

      updateDepartment(updatedData).then(async (response) => {
        if (response?.data) {
          props.onClose();
        }
      });
    }
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

  useEffect(() => {
    if (editMode === "detail") {
      getDepartment({
        id: `${params?.id}`,
      });
    }
  }, [getDepartment, params?.id, editMode]);

  useEffect(() => {
    if (props.data) {
      reset({ ...props.data });
    } else {
      reset({ ...defaultValue });
    }
  }, [props.data, reset]);

  const desc = watch("description");
  return (
    <div className="w-full flex-col space-y-4 buser">
      {editMode !== "view" ? (
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
              <div className="flex w-full justify-center">
                <div className=" px-2 mt-4 flex-col space-y-4">
                  <div className="lg:flex lg:space-x-4 sm:flex-row mt-4">
                    <TextInput
                      label="Department Name"
                      className="w-full"
                      required
                      placeholder="Department Name"
                      {...register("name")}
                      error={errors?.name?.message}
                    />
                  </div>
                  <div className="lg:flex lg:space-x-4 sm:flex-row mt-4">
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
                    <Button
                      variant="filled"
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
        <Box className="w-full text-sm text-gray-900">
          <tr className="flex border-b border-gray-300 border-dashed">
            <td className="w-1/3 p-2 bg-gray-100 border-gray-300">{"Name"}</td>
            <td className="p-2">{props?.data?.name}</td>
          </tr>
          <tr className="flex border-b border-gray-300 border-dashed">
            <td className="w-1/3 p-2 bg-gray-100 border-gray-300">
              {"Description"}
            </td>
            <td>
              <div
                dangerouslySetInnerHTML={{
                  __html: props?.data?.description ?? "",
                }}
              />
            </td>
          </tr>
          <tr className="flex border-b border-gray-300 border-dashed">
            <td className="w-1/3 p-2 bg-gray-100 border-gray-300">{"Code"}</td>
            <td className="p-2">{props.data?.code}</td>
          </tr>
          <tr className="flex border-b border-gray-300 border-dashed">
            <td className="w-1/3 p-2 bg-gray-100 border-gray-300">
              {"Tenant"}
            </td>
            <td className="p-2">{props.data?.tenant?.name}</td>
          </tr>

          <Box className="flex justify-end mt-2">
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
