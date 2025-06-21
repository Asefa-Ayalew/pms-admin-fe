"use client";

import { Tenant } from "@/src/models/tenant.model";
import { NewTenantSchema } from "@/src/schemas/new-tenant-schema";
import countryJson from "@/src/shared/constants/country-json.json";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Box,
  Button,
  LoadingOverlay,
  Modal,
  Select,
  TextInput,
} from "@mantine/core";
import {
  IconArrowBack,
  IconDeviceFloppy,
  IconPlus,
  IconTrash,
} from "@tabler/icons-react";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { FieldErrors, SubmitHandler, useForm } from "react-hook-form";
import z from "zod";
import {
  useArchiveTenantMutation,
  useCreateTenantMutation,
  useLazyGetTenantQuery,
  useRestoreTenantMutation,
  useUpdateTenantMutation,
} from "../_store/tenant.query";
import { formatDate } from "@/src/shared/utils/date-utils";
import { AppError } from "@/src/models/app-interfaces";
import { notifications } from "@mantine/notifications";

interface Props {
  editMode: "new" | "detail" | "view";
  onClose: () => void;
  onCreating?: (data: boolean) => void;
  data?: Tenant;
}

type FormSchema = z.infer<typeof NewTenantSchema>;

const defaultValue: Tenant = {
  name: "",
  tradeName: "",
  tin: "",
  phoneNumber: "",
  email: "",
  shortCode: "",
  industry: "",
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

export default function TenantForm(props: Props) {
  const { editMode, onCreating } = props;
  const params = useParams();
  const navigate = useRouter();

  const [selectedTenant, setSelectedTenant] = useState<Tenant>();
  const [countryCode, setCountryCode] = useState<string>("+251");

  const [getTenant, tenant] = useLazyGetTenantQuery();
  const [createTenant, createResponse] = useCreateTenantMutation();
  const [updateTenant, updateResponse] = useUpdateTenantMutation();
  const [archiveTenant, archiveResponse] = useArchiveTenantMutation();
  const [restoreTenant, restoreResponse] = useRestoreTenantMutation();
  const [secondaryPhoneNumbers, setSecondaryPhoneNumbers] = useState<string[]>(
    []
  );
  const [secondaryEmails, setSecondaryEmails] = useState<string[]>([]);

  console.log(restoreTenant, archiveTenant);
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormSchema>({
    resolver: zodResolver(NewTenantSchema),
    mode: "all",
  });

  const onSubmit: SubmitHandler<Tenant> = async (data) => {
    const requestData = {
      ...data,
      phoneNumber: `${data.phoneNumber}`,
      secondaryPhoneNumbers: secondaryPhoneNumbers.filter(
        (phone) => phone.trim() !== ""
      ),
      secondaryEmails: secondaryEmails.filter((email) => email.trim() !== ""),
    };
    if (editMode === "new") {
      try {
        const response = await createTenant(requestData).unwrap();
        if (response) {
          onCreating?.(false);
          navigate.push(`/tenants/detail/${response?.id}`);
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
        const response = await updateTenant({
          ...requestData,
          id: `${params?.id}`,
        }).unwrap();
        if (response) {
          navigate.push(`/tenants/detail/${response?.id}`);
        }
      } catch (error) {
        console.log(error);
      }
    }
  };
  const onError = (error: FieldErrors) => {
    console.log("Error", error);
  };
  const addSecondaryPhoneNumber = () => {
    setSecondaryPhoneNumbers([...secondaryPhoneNumbers, ""]);
  };

  const removeSecondaryPhoneNumber = (index: number) => {
    const newSecondaryPhoneNumbers = [...secondaryPhoneNumbers];
    newSecondaryPhoneNumbers.splice(index, 1);
    setSecondaryPhoneNumbers(newSecondaryPhoneNumbers);
  };

  const addSecondaryEmail = () => {
    setSecondaryEmails([...secondaryEmails, ""]);
  };

  const removeSecondaryEmail = (index: number) => {
    const newSecondaryEmails = [...secondaryEmails];
    newSecondaryEmails.splice(index, 1);
    setSecondaryEmails(newSecondaryEmails);
  };

  const handleSecondaryPhoneNumberChange = (index: number, value: string) => {
    const newSecondaryPhoneNumbers = [...secondaryPhoneNumbers];
    newSecondaryPhoneNumbers[index] = value;
    setSecondaryPhoneNumbers(newSecondaryPhoneNumbers);
  };

  const handleSecondaryEmailChange = (index: number, value: string) => {
    const newSecondaryEmails = [...secondaryEmails];
    newSecondaryEmails[index] = value;
    setSecondaryEmails(newSecondaryEmails);
  };
  useEffect(() => {
    if (editMode === "detail") {
      if (tenant?.data) {
        reset({
          ...tenant.data,
          secondaryPhoneNumbers: tenant.data.secondaryPhoneNumbers || [],
          secondaryEmails: tenant.data.secondaryEmails || [],
        });
        setSecondaryPhoneNumbers(tenant.data.secondaryPhoneNumbers || []);
        setSecondaryEmails(tenant.data.secondaryEmails || []);
      } else if (props.data) {
        reset({ ...props.data });
      }
    } else {
      reset(defaultValue);
    }
  }, [params?.id, editMode]);

  console.log("editMode", editMode);
  return (
    <>
      {editMode !== "view" ? (
        <div className="w-full p-4 flex-col space-y-4">
          <div className="w-full flex justify-center relative">
            <LoadingOverlay
              visible={tenant?.isLoading || tenant?.isFetching}
              zIndex={1000}
              overlayProps={{ radius: "sm", blur: 2 }}
            />
            <form
              name="Tenant form"
              onSubmit={handleSubmit(onSubmit, onError)}
              autoComplete="off"
              className="w-full"
            >
              <div className="flex w-full justify-center">
                <div className="px-2 w-full flex-col space-y-4">
                  <TextInput
                    label="Tenant Name"
                    className="w-full"
                    placeholder="Tenant Name"
                    {...register("name")}
                    error={errors?.name?.message}
                  />

                  {/* Trade Name */}
                  <TextInput
                    label="Trade Name"
                    className="w-full"
                    placeholder="Trade Name"
                    {...register("tradeName")}
                    error={errors?.tradeName?.message}
                  />

                  {/* TIN (Taxpayer Identification Number) */}
                  <TextInput
                    label="TIN"
                    className="w-full"
                    placeholder="Taxpayer Identification Number"
                    {...register("tin")}
                    error={errors?.tin?.message}
                  />

                  {/* Email */}
                  <div className="flex space-x-4">
                    <TextInput
                      label="Email"
                      type="email"
                      className="w-full"
                      placeholder="Tenant Email"
                      {...register("email")}
                      error={errors?.email?.message}
                    />
                    <Button className="mt-7" onClick={addSecondaryEmail}>
                      <IconPlus size={20} />
                    </Button>
                  </div>
                  {secondaryEmails.map((email, index) => (
                    <div key={index} className="flex space-x-4 items-center">
                      <TextInput
                        label="Secondary Email Address"
                        className="w-full"
                        placeholder="Secondary Email Address"
                        {...register(`secondaryEmails.${index}`)}
                        error={errors?.secondaryEmails?.[index]?.message}
                        onChange={(event) =>
                          handleSecondaryEmailChange(
                            index,
                            event.currentTarget.value
                          )
                        }
                      />
                      <Button
                        variant="subtle"
                        color="red"
                        className="mt-4 text-red-600"
                        onClick={() => removeSecondaryEmail(index)}
                      >
                        <IconTrash size={20} />
                      </Button>
                    </div>
                  ))}

                  {/* Phone Number with Country Code */}
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
                      {...register("phoneNumber")}
                      error={errors?.phoneNumber?.message}
                    />
                    <Button className="mt-7" onClick={addSecondaryPhoneNumber}>
                      <IconPlus size={20} />
                    </Button>
                  </div>
                  <TextInput
                    label="Short Code"
                    className="w-full"
                    placeholder="Short Code"
                    {...register("shortCode")}
                    error={errors?.shortCode?.message}
                  />
                  {secondaryPhoneNumbers.map((phoneNumber, index) => (
                    <div key={index} className="flex space-x-4 items-center">
                      <Select
                        label="Country Code"
                        className="w-1/4"
                        data={countryCodes}
                        value={countryCode}
                        onChange={(value) => setCountryCode(value ?? "+251")}
                        searchable
                      />
                      <TextInput
                        label="Secondary Phone Number"
                        className="w-3/4"
                        placeholder="Secondary Phone Number"
                        {...register(`secondaryPhoneNumbers.${index}`)}
                        error={errors?.secondaryPhoneNumbers?.[index]?.message}
                        onChange={(event) =>
                          handleSecondaryPhoneNumberChange(
                            index,
                            event.currentTarget.value
                          )
                        }
                      />
                      <Button
                        variant="subtle"
                        color="red"
                        className="mt-7"
                        onClick={() => removeSecondaryPhoneNumber(index)}
                      >
                        <IconTrash size={20} />
                      </Button>
                    </div>
                  ))}
                  {/* Industry */}
                  <TextInput
                    label="Industry"
                    className="w-full"
                    placeholder="Industry Type"
                    {...register("industry")}
                    error={errors?.industry?.message}
                  />

                  {/* Buttons */}
                  <div className="w-full flex space-x-4 justify-end mt-4">
                    <Button
                      variant="default"
                      onClick={() => reset(defaultValue)}
                    >
                      Reset
                    </Button>
                    <Button
                      variant="filled"
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
        </div>
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
            <td className="p-2">{props.data?.description}</td>
          </tr>
          <tr className="flex border-b border-gray-300 border-dashed">
            <td className="w-1/3 p-2 bg-gray-100 border-gray-300">
              {"E-mail"}
            </td>
            <td className="p-2">{props.data?.email}</td>
          </tr>
          <tr className="flex border-b border-gray-300 border-dashed">
            <td className="w-1/3 p-2 bg-gray-100 border-gray-300">
              {"Secondary Emails"}
            </td>
            <td className="p-2">{props.data?.secondaryEmails}</td>
          </tr>
          <tr className="flex border-b border-gray-300 border-dashed">
            <td className="w-1/3 p-2 bg-gray-100 border-gray-300">
              {"Phone Number"}
            </td>
            <td className="p-2">{props.data?.phoneNumber}</td>
          </tr>
          <tr className="flex border-b border-gray-300 border-dashed">
            <td className="w-1/3 p-2 bg-gray-100 border-gray-300">
              {"Secondary Phone Numbers"}
            </td>
            <td className="p-2">{props.data?.secondaryPhoneNumbers}</td>
          </tr>
          <tr className="flex border-b border-gray-300 border-dashed">
            <td className="w-1/3 p-2 bg-gray-100 border-gray-300">
              {"Short Code"}
            </td>
            <td className="p-2">{props.data?.shortCode}</td>
          </tr>
          <tr className="flex border-b border-gray-300 border-dashed">
            <td className="w-1/3 p-2 bg-gray-100 border-gray-300">
              {"Tin Number"}
            </td>
            <td className="p-2">{props.data?.tin}</td>
          </tr>
          <tr className="flex border-b border-gray-300 border-dashed">
            <td className="w-1/3 p-2 bg-gray-100 border-gray-300">
              {"Industry"}
            </td>
            <td className="p-2">{props.data?.industry}</td>
          </tr>
          <tr className="flex border-b border-gray-300 border-dashed">
            <td className="w-1/3 p-2 bg-gray-100 border-gray-300">
              {"Trade Name"}
            </td>
            <td className="p-2">{props.data?.tradeName}</td>
          </tr>
          <tr className="flex border-b border-gray-300 border-dashed">
            <td className="w-1/3 p-2 bg-gray-100 border-gray-300">
              {"Created At"}
            </td>
            <td className="p-2">{formatDate(props.data?.createdAt)}</td>
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
