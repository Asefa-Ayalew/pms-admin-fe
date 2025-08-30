"use client";

import { useUserInfo } from "@/src/hooks/useUserInfo";
import { Department } from "@/src/models/department.model";
import { User } from "@/src/models/user.model";
import { NewUserSchema } from "@/src/schemas/new-user-schema";
import countryJson from "@/src/shared/constants/country-json.json";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Box,
  Button,
  Fieldset,
  Group,
  InputBase,
  LoadingOverlay,
  Modal,
  MultiSelect,
  Radio,
  Select,
  Switch,
  TextInput,
} from "@mantine/core";
import { DatePickerInput } from "@mantine/dates";
import {
  IconArrowBack,
  IconDeviceFloppy,
  IconEdit,
  IconTrash,
  IconView360,
} from "@tabler/icons-react";
import dayjs from "dayjs";
import { useSession } from "next-auth/react";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState, useMemo } from "react"; 
import { Controller, FieldErrors, useForm } from "react-hook-form";

import z from "zod";
import { useLazyGetRolesQuery } from "../../role/_store/role.query";
import {
  useArchiveUserMutation,
  useCreateUserMutation,
  useDeleteUserMutation,
  useLazyGetDepartmentsQuery,
  useLazyGetUserQuery,
  useRestoreUserMutation,
  useUpdateUserMutation,
} from "../_store/user.query";
import { IMaskInput } from "react-imask";
import DetailsPage from "@/src/shared/component/details-page/details-page.component";
import { useLazyGetBankAccountsQuery } from "../_store/bank-account.query";
import { CollectionQuery } from "@/src/shared/models/collection.model";

interface Props {
  editMode: "new" | "detail";
  onCreating?: (data: boolean) => void;
  onClose?: () => void;
}

type FormSchema = z.infer<typeof NewUserSchema>;

const defaultValue: User = {
  firstName: "",
  middleName: "",
  lastName: "",
  phone: "",
  gender: "Male",
  departmentId: "",
  employeeNumber: "",
  isEmployee: true,
  startDate: new Date(),
  userRoles: [],
  roleIds: [],
  address: {
    country: "",
    city: "",
    subcity: "",
    woreda: "",
    kebele: "",
  },
  email: "",
  dateOfBirth: new Date(),
  endDate: new Date(),
  password: "",
};

export default function NewUserComponent(props: Props) {
  const { editMode, onCreating } = props;
  const params = useParams();
  const navigate = useRouter();
  const { update } = useSession();

  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User>();
  const [countryCode, setCountryCode] = useState<string>("+251");

  const [getRoles, roles] = useLazyGetRolesQuery();
  const [getBankAccount] = useLazyGetBankAccountsQuery();
  const [getUser, user] = useLazyGetUserQuery();
  const [createUser, createResponse] = useCreateUserMutation();
  const [updateUser, updateResponse] = useUpdateUserMutation();
  const [archiveUser, archiveResponse] = useArchiveUserMutation();
  const [restoreUser, restoreResponse] = useRestoreUserMutation();
  const [deleteUser, deleteResponse] = useDeleteUserMutation();
  const { user: currentUser } = useUserInfo();
  const [isEditMode, setIsEditMode] = useState(editMode !== 'detail');
  // FIX: Memoize the collection object to prevent infinite re-renders
  const collection = useMemo(() => ({}), []);
  const [bankAccountCollection, setBankAccountCollection] =
    useState<CollectionQuery>({
      filter: [[{ field: "ownerId", value: params.id, operator: "=" }]],
      orderBy: [{ field: "createdAt", direction: "desc" }],
    });
  const [getDepartments, departments] = useLazyGetDepartmentsQuery();
  const {
    register,
    control,
    handleSubmit,
    watch,
    formState: { errors },
    reset,
    setValue,
  } = useForm<FormSchema>({
    resolver: zodResolver(NewUserSchema),
    mode: "all",
  });

  interface CustomRole {
    roleId: string;
  }
  const handleToggle = () => {
    setIsEditMode((prev) => !prev);
  };
  function onSubmit(data: FormSchema) {
    if (editMode === "new") {
      createUser({
        ...data,
        phone: `${data?.phone?.split(" ").join("")}`,
        endDate: undefined,
      }).then((response) => {
        if (response?.data) {
          onCreating?.(false);
          if (!onCreating) {
            navigate.push(`/user/detail/${response?.data?.id}`);
          }
        }
      });
    } else {
      const updatedData = {
        ...data,
        id: `${params?.id}`,
        phone: `${data?.phone?.split(" ").join("")}`,
      };

      updateUser(updatedData).then(async (response) => {
        if (response?.data) {
          if (currentUser?.id === response.data.id) {
            await update({
              profile: response.data,
            });
          }

          navigate.push(`/user/detail/${response?.data?.id}`);
        }
      });
    }
  }

  async function handleDelete() {
    try {
      let response;
      if (selectedUser?.archivedAt) {
        response = await restoreUser({ id: `${selectedUser?.id}` });
      } else {
        response = await deleteUser(`${selectedUser?.id}`);
      }

      if (response?.data) {
        setOpenDeleteModal(false);
      }
      // Navigate to /user only after successful delete
      if (!selectedUser?.archivedAt) {
        navigate.push(`/user`);
      }
    } catch (error) {
      console.error("Error during delete/restore operation:", error);
    } finally {
      setOpenDeleteModal(false);
    }
  }

  const onError = (error: FieldErrors) => {
    console.log("Error", error, archiveUser);
  };
  useEffect(() => {
    getBankAccount(bankAccountCollection);
  }, [bankAccountCollection, getBankAccount, setBankAccountCollection]);
  useEffect(() => {
    if (editMode === "detail") {
      getUser({
        id: `${params?.id}`,
        includes: ["userRoles", "userRoles.role", "userContacts"],
      }).then((response) => {
        if (response?.data) {
          const userRoles = response?.data?.userRoles;
          console.log("User Roles", userRoles);
          reset({
            ...response?.data,
            dateOfBirth: response?.data?.dateOfBirth
              ? new Date(response?.data?.dateOfBirth)
              : new Date(),
            startDate: response?.data?.startDate
              ? new Date(response?.data?.startDate)
              : new Date(),
            endDate: response?.data?.endDate
              ? new Date(response?.data?.endDate)
              : undefined,
            userRoles,
          });
        }
      });
    } else {
      reset({
        ...defaultValue,
      });
    }
  }, [params?.id, editMode, getUser, reset]); // Added getUser and reset to dependencies

  useEffect(() => {
    getDepartments(collection);
    getRoles(collection);
  }, [collection, getDepartments, getRoles]); // Added getDepartments and getRoles to dependencies

  const data = [
    {
      key: "name",
      label: "Name",
      value: `${user?.data?.firstName ?? ""} ${user?.data?.middleName ?? ""} ${user?.data?.lastName ?? ""}`,
    },
    {
      key: "userNumber",
      label: "Employee Number",
      value: user?.data?.employeeNumber ?? "",
    },
    {
      key: "phone",
      label: "Phone",
      value: user?.data?.phone ?? "",
    },
    {
      key: "email",
      label: "Email",
      value: user?.data?.email ?? "",
    },
    {
      key: "startDate",
      label: "Employment Date",
      value: user?.data?.startDate
        ? dayjs(user?.data?.startDate).format("DD-MMM-YYYY")
        : "",
    },
    {
      key: "tin",
      label: "TIN",
      value: user?.data?.tin ?? "",
    },
    {
      key: "address",
      label: "Address",
      value: "",
      level: 1,
      children: [
        {
          key: "country",
          label: "Country",
          value: user?.data?.address?.country ?? "",
        },
        {
          key: "city",
          label: "City",
          value: user?.data?.address?.city ?? "",
        },
        {
          key: "subcity",
          label: "Subcity",
          value: user?.data?.address?.subcity ?? "",
        },
        {
          key: "woreda",
          label: "Woreda",
          value: user?.data?.address?.woreda ?? "",
        },
        {
          key: "kebele",
          label: "Kebele",
          value: user?.data?.address?.kebele ?? "",
        },
      ],
    },
   
    {
      key: "roles",
      label: "Roles",
      value: user?.data?.userRoles
        ? user?.data?.userRoles
            .map((userRole) => userRole?.role?.name?.toUpperCase())
            .filter(Boolean)
        : [],
    },
  ];

  const profileData = {
    image: "",
    name: `${user?.data?.firstName ?? ""} ${user?.data?.middleName ?? ""} ${
      user?.data?.lastName ?? ""
    }`,
    type: "",
    address: "",
    phone: "",
    email: "",
    isVerified: false,
  };
  const config = {
    editUrl: `#`,
    isProfile: false,
    title: `${user?.data?.firstName ?? ""} ${user?.data?.middleName ?? ""} ${
      user?.data?.lastName ?? ""
    }`,
    widthClass: "w-full",
  };
  return (
    <div className="w-full flex-col space-y-4">
      {editMode !== "new" && (
        <Box className="w-full flex justify-center relative">
          <Button
            leftSection={
              isEditMode ? <IconEdit size={12} /> : <IconView360 size={12} />
            }
            variant="filled"
            radius="md"
            className="w-max ml-auto flex items-center gap-0.5 bg-primary-500 text-white"
            onClick={handleToggle}
          >
            {isEditMode ? "View" : "Edit"}
          </Button>
        </Box>
      )}
      {isEditMode ? (
        <>
          <div className="flex px-4 items-center justify-center">
            <h3 className="text-2xl font-semibold">
              {editMode === "new" ? "New User Registration" : "User Detail"}
            </h3>
          </div>
          <div className="w-full flex justify-center relative">
            <LoadingOverlay
              visible={
                user.isLoading ||
                user?.isFetching ||
                roles?.isLoading ||
                roles?.isFetching
              }
              zIndex={1000}
              overlayProps={{ radius: "sm", blur: 2 }}
            />

            <form
              name="User form"
              onSubmit={handleSubmit(onSubmit, onError)}
              autoComplete="off"
              className="w-full"
            >
              <div className="flex w-full justify-center">
                <div className="px-2 w-full flex-col space-y-4">
                  <Fieldset legend="Basic Information">
                    <div className="md:flex sm:flex-row md:space-x-4">
                      <TextInput
                        label="First Name"
                        className="w-full"
                        required
                        placeholder="First Name"
                        {...register("firstName")}
                        error={errors?.firstName?.message}
                      />
                      <TextInput
                        label="Middle Name"
                        className="w-full"
                        required
                        placeholder="Middle Name"
                        {...register("middleName")}
                        error={errors?.middleName?.message}
                      />
                    </div>

                    <div className="flex space-x-4">
                      <TextInput
                        label="Last Name"
                        className="sm:w-full lg:w-1/2"
                        placeholder="Last Name"
                        {...register("lastName")}
                        error={errors?.lastName?.message}
                      />
                      <Controller
                        name="isEmployee"
                        control={control}
                        render={({ field }) => (
                          <Switch
                            className="lg:w-1/2 sm:w-full lg:mt-7"
                            checked={
                              watch("employeeNumber") ? true : field.value
                            }
                            onChange={(e) => {
                              setValue("isEmployee", e.currentTarget.checked, {
                                shouldValidate: true,
                                shouldDirty: true,
                              });
                            }}
                            label="Is Employee"
                          />
                        )}
                      />
                    </div>
                    <div className="lg:flex sm:flex-row lg:gap-x-2">
                      {(watch("isEmployee") || watch("employeeNumber")) && (
                        <TextInput
                          label="Employee ID Number"
                          className="sm:w-full"
                          placeholder="Employee ID Number"
                          {...register("employeeNumber")}
                          error={errors?.employeeNumber?.message}
                        />
                      )}
                      {editMode === "new" && (
                        <TextInput
                          label="Password"
                          className="sm:w-full"
                          type="password"
                          placeholder="Password"
                          {...register("password")}
                          error={errors?.password?.message}
                        />
                      )}
                    </div>
                    <div className="flex space-x-4">
                      <DatePickerInput
                        label="Date of Birth"
                        className="w-full"
                        error={errors?.dateOfBirth?.message}
                        required
                        value={watch("dateOfBirth")}
                        onChange={(value) => {
                          setValue("dateOfBirth", dayjs(value).toDate());
                        }}
                      />
                      <div className="flex w-full justify-between items-center">
                        <Controller
                          name="gender"
                          control={control}
                          render={({ field }) => (
                            <Radio.Group
                              {...field}
                              withAsterisk
                              label="Select Gender"
                              value={watch("gender")}
                              onChange={(event) => {
                                setValue("gender", event as "Male" | "Female");
                              }}
                            >
                              <Group mt="xs">
                                <Radio value="Male" label="Male" />
                                <Radio value="Female" label="Female" />
                              </Group>
                            </Radio.Group>
                          )}
                        />
                      </div>
                    </div>
                  </Fieldset>
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
                  <Fieldset legend="Employment Information">
                    <div className="md:flex sm:flex-row md:space-x-4">
                      <TextInput
                        label="Job Title"
                        className="w-full"
                        required
                        placeholder="Job Title"
                        {...register("jobTitle")}
                        error={errors?.jobTitle?.message}
                      />
                      <TextInput
                        label="TIN"
                        className="w-full"
                        required
                        placeholder="TIN"
                        {...register("tin")}
                        error={errors?.tin?.message}
                      />
                    </div>
                    <div className="flex space-x-4">
                      <Controller
                        control={control}
                        name="departmentId"
                        render={({ field }) => (
                          <Select
                            label="Department"
                            searchable
                            placeholder="Select Department"
                            className="w-full"
                            error={errors?.departmentId?.message}
                            value={field.value}
                            onChange={(selectedValue) => {
                              field.onChange(selectedValue);
                            }}
                            data={
                              departments?.data?.data?.map(
                                (item: Department) => ({
                                  label: item?.name,
                                  value: item?.id ?? "",
                                  key: item?.name,
                                })
                              ) ?? []
                            }
                          />
                        )}
                      />
                      <Controller
                        control={control}
                        name="userRoles"
                        render={({ field: { value, onChange } }) => {
                          const selectedRoleIds =
                            value?.map((role: CustomRole) => role.roleId) || [];

                          return (
                            <MultiSelect
                              label="Role"
                              searchable
                              nothingFoundMessage="Nothing found..."
                              hidePickedOptions
                              placeholder="Select role here"
                              className="w-full"
                              value={selectedRoleIds}
                              onChange={(selectedValues) => {
                                onChange(selectedValues);
                              }}
                              data={
                                roles?.data?.data?.map((item) => ({
                                  label: item?.name,
                                  value: item?.id,
                                  key: item?.key,
                                })) ?? []
                              }
                            />
                          );
                        }}
                      />
                    </div>
                    <div className="flex space-x-4">
                      {watch("isEmployee") && (
                        <>
                          <DatePickerInput
                            label="Start Date"
                            className="w-full"
                            error={errors?.startDate?.message}
                            value={watch("startDate")}
                            onChange={(value) => {
                              setValue("startDate", dayjs(value).toDate());
                            }}
                          />
                          <DatePickerInput
                            label="End Date (if terminated)"
                            className="w-full"
                            error={errors?.endDate?.message}
                            value={watch("endDate") || undefined}
                            clearable
                            onChange={(value) => {
                              setValue(
                                "endDate",
                                value ? dayjs(value).toDate() : undefined,
                                {
                                  shouldValidate: true,
                                  shouldDirty: true,
                                }
                              );
                            }}
                          />
                        </>
                      )}
                    </div>
                  </Fieldset>
                  <div className="w-full flex space-x-4 justify-end">
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
                    {editMode === "detail" && (
                      <Button
                        type="button"
                        variant="filled"
                        color="red"
                        className={`shadow-none bg-red-500 rounded flex items-center`}
                        onClick={() => {
                          setOpenDeleteModal(true);
                          setSelectedUser(user?.data);
                        }}
                        loading={
                          archiveResponse?.isLoading ||
                          restoreResponse?.isLoading
                        }
                        leftSection={
                          user?.data?.archivedAt ? (
                            <IconArrowBack size={15} />
                          ) : (
                            <IconTrash size={15} />
                          )
                        }
                      >
                        {user?.data?.archivedAt ? "Restore" : "Delete"}
                      </Button>
                    )}
                    <Button
                      variant="filled"
                      // className="shadow-none bg-primary-500 rounded flex items-center"
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
        <DetailsPage
          dataSource={[{ title: "Basic Information", source: data }]}
          profileData={profileData}
          config={config}
          isLoading={user.isLoading || user.isFetching}
          hideEdit={true}
        />
      )}

      <Modal
        opened={openDeleteModal}
        onClose={() => {
          setOpenDeleteModal(false);
        }}
        size={"40%"}
        title={"Delete Contact"}
        centered
      >
        {/* Modal content */}
        <h2 className="">
          Are you sure You want to delete{" "}
          <span className="underline text-xl">{selectedUser?.firstName} </span>
        </h2>
        <div className="flex my-4">
          <Button
            variant="default"
            className="bg-none mx-2"
            onClick={() => {
              setOpenDeleteModal(false);
            }}
          >
            Cancel
          </Button>

          <Button
            type="button"
            variant="filled"
            color="red"
            className={`bg-red-500 text-white shadow-none rounded flex items-center mx-2`}
            onClick={() => {
              handleDelete();
            }}
            loading={archiveResponse?.isLoading || deleteResponse?.isLoading}
            leftSection={
              selectedUser?.archivedAt ? (
                <IconArrowBack size={15} />
              ) : (
                <IconTrash size={15} />
              )
            }
          >
            {selectedUser?.archivedAt ? "Restore" : "Delete"}
          </Button>
        </div>
      </Modal>
    </div>
  );
}
