import { AppError } from "@/src/models/app-interfaces";
import { FAQ } from "@/src/models/faq.model";
import {
  Collection,
  CollectionQuery,
} from "@/src/shared/models/collection.model";
import { collectionQueryBuilder } from "@/src/shared/utitlity/collection-query-builder";
import { appApi } from "@/src/store/app.api";
import { FAQ_ENDPOINT } from "./faq.endpoint";
import { notifications } from "@mantine/notifications";

let faqCollection: CollectionQuery;

export const faqQuery = appApi.injectEndpoints({
  endpoints: (builder) => ({
    getFAQ: builder.query<FAQ, CollectionQuery>({
      query: (data: CollectionQuery) => ({
        url: `${FAQ_ENDPOINT.detail}/${data?.id}`,
        method: "GET",
        params: collectionQueryBuilder(data),
      }),
    }),

    getFAQs: builder.query<Collection<FAQ>, CollectionQuery>({
      query: (data: CollectionQuery) => ({
        url: FAQ_ENDPOINT.list,
        method: "GET",
        params: collectionQueryBuilder(data),
      }),
      providesTags: ["FAQs"],
      async onQueryStarted(param, { queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          if (data) {
            faqCollection = param;
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

    createFAQ: builder.mutation<FAQ, FAQ>({
      query: (newData: FAQ) => ({
        url: `${FAQ_ENDPOINT.create}`,
        method: "POST",
        data: newData,
      }),
      invalidatesTags: ["FAQs"],
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
              faqQuery.util.updateQueryData(
                "getFAQs",
                faqCollection,
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

    updateFAQ: builder.mutation<FAQ, FAQ>({
      query: (newData: FAQ) => ({
        url: `${FAQ_ENDPOINT.update}`,
        method: "PUT",
        data: newData,
      }),
      invalidatesTags: ["FAQs"],
      async onQueryStarted(param, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          if (data) {
            dispatch(
              faqQuery.util.updateQueryData(
                "getFAQs",
                faqCollection,
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
     getArchivedFAQs: builder.query<Collection<FAQ>, CollectionQuery>({
      query: (data: CollectionQuery) => ({
        url: FAQ_ENDPOINT.listArchivedFAQs,
        method: "GET",
        params: collectionQueryBuilder(data),
      }),
      async onQueryStarted(param, { queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          if (data) {
            faqCollection = param;
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
    archiveFAQ: builder.mutation<FAQ, { id: string; remark: string }>({
      query: (data) => ({
        url: `${FAQ_ENDPOINT.archive}`,
        data,
        method: "DELETE",
      }),
      invalidatesTags: ["FAQs"],
      async onQueryStarted(param, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          if (data) {
            dispatch(
              faqQuery.util.updateQueryData(
                "getFAQs",
                faqCollection,
                (draft) => {
                  if (data) {
                    draft.data = draft?.data?.map((FAQ) => {
                      if (FAQ.id === data.id) return data;
                      else {
                        return FAQ;
                      }
                    });
                  }
                }
              )
            );
            dispatch(
              faqQuery.util.updateQueryData(
                "getFAQ",
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
    restoreFAQ: builder.mutation<FAQ, string>({
      query: (id: string) => ({
        url: `${FAQ_ENDPOINT.restore}/${id}`,
        method: "POST",
      }),

      async onQueryStarted(param, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          if (data) {
            dispatch(
              faqQuery.util.updateQueryData(
                "getArchivedFAQs",
                faqCollection,
                (draft) => {
                  if (draft?.data) {
                    draft.data = draft.data.filter(
                      (FAQ) => FAQ.id !== data.id
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
    deleteFAQ: builder.mutation<boolean, string>({
      query: (id: string) => ({
        url: `${FAQ_ENDPOINT.delete}/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["FAQs"],
      async onQueryStarted(id, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          if (data) {
            dispatch(
              faqQuery.util.updateQueryData(
                "getArchivedFAQs",
                faqCollection,
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
  useLazyGetFAQQuery,
  useLazyGetArchivedFAQsQuery,
  useArchiveFAQMutation,
  useGetFAQQuery,
  useRestoreFAQMutation,
  useLazyGetFAQsQuery,
  useCreateFAQMutation,
  useUpdateFAQMutation,
  useDeleteFAQMutation,
} = faqQuery;
