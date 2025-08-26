import { AppError } from "@/src/models/app-interfaces";
import { EmergencyContact } from "@/src/models/emergency-contact.model";
import { User } from "@/src/models/user.model";
import {
  Collection,
  CollectionQuery,
} from "@/src/shared/models/collection.model";
import { collectionQueryBuilder } from "@/src/shared/utitlity/collection-query-builder";
import { appApi } from "@/src/store/app.api";
import { EMERGENCY_CONTACT_ENDPOINT } from "./emergency-contact.endpoint";
import { notifications } from "@mantine/notifications";

let emergencyContactCollection: CollectionQuery;

export const emergencyContactQuery = appApi.injectEndpoints({
  endpoints: (builder) => ({
    getEmergencyContact: builder.query<EmergencyContact, CollectionQuery>({
      query: (data: CollectionQuery) => ({
        url: `${EMERGENCY_CONTACT_ENDPOINT.detail}/${data?.id}`,
        method: "GET",
        params: collectionQueryBuilder(data),
      }),
    }),

    getEmergencyContacts: builder.query<
      Collection<EmergencyContact>,
      CollectionQuery
    >({
      query: (data: CollectionQuery) => ({
        url: EMERGENCY_CONTACT_ENDPOINT.list,
        method: "GET",
        params: collectionQueryBuilder(data),
      }),
      providesTags: ["EmergencyContacts"],
      async onQueryStarted(param, { queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          if (data) {
            emergencyContactCollection = param;
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

    createEmergencyContact: builder.mutation<
      EmergencyContact,
      EmergencyContact
    >({
      query: (newData: EmergencyContact) => ({
        url: `${EMERGENCY_CONTACT_ENDPOINT.create}`,
        method: "POST",
        data: newData,
      }),
      invalidatesTags: ["EmergencyContacts"],
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
              emergencyContactQuery.util.updateQueryData(
                "getEmergencyContacts",
                emergencyContactCollection,
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

    updateEmergencyContact: builder.mutation<
      EmergencyContact,
      EmergencyContact
    >({
      query: (newData: EmergencyContact) => ({
        url: `${EMERGENCY_CONTACT_ENDPOINT.update}`,
        method: "PUT",
        data: newData,
      }),
      invalidatesTags: ["EmergencyContacts"],
      async onQueryStarted(param, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          if (data) {
            dispatch(
              emergencyContactQuery.util.updateQueryData(
                "getEmergencyContacts",
                emergencyContactCollection,
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
    archiveEmergencyContact: builder.mutation<
      EmergencyContact,
      CollectionQuery
    >({
      query: (data: CollectionQuery) => ({
        url: `${EMERGENCY_CONTACT_ENDPOINT.archive}`,
        data,
        method: "DELETE",
      }),

      async onQueryStarted(param, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          if (data) {
            dispatch(
              emergencyContactQuery.util.updateQueryData(
                "getEmergencyContacts",
                emergencyContactCollection,
                (draft) => {
                  if (data) {
                    draft.data = draft?.data?.map((emergencyContact) => {
                      if (emergencyContact.id === data.id) return data;
                      else {
                        return emergencyContact;
                      }
                    });
                  }
                }
              )
            );
            dispatch(
              emergencyContactQuery.util.updateQueryData(
                "getEmergencyContact",
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
    restoreEmergencyContact: builder.mutation<
      EmergencyContact,
      CollectionQuery
    >({
      query: (data: CollectionQuery) => ({
        url: `${EMERGENCY_CONTACT_ENDPOINT.restore}/${data?.id}`,
        method: "POST",
      }),

      async onQueryStarted(param, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          if (data) {
            dispatch(
              emergencyContactQuery.util.updateQueryData(
                "getEmergencyContacts",
                emergencyContactCollection,
                (draft) => {
                  if (data) {
                    draft.data = draft?.data?.map((emergencyContact) => {
                      if (emergencyContact.id === data.id)
                        return { ...data, archivedDate: null };
                      else {
                        return emergencyContact;
                      }
                    });
                  }
                }
              )
            );
            dispatch(
              emergencyContactQuery.util.updateQueryData(
                "getEmergencyContact",
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
    deleteEmergencyContact: builder.mutation<boolean, string>({
      query: (id: string) => ({
        url: `${EMERGENCY_CONTACT_ENDPOINT.delete}/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["EmergencyContacts"],
      async onQueryStarted(id, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          if (data) {
            dispatch(
              emergencyContactQuery.util.updateQueryData(
                "getEmergencyContacts",
                emergencyContactCollection,
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

    getUser: builder.query<User, CollectionQuery>({
      query: (data: CollectionQuery) => ({
        url: `${EMERGENCY_CONTACT_ENDPOINT.getUser}/${data?.id}`,
        method: "get",
        params: collectionQueryBuilder(data),
      }),
    }),
  }),

  overrideExisting: true,
});

export const {
  useLazyGetEmergencyContactQuery,
  useArchiveEmergencyContactMutation,
  useGetEmergencyContactQuery,
  useRestoreEmergencyContactMutation,
  useLazyGetEmergencyContactsQuery,
  useCreateEmergencyContactMutation,
  useUpdateEmergencyContactMutation,
  useDeleteEmergencyContactMutation,
  useLazyGetUserQuery,
} = emergencyContactQuery;
