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
import { FeedBack } from "@/src/models/feed-back.model";
import { FEEDBACK_ENDPOINT } from "./feed-back.endpoint";

let feedBackCollection: CollectionQuery;
let tenantCollection: CollectionQuery;
let userCollection: CollectionQuery;

export const feedBackQuery = appApi.injectEndpoints({
  endpoints: (builder) => ({
    getFeedBack: builder.query<FeedBack, CollectionQuery>({
      query: (data: CollectionQuery) => ({
        url: `${FEEDBACK_ENDPOINT.detail}/${data?.id}`,
        method: "GET",
        params: collectionQueryBuilder(data),
      }),
    }),

    getFeedBacks: builder.query<Collection<FeedBack>, CollectionQuery>({
      query: (data: CollectionQuery) => ({
        url: FEEDBACK_ENDPOINT.list,
        method: "GET",
        params: collectionQueryBuilder(data),
      }),
      providesTags: ["FeedBacks"],
      async onQueryStarted(param, { queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          if (data) {
            feedBackCollection = param;
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

    createFeedBack: builder.mutation<FeedBack, FeedBack>({
      query: (newData: FeedBack) => ({
        url: `${FEEDBACK_ENDPOINT.create}`,
        method: "POST",
        data: newData,
      }),
      invalidatesTags: ["FeedBacks"],
      async onQueryStarted(param, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          if (data) {
            dispatch(
              feedBackQuery.util.updateQueryData(
                "getFeedBacks",
                feedBackCollection,
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

    updateFeedBack: builder.mutation<FeedBack, FeedBack>({
      query: (newData: FeedBack) => ({
        url: `${FEEDBACK_ENDPOINT.update}`,
        method: "PUT",
        data: newData,
      }),
      invalidatesTags: ["FeedBacks"],
      async onQueryStarted(param, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          if (data) {
            dispatch(
              feedBackQuery.util.updateQueryData(
                "getFeedBacks",
                feedBackCollection,
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
    archiveFeedBack: builder.mutation<FeedBack, any>({
      query: (data: any) => ({
        url: `${FEEDBACK_ENDPOINT.archive}/${data?.id}`,
        method: "DELETE",
      }),

      async onQueryStarted(param, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          if (data) {
            dispatch(
              feedBackQuery.util.updateQueryData(
                "getFeedBacks",
                feedBackCollection,
                (draft) => {
                  if (data) {
                    draft.data = draft?.data?.map((feedBack) => {
                      if (feedBack.id === data.id) return data;
                      else {
                        return feedBack;
                      }
                    });
                  }
                }
              )
            );
            dispatch(
              feedBackQuery.util.updateQueryData(
                "getFeedBack",
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
            message: (error as AppError)?.error?.data?.message
              ? (error as AppError)?.error?.data?.message
              : "Error try again",
            color: "red",
          });
        }
      },
    }),
    restoreFeedBack: builder.mutation<FeedBack, CollectionQuery>({
      query: (data: CollectionQuery) => ({
        url: `${FEEDBACK_ENDPOINT.restore}/${data?.id}`,
        method: "POST",
      }),

      async onQueryStarted(param, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          if (data) {
            dispatch(
              feedBackQuery.util.updateQueryData(
                "getFeedBacks",
                feedBackCollection,
                (draft) => {
                  if (data) {
                    draft.data = draft?.data?.map((feedBack) => {
                      if (feedBack.id === data.id)
                        return { ...data, archivedDate: null };
                      else {
                        return feedBack;
                      }
                    });
                  }
                }
              )
            );
            dispatch(
              feedBackQuery.util.updateQueryData(
                "getFeedBack",
                param,
                (draft) => {
                  if (data) {
                    draft.archivedAt = new Date();
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
            message: (error as AppError)?.error?.data?.message
              ? (error as AppError)?.error?.data?.message
              : "Error try again",
            color: "red",
          });
        }
      },
    }),
    deleteFeedBack: builder.mutation<boolean, string>({
      query: (id: string) => ({
        url: `${FEEDBACK_ENDPOINT.delete}/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["FeedBacks"],
      async onQueryStarted(id, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          if (data) {
            dispatch(
              feedBackQuery.util.updateQueryData(
                "getFeedBacks",
                feedBackCollection,
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
  useLazyGetFeedBackQuery,
  useArchiveFeedBackMutation,
  useGetFeedBackQuery,
  useRestoreFeedBackMutation,
  useLazyGetFeedBacksQuery,
  useCreateFeedBackMutation,
  useUpdateFeedBackMutation,
  useDeleteFeedBackMutation,
} = feedBackQuery;
