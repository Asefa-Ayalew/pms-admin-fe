import { BankAccount } from "@/src/models/bank-account.model";
import { Tenant } from "@/src/models/tenant.model";
import { User } from "@/src/models/user.model";
import {
  Collection,
  CollectionQuery,
} from "@/src/shared/models/collection.model";
import { collectionQueryBuilder } from "@/src/shared/utitlity/collection-query-builder";
import { appApi } from "@/src/store/app.api";
import { notifications } from "@mantine/notifications";
import { BANK_ACCOUNT_ENDPOINT } from "./bank-account.endpoint";
import { AppError } from "@/src/models/app-interfaces";

let bankAccountCollection: CollectionQuery;
let tenantCollection: CollectionQuery;
let userCollection: CollectionQuery;

export const bankAccountQuery = appApi.injectEndpoints({
  endpoints: (builder) => ({
    getBankAccount: builder.query<BankAccount, CollectionQuery>({
      query: (data: CollectionQuery) => ({
        url: `${BANK_ACCOUNT_ENDPOINT.detail}/${data?.id}`,
        method: "GET",
        params: collectionQueryBuilder(data),
      }),
    }),

    getBankAccounts: builder.query<Collection<BankAccount>, CollectionQuery>({
      query: (data: CollectionQuery) => ({
        url: BANK_ACCOUNT_ENDPOINT.list,
        method: "GET",
        params: collectionQueryBuilder(data),
      }),
      providesTags: ["BankAccounts"],
      async onQueryStarted(param, { queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          if (data) {
            bankAccountCollection = param;
          }
        } catch (error: unknown) {
          notifications.show({
            title: "Error",
            message:
              (error as AppError)?.error?.data?.message || "Error, try again",
            color: "red",
          });
        }
      },
    }),

    createBankAccount: builder.mutation<BankAccount, BankAccount>({
      query: (newData: BankAccount) => ({
        url: `${BANK_ACCOUNT_ENDPOINT.create}`,
        method: "POST",
        data: newData,
      }),
      invalidatesTags: ["BankAccounts"],
      async onQueryStarted(param, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          if (data) {
            notifications.show({
              title: "Success",
              message: "Successfully created",
              color: "green",
            });

            dispatch(
              bankAccountQuery.util.updateQueryData(
                "getBankAccounts",
                bankAccountCollection,
                (draft) => {
                  if (data) {
                    draft.data.push(data);
                    draft.count += 1;
                  }
                }
              )
            );
          }
        } catch (error: unknown) {
          notifications.show({
            title: "Error",
            message:
              (error as AppError)?.error?.data?.message || "Error, try again",
            color: "red",
          });
        }
      },
    }),

    updateBankAccount: builder.mutation<BankAccount, BankAccount>({
      query: (newData: BankAccount) => ({
        url: `${BANK_ACCOUNT_ENDPOINT.update}`,
        method: "PUT",
        data: newData,
      }),
      invalidatesTags: ["BankAccounts"],
      async onQueryStarted(param, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          if (data) {
            dispatch(
              bankAccountQuery.util.updateQueryData(
                "getBankAccounts",
                bankAccountCollection,
                (draft) => {
                  if (data) {
                    draft.data = draft?.data?.map((item) =>
                      item.id === data.id ? data : item
                    );
                  }
                }
              )
            );

            notifications.show({
              title: "Success",
              message: "Successfully updated",
              color: "green",
            });
          }
        } catch (error: unknown) {
          notifications.show({
            title: "Error",
            message:
              (error as AppError)?.error?.data?.message || "Error, try again",
            color: "red",
          });
        }
      },
    }),
    archiveBankAccount: builder.mutation<BankAccount, any>({
      query: (data: any) => ({
        url: `${BANK_ACCOUNT_ENDPOINT.archive}/${data?.id}`,
        method: "DELETE",
      }),

      async onQueryStarted(param, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          if (data) {
            dispatch(
              bankAccountQuery.util.updateQueryData(
                "getBankAccounts",
                bankAccountCollection,
                (draft) => {
                  if (data) {
                    draft.data = draft?.data?.map((bankAccount) => {
                      if (bankAccount.id === data.id) return data;
                      else {
                        return bankAccount;
                      }
                    });
                  }
                }
              )
            );
            dispatch(
              bankAccountQuery.util.updateQueryData(
                "getBankAccount",
                param,
                (draft) => {
                  if (data) {
                    draft.archivedAt = data?.archivedAt;
                  }
                }
              )
            );
            notifications.show({
              title: "Success",
              message: "Successfully archived",
              color: "green",
            });
          }
        } catch (error: unknown) {
          notifications.show({
            title: "Error",
            message: (error as AppError)?.error?.data?.message
              ? (error as AppError)?.error?.data?.message
              : "Error try again",
            color: "red",
          });
        }
      },
    }),
    restoreBankAccount: builder.mutation<BankAccount, CollectionQuery>({
      query: (data: CollectionQuery) => ({
        url: `${BANK_ACCOUNT_ENDPOINT.restore}/${data?.id}`,
        method: "POST",
      }),

      async onQueryStarted(param, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          if (data) {
            dispatch(
              bankAccountQuery.util.updateQueryData(
                "getBankAccounts",
                bankAccountCollection,
                (draft) => {
                  if (data) {
                    draft.data = draft?.data?.map((bankAccount) => {
                      if (bankAccount.id === data.id)
                        return { ...data, archivedDate: null };
                      else {
                        return bankAccount;
                      }
                    });
                  }
                }
              )
            );
            dispatch(
              bankAccountQuery.util.updateQueryData(
                "getBankAccount",
                param,
                (draft) => {
                  if (data) {
                    draft.archivedAt = "";
                  }
                }
              )
            );
            notifications.show({
              title: "Success",
              message: "Successfully restored",
              color: "green",
            });
          }
        } catch (error: unknown) {
          notifications.show({
            title: "Error",
            message: (error as AppError)?.error?.data?.message
              ? (error as AppError)?.error?.data?.message
              : "Error try again",
            color: "red",
          });
        }
      },
    }),
    deleteBankAccount: builder.mutation<boolean, string>({
      query: (id: string) => ({
        url: `${BANK_ACCOUNT_ENDPOINT.delete}/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["BankAccounts"],
      async onQueryStarted(id, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          if (data) {
            dispatch(
              bankAccountQuery.util.updateQueryData(
                "getBankAccounts",
                bankAccountCollection,
                (draft) => {
                  if (data) {
                    draft.data = draft?.data?.filter(
                      (item) => item.id?.toString() !== id
                    );
                    draft.count -= 1;
                  }
                }
              )
            );
            notifications.show({
              title: "Success",
              message: "Successfully deleted",
              color: "green",
            });
          }
        } catch (error: unknown) {
          notifications.show({
            title: "Error",
            message:
              (error as AppError)?.error?.data?.message || "Error, try again",
            color: "red",
          });
        }
      },
    }),

    getUsers: builder.query<Collection<User>, CollectionQuery>({
      query: (data: CollectionQuery) => ({
        url: BANK_ACCOUNT_ENDPOINT.getUsers,
        method: "GET",
        params: collectionQueryBuilder(data),
      }),
      providesTags: ["Users"],
      async onQueryStarted(param, { queryFulfilled }) {
        try {
          console.log("b", userCollection);
          const { data } = await queryFulfilled;
          if (data) {
            userCollection = param;
          }
        } catch (error: unknown) {
          notifications.show({
            title: "Error",
            message: (error as AppError)?.error?.data?.message
              ? (error as AppError)?.error?.data?.message
              : "Error try again",
            color: "red",
          });
        }
      },
    }),

    getTenants: builder.query<Collection<Tenant>, CollectionQuery>({
      query: (data: CollectionQuery) => ({
        url: BANK_ACCOUNT_ENDPOINT.getTenants,
        method: "GET",
        params: collectionQueryBuilder(data),
      }),
      providesTags: ["Tenants"],
      async onQueryStarted(param, { queryFulfilled }) {
        try {
          console.log(tenantCollection);
          const { data } = await queryFulfilled;
          if (data) {
            tenantCollection = param;
          }
        } catch (error: unknown) {
          notifications.show({
            title: "Error",
            message:
              (error as AppError)?.error?.data?.message || "Error, try again",
            color: "red",
          });
        }
      },
    }),

    getTenant: builder.query<Tenant, CollectionQuery>({
      query: (data: CollectionQuery) => ({
        url: `${BANK_ACCOUNT_ENDPOINT.getTenant}/${data?.id}`,
        method: "GET",
        params: collectionQueryBuilder(data),
      }),
    }),
  }),

  overrideExisting: true,
});

export const {
  useLazyGetBankAccountQuery,
  useArchiveBankAccountMutation,
  useGetBankAccountQuery,
  useRestoreBankAccountMutation,
  useLazyGetBankAccountsQuery,
  useCreateBankAccountMutation,
  useUpdateBankAccountMutation,
  useDeleteBankAccountMutation,
  useLazyGetUsersQuery,
  useLazyGetTenantsQuery,
  useLazyGetTenantQuery,
} = bankAccountQuery;
