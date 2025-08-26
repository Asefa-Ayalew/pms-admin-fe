import { appApi } from "@/src/store/app.api";
import { serviceEndpoint } from "./service.endpoint";
import { Property } from "@/src/models/property.model";
import { propertyQuery } from "./property.query";
import { notifications } from "@mantine/notifications";
import { AppError } from "@/src/models/app-interfaces";
import { Service } from "@/src/models/service.model";
import { collectionQueryBuilder } from "@/src/shared/utitlity/collection-query-builder";
import { Collection, CollectionQuery } from "@/src/shared/models/collection.model";

export const serviceQuery = appApi.injectEndpoints({
  endpoints: (builder) => ({
    getServices: builder.query<Collection<Service>, CollectionQuery>({
      query: (data: CollectionQuery) => ({
        url: serviceEndpoint.list,
        method: "GET",
        params: collectionQueryBuilder(data),
      }),
      providesTags: ["Services"],
    }),
    getService: builder.query<Service, CollectionQuery>({
      query: (data: CollectionQuery) => ({
        url: `${serviceEndpoint.detail}/${data?.id}`,
        method: "GET",
        params: collectionQueryBuilder(data),
      }),
    }),

    getArchivedServices: builder.query<Collection<Service>, CollectionQuery>({
      query: (data: CollectionQuery) => ({
        url: serviceEndpoint.listArchivedServices,
        method: "GET",
        params: collectionQueryBuilder(data),
      }),
    }),

    createPropertyService: builder.mutation<Property, Service>({
      query: (newData) => ({
        url: serviceEndpoint.create,
        method: "POST",
        data: newData,
      }),
      invalidatesTags: ["Properties"],
      async onQueryStarted(newData, { dispatch, queryFulfilled }) {
        try {
          const { data: updatedProperty } = await queryFulfilled;
          if (updatedProperty?.id) {
            dispatch(
              propertyQuery.util.updateQueryData(
                "getProperty",
                { id: updatedProperty.id, includes: ["services"] },
                (draft) => {
                  Object.assign(draft, updatedProperty);
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

    updatePropertyService: builder.mutation<Property, Service>({
      query: (newData: Service) => ({
        url: `${serviceEndpoint.update}`,
        method: "POST",
        data: newData,
      }),
      invalidatesTags: ["Properties"],
      async onQueryStarted(newData, { dispatch, queryFulfilled }) {
        try {
          const { data: updatedProperty } = await queryFulfilled;
          if (updatedProperty?.id) {
            dispatch(
              propertyQuery.util.updateQueryData(
                "getProperty",
                { id: updatedProperty.id, includes: ["services"] },
                (draft) => {
                  Object.assign(draft, updatedProperty);
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

    deletePropertyService: builder.mutation<Property, Property>({
      query: (data) => ({
        url: `${serviceEndpoint.delete}`,
        method: "POST",
        data: data,
      }),
      invalidatesTags: ["Properties"],
      async onQueryStarted(serviceId, { dispatch, queryFulfilled }) {
        try {
          const { data: updatedProperty } = await queryFulfilled;
          if (updatedProperty?.id) {
            dispatch(
              propertyQuery.util.updateQueryData(
                "getProperty",
                { id: updatedProperty.id, includes: ["services"] },
                (draft) => {
                  Object.assign(draft, updatedProperty);
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
  useLazyGetServiceQuery,
  useLazyGetArchivedServicesQuery,
  useLazyGetServicesQuery,
  useCreatePropertyServiceMutation,
  useUpdatePropertyServiceMutation,
  useDeletePropertyServiceMutation,
} = serviceQuery;
