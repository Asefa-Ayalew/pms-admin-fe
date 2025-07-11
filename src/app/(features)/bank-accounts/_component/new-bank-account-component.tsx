"use client";

import { BankAccount, OwnerType } from "@/src/models/bank-account.model";
import { NewBankAccountSchema } from "@/src/schemas/new-bank-account-schema";
import BankListJson from "@/src/shared/constants/bank-list.json";
import { CollectionQuery } from "@/src/shared/models/collection.model";
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
import { useForm, SubmitErrorHandler } from "react-hook-form";
import z from "zod";
import {
  useCreateBankAccountMutation,
  useDeleteBankAccountMutation,
  useLazyGetBankAccountQuery,
  useLazyGetUsersQuery,
  useUpdateBankAccountMutation,
} from "../_store/bank-account.query";
import { User } from "@/src/models/user.model";

interface Props {
  editMode: "new" | "detail";
  onCreating?: (data: BankAccount) => void;
}

type FormSchema = z.infer<typeof NewBankAccountSchema>;

const defaultValue: BankAccount = {
  accountNumber: "",
  bankName: "",
  bankCode: "",
  ownerName: "",
  ownerId: "",
  isPreferred: true,
  ownerType: OwnerType.INDIVIDUAL,
};

const bankCodes = BankListJson.map((bank) => ({
  value: bank.bankCode,
  label: `${bank.name}`,
})).filter(
  (value, index, self) =>
    index === self.findIndex((t) => t.value === value.value)
);

export default function NewBankAccountComponent(props: Props) {
  const { editMode, onCreating } = props;
  const params = useParams();
  const navigate = useRouter();

  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [selectedBankAccount, setSelectedBankAccount] = useState<BankAccount>();

  // Fetching bank account, users, and tenants
  const [getBankAccount, bankAccount] = useLazyGetBankAccountQuery();
  const [createBankAccount, createResponse] = useCreateBankAccountMutation();
  const [updateBankAccount, updateResponse] = useUpdateBankAccountMutation();
  const [deleteBankAccount, deleteResponse] = useDeleteBankAccountMutation();

  const [getUsers, users] = useLazyGetUsersQuery();
  const [collection] = useState<CollectionQuery>({
    skip: 0,
    top: 50,
    orderBy: [{ field: "createdAt", direction: "desc" }],
  });

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

  // Fetch bank account details when in 'detail' mode
  useEffect(() => {
    getUsers(collection);
    if (editMode === "detail" && params?.id) {
      getBankAccount({ id: `${params?.id}` }).then((response) => {
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
  }, [params?.id, editMode, collection, getUsers]);

  // Form submission handler
  function onSubmit(data: BankAccount) {
    console.log("data", data);
    const currentData = {
      ...data,
      // tenantId: currentUser?tenantId,
    };
    if (editMode === "new") {
      createBankAccount(currentData).then((response) => {
        if (response?.data) {
          onCreating?.(response?.data);
          if (!onCreating) {
            navigate.push(`/bank-accounts/detail/${response?.data?.id}`);
          }
        }
      });
    } else {
      const updatedData = {
        ...data,
        id: `${params?.id}`,
      };
      console.log("requested Tenant", updatedData?.tenantId);
      updateBankAccount(updatedData).then((response) => {
        console.log("response Tenant", response?.data?.tenantId);
        if (response?.data) {
          setValue("tenantId", updatedData.tenantId);
          navigate.push(`/bank-accounts/detail/${response?.data?.id}`);
        }
      });
    }
  }

  // Delete bank account handler
  function handleDeleteBankAccount() {
    if (!selectedBankAccount?.id) return;

    deleteBankAccount(`${params?.id}`).then((response) => {
      if (response?.data) {
        setOpenDeleteModal(false);
        navigate.push("/bank-accounts");
      }
    });
  }

  const onError: SubmitErrorHandler<FormSchema> = (errors) => {
    console.log("Form Errors", errors);
  };
  const isPreferred = watch("isPreferred");
  const ownerLists = users?.data?.data?.map((user: User) => ({
    value: user.id,
    label: `${user.firstName} ${user.lastName}`,
  }));

  return (
    <div className="w-full p-4 flex-col space-y-4 buser">
      <div className="flex px-4 buser-0 buser-b-2">
        <h3 className="text-2xl font-semibold">
          {editMode === "new" ? "New Bank Account" : ""}
        </h3>
      </div>
      <div className="w-full flex justify-center relative">
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
          <div className="flex w-full justify-center">
            <div className="px-2 w-4/5 mt-4 flex-col space-y-4">
              {/* Account Number Input */}
              <div className="flex space-x-4 mt-4">
                <TextInput
                  label="Account Number"
                  className="w-full"
                  required
                  placeholder="Account Number"
                  {...register("accountNumber")}
                  error={errors?.accountNumber?.message}
                />

                {/* Bank Select Dropdown */}

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
              <div className="flex space-x-4 mt-4">
                <Select
                  label="Owner"
                  className="w-full"
                  data={
                    ownerLists?.filter((user) => user.value !== undefined) as {
                      value: string;
                      label: string;
                    }[]
                  }
                  value={watch("ownerId")}
                  onChange={(value) => {
                    const selectedUser = ownerLists?.find(
                      (user) => user.value === value
                    );
                    setValue("ownerId", selectedUser?.value ?? "");
                    setValue("ownerName", selectedUser?.label ?? "");
                  }}
                  searchable
                />
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
              </div>
              <div className="flex space-x-4 mt-4">
                <Switch
                  className="mt-7"
                  checked={isPreferred}
                  label="Is Preferred?"
                  onChange={(e) => {
                    setValue("isPreferred", e.currentTarget.checked, {
                      shouldValidate: true,
                      shouldDirty: true,
                    });
                  }}
                />
              </div>

              {/* Action Buttons */}
              <div className="w-full flex space-x-4 justify-end mt-4">
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
                  Save
                </Button>
              </div>
            </div>
          </div>
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
          <div className="flex space-x-4 justify-end mt-4">
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
          </div>
        </Modal>
      </div>
    </div>
  );
}
