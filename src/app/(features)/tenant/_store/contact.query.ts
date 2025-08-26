import { AppError } from "@/src/models/app-interfaces";
import { appApi } from "@/src/store/app.api";
import { notifications } from "@mantine/notifications";
import { CONTACT_ENDPOINT } from "./contact.endpoint";
import { Contact } from "@/src/models/tenant.model";
import { tenantQuery } from "./tenant.query";

export const contactQuery = appApi.injectEndpoints({
  endpoints: (builder) => ({
    createContact: builder.mutation<Contact, Contact>({
      query: (newData: Contact) => ({
        url: `${CONTACT_ENDPOINT.create}`,
        method: "POST",
        data: newData,
      }),
      invalidatesTags: ["Tenants"],
      async onQueryStarted(newData, { dispatch, queryFulfilled }) {
        try {
          const { data: updatedTenant } = await queryFulfilled;
          if (updatedTenant?.id) {
            dispatch(
              tenantQuery.util.updateQueryData(
                "getTenant",
                { id: updatedTenant.id, includes: ["contacts"] },
                (draft) => {
                  Object.assign(draft, updatedTenant);
                }
              )
            );
          }
        } catch (error) {
          notifications.show({
            title: "Error",
            message:
              (error as AppError)?.error?.data?.message || "Error, try again",
            color: "red",
          });
        }
      },
    }),

    updateContact: builder.mutation<Contact, Contact>({
      query: (newData: Contact) => ({
        url: `${CONTACT_ENDPOINT.update}`,
        method: "PUT",
        data: newData,
      }),
      invalidatesTags: ["Tenants"],
      async onQueryStarted(newData, { dispatch, queryFulfilled }) {
        try {
          const { data: updatedTenant } = await queryFulfilled;
          if (updatedTenant?.id) {
            dispatch(
              tenantQuery.util.updateQueryData(
                "getTenant",
                { id: updatedTenant.id, includes: ["contacts"] },
                (draft) => {
                  Object.assign(draft, updatedTenant);
                }
              )
            );
          }
        } catch (error) {
          notifications.show({
            title: "Error",
            message:
              (error as AppError)?.error?.data?.message || "Error, try again",
            color: "red",
          });
        }
      },
    }),

    deleteContact: builder.mutation<Contact, string>({
      query: (id: string) => ({
        url: `${CONTACT_ENDPOINT.delete}/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Tenants"],
      async onQueryStarted(newData, { dispatch, queryFulfilled }) {
        try {
          const { data: updatedTenant } = await queryFulfilled;
          if (updatedTenant?.id) {
            dispatch(
              tenantQuery.util.updateQueryData(
                "getTenant",
                { id: updatedTenant.id, includes: ["contacts"] },
                (draft) => {
                  Object.assign(draft, updatedTenant);
                }
              )
            );
          }
        } catch (error) {
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
  useCreateContactMutation,
  useUpdateContactMutation,
  useDeleteContactMutation,
} = contactQuery;
