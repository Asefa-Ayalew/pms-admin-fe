export const ROLE_ENDPOINT = {
  list: `${process.env.NEXT_PUBLIC_APP_API}/roles/get-roles`,
  create: `${process.env.NEXT_PUBLIC_APP_API}/roles/create-role`,
  detail: `${process.env.NEXT_PUBLIC_APP_API}/roles/get-role`,
  update: `${process.env.NEXT_PUBLIC_APP_API}/roles/update-role`,
  switch: `${process.env.NEXT_PUBLIC_APP_API}/auth/switch-role`,
  delete: `${process.env.NEXT_PUBLIC_APP_API}/roles/delete-role`,
  archive: `${process.env.NEXT_PUBLIC_APP_API}/roles/archive-role`,
  restore: `${process.env.NEXT_PUBLIC_APP_API}/roles/restore-role`,
  getUsersByRole: `${process.env.NEXT_PUBLIC_APP_API}/users/get-users-by-role`,
};
