import { MyOrganization } from "@/src/models/my-organization.model";
import {
  Collection,
  CollectionQuery,
} from "@/src/shared/models/collection.model";
import { collectionQueryBuilder } from "@/src/shared/utitlity/collection-query-builder";
import { appApi } from "@/src/store/app.api";
import { notifications } from "@mantine/notifications";
import { MY_ORGANIZATION_ENDPOINT } from "./my-organization.endpoint";

let myOrganizationCollection: CollectionQuery;

export const myOrganizationQuery = appApi.injectEndpoints({
  endpoints: (builder) => ({
    getMyOrganization: builder.query<MyOrganization, CollectionQuery>({
      query: (data: CollectionQuery) => ({
        url: `${ MY_ORGANIZATION_ENDPOINT.detail}/${data?.id}`,
        method: "GET",
        params: collectionQueryBuilder(data),
      }),
    }),

    getMyOrganizations: builder.query<Collection<MyOrganization>, CollectionQuery>({
      query: (data: CollectionQuery) => ({
        url: MY_ORGANIZATION_ENDPOINT.list,
        method: "GET",
        params: collectionQueryBuilder(data),
      }),
      providesTags: ["Tenants"],
      async onQueryStarted(param, { queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          if (data) {
            myOrganizationCollection = param;
          }
        } catch (error: any) {
          notifications.show({
            title: "Error",
            message: error?.error?.data?.message || "Error, try again",
            color: "red",
          });
        }
      },
    }),

    createMyOrganization: builder.mutation<MyOrganization, MyOrganization>({
      query: (newData: any) => ({
        url: `${ MY_ORGANIZATION_ENDPOINT.create}`,
        method: "POST",
        data: newData,
      }),
      invalidatesTags: ["MyOrganizations"],
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
              myOrganizationQuery.util.updateQueryData(
                "getMyOrganizations",
                myOrganizationCollection,
                (draft) => {
                  if (data) {
                    draft.data.push(data);
                    draft.count += 1;
                  }
                }
              )
            );
          }
        } catch (error: any) {
          notifications.show({
            title: "Error",
            message: error?.error?.data?.message || "Error, try again",
            color: "red",
          });
        }
      },
    }),

    updateMyOrganization: builder.mutation<MyOrganization, MyOrganization>({
      query: (newData: MyOrganization) => ({
        url: `${ MY_ORGANIZATION_ENDPOINT.update}`,
        method: "PUT",
        data: newData,
      }),
      invalidatesTags: ["MyOrganizationInfo"],
      async onQueryStarted(param, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          if (data) {
            dispatch(
              myOrganizationQuery.util.updateQueryData(
                "getMyOrganizations",
                myOrganizationCollection,
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
        } catch (error: any) {
          notifications.show({
            title: "Error",
            message: error?.error?.data?.message || "Error, try again",
            color: "red",
          });
        }
      },
    }),
    archiveMyOrganization: builder.mutation<MyOrganization, CollectionQuery>({
      query: (data: CollectionQuery) => ({
        url: `${ MY_ORGANIZATION_ENDPOINT.archive}/${data?.id}`,
        method: "DELETE",
      }),

      async onQueryStarted(param, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          if (data) {
            dispatch(
              myOrganizationQuery.util.updateQueryData(
                "getMyOrganizations",
                myOrganizationCollection,
                (draft) => {
                  if (data) {
                    draft.data = draft?.data?.map((myOrganization) => {
                      if (myOrganization.id === data.id) return data;
                      else {
                        return myOrganization;
                      }
                    });
                  }
                }
              )
            );
            dispatch(
              myOrganizationQuery.util.updateQueryData("getMyOrganization", param, (draft) => {
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
        } catch (error: any) {
          notifications.show({
            title: "Error",
            message: error?.error?.data?.message
              ? error?.error?.data?.message
              : "Error try again",
            color: "red",
          });
        }
      },
    }),
    restoreMyOrganization: builder.mutation<MyOrganization, CollectionQuery>({
      query: (data: CollectionQuery) => ({
        url: `${ MY_ORGANIZATION_ENDPOINT.restore }/${data?.id}`,
        method: "POST",
      }),

      async onQueryStarted(param, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          if (data) {
            dispatch(
              myOrganizationQuery.util.updateQueryData(
                "getMyOrganizations",
                myOrganizationCollection,
                (draft) => {
                  if (data) {
                    draft.data = draft?.data?.map((myOrganization) => {
                      if (myOrganization.id === data.id)
                        return { ...data, archivedDate: null };
                      else {
                        return myOrganization;
                      }
                    });
                  }
                }
              )
            );
            dispatch(
              myOrganizationQuery.util.updateQueryData("getMyOrganization", param, (draft) => {
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
        } catch (error: any) {
          notifications.show({
            title: "Error",
            message: error?.error?.data?.message
              ? error?.error?.data?.message
              : "Error try again",
            color: "red",
          });
        }
      },
    }),
    deleteMyOrganization: builder.mutation<boolean, string>({
      query: (id: string) => ({
        url: `${ MY_ORGANIZATION_ENDPOINT.delete}/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["MyOrganizations"],
      async onQueryStarted(id, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          if (data) {
            dispatch(
              myOrganizationQuery.util.updateQueryData(
                "getMyOrganizations",
                myOrganizationCollection,
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
        } catch (error: any) {
          notifications.show({
            title: "Error",
            message: error?.error?.data?.message || "Error, try again",
            color: "red",
          });
        }
      },
    }),
  }),

  overrideExisting: true,
});

export const {
  useLazyGetMyOrganizationQuery,
  useArchiveMyOrganizationMutation,
  useGetMyOrganizationQuery,
  useRestoreMyOrganizationMutation,
  useLazyGetMyOrganizationsQuery,
  useCreateMyOrganizationMutation,
  useUpdateMyOrganizationMutation,
  useDeleteMyOrganizationMutation,
} = myOrganizationQuery;
