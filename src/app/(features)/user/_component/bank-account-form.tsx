"use client";

import { BankAccount, OwnerType } from "@/src/models/bank-account.model";
import { NewBankAccountSchema } from "@/src/schemas/new-bank-account-schema";
import BankListJson from "@/src/shared/constants/bank-list.json";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Box,
  Button,
  Flex,
  Group,
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
import {
  useArchiveBankAccountMutation,
  useCreateBankAccountMutation,
  useDeleteBankAccountMutation,
  useLazyGetBankAccountQuery,
  useLazyGetUserQuery,
  useRestoreBankAccountMutation,
  useUpdateBankAccountMutation,
} from "../_store/bank-account.query";

interface Props {
  editMode: "new" | "detail" | "view";
  accountId?: string;
  onClose: () => void;
  onCreating?: (data: boolean) => void;
  data?: BankAccount;
}

type FormSchema = z.infer<typeof NewBankAccountSchema>;

const defaultValue: BankAccount = {
  accountNumber: "",
  bankName: "",
  bankCode: "",
  ownerName: "",
  ownerId: "",
  isPreferred: false,
  ownerType: OwnerType.INDIVIDUAL,
};

const bankCodes = BankListJson.map((bank) => ({
  value: bank.bankCode,
  label: `${bank.name}`,
})).filter(
  (value, index, self) =>
    index === self.findIndex((t) => t.value === value.value)
);

export default function BankAccountForm(props: Props) {
  const { editMode, onCreating, accountId } = props;
  const params = useParams();
  const navigate = useRouter();

  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [selectedBankAccount, setSelectedBankAccount] = useState<BankAccount>();

  // Fetching bank account, users, and tenants
  const [getBankAccount, bankAccount] = useLazyGetBankAccountQuery();
  const [createBankAccount, createResponse] = useCreateBankAccountMutation();
  const [updateBankAccount, updateResponse] = useUpdateBankAccountMutation();
  const [archiveBankAccount, archiveResponse] = useArchiveBankAccountMutation();
  const [restoreBankAccount, restoreResponse] = useRestoreBankAccountMutation();
  const [deleteBankAccount, deleteResponse] = useDeleteBankAccountMutation();

  const [getUser, user] = useLazyGetUserQuery();
  const collection = {
    skip: 0,
    top: 50,
    orderBy: [{ field: "createdAt", direction: "desc" }],
  };

  console.log(archiveBankAccount, restoreBankAccount);
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    reset,
    setValue,
  } = useForm<FormSchema>({
    resolver: zodResolver(NewBankAccountSchema),
    mode: "all",
  });

  useEffect(() => {
    if (editMode === "detail" && accountId) {
      getBankAccount({ id: `${accountId}` }).then((response) => {
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
  }, [params?.id, editMode, collection]);

  function onSubmit(data: FormSchema) {
    const currentData = {
      ...data,
      ownerId: user?.data?.id ?? "",
      ownerName: `${user?.data?.firstName} ${user?.data?.middleName}`,
      accountNumber: data.accountNumber,
      bankName: data.bankName,
      bankCode: data.bankCode,
      tenantId: data.tenantId,
      isPreferred: data.isPreferred,
      ownerType: data.ownerType,
    } satisfies BankAccount;
    if (editMode === "new") {
      createBankAccount(currentData).then((response) => {
        if (response?.data) {
          onCreating?.(false);
          if (!onCreating) {
            props.onClose();
          }
        }
      });
    } else {
      const updatedData = {
        ...currentData,
        id: bankAccount?.data?.id,
      };
      updateBankAccount(updatedData).then((response) => {
        if (response?.data) {
          props.onClose();
        }
      });
    }
  }

  function handleDeleteBankAccount() {
    if (!selectedBankAccount?.id) return;

    deleteBankAccount(selectedBankAccount?.id).then((response) => {
      if (response?.data) {
        setOpenDeleteModal(false);
        navigate.push("/user");
      }
    });
  }

  useEffect(() => {
    getUser({
      id: `${params?.id}`,
    });
  }, [params?.id]);
  const onError = (error: FieldErrors) => {
    console.log("Error", error);
  };
  useEffect(() => {
    if (editMode === "detail") {
      if (bankAccount?.data) {
        reset({ ...bankAccount.data });
      } else if (props.data) {
        console.log(props.data);
        reset({ ...props.data });
      } else {
        reset({ ...defaultValue });
      }
    }
  }, [props.data, bankAccount, editMode, reset]);
  const isPreferred = watch("isPreferred");

  return (
    <Box>
      {props?.editMode !== "view" ? (
        <Box className="w-full p-4 flex-col space-y-4 buser">
          <LoadingOverlay
            visible={bankAccount?.isLoading || bankAccount?.isFetching}
            zIndex={1000}
            overlayProps={{ radius: "sm", blur: 2 }}
          />
          <form
            name="Bank Account form"
            onSubmit={handleSubmit(onSubmit, onError)}
            autoComplete="off"
            className="w-full"
          >
            <Box className="flex w-full justify-center">
              <Group mt="xl"></Group>
              <Box className="px-2 w-full mt-4 flex-col space-y-4">
                <Flex gap="8">
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
                </Flex>
                <Flex gap="8">
                  <Select
                    label="Owner Type"
                    className="w-full"
                    value={watch("ownerType")}
                    onChange={(value) =>
                      setValue("ownerType", value as OwnerType)
                    }
                    data={[
                      { value: OwnerType.INDIVIDUAL, label: "Individual" },
                      { value: OwnerType.GOVERNMENTAL, label: "Governmental" },
                      { value: OwnerType.COMPANY, label: "Company" },
                      { value: OwnerType.ORGANIZATION, label: "Organization" },
                    ]}
                    error={errors?.ownerType?.message}
                  />
                  <Switch
                    className="mt-7 w-full"
                    checked={isPreferred}
                    label="Is Preferred?"
                    onChange={(e) => {
                      setValue("isPreferred", e.currentTarget.checked, {
                        shouldValidate: true,
                        shouldDirty: true,
                      });
                    }}
                  />
                </Flex>
                {/* Action Buttons */}
                <Box className="w-full flex space-x-4  justify-end mt-4">
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
                      className="shadow-none bg-red-500 rounded flex items-center"
                      onClick={() => {
                        setOpenDeleteModal(true);
                        setSelectedBankAccount(bankAccount?.data);
                      }}
                      loading={
                        archiveResponse?.isLoading || restoreResponse?.isLoading
                      }
                      leftSection={
                        bankAccount?.data?.archivedAt ? (
                          <IconArrowBack size={15} />
                        ) : (
                          <IconTrash size={15} />
                        )
                      }
                    >
                      {bankAccount?.data?.archivedAt ? "Restore" : "Delete"}
                    </Button>
                  )}
                  <Button
                    variant="filled"
                    bg={"primary.4"}
                    type="submit"
                    loading={
                      editMode === "new"
                        ? createResponse?.isLoading
                        : updateResponse?.isLoading
                    }
                    leftSection={<IconDeviceFloppy size={15} />}
                  >
                    {editMode === "new" ? "Save" : "Update"}
                  </Button>
                </Box>
              </Box>
            </Box>
          </form>

          <Modal
            opened={openDeleteModal}
            onClose={() => setOpenDeleteModal(false)}
            title={`Delete Bank Account?`}
          >
            <p className="text-sm">
              Are you sure you want to delete this bank account? This action
              cannot be undone.
            </p>
            <Flex className="flex space-x-4 justify-end mt-4">
              <Button
                variant="outline"
                onClick={() => setOpenDeleteModal(false)}
                color="gray"
              >
                Cancel
              </Button>
              <Button
                variant="filled"
                color="red"
                onClick={handleDeleteBankAccount}
                loading={deleteResponse?.isLoading}
              >
                Delete
              </Button>
            </Flex>
          </Modal>
        </Box>
      ) : (
        <Box className="w-full">
          <tr className="flex border-t border-b border-dashed">
            <td className="w-1/3 p-2 bg-gray-100 text-gray-900 border-r">
              {"Owner Name"}
            </td>
            <td className="p-2">{props?.data?.ownerName}</td>
          </tr>
          <tr className="flex border-b border-dashed">
            <td className="w-1/3 p-2 bg-gray-100 text-gray-900 border-r">
              {"Account Number"}
            </td>
            <td className="p-2">{props.data?.accountNumber}</td>
          </tr>
        </Box>
      )}
    </Box>
  );
}
