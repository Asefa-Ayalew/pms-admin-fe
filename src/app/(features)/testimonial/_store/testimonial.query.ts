import { Tenant } from "@/src/models/tenant.model";
import { User } from "@/src/models/user.model";
import {
  Collection,
  CollectionQuery,
} from "@/src/shared/models/collection.model";
import { collectionQueryBuilder } from "@/src/shared/utitlity/collection-query-builder";
import { appApi } from "@/src/store/app.api";
import { notifications } from "@mantine/notifications";
import { AppError } from "@/src/models/app-interfaces";
import { Testimonial } from "@/src/models/testimonial.model";
import { TESTIMONIAL_ENDPOINT } from "./testimonial.endpoint";

let testimonialCollection: CollectionQuery;
let tenantCollection: CollectionQuery;
let userCollection: CollectionQuery;

export const testimonialQuery = appApi.injectEndpoints({
  endpoints: (builder) => ({
    getTestimonial: builder.query<Testimonial, CollectionQuery>({
      query: (data: CollectionQuery) => ({
        url: `${TESTIMONIAL_ENDPOINT.detail}/${data?.id}`,
        method: "GET",
        params: collectionQueryBuilder(data),
      }),
    }),

    getTestimonials: builder.query<Collection<Testimonial>, CollectionQuery>({
      query: (data: CollectionQuery) => ({
        url: TESTIMONIAL_ENDPOINT.list,
        method: "GET",
        params: collectionQueryBuilder(data),
      }),
      providesTags: ["Testimonials"],
      async onQueryStarted(param, { queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          if (data) {
            testimonialCollection = param;
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

    createTestimonial: builder.mutation<Testimonial, Testimonial>({
      query: (newData: Testimonial) => ({
        url: `${TESTIMONIAL_ENDPOINT.create}`,
        method: "POST",
        data: newData,
      }),
      invalidatesTags: ["Testimonials"],
      async onQueryStarted(param, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          if (data) {
            dispatch(
              testimonialQuery.util.updateQueryData(
                "getTestimonials",
                testimonialCollection,
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

    updateTestimonial: builder.mutation<Testimonial, Testimonial>({
      query: (newData: Testimonial) => ({
        url: `${TESTIMONIAL_ENDPOINT.update}`,
        method: "PUT",
        data: newData,
      }),
      invalidatesTags: ["Testimonials"],
      async onQueryStarted(param, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          if (data) {
            dispatch(
              testimonialQuery.util.updateQueryData(
                "getTestimonials",
                testimonialCollection,
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
    getArchivedTestimonials: builder.query<Collection<Testimonial>, CollectionQuery>({
      query: (data: CollectionQuery) => ({
        url: TESTIMONIAL_ENDPOINT.listArchivedTestimonials,
        method: "GET",
        params: collectionQueryBuilder(data),
      }),
      async onQueryStarted(param, { queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          if (data) {
            testimonialCollection = param;
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
    archiveTestimonial: builder.mutation<Testimonial, { id: string; remark: string }>({
      query: (data) => ({
        url: `${TESTIMONIAL_ENDPOINT.archive}`,
        data,
        method: "DELETE",
      }),
      invalidatesTags: ["Testimonials"],
      async onQueryStarted(param, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          if (data) {
            dispatch(
              testimonialQuery.util.updateQueryData(
                "getTestimonials",
                testimonialCollection,
                (draft) => {
                  if (data) {
                    draft.data = draft?.data?.map((testimonial) => {
                      if (testimonial.id === data.id) return data;
                      else {
                        return testimonial;
                      }
                    });
                  }
                }
              )
            );
            dispatch(
              testimonialQuery.util.updateQueryData(
                "getTestimonial",
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
    restoreTestimonial: builder.mutation<Testimonial, string>({
      query: (id: string) => ({
        url: `${TESTIMONIAL_ENDPOINT.restore}/${id}`,
        method: "POST",
      }),

      async onQueryStarted(param, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          if (data) {
            dispatch(
              testimonialQuery.util.updateQueryData(
                "getArchivedTestimonials",
                testimonialCollection,
                (draft) => {
                  if (draft?.data) {
                    draft.data = draft.data.filter(
                      (testimonial) => testimonial.id !== data.id
                    );
                  }
                }
              )
            );
            notifications.show({
              title: "Success",
              message: "Successfully Restored",
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
    deleteTestimonial: builder.mutation<boolean, string>({
      query: (id: string) => ({
        url: `${TESTIMONIAL_ENDPOINT.delete}/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Testimonials"],
      async onQueryStarted(id, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          if (data) {
            dispatch(
              testimonialQuery.util.updateQueryData(
                "getArchivedTestimonials",
                testimonialCollection,
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
              message: "Successfully Deleted",
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
  useLazyGetTestimonialQuery,
  useLazyGetArchivedTestimonialsQuery,
  useArchiveTestimonialMutation,
  useGetTestimonialQuery,
  useRestoreTestimonialMutation,
  useLazyGetTestimonialsQuery,
  useCreateTestimonialMutation,
  useUpdateTestimonialMutation,
  useDeleteTestimonialMutation,
} = testimonialQuery;
