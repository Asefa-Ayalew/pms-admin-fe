"use client";

import countryJson from "@/src/shared/constants/country-json.json";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Box,
  Button,
  Fieldset,
  InputBase,
  Select,
  TextInput,
} from "@mantine/core";
import { IconDeviceFloppy, IconPlus, IconTrash } from "@tabler/icons-react";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import {
  Controller,
  FieldErrors,
  SubmitHandler,
  useForm,
} from "react-hook-form";
import z from "zod";
import {
  useCreateContactMutation,
  useUpdateContactMutation,
} from "../_store/contact.query";
import { Contact } from "@/src/models/tenant.model";
import { contactSchema } from "@/src/schemas/new-tenant-schema";
import { IMaskInput } from "react-imask";

interface Props {
  editMode: "new" | "detail" | "view";
  onClose: () => void;
  onCreating?: (data: boolean) => void;
  data?: Contact;
}

type FormSchema = z.infer<typeof contactSchema>;

const defaultValue: FormSchema = {
  name: "",
  shortCode: "",
  note: "",
  email: "",
  phoneNumber: "",
  gender: "",
  responsibility: "",
  address: {
    country: "",
    city: "",
    subcity: "",
    woreda: "",
    kebele: "",
  },
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

export default function ContactForm(props: Props) {
  const { editMode } = props;
  const params = useParams();

  const [createContact, { isLoading: creating }] = useCreateContactMutation();
  const [updateContact, { isLoading: updating }] = useUpdateContactMutation();

  const [secondaryEmails, setSecondaryEmails] = useState<string[]>([]);
  const [secondaryPhoneNumbers, setSecondaryPhoneNumbers] = useState<string[]>(
    []
  );

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
  const [countryCode, setCountryCode] = useState<string>("+251");

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
  } = useForm<FormSchema>({
    resolver: zodResolver(contactSchema),
    mode: "all",
  });

  const onSubmit: SubmitHandler<Contact> = async (data) => {
    if (editMode === "new") {
      try {
        const response = await createContact({
          ...data,
          tenantId: `${params?.id}`,
        }).unwrap();
        if (response) {
          props.onClose();
        }
      } catch (err) {
        console.log(err);
      }
    } else {
      try {
        const response = await updateContact({
          ...data,
          id: `${props?.data?.id}`,
          tenantId: `${props?.data?.tenantId}`,
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
      if (props.data) {
        reset({ ...props.data });
      } else {
        reset({ ...defaultValue });
      }
    }
  }, [props.data, editMode, reset]);

  return (
    <Box>
      {props?.editMode !== "view" ? (
        <Box className="w-full p-4 flex-col space-y-4 buser">
          <form
            name="Contact form"
            onSubmit={handleSubmit(onSubmit, onError)}
            autoComplete="off"
            className="w-full"
          >
            <div className="flex w-full justify-center">
              <div className="px-2 w-full flex-col space-y-4">
                <TextInput
                  label="Name"
                  className="w-full"
                  placeholder="Name"
                  {...register("name")}
                  error={errors?.name?.message}
                />

                {/* Trade Name */}
                <TextInput
                  label="Note"
                  className="w-full"
                  placeholder="Note"
                  {...register("note")}
                  error={errors?.note?.message}
                />

                <TextInput
                  label="Gender"
                  className="w-full"
                  placeholder="Gender"
                  {...register("gender")}
                  error={errors?.gender?.message}
                />

                {/* Email */}
                <div className="flex space-x-4">
                  <TextInput
                    label="Email"
                    type="email"
                    className="w-full"
                    placeholder="Email"
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
                <TextInput
                  label="Responsibility"
                  className="w-full"
                  placeholder="Responsibility"
                  {...register("responsibility")}
                  error={errors?.responsibility?.message}
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
                <Fieldset legend="Address Information">
                  <div className="flex space-x-4">
                    <div className="flex w-full">
                      <Select
                        radius={"xs"}
                        searchable
                        onChange={(code) => {
                          if (
                            code &&
                            countryJson.find((item) => item.code === code)
                          ) {
                            setCountryCode(
                              countryJson.find((item) => item.code === code)
                                ?.dial_code ?? "+251"
                            );
                          }
                        }}
                        classNames={{
                          input:
                            "border border-gray-400/70 border-r-0 rounded rounded-r-none",
                        }}
                        value={
                          countryJson.find(
                            (item) => item.dial_code === countryCode
                          )?.code ?? "ET"
                        }
                        label="Code"
                        data={countryJson?.map((item) => ({
                          label: `${item.name} (${item.dial_code})`,
                          value: item.code,
                          key: item.name,
                        }))}
                        maxDropdownHeight={400}
                      />
                      <InputBase
                        className=" rounded rounded-l-none w-full"
                        label="Your phone"
                        component={IMaskInput}
                        mask={`${countryCode} 000 000-0000`}
                        placeholder="Your phone"
                      />
                    </div>
                  </div>
                  <div className="flex gap-x-3">
                    <TextInput
                      type="email"
                      label="Email"
                      required
                      className="w-full"
                      placeholder="Email"
                      {...register("email")}
                      error={errors?.email?.message}
                    />
                    <Controller
                      control={control}
                      name="address.country"
                      render={() => (
                        <Select
                          label="Country"
                          className="w-full"
                          data={countryJson.map((country) => ({
                            value: country.code,
                            label: `${country.name} (${country.code})`,
                          }))}
                          value={watch("address.country")}
                          onChange={(code) => {
                            if (code) {
                              setValue("address.country", code);
                              const selected = countryJson.find(
                                (item) => item.code === code
                              );
                              if (selected) {
                                setCountryCode(selected.code);
                              }
                            }
                          }}
                          error={errors?.address?.country?.message}
                        />
                      )}
                    />
                  </div>
                  <div className="flex gap-x-3">
                    <TextInput
                      label="City"
                      className="w-full"
                      required
                      placeholder="Enter City"
                      {...register("address.city")}
                      error={errors?.address?.city?.message}
                    />
                    <TextInput
                      label="Subcity"
                      className="w-full"
                      required
                      placeholder="Enter Subcity"
                      {...register("address.subcity")}
                      error={errors?.address?.subcity?.message}
                    />
                  </div>
                  <div className="flex gap-x-3">
                    <TextInput
                      label="Woreda"
                      className="w-full"
                      required
                      placeholder="Enter Woreda"
                      {...register("address.woreda")}
                      error={errors?.address?.woreda?.message}
                    />
                    <TextInput
                      label="Kebele"
                      className="w-full"
                      required
                      placeholder="Enter Kebele"
                      {...register("address.kebele")}
                      error={errors?.address?.kebele?.message}
                    />
                  </div>
                </Fieldset>

                {/* Buttons */}
                <div className="w-full flex space-x-4 justify-end mt-4">
                  <Button variant="default" onClick={() => reset(defaultValue)}>
                    Reset
                  </Button>
                  <Button
                    variant="filled"
                    type="submit"
                    loading={editMode === "new" ? creating : updating}
                    leftSection={<IconDeviceFloppy />}
                  >
                    {editMode === "new" ? "Save" : "Update"}
                  </Button>
                </div>
              </div>
            </div>
          </form>
        </Box>
      ) : (
        <Box className="w-full text-sm text-gray-900">
          <tr className="flex border-b border-gray-300 border-dashed">
            <td className="w-1/3 p-2 bg-gray-100 border-gray-300">{"Name"}</td>
            <td className="p-2">{props?.data?.name}</td>
          </tr>
          <tr className="flex border-b border-gray-300 border-dashed">
            <td className="w-1/3 p-2 bg-gray-100 border-gray-300">
              {"Short Code"}
            </td>
            <td className="p-2">{props.data?.note}</td>
          </tr>
          <tr className="flex border-b border-gray-300 border-dashed">
            <td className="w-1/3 p-2 bg-gray-100 border-gray-300">{"Tin"}</td>
            <td className="p-2">{props.data?.gender}</td>
          </tr>
          <tr className="flex border-b border-gray-300 border-dashed">
            <td className="w-1/3 p-2 bg-gray-100 border-gray-300">{"Email"}</td>
            <td className="p-2">{props.data?.email}</td>
          </tr>
          <tr className="flex border-b border-gray-300 border-dashed">
            <td className="w-1/3 p-2 bg-gray-100 border-gray-300">
              {"Secondary Emails"}
            </td>
            <td className="p-2">{props.data?.secondaryEmails?.join(",")}</td>
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
            <td className="p-2">
              {props.data?.secondaryPhoneNumbers?.join(",")}
            </td>
          </tr>
          <tr className="flex border-b border-gray-300 border-dashed">
            <td className="w-1/3 p-2 bg-gray-100 border-gray-300">
              {"Gender"}
            </td>
            <td className="p-2">{props.data?.gender}</td>
          </tr>
          <tr className="flex border-b border-gray-300 border-dashed">
            <td className="w-1/3 p-2 bg-gray-100 border-gray-300">
              {"Industry"}
            </td>
            <td className="p-2">{props.data?.industry}</td>
          </tr>
          <tr className="flex border-b border-gray-300 border-dashed">
            <td className="w-1/3 p-2 bg-gray-100 border-gray-300">{"Note"}</td>
            <td className="p-2">{props.data?.note}</td>
          </tr>
          <tr className="flex border-b border-gray-300 border-dashed">
            <td className="w-1/3 p-2 bg-gray-100 border-gray-300">
              {"Responsibility"}
            </td>
            <td className="p-2">{props.data?.responsibility}</td>
          </tr>
          <tr className="flex border-b border-gray-300 border-dashed">
            <td className="w-1/3 p-2 bg-gray-100 border-gray-300">
              {"Country"}
            </td>
            <td className="p-2">{props.data?.address?.country}</td>
          </tr>
          <tr className="flex border-b border-gray-300 border-dashed">
            <td className="w-1/3 p-2 bg-gray-100 border-gray-300">
              {"Woreda"}
            </td>
            <td className="p-2">{props.data?.address?.woreda}</td>
          </tr>
          <tr className="flex border-b border-gray-300 border-dashed">
            <td className="w-1/3 p-2 bg-gray-100 border-gray-300">
              {"Kebele"}
            </td>
            <td className="p-2">{props.data?.address?.kebele}</td>
          </tr>
          <tr className="flex border-b border-gray-300 border-dashed">
            <td className="w-1/3 p-2 bg-gray-100 border-gray-300">{"City"}</td>
            <td className="p-2">{props.data?.address?.city}</td>
          </tr>
          <tr className="flex border-b border-gray-300 border-dashed">
            <td className="w-1/3 p-2 bg-gray-100 border-gray-300">
              {"Sub City"}
            </td>
            <td className="p-2">{props.data?.address?.subcity}</td>
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
    </Box>
  );
}
