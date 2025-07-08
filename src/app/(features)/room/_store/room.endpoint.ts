export const roomEndpoint = {
  list: `${process.env.NEXT_PUBLIC_APP_API}/rooms/get-rooms`,
  listArchivedRooms: `${process.env.NEXT_PUBLIC_APP_API}/rooms/get-archived-rooms`,
  detail: `${process.env.NEXT_PUBLIC_APP_API}/rooms/get-room`,
};
