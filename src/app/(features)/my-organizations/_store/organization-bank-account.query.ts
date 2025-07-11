import { AppError } from "@/src/models/app-interfaces";
import { OrganizationBankAccount } from "@/src/models/organization-bank-account.model";
import {
  Collection,
  CollectionQuery,
} from "@/src/shared/models/collection.model";
import { collectionQueryBuilder } from "@/src/shared/utitlity/collection-query-builder";
import { appApi } from "@/src/store/app.api";
import { ORGANIZATION_BANK_ACCOUNT_ENDPOINT } from "./organization-bank-account.endpoint";
import { notifications } from "@mantine/notifications";

let organizationBankAccountCollection: CollectionQuery;

export const organizationBankAccountQuery = appApi.injectEndpoints({
  endpoints: (builder) => ({
    getOrganizationBankAccount: builder.query<
      OrganizationBankAccount,
      CollectionQuery
    >({
      query: (data: CollectionQuery) => ({
        url: `${ORGANIZATION_BANK_ACCOUNT_ENDPOINT.detail}/${data?.id}`,
        method: "GET",
        params: collectionQueryBuilder(data),
      }),
    }),

    getOrganizationBankAccounts: builder.query<
      Collection<OrganizationBankAccount>,
      CollectionQuery
    >({
      query: (data: CollectionQuery) => ({
        url: ORGANIZATION_BANK_ACCOUNT_ENDPOINT.list,
        method: "GET",
        params: collectionQueryBuilder(data),
      }),
      providesTags: ["OrganizationBankAccounts"],
      async onQueryStarted(param, { queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          if (data) {
            organizationBankAccountCollection = param;
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

    createOrganizationBankAccount: builder.mutation<
      OrganizationBankAccount,
      OrganizationBankAccount
    >({
      query: (newData: OrganizationBankAccount) => ({
        url: `${ORGANIZATION_BANK_ACCOUNT_ENDPOINT.create}`,
        method: "POST",
        data: newData,
      }),
      invalidatesTags: ["OrganizationBankAccounts"],
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
              organizationBankAccountQuery.util.updateQueryData(
                "getOrganizationBankAccounts",
                organizationBankAccountCollection,
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

    updateOrganizationBankAccount: builder.mutation<
      OrganizationBankAccount,
      OrganizationBankAccount
    >({
      query: (newData: OrganizationBankAccount) => ({
        url: `${ORGANIZATION_BANK_ACCOUNT_ENDPOINT.update}`,
        method: "PUT",
        data: newData,
      }),
      invalidatesTags: ["OrganizationBankAccountInfo"],
      async onQueryStarted(param, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          if (data) {
            dispatch(
              organizationBankAccountQuery.util.updateQueryData(
                "getOrganizationBankAccounts",
                organizationBankAccountCollection,
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
    archiveOrganizationBankAccount: builder.mutation<
      OrganizationBankAccount,
      CollectionQuery
    >({
      query: (data: CollectionQuery) => ({
        url: `${ORGANIZATION_BANK_ACCOUNT_ENDPOINT.archive}/${data?.id}`,
        method: "DELETE",
      }),

      async onQueryStarted(param, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          if (data) {
            dispatch(
              organizationBankAccountQuery.util.updateQueryData(
                "getOrganizationBankAccounts",
                organizationBankAccountCollection,
                (draft) => {
                  if (data) {
                    draft.data = draft?.data?.map((organizationBankAccount) => {
                      if (organizationBankAccount.id === data.id) return data;
                      else {
                        return organizationBankAccount;
                      }
                    });
                  }
                }
              )
            );
            dispatch(
              organizationBankAccountQuery.util.updateQueryData(
                "getOrganizationBankAccount",
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
            message:
              (error as AppError)?.error?.data?.message || "Error, try again",
            color: "red",
          });
        }
      },
    }),
    restoreOrganizationBankAccount: builder.mutation<
      OrganizationBankAccount,
      CollectionQuery
    >({
      query: (data: CollectionQuery) => ({
        url: `${ORGANIZATION_BANK_ACCOUNT_ENDPOINT.restore}/${data?.id}`,
        method: "POST",
      }),

      async onQueryStarted(param, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          if (data) {
            dispatch(
              organizationBankAccountQuery.util.updateQueryData(
                "getOrganizationBankAccounts",
                organizationBankAccountCollection,
                (draft) => {
                  if (data) {
                    draft.data = draft?.data?.map((organizationBankAccount) => {
                      if (organizationBankAccount.id === data.id)
                        return { ...data, archivedDate: null };
                      else {
                        return organizationBankAccount;
                      }
                    });
                  }
                }
              )
            );
            dispatch(
              organizationBankAccountQuery.util.updateQueryData(
                "getOrganizationBankAccount",
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
            message:
              (error as AppError)?.error?.data?.message || "Error, try again",
            color: "red",
          });
        }
      },
    }),
    deleteOrganizationBankAccount: builder.mutation<boolean, string>({
      query: (id: string) => ({
        url: `${ORGANIZATION_BANK_ACCOUNT_ENDPOINT.delete}/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["OrganizationBankAccounts"],
      async onQueryStarted(id, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          if (data) {
            dispatch(
              organizationBankAccountQuery.util.updateQueryData(
                "getOrganizationBankAccounts",
                organizationBankAccountCollection,
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
  }),

  overrideExisting: true,
});

export const {
  useLazyGetOrganizationBankAccountQuery,
  useArchiveOrganizationBankAccountMutation,
  useGetOrganizationBankAccountQuery,
  useRestoreOrganizationBankAccountMutation,
  useLazyGetOrganizationBankAccountsQuery,
  useCreateOrganizationBankAccountMutation,
  useUpdateOrganizationBankAccountMutation,
  useDeleteOrganizationBankAccountMutation,
} = organizationBankAccountQuery;
