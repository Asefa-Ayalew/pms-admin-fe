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
  })
});

export const {
  useLazyGetRoomQuery,
  useGetRoomQuery,
  useGetArchivedRoomsQuery,
  useLazyGetArchivedRoomsQuery,
  useLazyGetRoomsQuery,
} = roomQuery;
