import { AppError } from "@/src/models/app-interfaces";
import { Role } from "@/src/models/role.model";
import { User } from "@/src/models/user.model";
import {
  Collection,
  CollectionQuery,
} from "@/src/shared/models/collection.model";
import { collectionQueryBuilder } from "@/src/shared/utitlity/collection-query-builder";
import { appApi } from "@/src/store/app.api";
import { ROLE_ENDPOINT } from "./role.endpoint";
import { notifications } from "@mantine/notifications";

let roleCollection: CollectionQuery;
let userRoleCollection: CollectionQuery;
const roleQuery = appApi.injectEndpoints({
  endpoints: (builder) => ({
    getRole: builder.query<Role, string>({
      query: (id: string) => ({
        url: `${ROLE_ENDPOINT.detail}/${id}`,
        method: "get",
      }),
    }),
    getRoles: builder.query<Collection<Role>, CollectionQuery>({
      query: (data: CollectionQuery) => ({
        url: ROLE_ENDPOINT.list,
        method: "GET",
        params: collectionQueryBuilder(data),
      }),
      async onQueryStarted(param, { queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          if (data) {
            roleCollection = param;
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
    getArchivedRoles: builder.query<Collection<Role>, CollectionQuery>(
      {
        query: (data: CollectionQuery) => ({
          url: ROLE_ENDPOINT.listArchivedRoles,
          method: "GET",
          params: collectionQueryBuilder(data),
        }),
        async onQueryStarted(param, { queryFulfilled }) {
          try {
            const { data } = await queryFulfilled;
            if (data) {
              roleCollection = param;
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
      }
    ),
    createRole: builder.mutation<Role, Role>({
      query: (newData: Role) => ({
        url: `${ROLE_ENDPOINT.create}`,
        method: "post",
        data: newData,
      }),

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
              roleQuery.util.updateQueryData(
                "getRoles",
                roleCollection,
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
    updateRole: builder.mutation<Role, Role>({
      query: (newData: Role) => ({
        url: `${ROLE_ENDPOINT.update}`,
        method: "put",
        data: newData,
      }),

      async onQueryStarted(param, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          if (data) {
            dispatch(
              roleQuery.util.updateQueryData(
                "getRoles",
                roleCollection,
                (draft) => {
                  if (data) {
                    draft.data = draft?.data?.map((role) => {
                      if (role.id === data.id) {
                        return data;
                      } else {
                        return role;
                      }
                    });
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
    switchRole: builder.mutation<boolean, string>({
      query: (id: string) => ({
        url: `${ROLE_ENDPOINT.switch}/${id}`,
        method: "get",
      }),
      async onQueryStarted(param, { queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          if (data) {
            notifications.show({
              title: "Success",
              message: "Successfully switched",
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
    deleteRole: builder.mutation<boolean, string>({
      query: (id: string) => ({
        url: `${ROLE_ENDPOINT.delete}/${id}`,
        method: "delete",
      }),

      async onQueryStarted(id, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          if (data) {
            dispatch(
              roleQuery.util.updateQueryData(
                "getRoles",
                roleCollection,
                (draft) => {
                  if (data) {
                    draft.data = draft?.data?.filter(
                      (role) => role.id?.toString() !== id
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
    // get list of users per a role
    getUsersByRole: builder.query<Collection<User>, CollectionQuery>({
      query: (data: CollectionQuery) => ({
        url: `${ROLE_ENDPOINT.getUsersByRole}/${data.id}`,
        method: "GET",
        params: collectionQueryBuilder(data),
      }),
      async onQueryStarted(param, { queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          if (data) {
            userRoleCollection = param;
            console.log(userRoleCollection);
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
  useLazyGetRoleQuery,
  useLazyGetArchivedRolesQuery,
  useLazyGetRolesQuery,
  useCreateRoleMutation,
  useUpdateRoleMutation,
  useDeleteRoleMutation,
  useSwitchRoleMutation,
  useLazyGetUsersByRoleQuery,
} = roleQuery;
