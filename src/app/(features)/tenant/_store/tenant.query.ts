import { AppError } from "@/src/models/app-interfaces";
import { Tenant } from "@/src/models/tenant.model";
import {
  Collection,
  CollectionQuery,
} from "@/src/shared/models/collection.model";
import { collectionQueryBuilder } from "@/src/shared/utitlity/collection-query-builder";
import { appApi } from "@/src/store/app.api";
import { TENANT_ENDPOINT } from "./tenant.endpoint";
import { notifications } from "@mantine/notifications";

let tenantCollection: CollectionQuery;

export const tenantQuery = appApi.injectEndpoints({
  endpoints: (builder) => ({
    getTenant: builder.query<Tenant, CollectionQuery>({
      query: (data: CollectionQuery) => ({
        url: `${TENANT_ENDPOINT.detail}/${data?.id}`,
        method: "GET",
        params: collectionQueryBuilder(data),
      }),
    }),

    getTenants: builder.query<Collection<Tenant>, CollectionQuery>({
      query: (data: CollectionQuery) => ({
        url: TENANT_ENDPOINT.list,
        method: "GET",
        params: collectionQueryBuilder(data),
      }),
      providesTags: ["Tenants"],
      async onQueryStarted(param, { queryFulfilled }) {
        try {
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

    createTenant: builder.mutation<Tenant, Tenant>({
      query: (newData: Tenant) => ({
        url: `${TENANT_ENDPOINT.create}`,
        method: "POST",
        data: newData,
      }),
      invalidatesTags: ["Tenants"],
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
              tenantQuery.util.updateQueryData(
                "getTenants",
                tenantCollection,
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

    updateTenant: builder.mutation<Tenant, Tenant>({
      query: (newData: Tenant) => ({
        url: `${TENANT_ENDPOINT.update}`,
        method: "PUT",
        data: newData,
      }),
      invalidatesTags: ["Tenants"],
      async onQueryStarted(param, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          if (data) {
            dispatch(
              tenantQuery.util.updateQueryData(
                "getTenants",
                tenantCollection,
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
    archiveTenant: builder.mutation<Tenant, any>({
      query: (data: any) => ({
        url: `${TENANT_ENDPOINT.archive}/${data?.id}`,
        method: "DELETE",
      }),

      async onQueryStarted(param, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          if (data) {
            dispatch(
              tenantQuery.util.updateQueryData(
                "getTenants",
                tenantCollection,
                (draft) => {
                  if (data) {
                    draft.data = draft?.data?.map((tenant) => {
                      if (tenant.id === data.id) return data;
                      else {
                        return tenant;
                      }
                    });
                  }
                }
              )
            );
            dispatch(
              tenantQuery.util.updateQueryData("getTenant", param, (draft) => {
                if (data) {
                  draft.archivedAt = data?.archivedAt;
                }
              })
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
              (error as AppError)?.error?.data?.message ?? "Error, try again",
            color: "red",
          });
        }
      },
    }),
    restoreTenant: builder.mutation<Tenant, CollectionQuery>({
      query: (data: CollectionQuery) => ({
        url: `${TENANT_ENDPOINT.restore}/${data?.id}`,
        method: "POST",
      }),

      async onQueryStarted(param, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          if (data) {
            dispatch(
              tenantQuery.util.updateQueryData(
                "getTenants",
                tenantCollection,
                (draft) => {
                  if (data) {
                    draft.data = draft?.data?.map((tenant) => {
                      if (tenant.id === data.id)
                        return { ...data, archivedDate: null };
                      else {
                        return tenant;
                      }
                    });
                  }
                }
              )
            );
            dispatch(
              tenantQuery.util.updateQueryData("getTenant", param, (draft) => {
                if (data) {
                  draft.archivedAt = "";
                }
              })
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
    deleteTenant: builder.mutation<boolean, string>({
      query: (id: string) => ({
        url: `${TENANT_ENDPOINT.delete}/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Tenants"],
      async onQueryStarted(id, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          if (data) {
            dispatch(
              tenantQuery.util.updateQueryData(
                "getTenants",
                tenantCollection,
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
  useLazyGetTenantQuery,
  useArchiveTenantMutation,
  useGetTenantQuery,
  useRestoreTenantMutation,
  useLazyGetTenantsQuery,
  useCreateTenantMutation,
  useUpdateTenantMutation,
  useDeleteTenantMutation,
} = tenantQuery;
