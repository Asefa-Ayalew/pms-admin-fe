
import {
  Collection,
  CollectionQuery,
} from "@/src/shared/models/collection.model";
import { collectionQueryBuilder } from "@/src/shared/utitlity/collection-query-builder";
import { appApi } from "@/src/store/app.api";
import { notifications } from "@mantine/notifications";
import { AppError } from "@/src/models/app-interfaces";
import { Feedback } from "@/src/models/feed-back.model";
import { FEEDBACK_ENDPOINT } from "./feed-back.endpoint";

let feedbackCollection: CollectionQuery;
export const feedbackQuery = appApi.injectEndpoints({
  endpoints: (builder) => ({
    getFeedback: builder.query<Feedback, CollectionQuery>({
      query: (data: CollectionQuery) => ({
        url: `${FEEDBACK_ENDPOINT.detail}/${data?.id}`,
        method: "GET",
        params: collectionQueryBuilder(data),
      }),
    }),

    getFeedbacks: builder.query<Collection<Feedback>, CollectionQuery>({
      query: (data: CollectionQuery) => ({
        url: FEEDBACK_ENDPOINT.list,
        method: "GET",
        params: collectionQueryBuilder(data),
      }),
      providesTags: ["Feedbacks"],
      async onQueryStarted(param, { queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          if (data) {
            feedbackCollection = param;
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

    createFeedback: builder.mutation<Feedback, Feedback>({
      query: (newData: Feedback) => ({
        url: `${FEEDBACK_ENDPOINT.create}`,
        method: "POST",
        data: newData,
      }),
      invalidatesTags: ["Feedbacks"],
      async onQueryStarted(param, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          if (data) {
            dispatch(
              feedbackQuery.util.updateQueryData(
                "getFeedbacks",
                feedbackCollection,
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

    updateFeedback: builder.mutation<Feedback, Feedback>({
      query: (newData: Feedback) => ({
        url: `${FEEDBACK_ENDPOINT.update}`,
        method: "PUT",
        data: newData,
      }),
      invalidatesTags: ["Feedbacks"],
      async onQueryStarted(param, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          if (data) {
            dispatch(
              feedbackQuery.util.updateQueryData(
                "getFeedbacks",
                feedbackCollection,
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
 getArchivedFeedbacks: builder.query<Collection<Feedback>, CollectionQuery>({
      query: (data: CollectionQuery) => ({
        url: FEEDBACK_ENDPOINT.listArchivedFeedbacks,
        method: "GET",
        params: collectionQueryBuilder(data),
      }),
      async onQueryStarted(param, { queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          if (data) {
            feedbackCollection = param;
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
    archiveFeedback: builder.mutation<Feedback, { id: string; remark: string }>({
      query: (data) => ({
        url: `${FEEDBACK_ENDPOINT.archive}`,
        data,
        method: "DELETE",
      }),
      invalidatesTags: ["Feedbacks"],
      async onQueryStarted(param, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          if (data) {
            dispatch(
              feedbackQuery.util.updateQueryData(
                "getFeedbacks",
                feedbackCollection,
                (draft) => {
                  if (data) {
                    draft.data = draft?.data?.map((feedback) => {
                      if (feedback.id === data.id) return data;
                      else {
                        return feedback;
                      }
                    });
                  }
                }
              )
            );
            dispatch(
              feedbackQuery.util.updateQueryData(
                "getFeedback",
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
    restoreFeedback: builder.mutation<Feedback, string>({
      query: (id: string) => ({
        url: `${FEEDBACK_ENDPOINT.restore}/${id}`,
        method: "POST",
      }),

      async onQueryStarted(param, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          if (data) {
            dispatch(
              feedbackQuery.util.updateQueryData(
                "getArchivedFeedbacks",
                feedbackCollection,
                (draft) => {
                  if (draft?.data) {
                    draft.data = draft.data.filter(
                      (feedback) => feedback.id !== data.id
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
    deleteFeedback: builder.mutation<boolean, string>({
      query: (id: string) => ({
        url: `${FEEDBACK_ENDPOINT.delete}/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Feedbacks"],
      async onQueryStarted(id, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          if (data) {
            dispatch(
              feedbackQuery.util.updateQueryData(
                "getArchivedFeedbacks",
                feedbackCollection,
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
  useLazyGetFeedbackQuery,
  useLazyGetArchivedFeedbacksQuery,
  useArchiveFeedbackMutation,
  useGetFeedbackQuery,
  useRestoreFeedbackMutation,
  useLazyGetFeedbacksQuery,
  useCreateFeedbackMutation,
  useUpdateFeedbackMutation,
  useDeleteFeedbackMutation,
} = feedbackQuery;
