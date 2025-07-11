"use client";

import { OrganizationBankAccount } from "@/src/models/organization-bank-account.model";
import { NewOrganizationBankAccountSchema } from "@/src/schemas/new-organization-bank-account-schema";
import { zodResolver } from "@hookform/resolvers/zod";
import {
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
import { FieldErrors, useForm } from "react-hook-form";
import z from "zod";
import BankListJson from "@/src/shared/constants/bank-list.json";
import { BankAccountType } from "@/src/shared/enum/app.enum";
import { useArchiveOrganizationBankAccountMutation, useCreateOrganizationBankAccountMutation, useDeleteOrganizationBankAccountMutation, useLazyGetOrganizationBankAccountQuery, useRestoreOrganizationBankAccountMutation, useUpdateOrganizationBankAccountMutation } from "../_store/organization-bank-account.query";


interface Props {
  editMode: "new" | "detail" | "view";
  accountId?: string;
  onClose: () => void;
  onCreating?: (data: boolean) => void;
  data?: OrganizationBankAccount;
}

const bankCodes = BankListJson.map((bank) => ({
  value: bank.bankCode,
  label: `${bank.name}`,
})).filter(
  (value, index, self) =>
    index === self.findIndex((t) => t.value === value.value)
);

type FormSchema = z.infer<typeof NewOrganizationBankAccountSchema>;

const defaultValue: OrganizationBankAccount = {
  accountNumber: "",
  bankName: "",
  bankCode: "",
  accountType: BankAccountType.SAVINGS,
  isActive: true,
};

export default function NewOrganizationBankAccountComponent(props: Props) {
  const { editMode, onCreating } = props;
  const params = useParams();
  const navigate = useRouter();

  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [selectedOrganizationBankAccount, setSelectedOrganizationBankAccount] =
    useState<OrganizationBankAccount>();

  const [getOrganizationBankAccount, organizationBankAccount] =
    useLazyGetOrganizationBankAccountQuery();
  const [createOrganizationBankAccount, createResponse] =
    useCreateOrganizationBankAccountMutation();
  const [updateOrganizationBankAccount, updateResponse] =
    useUpdateOrganizationBankAccountMutation();
  const [archiveOrganizationBankAccount, archiveResponse] =
    useArchiveOrganizationBankAccountMutation();
  const [restoreOrganizationBankAccount, restoreResponse] =
    useRestoreOrganizationBankAccountMutation();
  const [deleteOrganizationBankAccount, deleteResponse] =
    useDeleteOrganizationBankAccountMutation();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    reset,
    setValue,
  } = useForm<FormSchema>({
    resolver: zodResolver(NewOrganizationBankAccountSchema),
    mode: "all",
  });

  function onSubmit(data: OrganizationBankAccount) {
    if (editMode === "new") {
      createOrganizationBankAccount({
        ...data,
      }).then((response) => {
        if (response?.data) {
          onCreating?.(false);
          if (!onCreating) {
             props.onClose();
          }
        }
      });
    } else {
      const updatedData = {
        ...data,
        id: `${props?.accountId}`,
      };

      updateOrganizationBankAccount(updatedData).then(async (response) => {
        if (response?.data) {
          props.onClose();
        }
      });
    }
  }

  async function handleDelete() {
    try {
      if (selectedOrganizationBankAccount?.archivedAt) {
        const response = await restoreOrganizationBankAccount({
          id: `${selectedOrganizationBankAccount?.id}`,
        });
        if (response?.data) {
          setOpenDeleteModal(false);
        }
      } else {
        const response = await deleteOrganizationBankAccount(
          `${selectedOrganizationBankAccount?.id}`
        );
        if (response?.data) {
          setOpenDeleteModal(false);
          navigate.push(`/my-organizations`);
        }
      }
    } catch (error) {
      console.error("Error during delete/restore operation:", error);
    } finally {
      setOpenDeleteModal(false);
    }
  }

  const onError = (error: FieldErrors) => {
    console.log("Error", error, archiveOrganizationBankAccount);
  };

  useEffect(() => {
    if (editMode === "detail") {
      getOrganizationBankAccount({
        id: `${props?.accountId ?? params?.id}`,
      }).then((response) => {
        if (response?.data) {
          reset({
            ...response?.data,
          });
        }
      });
    } else {
      reset({
        ...defaultValue,
      });
    }
  }, [props?.accountId, editMode]);
  const isActive = watch("isActive");
  return (
    <div className="w-full p-4 flex-col space-y-4 buser">
      <div className="flex px-4 buser-0 buser-b-2 items-center justify-center">
        <h3 className="text-2xl font-semibold">
          {editMode === "detail" ? "" : "New Bank Account"}
        </h3>
      </div>
      <div className="w-full flex justify-center relative">
        <LoadingOverlay
          visible={
            organizationBankAccount?.isLoading ||
            organizationBankAccount?.isFetching
          }
          zIndex={1000}
          overlayProps={{ radius: "sm", blur: 2 }}
        />
        <form
          name="OrganizationBankAccount form"
          onSubmit={handleSubmit(onSubmit, onError)}
          autoComplete="off"
          className="w-full"
        >
          <div className="flex w-full  justify-center">
            <div className="px-2 w-4/5 mt-4 flex-col space-y-4">
              <div className="lg:flex lg:space-x-4 sm:flex-row mt-4">
                <TextInput
                  label="Account Number"
                  className="w-full"
                  required
                  placeholder="Account Number"
                  {...register("accountNumber")}
                  error={errors?.accountNumber?.message}
                />
                <Select
                  label="Bank Name"
                  className="w-full"
                  data={bankCodes}
                  value={watch("bankCode")}
                  onChange={(value) => {
                    const selectedBank = bankCodes?.find(
                      (bank) => bank.value === value
                    );
                    setValue("bankCode", selectedBank?.value ?? "");
                    setValue("bankName", selectedBank?.label ?? "");
                  }}
                  required
                />
              </div>

              <div className="lg:flex lg:space-x-4 sm:flex-row mt-4">
                <Select
                  label="Account Type"
                  className="w-full"
                  value={watch("accountType")}
                  onChange={(value) =>
                    setValue("accountType", value as BankAccountType)
                  }
                  data={[
                    {
                      value: BankAccountType.SAVINGS,
                      label: "Savings Account",
                    },
                    {
                      value: BankAccountType.CHECKING,
                      label: "Checking Account",
                    },
                    {
                      value: BankAccountType.BUSINESS,
                      label: "Business Account",
                    },
                    { value: BankAccountType.JOINT, label: "Joint Account" },
                  ]}
                  error={errors?.accountType?.message}
                />

                <Switch
                  className="mt-7 w-full"
                  checked={isActive}
                  label="Is Active?"
                  onChange={(e) => {
                    setValue("isActive", e.currentTarget.checked, {
                      shouldValidate: true,
                      shouldDirty: true,
                    });
                  }}
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
                {editMode === "detail" && (
                  <div>
                    <Button
                      type="button"
                      variant="filled"
                      color="red"
                      className={`shadow-none bg-red-500 rounded flex items-center`}
                      onClick={() => {
                        setOpenDeleteModal(true);
                        setSelectedOrganizationBankAccount(
                          organizationBankAccount?.data
                        );
                      }}
                      loading={
                        archiveResponse?.isLoading || restoreResponse?.isLoading
                      }
                      leftSection={
                        organizationBankAccount?.data?.archivedAt ? (
                          <IconArrowBack size={15} />
                        ) : (
                          <IconTrash size={15} />
                        )
                      }
                    >
                      {organizationBankAccount?.data?.archivedAt
                        ? "Restore"
                        : "Delete"}
                    </Button>
                  </div>
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
      <Modal
        opened={openDeleteModal}
        onClose={() => {
          setOpenDeleteModal(false);
        }}
        size={"40%"}
        title={"Delete OrganizationBankAccount"}
        centered
      >
        {/* Modal content */}
        <h2 className="">
          Are you sure You want to delete{" "}
          <span className="underline text-xl">
            {selectedOrganizationBankAccount?.accountNumber}{" "}
          </span>
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
            className={`bg-red-500 text-white shadow-none rounded flex items-center  mx-2`}
            onClick={() => {
              handleDelete();
            }}
            loading={archiveResponse?.isLoading || deleteResponse?.isLoading}
            leftSection={
              selectedOrganizationBankAccount?.archivedAt ? (
                <IconArrowBack size={15} />
              ) : (
                <IconTrash size={15} />
              )
            }
          >
            {selectedOrganizationBankAccount?.archivedAt ? "Restore" : "Delete"}
          </Button>
        </div>
      </Modal>
    </div>
  );
}
