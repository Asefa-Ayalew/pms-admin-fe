import { AppError } from "@/src/models/app-interfaces";
import { Room } from "@/src/models/room.model";
import {
  Collection,
  CollectionQuery,
} from "@/src/shared/models/collection.model";
import { collectionQueryBuilder } from "@/src/shared/utitlity/collection-query-builder";
import { appApi } from "@/src/store/app.api";
import { roomEndpoint } from "./room.endpoint";
import { notifications } from "@mantine/notifications";

let roomCollection: CollectionQuery;

export const roomQuery = appApi.injectEndpoints({
  endpoints: (builder) => ({
    getRooms: builder.query<Collection<Room>, CollectionQuery>({
      query: (data: CollectionQuery) => ({
        url: roomEndpoint.list,
        method: "GET",
        params: collectionQueryBuilder(data),
      }),
      providesTags: ["Rooms"],
      async onQueryStarted(param, { queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          if (data) {
            roomCollection = param;
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
    getRoom: builder.query<Room, CollectionQuery>({
      query: (data: CollectionQuery) => ({
        url: `${roomEndpoint.detail}/${data?.id}`,
        method: "GET",
        params: collectionQueryBuilder(data),
      }),
    }),

    createRoom: builder.mutation<Room, Room>({
      query: (newData: Room) => ({
        url: roomEndpoint.create,
        method: "POST",
        data: newData,
      }),

      async onQueryStarted(param, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          if (data) {
            dispatch(
              roomQuery.util.updateQueryData(
                "getRooms",
                roomCollection,
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

    updateRoom: builder.mutation<Room, Room>({
      query: (newData: Room) => ({
        url: `${roomEndpoint.update}`,
        method: "POST",
        data: newData,
      }),
      invalidatesTags: ["Rooms"],
      async onQueryStarted(param, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          if (data) {
            dispatch(
              roomQuery.util.updateQueryData(
                "getRooms",
                roomCollection,
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
    getArchivedRooms: builder.query<Collection<Room>, CollectionQuery>({
      query: (data: CollectionQuery) => ({
        url: roomEndpoint.listArchivedRooms,
        method: "GET",
        params: collectionQueryBuilder(data),
      }),
      async onQueryStarted(param, { queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          if (data) {
            roomCollection = param;
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
    archiveRoom: builder.mutation<Room, { id: string; remark: string }>({
      query: (data) => ({
        url: `${roomEndpoint.archive}`,
        data,
        method: "DELETE",
      }),
      invalidatesTags: ["Rooms"],
      async onQueryStarted(param, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          if (data) {
            dispatch(
              roomQuery.util.updateQueryData(
                "getRooms",
                roomCollection,
                (draft) => {
                  if (data) {
                    draft.data = draft?.data?.map((room) => {
                      if (room.id === data.id) return data;
                      else {
                        return room;
                      }
                    });
                  }
                }
              )
            );
            dispatch(
              roomQuery.util.updateQueryData("getRoom", param, (draft) => {
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
              (error as AppError)?.error?.data?.message || "Error, try again",
            color: "red",
          });
        }
      },
    }),
    restoreRoom: builder.mutation<Room, string>({
      query: (id: string) => ({
        url: `${roomEndpoint.restore}/${id}`,
        method: "POST",
      }),

      async onQueryStarted(param, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          if (data) {
            dispatch(
              roomQuery.util.updateQueryData(
                "getRooms",
                roomCollection,
                (draft) => {
                  if (data) {
                    draft.data = draft?.data?.map((room) => {
                      if (room.id === data.id)
                        return { ...data, archivedDate: null };
                      else {
                        return room;
                      }
                    });
                  }
                }
              )
            );
            // dispatch(
            //   roomQuery.util.updateQueryData("getRoom", param, (draft) => {
            //     if (data) {
            //       console.log(data);
            //     }
            //   })
            // );
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
    deleteRoom: builder.mutation<boolean, string>({
      query: (id: string) => ({
        url: `${roomEndpoint.delete}/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Rooms"],
      async onQueryStarted(id, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          if (data) {
            dispatch(
              roomQuery.util.updateQueryData(
                "getRooms",
                roomCollection,
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
  useLazyGetRoomQuery,
  useArchiveRoomMutation,
  useGetRoomQuery,
  useGetArchivedRoomsQuery,
  useLazyGetArchivedRoomsQuery,
  useRestoreRoomMutation,
  useLazyGetRoomsQuery,
  useCreateRoomMutation,
  useUpdateRoomMutation,
  useDeleteRoomMutation,
} = roomQuery;
