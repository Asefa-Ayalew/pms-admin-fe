export const roomEndpoint = {
  list: `${process.env.NEXT_PUBLIC_APP_API}/rooms/get-rooms`,
  listArchivedRooms: `${process.env.NEXT_PUBLIC_APP_API}/rooms/get-archived-rooms`,
  create: `${process.env.NEXT_PUBLIC_APP_API}/rooms/create-room`,
  detail: `${process.env.NEXT_PUBLIC_APP_API}/rooms/get-room`,
  update: `${process.env.NEXT_PUBLIC_APP_API}/rooms/update-room`,
  delete: `${process.env.NEXT_PUBLIC_APP_API}/rooms/delete-room`,
  archive: `${process.env.NEXT_PUBLIC_APP_API}/rooms/archive-room`,
  restore: `${process.env.NEXT_PUBLIC_APP_API}/rooms/restore-room`,
};
