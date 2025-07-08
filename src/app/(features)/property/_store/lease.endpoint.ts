export const LeaseEndpoint = {
  list: `${process.env.NEXT_PUBLIC_APP_API}/leases/get-Leases`,
  listArchivedLeases: `${process.env.NEXT_PUBLIC_APP_API}/leases/get-archived-Leases`,
  create: `${process.env.NEXT_PUBLIC_APP_API}/leases/create-Lease`,
  detail: `${process.env.NEXT_PUBLIC_APP_API}/leases/get-Lease`,
  update: `${process.env.NEXT_PUBLIC_APP_API}/leases/update-Lease`,
  delete: `${process.env.NEXT_PUBLIC_APP_API}/leases/delete-Lease`,
  archive: `${process.env.NEXT_PUBLIC_APP_API}/leases/archive-Lease`,
  restore: `${process.env.NEXT_PUBLIC_APP_API}/leases/restore-Lease`,
};
